import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

// --- MOCK IMPLEMENTATIONS (REPLACE WITH YOUR ACTUAL IMPORTS) ---
const supabase = {
  from: () => ({
    insert: () => ({ error: null }),
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: { 
          normal_4_seater_rate_per_km: 15,
          normal_6_seater_rate_per_km: 20,
          airport_4_seater_rate_per_km: 18,
          airport_6_seater_rate_per_km: 25,
        }, error: null }),
      }),
    }),
  }),
};

const useAdmin = () => {
  const [pricing, setPricing] = useState({ mumbaiLocal: null });
  useEffect(() => {
    supabase.from('local_fares').select('*').eq('service_area', 'Mumbai Local').single()
      .then(({ data }) => {
        setPricing(prev => ({ ...prev, mumbaiLocal: data }));
      })
      .catch(error => console.error('Mock AdminContext Error:', error));
  }, []);
  return { pricing };
};

const useAuth = () => ({ user: null });
const RouteMap = ({ pickup, drop }) => <div className="bg-gray-200 dark:bg-gray-700 w-full h-72 rounded-xl flex items-center justify-center">Route Map Mock</div>;
const FareBreakdown = ({ distance, duration, ratePerKm, total, isMinimumFare }) => (
  <div className="p-6 bg-white dark:bg-gray-700 rounded-xl shadow-md space-y-4">
    <h3 className="text-xl font-bold">Trip Details</h3>
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Distance</span>
        <span>{distance} km</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Duration</span>
        <span>{Math.round(duration)} min</span>
      </div>
    </div>
    <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
        <span>Rate per Km</span>
        <span>₹{ratePerKm}</span>
      </div>
      <div className="flex justify-between items-center mt-2 font-bold text-lg text-gray-900 dark:text-white">
        <span>Estimated Fare</span>
        <span>₹{total}</span>
      </div>
      {isMinimumFare && <p className="text-red-500 text-sm mt-1">Note: Minimum fare is ₹100.</p>}
    </div>
  </div>
);
const GoogleMapsAutocomplete = ({ value, onChange, placeholder }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full p-3 border rounded-lg"
    placeholder={placeholder}
  />
);
// --- END OF MOCK IMPLEMENTATIONS ---


// Helper function to validate Indian phone numbers (10 digits)
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

// Helper function to validate email addresses
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to calculate straight-line distance if API fails
const calculateStraightLineDistance = (pickup, drop) => {
  const R = 6371; // Radius of Earth in km
  const dLat = (drop.lat - pickup.lat) * Math.PI / 180;
  const dLng = (drop.lng - pickup.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pickup.lat * Math.PI / 180) *
    Math.cos(drop.lat * Math.PI / 180) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 100) / 100;
};

const MumbaiLocalBooking = () => {
  const [booking, setBooking] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    pickup: '',
    drop: '',
    carType: '4-seater',
    tripType: 'normal', // 'normal' or 'airport'
    date: '',
    time: ''
  });

  const [pickupCoords, setPickupCoords] = useState(null);
  const [dropCoords, setDropCoords] = useState(null);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const { pricing } = useAdmin();
  const { user } = useAuth();
  
  const [mumbaiLocalRates, setMumbaiLocalRates] = useState(null);

  useEffect(() => {
    if (pricing?.mumbaiLocal) {
      setMumbaiLocalRates(pricing.mumbaiLocal);
    }
  }, [pricing]);


  const calculateRouteDetails = async (pickup, drop) => {
    setIsCalculating(true);
    try {
      const response = await fetch(
        `/api/distance?origins=${pickup.lat},${pickup.lng}&destinations=${drop.lat},${drop.lng}`
      );

      if (response.ok) {
        const result = await response.json();
        setDistance(result.distance);
        setDuration(result.duration);
      } else {
        throw new Error(`API error: ${response.status}`);
      }
    } catch (error) {
      console.error('Error calculating route with Google Distance Matrix:', error);
      const straightDistance = calculateStraightLineDistance(pickup, drop);
      setDistance(straightDistance);
      setDuration(Math.round(straightDistance * 3));
    } finally {
      setIsCalculating(false);
    }
  };

  const getFare = () => {
    if (distance === 0 || !mumbaiLocalRates) {
      return null;
    }

    let ratePerKm = 0;
    if (booking.tripType === 'airport') {
      if (booking.carType === '4-seater') {
        ratePerKm = mumbaiLocalRates.airport_4_seater_rate_per_km;
      } else {
        ratePerKm = mumbaiLocalRates.airport_6_seater_rate_per_km;
      }
    } else { // Normal trip
      if (booking.carType === '4-seater') {
        ratePerKm = mumbaiLocalRates.normal_4_seater_rate_per_km;
      } else {
        ratePerKm = mumbaiLocalRates.normal_6_seater_rate_per_km;
      }
    }

    const totalFare = Math.round(distance * ratePerKm);
    const isMinimumFare = totalFare < 100; // Example minimum fare logic

    return {
      ratePerKm: ratePerKm,
      total: isMinimumFare ? 100 : totalFare,
      isMinimumFare: isMinimumFare
    };
  };

  const handlePickupChange = (value, coordinates) => {
    setBooking({ ...booking, pickup: value });
    if (coordinates) {
      setPickupCoords(coordinates);
      if (dropCoords) calculateRouteDetails(coordinates, dropCoords);
    }
  };

  const handleDropChange = (value, coordinates) => {
    setBooking({ ...booking, drop: value });
    if (coordinates) {
      setDropCoords(coordinates);
      if (pickupCoords) calculateRouteDetails(pickupCoords, coordinates);
    }
  };

  const handleFieldChange = (field, value) => {
    setBooking({ ...booking, [field]: value });
  };

  const saveBookingToDatabase = async () => {
    try {
      const { error } = await supabase.from('bookings').insert({
        customer_id: 'guest', // or user.id
        customer_name: booking.customerName,
        customer_phone: booking.customerPhone,
        customer_email: booking.customerEmail || null,
        service_type: 'mumbai-local',
        from_location: booking.pickup,
        to_location: booking.drop,
        car_type: booking.carType,
        travel_date: booking.date,
        travel_time: booking.time,
        estimated_price: getFare()?.total || 0,
        status: 'pending'
      });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving booking:', error);
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !booking.customerName ||
      !booking.customerPhone ||
      !booking.pickup ||
      !booking.drop ||
      !booking.date ||
      !booking.time
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    if (!isValidPhoneNumber(booking.customerPhone)) {
      toast.error('Please enter a valid 10-digit phone number.');
      return;
    }

    if (booking.customerEmail && !isValidEmail(booking.customerEmail)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    if (distance === 0) {
      toast.error('Unable to calculate distance. Please check your locations.');
      return;
    }

    saveBookingToDatabase().then(saved => {
      if (!saved) {
        toast.error('Failed to save booking. Please try again.');
        return;
      }
    });

    const fareDetails = getFare();
    const serviceType = booking.tripType === 'airport' ? 'Airport Transfer' : 'Local Ride';

    const message = encodeURIComponent(
      `Mumbai Local Booking Request:\n\nCustomer: ${booking.customerName}\nPhone: ${
        booking.customerPhone
      }\nEmail: ${booking.customerEmail || 'Not provided'}\n\nPickup: ${booking.pickup}\nDrop: ${
        booking.drop
      }\nDistance: ${distance} km\nDuration: ${duration} min\nCar Type: ${
        booking.carType
      }\nDate: ${booking.date}\nTime: ${booking.time}\nService Type: ${
        serviceType
      }\nEstimated Price: ₹${fareDetails?.total || 0}\n\nPlease confirm my booking.`
    );

    window.open(`https://wa.me/919860146819?text=${message}`, '_blank');
    toast.success('Redirecting to WhatsApp for booking confirmation');
  };

  const fareDetails = getFare();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
          <Navigation className="w-4 h-4" />
          <span>Mumbai Local Service</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
          Mumbai Local Rides
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Quick and convenient rides within Mumbai with real-time pricing and GPS tracking
        </p>
      </motion.div>

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 md:p-12 shadow-glass"
      >
        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          {/* Customer Info */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Name *</label>
              <input
                type="text"
                value={booking.customerName}
                onChange={e => handleFieldChange('customerName', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Phone *</label>
              <input
                type="tel"
                value={booking.customerPhone}
                onChange={e => handleFieldChange('customerPhone', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter 10-digit phone number"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Email</label>
              <input
                type="email"
                value={booking.customerEmail}
                onChange={e => handleFieldChange('customerEmail', e.target.value)}
                className="w-full p-3 border rounded-lg"
                placeholder="Enter email (optional)"
              />
            </div>
          </div>

          {/* Pickup & Drop */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Pickup Location *</label>
              <GoogleMapsAutocomplete
                value={booking.pickup}
                onChange={handlePickupChange}
                placeholder="Enter pickup location in Mumbai"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Drop Location *</label>
              <GoogleMapsAutocomplete
                value={booking.drop}
                onChange={handleDropChange}
                placeholder="Enter drop location in Mumbai"
              />
            </div>
          </div>

          {/* Trip Type / Date / Time / Car */}
          <div className="grid md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Trip Type</label>
              <select
                value={booking.tripType}
                onChange={e => handleFieldChange('tripType', e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="airport">Airport</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Date *</label>
              <input
                type="date"
                value={booking.date}
                onChange={e => handleFieldChange('date', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Time *</label>
              <input
                type="time"
                value={booking.time}
                onChange={e => handleFieldChange('time', e.target.value)}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-semibold">Car Type</label>
              <select
                value={booking.carType}
                onChange={e => handleFieldChange('carType', e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="4-seater">4 Seater</option>
                <option value="6-seater">6 Seater</option>
              </select>
            </div>
          </div>

          {/* Map + Fare */}
          {(pickupCoords || dropCoords) && (
            <div className="grid lg:grid-cols-2 gap-6">
              <RouteMap
                pickup={
                  pickupCoords && booking.pickup
                    ? { lat: pickupCoords.lat, lon: pickupCoords.lng, address: booking.pickup }
                    : undefined
                }
                drop={
                  dropCoords && booking.drop
                    ? { lat: dropCoords.lat, lon: dropCoords.lng, address: booking.drop }
                    : undefined
                }
              />
              {distance > 0 && !isCalculating && fareDetails && (
                <FareBreakdown
                  distance={distance}
                  duration={duration}
                  ratePerKm={fareDetails.ratePerKm}
                  carType={booking.carType}
                  total={fareDetails.total}
                  isMinimumFare={fareDetails.isMinimumFare}
                />
              )}
            </div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={distance === 0 || isCalculating || !mumbaiLocalRates}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-5 rounded-2xl font-bold"
          >
            {isCalculating ? 'Calculating...' : 'Book Ride'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default MumbaiLocalBooking;
