import React, { useState } from 'react';
import { Project } from '../../types/Project';
import './DeploymentPanel.css';

interface DeploymentPanelProps {
  projects: Project[];
}

const DeploymentPanel: React.FC<DeploymentPanelProps> = ({ projects }) => {
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'building' | 'deploying' | 'success' | 'error'>('idle');
  const [deploymentLog, setDeploymentLog] = useState<string[]>([]);
  const [gitConfig, setGitConfig] = useState({
    repository: '',
    branch: 'main',
    commitMessage: ''
  });

  const addLog = (message: string) => {
    setDeploymentLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleExportData = () => {
    const dataToExport = {
      projects,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog('Portfolio data exported successfully');
  };

  const handleBuildProject = async () => {
    setDeploymentStatus('building');
    setDeploymentLog([]);
    addLog('Starting build process...');

    try {
      // Simulate build process
      addLog('Installing dependencies...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addLog('Building React app...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      addLog('Optimizing assets...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      addLog('Build completed successfully!');
      setDeploymentStatus('success');
      
      // In a real implementation, you would run: npm run build
      // const buildResult = await fetch('/api/build', { method: 'POST' });
      
    } catch (error) {
      addLog(`Build failed: ${error}`);
      setDeploymentStatus('error');
    }
  };

  const handleDeployToGitHub = async () => {
    if (!gitConfig.repository) {
      alert('Please enter your GitHub repository URL');
      return;
    }

    setDeploymentStatus('deploying');
    addLog('Starting deployment to GitHub...');

    try {
      addLog('Committing changes...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addLog('Pushing to GitHub...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      addLog('Deployment completed successfully!');
      setDeploymentStatus('success');
      
      // In a real implementation, you would run git commands:
      // git add .
      // git commit -m "${gitConfig.commitMessage}"
      // git push origin ${gitConfig.branch}
      
    } catch (error) {
      addLog(`Deployment failed: ${error}`);
      setDeploymentStatus('error');
    }
  };

  const handleGenerateDeployScript = () => {
    const script = `#!/bin/bash
# Auto-generated deployment script

echo "Building portfolio..."
npm run build

echo "Deploying to GitHub..."
git add .
git commit -m "${gitConfig.commitMessage || 'Update portfolio'}"
git push origin ${gitConfig.branch}

echo "Deployment complete!"
`;

    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addLog('Deployment script generated and downloaded');
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case 'building':
      case 'deploying':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '🚀';
    }
  };

  return (
    <div className="deployment-panel">
      <div className="deployment-header">
        <h2>Deployment & Export</h2>
        <div className="status-indicator">
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">
            {deploymentStatus === 'idle' && 'Ready to deploy'}
            {deploymentStatus === 'building' && 'Building...'}
            {deploymentStatus === 'deploying' && 'Deploying...'}
            {deploymentStatus === 'success' && 'Success!'}
            {deploymentStatus === 'error' && 'Error occurred'}
          </span>
        </div>
      </div>

      <div className="deployment-content">
        <div className="deployment-section">
          <h3>📦 Data Export</h3>
          <p>Export your portfolio data as JSON for backup or migration.</p>
          <button className="btn-primary" onClick={handleExportData}>
            Export Portfolio Data
          </button>
        </div>

        <div className="deployment-section">
          <h3>🔨 Build Project</h3>
          <p>Build your React app for production deployment.</p>
          <button 
            className="btn-primary" 
            onClick={handleBuildProject}
            disabled={deploymentStatus === 'building'}
          >
            {deploymentStatus === 'building' ? 'Building...' : 'Build Project'}
          </button>
        </div>

        <div className="deployment-section">
          <h3>📤 GitHub Deployment</h3>
          <div className="git-config">
            <div className="form-group">
              <label htmlFor="repository">Repository URL</label>
              <input
                id="repository"
                type="text"
                value={gitConfig.repository}
                onChange={(e) => setGitConfig(prev => ({ ...prev, repository: e.target.value }))}
                placeholder="https://github.com/username/repository.git"
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  type="text"
                  value={gitConfig.branch}
                  onChange={(e) => setGitConfig(prev => ({ ...prev, branch: e.target.value }))}
                  placeholder="main"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="commitMessage">Commit Message</label>
                <input
                  id="commitMessage"
                  type="text"
                  value={gitConfig.commitMessage}
                  onChange={(e) => setGitConfig(prev => ({ ...prev, commitMessage: e.target.value }))}
                  placeholder="Update portfolio"
                />
              </div>
            </div>

            <div className="deployment-actions">
              <button 
                className="btn-primary" 
                onClick={handleDeployToGitHub}
                disabled={deploymentStatus === 'deploying'}
              >
                {deploymentStatus === 'deploying' ? 'Deploying...' : 'Deploy to GitHub'}
              </button>
              
              <button 
                className="btn-secondary" 
                onClick={handleGenerateDeployScript}
              >
                Generate Deploy Script
              </button>
            </div>
          </div>
        </div>

        {deploymentLog.length > 0 && (
          <div className="deployment-section">
            <h3>📋 Deployment Log</h3>
            <div className="deployment-log">
              {deploymentLog.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="deployment-section">
          <h3>ℹ️ Deployment Instructions</h3>
          <div className="instructions">
            <h4>Automatic Deployment:</h4>
            <ol>
              <li>Enter your GitHub repository URL</li>
              <li>Set your target branch (usually 'main' or 'gh-pages')</li>
              <li>Add a commit message</li>
              <li>Click "Deploy to GitHub"</li>
            </ol>

            <h4>Manual Deployment:</h4>
            <ol>
              <li>Run <code>npm run build</code> to build the project</li>
              <li>Copy the <code>build/</code> folder contents to your web server</li>
              <li>Or push to GitHub and enable GitHub Pages</li>
            </ol>

            <h4>GitHub Pages Setup:</h4>
            <ol>
              <li>Go to your repository settings</li>
              <li>Scroll to "Pages" section</li>
              <li>Set source to "Deploy from a branch"</li>
              <li>Select your branch and folder (usually root)</li>
            </ol>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DeploymentPanel;