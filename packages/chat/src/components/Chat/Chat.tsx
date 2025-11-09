import './Chat.css';
import { type FC } from 'preact/compat';
import { Messages } from '../Messages/Messages';
import { Input } from '../Input/Input';

export const Chat: FC = () => {
  return (
    <div className="chat-container">
      <Messages />
      <Input />
      <div className="disclaimer" />
    </div>
  );
};
