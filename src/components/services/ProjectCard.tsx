'use client';

import { Project, ProjectStatus } from './types';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const statusConfig: Record<ProjectStatus, { label: string; className: string }> = {
  building: {
    label: 'Building',
    className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-500/20 text-green-300 border-green-500/50',
  },
  planned: {
    label: 'Planned',
    className: 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  },
};

export default function ProjectCard({ project, index, onClick }: ProjectCardProps) {
  const isReversed = index % 2 !== 0;
  const statusStyle = statusConfig[project.status];

  return (
    <div
      onClick={onClick}
      className="group relative bg-surface border border-border rounded-xl overflow-hidden cursor-pointer hover:bg-elevated hover:border-border/80 transition-all duration-500 hover:scale-[1.02]"
    >
      {/* Status Badge */}
      <div className={`absolute top-4 z-10 ${isReversed ? 'right-4' : 'left-4'}`}>
        <span
          className={`px-3 py-1 text-xs font-light tracking-wider rounded-full border ${statusStyle.className}`}
        >
          {statusStyle.label}
        </span>
      </div>

      <div
        className={`flex flex-col ${
          isReversed ? 'md:flex-row-reverse' : 'md:flex-row'
        } gap-6 md:gap-8 p-6 md:p-8`}
      >
        {/* Text Content */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-light tracking-wide text-text-heading mb-2 group-hover:text-white transition-colors">
              {project.title}
            </h3>
            {project.subtitle && (
              <p className="text-sm md:text-base text-text-secondary font-light tracking-wide">
                {project.subtitle}
              </p>
            )}
          </div>

          <p className="text-text-body font-light leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="pt-4">
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-light tracking-wider bg-base border border-border rounded-md"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 relative aspect-video md:aspect-auto md:min-h-[300px] rounded-xl overflow-hidden bg-base/20">
          <Image
            src={project.thumbnail.url}
            alt={project.thumbnail.alt || project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
}
