import React, { useState, useEffect } from 'react';
import { Project } from '../../types/Project';
import ProjectEditor from './ProjectEditor';
import ImageUploader from './ImageUploader';
import DeploymentPanel from './DeploymentPanel';
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
      // Use DataManager for local data persistence
      const { DataManager } = await import('../../utils/dataManager');
      const loadedProjects = DataManager.loadProjects();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      const { projects } = await import('../../data/projects');
      setProjects(projects);
    }
  };

  const saveProjects = async (updatedProjects: Project[]) => {
    try {
      const { DataManager } = await import('../../utils/dataManager');
      DataManager.saveProjects(updatedProjects);
      setProjects(updatedProjects);
      alert('Projects saved successfully!');
    } catch (error) {
      console.error('Error saving projects:', error);
      alert('Failed to save projects');
    }
  };

  const handleProjectSave = (project: Project) => {
    const updatedProjects = selectedProject?.id 
      ? projects.map(p => p.id === project.id ? project : p)
      : [...projects, { ...project, id: Date.now().toString() }];
    
    saveProjects(updatedProjects);
    setSelectedProject(null);
    setIsEditing(false);
  };

  const handleProjectDelete = (projectId: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedProjects = projects.filter(p => p.id !== projectId);
      saveProjects(updatedProjects);
    }
  };

  const handleNewProject = () => {
    setSelectedProject({
      id: '',
      title: '',
      description: '',
      techStack: [],
      imagePath: '',
      link: ''
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
                    <p>{project.description.substring(0, 100)}...</p>
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
              <ProjectEditor
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