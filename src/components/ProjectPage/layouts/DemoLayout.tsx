import React, { useState } from 'react';
import { Project } from '../../../types/Project';
import { MarkdownContent } from '../ProjectPage';
import ImageGallery from '../ImageGallery';

interface DemoLayoutProps {
  project: Project;
  markdownContent: string;
}

const DemoLayout: React.FC<DemoLayoutProps> = ({ project, markdownContent }) => {
  const [activeDemo, setActiveDemo] = useState<'live' | 'video' | 'screenshots'>('live');

  return (
    <div className="demo-layout">
      {/* Hero Section with Live Demo */}
      <header className="demo-hero">
        <div className="demo-header">
          <h1 className="demo-title">{project.title}</h1>
          <p className="demo-subtitle">{project.description}</p>
          
          {/* Demo Actions */}
          <div className="demo-actions">
            {project.live_url && (
              <a 
                href={project.live_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="demo-btn primary"
              >
                🚀 Launch Live Demo
              </a>
            )}
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="demo-btn secondary"
              >
                📂 View Source
              </a>
            )}
          </div>
        </div>

        {/* Featured Demo Preview */}
        {project.featured_image_url && (
          <div className="demo-preview">
            <div className="preview-frame">
              <div className="frame-header">
                <div className="frame-controls">
                  <span className="control close"></span>
                  <span className="control minimize"></span>
                  <span className="control maximize"></span>
                </div>
                <div className="address-bar">
                  <span>{project.live_url || 'https://demo.example.com'}</span>
                </div>
              </div>
              <div className="frame-content">
                <img 
                  src={project.featured_image_url} 
                  alt={`${project.title} demo preview`}
                  loading="eager"
                />
                {project.live_url && (
                  <div className="preview-overlay">
                    <a 
                      href={project.live_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="overlay-link"
                    >
                      Click to interact with live demo
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Demo Navigation */}
      <nav className="demo-nav">
        <button 
          className={`demo-tab ${activeDemo === 'live' ? 'active' : ''}`}
          onClick={() => setActiveDemo('live')}
        >
          🌐 Live Demo
        </button>
        <button 
          className={`demo-tab ${activeDemo === 'screenshots' ? 'active' : ''}`}
          onClick={() => setActiveDemo('screenshots')}
        >
          📸 Screenshots ({project.images?.length || 0})
        </button>
        <button 
          className={`demo-tab ${activeDemo === 'video' ? 'active' : ''}`}
          onClick={() => setActiveDemo('video')}
        >
          🎥 Video Demo
        </button>
      </nav>

      {/* Demo Content */}
      <main className="demo-content">
        {activeDemo === 'live' && (
          <div className="live-demo-section">
            <div className="demo-grid">
              {/* Interactive Demo */}
              <div className="demo-panel">
                <h2>Try it yourself</h2>
                {project.live_url ? (
                  <iframe
                    src={project.live_url}
                    title={`${project.title} Live Demo`}
                    className="demo-iframe"
                    loading="lazy"
                  />
                ) : (
                  <div className="demo-placeholder">
                    <p>Live demo not available</p>
                    {project.featured_image_url && (
                      <img 
                        src={project.featured_image_url} 
                        alt="Demo preview"
                        className="placeholder-image"
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Demo Instructions */}
              <div className="demo-instructions">
                <h3>How to use this demo:</h3>
                <div className="instructions-content">
                  <MarkdownContent content={markdownContent} />
                </div>

                {/* Features List */}
                <div className="demo-features">
                  <h4>Key Features to try:</h4>
                  <ul className="features-list">
                    {project.tech_stack.flatMap(tech => tech.items).slice(0, 5).map((feature, index) => (
                      <li key={index} className="feature-item">
                        <span className="feature-icon">✨</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="demo-tech">
                  <h4>Built with:</h4>
                  <div className="tech-grid">
                    {project.tech_stack.map((tech, index) => (
                      <div key={index} className="tech-group">
                        <span className="tech-category">{tech.category}</span>
                        <div className="tech-items">
                          {tech.items.map((item, itemIndex) => (
                            <span key={itemIndex} className="tech-item">{item}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'screenshots' && (
          <div className="screenshots-section">
            <h2>Screenshots & Gallery</h2>
            {project.images && project.images.length > 0 ? (
              <ImageGallery 
                images={project.images} 
                projectTitle={project.title}
                layout="grid"
              />
            ) : (
              <div className="no-screenshots">
                <p>No screenshots available for this demo.</p>
              </div>
            )}
          </div>
        )}

        {activeDemo === 'video' && (
          <div className="video-demo-section">
            <h2>Video Walkthrough</h2>
            <div className="video-container">
              {/* Video placeholder - replace with actual video URL */}
              <div className="video-placeholder">
                <div className="placeholder-content">
                  <span className="video-icon">🎥</span>
                  <p>Video demo coming soon</p>
                  <p>In the meantime, try the live demo above!</p>
                </div>
              </div>
            </div>
            
            {/* Video Features */}
            <div className="video-features">
              <h3>What you'll see in the video:</h3>
              <ul>
                <li>Complete feature walkthrough</li>
                <li>User interaction examples</li>
                <li>Performance highlights</li>
                <li>Code explanations</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Demo Footer */}
      <footer className="demo-footer">
        <div className="demo-stats">
          <div className="stat">
            <span className="stat-value">{project.tech_stack.length}</span>
            <span className="stat-label">Technologies</span>
          </div>
          <div className="stat">
            <span className="stat-value">{project.images?.length || 0}</span>
            <span className="stat-label">Screenshots</span>
          </div>
          <div className="stat">
            <span className="stat-value">
              {project.status === 'published' ? 'Live' : 'In Development'}
            </span>
            <span className="stat-label">Status</span>
          </div>
        </div>

        <div className="demo-cta">
          <h3>Like what you see?</h3>
          <p>Check out the source code or get in touch to discuss similar projects.</p>
          <div className="cta-buttons">
            {project.github_url && (
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="cta-btn"
              >
                View Source Code
              </a>
            )}
            <a href="/#contact" className="cta-btn secondary">
              Get in Touch
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DemoLayout;