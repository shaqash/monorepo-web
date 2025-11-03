import { useWllama } from "./wllama.context";

export const useMessages = () => {
  const { messages } = useWllama();

  const pushAssistant = (content: string) => {
    const lastMessage = messages.value.at(-1);
    if (lastMessage?.role === 'assistant') {
      messages.value[messages.value.length - 1].content = content;
    } else {
      messages.value.push({ role: 'assistant', content });
    }
  };

  const pushUser = (content: string) => {
    messages.value.push({ content, role: 'user' });
  }

  return { pushAssistant, pushUser, messages };
}