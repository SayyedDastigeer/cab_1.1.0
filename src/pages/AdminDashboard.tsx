import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Car, 
  DollarSign, 
  Settings, 
  LogOut, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_type: 'outstation' | 'mumbai-local';
  from_location: string;
  to_location: string;
  car_type: string;
  travel_date: string;
  travel_time: string;
  estimated_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

// --- PROMOTIONAL POST INTERFACE REMOVED ---

const AdminDashboard: React.FC = () => {
  const { admin, pricing, logout, updatePricing, addCity, removeCity, addRoute, updateRoute, deleteRoute } = useAdmin();
  const { fetchCitiesAndRoutes } = useAdmin();
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'pricing'>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  // promotionalPosts state removed
  const [isLoading, setIsLoading] = useState(true);
  const [editingPricing, setEditingPricing] = useState(false);
  const [tempPricing, setTempPricing] = useState(pricing);
  const [newCity, setNewCity] = useState('');
  const [newRoute, setNewRoute] = useState({ from: '', to: '', fourSeater: 0, sixSeater: 0 });
  const [editingRoute, setEditingRoute] = useState<string | null>(null);
  const [tempRoutes, setTempRoutes] = useState<{ [key: string]: { price_4_seater: number; price_6_seater: number } }>({});
  // newPost, editingPost states removed

  useEffect(() => {
    if (!admin?.isAuthenticated && !user) {
      navigate('/admin');
      return;
    }
    fetchBookings();
    // fetchPromotionalPosts() removed
    fetchCitiesAndRoutes();
  }, [admin, user, navigate]);

  useEffect(() => {
    setTempPricing(pricing);
  }, [pricing]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  };

  // fetchPromotionalPosts removed

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId ? { ...booking, status: status as any } : booking
      ));
      
      toast.success('Booking status updated');
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };

  const handleLogout = () => {
    if (admin?.isAuthenticated) {
      logout();
    } else {
      authLogout();
    }
    navigate('/');
  };

  const savePricing = () => {
    updatePricing(tempPricing);
    setEditingPricing(false);
    toast.success('Pricing updated successfully');
  };

  const handleAddCity = async () => {
    if (newCity.trim() && !pricing.cities.some(c => c.name === newCity.trim())) {
      const success = await addCity(newCity.trim());
      if (success) {
        setNewCity('');
      }
    }
  };

  const handleRemoveCity = async (cityId: string) => {
    if (confirm('Are you sure you want to remove this city?')) {
      await removeCity(cityId);
    }
  };

  const handleAddRoute = async () => {
    if (newRoute.from && newRoute.to && newRoute.fourSeater > 0 && newRoute.sixSeater > 0) {
      const success = await addRoute(newRoute.from, newRoute.to, newRoute.fourSeater, newRoute.sixSeater);
      if (success) {
        setNewRoute({ from: '', to: '', fourSeater: 0, sixSeater: 0 });
      }
    }
  };

  const handleUpdateRoute = async (routeId: string) => {
    const route = tempRoutes[routeId];
    if (route) {
      const success = await updateRoute(routeId, route.price_4_seater, route.price_6_seater);
      if (success) {
        setEditingRoute(null);
        setTempRoutes({});
      }
    }
  };

  const handleEditRoute = (routeId: string) => {
    const route = pricing.routes.find(r => r.id === routeId);
    if (route) {
      setTempRoutes({
        [routeId]: {
          price_4_seater: route.price_4_seater,
          price_6_seater: route.price_6_seater
        }
      });
      setEditingRoute(null);
    }
  };

  const handleDeleteRoute = async (routeId: string) => {
    if (confirm('Are you sure you want to delete this route?')) {
      await deleteRoute(routeId);
    }
  };

  // createPromotionalPost, updatePromotionalPost, deletePromotionalPost removed

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-yellow-600 bg-yellow-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return CheckCircle;
      case 'completed': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
    totalRevenue: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.estimated_price, 0)
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Welcome, {admin?.username || user?.name || 'Administrator'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'bookings', label: 'Bookings', icon: Car },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            // promotions removed from this array
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                  </div>
                  <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                    <Car className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</p>
                  </div>
                  <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Confirmed</p>
                    <p className="text-3xl font-bold text-green-600">{stats.confirmedBookings}</p>
                  </div>
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
                    <p className="text-3xl font-bold text-purple-600">₹{stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                    <DollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {bookings.slice(0, 5).map((booking) => {
                      const StatusIcon = getStatusIcon(booking.status);
                      return (
                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer_name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{booking.customer_phone}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">{booking.from_location}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">to {booking.to_location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(booking.travel_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            ₹{booking.estimated_price.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Bookings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Route</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Travel Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings.map((booking) => {
                    const StatusIcon = getStatusIcon(booking.status);
                    return (
                      <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                              <Users className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer_name}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {booking.customer_phone}
                              </div>
                              {booking.customer_email && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                  <Mail className="w-3 h-3 mr-1" />
                                  {booking.customer_email}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white capitalize">{booking.service_type.replace('-', ' ')}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{booking.car_type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            <div>
                              <div className="text-sm text-gray-900 dark:text-white">{booking.from_location}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">to {booking.to_location}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <div>
                              <div className="text-sm text-gray-900 dark:text-white">
                                {new Date(booking.travel_date).toLocaleDateString()}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{booking.travel_time}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={booking.status}
                            onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                            className={`text-xs font-medium rounded-full px-3 py-1 border-0 ${getStatusColor(booking.status)}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="text-gray-900 dark:text-white">₹{booking.estimated_price.toLocaleString()}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(booking.created_at).toLocaleDateString()}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-8">
            {/* Mumbai Local Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Mumbai Local Pricing</h3>
                {!editingPricing ? (
                  <button
                    onClick={() => setEditingPricing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Pricing</span>
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={savePricing}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingPricing(false);
                        setTempPricing(pricing);
                      }}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      4-Seater Rate (₹/km)
                    </label>
                    <input
                      type="number"
                      value={tempPricing.mumbaiLocal.fourSeaterRate}
                      onChange={(e) => setTempPricing({
                        ...tempPricing,
                        mumbaiLocal: {
                          ...tempPricing.mumbaiLocal,
                          fourSeaterRate: Number(e.target.value)
                        }
                      })}
                      disabled={!editingPricing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      6-Seater Rate (₹/km)
                    </label>
                    <input
                      type="number"
                      value={tempPricing.mumbaiLocal.sixSeaterRate}
                      onChange={(e) => setTempPricing({
                        ...tempPricing,
                        mumbaiLocal: {
                          ...tempPricing.mumbaiLocal,
                          sixSeaterRate: Number(e.target.value)
                        }
                      })}
                      disabled={!editingPricing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport 4-Seater Rate (₹/km)
                    </label>
                    <input
                      type="number"
                      value={tempPricing.mumbaiLocal.airportFourSeaterRate}
                      onChange={(e) => setTempPricing({
                        ...tempPricing,
                        mumbaiLocal: {
                          ...tempPricing.mumbaiLocal,
                          airportFourSeaterRate: Number(e.target.value)
                        }
                      })}
                      disabled={!editingPricing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Airport 6-Seater Rate (₹/km)
                    </label>
                    <input
                      type="number"
                      value={tempPricing.mumbaiLocal.airportSixSeaterRate}
                      onChange={(e) => setTempPricing({
                        ...tempPricing,
                        mumbaiLocal: {
                          ...tempPricing.mumbaiLocal,
                          airportSixSeaterRate: Number(e.target.value)
                        }
                      })}
                      disabled={!editingPricing}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                    />
                  </div>
                </div>
                
                {/* Pricing Info */}
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">Mumbai Local Pricing Structure</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                        • No base fare - customers pay only for distance traveled<br/>
                        • Separate rates for 4-seater and 6-seater vehicles<br/>
                        • Higher rates for airport transfers<br/>
                        • Minimum fare of ₹100 applies to all rides
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outstation Pricing */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Outstation Routes</h3>
              </div>
              <div className="p-6">
                {/* Add New Route */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Add New Route</h4>
                  <div className="grid md:grid-cols-4 gap-4">
                    <select
                      value={newRoute.from}
                      onChange={(e) => setNewRoute({ ...newRoute, from: e.target.value })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                    >
                      <option value="">From City</option>
                      {pricing.cities.map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                    <select
                      value={newRoute.to}
                      onChange={(e) => setNewRoute({ ...newRoute, to: e.target.value })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                    >
                      <option value="">To City</option>
                      {pricing.cities.filter(city => city.name !== newRoute.from).map(city => (
                        <option key={city.id} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="4-Seater Price"
                      value={newRoute.fourSeater || ''}
                      onChange={(e) => setNewRoute({ ...newRoute, fourSeater: Number(e.target.value) })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                    />
                    <input
                      type="number"
                      placeholder="6-Seater Price"
                      value={newRoute.sixSeater || ''}
                      onChange={(e) => setNewRoute({ ...newRoute, sixSeater: Number(e.target.value) })}
                      className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={handleAddRoute}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Route</span>
                  </button>
                </div>

                {/* Existing Routes */}
                <div className="space-y-4">
                  {pricing.routes.map((route) => (
                    <div key={route.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white">{route.from_city} → {route.to_city}</h4>
                      </div>
                      <div className="flex items-center space-x-4">
                        {editingRoute === route.id ? (
                          <>
                            <input
                              type="number"
                              value={tempRoutes[route.id]?.price_4_seater || route.price_4_seater}
                              onChange={(e) => setTempRoutes({
                                ...tempRoutes,
                                [route.id]: {
                                  ...tempRoutes[route.id],
                                  price_4_seater: Number(e.target.value),
                                  price_6_seater: tempRoutes[route.id]?.price_6_seater || route.price_6_seater
                                }
                              })}
                              className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                            />
                            <input
                              type="number"
                              value={tempRoutes[route.id]?.price_6_seater || route.price_6_seater}
                              onChange={(e) => setTempRoutes({
                                ...tempRoutes,
                                [route.id]: {
                                  price_4_seater: tempRoutes[route.id]?.price_4_seater || route.price_4_seater,
                                  price_6_seater: Number(e.target.value)
                                }
                              })}
                              className="w-24 p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-600 dark:text-white"
                            />
                            <button
                              onClick={() => handleUpdateRoute(route.id)}
                              className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingRoute(null);
                                setTempRoutes({});
                              }}
                              className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-gray-600 dark:text-gray-300">4-seater: ₹{route.price_4_seater}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">6-seater: ₹{route.price_6_seater}</span>
                            <button
                              onClick={() => {
                                setEditingRoute(route.id);
                                setTempRoutes({
                                  [route.id]: {
                                    price_4_seater: route.price_4_seater,
                                    price_6_seater: route.price_6_seater
                                  }
                                });
                              })}
                              className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteRoute(route.id)}
                              className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cities Management */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Cities</h3>
              </div>
              <div className="p-6">
                <div className="flex space-x-4 mb-6">
                  <input
                    type="text"
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Enter city name"
                    className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-600 dark:text-white"
                  />
                  <button
                    onClick={handleAddCity}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add City</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pricing.cities.map(city => (
                    <div key={city.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                      <span className="text-gray-900 dark:text-white">{city.name}</span>
                      <button
                        onClick={() => handleRemoveCity(city.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
