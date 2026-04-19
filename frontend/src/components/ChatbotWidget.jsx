import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageSquare, FiSend, FiX, FiUser, FiCpu } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { toast } from 'react-toastify';

const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your AI assistant. I can help you book services. Try saying something like 'Book AC repair tomorrow' or 'I need plumbing help'",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useSelector(state => state.auth);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const processAIRequest = async (message, currentMessages) => {
        try {
            // Send request to our AI endpoint
            const { data } = await api.post('/ai/chat', { 
                message, 
                history: currentMessages 
            });
            return data.text;
        } catch (error) {
            console.error('AI Request failed:', error);
            if (error.response?.data?.message) {
                return error.response.data.message;
            }
            return "I'm having trouble connecting to my brain right now. Please try again later or contact support.";
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputMessage('');
        setIsTyping(true);

        try {
            // Process AI response
            const aiResponse = await processAIRequest(inputMessage, updatedMessages);

            setTimeout(() => {
                const botMessage = {
                    id: Date.now() + 1,
                    text: aiResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                setIsTyping(false);
            }, 1000 + Math.random() * 1000); // Simulate typing delay

        } catch (error) {
            setTimeout(() => {
                const errorMessage = {
                    id: Date.now() + 1,
                    text: "Sorry, I'm having trouble processing your request. Please try again or contact support.",
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, errorMessage]);
                setIsTyping(false);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Chat Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] z-50"
            >
                <FiMessageSquare className="text-white text-xl" />
            </motion.button>

            {/* Chat Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-end p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-sm h-[500px] flex flex-col shadow-2xl"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                        <FiCpu className="text-white text-sm" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">AI Assistant</h3>
                                        <p className="text-slate-400 text-xs">Online</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <FiX className="text-slate-400 hover:text-white" />
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        {message.sender === 'bot' && (
                                            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FiCpu className="text-white text-xs" />
                                            </div>
                                        )}
                                        <div className={`max-w-[70%] ${message.sender === 'user' ? 'order-1' : 'order-2'}`}>
                                            <div className={`px-3 py-2 rounded-2xl text-sm ${message.sender === 'user'
                                                ? 'bg-indigo-500 text-white'
                                                : 'bg-slate-800 text-slate-300'
                                                }`}>
                                                {message.text}
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                        {message.sender === 'user' && (
                                            <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <FiUser className="text-white text-xs" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex gap-3 justify-start"
                                    >
                                        <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <FiCpu className="text-white text-xs" />
                                        </div>
                                        <div className="bg-slate-800 px-3 py-2 rounded-2xl">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-4 border-t border-white/10">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me to book a service..."
                                        className="flex-1 px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim()}
                                        className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                                    >
                                        <FiSend className="text-sm" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatbotWidget;