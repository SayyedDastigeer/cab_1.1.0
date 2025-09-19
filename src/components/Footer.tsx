import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Shield, Star, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Book Ride', path: '/services' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const services = [
    'City Rides',
    'Outstation Trips',
    'Airport Transfers',
    'Car Rentals',
    'Corporate Bookings',
    'Emergency Services'
  ];

  const cities = [
    'Mumbai',
    'Pune', 
    'Surat',
    'Nashik'
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' }
  ];

  const trustBadges = [
    { icon: Shield, text: 'Secure Payments' },
    { icon: Star, text: '4.8+ Rating' },
    { icon: Award, text: 'Premium Service' }
  ];

  return (
    <footer className="bg-navy-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl shadow-lg">
                  <Car className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl blur opacity-50"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                  RideMax
                </span>
                <span className="text-xs text-gray-400 -mt-1">Premium Cabs</span>
              </div>
            </div>

            <p className="text-gray-300 leading-relaxed">
              Premium cab services across Maharashtra. Safe, reliable, and comfortable 
              transportation for all your travel needs with professional drivers and modern vehicles.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {trustBadges.map((badge, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
                >
                  <badge.icon className="w-4 h-4 text-primary-400" />
                  <span className="text-xs text-gray-300">{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="p-3 bg-white/5 hover:bg-primary-500/20 border border-white/10 hover:border-primary-400/30 rounded-xl transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-primary-400 transition-colors" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-primary-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-gray-300 flex items-center group">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-xl font-display font-bold mb-6 text-white">Contact Info</h3>
            <div className="space-y-4">
              <motion.a
                href="tel:+919860146819"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-all duration-300 group"
              >
                <div className="p-2 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <Phone className="w-4 h-4 text-primary-400" />
                </div>
                <span>+91 98601 46819</span>
              </motion.a>

              <motion.a
                href="mailto:info@ridemax.com"
                whileHover={{ x: 5 }}
                className="flex items-center space-x-3 text-gray-300 hover:text-primary-400 transition-all duration-300 group"
              >
                <div className="p-2 bg-primary-500/20 rounded-lg group-hover:bg-primary-500/30 transition-colors">
                  <Mail className="w-4 h-4 text-primary-400" />
                </div>
                <span>info@ridemax.com</span>
              </motion.a>

              <div className="flex items-start space-x-3 text-gray-300">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </div>
                <span>Mumbai, Maharashtra, India</span>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <span>24/7 Available</span>
              </div>
            </div>
          </motion.div>
        </div>

        

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-gray-400 text-center lg:text-left"
          >
            © {currentYear} RideMax. All rights reserved. Made with ❤️ for better transportation.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 text-sm"
          >
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Refund Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
              Support
            </a>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;