import { format } from "timeago.js";
import "./../style/Message.css";

const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="message-cover">
        <div className="message-text">{message.text}</div>
      </div>
      <div className="message-meta">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
