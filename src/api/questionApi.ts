import { ApiResponse, Question } from './types';

const STORAGE_KEY = 'form_builder_questions';

// Helper to generate random delay between 1-3 seconds
const getRandomDelay = () => Math.floor(Math.random() * 2000) + 1000;

// Helper to simulate random errors (20% chance)
const shouldError = () => Math.random() < 0.1;

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const questionApi = {
  // Add a new question
  addQuestion: async (question: Question): Promise<ApiResponse<Question>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: 'Failed to save question' });
          return;
        }

        try {
          const questions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const newQuestion = {
            ...question,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };

          questions.push(newQuestion);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));

          resolve({ success: true, data: newQuestion });
        } catch (error) {
          reject({ success: false, error: 'Failed to save question' });
        }
      }, getRandomDelay());
    });
  },

  // Get all questions
  getQuestions: async (): Promise<ApiResponse<Question[]>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: 'Failed to fetch questions' });
          return;
        }

        try {
          const questions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          resolve({ success: true, data: questions });
        } catch (error) {
          reject({ success: false, error: 'Failed to fetch questions' });
        }
      }, getRandomDelay());
    });
  },

  // Update a question
  updateQuestion: async (
    questionId: string,
    updates: Partial<Question>,
  ): Promise<ApiResponse<Question>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: 'Failed to update question' });
          return;
        }

        try {
          const questions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const index = questions.findIndex((q: Question) => q.id === questionId);

          if (index === -1) {
            reject({ success: false, error: 'Question not found' });
            return;
          }

          questions[index] = { ...questions[index], ...updates };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));

          resolve({ success: true, data: questions[index] });
        } catch (error) {
          reject({ success: false, error: 'Failed to update question' });
        }
      }, getRandomDelay());
    });
  },

  // Delete a question
  deleteQuestion: async (questionId: string): Promise<ApiResponse<void>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: 'Failed to delete question' });
          return;
        }

        try {
          const questions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const filteredQuestions = questions.filter(
            (q: Question) => q.id !== questionId,
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQuestions));

          resolve({ success: true, data: undefined });
        } catch (error) {
          reject({ success: false, error: 'Failed to delete question' });
        }
      }, getRandomDelay());
    });
  },
};
