/*
  # Create promotional posts table

  1. New Tables
    - `promotional_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, optional)
      - `image_url` (text, optional)
      - `button_text` (text, optional)
      - `button_link` (text, optional)
      - `is_active` (boolean, default true)
      - `display_order` (integer, for sorting)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `promotional_posts` table
    - Add policy for public read access
    - Add policy for authenticated admin operations
*/

CREATE TABLE IF NOT EXISTS promotional_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text,
  button_text text,
  button_link text,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE promotional_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read of active posts"
  ON promotional_posts
  FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "Allow admin full access"
  ON promotional_posts
  FOR ALL
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS idx_promotional_posts_active ON promotional_posts (is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_promotional_posts_created_at ON promotional_posts (created_at DESC);

CREATE TRIGGER update_promotional_posts_updated_at
  BEFORE UPDATE ON promotional_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();