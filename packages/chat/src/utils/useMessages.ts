import { useQueryClient } from '@tanstack/react-query';
import type { WllamaChatMessage } from '@wllama/wllama';
import { useWllama } from './wllama.context';
import { useCallback } from 'preact/hooks';

export const useMessages = () => {
  const { messages } = useWllama();
  const client = useQueryClient();

  const pushAssistant = useCallback(
    (content: string) => {
      const lastMessage = messages.value.at(-1);
      if (lastMessage?.role === 'assistant') {
        messages.value = messages.value.map((msg, idx) =>
          idx === messages.value.length - 1 ? { ...msg, content } : msg,
        );
      } else {
        messages.value = [...messages.value, { role: 'assistant', content }];
      }
    },
    [messages],
  );

  const pushUser = useCallback(
    (content: string) => {
      messages.value = [...messages.value, { content, role: 'user' }];
    },
    [messages],
  );

  const restoreMessages = () => {
    const _messages = client
      .getQueryCache()
      .findAll({
        queryKey: ['chat', 'chatNamePlaceholder'],
      })
      .flatMap<WllamaChatMessage>((cache) => {
        const [_chat, _chatName, question] = cache.queryKey;
        const answer = cache.state.data;
        if (!question || !answer) {
          return [];
        }
        return [
          { content: question as string, role: 'user' },
          { content: cache.state.data as string, role: 'assistant' },
        ];
      });

    messages.value = _messages;
  };

  return { messages: messages.value, restoreMessages, pushAssistant, pushUser };
};
