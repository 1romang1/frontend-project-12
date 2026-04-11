import { useSelector } from "react-redux";
import { useGetMessagesQuery } from "../../api/messagesApi";
import { MessageItem } from "./MessageItem";

export const MessagesList = () => {
  const { data: messages = [] } = useGetMessagesQuery();

  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId,
  );

  const currentChannelMessages = messages.filter(
    (m) => m.channelId === currentChannelId,
  );

  return (
    <div className="d-flex flex-column h-100 flex-grow-1">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># general</b>
        </p>
        <span className="text-muted">1 сообщение</span>
      </div>

      <div className="chat-messages overflow-auto px-5">
        {currentChannelMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
