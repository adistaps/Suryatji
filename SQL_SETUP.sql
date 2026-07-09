-- ============================================
-- CATEGORIES TABLE
-- ============================================
-- If categories table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon_url VARCHAR(255),
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

-- ============================================
-- PRODUCTS TABLE - UPDATE EXISTING
-- ============================================
-- Add missing columns to products table if they don't exist:
ALTER TABLE products
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS rating NUMERIC(3, 2) DEFAULT 5.0,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;

-- Make sure category_id is properly linked to categories table
ALTER TABLE products
DROP CONSTRAINT IF NOT EXISTS products_category_id_fkey,
ADD CONSTRAINT products_category_id_fkey
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- ============================================
-- SAMPLE DATA - CATEGORIES
-- ============================================
-- Insert sample categories for Suryatji Coffee
INSERT INTO categories (name, slug, description, is_active, display_order) VALUES
('Arabica Green', 'arabica-green', 'Green bean arabica coffee', true, 1),
('Arabica Roasted', 'arabica-roasted', 'Roasted arabica coffee', true, 2),
('Black Coffee', 'black-coffee', 'Dark roasted black coffee', true, 3),
('Mixed Sorts', 'mixed-sorts', 'Mixed coffee varieties', true, 4),
('Robusta Roasted', 'robusta-roasted', 'Roasted robusta coffee', true, 5)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ENABLE RLS (Row Level Security) - OPTIONAL
-- ============================================
-- If you want to enable RLS for security:
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust based on your auth setup):
CREATE POLICY "Allow public read categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Allow public read products" ON products
  FOR SELECT USING (is_active = true);

-- Uncomment these if you have admin auth setup:
-- CREATE POLICY "Allow admin all access" ON categories
--   FOR ALL USING (auth.jwt() -> 'role' = '"admin"');
-- 
-- CREATE POLICY "Allow admin all access" ON products
--   FOR ALL USING (auth.jwt() -> 'role' = '"admin"');
