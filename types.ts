// FIX: Removed self-import of `UserRole` which caused a circular dependency and declaration conflict.
export enum UserRole {
  Visitor = 'Visitor',
  Participant = 'Participant',
  Judge = 'Judge',
  Organizer = 'Organizer',
}

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatar: string;
}

export interface Project {
  id: string;
  teamName: string;
  name: string;
  tagline: string;
  description: string;
  categoryPrimary: string;
  categorySecondary: string[];
  techTags: string[];
  streamPlatform: 'Twitch' | 'YouTube';
  streamUrl: string;
  isLive: boolean;
  thumbnail: string;
  viewerCount: number;
  repoUrl: string;
  demoUrl: string;
}

export interface RubricCriterion {
    name: string;
    maxPoints: number;
}

export interface RubricSection {
    name: string;
    weight: number;
    criteria: RubricCriterion[];
}

export interface Rubric {
    version: string;
    sections: RubricSection[];
}

export interface AIScore {
    score: number;
    rationale: string;
    confidence: number;
}

export interface Scores {
    [criterionName: string]: {
        ai?: AIScore;
        human?: number;
    }
}

export interface ChatMessage {
  id: string;
  user: User;
  message: string;
  timestamp: string;
}