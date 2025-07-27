export interface TechStack {
  category: string;
  items: string[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  thumbnail_url?: string;
  alt_text?: string;
  caption?: string;
  width?: number;
  height?: number;
  file_size?: number;
  format?: string;
  order_index: number;
  is_featured: boolean;
  display_type: 'gallery' | 'hero' | 'inline' | 'background';
  settings?: Record<string, any>;
  created_at: string;
}

export interface ProjectSection {
  id: string;
  project_id: string;
  title?: string;
  content: string;
  section_type: 'text' | 'images' | 'video' | 'code' | 'demo';
  order_index: number;
  layout: 'full-width' | 'two-column' | 'sidebar';
  settings?: Record<string, any>;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  markdown_content?: string;
  slug: string;
  
  // Images
  featured_image_url?: string;
  hover_image_url?: string;
  images?: ProjectImage[];
  
  // Tech stack
  tech_stack: TechStack[];
  
  // Links
  live_url?: string;
  github_url?: string;
  case_study_url?: string;
  
  // Page customization
  page_layout: 'default' | 'gallery' | 'case-study' | 'demo';
  custom_css?: string;
  page_settings?: Record<string, any>;
  
  // SEO & metadata
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  tags?: string[];
  
  // Organization
  order_index: number;
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  
  // Sections for complex layouts
  sections?: ProjectSection[];
  
  // Timestamps
  created_at: string;
  updated_at: string;
  published_at?: string;
}

// Legacy interface for backward compatibility
export interface LegacyProject {
  id: string;
  title: string;
  description: string;
  techStack: TechStack[];
  imagePath: string;
  hoverImagePath?: string;
  link: string;
}