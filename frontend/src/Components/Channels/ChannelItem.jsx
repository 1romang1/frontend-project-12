import { useDispatch } from "react-redux";
import { setCurrentChannelId } from "../../store/slices/channelsSlice";

const ChannelItem = ({ channel }) => {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setCurrentChannelId(channel.id));
    console.log("CLICK", channel.id);
  };

  return (
    <li className="nav-item w-100">
      <button
        type="button"
        className="w-100 rounded-0 text-start btn btn-secondary"
        onClick={handleClick}
      >
        <span className="me-1">#</span>
        {channel.name}
      </button>
    </li>
  );
};

export default ChannelItem;