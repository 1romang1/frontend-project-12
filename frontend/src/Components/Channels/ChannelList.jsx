import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ChannelItem from "./ChannelItem";
import { useGetChannelsQuery } from "../../api/channelsApi";
import { setCurrentChannelId } from "../../store/slices/channelsSlice";

export const ChannelList = () => {
  const { data: channels = [], isSuccess } = useGetChannelsQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess && channels.length > 0) {
      dispatch(setCurrentChannelId(channels[0].id));
    }
  }, [isSuccess, channels, dispatch]);

  return (
    <ul className="nav flex-column list-unstyled">
      {channels.map((channel) => (
        <ChannelItem key={channel.id} channelName={channel.name} />
      ))}
    </ul>
  );
};
