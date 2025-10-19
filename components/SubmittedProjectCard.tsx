import React from 'react';
import { Project } from '../types.ts';
import { Edit3, Wifi } from './Icons.tsx';

interface SubmittedProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onToggleLive: (project: Project) => void;
}

const SubmittedProjectCard: React.FC<SubmittedProjectCardProps> = ({ project, onEdit, onToggleLive }) => {
  return (
    <div className="bg-surface p-6 rounded-lg border border-surface-accent col-span-1 sm:col-span-2 flex flex-col sm:flex-row gap-6">
      <img src={project.thumbnail} alt={project.name} className="w-full sm:w-48 h-auto object-cover rounded-md aspect-video sm:aspect-square" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="text-2xl font-bold">{project.name}</h3>
                <p className="text-text-secondary mt-1">{project.tagline}</p>
            </div>
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold ${project.isLive ? 'bg-red-500/20 text-red-400' : 'bg-gray-500/20 text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${project.isLive ? 'bg-red-500' : 'bg-gray-500'}`} />
                <span>{project.isLive ? 'Live' : 'Offline'}</span>
            </div>
        </div>
        <div className="flex flex-wrap gap-2 my-4">
            <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold border border-white">{project.categoryPrimary}</span>
            {project.categorySecondary.map(cat => (
                <span key={cat} className="px-3 py-1 bg-surface-accent text-text-secondary rounded-full text-sm font-semibold border border-white">{cat}</span>
            ))}
        </div>
        <p className="text-sm text-text-secondary line-clamp-2">{project.description}</p>
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => onEdit(project)}
              className="flex-1 flex items-center justify-center gap-2 bg-surface-accent hover:bg-surface-accent-hover transition-colors text-text-primary font-bold py-3 px-6 rounded-lg"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => onToggleLive(project)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500/20 hover:bg-green-500/30 transition-colors text-green-400 font-bold py-3 px-6 rounded-lg"
            >
              <Wifi className="w-5 h-5" />
              <span>{project.isLive ? 'End Stream' : 'Go Live'}</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default SubmittedProjectCard;