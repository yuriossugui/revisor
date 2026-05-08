import { useCallback } from 'react';
import { useChatContext } from '@/context/ChatContext';

/**
 * Hook customizado para operações de chat
 * Fornece métodos facilitados para gerenciamento de conversas
 */
export const useChat = () => {
  const context = useChatContext();

  const startNewChat = useCallback((mode: 'chat' | 'code-review' | 'sql-review' = 'chat') => {
    context.createConversation(mode);
  }, [context]);

  const getCurrentConversation = useCallback(() => {
    return context.conversations.find(c => c.id === context.currentConversationId);
  }, [context.conversations, context.currentConversationId]);

  const getConversationMessageCount = useCallback((conversationId?: string) => {
    const id = conversationId || context.currentConversationId;
    if (!id) return 0;
    const conv = context.conversations.find(c => c.id === id);
    return conv?.messages.length ?? 0;
  }, [context.conversations, context.currentConversationId]);

  return {
    ...context,
    startNewChat,
    getCurrentConversation,
    getConversationMessageCount,
  };
};

export default useChat;
