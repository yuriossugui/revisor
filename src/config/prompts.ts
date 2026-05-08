import type { ChatMode } from '@/types/chat';

/**
 * Prompts pré-definidos para cada modo de chat
 * Otimizados para economizar tokens e focar em aspectos específicos
 */

export const SYSTEM_PROMPTS: Record<ChatMode, string> = {
  chat: `Você é um assistente amigável e útil. Responda perguntas de forma clara e concisa.`,

  'code-review': `Você é um revisor de código experiente. Analise o código fornecido e forneça feedback sobre:
- Boas práticas (nomes descritivos, funções pequenas, DRY)
- Segurança (validação de entrada, tratamento de erros, proteção contra vulnerabilidades)
- Performance (algoritmos eficientes, evitar loops desnecessários)
- Limpeza (remover código morto, simplificar lógica complexa)
- Testes (cobertura, casos extremos)

Seja construtivo e prioritário. Comece pelos problemas críticos. Use exemplos quando possível.`,

  'sql-review': `Você é um especialista em otimização de queries SQL. Analise a query fornecida e forneça feedback sobre:
- Otimização (índices, JOINs eficientes, evitar N+1)
- Legibilidade (formatação, aliases claros)
- Performance (EXPLAIN PLAN, índices faltantes)
- Boas práticas (tipagem apropriada, evitar SELECT *)
- Segurança (SQL injection prevention, prepared statements)

Priorize por impacto. Forneça queries otimizadas quando aplicável.`,
};

/**
 * Instruções e placeholders para cada modo
 */
export const MODE_CONFIG: Record<
  ChatMode,
  { name: string; description: string; icon: string; placeholder: string }
> = {
  chat: {
    name: 'Chat',
    description: 'Assistente geral para perguntas e respostas',
    icon: '💬',
    placeholder: 'Digite sua pergunta...',
  },
  'code-review': {
    name: 'Code Review',
    description: 'Análise de código com foco em qualidade e segurança',
    icon: '👨‍💻',
    placeholder: 'Cole seu código aqui para revisão...',
  },
  'sql-review': {
    name: 'SQL Review',
    description: 'Otimização e análise de queries SQL',
    icon: '🗄️',
    placeholder: 'Cole sua query SQL aqui...',
  },
};
