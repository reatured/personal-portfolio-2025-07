import React, { useState, useEffect } from 'react';
import { Project } from '../../../types/Project';
import { MarkdownContent } from '../ProjectPage';
import ImageGallery from '../ImageGallery';

interface CaseStudyLayoutProps {
  project: Project;
  markdownContent: string;
}

const CaseStudyLayout: React.FC<CaseStudyLayoutProps> = ({ project, markdownContent }) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);

  // Calculate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const scrollTop = window.pageYOffset;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Table of contents from sections or markdown headers
  const sections = project.sections?.length ? 
    project.sections.sort((a, b) => a.order_index - b.order_index) :
    extractSections(markdownContent);

  return (
    <div className="case-study-layout">
      {/* Reading Progress Bar */}
      <div className="reading-progress">
        <div 
          className="progress-bar"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <header className="case-study-hero">
        <div className="hero-background">
          {project.featured_image_url && (
            <img 
              src={project.featured_image_url} 
              alt={project.title}
              className="hero-bg-image"
            />
          )}
          <div className="hero-overlay" />
        </div>
        <div className="hero-content">
          <h1 className="case-study-title">{project.title}</h1>
          <p className="case-study-subtitle">{project.description}</p>
          
          {/* Project Metrics */}
          <div className="project-metrics">
            <div className="metric">
              <span className="metric-label">Duration</span>
              <span className="metric-value">
                {calculateProjectDuration(project.created_at, project.updated_at)}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Type</span>
              <span className="metric-value">Case Study</span>
            </div>
            <div className="metric">
              <span className="metric-label">Status</span>
              <span className={`metric-value status-${project.status}`}>
                {project.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Table of Contents */}
      <nav className="case-study-toc">
        <div className="toc-container">
          <h3>Table of Contents</h3>
          <ul className="toc-list">
            {sections.map((section, index) => (
              <li key={index} className="toc-item">
                <a 
                  href={`#section-${index}`}
                  className={currentSection === index ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`section-${index}`)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {section.title || `Section ${index + 1}`}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="case-study-main">
        <div className="content-container">
          
          {/* Executive Summary */}
          <section className="executive-summary">
            <h2>Executive Summary</h2>
            <div className="summary-grid">
              <div className="summary-content">
                <p>{project.description}</p>
              </div>
              <div className="summary-sidebar">
                {/* Tech Stack */}
                <div className="tech-stack-summary">
                  <h4>Technologies Used</h4>
                  <div className="tech-tags">
                    {project.tech_stack.flatMap(tech => tech.items).map((item, index) => (
                      <span key={index} className="tech-tag">{item}</span>
                    ))}
                  </div>
                </div>
                
                {/* Links */}
                <div className="project-links-summary">
                  {project.live_url && (
                    <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="summary-link">
                      🚀 Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="summary-link">
                      🔗 Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Case Study Sections */}
          <div className="case-study-sections">
            {project.sections && project.sections.length > 0 ? (
              project.sections
                .sort((a, b) => a.order_index - b.order_index)
                .map((section, index) => (
                  <section 
                    key={section.id}
                    id={`section-${index}`}
                    className={`case-study-section section-${section.section_type}`}
                  >
                    {section.title && (
                      <h2 className="section-title">{section.title}</h2>
                    )}
                    <div className="section-content">
                      <MarkdownContent content={section.content} />
                    </div>
                  </section>
                ))
            ) : (
              <section id="section-0" className="case-study-section">
                <MarkdownContent content={markdownContent} />
              </section>
            )}
          </div>

          {/* Image Showcase */}
          {project.images && project.images.length > 0 && (
            <section className="case-study-gallery">
              <h2>Visual Documentation</h2>
              <ImageGallery 
                images={project.images} 
                projectTitle={project.title}
                layout="showcase"
              />
            </section>
          )}

          {/* Key Learnings */}
          <section className="key-learnings">
            <h2>Key Learnings & Impact</h2>
            <div className="learnings-grid">
              <div className="learning-item">
                <h3>🎯 Challenge</h3>
                <p>What was the main problem you were solving?</p>
              </div>
              <div className="learning-item">
                <h3>💡 Solution</h3>
                <p>How did you approach and solve it?</p>
              </div>
              <div className="learning-item">
                <h3>📈 Impact</h3>
                <p>What were the measurable results?</p>
              </div>
              <div className="learning-item">
                <h3>🔮 Future</h3>
                <p>What would you do differently next time?</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// Helper function to extract sections from markdown
const extractSections = (markdown: string) => {
  const lines = markdown.split('\n');
  const sections: { title: string; content: string }[] = [];
  let currentSection = { title: '', content: '' };
  
  lines.forEach(line => {
    if (line.startsWith('## ')) {
      if (currentSection.title) {
        sections.push(currentSection);
      }
      currentSection = { title: line.replace('## ', ''), content: '' };
    } else {
      currentSection.content += line + '\n';
    }
  });
  
  if (currentSection.title) {
    sections.push(currentSection);
  }
  
  return sections.length > 0 ? sections : [{ title: 'Overview', content: markdown }];
};

// Helper function to calculate project duration
const calculateProjectDuration = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) return `${diffDays} days`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks`;
  return `${Math.ceil(diffDays / 30)} months`;
};

export default CaseStudyLayout;