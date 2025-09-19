// Google Maps API configuration and utilities
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface GooglePlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface GooglePlaceDetails {
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export interface GoogleAutocompleteResponse {
  predictions: GooglePlacePrediction[];
  status: string;
}

export interface GoogleDistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
      status: string;
    }>;
  }>;
  status: string;
}

// Autocomplete API for location search using Google Places
export const searchLocations = async (query: string, bias?: { lat: number; lon: number }): Promise<any[]> => {
  if (!query || query.length < 3) return [];

  try {
    let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in&types=geocode`;
    
    // Add location bias if provided
    if (bias) {
      url += `&location=${bias.lat},${bias.lon}&radius=50000`;
    }

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const data: GoogleAutocompleteResponse = await response.json();
    
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Get place details for each prediction to fetch coordinates
    const locationsWithCoords = await Promise.all(
      (data.predictions || []).slice(0, 5).map(async (prediction) => {
        try {
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();
          
          return {
            properties: {
              formatted: prediction.description,
              address_line1: prediction.structured_formatting.main_text,
              address_line2: prediction.structured_formatting.secondary_text,
              lat: detailsData.result?.geometry?.location?.lat || 0,
              lon: detailsData.result?.geometry?.location?.lng || 0,
              place_id: prediction.place_id,
            },
            geometry: {
              coordinates: [
                detailsData.result?.geometry?.location?.lng || 0,
                detailsData.result?.geometry?.location?.lat || 0
              ]
            }
          };
        } catch (error) {
          console.error('Error fetching place details:', error);
          return null;
        }
      })
    );

    return locationsWithCoords.filter(location => location !== null);
  } catch (error) {
    console.error('Error fetching locations from Google Places:', error);
    return [];
  }
};

// Distance calculation using Google Distance Matrix API
export const calculateRoute = async (
  pickup: { lat: number; lon: number },
  drop: { lat: number; lon: number }
): Promise<{ distance: number; duration: number } | null> => {
  try {
    const origins = `${pickup.lat},${pickup.lon}`;
    const destinations = `${drop.lat},${drop.lon}`;
    
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=driving&units=metric&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Google Distance Matrix API error: ${response.status}`);
    }

    const data: GoogleDistanceMatrixResponse = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Distance Matrix API error: ${data.status}`);
    }
    
    if (data.rows && data.rows.length > 0 && data.rows[0].elements && data.rows[0].elements.length > 0) {
      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        return null;
      }
      
      return {
        distance: Math.round((element.distance.value / 1000) * 100) / 100, // Convert to km with 2 decimal places
        duration: Math.round(element.duration.value / 60) // Convert to minutes
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error calculating route with Google Distance Matrix:', error);
    return null;
  }
};

// Fare calculation utilities (unchanged)
export const calculateFare = (
  distance: number, 
  isAirportTrip: boolean = false, 
  carType: '4-seater' | '6-seater' = '4-seater',
  rates: {
    fourSeaterRate: number;
    sixSeaterRate: number;
    airportFourSeaterRate: number;
    airportSixSeaterRate: number;
  }
): number => {
  let ratePerKm: number;
  
  if (isAirportTrip) {
    ratePerKm = carType === '4-seater' ? rates.airportFourSeaterRate : rates.airportSixSeaterRate;
  } else {
    ratePerKm = carType === '4-seater' ? rates.fourSeaterRate : rates.sixSeaterRate;
  }
  
  const totalFare = distance * ratePerKm;
  const minFare = 100; // Minimum fare
  
  return Math.max(totalFare, minFare);
};

export const getFareBreakdown = (
  distance: number, 
  isAirportTrip: boolean = false, 
  carType: '4-seater' | '6-seater' = '4-seater',
  rates: {
    fourSeaterRate: number;
    sixSeaterRate: number;
    airportFourSeaterRate: number;
    airportSixSeaterRate: number;
  }
) => {
  let ratePerKm: number;
  
  if (isAirportTrip) {
    ratePerKm = carType === '4-seater' ? rates.airportFourSeaterRate : rates.airportSixSeaterRate;
  } else {
    ratePerKm = carType === '4-seater' ? rates.fourSeaterRate : rates.sixSeaterRate;
  }
  
  const distanceFare = distance * ratePerKm;
  const minFare = 100;
  const total = Math.max(distanceFare, minFare);
  
  return {
    baseFare: 0, // No base fare anymore
    distanceFare: Math.round(distanceFare),
    carSurcharge: 0, // No car surcharge anymore
    ratePerKm,
    distance,
    carType,
    subtotal: Math.round(distanceFare),
    total: Math.round(total),
    isMinimumFare: total === minFare
  };
};

// Check if location is airport-related
export const isAirportLocation = (locationText: string): boolean => {
  const airportKeywords = [
    'airport', 'terminal', 'chhatrapati shivaji', 'csia', 'bom', 
    'mumbai airport', 'international airport', 'domestic terminal'
  ];
  
  return airportKeywords.some(keyword => 
    locationText.toLowerCase().includes(keyword.toLowerCase())
  );
};