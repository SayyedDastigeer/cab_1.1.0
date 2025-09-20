/*
  # Create cities and routes tables

  1. New Tables
    - `cities`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `created_at` (timestamp)
    - `routes`
      - `id` (uuid, primary key)
      - `from_city` (text)
      - `to_city` (text)
      - `price_4_seater` (numeric)
      - `price_6_seater` (numeric)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to manage data

  3. Initial Data
    - Insert default cities
    - Insert default routes with pricing
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
  price_4_seater numeric NOT NULL,
  price_6_seater numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(from_city, to_city)
);

-- Enable RLS
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Create policies for cities
CREATE POLICY "Cities are viewable by everyone"
  ON cities
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Cities can be managed by authenticated users"
  ON cities
  FOR ALL
  TO authenticated
  USING (true);

-- Create policies for routes
CREATE POLICY "Routes are viewable by everyone"
  ON routes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Routes can be managed by authenticated users"
  ON routes
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default cities
INSERT INTO cities (name) VALUES
  ('Mumbai'),
  ('Delhi'),
  ('Bangalore'),
  ('Chennai'),
  ('Kolkata'),
  ('Hyderabad'),
  ('Pune'),
  ('Ahmedabad'),
  ('Jaipur'),
  ('Surat'),
  ('Lucknow'),
  ('Kanpur'),
  ('Nagpur'),
  ('Indore'),
  ('Thane'),
  ('Bhopal'),
  ('Visakhapatnam'),
  ('Pimpri-Chinchwad'),
  ('Patna'),
  ('Vadodara')
ON CONFLICT (name) DO NOTHING;

-- Insert default routes
INSERT INTO routes (from_city, to_city, price_4_seater, price_6_seater) VALUES
  ('Mumbai', 'Delhi', 8500, 10500),
  ('Mumbai', 'Bangalore', 7500, 9500),
  ('Mumbai', 'Chennai', 8000, 10000),
  ('Mumbai', 'Kolkata', 9000, 11000),
  ('Mumbai', 'Hyderabad', 6500, 8500),
  ('Mumbai', 'Pune', 2500, 3500),
  ('Mumbai', 'Ahmedabad', 4500, 6000),
  ('Mumbai', 'Jaipur', 6000, 8000),
  ('Mumbai', 'Surat', 3500, 4500),
  ('Delhi', 'Mumbai', 8500, 10500),
  ('Delhi', 'Bangalore', 7000, 9000),
  ('Delhi', 'Chennai', 8500, 10500),
  ('Delhi', 'Kolkata', 6500, 8500),
  ('Delhi', 'Hyderabad', 6000, 8000),
  ('Delhi', 'Pune', 6500, 8500),
  ('Delhi', 'Ahmedabad', 5500, 7500),
  ('Delhi', 'Jaipur', 2500, 3500),
  ('Bangalore', 'Mumbai', 7500, 9500),
  ('Bangalore', 'Delhi', 7000, 9000),
  ('Bangalore', 'Chennai', 3500, 4500),
  ('Bangalore', 'Kolkata', 8000, 10000),
  ('Bangalore', 'Hyderabad', 4500, 6000),
  ('Bangalore', 'Pune', 5500, 7500)
ON CONFLICT (from_city, to_city) DO NOTHING;