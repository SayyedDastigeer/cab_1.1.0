import React from 'react';
import { Calculator, Clock, MapPin, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface FareBreakdownProps {
  distance: number;
  duration: number;
  baseFare: number;
  distanceFare: number;
  carSurcharge?: number;
  ratePerKm: number;
  carType?: string;
  total: number;
  isAirportTrip?: boolean;
  isMinimumFare?: boolean;
  className?: string;
}

const FareBreakdown: React.FC<FareBreakdownProps> = ({
  distance,
  duration,
  baseFare,
  distanceFare,
  carSurcharge = 0,
  ratePerKm,
  carType = '4-seater',
  total,
  isAirportTrip = false,
  isMinimumFare = false,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-700/50 rounded-2xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
          <Calculator className="w-5 h-5 mr-2 text-blue-600" />
          Fare Breakdown
        </h3>
        {isAirportTrip && (
          <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
            Airport Rate
          </span>
        )}
      </div>

      {/* Trip Details */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
            <p className="font-semibold text-gray-800 dark:text-white">{distance} km</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Duration</p>
            <p className="font-semibold text-gray-800 dark:text-white">{duration} min</p>
          </div>
        </div>
      </div>

      {/* Fare Components */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">
            Distance ({distance} km × ₹{ratePerKm}/km)
          </span>
          <span className="font-medium text-gray-800 dark:text-white">₹{distanceFare}</span>
        </div>
        
        {isMinimumFare && (
          <div className="flex justify-between items-center text-orange-600 dark:text-orange-400">
            <span className="text-sm">Minimum Fare Applied</span>
            <span className="font-medium">₹100</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-blue-200 dark:border-blue-700 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
            <DollarSign className="w-5 h-5 mr-1 text-green-600" />
            Total Fare
          </span>
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ₹{total}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
          All taxes included
        </p>
      </div>

      {/* Rate Info */}
      <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>{carType} Rate:</strong> ₹{ratePerKm}/km {isAirportTrip ? '(Airport Rate)' : '(Standard Rate)'}
          {isMinimumFare && ' • Minimum fare: ₹100'}
        </p>
      </div>
    </motion.div>
  );
};

export default FareBreakdown;