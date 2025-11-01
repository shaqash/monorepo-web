import { useState } from "preact/hooks";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const pushAssistant = (content: string) => setMessages(prev => {
    const lastMessage = prev[prev.length - 1];
    if (lastMessage?.role === 'assistant') {
      // Update existing assistant message
      return [...prev.slice(0, -1), { role: 'assistant', content }];
    }
    // Add new assistant message
    return [...prev, { role: 'assistant', content }];
  });

  const pushUser = (content: string) => setMessages(prev => [...prev, { content, role: 'user' }])


  return { pushAssistant, pushUser, messages };
}