import React, { useState } from 'react';
import { Project } from '../types/Project';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a 
      href={project.link} 
      className="card-link"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-container">
        <div className="card-content">
          <div className="card-image-container">
            <div className="hover-image-container">
              {project.hoverImagePath && (
                <img 
                  className={`zoomable hover-image ${isHovered ? 'visible' : ''}`}
                  src={project.hoverImagePath} 
                  alt={`${project.title} hover`}
                />
              )}
              <img 
                className="zoomable base-image" 
                src={project.imagePath} 
                alt={project.title}
              />
            </div>
          </div>
          
          <div className="card-details">
            <h1 className="card-title">{project.title}</h1>
            <br />
            <p className="card-description">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{project.description}
            </p>
            <br />
            
            <h2 className="card-subtitle">Tech Stack:</h2>
            <br />
            <ul className="card-list">
              {project.techStack.map((tech, index) => (
                <li key={index}>
                  <b>{tech.category}</b>: {tech.items.join(', ')}
                </li>
              ))}
            </ul>
            <br />
            <span style={{ textDecoration: 'underline' }}>Read more</span>
          </div>
        </div>
      </div>
      <hr className="divider" />
    </a>
  );
};

export default ProjectCard;