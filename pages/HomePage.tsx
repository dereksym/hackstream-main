import React, { useMemo } from 'react';
import { useProjects } from '../context/ProjectContext.tsx';
import ProjectRail from '../components/ProjectRail.tsx';
import Hero from '../components/Hero.tsx';
import { useFilter } from '../context/FilterContext.tsx';

const HomePage = () => {
    const { projects } = useProjects();
    const { activeCategories, showOnlyLive, searchQuery } = useFilter();

    const featuredProjects = [...projects].sort((a, b) => b.viewerCount - a.viewerCount).slice(0, 4);

    const content = useMemo(() => {
        const hasActiveFilters = activeCategories.length > 0 || showOnlyLive || searchQuery.trim() !== '';

        if (!hasActiveFilters) {
            // Default view
            const liveProjects = projects.filter(p => p.isLive);
            const trendingProjects = [...projects].sort((a, b) => b.viewerCount - a.viewerCount);
            const devToolsProjects = projects.filter(p => p.categoryPrimary === 'Developer tools & productivity');
            const dataVizProjects = projects.filter(p => p.categoryPrimary === 'Data visualization & analytics');
            return (
                <>
                    <ProjectRail title="Live Now" projects={liveProjects} />
                    <ProjectRail title="Trending" projects={trendingProjects} />
                    <ProjectRail title="Developer Tools" projects={devToolsProjects} />
                    <ProjectRail title="Data Viz" projects={dataVizProjects} />
                </>
            );
        }

        // Filtered view
        let filteredProjects = [...projects];
        
        if (showOnlyLive) {
            filteredProjects = filteredProjects.filter(p => p.isLive);
        }
        
        if (activeCategories.length > 0) {
            filteredProjects = filteredProjects.filter(p => 
                activeCategories.includes(p.categoryPrimary) || 
                p.categorySecondary.some(cat => activeCategories.includes(cat))
            );
        }

        if (searchQuery.trim() !== '') {
            const lowercasedQuery = searchQuery.toLowerCase().trim();
            filteredProjects = filteredProjects.filter(p => 
                p.name.toLowerCase().includes(lowercasedQuery) ||
                p.teamName.toLowerCase().includes(lowercasedQuery) ||
                p.tagline.toLowerCase().includes(lowercasedQuery) ||
                p.description.toLowerCase().includes(lowercasedQuery) ||
                p.categoryPrimary.toLowerCase().includes(lowercasedQuery) ||
                p.categorySecondary.some(cat => cat.toLowerCase().includes(lowercasedQuery)) ||
                p.techTags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
            );
        }
        
        const sortedFilteredProjects = [...filteredProjects].sort((a, b) => b.viewerCount - a.viewerCount);

        if (sortedFilteredProjects.length === 0) {
            return (
                <div className="text-center py-16">
                    <h2 className="text-2xl font-bold">No Projects Found</h2>
                    <p className="text-text-secondary mt-2">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
            );
        }

        return <ProjectRail title={`Results (${sortedFilteredProjects.length})`} projects={sortedFilteredProjects} />;

    }, [projects, activeCategories, showOnlyLive, searchQuery]);


    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Hero projects={featuredProjects} />
            <div className="py-12">
                {content}
            </div>
        </div>
    );
};

export default HomePage;