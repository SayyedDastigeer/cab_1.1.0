import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface RouteMapProps {
  pickup?: { lat: number; lon: number; address: string };
  drop?: { lat: number; lon: number; address: string };
  className?: string;
}

const RouteMap: React.FC<RouteMapProps> = ({ pickup, drop, className = '' }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  // For now, we'll show a static map preview
  // In production, you would integrate with a mapping library like Leaflet or Mapbox
  const getStaticMapUrl = () => {
    if (!pickup || !drop) return null;

    // Using a simple static map service (you can replace with your preferred provider)
    const center = {
      lat: (pickup.lat + drop.lat) / 2,
      lon: (pickup.lon + drop.lon) / 2
    };

    // This is a placeholder - replace with actual static map service
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-a+ff0000(${pickup.lon},${pickup.lat}),pin-s-b+0000ff(${drop.lon},${drop.lat})/${center.lon},${center.lat},12/400x300@2x?access_token=YOUR_MAPBOX_TOKEN`;
  };

  const staticMapUrl = getStaticMapUrl();

  if (!pickup && !drop) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-700 rounded-xl p-8 text-center ${className}`}>
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400">
          Select pickup and drop locations to see route preview
        </p>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
          <Navigation className="w-5 h-5 mr-2 text-blue-600" />
          Route Preview
        </h3>
      </div>
      
      <div className="relative">
        {staticMapUrl ? (
          <img
            src={staticMapUrl}
            alt="Route map"
            className="w-full h-64 object-cover"
            onError={(e) => {
              // Fallback to placeholder if map fails to load
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <p className="text-blue-700 dark:text-blue-300 font-medium">
                Map Preview
              </p>
            </div>
          </div>
        )}
        
        {/* Location markers overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {pickup && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              A: Pickup
            </div>
          )}
          {drop && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
              B: Drop
            </div>
          )}
        </div>
      </div>
      
      {/* Location details */}
      <div className="p-4 space-y-3">
        {pickup && (
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Pickup</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {pickup.address}
              </p>
            </div>
          </div>
        )}
        
        {drop && (
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white">Drop</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {drop.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteMap;