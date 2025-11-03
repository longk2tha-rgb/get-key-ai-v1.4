import React, { useState, useEffect, useCallback } from 'react';

interface LoginPageProps {
  onLogin: (name: string, code: string) => string | null;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showFreeTrial, setShowFreeTrial] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const [freeTrialUses, setFreeTrialUses] = useState<number>(() => {
    const savedUses = localStorage.getItem('freeTrialUses');
    if (savedUses !== null) {
      const uses = parseInt(savedUses, 10);
      return isNaN(uses) ? 5 : uses;
    }
    return 5;
  });

  useEffect(() => {
    localStorage.setItem('freeTrialUses', freeTrialUses.toString());
  }, [freeTrialUses]);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const loginError = onLogin(name, code);
      if (loginError) {
        setError(loginError);
      }
      setIsLoading(false);
    }, 500);
  }, [name, code, onLogin]);

  const handleCopy = useCallback((text: string, field: 'name' | 'code') => {
    navigator.clipboard.writeText(text).then(() => {
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    });
  }, []);

  const handleToggleFreeTrial = useCallback(() => {
    // Only decrement if we are about to show the trial info
    // and there are uses left. This counts as one "use".
    if (!showFreeTrial && freeTrialUses > 0) {
      setFreeTrialUses((prevUses) => prevUses - 1);
    }
    setShowFreeTrial((prevShow) => !prevShow);
  }, [showFreeTrial, freeTrialUses]);

  const handlePurchaseClick = useCallback(() => {
    window.open(
        'https://docs.google.com/forms/d/e/1FAIpQLSeSq8HczGcL5hJGZrtvqDSNMgSuHUrhGt0pL_4oz4jJMi84-g/viewform?usp=publish-editor',
        '_blank',
        'noopener,noreferrer'
    );
  }, []);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen animated-gradient p-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  GET KEY AI
              </h1>
              <p className="text-slate-400 mt-2">Đăng nhập để tiếp tục</p>
          </div>
          
          <div className="relative z-10 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl shadow-blue-500/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                  Họ và tên
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-slate-300 mb-2">
                  Mã code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
                  placeholder="Nhập mã code"
                />
              </div>

              {error && (
                <p className="text-sm text-red-400 bg-red-900/50 p-3 rounded-lg text-center">{error}</p>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : 'Đăng nhập'}
                </button>
              </div>
            </form>
            <div className="text-center mt-6 space-y-2">
              <button
                onClick={handlePurchaseClick}
                className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300"
              >
                Gia hạn/Mua code
              </button>
              <button
                onClick={handleToggleFreeTrial}
                disabled={freeTrialUses === 0 && !showFreeTrial}
                className="block mx-auto text-sm font-medium text-green-400 hover:text-green-300 transition-colors duration-300 disabled:text-slate-500 disabled:cursor-not-allowed"
              >
                Trải nghiệm Miễn phí ({freeTrialUses} lượt)
              </button>
            </div>
            {showFreeTrial && freeTrialUses > 0 && (
                <div className="mt-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-center space-y-3 animate-fade-in-down">
                    <p className="text-sm text-slate-300">Sử dụng tài khoản dưới đây để đăng nhập:</p>
                    <div className="space-y-2 text-left">
                        <div className="flex items-center justify-between p-2 rounded-md bg-slate-800">
                            <span className="text-slate-400 text-sm">Tài khoản: <strong className="text-white font-mono">FREETRAINGHIEM</strong></span>
                            <button onClick={() => handleCopy('FREETRAINGHIEM', 'name')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                {copiedField === 'name' ? 'Đã chép' : 'Chép'}
                            </button>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-md bg-slate-800">
                           <span className="text-slate-400 text-sm">Mã Code: <strong className="text-white font-mono">FREE1234</strong></span>
                            <button onClick={() => handleCopy('FREE1234', 'code')} className="text-xs bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1 px-3 rounded-md transition-colors">
                                {copiedField === 'code' ? 'Đã chép' : 'Chép'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showFreeTrial && freeTrialUses === 0 && (
                 <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg text-center space-y-2 animate-fade-in-down">
                    <p className="font-semibold text-yellow-300">Hết lượt trải nghiệm</p>
                    <p className="text-sm text-slate-300">Bạn đã sử dụng hết 5 lượt miễn phí.</p>
                 </div>
            )}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-gradient {
          background: linear-gradient(-45deg, #0f172a, #000000, #1e3a8a, #3730a3);
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.3s ease-out forwards; }
      `}</style>
    </>
  );
};

export default LoginPage;