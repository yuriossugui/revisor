import type { ChatMode } from '@/types/chat';
import { SYSTEM_PROMPTS, MODE_CONFIG } from '@/config/prompts';

/**
 * Obtém o prompt do sistema para um modo específico
 */
export const getSystemPrompt = (mode: ChatMode): string => {
  return SYSTEM_PROMPTS[mode];
};

/**
 * Estrutura completa do prompt a ser enviado para a API
 * Combina o prompt do sistema com a mensagem do usuário
 */
export const buildCompletePrompt = (userMessage: string, mode: ChatMode): string => {
  const systemPrompt = getSystemPrompt(mode);
  return `${systemPrompt}\n\n---\n\n${userMessage}`;
};

/**
 * Obtém instruções adicionais para cada modo (footer/resumo)
 * Útil para dicas ao usuário sobre o que enviar
 */
export const getModeInstructions = (mode: ChatMode): string => {
  return MODE_CONFIG[mode].placeholder;
};

/**
 * Configuração detalhada de cada modo com metadados
 */
export const modeConfig = {
  chat: {
    name: 'Chat',
    label: 'Chat',
    description: 'Assistente geral para perguntas e respostas',
    icon: '💬',
    color: 'blue',
    placeholder: 'Digite sua pergunta...',
  },
  'code-review': {
    name: 'Code Review',
    label: 'Code Review',
    description: 'Análise de código com foco em qualidade e segurança',
    icon: '📝',
    color: 'amber',
    placeholder: 'Cole seu código aqui...',
  },
  'sql-review': {
    name: 'SQL Review',
    label: 'SQL Review',
    description: 'Otimização e análise de queries SQL',
    icon: '🗄️',
    color: 'purple',
    placeholder: 'Cole sua query SQL...',
  },
} as const;
