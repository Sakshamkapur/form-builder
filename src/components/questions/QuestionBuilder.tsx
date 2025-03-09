import React, { useEffect, useState } from 'react';

import { questionApi } from '../../api/questionApi';
import { Question } from '../../api/types';
import Toast from '../common/Toast';
import QuestionForm from '../QuestionForm';

const QuestionBuilder: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await questionApi.getQuestions();
      setQuestions(response.data);
    } catch (err) {
      setToast({ message: 'Failed to load questions', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (question: Question) => {
    try {
      if (editingId) {
        await questionApi.updateQuestion(editingId, question);
        await loadQuestions();
        setToast({ message: 'Question saved successfully', type: 'success' });
      } else {
        await questionApi.addQuestion(question);
        await loadQuestions();
        setIsAddingNew(false);
        setToast({ message: 'Question created successfully', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to save question', type: 'error' });
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await questionApi.deleteQuestion(questionId);
      await loadQuestions();
      setToast({ message: 'Question deleted successfully', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to delete question', type: 'error' });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="mx-auto max-w-3xl p-4">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Form Builder</h1>
        <button
          onClick={() => setIsAddingNew(true)}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
        >
          Add New Question
        </button>
      </div>

      {/* New Question Form */}
      {isAddingNew && (
        <div className="mb-6 rounded-lg border shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
            <h3 className="font-medium">New Question</h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <QuestionForm onSave={handleSaveQuestion} />
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-4">
        {questions.map((question) => (
          <div key={question.id} className="rounded-lg border shadow-sm">
            {editingId === question.id ? (
              // Edit Mode
              <div>
                <div className="flex items-center justify-between border-b bg-gray-50 px-4 py-2">
                  <h3 className="font-medium">Edit Question</h3>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <QuestionForm initialQuestion={question} onSave={handleSaveQuestion} />
              </div>
            ) : (
              // View Mode
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <h3 className="font-medium">{question.label}</h3>
                  <p className="text-sm text-gray-500">Type: {question.type}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingId(question.id ?? null)}
                    className="p-2 text-blue-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => question.id && handleDeleteQuestion(question.id)}
                    className="p-2 text-red-500 hover:text-red-600"
                    title="Delete"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                      <path
                        fillRule="evenodd"
                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionBuilder;
