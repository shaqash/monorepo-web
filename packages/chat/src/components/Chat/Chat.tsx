import './Chat.css';
import { type FC } from "preact/compat";
import { Messages } from '../Messages/Messages';
import { Input } from '../Input/Input';
import { ModelSelector } from '../ModelSelector/ModelSelector';

export const Chat: FC = () => {
  return (
    <div className="chat-container">
      <ModelSelector />
      <Messages />
      <Input />
      <div className="disclaimer" />
    </div>
  );
};