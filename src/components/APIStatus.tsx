import { useEffect, useState } from 'react';
import { checkAPIHealth } from '@/lib/chat-service';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface APIStatusProps {
  isDarkMode: boolean;
}

export const APIStatus = ({ isDarkMode }: APIStatusProps) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await checkAPIHealth();
        setIsHealthy(healthy);
      } catch (error) {
        setIsHealthy(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    // Verifica a cada 30 segundos
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return null;
  }

  if (isHealthy === null || isHealthy) {
    return null; // Não mostra quando tudo está ok
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isDarkMode
          ? 'bg-red-900 bg-opacity-30 border border-red-700'
          : 'bg-red-100 border border-red-300'
      }`}
    >
      <AlertCircle
        size={16}
        className={isDarkMode ? 'text-red-500' : 'text-red-600'}
      />
      <span
        className={`text-sm ${
          isDarkMode ? 'text-red-300' : 'text-red-700'
        }`}
      >
        Groq API indisponível
      </span>
    </div>
  );
};

export const HealthIndicator = ({ isDarkMode }: APIStatusProps) => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const healthy = await checkAPIHealth();
        setIsHealthy(healthy);
      } catch (error) {
        setIsHealthy(false);
      }
    };

    checkHealth();
  }, []);

  if (isHealthy === null) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {isHealthy ? (
        <>
          <CheckCircle
            size={12}
            className={isDarkMode ? 'text-green-500' : 'text-green-600'}
          />
          <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
            Conectado
          </span>
        </>
      ) : (
        <>
          <AlertCircle
            size={12}
            className={isDarkMode ? 'text-red-500' : 'text-red-600'}
          />
          <span className={isDarkMode ? 'text-red-400' : 'text-red-600'}>
            Desconectado
          </span>
        </>
      )}
    </div>
  );
};
