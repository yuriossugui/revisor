export type MessageRole = 'user' | 'assistant';
export type ChatMode = 'chat' | 'code-review' | 'sql-review';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  mode: ChatMode;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentMode: ChatMode;
  isLoading: boolean;
  isDarkMode: boolean;
  
  createConversation: (mode: ChatMode) => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  sendMessage: (content: string) => Promise<void>;
  setMode: (mode: ChatMode) => void;
  toggleDarkMode: () => void;
}

/**
 * Interface para a estrutura de requisição enviada à API
 * Inclui o sistema prompt específico do modo
 */
export interface APIRequest {
  systemPrompt: string;
  userMessage: string;
  mode: ChatMode;
  conversationHistory: Array<{ role: string; content: string }>;
}

