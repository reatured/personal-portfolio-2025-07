export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: {
    category: string;
    items: string[];
  }[];
  imagePath: string;
  hoverImagePath?: string;
  link: string;
}