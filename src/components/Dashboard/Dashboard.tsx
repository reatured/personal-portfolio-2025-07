import React, { useState, useEffect } from 'react';
import { Project } from '../../types/Project';
import EnhancedProjectEditor from './EnhancedProjectEditor';
import ImageUploader from './ImageUploader';
import DeploymentPanel from './DeploymentPanel';
import { SupabaseService } from '../../utils/supabase';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'images' | 'deploy'>('projects');

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      // Use Supabase for database persistence
      const loadedProjects = await SupabaseService.getProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to legacy data - convert to new format
      try {
        const { DataManager } = await import('../../utils/dataManager');
        const legacyProjects = DataManager.loadProjects();
        const convertedProjects = legacyProjects.map(legacy => ({
          ...legacy,
          slug: legacy.title.toLowerCase().replace(/\s+/g, '-'),
          tech_stack: legacy.techStack,
          page_layout: 'default' as const,
          order_index: parseInt(legacy.id),
          status: 'published' as const,
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        setProjects(convertedProjects);
      } catch (legacyError) {
        // Set empty array if all fallbacks fail
        setProjects([]);
      }
    }
  };

  const handleProjectSave = async (project: Partial<Project>) => {
    try {
      if (selectedProject?.id && selectedProject.id !== '') {
        // Update existing project
        await SupabaseService.updateProject(project.id!, project as Project);
      } else {
        // Create new project
        await SupabaseService.createProject(project as Project);
      }
      
      // Reload projects to get fresh data
      await loadProjects();
      setSelectedProject(null);
      setIsEditing(false);
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project: ' + (error as Error).message);
    }
  };

  const handleProjectDelete = async (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await SupabaseService.deleteProject(projectId);
        await loadProjects();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project: ' + (error as Error).message);
      }
    }
  };

  const handleNewProject = () => {
    setSelectedProject({
      id: '',
      title: '',
      description: '',
      markdown_content: '',
      slug: '',
      featured_image_url: '',
      hover_image_url: '',
      tech_stack: [],
      page_layout: 'default',
      status: 'draft',
      featured: false,
      order_index: projects.length,
      tags: [],
      live_url: '',
      github_url: '',
      case_study_url: '',
      custom_css: '',
      meta_title: '',
      meta_description: '',
      meta_keywords: '',
      images: [],
      sections: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
    setIsEditing(true);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Portfolio Dashboard</h1>
        <div className="dashboard-nav">
          <button 
            className={activeTab === 'projects' ? 'active' : ''}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={activeTab === 'images' ? 'active' : ''}
            onClick={() => setActiveTab('images')}
          >
            Images
          </button>
          <button 
            className={activeTab === 'deploy' ? 'active' : ''}
            onClick={() => setActiveTab('deploy')}
          >
            Deploy
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {activeTab === 'projects' && (
          <div className="projects-panel">
            <div className="projects-list">
              <div className="projects-header">
                <h2>Projects ({projects.length})</h2>
                <button className="btn-primary" onClick={handleNewProject}>
                  Add New Project
                </button>
              </div>
              
              {projects.map(project => (
                <div key={project.id} className="project-item">
                  <div className="project-info">
                    <h3>{project.title}</h3>
                    <p>{project.description?.substring(0, 100) || 'No description'}...</p>
                    <div className="project-meta">
                      <span className={`status-badge ${project.status || 'draft'}`}>
                        {project.status || 'draft'}
                      </span>
                      {project.featured && <span className="featured-badge">⭐ Featured</span>}
                    </div>
                  </div>
                  <div className="project-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => {
                        setSelectedProject(project);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleProjectDelete(project.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {isEditing && selectedProject && (
              <EnhancedProjectEditor
                project={selectedProject}
                onSave={handleProjectSave}
                onCancel={() => {
                  setSelectedProject(null);
                  setIsEditing(false);
                }}
              />
            )}
          </div>
        )}

        {activeTab === 'images' && (
          <ImageUploader onImageUploaded={loadProjects} />
        )}

        {activeTab === 'deploy' && (
          <DeploymentPanel projects={projects} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;