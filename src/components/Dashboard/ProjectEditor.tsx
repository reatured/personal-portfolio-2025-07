import React, { useState, useEffect } from 'react';
import { Project, ProjectImage, TechStack } from '../../types/Project';
import MarkdownEditor from './MarkdownEditor';
import MultiImageUploader from './MultiImageUploader';

interface ProjectEditorProps {
  project: Partial<Project>;
  onSave: (project: Project) => void;
  onCancel: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onSave, onCancel }) => {
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
    ...project
  });
  const [techStackInput, setTechStackInput] = useState({ category: '', items: '' });
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'images' | 'layout' | 'seo'>('basic');

  useEffect(() => {
    setFormData(project);
  }, [project]);

  const handleInputChange = (field: keyof Project, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTechStackAdd = () => {
    if (techStackInput.category && techStackInput.items) {
      const items = techStackInput.items.split(',').map(item => item.trim()).filter(Boolean);
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, { category: techStackInput.category, items }]
      }));
      setTechStackInput({ category: '', items: '' });
    }
  };

  const handleTechStackRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter((_, i) => i !== index)
    }));
  };

  const handleTechStackEdit = (index: number, field: 'category' | 'items', value: string) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.map((tech, i) => 
        i === index 
          ? { 
              ...tech, 
              [field]: field === 'items' ? value.split(',').map(item => item.trim()).filter(Boolean) : value 
            }
          : tech
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert('Please fill in required fields');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="project-editor">
      <div className="editor-header">
        <h3>{project.id ? 'Edit Project' : 'New Project'}</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="e.g., 01 Hardware Store Smart Search"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Project description..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="imagePath">Image Path</label>
          <input
            id="imagePath"
            type="text"
            value={formData.imagePath}
            onChange={(e) => handleInputChange('imagePath', e.target.value)}
            placeholder="/images/projects/project-01.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="hoverImagePath">Hover Image Path (Optional)</label>
          <input
            id="hoverImagePath"
            type="text"
            value={formData.hoverImagePath || ''}
            onChange={(e) => handleInputChange('hoverImagePath', e.target.value)}
            placeholder="/images/projects/project-01-hover.jpg"
          />
        </div>

        <div className="form-group">
          <label htmlFor="link">Link</label>
          <input
            id="link"
            type="text"
            value={formData.link}
            onChange={(e) => handleInputChange('link', e.target.value)}
            placeholder="Page-1 or https://example.com"
          />
        </div>

        <div className="form-group">
          <label>Tech Stack</label>
          
          {formData.techStack.map((tech, index) => (
            <div key={index} className="tech-stack-item">
              <input
                type="text"
                value={tech.category}
                onChange={(e) => handleTechStackEdit(index, 'category', e.target.value)}
                placeholder="Category (e.g., Frontend)"
              />
              <input
                type="text"
                value={tech.items.join(', ')}
                onChange={(e) => handleTechStackEdit(index, 'items', e.target.value)}
                placeholder="Items (comma-separated)"
              />
              <button
                type="button"
                onClick={() => handleTechStackRemove(index)}
              >
                Remove
              </button>
            </div>
          ))}

          <div className="tech-stack-item">
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
              placeholder="Items (comma-separated)"
            />
            <button
              type="button"
              className="add-tech-stack"
              onClick={handleTechStackAdd}
            >
              Add
            </button>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {project.id ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectEditor;