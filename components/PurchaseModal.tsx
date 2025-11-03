import React from 'react';

interface PurchaseModalProps {
  onClose: () => void;
}

const PurchaseModal: React.FC<PurchaseModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl shadow-blue-500/20 w-full max-w-2xl mx-auto transform transition-all duration-300 animate-scale-in flex flex-col"
        style={{ height: '90vh', maxHeight: '800px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 md:p-6 flex-shrink-0 flex justify-between items-center border-b border-slate-700">
            <h2 className="text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Đăng Ký / Gia Hạn
            </h2>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
        </div>

        <div className="flex-grow overflow-hidden rounded-b-2xl bg-white">
            <iframe
                className="w-full h-full border-0"
                src="https://docs.google.com/forms/d/e/1FAIpQLSeSq8HczGcL5hJGZrtvqDSNMgSuHUrhGt0pL_4oz4jJMi84-g/viewform?embedded=true"
                title="Đăng Ký / Gia Hạn Dịch Vụ"
                sandbox="allow-scripts allow-forms allow-same-origin"
            >
                Đang tải...
            </iframe>
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default PurchaseModal;