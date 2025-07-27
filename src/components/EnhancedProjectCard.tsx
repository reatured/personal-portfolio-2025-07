import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, LegacyProject } from '../types/Project';

interface EnhancedProjectCardProps {
  project: Project | LegacyProject;
}

const EnhancedProjectCard: React.FC<EnhancedProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  // Check if this is a new Project or legacy format
  const isNewProject = 'slug' in project;
  
  // Extract data with fallbacks for legacy projects
  const title = project.title;
  const description = project.description;
  
  const imageUrl = isNewProject 
    ? (project as Project).featured_image_url 
    : (project as LegacyProject).imagePath;
    
  const hoverImageUrl = isNewProject 
    ? (project as Project).hover_image_url 
    : (project as LegacyProject).hoverImagePath;
    
  const techStack = isNewProject 
    ? (project as Project).tech_stack 
    : (project as LegacyProject).techStack;
    
  const projectUrl = isNewProject 
    ? `/projects/${(project as Project).slug}`
    : (project as LegacyProject).link;

  const status = isNewProject ? (project as Project).status : 'published';
  const featured = isNewProject ? (project as Project).featured : false;

  return (
    <Link 
      to={projectUrl}
      className="card-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-container">
        {/* Status indicators */}
        {isNewProject && (
          <div className="card-badges">
            {featured && <span className="badge featured">⭐ Featured</span>}
            {status === 'draft' && <span className="badge draft">📝 Draft</span>}
          </div>
        )}

        <div className="card-content">
          <div className="card-image-container">
            <div className="hover-image-container">
              {hoverImageUrl && (
                <img 
                  className={`zoomable hover-image ${isHovered ? 'visible' : ''}`}
                  src={hoverImageUrl} 
                  alt={`${title} hover`}
                  loading="lazy"
                />
              )}
              {imageUrl && (
                <img 
                  className="zoomable base-image" 
                  src={imageUrl} 
                  alt={title}
                  loading="lazy"
                />
              )}
              {!imageUrl && (
                <div className="placeholder-image">
                  <span>📷</span>
                  <p>No image</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card-details">
            <h1 className="card-title">{title}</h1>
            
            <p className="card-description">
              {description}
            </p>
            
            <div className="card-tech-stack">
              <h3 className="card-subtitle">Tech Stack:</h3>
              <div className="tech-stack-grid">
                {techStack.map((tech, index) => (
                  <div key={index} className="tech-category">
                    <span className="tech-label">{tech.category}:</span>
                    <div className="tech-items">
                      {tech.items.map((item, itemIndex) => (
                        <span key={itemIndex} className="tech-item">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional info for new projects */}
            {isNewProject && (
              <div className="card-metadata">
                {(project as Project).tags && (project as Project).tags!.length > 0 && (
                  <div className="card-tags">
                    {(project as Project).tags!.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                    {(project as Project).tags!.length > 3 && (
                      <span className="tag-more">+{(project as Project).tags!.length - 3}</span>
                    )}
                  </div>
                )}
                
                <div className="card-links">
                  {(project as Project).live_url && (
                    <span className="link-indicator live" title="Live Demo Available">🚀</span>
                  )}
                  {(project as Project).github_url && (
                    <span className="link-indicator github" title="Source Code Available">💻</span>
                  )}
                  {(project as Project).case_study_url && (
                    <span className="link-indicator case-study" title="Case Study Available">📊</span>
                  )}
                </div>
              </div>
            )}
            
            <div className="card-action">
              <span className="read-more">
                {isNewProject ? 'View Project' : 'Read more'} →
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedProjectCard;