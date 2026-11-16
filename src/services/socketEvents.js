// Socket is injected by init; do not open a second connection here.
export function subscribeToChatEvents(socket, queryClient) {
  const updateList = (key, item, operation) => {
    queryClient.setQueryData([key], (old) => {
      if (!old) return old; // Initial data will be fetched by TanStack Query.
      if (operation === 'remove') return old.filter(({ id }) => id !== item.id);
      if (operation === 'rename') {
        return old.map((entry) => (entry.id === item.id ? { ...entry, ...item } : entry));
      }
      return old.some(({ id }) => id === item.id) ? old : [...old, item];
    });
  };

  socket.on('newMessage', (message) => updateList('messages', message, 'add'));
  socket.on('renameMessage', (message) => updateList('messages', message, 'rename'));
  socket.on('removeMessage', (message) => updateList('messages', message, 'remove'));
  socket.on('newChannel', (channel) => updateList('channels', channel, 'add'));
  socket.on('renameChannel', (channel) => updateList('channels', channel, 'rename'));
  socket.on('removeChannel', (channel) => updateList('channels', channel, 'remove'));
}
