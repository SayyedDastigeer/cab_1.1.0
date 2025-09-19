import React from 'react';
import { Car, MapPin, Shield, Clock, Users, Star, Zap, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const services = [
    {
      icon: MapPin,
      title: 'City Rides',
      description: 'Quick and comfortable rides within the city with professional drivers',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600',
      features: ['GPS Tracking', 'Real-time Updates', 'Multiple Payment Options']
    },
    {
      icon: Car,
      title: 'Outstation Trips',
      description: 'Long-distance travel with premium vehicles and experienced drivers',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600',
      features: ['Premium Fleet', 'Flexible Timing', 'Transparent Pricing']
    },
    {
      icon: Zap,
      title: 'Airport Transfers',
      description: 'Reliable airport pickup and drop services with flight tracking',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600',
      features: ['Flight Tracking', '24/7 Available', 'Meet & Greet']
    },
    {
      icon: Clock,
      title: 'Rentals',
      description: 'Hourly and daily car rentals for your convenience and comfort',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      iconColor: 'text-orange-600',
      features: ['Flexible Duration', 'Self Drive Option', 'Competitive Rates']
    }
  ];

  const trustFeatures = [
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Licensed drivers with verified backgrounds and GPS tracking',
      stat: '100%'
    },
    {
      icon: Users,
      title: 'Professional Drivers',
      description: 'Experienced and courteous drivers for a pleasant journey',
      stat: '500+'
    },
    {
      icon: Star,
      title: 'Top Rated',
      description: '4.8+ star rating from thousands of satisfied customers',
      stat: '4.8★'
    },
    {
      icon: Award,
      title: 'Premium Fleet',
      description: 'Well-maintained 4 & 6 seater vehicles for your comfort',
      stat: '200+'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Car className="w-4 h-4" />
            <span>Our Services</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Premium Cab Services
            <span className="block text-primary-600 dark:text-primary-400">Tailored for You</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Experience the difference with our comprehensive range of transportation services 
            designed for comfort, safety, and reliability.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              {/* Glassmorphism Card */}
              <div className="relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 shadow-glass hover:shadow-2xl transition-all duration-500">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl ${service.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className={`w-8 h-8 ${service.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-display font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-primary-200 dark:group-hover:border-primary-800 transition-colors duration-300"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            <span>Why Choose Saffari</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            Your Trust is Our
            <span className="block text-green-600 dark:text-green-400">Priority</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                {/* Icon with animated background */}
                <div className="relative inline-flex p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 mb-6 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 transition-colors">
                  <feature.icon className="w-8 h-8 text-gray-600 dark:text-gray-300 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  <div className="absolute inset-0 bg-primary-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                </div>

                {/* Stat */}
                <div className="text-3xl font-display font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {feature.stat}
                </div>

                {/* Title */}
                <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;