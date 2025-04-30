import { useState, useEffect, useCallback, useRef } from 'react';
import { Message } from '@/lib/types';

const RECONNECT_DELAY = 100;
const MAX_RECONNECT_ATTEMPTS = 3;
const CONTEXT_ERROR = 'Extension context invalidated';

interface ChromeRuntimeError {
  message: string;
}

function isRuntimeError(error: unknown): error is ChromeRuntimeError {
  return error instanceof Error || (typeof error === 'object' && error !== null && 'message' in error);
}

export default function useMessage() {
  const [messageData, setMessageData] = useState<Message | null>(null);
  const [port, setPort] = useState<chrome.runtime.Port | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const mountedRef = useRef(true);
  const portRef = useRef<chrome.runtime.Port | null>(null);

  // Cleanup function to properly remove message listeners
  const cleanupMessageListeners = useCallback((messageListener?: (message: Message) => void) => {
    if (messageListener) {
      try {
        chrome.runtime.onMessage.removeListener(messageListener);
      } catch (error: unknown) {
        // Ignore cleanup errors during context invalidation
        if (isRuntimeError(error) && !error.message.includes(CONTEXT_ERROR)) {
          console.warn('Error removing message listener:', error);
        }
      }
    }
  }, []);

  const disconnectPort = useCallback(() => {
    if (portRef.current) {
      try {
        portRef.current.disconnect();
      } catch (error: unknown) {
        // Ignore disconnect errors during context invalidation
        if (isRuntimeError(error) && !error.message.includes(CONTEXT_ERROR)) {
          console.warn('Error disconnecting port:', error);
        }
      }
      portRef.current = null;
      setPort(null);
    }
  }, []);

  const connectPort = useCallback(() => {
    if (!chrome?.runtime?.id || !mountedRef.current) return null;

    try {
      // Disconnect existing port if any
      disconnectPort();

      const newPort = chrome.runtime.connect({ name: 'content-script' });
      portRef.current = newPort;
      
      const messageHandler = (message: Message) => {
        if (mountedRef.current) {
          setMessageData(message);
        }
      };

      const disconnectHandler = () => {
        const error = chrome.runtime.lastError;
        if (error && typeof error === 'object' && 'message' in error && error.message?.includes(CONTEXT_ERROR)) {
          // Handle context invalidation by attempting reconnection
          disconnectPort();
          if (mountedRef.current && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setTimeout(() => {
              if (mountedRef.current) {
                setReconnectAttempts(prev => prev + 1);
                connectPort();
              }
            }, RECONNECT_DELAY);
          }
        } else if (mountedRef.current) {
          setPort(null);
          portRef.current = null;
        }
      };

      newPort.onMessage.addListener(messageHandler);
      newPort.onDisconnect.addListener(disconnectHandler);

      setPort(newPort);
      setReconnectAttempts(0);
      return newPort;
    } catch (error: unknown) {
      if (isRuntimeError(error) && !error.message.includes(CONTEXT_ERROR)) {
        console.error('Error connecting port:', error);
      }
      return null;
    }
  }, [disconnectPort, reconnectAttempts]);

  useEffect(() => {
    let reconnectTimer: number | null = null;
    let messageListener: ((message: Message) => void) | undefined;

    const handleVisibilityChange = () => {
      if (!mountedRef.current) return;
      
      if (document.visibilityState === 'visible' && !port && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        if (reconnectTimer) window.clearTimeout(reconnectTimer);
        reconnectTimer = window.setTimeout(() => {
          if (mountedRef.current && chrome?.runtime?.id) {
            connectPort();
            setReconnectAttempts(prev => prev + 1);
          }
        }, RECONNECT_DELAY);
      }
    };

    const handleExtensionMessage = (message: any) => {
      if (message === 'extension-reload' || message.type === 'extension-reload') {
        disconnectPort();
        if (mountedRef.current) {
          connectPort();
        }
      }
    };
    
    try {
      chrome.runtime.onMessage.addListener(handleExtensionMessage);
    } catch (error: unknown) {
      // Ignore setup errors during context invalidation
      if (isRuntimeError(error) && !error.message.includes(CONTEXT_ERROR)) {
        console.warn('Error setting up extension message listener:', error);
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const attemptConnection = () => {
      if (!mountedRef.current || reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) return;
      
      const initialPort = connectPort();
      if (!initialPort && chrome?.runtime?.id) {
        if (reconnectTimer) window.clearTimeout(reconnectTimer);
        reconnectTimer = window.setTimeout(() => {
          attemptConnection();
          setReconnectAttempts(prev => prev + 1);
        }, RECONNECT_DELAY);
        return;
      }

      if (initialPort) {
        messageListener = (message: Message) => {
          if (mountedRef.current) {
            setMessageData(message);
          }
        };

        try {
          chrome.runtime.onMessage.addListener(messageListener);
        } catch (error: unknown) {
          // Ignore setup errors during context invalidation
          if (isRuntimeError(error) && !error.message.includes(CONTEXT_ERROR)) {
            console.error('Error adding message listener:', error);
          }
        }
      }
    };

    attemptConnection();

    return () => {
      mountedRef.current = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      try {
        chrome.runtime.onMessage.removeListener(handleExtensionMessage);
      } catch (error) {
        // Ignore cleanup errors during context invalidation
      }
      cleanupMessageListeners(messageListener);
      
      if (reconnectTimer) {
        window.clearTimeout(reconnectTimer);
      }
      
      disconnectPort();
    };
  }, [connectPort, port, reconnectAttempts, cleanupMessageListeners, disconnectPort]);

  return messageData;
}
