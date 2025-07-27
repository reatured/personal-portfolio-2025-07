import { LegacyProject } from '../types/Project';

export const projects: LegacyProject[] = [
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
  },
  {
    id: "3",
    title: "03 Personal Schedule Assistant",
    description: "A drag-and-drop schedule builder that supports offline editing and syncs automatically across devices. Designed for productivity addicts who want control over time and print-ready exports.",
    techStack: [
      { category: "Frontend", items: ["React", "@dnd-kit", "Tailwind"] },
      { category: "Backend", items: ["FastAPI", "Supabase"] },
      { category: "Languages", items: ["TypeScript", "Python"] }
    ],
    imagePath: "/images/projects/project-03.jpg",
    link: "Page-3"
  },
  {
    id: "4",
    title: "04 3D Printed Hook",
    description: "A 3D modeling and printing project to create customized hooks for home hardware. Iterated through several prototypes using Fusion 360 and tested for real-world use.",
    techStack: [
      { category: "Modeling", items: ["Fusion 360"] },
      { category: "Output", items: ["STL for 3D printing"] }
    ],
    imagePath: "/images/projects/project-04.jpg",
    link: "Page-4"
  },
  {
    id: "5",
    title: "05 Just Another Day",
    description: "A Unity narrative-driven game project composed of five mini-games tied together through an emotional storyline. Designed to create an emotional arc that ends in catharsis.",
    techStack: [
      { category: "Engine", items: ["Unity"] },
      { category: "Languages", items: ["C#"] },
      { category: "3D Modelling", items: ["Blender"] }
    ],
    imagePath: "/images/projects/project-05.jpg",
    link: "Page-5"
  },
  {
    id: "6",
    title: "06 No Job Too Small",
    description: "A Unity puzzle-platformer built to explore micro interactions in a stylized digital world. Emphasizes environment storytelling and modular level design.",
    techStack: [
      { category: "Engine", items: ["Unity"] },
      { category: "Languages", items: ["C#", "HLSL"] }
    ],
    imagePath: "/images/projects/project-06.jpg",
    link: "Page-7"
  },
  {
    id: "7",
    title: "07 Task Tracker App",
    description: "A full-stack to-do and task tracker with login authentication, database sync, and mobile-first UI. Built for productivity enthusiasts.",
    techStack: [
      { category: "Frontend", items: ["React", "Tailwind"] }
    ],
    imagePath: "/images/projects/project-07.jpg",
    link: "Page-8"
  },
  {
    id: "8",
    title: "08 VR Experience on Oculus Quest",
    description: "An immersive game for Oculus Quest focusing on object interaction and spatial memory. Built using Unity's XR framework and tested across headset configurations.",
    techStack: [
      { category: "Engine", items: ["Unity"] },
      { category: "Platform", items: ["Oculus Quest"] },
      { category: "Languages", items: ["C#"] }
    ],
    imagePath: "/images/projects/project-08.jpg",
    link: "Page-9"
  },
  {
    id: "9",
    title: "09 Creative Coding Experiments",
    description: "A collection of generative art and procedural visuals made with p5.js. Explores randomness, interactivity, and animation through code.",
    techStack: [
      { category: "Library", items: ["p5.js"] },
      { category: "Languages", items: ["JavaScript"] }
    ],
    imagePath: "/images/projects/project-09.jpg",
    link: "Page-10"
  }
];