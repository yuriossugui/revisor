import { Button } from '@/components/ui/button';
import { useChatContext } from '@/context/ChatContext';

/**
 * Componente de Demo
 * Demonstra como usar a aplicação
 */
export const ChatDemo = () => {
  const { createConversation } = useChatContext();

  return (
    <div className="hidden">
      <h2>Chat Interface Demo</h2>
      <p>A aplicação está pronta para uso!</p>
      
      <div className="flex gap-2">
        <button onClick={() => createConversation('chat')}>
          Nova Chat
        </button>
        <button onClick={() => createConversation('code-review')}>
          Code Review
        </button>
        <button onClick={() => createConversation('sql-review')}>
          SQL Review
        </button>
      </div>
    </div>
  );
};

export default ChatDemo;
