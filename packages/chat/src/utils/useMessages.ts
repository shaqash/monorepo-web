import { useWllama } from './wllama.context';

export const useMessages = () => {
  const { messages } = useWllama();

  const pushAssistant = (content: string) => {
    const lastMessage = messages.value.at(-1);
    if (lastMessage?.role === 'assistant') {
      messages.value = messages.value.map((msg, idx) =>
        idx === messages.value.length - 1 ? { ...msg, content } : msg,
      );
    } else {
      messages.value = [...messages.value, { role: 'assistant', content }];
    }
  };

  const pushUser = (content: string) => {
    messages.value = [...messages.value, { content, role: 'user' }];
  };

  return { pushAssistant, pushUser, messages };
};
