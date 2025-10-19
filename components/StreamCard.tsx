
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types.ts';
import { Eye, Clock } from './Icons.tsx';

interface StreamCardProps {
  project: Project;
}

const StreamCard: React.FC<StreamCardProps> = ({ project }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to={`/watch/${project.id}`} className="block group">
            <div 
                className="relative aspect-video bg-surface rounded-lg overflow-hidden transition-transform duration-300 ease-out group-hover:scale-105"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                {project.isLive && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">
                        LIVE
                    </div>
                )}
                 <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-md text-xs font-medium flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{project.viewerCount.toLocaleString()}</span>
                </div>
                {/* Mock live duration */}
                 {project.isLive && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-0.5 rounded-md text-xs font-medium flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>2:45:10</span>
                    </div>
                )}
            </div>
            <div className="mt-3">
                <h3 className="text-lg font-bold text-text-primary truncate group-hover:text-white transition-colors">{project.name}</h3>
                <p className="text-sm text-text-secondary truncate">{project.teamName}</p>
                <p className="text-sm text-text-secondary bg-surface-accent inline-block px-2 py-1 rounded-full mt-2 border border-white">{project.categoryPrimary}</p>
            </div>
        </Link>
    );
};

export default StreamCard;