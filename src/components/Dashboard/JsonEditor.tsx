import React, { useState, useEffect } from 'react';
import { Project } from '../../types/Project';
import './JsonEditor.css';

interface JsonEditorProps {
  project: Partial<Project>;
  onProjectUpdate: (updatedProject: Partial<Project>) => void;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ project, onProjectUpdate }) => {
  const [jsonValue, setJsonValue] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);

  // Convert project to JSON when project changes
  useEffect(() => {
    try {
      // Create a clean version of the project for JSON editing
      const cleanProject = {
        title: project.title || '',
        description: project.description || '',
        markdown_content: project.markdown_content || '',
        tech_stack: project.tech_stack || [],
        page_layout: project.page_layout || 'default',
        status: project.status || 'draft',
        featured: project.featured || false,
        tags: project.tags || [],
        live_url: project.live_url || '',
        github_url: project.github_url || '',
        case_study_url: project.case_study_url || '',
        custom_css: project.custom_css || '',
        meta_title: project.meta_title || '',
        meta_description: project.meta_description || '',
        meta_keywords: project.meta_keywords || ''
      };
      
      setJsonValue(JSON.stringify(cleanProject, null, 2));
      setIsValid(true);
      setError('');
    } catch (err) {
      setError('Error converting project to JSON');
      setIsValid(false);
    }
  }, [project]);

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    
    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setError('');
      
      // Update the project with parsed data
      onProjectUpdate({
        ...project,
        ...parsed
      });
    } catch (err) {
      setIsValid(false);
      setError('Invalid JSON format');
    }
  };

  const handleTemplateInsert = (template: any) => {
    const formattedTemplate = JSON.stringify(template, null, 2);
    setJsonValue(formattedTemplate);
    handleJsonChange(formattedTemplate);
    setShowTemplate(false);
  };

  const templates = {
    basicProject: {
      title: "Project Title",
      description: "Brief description of the project that appears on the main portfolio page.",
      markdown_content: "# Project Title\n\n## Overview\nDetailed description of your project.\n\n## Features\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Technical Implementation\n```javascript\nconst example = () => {\n  // Your code here\n};\n```\n\n## Results\n- Achievement 1\n- Achievement 2",
      tech_stack: [
        {
          "category": "Frontend",
          "items": ["React", "TypeScript"]
        },
        {
          "category": "Backend",
          "items": ["Node.js", "Express"]
        }
      ],
      page_layout: "default",
      status: "published",
      featured: false,
      tags: ["web", "react", "javascript"],
      live_url: "https://example.com",
      github_url: "https://github.com/username/project",
      case_study_url: "",
      meta_title: "Project Title - Portfolio",
      meta_description: "Description for search engines and social media",
      meta_keywords: "react, typescript, web development"
    },
    caseStudyProject: {
      title: "Case Study Project",
      description: "A comprehensive case study showcasing the complete development process.",
      markdown_content: "# Case Study: Project Name\n\n## Problem Statement\nDescribe the challenge or problem you were solving.\n\n## Research & Planning\n### User Research\n- Research method 1\n- Research method 2\n\n### Technical Requirements\n- Requirement 1\n- Requirement 2\n\n## Design Process\n### Wireframes\n![Wireframe](image-url)\n\n### Prototypes\n![Prototype](image-url)\n\n## Development\n### Architecture Decisions\n```javascript\n// Key technical decisions\nconst architecture = {\n  frontend: 'React',\n  backend: 'Node.js',\n  database: 'PostgreSQL'\n};\n```\n\n### Challenges & Solutions\n1. **Challenge**: Description\n   **Solution**: How you solved it\n\n## Results & Metrics\n- **Metric 1**: 50% improvement\n- **Metric 2**: 30% increase\n- **User Feedback**: Positive reception\n\n## Lessons Learned\n- Key learning 1\n- Key learning 2\n\n## Next Steps\n- Future improvement 1\n- Future improvement 2",
      tech_stack: [
        {
          "category": "Frontend",
          "items": ["React", "TypeScript", "Tailwind CSS"]
        },
        {
          "category": "Backend",
          "items": ["Node.js", "Express", "PostgreSQL"]
        },
        {
          "category": "Tools",
          "items": ["Figma", "Git", "Vercel"]
        }
      ],
      page_layout: "case-study",
      status: "published",
      featured: true,
      tags: ["case-study", "ux", "full-stack"],
      live_url: "https://example.com",
      github_url: "https://github.com/username/project",
      case_study_url: "https://medium.com/@username/case-study",
      meta_title: "Case Study: Project Name - UX & Development Process",
      meta_description: "Complete case study showing the design and development process for Project Name",
      meta_keywords: "case study, ux design, full stack development"
    },
    portfolioWebsite: {
      title: "Personal Portfolio Website",
      description: "A modern, responsive portfolio website built with React and deployed on Vercel.",
      markdown_content: "# Personal Portfolio Website\n\n## Project Overview\nDesigned and developed a modern portfolio website to showcase my projects and skills as a full-stack developer.\n\n## Key Features\n- **Responsive Design**: Mobile-first approach ensuring perfect display on all devices\n- **Dynamic Content**: Admin dashboard for easy project management\n- **Performance Optimized**: Fast loading times with optimized images and code splitting\n- **SEO Friendly**: Proper meta tags and structured data for search engines\n\n## Technical Stack\n```typescript\nconst techStack = {\n  frontend: ['React 19', 'TypeScript', 'CSS Grid/Flexbox'],\n  backend: ['Supabase', 'PostgreSQL'],\n  deployment: ['Vercel', 'Vercel Blob Storage'],\n  tools: ['Git', 'npm', 'Vercel Analytics']\n};\n```\n\n## Development Process\n### Planning\n- Analyzed modern portfolio trends\n- Created wireframes and mockups\n- Defined project requirements\n\n### Implementation\n- Set up React project with TypeScript\n- Designed responsive component architecture\n- Implemented database integration with Supabase\n- Added admin dashboard for content management\n\n### Deployment & Optimization\n- Deployed to Vercel for global CDN\n- Implemented image optimization\n- Added analytics and performance monitoring\n\n## Results\n- **Performance Score**: 95+ on Google PageSpeed Insights\n- **Accessibility**: WCAG 2.1 AA compliant\n- **Mobile Responsive**: Perfect display on all device sizes\n- **Admin Dashboard**: Easy content management system\n\n## Live Demo\nVisit the live website to see the portfolio in action.",
      tech_stack: [
        {
          "category": "Frontend",
          "items": ["React 19", "TypeScript", "CSS3"]
        },
        {
          "category": "Backend",
          "items": ["Supabase", "PostgreSQL"]
        },
        {
          "category": "Deployment",
          "items": ["Vercel", "Vercel Blob", "Vercel Analytics"]
        }
      ],
      page_layout: "default",
      status: "published",
      featured: true,
      tags: ["portfolio", "react", "typescript", "vercel"],
      live_url: "https://yourportfolio.vercel.app",
      github_url: "https://github.com/username/portfolio",
      case_study_url: "",
      meta_title: "Personal Portfolio Website - React & TypeScript",
      meta_description: "Modern portfolio website built with React, TypeScript, and Supabase. Features admin dashboard and responsive design.",
      meta_keywords: "portfolio, react, typescript, web development, supabase"
    }
  };

  const chatGptPrompt = `You are helping to generate content for a portfolio project. Please generate a JSON object with the following structure and replace the placeholder content with actual project details:

${JSON.stringify(templates.basicProject, null, 2)}

Instructions for ChatGPT:
1. Replace "Project Title" with the actual project name
2. Write a compelling description (1-2 sentences for the card)
3. Create detailed markdown_content with:
   - Project overview
   - Key features
   - Technical implementation details
   - Code examples if relevant
   - Results and achievements
4. List accurate tech_stack categories and items
5. Choose appropriate page_layout: "default", "gallery", "case-study", or "demo"
6. Set status to "published" when ready
7. Add relevant tags (3-5 tags)
8. Include URLs if available
9. Write SEO-friendly meta_title, meta_description, and meta_keywords

Return only the JSON object, no additional text.`;

  return (
    <div className="json-editor">
      <div className="json-editor-header">
        <h3>🚀 JSON Editor</h3>
        <div className="json-editor-actions">
          <button 
            className="btn-template"
            onClick={() => setShowTemplate(!showTemplate)}
          >
            📋 Templates
          </button>
          <button 
            className="btn-chatgpt"
            onClick={() => navigator.clipboard.writeText(chatGptPrompt)}
          >
            🤖 Copy ChatGPT Prompt
          </button>
        </div>
      </div>

      {showTemplate && (
        <div className="template-selector">
          <h4>Choose a Template:</h4>
          <div className="template-buttons">
            <button onClick={() => handleTemplateInsert(templates.basicProject)}>
              📄 Basic Project
            </button>
            <button onClick={() => handleTemplateInsert(templates.caseStudyProject)}>
              📊 Case Study
            </button>
            <button onClick={() => handleTemplateInsert(templates.portfolioWebsite)}>
              💼 Portfolio Website
            </button>
          </div>
        </div>
      )}

      <div className="json-editor-container">
        <div className="json-status">
          {isValid ? (
            <span className="status-valid">✅ Valid JSON</span>
          ) : (
            <span className="status-invalid">❌ {error}</span>
          )}
        </div>
        
        <textarea
          className={`json-textarea ${!isValid ? 'invalid' : ''}`}
          value={jsonValue}
          onChange={(e) => handleJsonChange(e.target.value)}
          rows={25}
          placeholder="Edit your project data in JSON format..."
        />
      </div>

      <div className="json-editor-help">
        <h4>💡 How to use with ChatGPT:</h4>
        <ol>
          <li>Click "Copy ChatGPT Prompt" button above</li>
          <li>Paste into ChatGPT and describe your project</li>
          <li>Copy the JSON response from ChatGPT</li>
          <li>Paste it into the textarea above</li>
          <li>The form fields will automatically update!</li>
        </ol>
        
        <div className="json-tips">
          <strong>Tips:</strong>
          <ul>
            <li>Use markdown in <code>markdown_content</code> for rich formatting</li>
            <li>Choose <code>page_layout</code>: "default", "gallery", "case-study", or "demo"</li>
            <li>Set <code>featured: true</code> for important projects</li>
            <li>Add 3-5 relevant <code>tags</code> for better organization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JsonEditor;