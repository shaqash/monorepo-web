import type { ChatCompletionOptions, LoadModelConfig, SamplingConfig } from "@wllama/wllama";
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

interface ModelParams {
  url: `https://${string}`;
  displayName: string;
  sampling?: SamplingConfig;
  modelConfig?: LoadModelConfig;
}

export const MODELS: Record<string, ModelParams> = {
  qwen25: {
    url: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf',
    displayName: 'Qwen 2.5',
    sampling: {},
    modelConfig: { n_ctx: 32768 },
  },
  llama32: {
    url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    displayName: 'Llama 3.2',
    sampling: {},
    modelConfig: { n_ctx: 32768 },
  },
  lfm2vl: {
    url: 'https://huggingface.co/LiquidAI/LFM2-VL-3B-GGUF/resolve/main/LFM2-VL-3B-Q4_0.gguf',
    displayName: 'LFM2',
    sampling: {
      top_k: 20,
      top_p: 0.95,
      min_p: 0.15,
      temp: 1,
      penalty_repeat: 1.05,
    },
    modelConfig: {
      n_ctx: 128000,
    },
  }
};

export type Model = keyof typeof MODELS;
