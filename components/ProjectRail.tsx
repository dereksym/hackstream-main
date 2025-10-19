import React from 'react';
import { Project } from '../types.ts';
import StreamCard from './StreamCard.tsx';

interface ProjectRailProps {
  title: string;
  projects: Project[];
}

const ProjectRail: React.FC<ProjectRailProps> = ({ title, projects }) => {
  if (projects.length === 0) return null;

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 text-white">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <StreamCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjectRail;