import React from 'react';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const StickyBookButton: React.FC = () => {
  const handleBookNow = () => {
    const message = encodeURIComponent('Hi! I would like to book a cab. Please help me with the booking.');
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleBookNow}
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center space-x-2 transition-colors"
    >
      <Phone className="w-6 h-6" />
      <span className="hidden sm:block font-semibold">Book Now</span>
    </motion.button>
  );
};

export default StickyBookButton;