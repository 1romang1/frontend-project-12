import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import ChannelItem from "./ChannelItem";
import { useGetChannelsQuery } from "../../api/channelsApi";
import { setCurrentChannelId } from "../../store/slices/channelsSlice";

export const ChannelList = () => {
  const { data: channels = [], isSuccess } = useGetChannelsQuery();
  const dispatch = useDispatch();

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);

  useEffect(() => {
    const generalChannel = channels.find(channel => channel.name === 'general');

    if (isSuccess && channels.length > 0 && currentChannelId === undefined) {
      dispatch(setCurrentChannelId({ id: generalChannel.id }));
    }
    if (isSuccess && channels.length > 0) {
      dispatch(setCurrentChannelId({ id: channels[0].id }));
    }
  }, [isSuccess, channels, dispatch]);

  return (
    <ul className="nav flex-column list-unstyled">
      {channels.map((channel) => (
        <ChannelItem key={channel.id} channel={channel} />
      ))}
    </ul>
  );
};
