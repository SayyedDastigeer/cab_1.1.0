import React from 'react'; 
import { ArrowRight, MapPin, Clock, Shield, Star, Play } from 'lucide-react'; 
import { motion } from 'framer-motion'; 
import { Link } from 'react-router-dom'; 

const Hero: React.FC = () => { 
  const handleBookNow = () => { 
    const message = encodeURIComponent('Hi! I would like to book a cab. Please help me with the booking.'); 
    window.open(`https://wa.me/919860146819?text=${message}`, '_blank'); 
  }; 

  return ( 
    <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden"> 
      {/* Background Image with Overlay */} 
      <div className="absolute inset-0 z-0"> 
        <img 
          src="https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1920" 
          alt="Premium cab in city" 
          className="w-full h-full object-cover" 
        /> 
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/90 via-navy-800/80 to-primary-900/70"></div> 
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent"></div> 
      </div> 

      {/* Floating Elements */} 
      <div className="absolute inset-0 overflow-hidden pointer-events-none"> 
        <motion.div 
          animate={{ y: [0, -20, 0] }} 
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
          className="absolute top-20 left-10 w-2 h-2 bg-primary-400 rounded-full opacity-60" 
        /> 
        <motion.div 
          animate={{ y: [0, -30, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
          className="absolute top-40 right-20 w-3 h-3 bg-white rounded-full opacity-40" 
        /> 
        <motion.div 
          animate={{ y: [0, -25, 0] }} 
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }} 
          className="absolute bottom-40 left-20 w-2 h-2 bg-primary-300 rounded-full opacity-50" 
        /> 
      </div> 

      {/* Content */} 
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> 
        <div className="text-center max-w-5xl mx-auto"> 

          {/* Main Heading */} 
          <motion.h1 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2 }} 
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white leading-tight mb-6" 
          > 
            Book Your Ride 
            <span className="block bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent"> 
              Instantly 
            </span> 
          </motion.h1> 

          {/* Subtitle */} 
          <motion.p 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.4 }} 
            className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed" 
          > 
            Safe, Fast & Reliable cab services across Maharashtra.
            Professional drivers, premium vehicles, transparent pricing. 
          </motion.p> 

          {/* Features */} 
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.6 }} 
            className="flex flex-wrap justify-center gap-6 mb-12" 
          > 
            {[ 
              { icon: Clock, text: '24/7 Available' }, 
              { icon: Shield, text: 'Safe & Secure' }, 
              { icon: MapPin, text: '4 Cities Covered' } 
            ].map((feature, index) => ( 
              <div 
                key={index} 
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2" 
              > 
                <feature.icon className="w-5 h-5 text-primary-300" /> 
                <span className="text-white font-medium">{feature.text}</span> 
              </div> 
            ))} 
          </motion.div> 

          {/* CTA Buttons */} 
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.8 }} 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center" 
          > 
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.4)" }} 
              whileTap={{ scale: 0.95 }} 
              onClick={handleBookNow} 
              className="group bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-12 py-5 rounded-2xl font-display font-bold text-xl flex items-center space-x-3 transition-all duration-300 shadow-2xl" 
            > 
              <span>Book Now</span> 
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> 
            </motion.button> 

            <Link to="/services"> 
              <motion.button 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
                className="group bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-5 rounded-2xl font-display font-semibold text-lg flex items-center space-x-3 hover:bg-white/20 transition-all duration-300" 
              > 
                <Play className="w-5 h-5" /> 
                <span>View Services</span> 
              </motion.button> 
            </Link> 
          </motion.div> 

          {/* Trust Indicators */} 
        </div> 
      </div> 

      {/* Scroll Indicator */} 
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1.5 }} 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2" 
      > 
        <motion.div 
          animate={{ y: [0, 10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }} 
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center" 
        > 
          <motion.div 
            animate={{ y: [0, 12, 0] }} 
            transition={{ duration: 2, repeat: Infinity }} 
            className="w-1 h-3 bg-white/70 rounded-full mt-2" 
          /> 
        </motion.div> 
      </motion.div> 
    </section> 
  ); 
}; 

export default Hero;