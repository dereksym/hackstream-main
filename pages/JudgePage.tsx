import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useProjects } from '../context/ProjectContext.tsx';
import { UserRole, Project, Rubric, Scores } from '../types.ts';
import { RUBRIC_MARKDOWN } from '../constants.ts';
import { useRubricParser } from '../hooks/useRubricParser.ts';
import { getAiScores } from '../services/geminiService.ts';
import { Loader, BrainCircuit } from '../components/Icons.tsx';

const JudgePage = () => {
    const { user } = useAuth();
    const { projects } = useProjects();
    const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);
    const rubric = useRubricParser(RUBRIC_MARKDOWN);
    const [scores, setScores] = useState<Scores>({});
    const [isScoring, setIsScoring] = useState(false);

    const handleGetAiScores = async () => {
        if (!selectedProject || !rubric) return;
        setIsScoring(true);
        setScores({});
        const aiScores = await getAiScores(selectedProject, rubric);
        setScores(aiScores);
        setIsScoring(false);
    };
    
    const handleScoreChange = (criterionName: string, value: number) => {
        setScores(prev => ({
            ...prev,
            [criterionName]: { ...prev[criterionName], human: value }
        }));
    };

    const finalScores = useMemo(() => {
        if (!rubric) return {};
        const totals: { [section: string]: { total: number, max: number } } = {};
        
        rubric.sections.forEach(section => {
            totals[section.name] = { total: 0, max: 0 };
            section.criteria.forEach(criterion => {
                const scoreData = scores[criterion.name];
                const finalScore = scoreData?.human ?? scoreData?.ai?.score ?? 0;
                totals[section.name].total += finalScore;
                totals[section.name].max += criterion.maxPoints;
            });
        });
        return totals;
    }, [scores, rubric]);
    
    const grandTotal = useMemo(() => {
      // FIX: Explicitly typing `acc` as a number resolves the issue where it was being inferred as `unknown`.
      return Object.values(finalScores).reduce((acc: number, curr) => acc + (curr as { total: number }).total, 0);
    }, [finalScores]);


    if (user.role !== UserRole.Judge && user.role !== UserRole.Organizer) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h1 className="text-3xl font-bold">Access Denied</h1>
                <p className="text-text-secondary mt-2">This page is for judges and organizers only.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-black mb-8">Judging Console</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Pane: Project List */}
                <div className="lg:w-1/3 bg-surface p-6 rounded-lg border border-surface-accent">
                    <h2 className="text-xl font-bold mb-4">Projects</h2>
                    <div className="space-y-2">
                        {projects.map(p => (
                            <div
                                key={p.id}
                                onClick={() => { setSelectedProject(p); setScores({}); }}
                                className={`p-4 rounded-lg cursor-pointer transition-colors ${selectedProject?.id === p.id ? 'bg-primary text-white' : 'bg-surface-accent hover:bg-surface-accent-hover'}`}
                            >
                                <h3 className="font-bold">{p.name}</h3>
                                <p className="text-sm opacity-80">{p.teamName}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane: Judging Area */}
                <div className="lg:w-2/3 bg-surface p-6 rounded-lg border border-surface-accent">
                    {selectedProject && rubric ? (
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
                                    <p className="text-text-secondary">{selectedProject.tagline}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-4xl font-black text-primary">{grandTotal} <span className="text-2xl text-text-secondary">/ 100</span></h3>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleGetAiScores} 
                                disabled={isScoring}
                                className="w-full flex justify-center items-center space-x-2 bg-primary/20 border border-primary text-text-primary font-semibold py-3 px-6 rounded-lg mb-8 hover:bg-primary/40 transition-colors disabled:opacity-50 disabled:cursor-wait"
                            >
                                {isScoring ? <Loader className="w-6 h-6"/> : <BrainCircuit className="w-6 h-6"/>}
                                <span>{isScoring ? 'Generating AI Pre-score...' : 'Get AI Pre-score'}</span>
                            </button>

                            <div className="space-y-8">
                                {rubric.sections.map(section => (
                                    <div key={section.name}>
                                        <div className="flex justify-between items-baseline mb-4 pb-2 border-b border-surface-accent">
                                          <h3 className="text-xl font-bold">{section.name}</h3>
                                          <span className="font-bold text-lg">{finalScores[section.name]?.total || 0} / {finalScores[section.name]?.max || 0}</span>
                                        </div>
                                        <div className="space-y-6">
                                            {section.criteria.map(criterion => {
                                                const aiScore = scores[criterion.name]?.ai;
                                                const humanScore = scores[criterion.name]?.human;
                                                return (
                                                    <div key={criterion.name}>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <label className="font-semibold">{criterion.name}</label>
                                                            <span className="text-lg font-bold w-24 text-right">{humanScore ?? aiScore?.score ?? 0} / {criterion.maxPoints}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <input
                                                                type="range"
                                                                min="0"
                                                                max={criterion.maxPoints}
                                                                value={humanScore ?? aiScore?.score ?? 0}
                                                                onChange={(e) => handleScoreChange(criterion.name, parseInt(e.target.value))}
                                                                className="w-full h-2 bg-surface-accent rounded-lg appearance-none cursor-pointer accent-primary"
                                                            />
                                                        </div>
                                                        {aiScore && (
                                                            <div className="mt-2 p-3 bg-surface-accent/50 rounded-lg text-sm text-text-secondary">
                                                                <p><strong className="text-text-primary">AI Rationale:</strong> {aiScore.rationale} <span className="opacity-70">(Confidence: {Math.round(aiScore.confidence * 100)}%)</span></p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-text-secondary">
                            <p>Select a project to begin judging.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JudgePage;