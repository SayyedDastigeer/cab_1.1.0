/*
  # Create bookings table for managing cab reservations

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `customer_id` (uuid) - Reference to customer (can be 'guest' for non-registered users)
      - `customer_name` (text) - Customer's full name
      - `customer_phone` (text) - Customer's phone number
      - `customer_email` (text, optional) - Customer's email address
      - `service_type` (enum) - Either 'outstation' or 'mumbai-local'
      - `from_location` (text) - Pickup location
      - `to_location` (text) - Drop-off location
      - `car_type` (text) - Type of car requested
      - `travel_date` (date) - Date of travel
      - `travel_time` (time) - Time of travel
      - `estimated_price` (integer) - Estimated price in rupees
      - `status` (enum) - Booking status: pending, confirmed, completed, cancelled
      - `created_at` (timestamp) - Booking creation time
      - `updated_at` (timestamp) - Last update time

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for customers to read their own bookings
    - Add policy for customers to create new bookings
    - Add policy for admin access (will be handled by service role)

  3. Indexes
    - Index on customer_phone for faster lookups
    - Index on status for filtering
    - Index on created_at for sorting
*/

-- Create enum types
DO $$ BEGIN
  CREATE TYPE service_type_enum AS ENUM ('outstation', 'mumbai-local');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE booking_status_enum AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text NOT NULL DEFAULT 'guest',
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  service_type service_type_enum NOT NULL,
  from_location text NOT NULL,
  to_location text NOT NULL,
  car_type text NOT NULL,
  travel_date date NOT NULL,
  travel_time time NOT NULL,
  estimated_price integer NOT NULL DEFAULT 0,
  status booking_status_enum NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Customers can read their own bookings
CREATE POLICY "Customers can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = customer_id);

-- Customers can create new bookings
CREATE POLICY "Customers can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid()::text = customer_id);

-- Allow anonymous users to create bookings (guest bookings)
CREATE POLICY "Allow guest bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (customer_id = 'guest');

-- Allow anonymous users to read guest bookings (limited)
CREATE POLICY "Allow guest booking reads"
  ON bookings
  FOR SELECT
  TO anon
  USING (customer_id = 'guest');

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_phone ON bookings(customer_phone);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_date ON bookings(travel_date);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();