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
