# Images Directory

This directory contains all images used in the portfolio website.

## Structure

```
images/
├── profile/
│   └── profile.jpg          # Main profile image
├── projects/
│   ├── project-01.jpg       # Hardware Store Smart Search
│   ├── project-01-hover.jpg # Hardware Store Smart Search (hover state)
│   ├── project-02.jpg       # AR Drawing Tool
│   ├── project-03.jpg       # Personal Schedule Assistant
│   ├── project-04.jpg       # 3D Printed Hook
│   ├── project-05.jpg       # Just Another Day
│   ├── project-06.jpg       # No Job Too Small
│   ├── project-07.jpg       # Task Tracker App
│   ├── project-08.jpg       # VR Experience on Oculus Quest
│   └── project-09.jpg       # Creative Coding Experiments
└── README.md
```

## Usage

Images are referenced in the React components using the `/images/` path:
- Profile image: `/images/profile/profile.jpg`
- Project images: `/images/projects/project-XX.jpg`
- Project hover images: `/images/projects/project-XX-hover.jpg`

## Image Guidelines

- **Format**: JPG or PNG recommended
- **Profile image**: Recommended size 400x400px or similar square ratio
- **Project images**: Recommended size 800x600px or 16:9 aspect ratio
- **File naming**: Use descriptive names with project numbers for consistency
- **Optimization**: Compress images for web to improve loading times