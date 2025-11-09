import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from '@tanstack/react-query';
import { DEFAULT_INFERENCE_PARAMS } from '../config';
import { useWllama } from './wllama.context';
import { computed } from '@preact/signals';
import type { CompletionChunk } from '@wllama/wllama';

export const useChatCompletion = () => {
  const { wllama, messages, currentSampling } = useWllama();
  const key = computed(() => {
    const lastUserMessage = [...messages.value]
      .reverse()
      .find((m) => m.role === 'user');
    return lastUserMessage?.content ?? '';
  });

  return useQuery({
    queryKey: ['chat', 'chatNamePlaceholder', key.value],
    enabled: !!messages.value.length,
    queryFn: streamedQuery({
      initialValue: '',
      reducer: (_acc: string, chunk: CompletionChunk) => {
        return chunk.currentText.trim();
      },
      streamFn: ({ signal }) =>
        wllama.createChatCompletion(messages.value, {
          ...DEFAULT_INFERENCE_PARAMS,
          sampling: {
            ...DEFAULT_INFERENCE_PARAMS.sampling,
            ...(currentSampling.value ?? {}),
          },
          useCache: true,
          stream: true,
          abortSignal: signal,
        }),
    }),
    staleTime: Infinity,
    // gcTime: 0,
  });
};
