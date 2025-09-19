import React from 'react';
import { Phone, ArrowRight, Shield, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const CTASection: React.FC = () => {
  const handleCallNow = () => {
    window.open('tel:+919860146819');
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi! I would like to book a cab service. Please provide me with more details.');
    window.open(`https://wa.me/919860146819?text=${message}`, '_blank');
  };

  const trustBadges = [
    { icon: Shield, text: 'Secure Payments' },
    { icon: Clock, text: '24/7 Support' },
    { icon: Star, text: '4.8+ Rating' }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background with Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-navy-900"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full"
        />
        <motion.div
          animate={{ 
            rotate: [360, 0],
            scale: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="absolute -bottom-32 -left-32 w-64 h-64 bg-white/5 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full"
        />
        <motion.div
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
          className="absolute bottom-40 right-32 w-3 h-3 bg-white/20 rounded-full"
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-8"
          >
            <Phone className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ready to Book?</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight"
          >
            Ready to Book
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Your Ride?
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Get in touch with us now for instant booking and competitive pricing. 
            Our team is available 24/7 to assist you with all your transportation needs.
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCallNow}
              className="group bg-white text-primary-600 px-10 py-5 rounded-2xl font-display font-bold text-xl flex items-center space-x-3 hover:bg-gray-50 transition-all duration-300 shadow-2xl min-w-[200px] justify-center"
            >
              <Phone className="w-6 h-6 group-hover:animate-bounce" />
              <span>Call Now</span>
            </motion.button>
            
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(34, 197, 94, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWhatsApp}
              className="group bg-green-500 hover:bg-green-600 text-white px-10 py-5 rounded-2xl font-display font-bold text-xl flex items-center space-x-3 transition-all duration-300 shadow-2xl min-w-[200px] justify-center"
            >
              <span>WhatsApp</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8 mb-12"
          >
            {trustBadges.map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4"
              >
                <div className="bg-white/20 p-2 rounded-xl">
                  <badge.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-white font-semibold">{badge.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-blue-200 mb-4">
              Or reach us directly at
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-white">
              <a 
                href="tel:+919860146819" 
                className="flex items-center space-x-2 hover:text-yellow-400 transition-colors font-semibold text-lg"
              >
                <Phone className="w-5 h-5" />
                <span>+91 98601 46819</span>
              </a>
              <div className="hidden sm:block w-px h-6 bg-white/30"></div>
              <div className="text-blue-200">
                Available 24/7 for your convenience
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" fill="none" className="w-full h-auto">
          <path
            d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-gray-50 dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  );
};

export default CTASection;