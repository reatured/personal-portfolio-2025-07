import React, { useState, useEffect } from 'react';
import { Project, ProjectImage, TechStack } from '../../types/Project';
import MarkdownEditor from './MarkdownEditor';
import MultiImageUploader from './MultiImageUploader';
import JsonEditor from './JsonEditor';
import './EnhancedProjectEditor.css';

interface EnhancedProjectEditorProps {
  project: Partial<Project>;
  onSave: (project: Partial<Project>) => void;
  onCancel: () => void;
}

const EnhancedProjectEditor: React.FC<EnhancedProjectEditorProps> = ({ 
  project, 
  onSave, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    markdown_content: '',
    slug: '',
    tech_stack: [],
    page_layout: 'default',
    status: 'draft',
    featured: false,
    order_index: 999,
    tags: [],
    images: [],
    live_url: '',
    github_url: '',
    case_study_url: '',
    meta_title: '',
    meta_description: '',
    custom_css: '',
    page_settings: {},
    ...project
  });

  const [techStackInput, setTechStackInput] = useState({ category: '', items: '' });
  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'images' | 'layout' | 'seo' | 'json'>('basic');

  useEffect(() => {
    setFormData({ ...formData, ...project });
  }, [project]);

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-generate slug from title
    if (field === 'title' && typeof value === 'string') {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleTechStackAdd = () => {
    if (techStackInput.category && techStackInput.items) {
      const items = techStackInput.items.split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        tech_stack: [...(prev.tech_stack || []), { category: techStackInput.category, items }]
      }));
      setTechStackInput({ category: '', items: '' });
    }
  };

  const handleTechStackRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tech_stack: prev.tech_stack?.filter((_, i) => i !== index) || []
    }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      const newTags = tagInput.split(',').map(tag => tag.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), ...newTags]
      }));
      setTagInput('');
    }
  };

  const handleTagRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  const handleImagesUpdate = (images: ProjectImage[]) => {
    setFormData(prev => ({
      ...prev,
      images
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields (Title and Description)');
      return;
    }

    // Auto-generate meta fields if not provided
    const finalData = {
      ...formData,
      meta_title: formData.meta_title || formData.title,
      meta_description: formData.meta_description || formData.description,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    onSave(finalData as Project);
  };

  const renderBasicTab = () => (
    <div className="tab-content">
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="title">Project Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., 01 Hardware Store Smart Search"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="slug">URL Slug</label>
          <input
            id="slug"
            type="text"
            value={formData.slug || ''}
            onChange={(e) => handleInputChange('slug', e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description">Short Description *</label>
        <textarea
          id="description"
          value={formData.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          placeholder="Brief description for project cards and SEO..."
          rows={3}
          required
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={formData.status || 'draft'}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="order_index">Display Order</label>
          <input
            id="order_index"
            type="number"
            value={formData.order_index || 999}
            onChange={(e) => handleInputChange('order_index', parseInt(e.target.value))}
            min="0"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.featured || false}
              onChange={(e) => handleInputChange('featured', e.target.checked)}
            />
            Featured Project
          </label>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="form-group">
        <label>Tech Stack</label>
        {formData.tech_stack?.map((tech, index) => (
          <div key={index} className="tech-stack-item">
            <span className="tech-category">{tech.category}:</span>
            <span className="tech-items">{tech.items.join(', ')}</span>
            <button
              type="button"
              onClick={() => handleTechStackRemove(index)}
              className="remove-btn"
            >
              Remove
            </button>
          </div>
        ))}
        
        <div className="tech-stack-input">
          <input
            type="text"
            value={techStackInput.category}
            onChange={(e) => setTechStackInput(prev => ({ ...prev, category: e.target.value }))}
            placeholder="Category (e.g., Frontend)"
          />
          <input
            type="text"
            value={techStackInput.items}
            onChange={(e) => setTechStackInput(prev => ({ ...prev, items: e.target.value }))}
            placeholder="Technologies (comma-separated)"
          />
          <button
            type="button"
            onClick={handleTechStackAdd}
            className="add-btn"
          >
            Add
          </button>
        </div>
      </div>

      {/* Links */}
      <div className="form-group">
        <label>Project Links</label>
        <div className="links-grid">
          <input
            type="url"
            value={formData.live_url || ''}
            onChange={(e) => handleInputChange('live_url', e.target.value)}
            placeholder="🚀 Live Demo URL"
          />
          <input
            type="url"
            value={formData.github_url || ''}
            onChange={(e) => handleInputChange('github_url', e.target.value)}
            placeholder="🔗 GitHub Repository URL"
          />
          <input
            type="url"
            value={formData.case_study_url || ''}
            onChange={(e) => handleInputChange('case_study_url', e.target.value)}
            placeholder="📊 Case Study URL"
          />
        </div>
      </div>
    </div>
  );

  const renderContentTab = () => (
    <div className="tab-content">
      <div className="form-group">
        <label>Full Project Content (Markdown)</label>
        <MarkdownEditor
          value={formData.markdown_content || ''}
          onChange={(value) => handleInputChange('markdown_content', value)}
          placeholder="Write your detailed project description using markdown..."
          height={500}
        />
      </div>
    </div>
  );

  const renderImagesTab = () => (
    <div className="tab-content">
      <div className="form-group">
        <label>Project Images</label>
        <MultiImageUploader
          images={formData.images || []}
          onImagesUpdate={handleImagesUpdate}
          projectId={formData.id}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="featured_image_url">Featured Image URL</label>
          <input
            id="featured_image_url"
            type="url"
            value={formData.featured_image_url || ''}
            onChange={(e) => handleInputChange('featured_image_url', e.target.value)}
            placeholder="Main project image URL"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="hover_image_url">Hover Image URL</label>
          <input
            id="hover_image_url"
            type="url"
            value={formData.hover_image_url || ''}
            onChange={(e) => handleInputChange('hover_image_url', e.target.value)}
            placeholder="Image shown on hover (optional)"
          />
        </div>
      </div>
    </div>
  );

  const renderLayoutTab = () => (
    <div className="tab-content">
      <div className="form-group">
        <label htmlFor="page_layout">Page Layout</label>
        <select
          id="page_layout"
          value={formData.page_layout || 'default'}
          onChange={(e) => handleInputChange('page_layout', e.target.value)}
        >
          <option value="default">Default Layout</option>
          <option value="gallery">Gallery Layout</option>
          <option value="case-study">Case Study Layout</option>
          <option value="demo">Demo Layout</option>
        </select>
        <small className="help-text">
          Choose how this project page should be displayed
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="custom_css">Custom CSS</label>
        <textarea
          id="custom_css"
          value={formData.custom_css || ''}
          onChange={(e) => handleInputChange('custom_css', e.target.value)}
          placeholder="/* Custom CSS for this project page */
.project-page {
  /* Your custom styles here */
}"
          rows={10}
          className="code-textarea"
        />
        <small className="help-text">
          Add custom CSS that will be applied only to this project page
        </small>
      </div>

      <div className="layout-preview">
        <h4>Layout Preview:</h4>
        <div className="preview-info">
          {formData.page_layout === 'default' && (
            <p>📄 Standard layout with hero image, content, and optional gallery</p>
          )}
          {formData.page_layout === 'gallery' && (
            <p>🖼️ Image-focused layout with tabbed navigation and masonry gallery</p>
          )}
          {formData.page_layout === 'case-study' && (
            <p>📊 Professional case study format with progress tracking and structured sections</p>
          )}
          {formData.page_layout === 'demo' && (
            <p>🚀 Interactive demo showcase with live preview and feature highlights</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="tab-content">
      <div className="form-group">
        <label htmlFor="meta_title">SEO Title</label>
        <input
          id="meta_title"
          type="text"
          value={formData.meta_title || ''}
          onChange={(e) => handleInputChange('meta_title', e.target.value)}
          placeholder="Leave empty to use project title"
          maxLength={60}
        />
        <small className="help-text">
          {(formData.meta_title || formData.title || '').length}/60 characters
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="meta_description">SEO Description</label>
        <textarea
          id="meta_description"
          value={formData.meta_description || ''}
          onChange={(e) => handleInputChange('meta_description', e.target.value)}
          placeholder="Leave empty to use project description"
          maxLength={160}
          rows={3}
        />
        <small className="help-text">
          {(formData.meta_description || formData.description || '').length}/160 characters
        </small>
      </div>

      <div className="form-group">
        <label>Tags</label>
        <div className="tags-container">
          {formData.tags?.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
              <button
                type="button"
                onClick={() => handleTagRemove(index)}
                className="tag-remove"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="tag-input">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tags (comma-separated)"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
          />
          <button
            type="button"
            onClick={handleTagAdd}
            className="add-btn"
          >
            Add Tags
          </button>
        </div>
      </div>

      <div className="seo-preview">
        <h4>Search Preview:</h4>
        <div className="search-result-preview">
          <div className="preview-title">
            {formData.meta_title || formData.title || 'Project Title'}
          </div>
          <div className="preview-url">
            https://yoursite.com/projects/{formData.slug || 'project-slug'}
          </div>
          <div className="preview-description">
            {formData.meta_description || formData.description || 'Project description...'}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="enhanced-project-editor">
      <div className="editor-header">
        <h2>{formData.id ? 'Edit Project' : 'New Project'}</h2>
        <div className="editor-status">
          <span className={`status-indicator ${formData.status}`}>
            {formData.status || 'draft'}
          </span>
        </div>
      </div>

      <nav className="editor-tabs">
        <button 
          className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          📋 Basic Info
        </button>
        <button 
          className={`tab ${activeTab === 'content' ? 'active' : ''}`}
          onClick={() => setActiveTab('content')}
        >
          📝 Content
        </button>
        <button 
          className={`tab ${activeTab === 'images' ? 'active' : ''}`}
          onClick={() => setActiveTab('images')}
        >
          🖼️ Images ({formData.images?.length || 0})
        </button>
        <button 
          className={`tab ${activeTab === 'layout' ? 'active' : ''}`}
          onClick={() => setActiveTab('layout')}
        >
          🎨 Layout
        </button>
        <button 
          className={`tab ${activeTab === 'seo' ? 'active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          🔍 SEO
        </button>
        <button 
          className={`tab ${activeTab === 'json' ? 'active' : ''}`}
          onClick={() => setActiveTab('json')}
        >
          🚀 JSON Editor
        </button>
      </nav>

      <form onSubmit={handleSubmit} className="editor-form">
        {activeTab === 'basic' && renderBasicTab()}
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'images' && renderImagesTab()}
        {activeTab === 'layout' && renderLayoutTab()}
        {activeTab === 'seo' && renderSEOTab()}
        {activeTab === 'json' && (
          <div className="tab-content">
            <JsonEditor 
              project={formData}
              onProjectUpdate={(updatedProject) => {
                setFormData({ ...formData, ...updatedProject });
              }}
            />
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {formData.id ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          {formData.id && (
            <button 
              type="button" 
              className="btn-preview"
              onClick={() => window.open(`/projects/${formData.slug}`, '_blank')}
            >
              Preview
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedProjectEditor;