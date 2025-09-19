import React, { createContext, useContext, useState, useEffect } from 'react';

interface Admin {
  id: string;
  username: string;
  isAuthenticated: boolean;
}

interface PricingConfig {
  outstation: {
    [key: string]: {
      '4-seater': number;
      '6-seater': number;
    };
  };
  mumbaiLocal: {
    fourSeaterRate: number;
    sixSeaterRate: number;
    airportFourSeaterRate: number;
    airportSixSeaterRate: number;
  };
  outstationSixSeaterSurcharge: number;
  cities: string[];
}

interface AdminContextType {
  admin: Admin | null;
  pricing: PricingConfig;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updatePricing: (newPricing: PricingConfig) => void;
  addCity: (city: string) => void;
  removeCity: (city: string) => void;
  addRoute: (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number) => void;
  updateRoute: (routeKey: string, fourSeaterPrice: number, sixSeaterPrice: number) => void;
  deleteRoute: (routeKey: string) => void;
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
  outstation: {
    'Mumbai-Pune': { '4-seater': 2500, '6-seater': 3500 },
    'Mumbai-Surat': { '4-seater': 3500, '6-seater': 4500 },
    'Mumbai-Nashik': { '4-seater': 2800, '6-seater': 3800 },
    'Pune-Surat': { '4-seater': 4000, '6-seater': 5000 },
    'Pune-Nashik': { '4-seater': 2200, '6-seater': 3200 },
    'Surat-Nashik': { '4-seater': 3200, '6-seater': 4200 }
  },
  mumbaiLocal: {
    fourSeaterRate: 15, // per km for 4-seater
    sixSeaterRate: 18, // per km for 6-seater
    airportFourSeaterRate: 18, // per km for 4-seater airport transfers
    airportSixSeaterRate: 22 // per km for 6-seater airport transfers
  },
  outstationSixSeaterSurcharge: 1000, // additional charge for 6-seater outstation cars
  cities: ['Mumbai', 'Pune', 'Surat', 'Nashik']
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [pricing, setPricing] = useState<PricingConfig>(defaultPricing);

  useEffect(() => {
    // Check for existing admin session
    const savedAdmin = localStorage.getItem('ridemax_admin');
    const savedPricing = localStorage.getItem('ridemax_pricing');
    
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
    
    if (savedPricing) {
      setPricing(JSON.parse(savedPricing));
    }
  }, []);

  const login = async (username: string, password: string) => {
    // Simple admin credentials (in production, this should be more secure)
    if (username === 'admin' && password === 'admin123') {
      const adminUser: Admin = {
        id: 'admin',
        username: 'Administrator',
        isAuthenticated: true
      };
      setAdmin(adminUser);
      localStorage.setItem('ridemax_admin', JSON.stringify(adminUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid admin credentials' };
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('ridemax_admin');
  };

  const updatePricing = (newPricing: PricingConfig) => {
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };

  const addCity = (city: string) => {
    const newPricing = {
      ...pricing,
      cities: [...pricing.cities, city]
    };
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };

  const removeCity = (city: string) => {
    const newPricing = {
      ...pricing,
      cities: pricing.cities.filter(c => c !== city)
    };
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };

  const addRoute = (fromCity: string, toCity: string, fourSeaterPrice: number, sixSeaterPrice: number) => {
    const routeKey = `${fromCity}-${toCity}`;
    const reverseRouteKey = `${toCity}-${fromCity}`;
    
    // Check if route already exists (in either direction)
    if (pricing.outstation[routeKey] || pricing.outstation[reverseRouteKey]) {
      throw new Error('Route already exists');
    }
    
    const newPricing = {
      ...pricing,
      outstation: {
        ...pricing.outstation,
        [routeKey]: {
          '4-seater': fourSeaterPrice,
          '6-seater': sixSeaterPrice
        }
      }
    };
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };

  const updateRoute = (routeKey: string, fourSeaterPrice: number, sixSeaterPrice: number) => {
    const newPricing = {
      ...pricing,
      outstation: {
        ...pricing.outstation,
        [routeKey]: {
          '4-seater': fourSeaterPrice,
          '6-seater': sixSeaterPrice
        }
      }
    };
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };

  const deleteRoute = (routeKey: string) => {
    const { [routeKey]: deletedRoute, ...remainingRoutes } = pricing.outstation;
    const newPricing = {
      ...pricing,
      outstation: remainingRoutes
    };
    setPricing(newPricing);
    localStorage.setItem('ridemax_pricing', JSON.stringify(newPricing));
  };
  return (
    <AdminContext.Provider value={{ admin, pricing, login, logout, updatePricing, addCity, removeCity, addRoute, updateRoute, deleteRoute }}>
      {children}
    </AdminContext.Provider>
  );
};