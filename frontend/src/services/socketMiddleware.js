import { connectSocket, onSocketEvent, disconnectSocket } from "./socket";
import {messagesApi} from "../api/messagesApi";
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
        if (action.type === "auth/setCredential" && !isInitialized) {
            
        }
    }
}