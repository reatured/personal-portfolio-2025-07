import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Layout from './components/Layout';
import EnhancedProjectCard from './components/EnhancedProjectCard';
import Dashboard from './components/Dashboard/Dashboard';
import ProjectPage from './components/ProjectPage/ProjectPage';
import { projects } from './data/projects';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/admin" element={<Dashboard />} />
        
        {/* Project Detail Pages */}
        <Route path="/projects/:slug" element={<ProjectPage />} />
        
        {/* Main Portfolio Route */}
        <Route path="/" element={
          <Layout>
            <div className="portfolio-container">
              {projects.map((project) => (
                <EnhancedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
