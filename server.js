import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;

// ================= AUTOCOMPLETE =================
app.get('/api/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Missing query parameter' });
    }

    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${GOOGLE_MAPS_API_KEY}&components=country:in&types=geocode`;

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Places Autocomplete error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    const suggestions = await Promise.all(
      (data.predictions || []).slice(0, 5).map(async (prediction) => {
        // Get place details to fetch coordinates
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&fields=geometry&key=${GOOGLE_MAPS_API_KEY}`;
        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();
        
        return {
          name: prediction.description,
          lat: detailsData.result?.geometry?.location?.lat || 0,
          lng: detailsData.result?.geometry?.location?.lng || 0,
          place_id: prediction.place_id
        };
      })
    );

    res.json(suggestions);
  } catch (error) {
    console.error('Autocomplete Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch autocomplete suggestions', details: error.message });
  }
});

// ================= DISTANCE MATRIX =================
app.get('/api/distance', async (req, res) => {
  try {
    const { origins, destinations } = req.query;
    
    if (!origins || !destinations) {
      return res.status(400).json({ error: 'Missing required parameters: origins and destinations' });
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origins)}&destinations=${encodeURIComponent(destinations)}&mode=driving&units=metric&key=${GOOGLE_MAPS_API_KEY}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Distance Matrix API error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    if (data.status !== 'OK') {
      throw new Error(`Google Distance Matrix API error: ${data.status}`);
    }
    
    if (data.rows && data.rows.length > 0 && data.rows[0].elements && data.rows[0].elements.length > 0) {
      const element = data.rows[0].elements[0];
      
      if (element.status !== 'OK') {
        return res.status(404).json({ error: 'No route found between the specified locations' });
      }
      
      const distanceInKm = Math.round((element.distance.value / 1000) * 100) / 100;
      const durationInMinutes = Math.round(element.duration.value / 60);

      res.json({
        distance: distanceInKm,
        duration: durationInMinutes
      });
    } else {
      res.status(404).json({ error: 'No route found between the specified locations' });
    }
    
  } catch (error) {
    console.error('Google Distance Matrix proxy error:', error);
    res.status(500).json({ error: 'Failed to fetch route information', details: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});