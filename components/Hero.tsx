import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types.ts';
import { PlayCircle, ChevronLeft, ChevronRight } from './Icons.tsx';
import ProjectDetailsModal from './ProjectDetailsModal.tsx';

interface HeroProps {
    projects: Project[];
}

const Hero: React.FC<HeroProps> = ({ projects }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!projects || projects.length === 0) {
        return null;
    }

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? projects.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === projects.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    const project = projects[currentIndex];

    const handleOpenModal = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
        <>
            <div className="relative h-[60vh] rounded-2xl flex items-end p-8 md:p-12 text-white overflow-hidden group">
                {/* Background Images for cross-fade */}
                <div className="absolute inset-0">
                    {projects.map((p, index) => (
                        <img
                            key={p.id}
                            src={`https://picsum.photos/seed/hero${p.id}/1440/900`}
                            alt=""
                            aria-hidden="true"
                            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        />
                    ))}
                    <div className="absolute inset-0 bg-black/30"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-background via-background/10 to-transparent"></div>
                </div>

                {/* Content with fade-in animation on change */}
                <div className="relative z-10 max-w-xl w-full" key={project.id}>
                    <div className="animate-fade-in">
                        <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider border border-white">{project.categoryPrimary}</span>
                        <h1 className="text-4xl md:text-6xl font-black my-4 leading-tight">{project.name}</h1>
                        <p className="text-lg text-text-secondary mb-6">{project.tagline}</p>
                        <div className="flex items-center space-x-4">
                            <Link to={`/watch/${project.id}`} className="flex items-center space-x-2 bg-primary hover:bg-primary-hover transition-colors text-white font-bold py-3 px-8 rounded-lg">
                                <PlayCircle className="w-6 h-6"/>
                                <span>Watch Now</span>
                            </Link>
                            <button 
                                onClick={handleOpenModal}
                                className="bg-white/20 hover:bg-white/30 transition-colors text-white font-bold py-3 px-8 rounded-lg"
                            >
                                Project Details
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Previous project"
                >
                    <ChevronLeft className="w-8 h-8"/>
                </button>
                <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/60 rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Next project"
                >
                    <ChevronRight className="w-8 h-8"/>
                </button>

                {/* Navigation Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
                    {projects.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/75'}`}
                            aria-label={`Go to slide ${index + 1}`}
                        ></button>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <ProjectDetailsModal project={project} onClose={handleCloseModal} />
            )}
        </>
    );
}

export default Hero;