import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import init from './init.jsx';

const start = async () => {
  const socket = io();
  const view = await init(socket);
  createRoot(document.querySelector('#chat')).render(view);
};

start();
