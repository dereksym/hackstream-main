import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProjects } from '../context/ProjectContext.tsx';
import { UserRole, Project } from '../types.ts';
import { categorizeProject } from '../services/geminiService.ts';
import { CATEGORIES } from '../constants.ts';
import { Loader } from '../components/Icons.tsx';
import SubmittedProjectCard from '../components/SubmittedProjectCard.tsx';

const InputField: React.FC<{ 
  label: string; 
  placeholder: string; 
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, placeholder, name, value, onChange }) => (
  <div>
      <label htmlFor={name} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
      <input 
        type="text" 
        name={name} 
        id={name} 
        value={value}
        onChange={onChange}
        className="w-full bg-[#181818] border border-surface-accent rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary" 
        placeholder={placeholder} 
      />
  </div>
);

const SubmitPage = () => {
  const { user } = useAuth();
  const { projects, addProject, updateProject } = useProjects();
  
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectName, setProjectName] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');
  
  const [isCategorizing, setIsCategorizing] = useState(false);
  const [categories, setCategories] = useState<{ primary: string; secondary: string[] }>({ primary: '', secondary: [] });
  const [showManualCategory, setShowManualCategory] = useState(false);

  const myProject = useMemo(() => {
    return projects.find(p => p.teamName === user.name);
  }, [projects, user.name]);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setProjectName(project.name);
    setTagline(project.tagline);
    setDescription(project.description);
    setCategories({ primary: project.categoryPrimary, secondary: project.categorySecondary });
    setShowManualCategory(true);
  };

  const handleCancelEdit = () => {
    setEditingProject(null);
    resetForm();
  };
  
  const resetForm = () => {
    setProjectName('');
    setTagline('');
    setDescription('');
    setCategories({ primary: '', secondary: [] });
    setShowManualCategory(false);
  };

  const createProject = (): boolean => {
    if (!projectName || !description || !categories.primary) {
      alert('Please fill out all required fields, including name, description, and at least a primary category.');
      return false;
    }
    
    const newProject: Omit<Project, 'id'> = {
        teamName: user.name,
        name: projectName,
        tagline: tagline,
        description: description,
        categoryPrimary: categories.primary,
        categorySecondary: categories.secondary,
        techTags: ['New', 'Hackathon'],
        streamPlatform: 'Twitch',
        streamUrl: 'https://www.twitch.tv/some_user',
        isLive: false,
        thumbnail: `https://picsum.photos/seed/${Date.now()}/480/270`,
        viewerCount: 0,
        repoUrl: 'https://github.com/example/new-project',
        demoUrl: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
    };
    
    addProject(newProject);
    return true;
  };

  const handleCreateStream = () => {
    if (createProject()) {
      alert('Live stream created successfully! You can find it below.');
      resetForm();
    }
  };

  const handleUpdateProject = () => {
    if (!editingProject) return;
    if (!projectName || !description || !categories.primary) {
        alert('Please fill out all required fields.');
        return;
    }

    const updatedData: Partial<Omit<Project, 'id'>> = {
        name: projectName,
        tagline: tagline,
        description: description,
        categoryPrimary: categories.primary,
        categorySecondary: categories.secondary,
    };
    
    updateProject(editingProject.id, updatedData);
    setEditingProject(null);
    resetForm();
    alert('Project updated successfully!');
  };

  const handleToggleLive = (project: Project) => {
    updateProject(project.id, { isLive: !project.isLive });
  };
  
  // FIX: Defined the missing 'handleDescriptionBlur' function to automatically categorize the project based on its description.
  const handleDescriptionBlur = async () => {
    if (description.trim() === '') return;

    setIsCategorizing(true);
    setShowManualCategory(false);
    try {
      const result = await categorizeProject(description);
      setCategories({ primary: result.categoryPrimary, secondary: result.categorySecondary });
    } catch (error) {
      console.error("AI categorization failed:", error);
      setShowManualCategory(true); // fallback to manual selection
    } finally {
      setIsCategorizing(false);
    }
  };

  if (user.role !== UserRole.Participant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-3xl font-bold">Access Denied</h1>
        <p className="text-text-secondary mt-2">Only participants can submit projects.</p>
      </div>
    );
  }
  
  const isEditing = !!editingProject;
  const showForm = !myProject || isEditing;
  const showDashboard = myProject && !isEditing;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-black mb-2 text-left">Participant Studio</h1>
      <p className="text-text-secondary mb-10 text-left">Manage your hackathon project.</p>

      {showForm && (
        <div className="bg-surface p-8 rounded-lg border border-surface-accent">
          <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Edit Project Details' : 'Create Live Stream'}</h2>
          <div className="space-y-6">
            <InputField 
              label="Project Name" 
              name="projectName" 
              placeholder="e.g., Global Climate Visualizer"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
            <InputField 
              label="Tagline" 
              name="tagline" 
              placeholder="A short, catchy phrase for your project"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Describe what you are building</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={isEditing ? undefined : handleDescriptionBlur}
                className="w-full bg-[#181818] border border-surface-accent rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Be descriptive! Our AI will use this to suggest categories for you."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Categories</label>
              {(showManualCategory || (!isCategorizing && !categories.primary)) ? (
                  <div className="mt-2">
                       <select 
                          value={categories.primary}
                          onChange={(e) => setCategories({ ...categories, primary: e.target.value })}
                          className="w-full bg-[#181818] border border-surface-accent rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                       >
                           <option value="">Select primary category</option>
                           {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                  </div>
               ) : isCategorizing ? (
                <div className="flex items-center space-x-2 text-text-secondary">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing your description...</span>
                </div>
              ) : (
                  categories.primary && (
                  <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-3 py-1 bg-primary text-white rounded-full text-sm font-semibold border border-white">
                          {categories.primary} (Primary)
                      </span>
                      {categories.secondary.map(cat => (
                          <span key={cat} className="px-3 py-1 bg-surface-accent text-text-secondary rounded-full text-sm font-semibold border border-white">
                              {cat}
                          </span>
                      ))}
                      <button onClick={() => setShowManualCategory(true)} className="text-sm text-primary hover:underline ml-2">
                          Change
                      </button>
                  </div>
                )
              )}
            </div>
            <div className="pt-6 flex justify-end space-x-4">
              {isEditing && (
                <button 
                  onClick={handleCancelEdit}
                  className="bg-surface-accent hover:bg-surface-accent-hover transition-colors text-text-primary font-bold py-3 px-8 rounded-lg"
                >
                    Cancel
                </button>
              )}
              <button 
                onClick={isEditing ? handleUpdateProject : handleCreateStream}
                className="bg-white hover:bg-gray-200 transition-colors text-black font-bold py-3 px-8 rounded-lg"
              >
                  {isEditing ? 'Save Changes' : 'Create Live Stream'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDashboard && myProject && (
        <div className="mt-0">
          <h2 className="text-3xl font-bold mb-6">Your Live Stream Project</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SubmittedProjectCard project={myProject} onEdit={handleEditClick} onToggleLive={handleToggleLive} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitPage;