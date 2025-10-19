import React, { useEffect, useRef } from 'react';
import { Project } from '../types.ts';
import { X, Github, ExternalLink } from './Icons.tsx';

interface ProjectDetailsModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ project, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Handle click outside
  const handleClickOutside = (event: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-modal-fade-in"
      onClick={handleClickOutside}
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
    >
      <div
        ref={modalRef}
        className="bg-black rounded-2xl border border-surface-accent w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col animate-modal-slide-up"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-surface-accent sticky top-0 bg-black z-10">
          <h2 id="project-modal-title" className="text-2xl font-bold text-white">{project.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-hover text-text-secondary hover:text-white transition-colors"
            aria-label="Close project details"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-lg text-text-secondary">{project.tagline}</p>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Description</h3>
            <p className="text-text-primary leading-relaxed">{project.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold border border-white">{project.categoryPrimary}</span>
              {project.categorySecondary.map(cat => (
                <span key={cat} className="px-3 py-1 bg-surface-accent text-text-secondary rounded-full text-sm font-semibold border border-white">{cat}</span>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-3">Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {project.techTags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface-hover text-text-primary rounded-md text-sm font-medium">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer with links */}
        <div className="p-6 border-t border-surface-accent mt-auto bg-black flex flex-col sm:flex-row gap-4">
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-surface-accent hover:bg-surface-accent-hover transition-colors text-text-primary font-bold py-3 px-6 rounded-lg text-center">
            <Github className="w-5 h-5" />
            <span>View Repo</span>
          </a>
          <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover transition-colors text-white font-bold py-3 px-6 rounded-lg text-center">
            <ExternalLink className="w-5 h-5" />
            <span>Live Demo</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;