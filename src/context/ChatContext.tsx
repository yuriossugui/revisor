import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Conversation, Message, ChatContextType, ChatMode } from '@/types/chat';
import { simulateAIResponse } from '@/lib/api';

const uuidv4 = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [currentMode, setCurrentMode] = useState<ChatMode>('chat');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true;
  });

  const createConversation = useCallback((mode: ChatMode) => {
    const id = uuidv4();
    const conversation: Conversation = {
      id,
      title: `Nova conversa - ${new Date().toLocaleString('pt-BR')}`,
      messages: [],
      mode,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setConversations(prev => [conversation, ...prev]);
    setCurrentConversationId(id);
    setCurrentMode(mode);
  }, []);

  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      setCurrentMode(conversation.mode);
    }
  }, [conversations]);

  const deleteConversation = useCallback((id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(conversations.length > 1 ? conversations[0].id : null);
    }
  }, [conversations, currentConversationId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentConversationId) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setConversations(prev =>
      prev.map(c =>
        c.id === currentConversationId
          ? {
              ...c,
              messages: [...c.messages, userMessage],
              updatedAt: new Date(),
              title: c.messages.length === 0 ? content.substring(0, 50) : c.title,
            }
          : c
      )
    );

    setIsLoading(true);

    try {
      const aiResponse = await simulateAIResponse(content, currentMode);
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setConversations(prev =>
        prev.map(c =>
          c.id === currentConversationId
            ? {
                ...c,
                messages: [...c.messages, assistantMessage],
                updatedAt: new Date(),
              }
            : c
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId]);

  const setMode = useCallback((mode: ChatMode) => {
    setCurrentMode(mode);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('darkMode', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

  const value: ChatContextType = {
    conversations,
    currentConversationId,
    currentMode,
    isLoading,
    isDarkMode,
    createConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    setMode,
    toggleDarkMode,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
};
