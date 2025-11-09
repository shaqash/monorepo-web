import { createContext, type ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useRef } from 'preact/hooks';
import type { DownloadProgressCallback, ModelManager, Wllama, WllamaChatMessage } from '@wllama/wllama';
import { modelManager, wllama } from '../wllama';
import { MODELS, type Model } from '../config';
import { signal, computed, effect } from '@preact/signals';

function createWllamaStore() {
  const messages = signal<WllamaChatMessage[]>([]);
  // Prefer URL query param (explicit user choice via selector reload), then persisted selection, then fallback
  const storedModel = (() => {
    try {
      const v = localStorage.getItem('selectedModel');
      return v ?? null;
    } catch (e) {
      return null;
    }
  })();

  const currentModelName = signal(
    modelQueryParam && (modelQueryParam in MODELS)
      ? (modelQueryParam as Model)
      : storedModel && (storedModel in MODELS)
        ? (storedModel as Model)
        : 'qwen25'
  );
  const downloadProgress = signal(0);
  const currentModel = computed(() => MODELS[currentModelName.value]);
  const currentModelDisplayName = computed(() => currentModel.value.displayName);
  const currentSampling = computed(() => currentModel.value.sampling);
  const lastUserMessage = computed(() => messages.value.reverse().find(({ role }) => role === 'user'));

  return { messages, currentModel, downloadProgress, currentModelDisplayName, currentSampling, lastUserMessage, currentModelName };
}

interface TWllamaContext extends ReturnType<typeof createWllamaStore> {
  wllama: Wllama;
  modelManager: ModelManager;
}

const searchParams = new URLSearchParams(window.location.search);
const modelQueryParam = searchParams.get('model') ?? '';

const WllamaContext = createContext<TWllamaContext>({} as unknown as TWllamaContext);
const controller = new AbortController();

export const WllamaProvider = ({ children }: { children: ComponentChildren }) => {
  const { currentModel, currentModelDisplayName, currentSampling, downloadProgress, lastUserMessage, messages, currentModelName } = createWllamaStore();
  const signalRef = useRef(controller.signal);

  const progressCallback: DownloadProgressCallback = useCallback(({ loaded, total }) => {
    const progressPercentage = Math.round((loaded / total) * 100);
    downloadProgress.value = progressPercentage;
  }, [downloadProgress]);


  useEffect(() => {
    (async () => {
      const model = await modelManager.getModelOrDownload(
        currentModel.value.url,
        {
          progressCallback,
          signal: signalRef.current,
        }
      );
      wllama.loadModel(model, { ...(currentModel.value.modelConfig ?? {}) });
    })();

    return () => {
      controller.abort();
    }
  }, [currentModel, progressCallback]);

  // Persist model selection to localStorage and reflect it in URL (replace state).
  // Use signal's reactive `effect` so this runs when currentModelName.value changes.
  effect(() => {
    const name = currentModelName.value;
    try {
      localStorage.setItem('selectedModel', name);
    } catch (e) { }

    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('model') !== name) {
        params.set('model', name);
        const newUrl = window.location.pathname + '?' + params.toString();
        history.replaceState(null, '', newUrl);
      }
    } catch (e) { }
  });

  return (
    <WllamaContext.Provider value={{
      wllama,
      modelManager,
      currentModel,
      currentModelDisplayName,
      currentSampling,
      downloadProgress,
      lastUserMessage,
      messages,
      currentModelName,
    }}>
      {children}
    </WllamaContext.Provider>
  );
}

export const useWllama = () => useContext(WllamaContext);