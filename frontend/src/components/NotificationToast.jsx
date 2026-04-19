import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiInfo, FiAlertTriangle, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const NotificationToast = ({ notification, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const getNotificationStyle = (type) => {
        switch (type) {
            case 'success':
                return {
                    icon: <FiCheckCircle className="text-green-400" />,
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/20',
                    textColor: 'text-green-400'
                };
            case 'error':
                return {
                    icon: <FiXCircle className="text-red-400" />,
                    bgColor: 'bg-red-500/10',
                    borderColor: 'border-red-500/20',
                    textColor: 'text-red-400'
                };
            case 'warning':
                return {
                    icon: <FiAlertTriangle className="text-yellow-400" />,
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/20',
                    textColor: 'text-yellow-400'
                };
            default:
                return {
                    icon: <FiInfo className="text-blue-400" />,
                    bgColor: 'bg-blue-500/10',
                    borderColor: 'border-blue-500/20',
                    textColor: 'text-blue-400'
                };
        }
    };

    const style = getNotificationStyle(notification.type);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 300, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 300, scale: 0.8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className={`fixed top-4 right-4 z-50 w-80 ${style.bgColor} border ${style.borderColor} rounded-xl shadow-xl backdrop-blur-sm`}
                >
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {style.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-semibold text-white mb-1">
                                    {notification.title}
                                </h4>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    {notification.message}
                                </p>
                                {notification.timestamp && (
                                    <p className="text-xs text-slate-500 mt-2">
                                        {new Date(notification.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setIsVisible(false);
                                    setTimeout(onClose, 300);
                                }}
                                className="flex-shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <FiX className="text-slate-400 hover:text-white text-sm" />
                            </button>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 bg-slate-700 rounded-full h-1 overflow-hidden">
                            <motion.div
                                initial={{ width: '100%' }}
                                animate={{ width: '0%' }}
                                transition={{ duration: 5, ease: 'linear' }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// Notification Manager Component
export const NotificationManager = () => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Listen for real-time notifications via Socket.io
        // This would be implemented with the socket connection
        const handleNewNotification = (notification) => {
            const uniqueId = notification.id
                ? `${notification.id}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
                : `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

            const newNotification = {
                ...notification,
                id: uniqueId,
                timestamp: notification.timestamp || new Date()
            };

            setNotifications(prev => {
                if (prev.some(n => n.id === newNotification.id)) {
                    return prev;
                }
                return [newNotification, ...prev];
            });

            toast(notification.message, {
                type: notification.type || 'info',
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        };

        // Mock notifications for demo
        const mockNotifications = [
            {
                id: 1,
                type: 'success',
                title: 'Booking Confirmed',
                message: 'Your AC repair service has been confirmed. Captain John will arrive in 30 minutes.',
                timestamp: new Date()
            },
            {
                id: 2,
                type: 'info',
                title: 'Captain Update',
                message: 'Captain John is 5 minutes away from your location.',
                timestamp: new Date(Date.now() - 10000)
            },
            {
                id: 3,
                title: 'Payment Successful',
                message: 'Payment of ₹500 has been processed successfully.',
                timestamp: new Date(Date.now() - 20000)
            }
        ];

        // Add mock notifications after a delay
        setTimeout(() => {
            mockNotifications.forEach(notification => {
                setTimeout(() => handleNewNotification(notification), Math.random() * 3000);
            });
        }, 2000);

        // In real implementation, you would set up socket listeners here
        // socket.on('notification', handleNewNotification);

        return () => {
            // socket.off('notification', handleNewNotification);
        };
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="fixed top-4 right-4 z-40 space-y-2">
            {notifications.map((notification) => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onClose={() => removeNotification(notification.id)}
                />
            ))}
        </div>
    );
};

export default NotificationToast;