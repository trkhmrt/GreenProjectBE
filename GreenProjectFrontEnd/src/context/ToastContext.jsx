import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts(ts => ts.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    setToasts(ts => [...ts, { ...toast, id, closing: false }]);
    setTimeout(() => {
      setToasts(ts => ts.map(t => t.id === id ? { ...t, closing: true } : t));
      setTimeout(() => removeToast(id), 500); // animasyon süresi
    }, toast.duration || 4000);
  }, [removeToast]);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail && e.detail.message) addToast(e.detail);
    };
    window.addEventListener('toast', handler);
    return () => window.removeEventListener('toast', handler);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext); 