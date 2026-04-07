import { useSelector } from "react-redux";

import { useGetMessagesQuery } from "../../api/messagesApi";

export const MessagesList = () => {
    const currentChannelId = useSelector((state) => state.channels.currentChannelId);
    const { data: messages = [] } = useGetMessagesQuery();
