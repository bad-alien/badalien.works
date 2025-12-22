'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/shared/Logo';
import { useScrollState } from '@/hooks/useScrollState';
import ProjectCard from '@/components/tech/ProjectCard';
import ProjectModal from '@/components/tech/ProjectModal';
import { Project } from '@/components/tech/types';

type TechFilter = 'All' | 'AI' | 'Automation' | 'Demo' | 'Client';

const techFilters: TechFilter[] = ['All', 'AI', 'Automation', 'Demo', 'Client'];

// Sample project data - replace with your actual projects
const projects: Project[] = [
  {
    id: '1',
    title: 'AI Agent Platform',
    subtitle: 'Multi-Agent Orchestration System',
    description: 'A sophisticated platform for building and deploying autonomous AI agents that collaborate to solve complex tasks.',
    fullDescription: 'A comprehensive AI agent orchestration platform that enables teams to build, test, and deploy autonomous agents at scale. Features include:\n\n• Multi-agent collaboration and communication\n• Real-time monitoring and debugging\n• Custom tool integration\n• Workflow automation\n• Production-ready deployment',
    status: 'building',
    category: ['AI', 'Automation'],
    techStack: ['Next.js', 'TypeScript', 'Python', 'Claude API', 'PostgreSQL', 'Docker'],
    thumbnail: {
      type: 'image',
      url: '/assets/ba_knows_ai.png',
      alt: 'AI Agent Platform',
    },
    media: [
      {
        type: 'youtube',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
    ],
    links: [
      { label: 'View Live Demo', url: '#', type: 'primary' },
      { label: 'GitHub Repository', url: '#', type: 'secondary' },
    ],
  },
  {
    id: '2',
    title: 'Workflow Automation Suite',
    subtitle: 'No-Code Automation Builder',
    description: 'Visual workflow builder that connects your favorite tools and automates repetitive tasks without writing code.',
    fullDescription: 'A powerful no-code automation platform designed for teams and individuals who want to streamline their workflows. Key features:\n\n• Drag-and-drop workflow builder\n• 100+ pre-built integrations\n• Conditional logic and branching\n• Scheduled and trigger-based execution\n• Team collaboration tools\n• Analytics and monitoring',
    status: 'completed',
    category: ['Automation'],
    techStack: ['React', 'Node.js', 'MongoDB', 'Redis', 'Tailwind CSS'],
    thumbnail: {
      type: 'image',
      url: '/assets/ba_knows_ai.png',
      alt: 'Workflow Automation Suite',
    },
    links: [
      { label: 'Try It Now', url: '#', type: 'primary' },
      { label: 'Documentation', url: '#', type: 'secondary' },
    ],
  },
  {
    id: '3',
    title: 'Interactive Demo Gallery',
    subtitle: 'Showcase Platform',
    description: 'A stunning portfolio platform to showcase interactive demos and prototypes with embedded analytics.',
    fullDescription: 'Modern portfolio platform built to beautifully present interactive demos and prototypes. Perfect for agencies and freelancers. Features include:\n\n• Responsive gallery layouts\n• Embedded demos and prototypes\n• Analytics tracking\n• Custom branding\n• SEO optimization\n• Contact form integration',
    status: 'completed',
    category: ['Demo'],
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel'],
    thumbnail: {
      type: 'image',
      url: '/assets/ba_knows_ai.png',
      alt: 'Demo Gallery',
    },
    media: [
      {
        type: 'image',
        url: '/assets/ba_knows_ai.png',
        alt: 'Gallery View 1',
      },
      {
        type: 'image',
        url: '/assets/ba_knows_ai.png',
        alt: 'Gallery View 2',
      },
    ],
    links: [
      { label: 'View Gallery', url: '#', type: 'primary' },
    ],
  },
  {
    id: '4',
    title: 'Enterprise Dashboard',
    subtitle: 'Client Project',
    description: 'Custom analytics dashboard for a Fortune 500 client with real-time data visualization and reporting.',
    fullDescription: 'A comprehensive enterprise dashboard solution built for a Fortune 500 client. Handles millions of data points with real-time updates.\n\n• Real-time data streaming\n• Custom chart libraries\n• Role-based access control\n• Export capabilities (PDF, Excel)\n• Mobile responsive design\n• Multi-tenant architecture',
    status: 'completed',
    category: ['Client', 'AI'],
    techStack: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'WebSocket', 'AWS'],
    thumbnail: {
      type: 'image',
      url: '/assets/ba_knows_ai.png',
      alt: 'Enterprise Dashboard',
    },
    links: [
      { label: 'Case Study', url: '#', type: 'secondary' },
    ],
  },
  {
    id: '5',
    title: 'AI Content Generator',
    subtitle: 'Marketing Automation Tool',
    description: 'Generate high-quality marketing content at scale using advanced AI models and custom templates.',
    fullDescription: 'An AI-powered content generation platform designed for marketing teams. Generate blog posts, social media content, email campaigns, and more.\n\n• Multiple AI model support\n• Custom template library\n• Brand voice training\n• Bulk content generation\n• SEO optimization\n• Content calendar integration\n• Team collaboration',
    status: 'planned',
    category: ['AI', 'Automation'],
    techStack: ['Next.js', 'Claude API', 'GPT-4', 'Supabase', 'Stripe'],
    thumbnail: {
      type: 'image',
      url: '/assets/ba_knows_ai.png',
      alt: 'AI Content Generator',
    },
  },
];

export default function TechPage() {
  const isScrolled = useScrollState(50);
  const [activeFilter, setActiveFilter] = useState<TechFilter>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled || activeFilter !== 'All'
            ? 'bg-black/80 backdrop-blur-md py-3'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-center relative">
          <Logo
            size={isScrolled || activeFilter !== 'All' ? 'sm' : 'md'}
            className="transition-all duration-300"
          />

          <Link
            href="/contact"
            className="absolute right-6 text-sm font-light tracking-wider hover:text-gray-400 transition-colors"
          >
            CONTACT
          </Link>
        </div>
      </header>

      {/* Filter Bar */}
      <div
        className={`sticky z-30 bg-transparent transition-all duration-500 ${
          isScrolled || activeFilter !== 'All'
            ? 'top-[72px] py-4 opacity-100 translate-y-0'
            : 'top-[72px] py-4 opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {techFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-2 font-light tracking-wider text-sm rounded-md backdrop-blur-md transition-all duration-300 ${
                  activeFilter === filter
                    ? 'bg-white text-black'
                    : 'bg-black/80 text-white border border-white/30 hover:border-white/60 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Image - Only show when "All" filter is active */}
      {activeFilter === 'All' && (
        <div className={`container mx-auto px-6 transition-all duration-500 ${
          isScrolled ? 'pt-32' : 'pt-24'
        }`}>
          <div className="relative w-full max-w-4xl mx-auto">
            <Image
              src="/assets/ba_knows_ai.png"
              alt="Bad Alien Knows AI"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`container mx-auto px-6 pb-16 transition-all duration-500 ${
        activeFilter === 'All' ? 'pt-12' : 'pt-32'
      }`}>
        {/* Project Cards */}
        <div className="max-w-6xl mx-auto space-y-8">
          {projects
            .filter((project) => {
              if (activeFilter === 'All') return true;
              return project.category.includes(activeFilter);
            })
            .map((project, index) => (
              <div
                key={project.id}
                className="opacity-0 animate-fadeInUp"
                style={{
                  animationDelay: `${index * 150}ms`,
                  animationFillMode: 'forwards',
                }}
              >
                <ProjectCard
                  project={project}
                  index={index}
                  onClick={() => setSelectedProject(project)}
                />
              </div>
            ))}

          {/* Empty State */}
          {projects.filter((project) => {
            if (activeFilter === 'All') return true;
            return project.category.includes(activeFilter);
          }).length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 font-light text-lg">
                No projects found for this category.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
