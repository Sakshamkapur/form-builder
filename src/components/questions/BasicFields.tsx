import React from "react";

import { QuestionType } from "../../api/types";

interface BasicFieldsProps {
  label: string;
  type: QuestionType;
  required: boolean;
  hidden: boolean;
  helperText: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
}

const BasicFields: React.FC<BasicFieldsProps> = ({
  label,
  type,
  required,
  hidden,
  helperText,
  onChange,
}) => (
  <>
    <div>
      <label className="mb-2 block">
        Question Title *
        <input
          type="text"
          name="label"
          value={label}
          onChange={onChange}
          required
          className="w-full rounded border p-2"
          placeholder="Enter question title"
        />
      </label>
    </div>

    <div>
      <label className="mb-2 block">
        Question Type *
        <select
          name="type"
          value={type}
          onChange={onChange}
          required
          className="w-full rounded border p-2"
        >
          <option value="text">Text</option>
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
          checked={required}
          onChange={onChange}
          className="mr-2"
        />
        Required
      </label>
      <label className="flex items-center">
        <input
          type="checkbox"
          name="hidden"
          checked={hidden}
          onChange={onChange}
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
          value={helperText}
          onChange={onChange}
          className="w-full rounded border p-2"
          placeholder="Enter helper text"
        />
      </label>
    </div>
  </>
);

export default BasicFields;
