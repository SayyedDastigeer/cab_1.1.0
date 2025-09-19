import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Mumbai',
      rating: 5,
      text: 'Excellent service! The driver was on time and very professional. The car was clean and comfortable. Highly recommended for airport transfers.',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      service: 'Airport Transfer'
    },
    {
      name: 'Rajesh Patel',
      location: 'Pune',
      rating: 5,
      text: 'Used their outstation service from Mumbai to Pune. Clean car, safe drive, and reasonable pricing. The driver was very courteous and helpful.',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      service: 'Outstation Trip'
    },
    {
      name: 'Anita Desai',
      location: 'Surat',
      rating: 5,
      text: 'Amazing experience! The booking process was smooth and the journey was comfortable. Will definitely use Saffari again for future travels.',
      image: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      service: 'City Ride'
    },
    {
      name: 'Vikram Singh',
      location: 'Nashik',
      rating: 5,
      text: 'Professional service with transparent pricing. The driver arrived on time and the vehicle was in excellent condition. Great value for money.',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      service: 'Local Rental'
    },
    {
      name: 'Meera Joshi',
      location: 'Mumbai',
      rating: 5,
      text: 'Outstanding customer service! They helped me with last-minute booking changes and the driver was very accommodating. Highly professional team.',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150',
      service: 'Emergency Booking'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-navy-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Star className="w-4 h-4 fill-current" />
            <span>Customer Reviews</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-gray-900 dark:text-white mb-6">
            What Our Customers
            <span className="block text-primary-600 dark:text-primary-400">Say About Us</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of satisfied customers who trust Saffari for their transportation needs
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl p-8 md:p-12 shadow-2xl"
              >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  {/* Content */}
                  <div className="space-y-6">
                    {/* Quote Icon */}
                    <div className="inline-flex p-3 bg-primary-100 dark:bg-primary-900/30 rounded-2xl">
                      <Quote className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <blockquote className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      "{testimonials[currentIndex].text}"
                    </blockquote>

                    {/* Service Badge */}
                    <div className="inline-flex items-center bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-4 py-2 rounded-full text-sm font-medium">
                      {testimonials[currentIndex].service}
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center space-x-4 pt-4">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg"
                      />
                      <div>
                        <h4 className="text-xl font-display font-bold text-gray-900 dark:text-white">
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          {testimonials[currentIndex].location}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className="relative hidden lg:block">
                    <div className="relative">
                      <img
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        className="w-80 h-80 rounded-3xl object-cover shadow-2xl mx-auto"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-600/20 to-transparent rounded-3xl"></div>
                      
                      {/* Floating Elements */}
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl"
                      >
                        <div className="flex items-center space-x-2">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-bold text-gray-900 dark:text-white">4.8</span>
                        </div>
                      </motion.div>
                      
                      <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-4 -left-4 bg-primary-500 text-white rounded-2xl p-4 shadow-xl"
                      >
                        <div className="text-center">
                          <div className="font-bold text-lg">10K+</div>
                          <div className="text-xs opacity-90">Happy Customers</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary-500 w-8'
                      : 'bg-gray-300 dark:bg-gray-600 hover:bg-primary-300 dark:hover:bg-primary-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600"
            >
              <ChevronRight className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20"
        >
          {[
            { number: '10,000+', label: 'Happy Customers' },
            { number: '4.8★', label: 'Average Rating' },
            { number: '50,000+', label: 'Rides Completed' },
            { number: '24/7', label: 'Support Available' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-display font-bold text-primary-600 dark:text-primary-400 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;