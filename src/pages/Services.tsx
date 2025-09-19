import React, { useState } from 'react';
import OutstationBooking from '../components/OutstationBooking';
import MumbaiLocalBooking from '../components/MumbaiLocalBooking';
import { motion } from 'framer-motion';

const Services: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'outstation' | 'local'>('outstation');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose from our premium cab services tailored to your needs
          </p>
        </motion.div>

        {/* Service Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setActiveTab('outstation')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'outstation'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              Outstation
            </button>
            <button
              onClick={() => setActiveTab('local')}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                activeTab === 'local'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
              }`}
            >
              Mumbai Local
            </button>
          </div>
        </div>

        {/* Service Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'outstation' ? <OutstationBooking /> : <MumbaiLocalBooking />}
        </motion.div>
      </div>
    </div>
  );
};

export default Services;