import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiStar, FiShield, FiSearch, FiMapPin, FiTrendingUp, FiClock, FiUsers, FiMessageSquare, FiZap, FiDroplet, FiWind, FiScissors, FiTool } from 'react-icons/fi';
import { BsStars } from 'react-icons/bs';

const Home = () => {
  const navigate = useNavigate();

  const services = [
    { title: 'Electrician', price: 'From ₹299', icon: <FiZap />, bg: 'bg-purple-500', img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80' },
    { title: 'Plumber', price: 'From ₹349', icon: <FiDroplet />, bg: 'bg-blue-500', img: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&q=80' },
    { title: 'AC Repair', price: 'From ₹499', icon: <FiWind />, bg: 'bg-indigo-500', img: 'https://imgs.search.brave.com/evI8Kwuuth68mrYBuRdOOYy9w6x9gG9RYKQ7bI8YG3Y/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jb250/ZW50LmpkbWFnaWNi/b3guY29tL3YyL2Nv/bXAvdmFkb2RhcmEv/eTEvMDI2NXB4MjY1/LngyNjUuMjUxMjI5/MjMwMDU2Lm03eTEv/Y2F0YWxvZ3VlL2Et/dG8tei1haXJjb24t/Z29yd2EtdmFkb2Rh/cmEtYWMtcmVwYWly/LWFuZC1zZXJ2aWNl/cy03ZzQ1NzdrcG56/LTI1MC5qcGc_dz02/NDAmcT03NQ' },
    { title: 'Cleaning', price: 'From ₹199', icon: <BsStars />, bg: 'bg-pink-500', img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80' },
    { title: 'Beauty Salon', price: 'From ₹399', icon: <FiScissors />, bg: 'bg-rose-500', img: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80' },
    { title: 'Carpentry', price: 'From ₹249', icon: <FiTool />, bg: 'bg-orange-500', img: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&q=80' },
  ];

  const trustIndicators = [
    { title: 'Verified Pros', sub: 'Background checked', icon: <FiShield /> },
    { title: 'On Time', sub: "Or it's free", icon: <FiClock /> },
    { title: '4.8 Rating', sub: '50K+ reviews', icon: <FiStar /> },
    { title: '10L+ Customers', sub: 'Across 500+ cities', icon: <FiUsers /> },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#0a0a0e]">

      {/* Immersive Background Gradients (Matching the image) */}
      <div className="absolute top-[10%] -left-[10%] w-[800px] h-[800px] bg-[#d946ef]/15 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#3b82f6]/15 rounded-full blur-[150px] pointer-events-none" />

      {/* HOME SECTION */}
      <section id="home" className="min-h-screen flex items-center">
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-32 pb-24 relative z-10 flex flex-col min-h-[calc(100vh-80px)] justify-center w-full">

          {/* Top Hero Section */}
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center justify-between w-full">

            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-[45%] flex-shrink-0"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-8 backdrop-blur-md w-max">
                <span className="text-yellow-400 text-sm"><FiStar className="fill-current" /></span>
                <span className="text-white text-sm font-medium">4.8 <span className="opacity-50 mx-1">|</span></span>
                <span className="text-emerald-400 text-sm"><FiShield /></span>
                <span className="text-white text-sm font-medium">Verified Professionals</span>
              </div>

              <h1 className="text-5xl lg:text-7xl xl:text-[5.5rem] font-display font-bold leading-[1.1] mb-6 text-white tracking-tight">
                Book Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] drop-shadow-[0_0_30px_rgba(236,72,153,0.3)]">
                  Home Services
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-10 max-w-xl font-light leading-relaxed opacity-90">
                India's <span className="font-bold text-white">#1 hyperlocal service marketplace</span>. Expert professionals at your doorstep — electricians, plumbers, cleaners & more. Available <span className="font-bold text-white">24/7</span> with transparent pricing.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/register" className="bg-gradient-to-r from-[#8b5cf6] to-[#ec4899] text-white text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(139,92,246,0.4)] font-medium hover:scale-[1.02] transition-transform">
                  Book a Service <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link to="/register?role=captain" className="px-8 py-4 rounded-full font-medium border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all text-center">
                  Become a Captain
                </Link>
              </div>

              {/* Search Pill */}
              <div className="relative p-2 bg-[#121626]/80 backdrop-blur-xl border border-white/10 rounded-full flex flex-col sm:flex-row items-center gap-2 shadow-2xl max-w-2xl w-full">
                <div className="flex items-center gap-2 px-4 py-2 w-full sm:w-auto text-slate-300">
                  <FiMapPin className="text-[#a855f7]" />
                  <span className="font-medium text-sm whitespace-nowrap">Delhi NCR</span>
                  <span className="opacity-50 ml-2 text-xs">▼</span>
                </div>
                <div className="hidden sm:block w-px h-8 bg-white/10"></div>
                <div className="flex-1 flex items-center gap-3 px-4 py-2 w-full">
                  <FiSearch className="text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search for services..."
                    className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-slate-500"
                  />
                </div>
                <button className="w-full sm:w-auto bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">
                  Search
                </button>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 pl-4">
                <FiTrendingUp className="text-red-400" />
                <span>Trending: AC Repair, Cleaning, Beauty Salon</span>
              </div>
            </motion.div>

            {/* Right Content - Service Grid */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="w-full lg:w-[55%] grid grid-cols-2 md:grid-cols-3 gap-4 xl:gap-6 relative"
            >
              {services.map((service, idx) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                  whileHover={{ y: -5 }}
                  onClick={() => navigate('/register')}
                  className="relative z-10 bg-[#121626]/80 backdrop-blur-md border border-white/10 rounded-2xl p-3 cursor-pointer group hover:border-[#8b5cf6]/50 hover:bg-[#1a1f35]/80 transition-all overflow-hidden shadow-xl flex flex-col"
                >
                  {/* Image container */}
                  <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative mb-3">
                    <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Floating Icon inside image */}
                    <div className={`absolute bottom-2 left-2 w-7 h-7 ${service.bg} rounded-md flex items-center justify-center text-white text-xs shadow-lg`}>
                      {service.icon}
                    </div>
                  </div>

                  {/* Text */}
                  <div className="px-1 flex-1 flex flex-col justify-end">
                    <h4 className="text-white font-bold text-sm md:text-base mb-0.5">{service.title}</h4>
                    <p className="text-slate-400 text-xs">From {service.price.replace('From ', '')}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {trustIndicators.map((item, idx) => (
              <div key={idx} className="bg-[#121626]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 lg:p-5 flex items-center gap-3 lg:gap-4 hover:bg-white/5 transition-colors">
                <div className="w-10 h-10 lg:w-12 lg:h-12 flex-shrink-0 rounded-full bg-[#1a1f35] border border-white/10 flex items-center justify-center text-[#8b5cf6] text-lg lg:text-xl">
                  {item.icon}
                </div>
                <div className="overflow-hidden">
                  <h5 className="text-white font-bold text-xs lg:text-sm truncate">{item.title}</h5>
                  <p className="text-slate-500 text-[10px] lg:text-xs mt-0.5 truncate">{item.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </main>
      </section>

      {/* SERVICES SECTION */}
      <section id="services" className="min-h-screen flex items-center bg-gradient-to-b from-[#0a0a0e] to-[#1a0f2e]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-white">Our Services</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Explore our wide range of professional services available at your doorstep</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-[#121626]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-[#8b5cf6]/50 hover:bg-[#1a1f35]/80 transition-all shadow-xl"
              >
                <div className="aspect-video overflow-hidden relative">
                  <img src={service.img} alt={service.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-white mb-2">{service.title}</h4>
                  <p className="text-indigo-400 font-bold text-lg mb-4">{service.price}</p>
                  <button onClick={() => navigate('/register')} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR CAPTAINS SECTION */}
      <section id="captains" className="min-h-screen flex items-center bg-gradient-to-b from-[#1a0f2e] to-[#0a0a0e]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-white">Become a Captain</h2>
              <p className="text-lg text-slate-300 mb-8">Join thousands of professional service providers and start earning on your own terms.</p>

              <div className="space-y-4 mb-8">
                {[
                  { title: 'Flexible Hours', desc: 'Work when you want' },
                  { title: 'Easy Bookings', desc: 'Steady stream of customers' },
                  { title: 'Quick Payouts', desc: 'Get paid every week' },
                  { title: 'Insurance Coverage', desc: 'We protect you' },
                  { title: 'Rating System', desc: 'Build your reputation' },
                  { title: '24/7 Support', desc: 'Always there to help' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold">✓</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/register?role=captain" className="inline-block bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
                Join as Captain Now →
              </Link>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-8 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💼</div>
                <p className="text-slate-300">Start your earning journey with ServeEase</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPANY SECTION */}
      <section id="company" className="min-h-screen flex items-center bg-gradient-to-b from-[#0a0a0e] to-[#1a0f2e]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-white">About ServeEase</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">Revolutionizing the way people find and hire professional services</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Our Mission', desc: 'To connect customers with trusted service professionals, making quality services accessible and affordable for everyone.' },
              { title: 'Our Vision', desc: 'To be the most trusted hyperlocal service marketplace in India and beyond.' },
              { title: 'Our Values', desc: 'Trust, Quality, Transparency, and Customer Satisfaction are at the core of everything we do.' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-[#121626]/80 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:border-indigo-500/50 transition-colors"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-slate-300">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
            {[
              { number: '50+', label: 'Cities Covered' },
              { number: '10K+', label: 'Verified Professionals' },
              { number: '100K+', label: 'Completed Services' },
              { number: '4.8/5', label: 'Average Rating' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-6"
              >
                <div className="text-4xl font-bold text-indigo-400 mb-2">{stat.number}</div>
                <div className="text-slate-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="min-h-screen flex items-center bg-gradient-to-b from-[#1a0f2e] to-[#0a0a0e]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-white">Transparent Pricing</h2>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">No hidden charges, no surprises. Just honest pricing for quality services.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Basic Services', price: '₹2,000-4,000', features: ['Standard services', 'Quick response (2-4 hours)', 'Basic support'] },
              { name: 'Premium Services', price: '₹4,000-12,500', features: ['Complex services', 'Expert professionals', 'Priority support', '24-hour guarantee'] },
              { name: 'Emergency Services', price: '+50%', features: ['24/7 availability', 'Priority dispatch', 'Express support', 'Premium professionals'] }
            ].map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 border backdrop-blur-md transition-all ${idx === 1
                  ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-indigo-500/50 transform md:scale-105'
                  : 'bg-[#121626]/80 border-white/10 hover:border-indigo-500/30'
                  }`}
              >
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-indigo-400 mb-6">{plan.price}</div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-slate-300 flex items-center gap-3">
                      <span className="text-indigo-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="min-h-screen flex items-center bg-gradient-to-b from-[#0a0a0e] to-[#1a0f2e]">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-24 relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 p-8 h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-slate-300">Trusted by millions across India</p>
              </div>
            </div>

            <div>
              <h2 className="text-5xl lg:text-6xl font-display font-bold mb-6 text-white">Why Choose ServeEase?</h2>

              <div className="space-y-6">
                {[
                  { title: 'Verified Professionals', desc: 'All our professionals are background-checked and verified' },
                  { title: 'On-Time Guarantee', desc: 'Service arrives on time or it\'s free' },
                  { title: 'Transparent Pricing', desc: 'No hidden charges, upfront pricing for all services' },
                  { title: '24/7 Customer Support', desc: 'We\'re always here to help you' },
                  { title: 'Secure Payments', desc: 'Safe and encrypted payment processing' },
                  { title: 'Quality Assurance', desc: '4.8/5 rating from 100,000+ completed services' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 flex-shrink-0 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 text-xl font-bold">✓</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{item.title}</h4>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/register" className="inline-block mt-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-lg hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all">
                Get Started Today →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <div className="hidden md:block bg-slate-800/80 backdrop-blur-md border border-white/10 text-white text-xs px-4 py-2 rounded-full shadow-lg">
          Need help? Chat with us 👋
        </div>
        <button className="w-14 h-14 bg-indigo-500 hover:bg-indigo-600 hover:scale-105 transition-all text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.5)] text-2xl">
          <FiMessageSquare />
        </button>
      </div>

    </div>
  );
};

export default Home;
