import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiPhone, FiMail, FiLock, FiX, FiCheck, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/authSlice';
import api from '../services/api';
import { toast } from 'react-toastify';

const ProfileModal = ({ isOpen, onClose }) => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        password: ''
      });
    }
  }, [user, isOpen]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        phone: formData.phone
      };
      if (formData.password) {
        updateData.password = formData.password;
      }
      
      const { data } = await api.put('/auth/profile', updateData);
      dispatch(setCredentials(data));
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setFormData({ ...formData, password: '' }); // Clear password field
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <FiUser className="text-indigo-400" /> My Profile
            </h3>
            <button onClick={onClose} className="p-2 opacity-60 hover:opacity-100 hover:bg-white/5 rounded-full transition-colors">
              <FiX />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-3 text-3xl font-display font-bold text-indigo-400 border border-indigo-500/30">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <h4 className="text-xl font-bold">{user.name}</h4>
              <p className="text-sm opacity-60 capitalize">{user.role}</p>
              
              {user.role === 'captain' && (
                <div className="flex items-center gap-1 mt-2 text-yellow-400 text-sm">
                  <FiStar />
                  <span className="font-bold">{user.rating ? user.rating.toFixed(1) : 'New'}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs opacity-60 mb-1 uppercase tracking-wider">Email</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 border border-white/5 rounded-lg opacity-70">
                  <FiMail className="opacity-50" />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs opacity-60 mb-1 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiUser className="opacity-50" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-800 border rounded-lg text-white outline-none transition-colors ${isEditing ? 'border-indigo-500/50 focus:ring-1 focus:ring-indigo-500' : 'border-white/5 opacity-80'}`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs opacity-60 mb-1 uppercase tracking-wider">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiPhone className="opacity-50" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full pl-11 pr-4 py-3 text-sm bg-slate-800 border rounded-lg text-white outline-none transition-colors ${isEditing ? 'border-indigo-500/50 focus:ring-1 focus:ring-indigo-500' : 'border-white/5 opacity-80'}`}
                    placeholder="Add your phone number"
                    required
                  />
                </div>
              </div>

              {isEditing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-xs opacity-60 mb-1 uppercase tracking-wider mt-4">New Password (Optional)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiLock className="opacity-50" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Leave blank to keep current"
                      className="w-full pl-11 pr-4 py-3 text-sm bg-slate-800 border border-indigo-500/50 rounded-lg text-white outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </motion.div>
              )}

              <div className="mt-6 flex gap-3 pt-4 border-t border-white/10">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full btn-primary py-3"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-medium text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-colors font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : <><FiCheck /> Save Changes</>}
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
