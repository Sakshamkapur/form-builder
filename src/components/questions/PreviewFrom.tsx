import React from "react";
import { Question } from "../../api/types";

interface PreviewFromProps {
  questions: Question[];
}

const PreviewFrom: React.FC<PreviewFromProps> = ({ questions }) => {
  return (
    <div className="space-y-6">
      {questions.map((question) => (
        <div key={question.id} className="space-y-2">
          <label className="block font-medium text-primary-dark">
            {question.label}
            {question.required && <span className="ml-1 text-red-500">*</span>}
          </label>

          {question.type === "text" && (
            <input
              type="text"
              className="w-full rounded-md border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              placeholder={question.placeholder || ""}
            />
          )}

          {question.type === "number" && (
            <input
              type="number"
              className="w-full rounded-md border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              placeholder={question.placeholder || ""}
              min={question.min}
              max={question.max}
            />
          )}

          {question.type === "textarea" && (
            <textarea
              className="w-full rounded-md border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              placeholder={question.placeholder || ""}
              rows={3}
            />
          )}

          {question.type === "select" && (
            <select className="w-full rounded-md border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue">
              <option value="">Select an option</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

          {question.description && (
            <p className="text-sm text-gray-500">{question.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PreviewFrom;
