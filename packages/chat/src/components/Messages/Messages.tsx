import { useEffect, useRef, type FC } from 'preact/compat';
import { useMessages } from '../../utils/useMessages';
import { useWllama } from '../../utils/wllama.context';
import './Messages.css';
import { useChatCompletion } from '../../utils/useChatCompletion';

export const Messages: FC = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useMessages();
  const { currentModelDisplayName } = useWllama();
  const { isPending } = useChatCompletion();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.value.length]);

  if (!messages.value.length) {
    return (
      <div class="flex-middle">
        <h1>{currentModelDisplayName}</h1>
      </div>
    );
  }

  return (
    <div class="flex-col overflow-y g3 p4">
      {messages.value.map((message, index) => (
        <div key={index} class={`message message-${message.role}`}>
          <div class="message-content">
            {message.role === 'assistant' && (
              <div class="title-small">{currentModelDisplayName}</div>
            )}
            {message.content}
          </div>
        </div>
      ))}
      {isPending && (
        <div class="typing-indicator">
          <div>
            <span />
            <span />
            <span />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
