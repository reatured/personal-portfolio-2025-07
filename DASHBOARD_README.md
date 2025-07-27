# Portfolio Dashboard

A comprehensive admin dashboard for managing your portfolio content locally with GitHub deployment capabilities.

## Features

### 📊 Project Management
- **CRUD Operations**: Create, read, update, and delete portfolio projects
- **Rich Editor**: Edit project titles, descriptions, tech stacks, and links
- **Real-time Preview**: See changes immediately in the project list
- **Data Validation**: Ensures all required fields are filled before saving

### 🖼️ Image Management
- **Drag & Drop Upload**: Simple interface for uploading project and profile images
- **Naming Guidelines**: Clear instructions for consistent image naming
- **Path Generation**: Automatic generation of image paths for projects
- **Image Organization**: Separate folders for profile and project images

### 🚀 Deployment & Export
- **Data Export**: Export your portfolio data as JSON for backup/migration
- **Build Automation**: One-click project building for production
- **GitHub Integration**: Deploy directly to GitHub with commit messages
- **Deploy Scripts**: Generate custom deployment scripts
- **Deployment Logs**: Real-time feedback during deployment process

### 💾 Data Persistence
- **Local Storage**: Automatic saving to browser localStorage
- **JSON Export**: Export/import functionality for data portability
- **Backup System**: Automatic backup before data updates
- **Version Control**: Track changes and restore from backups

## Getting Started

### Accessing the Dashboard
1. Start your development server: `npm start`
2. Navigate to: `http://localhost:3000/admin`
3. Begin managing your portfolio content

### Managing Projects
1. Click **"Add New Project"** to create a new portfolio item
2. Fill in all required fields:
   - **Title**: Project name (e.g., "01 Hardware Store Smart Search")
   - **Description**: Detailed project description
   - **Tech Stack**: Add categories and technologies used
   - **Image Path**: Path to project image (e.g., "/images/projects/project-01.jpg")
   - **Link**: Project URL or page reference
3. Click **"Save Project"** to store your changes

### Managing Images
1. Navigate to the **"Images"** tab
2. Drag and drop images or click to select files
3. Follow the naming conventions:
   - Profile: `profile.jpg`
   - Projects: `project-01.jpg`, `project-02.jpg`, etc.
   - Hover images: `project-01-hover.jpg`, etc.
4. Copy generated paths for use in project data

### Deploying Your Portfolio

#### Quick Deploy
1. Go to the **"Deploy"** tab
2. Configure your GitHub repository settings
3. Add a commit message
4. Click **"Deploy to GitHub"**

#### Manual Deploy
1. Run: `npm run build`
2. Upload the `build/` folder to your web server
3. Or push to GitHub and enable GitHub Pages

#### Using Deploy Scripts
1. Click **"Generate Deploy Script"** 
2. Download the generated script
3. Run it in your terminal: `./deploy.sh`

## File Structure

```
src/
├── components/
│   └── Dashboard/
│       ├── Dashboard.tsx          # Main dashboard component
│       ├── Dashboard.css          # Dashboard styles
│       ├── ProjectEditor.tsx      # Project CRUD interface
│       ├── ImageUploader.tsx      # Image management
│       ├── ImageUploader.css      # Image uploader styles
│       ├── DeploymentPanel.tsx    # Deployment tools
│       └── DeploymentPanel.css    # Deployment styles
├── utils/
│   └── dataManager.ts            # Data persistence utilities
└── types/
    └── Project.ts                # TypeScript interfaces
```

## Data Storage

### Local Development
- Data is stored in browser `localStorage`
- Automatic backup system prevents data loss
- Export/import functionality for data portability

### Production Deployment
- Data is compiled into the React build
- Changes require rebuilding and redeploying
- Use the dashboard's export feature to backup data

## GitHub Pages Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose `main` branch and `/root` folder

2. **Deploy with GitHub Actions** (Optional):
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [ main ]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - uses: actions/setup-node@v2
           with:
             node-version: '16'
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./build
   ```

## NPM Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Build and show deployment instructions
- `npm run deploy:github` - Build and deploy to GitHub
- `npm test` - Run tests

## Troubleshooting

### Dashboard Not Loading
- Ensure React Router is properly configured
- Check browser console for JavaScript errors
- Verify all dependencies are installed

### Data Not Saving
- Check browser localStorage permissions
- Ensure no browser extensions are blocking storage
- Try exporting data manually as backup

### Images Not Displaying
- Verify images are in the correct `/public/images/` directories
- Check file names match the paths in project data
- Ensure images are web-compatible formats (JPG, PNG, WebP)

### Deployment Issues
- Verify GitHub repository URL is correct
- Check repository permissions and access tokens
- Ensure branch name matches your repository setup

## Security Notes

- The dashboard is client-side only and safe for local development
- Do not expose admin routes in production without authentication
- Consider adding route protection for production deployments
- Regular backups are recommended before major changes

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify all dependencies are up to date
3. Ensure proper file permissions for image uploads
4. Review GitHub repository settings for deployment issues