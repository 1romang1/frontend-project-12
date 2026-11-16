import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import init from './init.jsx';
import { initializeMonitoring, reactErrorOptions } from './services/monitoring.js';

const start = async () => {
  initializeMonitoring();
  const socket = io();
  const view = await init(socket);
  createRoot(document.querySelector('#chat'), reactErrorOptions()).render(view);
};

start();
