export type QuestionType = 'text' | 'number' | 'select';

export interface SelectOption {
  label: string;
  value: string;
}

export interface BaseQuestion {
  id?: string;
  type: QuestionType;
  label: string;
  required?: boolean;
  defaultValue?: string | number;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
  minLength?: number;
  maxLength?: number;
}

export interface NumberQuestion extends BaseQuestion {
  type: 'number';
  min?: number;
  max?: number;
}

export interface SelectQuestion extends BaseQuestion {
  type: 'select';
  options: SelectOption[];
}

export type Question = TextQuestion | NumberQuestion | SelectQuestion;

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
