import React, { useState } from 'react';
import { Project } from '../../../types/Project';
import { MarkdownContent } from '../ProjectPage';
import ImageGallery from '../ImageGallery';

interface GalleryLayoutProps {
  project: Project;
  markdownContent: string;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({ project, markdownContent }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gallery' | 'details'>('gallery');

  const galleryImages = project.images?.filter(img => 
    img.display_type === 'gallery' || img.display_type === 'hero'
  ) || [];

  const heroImage = project.images?.find(img => img.display_type === 'hero') || 
                   project.images?.[0];

  return (
    <div className="gallery-layout">
      {/* Full-width Hero Image */}
      {heroImage && (
        <div className="gallery-hero">
          <img 
            src={heroImage.url} 
            alt={heroImage.alt_text || project.title}
            loading="eager"
          />
          <div className="hero-overlay">
            <h1 className="project-title">{project.title}</h1>
            <p className="project-subtitle">{project.description}</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <nav className="gallery-nav">
        <button 
          className={`nav-tab ${activeTab === 'gallery' ? 'active' : ''}`}
          onClick={() => setActiveTab('gallery')}
        >
          🖼️ Gallery ({galleryImages.length})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📋 Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          🔧 Technical Details
        </button>
      </nav>

      {/* Tab Content */}
      <div className="gallery-content">
        {activeTab === 'gallery' && (
          <div className="gallery-tab">
            {galleryImages.length > 0 ? (
              <ImageGallery 
                images={galleryImages} 
                projectTitle={project.title}
                layout="masonry"
              />
            ) : (
              <div className="no-images">
                <p>No gallery images available for this project.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              <div className="overview-content">
                <MarkdownContent content={markdownContent} />
              </div>
              <div className="overview-sidebar">
                {/* Quick Info */}
                <div className="quick-info">
                  <h3>Project Info</h3>
                  <div className="info-item">
                    <span className="info-label">Status:</span>
                    <span className={`info-value status-${project.status}`}>
                      {project.status}
                    </span>
                  </div>
                  {project.created_at && (
                    <div className="info-item">
                      <span className="info-label">Created:</span>
                      <span className="info-value">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div className="info-item">
                      <span className="info-label">Tags:</span>
                      <div className="tags-list">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="tag">{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tech Stack */}
                <div className="tech-stack-sidebar">
                  <h3>Tech Stack</h3>
                  {project.tech_stack.map((tech, index) => (
                    <div key={index} className="tech-category">
                      <h4>{tech.category}</h4>
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
          </div>
        )}

        {activeTab === 'details' && (
          <div className="details-tab">
            {/* Project Sections */}
            {project.sections && project.sections.length > 0 ? (
              <div className="project-sections">
                {project.sections
                  .sort((a, b) => a.order_index - b.order_index)
                  .map(section => (
                    <div 
                      key={section.id} 
                      className={`project-section section-${section.section_type}`}
                    >
                      {section.title && (
                        <h2 className="section-title">{section.title}</h2>
                      )}
                      <div className="section-content">
                        <MarkdownContent content={section.content} />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-details">
                <h3>Technical Implementation</h3>
                <MarkdownContent content={markdownContent} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Counter */}
      {activeTab === 'gallery' && galleryImages.length > 0 && (
        <div className="image-counter">
          <span>{galleryImages.length} images in gallery</span>
        </div>
      )}
    </div>
  );
};

export default GalleryLayout;