/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  fullName: string;
  userType: 'school' | 'college' | 'self_learner' | 'teacher' | '';
  classYear: string; // e.g. "1st Year", "Class 10"
  studyField: string; // e.g. "Computer Science, AI & Data Science, Mechanical Engineering"
  email?: string;
  isGuest?: boolean;
}

export type AppTab =
  | 'home'
  | 'convert'
  | 'debug'
  | 'ask'
  | 'scan'
  | 'book'
  | 'ai'
  | 'learn'
  | 'profile'
  | 'login'
  | 'signup';

export interface AppState {
  isPremium: boolean;
  isAdFree: boolean;
  solvesRemaining: number;
  adProgress: number; // 0 to 3, matching watched count to earn 1 solve
  isLoggedIn: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  startingCode: string;
  testPrompt: string; // instructions of what to try
}

export interface Lesson {
  id: string;
  title: string;
  category: 'python' | 'java' | 'cpp' | 'web' | 'javascript' | 'rust' | 'go' | 'kotlin' | 'swift' | 'sql' | 'bash';
  concept: string;
  text: string;
  codeSnippet: string;
  exercise: Exercise;
}
