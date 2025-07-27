import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/global.css';
import Layout from './components/Layout';
import ProjectCard from './components/ProjectCard';
import Dashboard from './components/Dashboard/Dashboard';
import { projects } from './data/projects';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard Route */}
        <Route path="/admin" element={<Dashboard />} />
        
        {/* Main Portfolio Route */}
        <Route path="/" element={
          <Layout>
            <div className="portfolio-container">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
