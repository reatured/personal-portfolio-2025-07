import React from 'react';
import { Project } from '../../../types/Project';
import { MarkdownContent } from '../ProjectPage';
import ImageGallery from '../ImageGallery';

interface DefaultLayoutProps {
  project: Project;
  markdownContent: string;
}

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ project, markdownContent }) => {
  return (
    <div className="default-layout">
      {/* Hero Section */}
      <header className="project-hero">
        {project.featured_image_url && (
          <div className="hero-image">
            <img 
              src={project.featured_image_url} 
              alt={project.title}
              loading="eager"
            />
          </div>
        )}
        <div className="hero-content">
          <h1 className="project-title">{project.title}</h1>
          <p className="project-description">{project.description}</p>
          
          {/* Tech Stack */}
          <div className="tech-stack">
            <h3>Tech Stack</h3>
            <div className="tech-grid">
              {project.tech_stack.map((tech, index) => (
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
        </div>
      </header>

      {/* Main Content */}
      <section className="project-main">
        <div className="content-container">
          <MarkdownContent content={markdownContent} />
        </div>
      </section>

      {/* Image Gallery */}
      {project.images && project.images.length > 0 && (
        <section className="project-gallery-section">
          <h2>Project Gallery</h2>
          <ImageGallery 
            images={project.images} 
            projectTitle={project.title}
          />
        </section>
      )}

      {/* Project Sections */}
      {project.sections && project.sections.length > 0 && (
        <section className="project-sections">
          {project.sections
            .sort((a, b) => a.order_index - b.order_index)
            .map(section => (
              <div 
                key={section.id} 
                className={`project-section section-${section.section_type} layout-${section.layout}`}
              >
                {section.title && (
                  <h2 className="section-title">{section.title}</h2>
                )}
                <div className="section-content">
                  <MarkdownContent content={section.content} />
                </div>
              </div>
            ))}
        </section>
      )}
    </div>
  );
};

export default DefaultLayout;