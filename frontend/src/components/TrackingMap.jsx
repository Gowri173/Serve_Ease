import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FiMapPin, FiClock, FiNavigation, FiCheckCircle, FiX, FiStar, FiPhone } from 'react-icons/fi';
import api from '../services/api';

// Fix leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const captainIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#10b981" stroke="white" stroke-width="2"/>
      <path d="M8 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});

const TrackingMap = ({ bookingId, onClose }) => {
    const [trackingData, setTrackingData] = useState(null);
    const [captainPosition, setCaptainPosition] = useState(null);
    const [route, setRoute] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (bookingId) {
            setErrorMessage(null);
            fetchTrackingData();
            // Simulate real-time updates
            const interval = setInterval(() => {
                updateCaptainPosition();
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [bookingId]);

    const fetchTrackingData = async () => {
        if (!bookingId) return;

        try {
            const { data } = await api.get(`/bookings/${bookingId}/tracking`);
            setTrackingData(data);

            const initialCaptain = data.captainLocation?.lat && data.captainLocation?.lng
                ? [data.captainLocation.lat, data.captainLocation.lng]
                : data.captain?.location?.lat && data.captain?.location?.lng
                    ? [data.captain.location.lat, data.captain.location.lng]
                    : null;

            if (initialCaptain) {
                setCaptainPosition(initialCaptain);
                setRoute([initialCaptain, [data.location.lat, data.location.lng]]);
            }

            setLoading(false);
        } catch (error) {
            const status = error.response?.status;
            setErrorMessage(status === 404 ? 'Tracking information is not available for this booking yet.' : 'Unable to load tracking data.');
            console.error('Error fetching tracking data:', error);
            setLoading(false);
        }
    };

    const updateCaptainPosition = () => {
        if (!trackingData || !captainPosition || ['completed', 'requested'].includes(trackingData.status)) {
            return;
        }

        const destination = [trackingData.location.lat, trackingData.location.lng];
        const currentPos = captainPosition;

        const step = 0.005;
        const newLat = currentPos[0] + (destination[0] - currentPos[0]) * step;
        const newLng = currentPos[1] + (destination[1] - currentPos[1]) * step;
        const nextPosition = [newLat, newLng];

        setCaptainPosition(nextPosition);
        setRoute(prev => {
            if (prev.length === 0) {
                return [currentPos, nextPosition];
            }
            return [...prev, nextPosition];
        });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'accepted':
                return {
                    icon: <FiNavigation className="text-blue-400" />,
                    text: 'Captain is on the way',
                    color: 'text-blue-400',
                    bgColor: 'bg-blue-500/10'
                };
            case 'in_progress':
                return {
                    icon: <FiCheckCircle className="text-green-400" />,
                    text: 'Service in progress',
                    color: 'text-green-400',
                    bgColor: 'bg-green-500/10'
                };
            case 'completed':
                return {
                    icon: <FiCheckCircle className="text-emerald-400" />,
                    text: 'Service completed',
                    color: 'text-emerald-400',
                    bgColor: 'bg-emerald-500/10'
                };
            default:
                return {
                    icon: <FiClock className="text-yellow-400" />,
                    text: 'Waiting for captain',
                    color: 'text-yellow-400',
                    bgColor: 'bg-yellow-500/10'
                };
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
                    <div className="animate-pulse text-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full mx-auto mb-4"></div>
                        <p className="text-slate-300">Loading tracking data...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!trackingData) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-slate-900 rounded-2xl border border-white/10 p-8">
                    <p className="text-slate-300">{errorMessage || 'Unable to load tracking data'}</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                        Close
                    </button>
                </div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(trackingData.status);
    const center = captainPosition || [trackingData.location.lat, trackingData.location.lng];

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${statusInfo.bgColor}`}>
                            {statusInfo.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Live Tracking</h2>
                            <p className={`text-sm ${statusInfo.color} mb-1`}>{statusInfo.text}</p>
                            {trackingData.captain && (
                                <div className="flex items-center gap-3 text-xs opacity-80 bg-white/5 px-2 py-1 rounded-md">
                                    <span className="font-semibold">{trackingData.captain.name}</span>
                                    <span className="flex items-center gap-1 text-yellow-400"><FiStar className="text-[10px]" /> {trackingData.captain.rating ? trackingData.captain.rating.toFixed(1) : 'New'}</span>
                                    {trackingData.captain.phone && (
                                        <span className="flex items-center gap-1 text-indigo-300 ml-2"><FiPhone className="text-[10px]" /> {trackingData.captain.phone}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <FiX className="text-xl text-slate-400 hover:text-white" />
                    </button>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative">
                    <MapContainer
                        center={center}
                        zoom={15}
                        style={{ height: '100%', width: '100%' }}
                        className="rounded-b-2xl"
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* User Location */}
                        <Marker position={[trackingData.location.lat, trackingData.location.lng]} icon={userIcon}>
                            <Popup>
                                <div className="text-center">
                                    <p className="font-bold">Your Location</p>
                                    <p className="text-sm text-slate-600">{trackingData.location.address}</p>
                                </div>
                            </Popup>
                        </Marker>

                        {/* Captain Location */}
                        {captainPosition && trackingData.captain && (
                            <Marker position={captainPosition} icon={captainIcon}>
                                <Popup>
                                    <div className="text-center">
                                        <p className="font-bold">{trackingData.captain.name}</p>
                                        <p className="text-sm text-slate-600">Captain on the way</p>
                                        <div className="flex items-center justify-center gap-1 mt-1">
                                            <span className="text-yellow-400">★</span>
                                            <span className="text-sm">{trackingData.captain.rating}</span>
                                        </div>
                                    </div>
                                </Popup>
                            </Marker>
                        )}

                        {/* Route Line */}
                        {route.length > 1 && (
                            <Polyline
                                positions={route}
                                color="#3b82f6"
                                weight={3}
                                opacity={0.7}
                            />
                        )}
                    </MapContainer>
                </div>

                {/* Status Bar */}
                <div className="p-4 border-t border-white/10 bg-slate-900/50">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <FiMapPin className="text-slate-400" />
                                <span className="text-slate-300">{trackingData.service}</span>
                            </div>
                            {trackingData.estimatedArrival && trackingData.status === 'accepted' && (
                                <div className="flex items-center gap-2">
                                    <FiClock className="text-slate-400" />
                                    <span className="text-slate-300">
                                        ETA: {new Date(trackingData.estimatedArrival).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="text-slate-400">
                            ₹{trackingData.price}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default TrackingMap;