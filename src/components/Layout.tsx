import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="profile-header">
          <div className="header-row">
            <div className="name">
              <a href="/" className="home-link">Lingyi Zhou</a>
            </div>
            <div className="title">
              <span className="job-title">Full Stack Engineer</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <div className="profile-image-container">
            <img 
              className="profile-image zoomable" 
              src="/images/profile/profile.jpg" 
              alt="Lingyi Zhou Profile"
            />
          </div>

          <div className="bio">
            <p>
              I'm a <b><a href="fullstack-engineer" className="bio-link">Full Stack Engineer</a></b> with hands-on experience building online games, AR experiences, web apps, and mobile apps. Throughout my career—especially at Snapchat and Moviebill—I've developed numerous internal tools that streamlined development and accelerated creative workflows.
            </p>
            <br />
            <p>
              I'm also a <a href="3d-design" className="bio-link">3D designer</a> experienced in both industrial design for custom 3D-printed parts that solve real-life problems, and digital modeling for game assets.
            </p>
            <br />
            <p>
              I'm also a <a href="graphic-designer" className="bio-link">graphic designer</a> experienced in designing exhibition materials, marketing collateral, packaging, and more.
            </p>
            <br />
            <p>
              Among all these, creating automated tools that accelerate the entire process is my greatest pleasure. I believe my strong interest in developing for better productivity is a guiding force in <b><a href="overview" className="bio-link">all my work</a></b>.
            </p>
          </div>

          <div className="contact-links">
            <a href="contact-form" className="contact-link">Email</a>
            <br />
            <a href="https://www.instagram.com/reartured/" target="_blank" rel="noopener noreferrer" className="contact-link">Instagram</a>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;