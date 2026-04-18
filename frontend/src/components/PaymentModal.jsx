import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiSmartphone, FiBriefcase, FiCheckCircle, FiX, FiShield, FiLock } from 'react-icons/fi';
import api from '../services/api';
import { toast } from 'react-toastify';

const PaymentModal = ({ isOpen, onClose, booking, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setMethod('');
    }
  }, [isOpen]);

  if (!isOpen || !booking) return null;

  const handleProcess = async (e) => {
    e?.preventDefault();
    setStep(3); // Processing
    try {
      await api.post(`/bookings/${booking._id}/pay`);
      // The backend has a 1.5s delay built-in which acts as our processing simulation delay
      setStep(4); // Success
    } catch (err) {
      toast.error('Payment Failed');
      setStep(2);
    }
  };

  const handleDone = () => {
    onSuccess();
    onClose();
  };

  const generateTxnId = () => 'TXN' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const methods = [
    { id: 'card', name: 'Credit / Debit Card', icon: <FiCreditCard className="text-xl" /> },
    { id: 'upi', name: 'UPI / QR', icon: <FiSmartphone className="text-xl" /> },
    { id: 'wallet', name: 'Digital Wallet', icon: <FiBriefcase className="text-xl" /> }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={step !== 3 ? onClose : undefined}
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
              <FiShield className="text-indigo-400" /> Secure Checkout
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
                   <p className="text-sm opacity-60 mb-1">Total to Pay</p>
                   <p className="text-4xl font-display font-bold text-gradient">${booking.price}</p>
                 </div>
                 <div className="space-y-3">
                   {methods.map(m => (
                     <button 
                       key={m.id}
                       onClick={() => { setMethod(m.id); setStep(2); }}
                       className="w-full flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-indigo-500/50 transition-all group cursor-pointer"
                     >
                       <div className="p-3 rounded-lg bg-slate-800 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                         {m.icon}
                       </div>
                       <span className="font-medium text-left flex-1">{m.name}</span>
                       <span className="opacity-0 group-hover:opacity-100 transition-opacity text-indigo-400">→</span>
                     </button>
                   ))}
                 </div>
               </motion.div>
             )}

             {/* Step 2: Form */}
             {step === 2 && (
               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                   <button onClick={() => setStep(1)} className="text-sm opacity-60 hover:opacity-100 hover:text-indigo-400 cursor-pointer">← Back</button>
                   <span className="text-sm font-medium opacity-80">Enter Details</span>
                 </div>
                 
                 <form onSubmit={handleProcess} className="space-y-4">
                   {method === 'card' && (
                     <>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Card Number</label>
                         <input type="text" placeholder="0000 0000 0000 0000" maxLength="19" className="w-full px-4 py-3 font-mono text-sm" required />
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                         <div>
                           <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Expiry</label>
                           <input type="text" placeholder="MM/YY" maxLength="5" className="w-full px-4 py-3 font-mono text-sm" required />
                         </div>
                         <div>
                           <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">CVV</label>
                           <input type="password" placeholder="•••" maxLength="4" className="w-full px-4 py-3 font-mono text-sm" required />
                         </div>
                       </div>
                       <div>
                         <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">Cardholder Name</label>
                         <input type="text" placeholder="John Doe" className="w-full px-4 py-3 text-sm" required />
                       </div>
                     </>
                   )}
                   {method === 'upi' && (
                     <div>
                       <label className="block text-xs opacity-60 mb-2 uppercase tracking-wider">UPI ID</label>
                       <input type="text" placeholder="username@upi" className="w-full px-4 py-3 text-sm" required />
                     </div>
                   )}
                   {method === 'wallet' && (
                     <div className="bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl text-center">
                       <p className="text-sm text-indigo-300">Link your default digital wallet to complete payment.</p>
                     </div>
                   )}

                   <button type="submit" className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2 cursor-pointer mt-6">
                     <FiLock /> Pay ${booking.price}
                   </button>
                 </form>
               </motion.div>
             )}

             {/* Step 3: Processing */}
             {step === 3 && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10 space-y-6">
                 <div className="w-16 h-16 border-4 border-white/10 border-t-indigo-500 rounded-full animate-spin"></div>
                 <div className="text-center">
                   <h4 className="font-display font-bold text-lg mb-1">Processing Payment</h4>
                   <p className="text-sm opacity-60 animate-pulse">Contacting secure gateway...</p>
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
                   className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)]"
                 >
                   <FiCheckCircle className="text-4xl" />
                 </motion.div>
                 <h4 className="font-display font-bold text-2xl mb-2">Payment Successful!</h4>
                 <p className="text-slate-400 text-sm mb-8">Your transaction has been securely processed.</p>
                 
                 <div className="w-full bg-slate-800/50 rounded-xl p-4 mb-8 text-left border border-white/5">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs opacity-60">Amount Paid</span>
                     <span className="font-bold text-green-400">${booking.price}</span>
                   </div>
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs opacity-60">Transaction ID</span>
                     <span className="font-mono text-xs opacity-80">{generateTxnId()}</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-xs opacity-60">Date & Time</span>
                     <span className="text-xs opacity-80">{new Date().toLocaleString()}</span>
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

export default PaymentModal;
