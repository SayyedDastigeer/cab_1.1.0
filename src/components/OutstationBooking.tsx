import React, { useState } from 'react';
import { MapPin, Users, Clock, ArrowRight, User, Phone, Mail, Calendar, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAdmin } from '../contexts/AdminContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface BookingData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  from: string;
  to: string;
  carType: '4-seater' | '6-seater';
  date: string;
  time: string;
}

// Helper function to validate Indian phone numbers (10 digits)
const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/; // Assumes a 10-digit number
  return phoneRegex.test(phone);
};

// Helper function to validate email addresses
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const OutstationBooking: React.FC = () => {
  const [booking, setBooking] = useState<BookingData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    from: '',
    to: '',
    carType: '4-seater',
    date: '',
    time: ''
  });
  const { pricing } = useAdmin();

  const cities = pricing.cities;
  
  const getPrice = () => {
    if (!booking.from || !booking.to || booking.from === booking.to) return 0;
    const route = `${booking.from}-${booking.to}`;
    const reverseRoute = `${booking.to}-${booking.from}`;
    const basePrice = pricing.outstation[route]?.[booking.carType] || pricing.outstation[reverseRoute]?.[booking.carType] || 0;
    
    // Add outstation 6-seater surcharge if applicable
    if (booking.carType === '6-seater' && basePrice > 0) {
      return basePrice + (pricing.outstationSixSeaterSurcharge || 0);
    }
    
    return basePrice;
  };

  const saveBookingToDatabase = async () => {
    try {
      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: 'guest',
          customer_name: booking.customerName,
          customer_phone: booking.customerPhone,
          customer_email: booking.customerEmail || null,
          service_type: 'outstation',
          from_location: booking.from,
          to_location: booking.to,
          car_type: booking.carType,
          travel_date: booking.date,
          travel_time: booking.time,
          estimated_price: getPrice(),
          status: 'pending'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for all required fields first
    if (!booking.customerName || !booking.customerPhone || !booking.from || !booking.to || !booking.date || !booking.time) {
      toast.error('Please fill all required fields');
      return;
    }
    
    // Validate phone number
    if (!isValidPhoneNumber(booking.customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    // Validate email if provided
    if (booking.customerEmail && !isValidEmail(booking.customerEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    
    // Save to database first
    saveBookingToDatabase().then(saved => {
      if (!saved) {
        toast.error('Failed to save booking. Please try again.');
        return;
      }
    });
    
    const price = getPrice();
    const message = encodeURIComponent(
      `Outstation Booking Request:\n\nCustomer: ${booking.customerName}\nPhone: ${booking.customerPhone}\nEmail: ${booking.customerEmail || 'Not provided'}\n\nFrom: ${booking.from}\nTo: ${booking.to}\nCar Type: ${booking.carType}\nDate: ${booking.date}\nTime: ${booking.time}\nEstimated Price: ₹${price}\n\nPlease confirm my booking.`
    );
    
    window.open(`https://wa.me/919860146819?text=${message}`, '_blank');
    toast.success('Redirecting to WhatsApp for booking confirmation');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <MapPin className="w-4 h-4" />
          <span>Outstation Service</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Book Your Outstation Trip
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Comfortable long-distance travel with premium vehicles and experienced drivers
        </p>
      </motion.div>

      {/* Glassmorphism Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 md:p-12 shadow-glass"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 to-blue-50/50 dark:from-primary-900/10 dark:to-blue-900/10 rounded-3xl"></div>
        
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-600/30"
          >
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-xl mr-3">
                <User className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              Customer Information
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={booking.customerName}
                  onChange={(e) => setBooking({ ...booking, customerName: e.target.value })}
                  className="w-full p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={booking.customerPhone}
                  onChange={(e) => setBooking({ ...booking, customerPhone: e.target.value })}
                  className="w-full p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={booking.customerEmail}
                onChange={(e) => setBooking({ ...booking, customerEmail: e.target.value })}
                className="w-full p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder-gray-400"
                placeholder="Enter your email address"
              />
            </div>
          </motion.div>

          {/* Route Selection */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* From City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                From City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={booking.from}
                  onChange={(e) => setBooking({ ...booking, from: e.target.value })}
                  className="w-full pl-12 pr-4 p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 appearance-none"
                  required
                >
                  <option value="">Select departure city</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* To City */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                To City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={booking.to}
                  onChange={(e) => setBooking({ ...booking, to: e.target.value })}
                  className="w-full pl-12 pr-4 p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 appearance-none"
                  required
                >
                  <option value="">Select destination city</option>
                  {cities.filter(city => city !== booking.from).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          {/* Car Type Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Select Car Type *
            </label>
            <div className="grid sm:grid-cols-2 gap-4">
              {(['4-seater', '6-seater'] as const).map(type => (
                <motion.div
                  key={type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    booking.carType === type
                      ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500 shadow-lg'
                      : 'bg-white/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  onClick={() => setBooking({ ...booking, carType: type })}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${booking.carType === type ? 'bg-primary-100 dark:bg-primary-800/50' : 'bg-gray-100 dark:bg-gray-600'}`}>
                        <Car className={`w-6 h-6 ${booking.carType === type ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 dark:text-gray-300'}`} />
                      </div>
                      <div>
                        <h4 className={`font-display font-bold ${booking.carType === type ? 'text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                          {type}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {type === '4-seater' ? 'Perfect for small groups' : 'Ideal for families'}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      booking.carType === type 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {booking.carType === type && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Date and Time */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Travel Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={booking.date}
                  onChange={(e) => setBooking({ ...booking, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-12 pr-4 p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Departure Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={booking.time}
                  onChange={(e) => setBooking({ ...booking, time: e.target.value })}
                  className="w-full pl-12 pr-4 p-4 bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Price Display */}
          {getPrice() > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200/50 dark:border-green-700/50 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-display font-bold text-gray-900 dark:text-white mb-1">
                    Estimated Price
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {booking.from} → {booking.to} • {booking.carType}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-display font-bold text-green-600 dark:text-green-400">
                    ₹{getPrice().toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">All inclusive</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(37, 99, 235, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-5 rounded-2xl font-display font-bold text-xl flex items-center justify-center space-x-3 transition-all duration-300 shadow-xl"
          >
            <span>Book via WhatsApp</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default OutstationBooking;