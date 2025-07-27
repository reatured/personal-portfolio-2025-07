import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './MarkdownEditor.css';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
  preview?: 'edit' | 'live' | 'preview';
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your project description in markdown...",
  height = 400,
  preview = 'live'
}) => {
  const [editorValue, setEditorValue] = useState(value);

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = (val: string | undefined) => {
    const newValue = val || '';
    setEditorValue(newValue);
    onChange(newValue);
  };

  // Custom toolbar commands
  const customCommands = [
    // Add image command
    {
      name: 'image',
      keyCommand: 'image',
      buttonProps: { 'aria-label': 'Add image' },
      icon: (
        <svg width="12" height="12" viewBox="0 0 520 520">
          <path fill="currentColor" d="M464 64H56C25.6 64 0 89.6 0 120v280c0 30.4 25.6 56 56 56h408c30.4 0 56-25.6 56-56V120c0-30.4-25.6-56-56-56zM56 120h408v193.4l-79.2-79.2c-10.6-10.6-27.8-10.6-38.4 0L260 320.6l-45.4-45.4c-10.6-10.6-27.8-10.6-38.4 0L56 395.4V120zm408 280H169.4l107.8-107.8 45.4 45.4c10.6 10.6 27.8 10.6 38.4 0l107.8-107.8L464 400z"/>
          <circle fill="currentColor" cx="160" cy="200" r="40"/>
        </svg>
      ),
      execute: (state: any, api: any) => {
        const selection = api.getSelection();
        api.replaceSelection(`![Alt text](image-url "Image caption")`);
      }
    },
    // Add code block command
    {
      name: 'code-block',
      keyCommand: 'code-block',
      buttonProps: { 'aria-label': 'Add code block' },
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
        </svg>
      ),
      execute: (state: any, api: any) => {
        const selection = api.getSelection();
        api.replaceSelection(`\`\`\`javascript\n// Your code here\nconsole.log('Hello World');\n\`\`\``);
      }
    },
    // Add demo section
    {
      name: 'demo',
      keyCommand: 'demo',
      buttonProps: { 'aria-label': 'Add demo section' },
      icon: (
        <svg width="12" height="12" viewBox="0 0 24 24">
          <path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      ),
      execute: (state: any, api: any) => {
        api.replaceSelection(`## 🚀 Live Demo

[View Live Demo](https://your-demo-url.com) | [View Source Code](https://github.com/your-repo)

### Key Features
- Feature 1
- Feature 2  
- Feature 3

### Try it out:
1. Step 1
2. Step 2
3. Step 3`);
      }
    }
  ];

  // Template snippets
  const templates = {
    overview: `# Project Title

## Overview
Brief description of what this project does and why it was built.

## Problem
What problem were you trying to solve?

## Solution
How did you solve it?

## Results
What were the outcomes?`,
    
    technical: `## Technical Implementation

### Architecture
Describe the overall architecture and design decisions.

### Key Technologies
- **Frontend**: React, TypeScript
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Deployment**: Vercel, Railway

### Code Example
\`\`\`javascript
// Example implementation
const example = () => {
  return "Hello World";
};
\`\`\``,

    casestudy: `# Case Study: Project Name

## The Challenge
What was the business problem or user need?

## Research & Discovery
- User interviews
- Market analysis
- Technical constraints

## Design Process
### Wireframes
![Wireframes](wireframe-url)

### Prototypes
![Prototype](prototype-url)

## Development
### Technical Approach
- Architecture decisions
- Technology choices
- Implementation challenges

## Results & Impact
- Metrics and KPIs
- User feedback
- Business impact

## Lessons Learned
What would you do differently next time?`
  };

  const insertTemplate = (templateKey: keyof typeof templates) => {
    const template = templates[templateKey];
    setEditorValue(prev => prev + '\n\n' + template);
    onChange(editorValue + '\n\n' + template);
  };

  return (
    <div className="markdown-editor-container">
      <div className="editor-toolbar">
        <div className="template-buttons">
          <button 
            type="button"
            onClick={() => insertTemplate('overview')}
            className="template-btn"
          >
            📋 Overview Template
          </button>
          <button 
            type="button"
            onClick={() => insertTemplate('technical')}
            className="template-btn"
          >
            🔧 Technical Template
          </button>
          <button 
            type="button"
            onClick={() => insertTemplate('casestudy')}
            className="template-btn"
          >
            📊 Case Study Template
          </button>
        </div>
      </div>

      <MDEditor
        value={editorValue}
        onChange={handleChange}
        preview={preview}
        height={height}
        data-color-mode="light"
        commands={[
          ...MDEditor.commands.getCommands(),
          ...customCommands
        ]}
        textareaProps={{
          placeholder,
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace'
          }
        }}
      />

      <div className="editor-tips">
        <details>
          <summary>💡 Markdown Tips</summary>
          <div className="tips-content">
            <div className="tip-group">
              <h4>Text Formatting:</h4>
              <ul>
                <li><code>**bold text**</code> → <strong>bold text</strong></li>
                <li><code>*italic text*</code> → <em>italic text</em></li>
                <li><code>`code`</code> → <code>code</code></li>
              </ul>
            </div>
            <div className="tip-group">
              <h4>Images & Links:</h4>
              <ul>
                <li><code>![Alt text](image-url)</code> → Image</li>
                <li><code>[Link text](https://url)</code> → Link</li>
              </ul>
            </div>
            <div className="tip-group">
              <h4>Code Blocks:</h4>
              <ul>
                <li><code>```javascript</code> → JavaScript code block</li>
                <li><code>```typescript</code> → TypeScript code block</li>
                <li><code>```css</code> → CSS code block</li>
              </ul>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarkdownEditor;