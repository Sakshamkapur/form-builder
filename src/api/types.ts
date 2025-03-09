export type QuestionType = "text" | "number" | "select" | "textarea";

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseQuestion {
  id?: string;
  label: string;
  type: "text" | "textarea" | "select" | "number";
  required?: boolean;
  description?: string;
  placeholder?: string;
}

export interface TextQuestion extends BaseQuestion {
  type: "text";
  minLength?: number;
  maxLength?: number;
}

export interface NumberQuestion extends BaseQuestion {
  type: "number";
  min?: number;
  max?: number;
}

export interface SelectQuestion extends BaseQuestion {
  type: "select";
  options: SelectOption[];
}

export interface TextareaQuestion extends BaseQuestion {
  type: "textarea";
  rows?: number;
}

export type Question =
  | TextQuestion
  | NumberQuestion
  | SelectQuestion
  | TextareaQuestion;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
