/*
  # Create cities and routes tables for admin management

  1. New Tables
    - `cities`
      - `id` (uuid, primary key)
      - `name` (text, unique) - City name
      - `created_at` (timestamp) - Creation timestamp
    
    - `routes`
      - `id` (uuid, primary key)
      - `from_city` (text) - Origin city name
      - `to_city` (text) - Destination city name
      - `price_4_seater` (integer) - Price for 4-seater vehicle
      - `price_6_seater` (integer) - Price for 6-seater vehicle
      - `created_at` (timestamp) - Creation timestamp
      - `updated_at` (timestamp) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated admin operations

  3. Indexes
    - Index on city names for faster lookups
    - Unique constraint on route combinations
*/

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create routes table
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_city text NOT NULL,
  to_city text NOT NULL,
  price_4_seater integer NOT NULL,
  price_6_seater integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_city, to_city)
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Cities policies
CREATE POLICY "Allow public read of cities"
  ON cities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access to cities"
  ON cities
  FOR ALL
  TO authenticated
  USING (true);

-- Routes policies
CREATE POLICY "Allow public read of routes"
  ON routes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow admin full access to routes"
  ON routes
  FOR ALL
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cities_name ON cities(name);
CREATE INDEX IF NOT EXISTS idx_routes_from_to ON routes(from_city, to_city);

-- Trigger for routes updated_at
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default cities
INSERT INTO cities (name) VALUES 
  ('Mumbai'),
  ('Pune'),
  ('Surat'),
  ('Nashik')
ON CONFLICT (name) DO NOTHING;

-- Insert default routes
INSERT INTO routes (from_city, to_city, price_4_seater, price_6_seater) VALUES 
  ('Mumbai', 'Pune', 2500, 3500),
  ('Mumbai', 'Surat', 3500, 4500),
  ('Mumbai', 'Nashik', 2800, 3800),
  ('Pune', 'Surat', 4000, 5000),
  ('Pune', 'Nashik', 2200, 3200),
  ('Surat', 'Nashik', 3200, 4200)
ON CONFLICT (from_city, to_city) DO NOTHING;