/**
 * Exemplos de uso da integração Groq API
 * 
 * Para testar manualmente:
 * 1. Abra o console do navegador (F12)
 * 2. Copie e cole os exemplos abaixo
 * 3. Execute no console
 */

// =====================================================
// EXEMPLO 1: Verificar Status da API
// =====================================================

import { checkAPIHealth } from '@/lib/chat-service';

// Verificar se Groq está disponível
const testHealth = async () => {
  console.log('Verificando saúde da API Groq...');
  const healthy = await checkAPIHealth();
  console.log('Status:', healthy ? '✅ Online' : '❌ Offline');
};

// testHealth();

// =====================================================
// EXEMPLO 2: Enviar Mensagem Simples (Chat)
// =====================================================

import { sendChatMessage } from '@/lib/chat-service';

const testSimpleChat = async () => {
  try {
    const response = await sendChatMessage({
      userMessage: 'Qual é a capital da França?',
      mode: 'chat',
      conversationHistory: [],
    });

    console.log('Resposta:', response.response);
    console.log('Tokens usados:', response.usage.totalTokens);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// testSimpleChat();

// =====================================================
// EXEMPLO 3: Code Review
// =====================================================

const testCodeReview = async () => {
  const code = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

const result = fibonacci(10);
console.log(result);
  `;

  try {
    const response = await sendChatMessage({
      userMessage: `Revise este código:\n${code}`,
      mode: 'code-review',
      conversationHistory: [],
      temperature: 0.5,
      maxTokens: 1024,
    });

    console.log('Review:', response.response);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// testCodeReview();

// =====================================================
// EXEMPLO 4: SQL Review
// =====================================================

const testSQLReview = async () => {
  const sql = `
SELECT u.id, u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id
ORDER BY order_count DESC
  `;

  try {
    const response = await sendChatMessage({
      userMessage: `Otimize esta query SQL:\n${sql}`,
      mode: 'sql-review',
      conversationHistory: [],
    });

    console.log('SQL Otimizado:', response.response);
  } catch (error) {
    console.error('Erro:', error);
  }
};

// testSQLReview();

// =====================================================
// EXEMPLO 5: Conversa com Histórico
// =====================================================

const testConversation = async () => {
  const history: Array<{ role: string; content: string }> = [];

  // Primeira mensagem
  let response = await sendChatMessage({
    userMessage: 'Qual é o Python?',
    mode: 'chat',
    conversationHistory: history,
  });

  console.log('Assistente:', response.response);
  history.push({ role: 'user', content: 'Qual é o Python?' });
  history.push({ role: 'assistant', content: response.response });

  // Segunda mensagem (com contexto)
  response = await sendChatMessage({
    userMessage: 'Como começar a programar em Python?',
    mode: 'chat',
    conversationHistory: history,
  });

  console.log('Assistente:', response.response);
};

// testConversation();

// =====================================================
// EXEMPLO 6: Listar Modelos Disponíveis
// =====================================================

import { getAvailableModels } from '@/lib/chat-service';

const testListModels = async () => {
  try {
    const models = await getAvailableModels();
    console.log('Modelos disponíveis:');
    models.forEach((model) => {
      console.log(`- ${model.id} (contexto: ${model.contextWindow})`);
    });
  } catch (error) {
    console.error('Erro:', error);
  }
};

// testListModels();

// =====================================================
// EXEMPLO 7: Diferentes Temperaturas
// =====================================================

const testTemperatures = async () => {
  const prompt = 'Crie um slogan criativo para uma empresa de tecnologia';

  console.log('Testando diferentes temperaturas...');

  // Temperatura baixa (determinístico)
  const cold = await sendChatMessage({
    userMessage: prompt,
    mode: 'chat',
    conversationHistory: [],
    temperature: 0.2,
  });
  console.log('Temp 0.2 (determinístico):', cold.response);

  // Temperatura média (balanceado)
  const warm = await sendChatMessage({
    userMessage: prompt,
    mode: 'chat',
    conversationHistory: [],
    temperature: 0.7,
  });
  console.log('Temp 0.7 (balanceado):', warm.response);

  // Temperatura alta (criativo)
  const hot = await sendChatMessage({
    userMessage: prompt,
    mode: 'chat',
    conversationHistory: [],
    temperature: 1.5,
  });
  console.log('Temp 1.5 (criativo):', hot.response);
};

// testTemperatures();

// =====================================================
// EXEMPLO 8: Tratamento de Erros
// =====================================================

const testErrorHandling = async () => {
  try {
    // Requisição com API key inválida (vai falhar)
    const response = await sendChatMessage({
      userMessage: 'Teste',
      mode: 'chat',
      conversationHistory: [],
    });
    console.log('Sucesso:', response);
  } catch (error: any) {
    console.error('Tipo de erro:', error.type);
    console.error('Mensagem:', error.message);
    console.error('Status:', error.statusCode);
  }
};

// testErrorHandling();

// =====================================================
// EXEMPLO 9: Medir Performance
// =====================================================

const testPerformance = async () => {
  const iterations = 3;
  const times: number[] = [];

  for (let i = 0; i < iterations; i++) {
    const start = performance.now();

    await sendChatMessage({
      userMessage: 'Diga "OK" em uma palavra',
      mode: 'chat',
      conversationHistory: [],
      maxTokens: 10,
    });

    const end = performance.now();
    times.push(end - start);
  }

  console.log('Tempos de resposta (ms):', times);
  console.log('Média:', times.reduce((a, b) => a + b) / times.length);
  console.log('Min:', Math.min(...times));
  console.log('Max:', Math.max(...times));
};

// testPerformance();

// =====================================================
// EXEMPLO 10: Teste Completo (Suite)
// =====================================================

const runAllTests = async () => {
  console.log('===== SUITE DE TESTES GROQ API =====\n');

  try {
    console.log('1️⃣ Health Check');
    const healthy = await checkAPIHealth();
    console.log(`Status: ${healthy ? '✅' : '❌'}\n`);

    if (!healthy) {
      console.error('API não está disponível. Abortando testes.');
      return;
    }

    console.log('2️⃣ Chat Simples');
    const chat = await sendChatMessage({
      userMessage: 'Olá',
      mode: 'chat',
      conversationHistory: [],
    });
    console.log(`Resposta: ${chat.response.substring(0, 50)}...\n`);

    console.log('3️⃣ Code Review');
    const review = await sendChatMessage({
      userMessage: 'function add(a, b) { return a + b; }',
      mode: 'code-review',
      conversationHistory: [],
    });
    console.log(`Review: ${review.response.substring(0, 50)}...\n`);

    console.log('4️⃣ Listar Modelos');
    const models = await getAvailableModels();
    console.log(`Total de modelos: ${models.length}\n`);

    console.log('✅ Todos os testes passaram!\n');
  } catch (error) {
    console.error('❌ Erro durante testes:', error);
  }
};

// Descomentar para executar todos os testes
// runAllTests();

export {
  testHealth,
  testSimpleChat,
  testCodeReview,
  testSQLReview,
  testConversation,
  testListModels,
  testTemperatures,
  testErrorHandling,
  testPerformance,
  runAllTests,
};
