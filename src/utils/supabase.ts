import { createClient } from '@supabase/supabase-js'
import { Project, ProjectImage, ProjectSection } from '../types/Project'

// Supabase configuration (FREE tier)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || ''
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database operations
export class SupabaseService {
  // Projects CRUD
  static async getProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        images:project_images(*),
        sections:project_sections(*)
      `)
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }

    return data || []
  }

  static async getProject(slug: string): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        images:project_images(*),
        sections:project_sections(*)
      `)
      .eq('slug', slug)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    return data
  }

  static async createProject(project: Partial<Project>): Promise<Project | null> {
    // Generate slug from title
    const slug = project.title?.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50)

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        ...project,
        slug,
        order_index: project.order_index ?? 999
      }])
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return null
    }

    return data
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return null
    }

    return data
  }

  static async deleteProject(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return false
    }

    return true
  }

  // Project Images CRUD
  static async addProjectImage(image: Omit<ProjectImage, 'id' | 'created_at'>): Promise<ProjectImage | null> {
    const { data, error } = await supabase
      .from('project_images')
      .insert([image])
      .select()
      .single()

    if (error) {
      console.error('Error adding project image:', error)
      return null
    }

    return data
  }

  static async updateProjectImage(id: string, updates: Partial<ProjectImage>): Promise<ProjectImage | null> {
    const { data, error } = await supabase
      .from('project_images')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project image:', error)
      return null
    }

    return data
  }

  static async deleteProjectImage(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('project_images')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project image:', error)
      return false
    }

    return true
  }

  static async reorderProjectImages(imageUpdates: { id: string; order_index: number }[]): Promise<boolean> {
    const promises = imageUpdates.map(({ id, order_index }) =>
      supabase
        .from('project_images')
        .update({ order_index })
        .eq('id', id)
    )

    try {
      await Promise.all(promises)
      return true
    } catch (error) {
      console.error('Error reordering images:', error)
      return false
    }
  }

  // Project Sections CRUD
  static async addProjectSection(section: Omit<ProjectSection, 'id' | 'created_at'>): Promise<ProjectSection | null> {
    const { data, error } = await supabase
      .from('project_sections')
      .insert([section])
      .select()
      .single()

    if (error) {
      console.error('Error adding project section:', error)
      return null
    }

    return data
  }

  static async updateProjectSection(id: string, updates: Partial<ProjectSection>): Promise<ProjectSection | null> {
    const { data, error } = await supabase
      .from('project_sections')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project section:', error)
      return null
    }

    return data
  }

  static async deleteProjectSection(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('project_sections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project section:', error)
      return false
    }

    return true
  }

  // Real-time subscriptions
  static subscribeToProjects(callback: (payload: any) => void) {
    return supabase
      .channel('projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' },
        callback
      )
      .subscribe()
  }

  static subscribeToProjectImages(projectId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`project_images_${projectId}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'project_images', filter: `project_id=eq.${projectId}` },
        callback
      )
      .subscribe()
  }

  // Migration helper (convert localStorage to Supabase)
  static async migrateFromLocalStorage(): Promise<boolean> {
    try {
      const localData = localStorage.getItem('portfolioProjects')
      if (!localData) return true

      const legacyProjects = JSON.parse(localData)
      
      const migratedProjects = legacyProjects.map((legacy: any, index: number) => ({
        title: legacy.title,
        description: legacy.description,
        markdown_content: legacy.description, // Use description as initial markdown
        tech_stack: legacy.techStack || legacy.tech_stack,
        featured_image_url: legacy.imagePath,
        hover_image_url: legacy.hoverImagePath,
        live_url: legacy.link,
        page_layout: 'default',
        status: 'published',
        featured: false,
        order_index: index
      }))

      const { error } = await supabase
        .from('projects')
        .insert(migratedProjects)

      if (error) {
        console.error('Migration error:', error)
        return false
      }

      // Backup localStorage data and clear it
      localStorage.setItem('portfolioProjects_backup', localData)
      localStorage.removeItem('portfolioProjects')
      
      console.log('Migration completed successfully')
      return true
    } catch (error) {
      console.error('Migration failed:', error)
      return false
    }
  }
}