/**
 * Tipos para integração com Groq API
 * Baseado em: https://console.groq.com/docs/api-reference
 */

export interface GroqMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GroqChatCompletionRequest {
  model: string;
  messages: GroqMessage[];
  temperature?: number;
  max_completion_tokens?: number;
  top_p?: number;
  stop?: string | string[];
  stream?: boolean;
}

export interface GroqChatChoice {
  index: number;
  message: GroqMessage;
  finish_reason: 'stop' | 'length' | 'tool_calls' | null;
}

export interface GroqUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  queue_time?: number;
  prompt_time?: number;
  completion_time?: number;
  total_time?: number;
}

export interface GroqChatCompletionResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: string;
  choices: GroqChatChoice[];
  usage: GroqUsage;
  system_fingerprint?: string;
  x_groq?: {
    id: string;
  };
}

export interface GroqModel {
  id: string;
  object: 'model';
  created: number;
  owned_by: string;
  active: boolean;
  context_window: number;
  public_apps?: null;
  max_completion_tokens?: number;
}

export interface GroqModelsListResponse {
  object: 'list';
  data: GroqModel[];
}

export interface GroqErrorResponse {
  error: {
    message: string;
    type: string;
    param?: string;
    code?: string;
  };
}

export interface StreamEvent {
  type: 'start' | 'chunk' | 'end' | 'error';
  data?: string;
  error?: string;
}
