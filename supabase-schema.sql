-- ═══════════════════════════════════════════════════════════════
--  SmartDealsHub — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Posts Table ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id              uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title           text NOT NULL,
  slug            text NOT NULL UNIQUE,
  excerpt         text,
  content         text,
  cover_image     text,
  amazon_link     text,
  category        text,
  seo_title       text,
  seo_description text,
  read_time       int DEFAULT 1,
  is_published    boolean DEFAULT false,
  published_at    timestamptz,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now()
);

-- ── 2. Indexes ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS posts_slug_idx       ON posts (slug);
CREATE INDEX IF NOT EXISTS posts_category_idx   ON posts (category);
CREATE INDEX IF NOT EXISTS posts_published_idx  ON posts (is_published, created_at DESC);

-- ── 3. Row Level Security ─────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public: read published posts only
CREATE POLICY "Public can read published posts"
  ON posts FOR SELECT
  USING (is_published = true);

-- Authenticated (admin): full access
CREATE POLICY "Authenticated users have full access"
  ON posts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ── 4. Auto-update updated_at trigger ────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 5. Sample seed data (optional) ───────────────────────────
-- Uncomment and run after setup to see data on the site

-- INSERT INTO posts (title, slug, excerpt, content, category, cover_image, is_published, published_at) VALUES
-- (
--   'Best Wireless Earbuds Under $50 in 2025',
--   'best-wireless-earbuds-under-50-2025',
--   'We tested 12 pairs of budget wireless earbuds to find the absolute best sound quality for under $50.',
--   '<h2>Our Top Picks</h2><p>After 3 weeks of rigorous testing, we narrowed our list to these top performers...</p>',
--   'electronics',
--   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
--   true,
--   now()
-- );
