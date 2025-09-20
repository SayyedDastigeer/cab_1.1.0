import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface Admin {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

interface City {
  id: string;
  name: string;
}

interface Route {
  id: string;
  from_city: string;
  to_city: string;
  price_4_seater: number;
  price_6_seater: number;
}

interface PricingConfig {
  mumbaiLocal: {
    fourSeaterRate: number;
    sixSeaterRate: number;
    airportFourSeaterRate: number;
    airportSixSeaterRate: number;
  };
  cities: City[];
  routes: Route[];
}

interface AdminContextType {
  admin: Admin | null;
  pricing: PricingConfig;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePricing: (newPricing: PricingConfig) => void;
  addCity: (cityName: string) => Promise<boolean>;
  removeCity: (cityId: string) => Promise<boolean>;
  addRoute: (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number) => Promise<boolean>;
  updateRoute: (routeId: string, fourSeaterPrice: number, sixSeaterPrice: number) => Promise<boolean>;
  deleteRoute: (routeId: string) => Promise<boolean>;
  fetchCitiesAndRoutes: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const defaultPricing: PricingConfig = {
  mumbaiLocal: {
    fourSeaterRate: 15, // per km for 4-seater
    sixSeaterRate: 18, // per km for 6-seater
    airportFourSeaterRate: 18, // per km for 4-seater airport transfers
    airportSixSeaterRate: 22 // per km for 6-seater airport transfers
  },
  cities: [],
  routes: []
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);

  useEffect(() => {
    // Check for existing admin session
    const savedAdmin = localStorage.getItem('Saffari_admin');
    const savedPricing = localStorage.getItem('Saffari_mumbai_pricing');
    
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    
    if (savedPricing) {
      setPricing(JSON.parse(savedPricing));
    } else {
      // Fetch cities and routes from database
      fetchCitiesAndRoutes();
    }
  }, []);

  const fetchCitiesAndRoutes = async () => {
    try {
      // Fetch cities
      const { data: cities, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('name');

      if (citiesError) throw citiesError;

      // Fetch routes
      const { data: routes, error: routesError } = await supabase
        .from('routes')
        .select('*')
        .order('from_city, to_city');

      if (routesError) throw routesError;

      setPricing(prev => ({
        ...prev,
        cities: cities || [],
        routes: routes || []
      }));
    } catch (error) {
      console.error('Error fetching cities and routes:', error);
      toast.error('Failed to load cities and routes');
    }
  };

  const login = async (username: string, password: string) => {
    // Simple admin credentials (in production, this should be more secure)
    if (username === 'admin' && password === 'admin123') {
      const adminUser: Admin = {
        id: 'admin',
        username: 'Administrator',
        isAuthenticated: true
      };
      setAdmin(adminUser);
      localStorage.setItem('Saffari_admin', JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('Saffari_admin');
  };

  const updatePricing = (newPricing: PricingConfig) => {
    setPricing(newPricing);
    localStorage.setItem('Saffari_mumbai_pricing', JSON.stringify(newPricing));
  };

  const addCity = async (cityName: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .insert({ name: cityName })
        .select()
        .single();

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        cities: [...prev.cities, data]
      }));

      toast.success('City added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding city:', error);
      if (error.code === '23505') {
        toast.error('City already exists');
      } else {
        toast.error('Failed to add city');
      }
      return false;
    }
  };

  const removeCity = async (cityId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', cityId);

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        cities: prev.cities.filter(c => c.id !== cityId)
      }));

      toast.success('City removed successfully');
      return true;
    } catch (error) {
      console.error('Error removing city:', error);
      toast.error('Failed to remove city');
      return false;
    }
  };

  const addRoute = async (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .insert({
          from_city: fromCity,
          to_city: toCity,
          price_4_seater: fourSeaterPrice,
          price_6_seater: sixSeaterPrice
        })
        .select()
        .single();

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        routes: [...prev.routes, data]
      }));

      toast.success('Route added successfully');
      return true;
    } catch (error: any) {
      console.error('Error adding route:', error);
      if (error.code === '23505') {
        toast.error('Route already exists');
      } else {
        toast.error('Failed to add route');
      }
      return false;
    }
  };

  const updateRoute = async (routeId: string, fourSeaterPrice: number, sixSeaterPrice: number): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('routes')
        .update({
          price_4_seater: fourSeaterPrice,
          price_6_seater: sixSeaterPrice
        })
        .eq('id', routeId)
        .select()
        .single();

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        routes: prev.routes.map(r => r.id === routeId ? data : r)
      }));

      toast.success('Route updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating route:', error);
      toast.error('Failed to update route');
      return false;
    }
  };

  const deleteRoute = async (routeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('routes')
        .delete()
        .eq('id', routeId);

      if (error) throw error;

      setPricing(prev => ({
        ...prev,
        routes: prev.routes.filter(r => r.id !== routeId)
      }));

      toast.success('Route deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting route:', error);
      toast.error('Failed to delete route');
      return false;
    }
  };

  return (
    <AdminContext.Provider value={{ admin, pricing, login, logout, updatePricing, addCity, removeCity, addRoute, updateRoute, deleteRoute, fetchCitiesAndRoutes }}>
      {children}
    </AdminContext.Provider>
  );
};