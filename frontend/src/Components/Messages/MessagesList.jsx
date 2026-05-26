import { useSelector } from "react-redux";
import { useGetMessagesQuery } from "../../api/messagesApi";
import { useGetChannelsQuery } from "../../api/channelsApi";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";

export const MessagesList = () => {
  const { data: messages = [] } = useGetMessagesQuery();
  const { data: channels = [], isSuccess } = useGetChannelsQuery();

  const currentChannelId = useSelector(
    (state) => state.channels.currentChannelId,
  );
  console.log('currentChannelId:', currentChannelId)

  const currentChannel = channels.find(channel => channel.id === currentChannelId)
  console.log('currentChannel:', currentChannel)

  const currentChannelMessages = messages.filter(
    (m) => m.channelId === currentChannelId,
  );

  return (
    <div className="d-flex flex-column h-100 flex-grow-1">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b># {currentChannel ? currentChannel.name : 'Чат загружается'}</b>
        </p>
        <span className="text-muted">{currentChannelMessages.length} сообщение</span>
      </div>

      <div className="chat-messages overflow-auto px-5">
        {currentChannelMessages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
