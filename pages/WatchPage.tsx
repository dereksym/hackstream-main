import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext.tsx';
import { Project } from '../types.ts';
import Chat from '../components/Chat.tsx';
import { Eye, ChevronDown, Github, ExternalLink } from '../components/Icons.tsx';

const WatchPage = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const { projects } = useProjects();
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

    useEffect(() => {
        const foundProject = projects.find(p => p.id === projectId);
        setProject(foundProject);
    }, [projectId, projects]);

    if (!project) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold">Project Not Found</h1>
                <p className="text-text-secondary mt-2">Could not find the project you're looking for.</p>
            </div>
        );
    }

    const VideoPlayer = ({ project }: { project: Project }) => (
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white p-4 bg-black/50 rounded-lg backdrop-blur-sm">
                    <h2 className="text-2xl font-bold">Stream Offline</h2>
                    <p>This is a placeholder for the video stream.</p>
                </div>
            </div>
             {project.isLive && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider">
                    LIVE
                </div>
            )}
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center space-x-2">
                <Eye className="w-5 h-5" />
                <span>{project.viewerCount.toLocaleString()}</span>
            </div>
        </div>
    );

    const ProjectInfo = ({ project }: { project: Project }) => (
        <div className="mt-6">
            <div 
                className="flex justify-between items-center cursor-pointer lg:cursor-auto"
                onClick={() => setIsDetailsExpanded(prev => !prev)}
                role="button"
                aria-expanded={isDetailsExpanded}
                aria-controls="project-details-content"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsDetailsExpanded(prev => !prev); }}}
            >
                <div>
                    <h1 className="text-3xl lg:text-4xl font-black">{project.name}</h1>
                    <p className="text-lg lg:text-xl text-text-secondary mt-1">{project.teamName}</p>
                </div>
                <ChevronDown className={`w-6 h-6 text-text-secondary transition-transform duration-300 lg:hidden ${isDetailsExpanded ? 'rotate-180' : ''}`} />
            </div>

            <div 
                id="project-details-content"
                className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    lg:max-h-none lg:opacity-100
                    ${isDetailsExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="flex flex-wrap gap-2 my-4">
                    <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold border border-white">{project.categoryPrimary}</span>
                    {project.categorySecondary.map(cat => (
                        <span key={cat} className="px-3 py-1 bg-surface-accent text-text-secondary rounded-full text-sm font-semibold border border-white">{cat}</span>
                    ))}
                </div>
                <p className="text-text-secondary leading-relaxed mt-4">{project.description}</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                     <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#181818] hover:bg-surface-hover transition-colors text-text-primary font-bold py-3 px-6 rounded-lg">
                        <Github className="w-5 h-5" />
                        <span>View Repo</span>
                    </a>
                     <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-[#181818] hover:bg-surface-hover transition-colors text-text-primary font-bold py-3 px-6 rounded-lg">
                        <ExternalLink className="w-5 h-5" />
                        <span>Live Demo</span>
                    </a>
                </div>
            </div>
        </div>
    );

    return (
        <div className="max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <div className="lg:col-span-2 xl:col-span-3">
                <VideoPlayer project={project} />
                <ProjectInfo project={project} />
            </div>
            <div className="lg:col-span-1 xl:col-span-1 max-h-[60vh] lg:max-h-[calc(100vh-8rem)]">
                <Chat />
            </div>
        </div>
    );
};

export default WatchPage;