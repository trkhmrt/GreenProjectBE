import React from 'react';
import { useToast } from '../context/ToastContext';

const typeStyles = {
  success: 'border-green-400 bg-green-50 text-green-800',
  error: 'border-red-400 bg-red-50 text-red-800',
  info: 'border-gray-300 bg-white text-gray-800',
};

const stackStyles = [
  'z-30 scale-105 shadow-2xl translate-y-0 opacity-100 animate-slide-in-down py-3', // en yeni
  'z-20 scale-97 shadow-lg translate-y-6 opacity-90 py-2.5',    // 2. toast
  'z-10 scale-90 shadow translate-y-12 opacity-80 py-1.5',      // 3. toast (en kısa)
];

const Toaster = () => {
  const { toasts } = useToast();
  const visibleToasts = toasts.slice(-3).reverse(); // en yeni en üstte
  return (
    <>
      <div className="fixed right-6 bottom-6 z-50" style={{ width: 340, height: 200 }}>
        <div className="relative w-full h-full" style={{ minHeight: 120 }}>
          {visibleToasts.map((toast, idx) => (
            <div
              key={toast.id}
              className={`absolute right-0 left-0 transition-all duration-500 ease-in-out
                ${toast.closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                ${stackStyles[idx] || ''} min-w-[240px] max-w-xs px-5 rounded-xl border ${typeStyles[toast.type] || typeStyles.info}`}
              style={{ pointerEvents: idx === 0 ? 'auto' : 'none' }}
            >
              <div className="font-semibold text-sm mb-1">{toast.message || 'İşlem başarılı'}</div>
              {toast.detail && <div className="text-xs text-gray-500">{toast.detail}</div>}
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes slide-in-down {
          0% { transform: translateY(-40px) scale(1.1); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .animate-slide-in-down {
          animation: slide-in-down 0.5s cubic-bezier(0.4,0,0.2,1);
        }
      `}</style>
    </>
  );
};

export default Toaster; 