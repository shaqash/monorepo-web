import {
  experimental_streamedQuery as streamedQuery,
  useQuery,
} from '@tanstack/react-query'
import { DEFAULT_INFERENCE_PARAMS } from '../config';
import { useWllama } from './wllama.context';
import { computed } from '@preact/signals';
import type { CompletionChunk } from '@wllama/wllama';


export const useChatCompletion = () => {
  const { wllama, messages } = useWllama();
  const key = computed(() => messages.value.reduce((acc, cur) => cur.role === 'user' ? acc + 1 : acc, 0));

  return useQuery({
    queryKey: ['chat', 'chatNamePlaceholder', key.value],
    enabled: !!messages.value.length,
    queryFn: streamedQuery({
      initialValue: '',
      reducer: (acc: string, chunk: CompletionChunk) => {
        return `${acc} ${chunk.currentText}`.trim();
      },
      streamFn: ({ signal }) => wllama
        .createChatCompletion(messages.value, {
          ...DEFAULT_INFERENCE_PARAMS,
          stream: true,
          abortSignal: signal,
        }),
    }),
    staleTime: 0,
    gcTime: 0,
  });
}
