import { useCallback, useRef, useState } from "preact/hooks";
import { DEFAULT_INFERENCE_PARAMS, MODELS } from "../config";
import { useWllama } from "./wllama.context";

const controller = new AbortController();

export const useCompletion = () => {
  const { wllama, messages, currentModel } = useWllama();
  const [isLoading, setLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [output, setOutput] = useState<string | undefined>('');
  const signalRef = useRef(controller.signal);

  const abort = useCallback(() => controller.abort(), []);

  const complete = async () => {
    try {
      setLoading(true);
      setIsProcessing(true);
      const outputText = await wllama
        .createChatCompletion(messages.value, {
          ...DEFAULT_INFERENCE_PARAMS,
          ...(MODELS[currentModel.value].sampling ?? {}),
          stream: false,
          abortSignal: signalRef.current,
          onNewToken(_token, _piece, currentText) {
            setIsProcessing(false);
            setOutput(currentText);
          },
        });
      setOutput(outputText);
      console.log(outputText);
    } finally {
      setLoading(false);
    }
  }

  return { complete, output, abort, isLoading, isProcessing };
}