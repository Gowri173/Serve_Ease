import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import GlassCard from '../components/GlassCard';
import api from '../services/api';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const CaptainDashboard = () => {
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'captain') {
      navigate('/login');
      return;
    }

    const socket = io('http://localhost:5000');

    socket.emit('join', user._id);

    socket.on('new-booking-request', (booking) => {
      toast.info('New booking request received!');
      setRequests(prev => [booking, ...prev]);
    });

    socket.on('new-booking-broadcast', (booking) => {
      if (booking.serviceType === user.serviceType) {
        toast.info('New broadcast request received!');
        setRequests(prev => [booking, ...prev]);
      }
    });

    fetchRequests();

    return () => socket.disconnect();
  }, [user, navigate]);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/bookings/captain');
      setRequests(data);
    } catch (error) {
      toast.error('Failed to fetch requests');
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking marked as ${newStatus}`);
      fetchRequests();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const displayedRequests = requests.filter(r => ['requested', 'accepted', 'in_progress'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'completed');
  // Earnings are only credited for PAID requests, minus 20% platform fee
  const paidRequests = completedRequests.filter(r => r.paymentStatus === 'paid');
  const totalEarnings = paidRequests.reduce((sum, req) => sum + (req.price * 0.8), 0);

  return (
    <div className="container mx-auto px-6 py-8 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <div>
          <h1 className="text-3xl font-display font-bold mb-1">Mission Control</h1>
          <p className="text-sm opacity-70">Specialization: <span className="text-indigo-400 font-medium">{user?.serviceType}</span></p>
        </div>

        <GlassCard className="!p-3 !px-5 flex items-center gap-4 mt-4 md:mt-0">
          <span className="text-sm font-medium opacity-80">Receiving Signals</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={isAvailable} onChange={() => setIsAvailable(!isAvailable)} />
            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {displayedRequests.map(req => (
          <motion.div key={req._id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <GlassCard className="h-full flex flex-col justify-between hover:border-indigo-500/30 transition-colors">
              <div>
                <div className="flex justify-between items-start mb-6 pb-4 border-b border-white/10">
                  <h3 className="text-xl font-display font-bold text-white">Job #{req._id.slice(-4)}</h3>
                  <span className={`badge ${req.status === 'requested' ? 'badge-yellow' : req.status === 'completed' ? 'badge-green' : 'badge-blue'}`}>
                    {req.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-xs opacity-60 mb-1">Client</p>
                    <p className="font-medium text-sm">{req.user?.name || 'Unknown'}</p>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <p className="text-xs opacity-60 mb-1">Payout</p>
                    <p className="font-bold text-lg text-indigo-400">${req.price}</p>
                  </div>
                  <div className="col-span-2 bg-white/5 p-3 rounded-xl">
                    <p className="text-xs opacity-60 mb-1">Address</p>
                    <p className="text-sm mb-3">{req.location?.address}</p>
                    {(req.status === 'accepted' || req.status === 'in_progress') && req.location?.lat && req.location?.lng && (
                      <div className="h-[200px] w-full rounded-xl overflow-hidden shadow-inner border border-white/10 relative z-0 mt-2">
                        <MapContainer center={[req.location.lat, req.location.lng]} zoom={14} style={{ height: '100%', width: '100%' }}>
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; OpenStreetMap contributors'
                          />
                          <Marker position={[req.location.lat, req.location.lng]}></Marker>
                        </MapContainer>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {req.status === 'requested' && (
                  <button onClick={() => handleStatusChange(req._id, 'accepted')} className="btn-primary w-full py-3">
                    Accept Job
                  </button>
                )}
                {req.status === 'accepted' && (
                  <button onClick={() => handleStatusChange(req._id, 'in_progress')} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold py-3 transition-colors shadow-lg shadow-blue-500/20">
                    Start Work
                  </button>
                )}
                {req.status === 'in_progress' && (
                  <button onClick={() => handleStatusChange(req._id, 'completed')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold py-3 transition-colors shadow-lg shadow-emerald-500/20">
                    Complete Job
                  </button>
                )}
              </div>
            </GlassCard>
          </motion.div>
        ))}
        {displayedRequests.length === 0 && (
          <div className="col-span-full py-16">
            <GlassCard className="text-center">
              <div className="text-4xl mb-4 opacity-50">📡</div>
              <h3 className="text-lg font-medium mb-2">Scanning for requests...</h3>
              <p className="text-sm opacity-60">Keep your availability switched on to receive local jobs.</p>
            </GlassCard>
          </div>
        )}
      </div>

      {/* History & Earnings Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-2xl font-display font-bold mb-6">Service History & Earnings</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-1 flex flex-col justify-center items-center text-center">
            <p className="text-sm opacity-70 mb-2">Total Earnings</p>
            <p className="text-5xl font-display font-bold text-gradient">${totalEarnings}</p>
            <p className="text-xs opacity-50 mt-4">{completedRequests.length} Jobs Completed</p>
          </GlassCard>

          <GlassCard className="lg:col-span-2 max-h-[300px] overflow-y-auto">
            {completedRequests.length === 0 ? (
              <div className="text-center py-12 opacity-50">No completed jobs yet.</div>
            ) : (
              <div className="space-y-4">
                {completedRequests.map(req => (
                  <div key={req._id} className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/5">
                    <div>
                      <h4 className="font-bold text-sm">Job #{req._id.slice(-4)}</h4>
                      <p className="text-xs opacity-60 mt-1">{new Date(req.date).toLocaleDateString()} - {req.location?.address?.substring(0, 30)}...</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="font-bold text-indigo-400">
                        ${(req.price * 0.8).toFixed(2)} 
                        <span className="text-[10px] opacity-50 font-normal ml-1">(incl. 20% fee)</span>
                      </p>
                      {req.paymentStatus === 'paid' ? (
                        <span className="badge badge-green text-[10px] mt-1 inline-block">Payment Cleared</span>
                      ) : (
                        <span className="badge badge-yellow text-[10px] mt-1 inline-block">Awaiting Payment</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default CaptainDashboard;
