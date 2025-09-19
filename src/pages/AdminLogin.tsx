import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, User, Lock, LogIn } from 'lucide-react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const { login, admin } = useAdmin();
  const { login: authLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (admin?.isAuthenticated || (user && user.role === 'admin')) {
      navigate('/admin/dashboard');
    }
  }, [admin, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try admin login first
      const adminResult = await login(formData.username, formData.password);
      if (adminResult.success) {
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
        return;
      }
      
      // Try auth login for regular users with admin role
      const authResult = await authLogin(formData.username, formData.password);
      if (authResult.success && user?.role === 'admin') {
        toast.success('Admin login successful!');
        navigate('/admin/dashboard');
        return;
      }

      toast.error('Invalid admin credentials');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex p-4 rounded-full bg-blue-100 dark:bg-blue-900/30 mb-6"
          >
            <Shield className="w-10 h-10 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Secure access to RideMax admin dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Username / Phone
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter username or phone number"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </>
            )}
          </motion.button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-2">
            Demo Admin Credentials:
          </p>
          <div className="text-xs text-gray-700 dark:text-gray-300 text-center space-y-1">
            <div>Username: <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">admin</span></div>
            <div>Password: <span className="font-mono bg-gray-200 dark:bg-gray-600 px-1 rounded">admin123</span></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;