import React, { createContext, useContext, useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  removeNotification: (id: string) => void;
  getUnreadCount: (userId: string) => number;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<Array<Notification & { show: boolean }>>([]);

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Also show as toast
    showToast(notificationData.type, notificationData.title, notificationData.message);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getUnreadCount = (userId: string) => {
    return notifications.filter(notification => 
      notification.userId === userId && !notification.read
    ).length;
  };

  const showToast = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    const toast = {
      id: Date.now().toString(),
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      userId: '',
      show: true
    };

    setToasts(prev => [...prev, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      markAsRead,
      removeNotification,
      getUnreadCount,
      showToast
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map(toast => {
          const Icon = toast.type === 'success' ? CheckCircle : 
                      toast.type === 'error' ? AlertCircle : 
                      toast.type === 'warning' ? AlertCircle : Info;
          
          const bgColor = toast.type === 'success' ? 'bg-green-500' : 
                         toast.type === 'error' ? 'bg-red-500' : 
                         toast.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';

          return (
            <div
              key={toast.id}
              className={`${bgColor} text-white p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
                toast.show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <div className="flex items-start">
                <Icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium">{toast.title}</h4>
                  <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="ml-2 text-white hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}