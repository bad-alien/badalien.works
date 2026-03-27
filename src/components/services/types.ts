// Legacy project types (kept for ProjectCard/ProjectModal compatibility)
export type ProjectStatus = 'building' | 'completed' | 'planned';
export type ProjectCategory = 'AI' | 'Automation' | 'Demo' | 'Client';

export interface ProjectLink {
  label: string;
  url: string;
  type?: 'primary' | 'secondary';
}

export interface ProjectMedia {
  type: 'image' | 'video' | 'youtube' | 'vimeo';
  url: string;
  thumbnail?: string;
  alt?: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  fullDescription: string;
  status: ProjectStatus;
  category: ProjectCategory[];
  techStack: string[];
  thumbnail: ProjectMedia;
  media?: ProjectMedia[];
  links?: ProjectLink[];
}

// Service types
export type ServiceCategory = 'AI' | 'Automation' | 'Design';
export type ServiceStatus = 'Active' | 'Completed' | 'In Progress' | 'Planned';

export interface ServiceDemo {
  type: 'placeholder' | 'image' | 'video' | 'embed';
  url?: string;
  alt?: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  status: ServiceStatus;
  categories: ServiceCategory[];
  techStack: string[];
  demo: ServiceDemo;
  ctaLabel?: string;
  ctaUrl?: string;
}
