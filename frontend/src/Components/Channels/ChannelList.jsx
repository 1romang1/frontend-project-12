import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import ChannelItem from "./ChannelItem";
import { useGetChannelsQuery } from "../../api/channelsApi";
import { setCurrentChannelId } from "../../store/slices/channelsSlice";
import { openModal } from "../../store/slices/modalSlice";

export const ChannelList = () => {
  const { data: channels = [], isSuccess } = useGetChannelsQuery();
  const dispatch = useDispatch();

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  console.log({
  currentChannelId,
  currentChannelIdType: typeof currentChannelId,
  channelId: channels[0]?.id,
  channelIdType: typeof channels[0]?.id,
  // messageChannelId: messages[0]?.channelId,
  // messageChannelIdType: typeof messages[0]?.channelId,
});

  useEffect(() => {
    if (
      isSuccess &&
      channels.length > 0 &&
      currentChannelId == null
    ) {
      dispatch(setCurrentChannelId(channels[0].id));
    }
  }, [isSuccess, channels, currentChannelId, dispatch]);

  const handleAddChannel = () => {
    console.log('oooooooo!')
    dispatch(openModal({ type: 'create' }));
  };
  return (
    <div>
      <div class="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>Каналы</b>
        <button type="button" class="p-0 text-primary btn btn-group-vertical" onClick={handleAddChannel}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" class="bi bi-plus-square">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z">
            </path>
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4">
            </path>
          </svg>
          <span class="visually-hidden">
            +
          </span>
        </button>
      </div>
      <ul className="nav flex-column list-unstyled">
        {channels.map((channel) => (
          <ChannelItem key={channel.id} channel={channel} />
        ))}
      </ul>
    </div>
  );
};
