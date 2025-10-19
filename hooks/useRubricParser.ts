
import { useState, useEffect } from 'react';
import { Rubric, RubricSection, RubricCriterion } from '../types.ts';

export const useRubricParser = (markdown: string): Rubric | null => {
    const [rubric, setRubric] = useState<Rubric | null>(null);

    useEffect(() => {
        try {
            const lines = markdown.trim().split('\n');
            const newRubric: Rubric = { version: '', sections: [] };
            let currentSection: RubricSection | null = null;

            lines.forEach(line => {
                line = line.trim();
                if (line.startsWith('# ')) {
                    newRubric.version = line.substring(2).trim();
                } else if (line.startsWith('## ')) {
                    if (currentSection) {
                        newRubric.sections.push(currentSection);
                    }
                    const [name, weight] = line.substring(3).split(' - ');
                    currentSection = {
                        name: name.trim(),
                        weight: parseInt(weight, 10),
                        criteria: []
                    };
                } else if (line.startsWith('- ')) {
                    if (currentSection) {
                        const [name, maxPoints] = line.substring(2).split(' - ');
                        const criterion: RubricCriterion = {
                            name: name.trim(),
                            maxPoints: parseInt(maxPoints, 10)
                        };
                        currentSection.criteria.push(criterion);
                    }
                }
            });
             if (currentSection) {
                newRubric.sections.push(currentSection);
            }

            setRubric(newRubric);
        } catch (error) {
            console.error("Failed to parse rubric markdown:", error);
            setRubric(null);
        }
    }, [markdown]);

    return rubric;
};