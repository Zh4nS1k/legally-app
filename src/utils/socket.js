import { io } from 'socket.io-client';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

let socketInstance;

export const initSocket = (documentId) => {
  socketInstance = io(API_URL, {
    path: '/ws',
    query: { documentId },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  return socketInstance;
};

export const disconnectSocket = () => {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
};

export const onSocketEvent = (event, callback) => {
  if (socketInstance) {
    socketInstance.on(event, callback);
  }
};
