import './Input.css';
import { useRef, useEffect, type FC } from "preact/compat";
import { useCompletion } from '../../utils/useCompletion';
import { useMessages } from '../../utils/useMessages';
import { useWllama } from '../../utils/wllama.context';
import { MODELS } from '../../config';

export const Input: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, pushAssistant, pushUser } = useMessages();
  const { complete, output, abort, isLoading, isProcessing } = useCompletion();
  const { currentModel } = useWllama();

  useEffect(() => {
    if (output && output.trim()) {
      pushAssistant(output.trim());
    }
  }, [output, pushAssistant]);

  useEffect(() => {
    return () => abort();
  }, [abort])

  const handleSubmit = async () => {
    const inputValue = inputRef.current?.value.trim();
    if (!inputValue || isLoading) return;

    pushUser(inputValue);

    inputRef.current!.value = '';

    await complete();

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-area">
        {messages.value.length === 0 ? (
          <h1 class="welcome-message">{MODELS[currentModel.value].displayName}</h1>
        ) : (
          <div className="messages-list">
            {messages.value.map((message, index) => (
              <div key={index} className={`message message-${message.role}`}>
                <div className="message-content">
                  {message.role === 'assistant' && (
                    <div class="message-title">
                      {MODELS[currentModel.value].displayName}
                    </div>
                  )}
                  {message.content}
                </div>
              </div>
            ))}
            {isProcessing && (
              <div className="message message-assistant">
                <div className="message-content typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="input-container">
        <div className={`input-wrapper ${isLoading && 'loading'}`}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask anything."
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="chat-input"
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="send-button"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 3l5 5-5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="disclaimer" />
    </div>
  );
};