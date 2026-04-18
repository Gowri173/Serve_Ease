import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { FiSearch, FiUser, FiChevronDown, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState(null);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const contentSections = {
    home: {
      title: 'Welcome to ServeEase',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">ServeEase is your trusted platform for connecting with professional service providers.</p>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h4 className="font-bold text-indigo-400 mb-2">Fast Booking</h4>
              <p className="text-xs text-slate-400">Book services in minutes</p>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-bold text-purple-400 mb-2">Verified Captains</h4>
              <p className="text-xs text-slate-400">Professional & trusted providers</p>
            </div>
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h4 className="font-bold text-indigo-400 mb-2">Secure Payment</h4>
              <p className="text-xs text-slate-400">Safe & encrypted transactions</p>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-bold text-purple-400 mb-2">24/7 Support</h4>
              <p className="text-xs text-slate-400">Always here to help you</p>
            </div>
          </div>
        </div>
      )
    },
    services: {
      title: 'Our Services',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">We offer a wide range of professional services:</p>
          <div className="space-y-3 mt-6">
            {['Plumbing Repairs', 'Electrical Work', 'Home Maintenance', 'Cleaning Services', 'Painting & Decoration', 'Lock & Security', 'Appliance Repair', 'Garden & Landscape'].map((service, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                <span className="text-sm text-slate-300">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )
    },
    captains: {
      title: 'Become a Captain',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Join thousands of professional service providers earning on ServeEase.</p>
          <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 p-6 rounded-lg border border-indigo-500/30 mt-6">
            <h4 className="font-bold text-indigo-300 mb-3">Why Join Us?</h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>✓ Steady stream of bookings</li>
              <li>✓ Flexible working hours</li>
              <li>✓ Transparent pricing structure</li>
              <li>✓ Quick payouts every week</li>
              <li>✓ Insurance coverage included</li>
              <li>✓ Rating & review system</li>
            </ul>
          </div>
          <Link to="/register?role=captain" onClick={() => setActiveSection(null)} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors text-center mt-4">
            Register as Captain
          </Link>
        </div>
      )
    },
    company: {
      title: 'About ServeEase',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">ServeEase is revolutionizing the way people find and hire professional services.</p>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5 mt-6">
            <h4 className="font-bold text-white mb-2">Our Mission</h4>
            <p className="text-xs text-slate-400">To connect customers with trusted service professionals, making quality services accessible and affordable for everyone.</p>
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg border border-white/5">
            <h4 className="font-bold text-white mb-2">Founded</h4>
            <p className="text-xs text-slate-400">2023 - Serving customers across major cities</p>
          </div>
        </div>
      )
    },
    pricing: {
      title: 'Pricing',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Transparent and competitive pricing with no hidden charges.</p>
          <div className="space-y-3 mt-6">
            {[
              { name: 'Basic Services', price: '₹2,000-4,000', features: ['Standard services', 'Quick response'] },
              { name: 'Premium Services', price: '₹4,000-12,500', features: ['Complex services', 'Expert professionals'] },
              { name: 'Emergency Services', price: '+50%', features: ['24/7 availability', 'Priority dispatch'] }
            ].map((plan, i) => (
              <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-indigo-500/20 hover:border-indigo-500/40 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-white">{plan.name}</h4>
                  <span className="text-indigo-400 font-bold">{plan.price}</span>
                </div>
                <p className="text-xs text-slate-400">{plan.features.join(' • ')}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    about: {
      title: 'About Us',
      content: (
        <div className="space-y-4">
          <p className="text-slate-300">Learn more about ServeEase and our commitment to excellence.</p>
          <div className="space-y-3 mt-6">
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h4 className="font-bold text-indigo-400 mb-1">Our Values</h4>
              <p className="text-xs text-slate-400">Trust, Quality, Transparency, and Customer Satisfaction</p>
            </div>
            <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20">
              <h4 className="font-bold text-purple-400 mb-1">Global Reach</h4>
              <p className="text-xs text-slate-400">Available in 50+ cities with 10,000+ verified professionals</p>
            </div>
            <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20">
              <h4 className="font-bold text-indigo-400 mb-1">Customer Success</h4>
              <p className="text-xs text-slate-400">4.8/5 rating from 100,000+ completed services</p>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center transform rotate-12">
            <span className="text-white font-bold text-lg -rotate-12">S</span>
          </div>
          <span className="text-xl font-display font-bold text-white tracking-wide">
            ServeEase
          </span>
        </Link>

        {/* Center Links (Desktop only) */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-300">
          {isAuthenticated && (location.pathname === '/dashboard' || location.pathname === '/admin-dashboard' || location.pathname === '/captain-dashboard') ? (
            <>
              {user?.role === 'user' && (
                <>
                  <button onClick={() => scrollToSection('book-service')} className="hover:text-white transition-colors cursor-pointer">Book Service</button>
                  <button onClick={() => scrollToSection('activity-log')} className="hover:text-white transition-colors cursor-pointer">Activity Log</button>
                </>
              )}
              {user?.role === 'admin' && (
                <>
                  <button onClick={() => scrollToSection('admin-dashboard')} className="hover:text-white transition-colors cursor-pointer">Dashboard</button>
                  <button onClick={() => scrollToSection('admin-stats')} className="hover:text-white transition-colors cursor-pointer">Statistics</button>
                </>
              )}
              {user?.role === 'captain' && (
                <>
                  <button onClick={() => scrollToSection('captain-dashboard')} className="hover:text-white transition-colors cursor-pointer">My Jobs</button>
                  <button onClick={() => scrollToSection('captain-stats')} className="hover:text-white transition-colors cursor-pointer">Performance</button>
                </>
              )}
            </>
          ) : (
            <>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('home');
                else setActiveSection('home');
              }} className="hover:text-white transition-colors cursor-pointer">Home</button>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('services');
                else setActiveSection('services');
              }} className="hover:text-white transition-colors cursor-pointer">Services</button>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('captains');
                else setActiveSection('captains');
              }} className="hover:text-white transition-colors cursor-pointer">For Captains</button>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('company');
                else setActiveSection('company');
              }} className="hover:text-white transition-colors cursor-pointer">Company</button>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('pricing');
                else setActiveSection('pricing');
              }} className="hover:text-white transition-colors cursor-pointer">Pricing</button>
              <button onClick={() => {
                if (location.pathname === '/') scrollToSection('about');
                else setActiveSection('about');
              }} className="hover:text-white transition-colors cursor-pointer">About</button>
            </>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex gap-4 items-center">
          <button className="hidden md:block bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
            Download App
          </button>

          <div className="hidden md:flex items-center gap-1 border border-white/10 rounded-full px-3 py-1.5 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors text-sm text-slate-300">
            <span>🇮🇳</span>
            <span className="font-medium ml-1">IN</span>
            <FiChevronDown className="opacity-50" />
          </div>

          <button className="p-2 text-slate-300 hover:text-white transition-colors">
            <FiSearch className="text-lg" />
          </button>

          {!isAuthenticated ? (
            <Link to="/login" className="flex items-center gap-2 border border-white/10 rounded-full px-4 py-2 bg-white/5 hover:bg-white/10 transition-colors text-sm font-medium text-white">
              <FiUser />
              <span>Login</span>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to={user.role === 'admin' ? '/admin-dashboard' : user.role === 'captain' ? '/captain-dashboard' : '/dashboard'} className="text-sm font-medium hover:text-indigo-400 transition-colors text-white">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors bg-red-400/10 px-3 py-1.5 rounded-full border border-red-500/20">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {activeSection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4 pt-24">
          <div className="bg-slate-900 rounded-2xl border border-white/10 max-w-2xl w-full max-h-[70vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-display font-bold text-white">
                {contentSections[activeSection]?.title}
              </h2>
              <button
                onClick={() => setActiveSection(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <FiX className="text-xl text-slate-400 hover:text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {contentSections[activeSection]?.content}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
