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

// New interface for the local fares table
interface LocalFare {
  id: string;
  service_area: string;
  normal_4_seater_rate_per_km: number;
  normal_6_seater_rate_per_km: number;
  airport_4_seater_rate_per_km: number;
  airport_6_seater_rate_per_km: number;
}

interface PricingConfig {
  mumbaiLocal: LocalFare | null; // Updated to use the new LocalFare interface
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
  fetchLocalFares: () => Promise<void>; // Added new method to fetch local fares
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
  mumbaiLocal: null, // Set to null initially, as it will be fetched from the database
  cities: [],
  routes: []
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('Saffari_admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    
    // Fetch all pricing data from the database on component mount
    fetchCitiesAndRoutes();
    fetchLocalFares();
  }, []);

  const fetchCitiesAndRoutes = async () => {
    try {
      const { data: cities, error: citiesError } = await supabase
        .from('cities')
        .select('*')
        .order('name');
      if (citiesError) throw citiesError;

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

  const fetchLocalFares = async () => {
    try {
      const { data: localFares, error } = await supabase
        .from('local_fares')
        .select('*')
        .eq('service_area', 'Mumbai Local')
        .single();
      
      if (error) throw error;
      
      setPricing(prev => ({
        ...prev,
        mumbaiLocal: localFares
      }));
    } catch (error) {
      console.error('Error fetching local fares:', error);
      toast.error('Failed to load local fares');
    }
  };

  const login = async (username: string, password: string) => {
    // This simple login should be replaced with a secure method
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
  
  // All other functions (addCity, removeCity, addRoute, etc.) remain unchanged
  // as they are correctly implemented to interact with their respective tables.
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
        cities: [...prev.cities, data as City]
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
        routes: [...prev.routes, data as Route]
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
        routes: prev.routes.map(r => r.id === routeId ? data as Route : r)
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


  const value = {
    admin,
    pricing,
    login,
    logout,
    updatePricing,
    addCity,
    removeCity,
    addRoute,
    updateRoute,
    deleteRoute,
    fetchCitiesAndRoutes,
    fetchLocalFares
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};