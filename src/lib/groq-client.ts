/**
 * Cliente HTTP para Groq API
 * Configurado com autenticação, tratamento de erros e logging
 */

import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { config, validateConfig } from '@/config/env';
import type {
  GroqChatCompletionResponse,
  GroqModelsListResponse,
  GroqErrorResponse,
} from '@/types/groq';

export class GroqAPIError extends Error {
  statusCode: number | null;
  type: string;
  originalError?: unknown;

  constructor(
    statusCode: number | null,
    type: string,
    message: string,
    originalError?: unknown
  ) {
    super(message);
    this.name = 'GroqAPIError';
    this.statusCode = statusCode;
    this.type = type;
    this.originalError = originalError;
  }
}

export class GroqClient {
  private client: AxiosInstance;
  private debug: boolean;

  constructor() {
    // Validar configuração
    const validation = validateConfig();
    if (!validation.valid) {
      console.error('Erros de configuração:', validation.errors);
      throw new Error(
        `Configuração inválida: ${validation.errors.join(', ')}`
      );
    }

    this.debug = config.debug;

    // Criar instância do axios
    this.client = axios.create({
      baseURL: config.groq.baseUrl,
      timeout: config.chat.timeout,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.groq.apiKey}`,
      },
    });

    // Interceptor para logging de requisições
    this.client.interceptors.request.use(
      (requestConfig) => {
        if (this.debug) {
          console.log('[Groq API] Requisição:', {
            method: requestConfig.method?.toUpperCase(),
            url: requestConfig.url,
            timeout: requestConfig.timeout,
          });
        }
        return requestConfig;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para logging de respostas
    this.client.interceptors.response.use(
      (response) => {
        if (this.debug) {
          console.log('[Groq API] Resposta:', {
            status: response.status,
            url: response.config.url,
            tokens: response.data.usage,
          });
        }
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Envia uma requisição de chat completion para Groq
   */
  async chatCompletion(payload: {
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>;
    model?: string;
    temperature?: number;
    max_completion_tokens?: number;
    top_p?: number;
    stop?: string | string[];
  }): Promise<GroqChatCompletionResponse> {
    try {
      const response = await this.client.post<GroqChatCompletionResponse>(
        '/chat/completions',
        {
          model: payload.model || config.groq.model,
          messages: payload.messages,
          temperature: payload.temperature ?? config.chat.temperature,
          max_completion_tokens:
            payload.max_completion_tokens || config.chat.maxTokens,
          top_p: payload.top_p ?? 1,
          ...(payload.stop && { stop: payload.stop }),
        }
      );

      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Lista todos os modelos disponíveis
   */
  async listModels(): Promise<GroqModelsListResponse> {
    try {
      const response = await this.client.get<GroqModelsListResponse>('/models');
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Recupera informações de um modelo específico
   */
  async getModel(modelId: string): Promise<{
    id: string;
    object: string;
    created: number;
    owned_by: string;
    active: boolean;
    context_window: number;
    max_completion_tokens?: number;
  }> {
    try {
      const response = await this.client.get(`/models/${modelId}`);
      return response.data;
    } catch (error) {
      throw this.transformError(error);
    }
  }

  /**
   * Trata erros da API
   */
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      const data = axiosError.response?.data as GroqErrorResponse | undefined;

      if (this.debug) {
        console.error('[Groq API] Erro:', {
          status,
          message: data?.error?.message || axiosError.message,
          type: data?.error?.type,
          code: data?.error?.code,
        });
      }

      // Log detalhado por tipo de erro
      if (status === 401 || status === 403) {
        console.error(
          'Erro de autenticação. Verifique sua VITE_GROQ_API_KEY'
        );
      } else if (status === 429) {
        console.error(
          'Rate limit atingido. Aguarde antes de fazer mais requisições.'
        );
      } else if (status === 500 || status === 503) {
        console.error('Serviço da Groq indisponível no momento.');
      } else if (axiosError.code === 'ECONNABORTED') {
        console.error('Timeout na requisição para Groq API.');
      }
    } else {
      console.error('[Groq API] Erro desconhecido:', error);
    }
  }

  /**
   * Transforma erros do axios em GroqAPIError
   */
  private transformError(error: unknown): GroqAPIError {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<GroqErrorResponse>;
      const status = axiosError.response?.status ?? null;
      const errorData = axiosError.response?.data?.error;

      let message = axiosError.message;
      let type = 'unknown_error';

      if (status === 401 || status === 403) {
        type = 'authentication_error';
        message = 'Falha na autenticação com Groq API. Verifique sua API key.';
      } else if (status === 429) {
        type = 'rate_limit_error';
        message = 'Rate limit atingido. Tente novamente em alguns minutos.';
      } else if (status === 400) {
        type = 'validation_error';
        message = errorData?.message || 'Requisição inválida';
      } else if (status === 500 || status === 503) {
        type = 'service_error';
        message = 'Serviço Groq temporariamente indisponível';
      } else if (axiosError.code === 'ECONNABORTED') {
        type = 'timeout_error';
        message = 'Timeout na requisição (limite: ' + config.chat.timeout + 'ms)';
      }

      return new GroqAPIError(status, type, message, axiosError);
    }

    return new GroqAPIError(
      null,
      'unknown_error',
      'Erro desconhecido ao comunicar com Groq API',
      error
    );
  }

  /**
   * Verifica se o serviço está disponível
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.listModels();
      return true;
    } catch {
      return false;
    }
  }
}

// Instância singleton
export const groqClient = new GroqClient();
