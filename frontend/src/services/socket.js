import { io } from 'socket.io-client';

let socket = null;

export const connectSocet = () => {
    if (socket && socket.connected) {
        return socket;
    }

    const SOCKET_URL = import.meta.env.SOCKET_URL || undefined;

    socket = io(SOCKET_URL, {
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
        console.log('Socket connection error:', error);


    });

    return socket;

};

export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket is not initialized. Call connectSocket() first.');
    };

    return socket;
}

export const onSocketEvent = (event, handler) => {
    const socketInstance = getSocket();
    socketInstance.on(event, handler);
};

export const offSocketEvent = (event, handler) => {
    const socketInstance = getSocket();
    socketInstance.off(event, handler);
};

export const emitSocketEvent = (event, handler) => {
    const socketInstance = getSocket();

    return new Promise((resolve, reject) => {
        socketInstance.emit(event, payload, (response) => {
            if (response?.status === 'error') {
                reject(response);
            } else {
                resolve(response);
            }
        });
    });
};

export const disconnectSocket = () => {
    if (!socket) {
        return;
    }

    socket.disconnect();
    socket = null;
};
