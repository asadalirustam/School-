import React, { createContext, useState, useContext, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = useCallback((message, type = 'success') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);

    // Auto-remove notification after 4 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => removeNotification(n.id)}
            className={`cursor-pointer px-4 py-3 rounded-lg shadow-xl border flex justify-between items-center text-white transition-all duration-300 animate-slide-in ${
              n.type === 'error'
                ? 'bg-rose-500 border-rose-600'
                : n.type === 'warning'
                ? 'bg-amber-500 border-amber-600'
                : 'bg-emerald-500 border-emerald-600'
            }`}
          >
            <p className="text-sm font-medium pr-4">{n.message}</p>
            <button className="text-white hover:text-slate-200 text-xs font-bold">&times;</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
