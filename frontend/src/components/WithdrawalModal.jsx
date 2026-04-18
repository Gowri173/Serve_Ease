import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSmartphone, FiCheckCircle, FiX, FiShield, FiBriefcase, FiArrowRight } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';

const WithdrawalModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMethod('');
    }
  }, [isOpen]);

  if (!isOpen || !user) return null;

  const handleProcess = async (e) => {
    e?.preventDefault();
    setStep(3); // Processing
    try {
      await api.post(`/auth/withdraw`);
      // The backend has a 2s delay built-in which acts as our processing simulation
      setStep(4); // Success
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal Failed');
      setStep(2);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  const generateTxnId = () => 'TRX' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const methods = [
    { id: 'bank', name: 'Direct Bank Transfer', icon: <FiBriefcase className="text-xl" />, time: '2-3 Hours' },
    { id: 'upi', name: 'Instant UPI Transfer', icon: <FiSmartphone className="text-xl" />, time: 'Instant' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== 3 && step !== 4 ? onClose : undefined}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />
        
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-800/50">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              <FiShield className="text-emerald-400" /> Secure Withdrawal
            </h3>
            {step !== 3 && step !== 4 && (
              <button onClick={onClose} className="p-2 opacity-60 hover:opacity-100 hover:bg-white/5 rounded-full transition-colors cursor-pointer">
                <FiX />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="p-6 relative min-h-[350px]">
             {/* Step 1: Select Method */}
             {step === 1 && (
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="text-center mb-6">
                   <p className="text-sm opacity-60 mb-1">Available to Withdraw</p>
                   <p className="text-4xl font-display font-bold text-gradient">${user.earnings?.toFixed(2)}</p>
                 </div>
                 <div className="space-y-3">
                   {methods.map(m => (
                     <button 
                       key={m.id}
                       onClick={() => { setMethod(m.id); setStep(2); }}
                       className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-emerald-500/50 transition-all group cursor-pointer"
                     >
                       <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                         {m.icon}
                       </div>
                       <div className="flex-1 text-left">
                         <p className="font-medium">{m.name}</p>
                         <p className="text-xs opacity-50 mt-1">Est. {m.time}</p>
                       </div>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">→</span>
                     </button>
                   ))}
                 </div>
               </motion.div>
             )}

             {/* Step 2: Form */}
             {step === 2 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setStep(1)} className="text-sm opacity-60 hover:opacity-100 hover:text-emerald-400 cursor-pointer">← Back</button>
                   <span className="text-sm font-medium opacity-80">Transfer Details</span>
                 </div>
                 
                 <form onSubmit={handleProcess} className="space-y-4">
                   {method === 'bank' && (
                     <>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Account Number</label>
                         <input type="text" placeholder="000000000000" className="w-full px-4 py-3 font-mono text-sm" required />
                       </div>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Routing / IFSC Code</label>
                         <input type="text" placeholder="ROUTING123" className="w-full px-4 py-3 font-mono text-sm uppercase" required />
                       </div>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Account Holder Name</label>
                         <input type="text" placeholder="Jane Doe" defaultValue={user.name} className="w-full px-4 py-3 text-sm" required />
                       </div>
                     </>
                   )}
                   {method === 'upi' && (
                     <>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">UPI ID</label>
                         <input type="text" placeholder="captain@upi" className="w-full px-4 py-3 text-sm" required />
                       </div>
                       <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center mt-2">
                         <p className="text-xs text-emerald-300">Funds will be deposited instantly to this UPI ID.</p>
                       </div>
                     </>
                   )}

                   <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 text-white rounded-xl font-bold py-4 text-lg flex items-center justify-center gap-2 cursor-pointer mt-6 transition-all">
                     Withdraw ${user.earnings?.toFixed(2)} <FiArrowRight />
                   </button>
                 </form>
               </motion.div>
             )}

             {/* Step 3: Processing */}
             {step === 3 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 space-y-6">
                 <div className="w-16 h-16 border-4 border-white/10 border-t-emerald-500 rounded-full animate-spin"></div>
                 <div className="text-center">
                   <h4 className="font-display font-bold text-lg mb-1">Processing Transfer</h4>
                   <p className="text-sm opacity-60 animate-pulse">Communicating with bank server...</p>
                 </div>
               </motion.div>
             )}

             {/* Step 4: Success */}
             {step === 4 && (
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 p-6 text-center">
                 <motion.div 
                   initial={{ scale: 0 }} 
                   animate={{ scale: 1 }} 
                   transition={{ type: 'spring', damping: 12, delay: 0.2 }}
                   className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                 >
                   <FiCheckCircle className="text-4xl" />
                 </motion.div>
                 <h4 className="font-display font-bold text-2xl mb-2">Transfer Initiated!</h4>
                 <p className="text-slate-400 text-sm mb-8">Your funds are on their way to your account.</p>
                 
                 <div className="w-full bg-slate-800/50 rounded-xl p-4 mb-8 text-left border border-white/5">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs opacity-60">Amount Withdrawn</span>
                     <span className="font-bold text-emerald-400">${user.earnings?.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs opacity-60">Reference ID</span>
                     <span className="font-mono text-xs opacity-80">{generateTxnId()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs opacity-60">Status</span>
                     <span className="text-xs text-emerald-400 font-bold">Processing...</span>
                   </div>
                 </div>

                 <button onClick={handleDone} className="w-full bg-slate-800 hover:bg-slate-700 border border-white/10 py-3 rounded-xl font-bold transition-colors cursor-pointer">
                   Done
                 </button>
               </motion.div>
             )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WithdrawalModal;
