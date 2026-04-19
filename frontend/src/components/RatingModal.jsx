import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiStar, FiX, FiUser } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';

const RatingModal = ({ booking, isOpen, onClose, onRatingSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitRating = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post(`/bookings/${booking._id}/rate`, {
                rating,
                review: review.trim() || null
            });

            toast.success('Thank you for your feedback!');
            onRatingSubmitted && onRatingSubmitted();
            onClose();
        } catch (error) {
            toast.error('Failed to submit rating. Please try again.');
            console.error('Rating submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetModal = () => {
        setRating(0);
        setHoverRating(0);
        setReview('');
    };

    const handleClose = () => {
        resetModal();
        onClose();
    };

    if (!booking) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-md shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="text-xl font-bold text-white">Rate Your Experience</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <FiX className="text-slate-400 hover:text-white" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Service Info */}
                            <div className="bg-slate-800/50 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                                        <FiUser className="text-slate-300" />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{booking.captain?.name || 'Service Provider'}</p>
                                        <p className="text-slate-400 text-sm">{typeof booking.service === 'object' ? booking.service?.name : booking.service}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-400">Date:</span>
                                    <span className="text-white">
                                        {new Date(booking.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm mt-1">
                                    <span className="text-slate-400">Amount:</span>
                                    <span className="text-white">₹{booking.price}</span>
                                </div>
                            </div>

                            {/* Rating Stars */}
                            <div className="text-center space-y-4">
                                <p className="text-slate-300">How was your experience?</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="focus:outline-none"
                                        >
                                            <FiStar
                                                className={`text-2xl transition-colors ${star <= (hoverRating || rating)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-slate-600'
                                                    }`}
                                            />
                                        </motion.button>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500">
                                    {rating === 0 ? 'Tap to rate' :
                                        rating === 1 ? 'Poor' :
                                            rating === 2 ? 'Fair' :
                                                rating === 3 ? 'Good' :
                                                    rating === 4 ? 'Very Good' :
                                                        'Excellent'}
                                </p>
                            </div>

                            {/* Review Text */}
                            <div className="space-y-2">
                                <label className="text-sm text-slate-300">Share your feedback (optional)</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="Tell us about your experience..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                                />
                                <p className="text-xs text-slate-500">
                                    {review.length}/500 characters
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 p-6 border-t border-white/10">
                            <button
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
                            >
                                Skip
                            </button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleSubmitRating}
                                disabled={rating === 0 || isSubmitting}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition-colors font-medium"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Rating'}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RatingModal;