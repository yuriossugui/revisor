import type { ChatMode } from '@/types/chat';
import { sendChatMessage, checkAPIHealth } from './chat-service';

/**
 * Simula resposta de IA com integração real da Groq API
 * Transitório: será substituído por sendChatMessage quando integração estiver completa
 */
export const simulateAIResponse = async (
  userMessage: string,
  mode: ChatMode
): Promise<string> => {
  try {
    // Verifica se a API está disponível
    const isHealthy = await checkAPIHealth();
    if (!isHealthy) {
      console.warn('API Groq não está disponível. Verifique sua configuração.');
      throw new Error(
        'Serviço Groq indisponível. Verifique sua VITE_GROQ_API_KEY.'
      );
    }

    // Envia para Groq
    const response = await sendChatMessage({
      userMessage,
      mode,
      conversationHistory: [],
      temperature: 0.7,
      maxTokens: 2048,
    });

    return response.response;
  } catch (error) {
    console.error('Erro ao obter resposta da API:', error);
    throw error;
  }
};

/**
 * Envia mensagem real para API
 * Versão atualizada para usar Groq
 */
export const sendMessageToAPI = async (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  return sendChatMessage({
    userMessage,
    mode,
    conversationHistory,
  });
};

// Re-export para compatibilidade
export { sendChatMessage, checkAPIHealth, getAvailableModels } from './chat-service';
