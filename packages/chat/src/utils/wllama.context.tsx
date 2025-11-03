import { createContext, type ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useRef } from 'preact/hooks';
import type { DownloadProgressCallback, ModelManager, Wllama, WllamaChatMessage } from '@wllama/wllama';
import { modelManager, wllama } from '../wllama';
import { MODELS, type Model } from '../config';
import { signal } from '@preact/signals';

function createWllamaStore() {
  const messages = signal<WllamaChatMessage[]>([]);
  const currentModel = signal(
    modelQueryParam in MODELS
      ? modelQueryParam as Model
      : 'qwen25'
  );
  const downloadProgress = signal(0);


  return { messages, currentModel, downloadProgress };
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
  const { currentModel, downloadProgress, messages } = createWllamaStore();
  const signalRef = useRef(controller.signal);

  const progressCallback: DownloadProgressCallback = useCallback(({ loaded, total }) => {
    const progressPercentage = Math.round((loaded / total) * 100);
    downloadProgress.value = progressPercentage;
  }, [downloadProgress]);

  console.log('@@@', currentModel, downloadProgress, messages );

  useEffect(() => {
    (async () => {
      const model = await modelManager.getModelOrDownload(
        MODELS[currentModel.value].url,
        {
          progressCallback,
          signal: signalRef.current,
        }
      );
      wllama.loadModel(model, { ...(MODELS[currentModel.value].modelConfig ?? {}) });
    })();

    return () => {
      controller.abort();
    }
  }, [currentModel, progressCallback]);

  return (
    <WllamaContext.Provider value={{
      wllama, modelManager, downloadProgress, currentModel, messages
    }}>
      {children}
    </WllamaContext.Provider>
  );
}

export const useWllama = () => useContext(WllamaContext);