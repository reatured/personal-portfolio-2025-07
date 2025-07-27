import { LegacyProject } from '../types/Project';

const DATA_KEY = 'portfolioProjects';
const BACKUP_KEY = 'portfolioProjectsBackup';

export class DataManager {
  static saveProjects(projects: LegacyProject[]): void {
    try {
      // Save current data as backup before updating
      const currentData = localStorage.getItem(DATA_KEY);
      if (currentData) {
        localStorage.setItem(BACKUP_KEY, currentData);
      }

      // Save new data
      localStorage.setItem(DATA_KEY, JSON.stringify(projects));
      
      // Also save to a JSON file that can be committed to git
      this.exportToFile(projects);
    } catch (error) {
      console.error('Error saving projects:', error);
      throw new Error('Failed to save projects');
    }
  }

  static loadProjects(): LegacyProject[] {
    try {
      const data = localStorage.getItem(DATA_KEY);
      if (data) {
        return JSON.parse(data);
      }
      
      // Fallback to default projects if no saved data
      return this.getDefaultProjects();
    } catch (error) {
      console.error('Error loading projects:', error);
      return this.getDefaultProjects();
    }
  }

  static exportToFile(projects: LegacyProject[]): void {
    const data = {
      projects,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Create a hidden download link
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-projects.json';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  static importFromFile(file: File): Promise<Project[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          // Validate the imported data
          if (data.projects && Array.isArray(data.projects)) {
            resolve(data.projects);
          } else {
            reject(new Error('Invalid file format'));
          }
        } catch (error) {
          reject(new Error('Failed to parse JSON file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  }

  static getBackup(): Project[] | null {
    try {
      const backup = localStorage.getItem(BACKUP_KEY);
      return backup ? JSON.parse(backup) : null;
    } catch (error) {
      console.error('Error loading backup:', error);
      return null;
    }
  }

  static restoreFromBackup(): void {
    const backup = this.getBackup();
    if (backup) {
      localStorage.setItem(DATA_KEY, JSON.stringify(backup));
    }
  }

  static clearAllData(): void {
    localStorage.removeItem(DATA_KEY);
    localStorage.removeItem(BACKUP_KEY);
  }

  private static getDefaultProjects(): LegacyProject[] {
    // Return the original projects as default
    return [
      {
        id: "1",
        title: "01 Hardware Store Smart Search",
        description: "When I worked for a hardware manufacturer, we were looking for a better way to find targeted customers (hardware stores) to purchase our stock. We built a smart search tool to crawl Google Maps business data and help identify store leads around the world.",
        techStack: [
          { category: "Frontend", items: ["React"] },
          { category: "Backend", items: ["FastAPI"] },
          { category: "Languages", items: ["JavaScript", "Python"] }
        ],
        imagePath: "/images/projects/project-01.jpg",
        hoverImagePath: "/images/projects/project-01-hover.jpg",
        link: "Page-1"
      },
      {
        id: "2",
        title: "02 AR Drawing Tool",
        description: "During my internship at Snapchat in 2022, I had this crazy idea nobody had done before. I integrated procedural mesh generation with hand tracking, enabling users to draw dynamically in 3D space.",
        techStack: [
          { category: "Platform", items: ["Lens Studio"] },
          { category: "Languages", items: ["JavaScript"] }
        ],
        imagePath: "/images/projects/project-02.jpg",
        link: "Page-2"
      }
      // ... other default projects
    ];
  }

  static generateGitCommands(projects: LegacyProject[], commitMessage: string = 'Update portfolio data'): string[] {
    return [
      '# Portfolio deployment commands',
      '# Run these commands in your terminal',
      '',
      '# 1. Save current changes',
      'git add .',
      `git commit -m "${commitMessage}"`,
      '',
      '# 2. Build the project',
      'npm run build',
      '',
      '# 3. Deploy to main branch',
      'git push origin main',
      '',
      '# 4. Optional: Deploy to GitHub Pages',
      '# git subtree push --prefix build origin gh-pages',
      '',
      `# Last updated: ${new Date().toISOString()}`,
      `# Projects count: ${projects.length}`
    ];
  }

  static downloadGitCommands(projects: LegacyProject[], commitMessage: string): void {
    const commands = this.generateGitCommands(projects, commitMessage);
    const content = commands.join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'deploy-commands.txt';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}