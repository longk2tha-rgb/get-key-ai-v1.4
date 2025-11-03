import React, { useState, useEffect, useRef } from 'react';
import type { User, Service } from '../data/types';
import { services } from '../data/services';

// --- ICONS ---

const UserIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const ArrowRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const LaptopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.28 20H3.72a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
);

// --- COMPONENTS ---

interface MainPageProps {
  user: User;
  onLogout: () => void;
}

interface ServiceCardProps { 
    service: Service; 
    onSelect: () => void; 
    isActivated: boolean 
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, isActivated }) => {
  const isAvailable = service.status === 'available';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>('idle');

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!service.keyData) return;
    
    navigator.clipboard.writeText(service.keyData).then(() => {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
    }).catch(err => {
        console.error("Failed to copy key:", err);
        setCopyStatus('failed');
        setTimeout(() => setCopyStatus('idle'), 2000);
    });
  };

  const getCopyButtonText = () => {
    switch (copyStatus) {
      case 'copied':
        return 'Đã sao chép!';
      case 'failed':
        return 'Sao chép lỗi!';
      default:
        return 'Sao chép Key';
    }
  };
  
  const cardContainerClasses = `relative group transform transition-all duration-300 rounded-2xl overflow-hidden p-[2px] ${
    isAvailable && !isActivated
      ? 'cursor-pointer hover:-translate-y-1'
      : isAvailable && isActivated
      ? 'cursor-default'
      : 'bg-slate-800/50 cursor-not-allowed opacity-60'
  }`;
  
  return (
    <div
      onClick={isAvailable && !isActivated ? onSelect : undefined}
      className={cardContainerClasses}
    >
      {isAvailable && (
        <div className="animated-led-bg" style={{ '--glow-color': service.glowColor } as React.CSSProperties}></div>
      )}
      <div className="relative bg-slate-800 rounded-[14px] p-6 h-full flex flex-col justify-between">
        <div>
          {!isAvailable && (
            <span className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full z-20">
              Sắp ra mắt
            </span>
          )}
          <h3 className="text-xl font-bold animated-text-gradient pr-16">{service.name}</h3>
        </div>
        
        <div className="mt-4">
          {isAvailable ? (
            isActivated ? (
              <div className="flex flex-col items-start gap-2">
                <p className="text-sm font-semibold text-green-400">Lấy key thành công</p>
                <div className="flex w-full gap-2">
                  <button
                    onClick={handleCopy}
                    className={`flex-1 text-sm font-semibold py-2 px-3 rounded-md transition-colors text-white ${
                        copyStatus === 'failed' ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-500'
                    }`}
                  >
                    {getCopyButtonText()}
                  </button>
                  {service.url && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            window.open(service.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex-1 text-sm font-semibold py-2 px-3 rounded-md transition-colors text-white bg-slate-600 hover:bg-slate-500"
                    >
                        Truy cập web
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="font-semibold flex items-center animated-text-gradient">
                <span>Lấy Key</span>
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </div>
            )
          ) : (
            <div></div> // Placeholder
          )}
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC<MainPageProps> = ({ user, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activatedServices, setActivatedServices] = useState<Set<string>>(new Set());
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleActivateService = (serviceName: string) => {
    setActivatedServices(prev => new Set(prev).add(serviceName));
  };

  return (
    <div className="flex flex-col h-screen animated-gradient-main">
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 shadow-lg p-4 flex justify-between items-center z-20 flex-shrink-0">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          GET KEY AI
        </div>
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-full bg-slate-800 hover:bg-slate-700 transition"
            aria-haspopup="true"
            aria-expanded={isProfileOpen}
          >
            <UserIcon className="w-6 h-6 text-slate-300" />
            <span className="hidden md:block text-slate-300 font-medium">{user.name.split(' ').pop()}</span>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl origin-top-right transform transition-all duration-200 ease-out scale-95 opacity-0 animate-scale-in">
              <div className="p-4 border-b border-slate-700">
                <p className="font-bold text-white truncate">{user.name}</p>
                <p className="text-sm text-slate-400">Trang cá nhân</p>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Mã code</p>
                  <p className="text-slate-200 font-mono bg-slate-900 p-2 rounded">{user.code}</p>
                </div>
                <div>
                  <p className="text-slate-500">Ngày hết hạn</p>
                  <p className="text-slate-200">{user.expiryDate}</p>
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={onLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                >
                  <LogoutIcon className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto mb-8">
            <a 
                href="https://drive.google.com/file/d/1qSCc94KRNgOhhPv3CeL2t8WqJWQ-15sz/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 inline-flex items-center gap-4 text-slate-300 hover:bg-slate-700/50 hover:border-blue-500 hover:text-white transition-all duration-300 group shadow-lg"
            >
                <LaptopIcon className="w-8 h-8 text-blue-400 flex-shrink-0 transition-transform group-hover:scale-110" />
                <div className="flex flex-col">
                    <span className="font-semibold">Video Hướng Dẫn Sử Dụng</span>
                    <span className="text-xs text-slate-400">Chưa hỗ trợ trên Điện thoại</span>
                </div>
            </a>
          </div>

          <div className="text-center mb-8 md:mb-12 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-200 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  Chào mừng trở lại,
              </h1>
              <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mt-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  {user.name.split(' ').slice(0, 2).join(' ')}!
              </h2>
              <p className="mt-4 text-lg text-slate-400 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                  Hãy khám phá thế giới AI đỉnh cao với các dịch vụ hàng đầu.
              </p>
          </div>
          
          <div className="w-full max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="ticker-wrap">
              <div className="ticker-move">
                <div className="ticker-item">Chat GPT Plus</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Gemini Ultra</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Veo 3 Ultra</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Perplexity Pro</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Chat GPT Plus</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Gemini Ultra</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Veo 3 Ultra</div><div className="ticker-item-separator">✨</div>
                <div className="ticker-item">Perplexity Pro</div><div className="ticker-item-separator">✨</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {services.map((service) => (
                  <ServiceCard 
                    key={service.name} 
                    service={service} 
                    onSelect={() => handleActivateService(service.name)}
                    isActivated={activatedServices.has(service.name)}
                  />
              ))}
          </div>
      </main>

      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(-10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-scale-in {
          transform-origin: top right;
          animation: scale-in 0.1s ease-out forwards;
        }
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient-main {
          background: linear-gradient(-45deg, #020617, #0f172a, #1e40af, #3730a3);
          background-size: 400% 400%;
          animation: gradient-animation 20s ease infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0; /* Start hidden */
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .ticker-wrap {
            width: 100%;
            overflow: hidden;
            padding: 10px 0;
            background: rgba(0,0,0,0.2);
            border-radius: 10px;
            -webkit-mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
            mask-image: linear-gradient(to right, transparent, white 20%, white 80%, transparent);
        }
        .ticker-move {
            display: flex;
            align-items: center;
            white-space: nowrap;
            animation: marquee 30s linear infinite;
            width: max-content;
        }
        .ticker-item {
            font-size: 1.1rem;
            font-weight: 600;
            color: #a5b4fc; /* indigo-300 */
            padding: 0 2rem;
        }
        .ticker-item-separator {
            color: #f87171; /* red-400 */
            font-size: 1.2rem;
        }
        @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        
        .animated-led-bg {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          z-index: 0;
          background: conic-gradient(
              from 180deg at 50% 50%,
              rgba(var(--glow-color), 0) 0deg,
              rgba(var(--glow-color), 0.8) 30deg,
              rgba(var(--glow-color), 0) 60deg,
              transparent 360deg
          );
          transform: translate(-50%, -50%);
          animation: rotate-led 4s linear infinite;
        }

        @keyframes rotate-led {
            from { transform: translate(-50%, -50%) rotate(0deg); }
            to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes text-gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-text-gradient {
          background: linear-gradient(-45deg, #60a5fa, #c084fc, #f472b6, #34d399);
          background-size: 300% 300%;
          animation: text-gradient-animation 6s ease infinite;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default MainPage;