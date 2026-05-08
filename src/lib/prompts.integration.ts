/**
 * Guia de Integração dos Prompts com API
 * 
 * Este arquivo documenta como integrar os prompts específicos de cada modo
 * quando implementar a chamada real para a API.
 */

import type { ChatMode } from '@/types/chat';
import { getSystemPrompt } from './prompts';

/**
 * Estrutura de exemplo para integração com diferentes APIs LLM
 */

// ==========================================
// 1. INTEGRAÇÃO COM OPENAI API
// ==========================================
export const buildOpenAIPayload = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = getSystemPrompt(mode);

  return {
    model: 'gpt-4', // ou gpt-3.5-turbo para economia de tokens
    temperature: 0.3, // Mais baixo para respostas consistentes (especialmente Code Review)
    top_p: 0.9,
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
    max_tokens: 2000, // Ajuste conforme necessário
  };
};

// ==========================================
// 2. INTEGRAÇÃO COM CLAUDE (ANTHROPIC)
// ==========================================
export const buildClaudePayload = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = getSystemPrompt(mode);

  return {
    model: 'claude-3-sonnet-20240229', // ou outro modelo disponível
    max_tokens: 2000,
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  };
};

// ==========================================
// 3. INTEGRAÇÃO COM COHERE
// ==========================================
export const buildCoherePayload = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = getSystemPrompt(mode);

  // Cohere não tem separação explícita de system prompt,
  // então incluimos no início do histórico
  const messages = [
    { role: 'system' as const, content: systemPrompt },
    ...conversationHistory,
    { role: 'user' as const, content: userMessage },
  ];

  return {
    model: 'command-r-plus',
    messages: messages.map(msg => ({
      role: msg.role,
      message: msg.content,
    })),
    temperature: 0.3,
    max_tokens: 2000,
  };
};

// ==========================================
// 4. INTEGRAÇÃO COM GOOGLE GEMINI
// ==========================================
export const buildGeminiPayload = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = getSystemPrompt(mode);

  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      ...conversationHistory.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 2000,
    },
  };
};

// ==========================================
// 5. INTEGRAÇÃO COM OLLAMA (LOCAL)
// ==========================================
export const buildOllamaPayload = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>
) => {
  const systemPrompt = getSystemPrompt(mode);

  return {
    model: 'mistral', // ou outro modelo disponível localmente
    messages: [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    stream: false, // Mude para true se quiser streaming
  };
};

// ==========================================
// DICAS DE ECONOMIA DE TOKENS
// ==========================================

/**
 * Recomendações para economizar tokens:
 * 
 * 1. TRUNCAR HISTÓRICO
 *    - Manter apenas as últimas 10-15 mensagens
 *    - Usar summarização para histórico antigo
 * 
 * 2. RESUMIR MENSAGENS LONGAS
 *    - Se mensagem do usuário > 1000 chars, considerar resumo
 *    - Manter apenas o essencial para Code Review / SQL Review
 * 
 * 3. USAR TEMPERATURE BAIXA
 *    - Code Review: 0.2-0.3 (mais consistente)
 *    - SQL Review: 0.2-0.3 (mais consistente)
 *    - Chat: 0.7-0.9 (mais criativo)
 * 
 * 4. LIMITAR MAX_TOKENS
 *    - Chat: 1000-1500
 *    - Code Review: 1500-2000
 *    - SQL Review: 1500-2000
 * 
 * 5. CACHE DE PROMPTS
 *    - Os system prompts são fixos por modo
 *    - Considerar usar prompt caching se disponível
 */

// ==========================================
// IMPLEMENTAÇÃO RECOMENDADA
// ==========================================

/**
 * Função genérica pronta para integração real
 * 
 * Uso:
 * const payload = buildPayloadForAPI(
 *   'Analise este código',
 *   'code-review',
 *   [],
 *   'openai'
 * );
 * 
 * const response = await fetch(
 *   'https://api.openai.com/v1/chat/completions',
 *   {
 *     method: 'POST',
 *     headers: {
 *       'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify(payload),
 *   }
 * );
 */
export const buildPayloadForAPI = (
  userMessage: string,
  mode: ChatMode,
  conversationHistory: Array<{ role: string; content: string }>,
  provider: 'openai' | 'claude' | 'cohere' | 'gemini' | 'ollama' = 'openai'
) => {
  const builders = {
    openai: buildOpenAIPayload,
    claude: buildClaudePayload,
    cohere: buildCoherePayload,
    gemini: buildGeminiPayload,
    ollama: buildOllamaPayload,
  };

  const builder = builders[provider];
  return builder(userMessage, mode, conversationHistory);
};
