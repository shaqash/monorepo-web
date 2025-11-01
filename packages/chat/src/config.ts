import type { ChatCompletionOptions } from "@wllama/wllama";
import multiThreadWllamaWasmUrl from "@wllama/wllama/esm/multi-thread/wllama.wasm?url";
import singleThreadWllamaWasmUrl from "@wllama/wllama/esm/single-thread/wllama.wasm?url";

export const CONFIG_PATHS = {
  'single-thread/wllama.wasm': singleThreadWllamaWasmUrl,
  'multi-thread/wllama.wasm': multiThreadWllamaWasmUrl,
};

export const DEFAULT_INFERENCE_PARAMS: Partial<ChatCompletionOptions> = {
  useCache: true,
  sampling: {
    temp: 0.5,
    top_k: 40,
    top_p: 0.9,
  },
  nPredict: 150,
};

export const MODELS = {
  stories: {
    url: 'https://huggingface.co/ggml-org/models/resolve/main/tinyllamas/stories15M-q4_0.gguf',
  },
  LFM2: {
    url: 'https://huggingface.co/LiquidAI/LFM2-350M-GGUF/resolve/main/LFM2-350M-Q4_K_M.gguf',
  },
  qwen25: {
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf',
  },

} as const;
