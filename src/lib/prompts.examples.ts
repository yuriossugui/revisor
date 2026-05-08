import { getSystemPrompt, buildCompletePrompt, getModeInstructions, modeConfig } from './prompts';
import type { ChatMode } from '@/types/chat';

/**
 * Exemplos de uso dos prompts
 * Este arquivo demonstra como os prompts são estruturados e usados
 */

// Exemplo 1: Obter prompt do sistema para um modo
export const exampleGetSystemPrompt = () => {
  const codeReviewPrompt = getSystemPrompt('code-review');
  console.log('Code Review System Prompt:');
  console.log(codeReviewPrompt);
  console.log('---');
};

// Exemplo 2: Construir prompt completo
export const exampleBuildCompletePrompt = () => {
  const userCode = `
function calculate(a, b) {
  let result = 0;
  for (let i = 0; i < a; i++) {
    result += b;
  }
  return result;
}
  `;

  const fullPrompt = buildCompletePrompt(userCode, 'code-review');
  console.log('Complete Prompt for Code Review:');
  console.log(fullPrompt);
  console.log('---');
};

// Exemplo 3: Obter instruções de modo
export const exampleGetModeInstructions = () => {
  const modes: ChatMode[] = ['chat', 'code-review', 'sql-review'];
  modes.forEach(mode => {
    console.log(`${mode}: ${getModeInstructions(mode)}`);
  });
  console.log('---');
};

// Exemplo 4: Acessar configuração de modo
export const exampleModeConfig = () => {
  const codeReviewConfig = modeConfig['code-review'];
  console.log('Code Review Config:');
  console.log(JSON.stringify(codeReviewConfig, null, 2));
  console.log('---');
};

// Exemplo 5: Simular requisição à API com prompt
export const exampleAPIPayload = () => {
  const userMessage = `
SELECT * FROM users WHERE age > 18;
  `;

  const systemPrompt = getSystemPrompt('sql-review');

  const payload = {
    systemPrompt,
    userMessage,
    mode: 'sql-review' as const,
    conversationHistory: [],
  };

  console.log('API Payload for SQL Review:');
  console.log(JSON.stringify(payload, null, 2));
  console.log('---');
};

// Executar todos os exemplos
export const runAllExamples = () => {
  console.log('=== EXEMPLOS DE USO DOS PROMPTS ===\n');
  exampleGetSystemPrompt();
  exampleBuildCompletePrompt();
  exampleGetModeInstructions();
  exampleModeConfig();
  exampleAPIPayload();
  console.log('=== FIM DOS EXEMPLOS ===');
};
