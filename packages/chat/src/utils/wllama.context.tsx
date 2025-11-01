import { createContext, type ComponentChildren } from 'preact';
import { useContext, useEffect, useRef, useState } from 'preact/hooks';
import type { DownloadProgressCallback, ModelManager, Wllama } from '@wllama/wllama';
import { modelManager, wllama } from '../wllama';
import { MODELS } from '../config';

interface TWllamaContext {
  wllama: Wllama;
  modelManager: ModelManager
  downloadProgress: number;
}

const WllamaContext = createContext<TWllamaContext>({} as unknown as TWllamaContext);
const controller = new AbortController();

export const WllamaProvider = ({ children }: { children: ComponentChildren }) => {
  const signalRef = useRef(controller.signal);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const progressCallback: DownloadProgressCallback = ({ loaded, total }) => {
    const progressPercentage = Math.round((loaded / total) * 100);
    setDownloadProgress(progressPercentage);
    console.log(`Downloading... ${progressPercentage}%`);
  };

  useEffect(() => {
    (async () => {
      const model = await modelManager.getModelOrDownload(MODELS.qwen25.url, {
        progressCallback,
        signal: signalRef.current,
      });
      wllama.loadModel(model);
    })();

    return () => {
      controller.abort();
    }
  }, []);

  return (
    <WllamaContext.Provider value={{ wllama, modelManager, downloadProgress }}>
      {children}
    </WllamaContext.Provider>
  );
}

export const useWllama = () => useContext(WllamaContext);