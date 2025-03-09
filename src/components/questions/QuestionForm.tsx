import React, { useCallback, useEffect, useState } from "react";

import { Question, QuestionType, SelectOption } from "../../api/types";
import useDebounce from "../../hooks/useDebounce";
import Toast from "../common/Toast";

interface QuestionFormProps {
  onSave: (question: Question) => Promise<void>;
  initialQuestion?: Question;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  onSave,
  initialQuestion,
}) => {
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [questionData, setQuestionData] = useState({
    label: "",
    type: "text" as QuestionType,
    required: false,
    hidden: false,
    helperText: "",
    // Number specific
    min: "",
    max: "",
    // Text specific
    minLength: "",
    maxLength: "",
    // Select specific
    options: [] as SelectOption[],
  });

  useEffect(() => {
    if (initialQuestion) {
      setQuestionData((prev) => ({
        ...prev,
        ...initialQuestion,
        min:
          initialQuestion.type === "number"
            ? String(initialQuestion.min || "")
            : "",
        max:
          initialQuestion.type === "number"
            ? String(initialQuestion.max || "")
            : "",
        minLength:
          initialQuestion.type === "text"
            ? String(initialQuestion.minLength || "")
            : "",
        maxLength:
          initialQuestion.type === "text"
            ? String(initialQuestion.maxLength || "")
            : "",
      }));
    }
  }, [initialQuestion]);

  const handleSave = useCallback(
    async (data: Question) => {
      setSaving(true);
      try {
        await onSave(data);
        setToastMessage("Question saved successfully!");
        setToastType("success");
        setShowToast(true);
      } catch (error) {
        console.error("Failed to save question:", error);
        setToastMessage("Failed to save question.");
        setToastType("error");
        setShowToast(true);
      } finally {
        setSaving(false);
      }
    },
    [onSave]
  );

  const debouncedSave = useDebounce(handleSave, 1000);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setQuestionData((prev) => {
      const updatedData = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };

      if (name.startsWith("options[")) {
        const index = parseInt(name.match(/\d+/)?.[0] || "0", 10);
        const field = name.split(".")[1]; // Get 'label' or 'value'
        const updatedOptions = [...prev.options];
        updatedOptions[index] = {
          ...updatedOptions[index],
          [field]: value,
        };
        updatedData.options = updatedOptions;
      }

      const isValid =
        updatedData.label &&
        updatedData.type &&
        (updatedData.type !== "select" || updatedData.options.length > 0);

      if (isValid) {
        const questionPayload = {
          ...updatedData,
          type: updatedData.type,
          ...(updatedData.type === "number" && {
            min: updatedData.min ? Number(updatedData.min) : undefined,
            max: updatedData.max ? Number(updatedData.max) : undefined,
          }),
          ...(updatedData.type === "text" && {
            minLength: updatedData.minLength
              ? Number(updatedData.minLength)
              : undefined,
            maxLength: updatedData.maxLength
              ? Number(updatedData.maxLength)
              : undefined,
          }),
          ...(updatedData.type === "select" && {
            options: updatedData.options, // Ensure options are included
          }),
        } as Question;

        debouncedSave(questionPayload);
      } else {
        setToastMessage(
          "Please fill in all required fields and ensure options are valid."
        );
        setToastType("error");
        setShowToast(true);
      }

      return updatedData;
    });
  };

  const addOption = () => {
    setQuestionData((prev) => ({
      ...prev,
      options: [...prev.options, { label: "", value: "" }],
    }));
  };

  const removeOption = (index: number) => {
    setQuestionData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const questionPayload = {
        type: questionData.type,
        label: questionData.label,
        required: questionData.required,
        hidden: questionData.hidden,
        helperText: questionData.helperText || undefined,
        ...(questionData.type === "number" && {
          min: questionData.min ? Number(questionData.min) : undefined,
          max: questionData.max ? Number(questionData.max) : undefined,
        }),
        ...(questionData.type === "text" && {
          minLength: questionData.minLength
            ? Number(questionData.minLength)
            : undefined,
          maxLength: questionData.maxLength
            ? Number(questionData.maxLength)
            : undefined,
        }),
        ...(questionData.type === "select" && {
          options: questionData.options,
        }),
      } as Question;

      await onSave(questionPayload);
      setToastMessage("Question saved successfully!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Failed to save question:", error);
      setToastMessage("Failed to save question.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  };

  const closeToast = () => {
    setShowToast(false);
  };

  return (
    <div className="relative">
      {saving && (
        <div className="absolute right-2 top-2 flex items-center text-sm text-blue-500">
          <svg
            className="-ml-1 mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Saving...
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
        <div>
          <label className="mb-2 block text-primary-dark">
            Question Title *
            <input
              type="text"
              name="label"
              value={questionData.label}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
              placeholder="Enter question title"
            />
          </label>
        </div>

        <div>
          <label className="mb-2 block">
            Question Type *
            <select
              name="type"
              value={questionData.type}
              onChange={handleInputChange}
              required
              className="w-full rounded border border-primary-teal p-2 focus:border-primary-blue focus:outline-none focus:ring-1 focus:ring-primary-blue"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
            </select>
          </label>
        </div>

        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="required"
              checked={questionData.required}
              onChange={handleInputChange}
              className="mr-2"
            />
            Required
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="hidden"
              checked={questionData.hidden}
              onChange={handleInputChange}
              className="mr-2"
            />
            Hidden
          </label>
        </div>

        <div>
          <label className="mb-2 block">
            Helper Text
            <textarea
              name="helperText"
              value={questionData.helperText}
              onChange={handleInputChange}
              className="w-full rounded border p-2"
              placeholder="Enter helper text"
            />
          </label>
        </div>

        {questionData.type === "number" && (
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Minimum Value
              <input
                type="number"
                name="min"
                value={questionData.min}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
              />
            </label>
            <label className="block">
              Maximum Value
              <input
                type="number"
                name="max"
                value={questionData.max}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
              />
            </label>
          </div>
        )}

        {questionData.type === "text" && (
          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              Minimum Length
              <input
                type="number"
                name="minLength"
                value={questionData.minLength}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
              />
            </label>
            <label className="block">
              Maximum Length
              <input
                type="number"
                name="maxLength"
                value={questionData.maxLength}
                onChange={handleInputChange}
                className="w-full rounded border p-2"
              />
            </label>
          </div>
        )}

        {questionData.type === "select" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-primary-dark">Options</h3>
              <button
                type="button"
                onClick={addOption}
                className="rounded bg-primary-purple px-3 py-1 text-white hover:bg-primary-blue"
              >
                Add Option
              </button>
            </div>
            {questionData.options.map((option, index) => (
              <div key={index} className="flex space-x-2">
                <input
                  type="text"
                  name={`options[${index}].label`}
                  value={option.label}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Option Label"
                  className="flex-1 rounded border p-2"
                />
                <input
                  type="text"
                  name={`options[${index}].value`}
                  value={option.value}
                  onChange={(e) => handleInputChange(e)}
                  placeholder="Option Value"
                  className="flex-1 rounded border p-2"
                />
                <button
                  type="button"
                  onClick={() => removeOption(index)}
                  className="rounded bg-red-500 px-3 py-1 text-white"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </form>

      {showToast && (
        <Toast message={toastMessage} type={toastType} onClose={closeToast} />
      )}
    </div>
  );
};

export default QuestionForm;
