/**
 * Serviço de Chat com Groq API
 * Camada de negócio para envio de mensagens e processamento
 */

import type { ChatMode } from '@/types/chat';
import { getSystemPrompt } from './prompts';
import { groqClient } from './groq-client';
import type {
  GroqMessage,
  GroqChatCompletionResponse,
} from '@/types/groq';

export interface ChatRequest {
  userMessage: string;
  mode: ChatMode;
  conversationHistory: Array<{ role: string; content: string }>;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  response: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
  finishReason: string;
  timestamp: number;
}

/**
 * Envia uma mensagem para Groq e obtém resposta
 */
export const sendChatMessage = async (request: ChatRequest): Promise<ChatResponse> => {
  try {
    // Obtém o prompt do sistema para o modo
    const systemPrompt = getSystemPrompt(request.mode);

    // Constrói histórico de mensagens para Groq
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...request.conversationHistory.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user',
        content: request.userMessage,
      },
    ];

    if (import.meta.env.VITE_DEBUG_MODE === 'true') {
      console.log('[Chat Service] Enviando para Groq:', {
        mode: request.mode,
        messagesCount: messages.length,
        systemPromptLength: systemPrompt.length,
      });
    }

    // Envia para Groq API
    const response: GroqChatCompletionResponse = await groqClient.chatCompletion({
      messages,
      temperature: request.temperature,
      max_completion_tokens: request.maxTokens,
    });

    // Extrai a resposta
    const choice = response.choices[0];
    if (!choice || !choice.message) {
      throw new Error('Resposta inválida da API Groq');
    }

    return {
      response: choice.message.content,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens,
      },
      model: response.model,
      finishReason: choice.finish_reason || 'stop',
      timestamp: response.created,
    };
  } catch (error) {
    console.error('[Chat Service] Erro ao enviar mensagem:', error);
    throw error;
  }
};

/**
 * Obtém lista de modelos disponíveis
 */
export const getAvailableModels = async () => {
  try {
    const response = await groqClient.listModels();
    return response.data.map((model) => ({
      id: model.id,
      name: model.id,
      contextWindow: model.context_window,
      ownedBy: model.owned_by,
      active: model.active,
    }));
  } catch (error) {
    console.error('[Chat Service] Erro ao listar modelos:', error);
    throw error;
  }
};

/**
 * Verifica se a API está disponível
 */
export const checkAPIHealth = async (): Promise<boolean> => {
  try {
    return await groqClient.healthCheck();
  } catch (error) {
    console.error('[Chat Service] Erro ao verificar saúde da API:', error);
    return false;
  }
};

/**
 * Formata uma mensagem para exibição
 */
export const formatMessage = (content: string): string => {
  return content.trim();
};

/**
 * Obtém modo de chat baseado em tipo
 */
export const getChatModeDescription = (mode: ChatMode): string => {
  const descriptions: Record<ChatMode, string> = {
    chat: 'Assistente geral',
    'code-review': 'Revisor de código',
    'sql-review': 'Especialista em SQL',
  };

  return descriptions[mode] || 'Modo desconhecido';
};
