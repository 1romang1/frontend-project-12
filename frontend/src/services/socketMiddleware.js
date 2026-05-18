import { connectSocket, onSocketEvent, disconnectSocket } from "./socket";
import { messagesApi } from "../api/messagesApi";
import { channelsApi } from "../api/channelsApi";

export const socketMiddleware = (store) => {
    let isInitialized = false;

    const updateMessages = (updater) => {
        store.dispatch(
            messagesApi.util.updateQueryData(
                "getMessages",
                undefined,
                updater,
            )
        );
    };

    const updateChannels = (updater) => {
        store.dispatch(
            channelsApi.util.updateQueryData(
                "getChannels",
                undefined,
                updater,
            )
        );
    };

    return (next) => (action) => {
        if (action.type === "auth/setCredentials" && !isInitialized) {
            const socket = connectSocket();
            isInitialized = true;

            onSocketEvent('newMessage', (message) => {
                updateMessages((draft) => {
                    const exists = draft.some((msg) => msg.id === message.id);
                    if (!exists) {
                        draft.push(message);
                    }
                });
            });

            onSocketEvent('removeMessage', ({ id }) => {
                updateMessages((draft) => {
                    const index = draft.findIndex((msg) => msg.id === id);
                    if (index !== -1) {
                        draft.splice(index, 1);
                    }
                });
            });

            onSocketEvent('renameMessage', (updatedMessage) => {
                updateMessages((draft) => {
                    const message = draft.find((msg) => msg.id === updatedMessage.id);
                    if (message) {
                        message.body = updatedMessage.body;
                    }
                });
            });

            onSocketEvent('newChannel', (channel) => {
                updateChannels((draft) => {
                    draft.push(channel);
                });
            });

            onSocketEvent('removeChannel', ({ id }) => {
                updateChannels((draft) => {
                    const index = draft.findIndex((chnl) => chnl.id === id);
                    if (index !== -1) {
                        draft.splice(index, 1);
                    }
                });
            });

            onSocketEvent('renameChannel', (updatedChannel) => {
                updateChannels((draft) => {
                    const channel = draft.find((chnl) => chnl.id === updatedChannel.id);
                    if (channel) {
                        channel.name = channel.name;
                    }
                });
            });
        }

        if (action.type === 'auth/logout') {
            disconnectSocket();
            isInitialized = false;
        }
        return next(action);
    }
}