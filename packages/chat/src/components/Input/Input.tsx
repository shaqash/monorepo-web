import './Input.css';
import { useRef, type FC, useEffect } from 'preact/compat';
import { useMessages } from '../../utils/useMessages';
import { useChatCompletion } from '../../utils/useChatCompletion';

export const Input: FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { pushAssistant, pushUser } = useMessages();
  const { data, isLoading } = useChatCompletion();

  useEffect(() => {
    if (data) {
      pushAssistant(data);
    }
  }, [data]);

  const handleSubmit = async () => {
    const inputValue = inputRef.current?.value.trim();
    if (!inputValue || isLoading) return;

    pushUser(inputValue);

    inputRef.current!.value = '';
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
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
  );
};
