import { useCallback, useRef, useState } from "preact/hooks";
import { DEFAULT_INFERENCE_PARAMS } from "../config";
import { useWllama } from "./wllama.context";

const controller = new AbortController();

export const useCompletion = () => {
  const { wllama } = useWllama();
  const [isLoading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | undefined>(undefined);
  const signalRef = useRef(controller.signal);

  const abort = useCallback(() => controller.abort(), []);

  const complete = async (prompt: string) => {
    try {
      setLoading(true);
      console.log(prompt);
      const outputText = await wllama
        .createCompletion(`You are a helpful assistant. ${prompt}`, {
          ...DEFAULT_INFERENCE_PARAMS,
          stream: false,
          abortSignal: signalRef.current,
          onNewToken(_token, _piece, currentText) {
            setOutput(currentText);
          },
        });
      setOutput(outputText);
      console.log(outputText);
    } finally {
      setLoading(false);
    }
  }

  return { complete, output, abort, isLoading };
}