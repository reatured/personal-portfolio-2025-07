-- Enhanced Supabase Schema for Portfolio with Markdown & Multi-Images
-- Run this in your Supabase SQL Editor (FREE)

-- Projects table with enhanced features
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT, -- Short description for cards
  markdown_content TEXT, -- Full markdown content for project pages
  slug TEXT UNIQUE, -- URL-friendly identifier
  
  -- Main images
  featured_image_url TEXT,
  hover_image_url TEXT,
  
  -- Tech stack
  tech_stack JSONB,
  
  -- Links
  live_url TEXT,
  github_url TEXT,
  case_study_url TEXT,
  
  -- Page customization
  page_layout TEXT DEFAULT 'default', -- 'default', 'gallery', 'case-study', 'demo'
  custom_css TEXT, -- Custom CSS for this project page
  page_settings JSONB, -- Layout-specific settings
  
  -- SEO & metadata
  meta_title TEXT,
  meta_description TEXT,
  tags TEXT[],
  
  -- Organization
  order_index INTEGER,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published_at TIMESTAMP
);

-- Project images table (for galleries)
CREATE TABLE project_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Image data
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  caption TEXT,
  
  -- Image metadata
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  format TEXT, -- 'jpg', 'png', 'webp', etc.
  
  -- Organization
  order_index INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  
  -- Image settings
  display_type TEXT DEFAULT 'gallery', -- 'gallery', 'hero', 'inline', 'background'
  settings JSONB, -- Image-specific settings (lightbox, zoom, etc.)
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Project sections table (for complex layouts)
CREATE TABLE project_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Section data
  title TEXT,
  content TEXT, -- Markdown content
  section_type TEXT, -- 'text', 'images', 'video', 'code', 'demo'
  
  -- Layout
  order_index INTEGER DEFAULT 0,
  layout TEXT DEFAULT 'full-width', -- 'full-width', 'two-column', 'sidebar'
  
  -- Settings
  settings JSONB, -- Section-specific settings
  
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_order ON projects(order_index);
CREATE INDEX idx_project_images_project ON project_images(project_id);
CREATE INDEX idx_project_sections_project ON project_sections(project_id);

-- Enable Row Level Security (FREE security feature)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for portfolio viewing)
CREATE POLICY "Public projects are viewable" ON projects
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public project images are viewable" ON project_images
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_images.project_id 
      AND projects.status = 'published'
    )
  );

CREATE POLICY "Public project sections are viewable" ON project_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_sections.project_id 
      AND projects.status = 'published'
    )
  );

-- For now, allow all operations (add authentication later)
CREATE POLICY "Enable all operations" ON projects FOR ALL USING (true);
CREATE POLICY "Enable all operations on images" ON project_images FOR ALL USING (true);
CREATE POLICY "Enable all operations on sections" ON project_sections FOR ALL USING (true);

-- Enable real-time subscriptions (FREE feature)
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE project_images;
ALTER PUBLICATION supabase_realtime ADD TABLE project_sections;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update timestamps
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(trim(title), '[^a-zA-Z0-9\s]', '', 'g'));
END;
$$ language 'plpgsql';

-- Sample data for testing
INSERT INTO projects (
  title, 
  description, 
  markdown_content,
  slug,
  tech_stack,
  page_layout,
  status,
  order_index
) VALUES (
  '01 Hardware Store Smart Search',
  'A smart search tool to crawl Google Maps business data and help identify store leads around the world.',
  '# Hardware Store Smart Search

## Overview
When I worked for a hardware manufacturer, we were looking for a better way to find targeted customers (hardware stores) to purchase our stock. We built a smart search tool to crawl Google Maps business data and help identify store leads around the world.

## Features
- **Google Maps Integration**: Automated data crawling
- **Lead Scoring**: AI-powered store qualification
- **Geographic Mapping**: Visual representation of potential customers
- **Export Capabilities**: CSV and API exports for CRM integration

## Technical Implementation
```javascript
const searchStores = async (location, radius) => {
  const response = await googleMapsAPI.search({
    query: "hardware store",
    location,
    radius
  });
  return response.results.map(processStoreData);
};
```

## Results
- **500+ stores** identified in first month
- **30% increase** in qualified leads
- **$2M+ pipeline** generated through the tool',
  'hardware-store-smart-search',
  '[
    {"category": "Frontend", "items": ["React", "TypeScript"]},
    {"category": "Backend", "items": ["FastAPI", "PostgreSQL"]},
    {"category": "APIs", "items": ["Google Maps API", "Places API"]}
  ]'::jsonb,
  'case-study',
  'published',
  1
);

-- Sample project images
INSERT INTO project_images (
  project_id,
  url,
  alt_text,
  caption,
  display_type,
  order_index
) VALUES (
  (SELECT id FROM projects WHERE slug = 'hardware-store-smart-search'),
  '/images/projects/project-01.jpg',
  'Hardware Store Search Interface',
  'Main search interface showing geographic distribution of hardware stores',
  'hero',
  0
);