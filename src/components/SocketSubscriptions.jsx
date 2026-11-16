import { useEffect } from 'react';
import { subscribeToChatEvents } from '../services/socketEvents.js';

export default function SocketSubscriptions({ socket, queryClient, uiStore }) {
  useEffect(
    () => subscribeToChatEvents(socket, queryClient, uiStore),
    [socket, queryClient, uiStore],
  );
  return null;
}
