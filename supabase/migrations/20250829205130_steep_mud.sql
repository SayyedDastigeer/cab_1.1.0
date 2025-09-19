/*
  # Create customers table for authentication

  1. New Tables
    - `customers`
      - `id` (uuid, primary key)
      - `phone` (text, unique) - Customer's phone number for login
      - `password_hash` (text) - Hashed password for authentication
      - `name` (text, optional) - Customer's full name
      - `email` (text, optional) - Customer's email address
      - `created_at` (timestamp) - Account creation timestamp

  2. Security
    - Enable RLS on `customers` table
    - Add policy for customers to read their own data
    - Add policy for customers to update their own data
*/

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name text,
  email text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own data"
  ON customers
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data"
  ON customers
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Index for faster phone number lookups
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);