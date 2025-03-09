import { ApiResponse, Question } from "./types";

const STORAGE_KEY = "form_builder_questions";

const getRandomDelay = () => Math.floor(Math.random() * 2000) + 1000;

const shouldError = () => Math.random() < 0.1;

const generateId = () => Math.random().toString(36).substr(2, 9);

export const questionApi = {
  addQuestion: async (question: Question): Promise<ApiResponse<Question>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: "Failed to save question" });
          return;
        }

        try {
          const questions = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
          );
          const newQuestion = {
            ...question,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };

          questions.push(newQuestion);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));

          resolve({ success: true, data: newQuestion });
        } catch (error) {
          reject({ success: false, error: "Failed to save question" });
        }
      }, getRandomDelay());
    });
  },

  getQuestions: async (): Promise<ApiResponse<Question[]>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: "Failed to fetch questions" });
          return;
        }

        try {
          const questions = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
          );
          resolve({ success: true, data: questions });
        } catch (error) {
          reject({ success: false, error: "Failed to fetch questions" });
        }
      }, getRandomDelay());
    });
  },

  updateQuestion: async (
    questionId: string,
    updates: Partial<Question>
  ): Promise<ApiResponse<Question>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: "Failed to update question" });
          return;
        }

        try {
          const questions = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
          );
          const index = questions.findIndex(
            (q: Question) => q.id === questionId
          );

          if (index === -1) {
            reject({ success: false, error: "Question not found" });
            return;
          }

          questions[index] = { ...questions[index], ...updates };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(questions));

          resolve({ success: true, data: questions[index] });
        } catch (error) {
          reject({ success: false, error: "Failed to update question" });
        }
      }, getRandomDelay());
    });
  },

  deleteQuestion: async (questionId: string): Promise<ApiResponse<void>> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (shouldError()) {
          reject({ success: false, error: "Failed to delete question" });
          return;
        }

        try {
          const questions = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
          );
          const filteredQuestions = questions.filter(
            (q: Question) => q.id !== questionId
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredQuestions));

          resolve({ success: true, data: undefined });
        } catch (error) {
          reject({ success: false, error: "Failed to delete question" });
        }
      }, getRandomDelay());
    });
  },
};
