/**
 * Configuração de variáveis de ambiente
 * 
 * Variáveis prefixadas com VITE_ são expostas ao cliente durante build
 * Lê do arquivo .env na raiz do projeto
 * 
 * Obtenha sua API Key: https://console.groq.com/keys
 */

export const config = {
  // Configurações da API Groq
  groq: {
    /** API Key do Groq (obrigatório) */
    apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
    
    /** URL base da API Groq */
    baseUrl: import.meta.env.VITE_GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
    
    /** Modelo padrão a utilizar */
    model: import.meta.env.VITE_GROQ_MODEL || 'llama-3.1-8b-instant',
  },

  // Configurações do Chat
  chat: {
    /** Timeout das requisições em ms */
    timeout: parseInt(import.meta.env.VITE_CHAT_TIMEOUT || '30000', 10),
    
    /** Máximo de tokens na resposta */
    maxTokens: parseInt(import.meta.env.VITE_CHAT_MAX_TOKENS || '2048', 10),
    
    /** Temperatura da resposta (0-2, onde 0=determinístico, 2=criativo) */
    temperature: parseFloat(import.meta.env.VITE_CHAT_TEMPERATURE || '0.7'),
  },

  /** Modo debug com logs detalhados */
  debug: import.meta.env.VITE_DEBUG_MODE === 'true',
};

export const validateConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validar API Key
  if (!config.groq.apiKey) {
    errors.push('❌ VITE_GROQ_API_KEY não está configurada (obrigatório)');
  } else if (config.groq.apiKey.startsWith('your_') || config.groq.apiKey === 'your_groq_api_key_here') {
    errors.push('❌ VITE_GROQ_API_KEY ainda tem o valor padrão. Obtenha uma chave em https://console.groq.com/keys');
  }

  // Validar Base URL
  if (!config.groq.baseUrl) {
    errors.push('❌ VITE_GROQ_BASE_URL não está configurada');
  }

  // Validar Modelo
  if (!config.groq.model) {
    errors.push('❌ VITE_GROQ_MODEL não está configurada');
  }

  // Validar Temperature
  if (config.chat.temperature < 0 || config.chat.temperature > 2) {
    errors.push(`❌ VITE_CHAT_TEMPERATURE deve estar entre 0 e 2 (atual: ${config.chat.temperature})`);
  }

  // Validar Max Tokens
  if (config.chat.maxTokens < 1 || config.chat.maxTokens > 4096) {
    errors.push(`❌ VITE_CHAT_MAX_TOKENS deve estar entre 1 e 4096 (atual: ${config.chat.maxTokens})`);
  }

  // Validar Timeout
  if (config.chat.timeout < 1000 || config.chat.timeout > 120000) {
    errors.push(`❌ VITE_CHAT_TIMEOUT deve estar entre 1000ms e 120000ms (atual: ${config.chat.timeout}ms)`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Log de validação da configuração
 * Chamado na inicialização da aplicação
 */
export const logConfigStatus = (): void => {
  if (config.debug) {
    console.log('🔧 Configuração da Aplicação:', {
      groq: {
        apiKey: `${config.groq.apiKey.substring(0, 10)}...${config.groq.apiKey.substring(config.groq.apiKey.length - 4)}`,
        baseUrl: config.groq.baseUrl,
        model: config.groq.model,
      },
      chat: {
        timeout: `${config.chat.timeout}ms`,
        maxTokens: config.chat.maxTokens,
        temperature: config.chat.temperature,
      },
      debug: config.debug,
    });
  }
};
