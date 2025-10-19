import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES, RUBRIC_MARKDOWN } from "../constants.ts";
import { Project, Rubric, Scores, AIScore, ChatMessage } from '../types.ts';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!apiKey) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const categorizeProject = async (description: string): Promise<{ categoryPrimary: string; categorySecondary: string[] }> => {
  if (!ai) {
    console.warn('AI service not available - API key not configured');
    return {
      categoryPrimary: 'Experimental or wild card',
      categorySecondary: [],
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following project description, please categorize it.
        
        Description: "${description}"

        Rules:
        1. Choose one primary category from the list.
        2. Choose up to two secondary categories from the list.
        3. The primary category cannot be a secondary category.
        4. Your response must be in the specified JSON format.

        Category List: ${CATEGORIES.join(", ")}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            categoryPrimary: {
              type: Type.STRING,
              description: 'The single most relevant category for the project.',
            },
            categorySecondary: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Up to two other relevant categories.'
            },
          },
          required: ["categoryPrimary", "categorySecondary"],
        },
      },
    });

    const parsed = JSON.parse(response.text);
    return {
        categoryPrimary: parsed.categoryPrimary || 'Experimental or wild card',
        categorySecondary: parsed.categorySecondary || [],
    }

  } catch (error) {
    console.error("Error categorizing project:", error);
    // Fallback in case of API error
    return {
      categoryPrimary: 'Experimental or wild card',
      categorySecondary: [],
    };
  }
};


export const getAiScores = async (project: Project, rubric: Rubric): Promise<Scores> => {
    if (!ai) {
        console.warn('AI service not available - API key not configured');
        return {};
    }

    try {
        const prompt = `
        You are an expert judge at a hackathon. Your task is to provide a preliminary score for a project based on its description and the official rubric. Provide a score, a short rationale for that score, and a confidence level (0.0 to 1.0) for each criterion.

        Project Details:
        - Name: ${project.name}
        - Tagline: ${project.tagline}
        - Description: ${project.description}
        - Tech Stack: ${project.techTags.join(', ')}

        Rubric:
        ${RUBRIC_MARKDOWN}

        Instructions:
        - Evaluate the project against each criterion in the rubric.
        - For "Presentation", infer quality from the project's descriptive clarity and compelling tagline.
        - For "Technical", evaluate based on the tech stack's appropriateness and implied complexity.
        - For "Impact" and "Polish", evaluate based on the project's description and problem statement.
        - Return a JSON object where keys are the exact criterion names from the rubric (e.g., "Clarity of problem", "Code quality").
        `;

        const properties: { [key: string]: any } = {};
        rubric.sections.forEach(section => {
            section.criteria.forEach(criterion => {
                properties[criterion.name] = {
                    type: Type.OBJECT,
                    description: `Score for ${criterion.name}`,
                    properties: {
                        score: { type: Type.NUMBER, description: `Score from 0 to ${criterion.maxPoints}` },
                        rationale: { type: Type.STRING, description: 'Brief justification for the score.' },
                        confidence: { type: Type.NUMBER, description: 'Confidence in the score from 0.0 to 1.0' },
                    },
                    required: ['score', 'rationale', 'confidence']
                }
            });
        });
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: properties,
                }
            },
        });
        
        const parsedScores = JSON.parse(response.text);
        const scores: Scores = {};

        for (const key in parsedScores) {
            scores[key] = { ai: parsedScores[key] as AIScore };
        }
        
        return scores;

    } catch (error) {
        console.error("Error getting AI scores:", error);
        return {};
    }
};

export const summarizeChat = async (messages: ChatMessage[]): Promise<string> => {
    if (!ai) {
        console.warn('AI service not available - API key not configured');
        throw new Error('AI service not available - API key not configured');
    }

    try {
        const formattedMessages = messages
            .map(msg => `${msg.user.name}: ${msg.message}`)
            .join('\n');
        
        const prompt = `You are a helpful assistant for a live stream platform. Summarize the following chat conversation from a hackathon project stream. Focus on:
- The main topics being discussed.
- Any frequently asked questions.
- The overall sentiment or viewer reaction.
Keep the summary concise, easy to read, and use bullet points for clarity.

Chat Log:
${formattedMessages}`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error summarizing chat:", error);
        throw new Error("Failed to connect to the AI service for chat summary.");
    }
};