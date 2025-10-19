import React, { createContext, useState, useContext, PropsWithChildren } from 'react';
import { Project } from '../types.ts';
import { MOCK_PROJECTS } from '../constants.ts';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: PropsWithChildren) => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  const addProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: String(Date.now()), // Assign a unique ID
    };
    setProjects(prevProjects => [newProject, ...prevProjects]);
  };

  const updateProject = (projectId: string, updatedData: Partial<Omit<Project, 'id'>>) => {
    setProjects(prevProjects =>
      prevProjects.map(p =>
        p.id === projectId ? { ...p, ...updatedData } : p
      )
    );
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};