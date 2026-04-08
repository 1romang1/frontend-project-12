import { ChannelList } from "../Channels/ChannelList";
import { MessagesList } from "../Messages/MessagesList";

const MainPage = () => {
    return (
        <div>
            Main Page
            <ChannelList />
            <MessagesList />
        </div>
    );
};

export default MainPage;