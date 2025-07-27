import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { Project } from '../../types/Project';
import { SupabaseService } from '../../utils/supabase';
import ImageGallery from './ImageGallery';
import DefaultLayout from './layouts/DefaultLayout';
import GalleryLayout from './layouts/GalleryLayout';
import CaseStudyLayout from './layouts/CaseStudyLayout';
import DemoLayout from './layouts/DemoLayout';
import './ProjectPage.css';

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Project not found');
      setLoading(false);
      return;
    }

    loadProject(slug);
  }, [slug]);

  const loadProject = async (projectSlug: string) => {
    try {
      setLoading(true);
      const projectData = await SupabaseService.getProject(projectSlug);
      
      if (!projectData) {
        setError('Project not found');
        return;
      }

      setProject(projectData);
    } catch (err) {
      console.error('Error loading project:', err);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="project-page-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="project-page-error">
        <div className="error-content">
          <h1>😞 Project Not Found</h1>
          <p>{error || 'The project you\'re looking for doesn\'t exist.'}</p>
          <Link to="/" className="back-link">
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  // Render different layouts based on project.page_layout
  const renderLayout = () => {
    const commonProps = {
      project,
      markdownContent: project.markdown_content || project.description
    };

    switch (project.page_layout) {
      case 'gallery':
        return <GalleryLayout {...commonProps} />;
      case 'case-study':
        return <CaseStudyLayout {...commonProps} />;
      case 'demo':
        return <DemoLayout {...commonProps} />;
      default:
        return <DefaultLayout {...commonProps} />;
    }
  };

  return (
    <div className="project-page">
      {/* Inject custom CSS for this project */}
      {project.custom_css && (
        <style dangerouslySetInnerHTML={{ __html: project.custom_css }} />
      )}
      
      {/* SEO Meta tags */}
      <div style={{ display: 'none' }}>
        <h1>{project.meta_title || project.title}</h1>
        <meta name="description" content={project.meta_description || project.description} />
        {project.tags && (
          <meta name="keywords" content={project.tags.join(', ')} />
        )}
      </div>

      {/* Navigation */}
      <nav className="project-nav">
        <Link to="/" className="back-link">
          ← Back to Portfolio
        </Link>
        <div className="project-meta">
          {project.status === 'draft' && (
            <span className="draft-badge">Draft</span>
          )}
          {project.featured && (
            <span className="featured-badge">Featured</span>
          )}
        </div>
      </nav>

      {/* Dynamic Layout Content */}
      <main className="project-content">
        {renderLayout()}
      </main>

      {/* Project Footer */}
      <footer className="project-footer">
        <div className="project-links">
          {project.live_url && (
            <a 
              href={project.live_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link live"
            >
              🚀 View Live Demo
            </a>
          )}
          {project.github_url && (
            <a 
              href={project.github_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link github"
            >
              🔗 View Source Code
            </a>
          )}
          {project.case_study_url && (
            <a 
              href={project.case_study_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link case-study"
            >
              📊 Read Case Study
            </a>
          )}
        </div>

        <div className="project-tags">
          {project.tags?.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project-timestamps">
          <time dateTime={project.created_at}>
            Created: {new Date(project.created_at).toLocaleDateString()}
          </time>
          {project.updated_at !== project.created_at && (
            <time dateTime={project.updated_at}>
              Updated: {new Date(project.updated_at).toLocaleDateString()}
            </time>
          )}
        </div>
      </footer>
    </div>
  );
};

// Shared Markdown component
export const MarkdownContent: React.FC<{ content: string; className?: string }> = ({ 
  content, 
  className = '' 
}) => (
  <div className={`markdown-content ${className}`}>
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
      components={{
        // Custom image renderer with caption support
        img: ({ node, ...props }) => (
          <figure className="markdown-image">
            <img {...props} loading="lazy" />
            {props.title && <figcaption>{props.title}</figcaption>}
          </figure>
        ),
        // Custom code block with syntax highlighting
        code: ({ node, inline, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="code-block">
              <div className="code-header">
                <span className="language">{match[1]}</span>
                <button 
                  className="copy-btn"
                  onClick={() => navigator.clipboard.writeText(String(children))}
                >
                  Copy
                </button>
              </div>
              <pre {...props} className={className}>
                <code>{children}</code>
              </pre>
            </div>
          ) : (
            <code className="inline-code" {...props}>
              {children}
            </code>
          );
        },
        // Custom link renderer
        a: ({ node, ...props }) => (
          <a 
            {...props} 
            target={props.href?.startsWith('http') ? '_blank' : undefined}
            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          />
        )
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default ProjectPage;