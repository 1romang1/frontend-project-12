import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMessages } from "../../store/slices/messagesSlice";
import { useSelector } from "react-redux";
import { selectCurrentChannelMessages } from "../currentChannelMessagesSelector";
import { useGetMessagesQuery } from "../../api/messagesApi";
import { selectCurrentChannelId } from "../currentChannelMessagesSelector";
import { Message } from "./MessageItem";

export const MessagesList = () => {
    console.log(useGetMessagesQuery);
  const dispatch = useDispatch();
  const { data: messages = [] } = useGetMessagesQuery();
  console.log(messages)
const currentChannelMessages = useSelector(selectCurrentChannelMessages);
  useEffect(() => {
    dispatch(setMessages(messages));
    
  }, [messages, dispatch]);

  const currentChannelId = useSelector(selectCurrentChannelId);
//   const currentChannelMessages = useSelector(selectCurrentChannelMessages);

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
          <Message key={message.id} message={message} />
        ))}
      </div>
    </div>
    
  );
};
