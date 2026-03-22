import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = (userId: string): Socket => {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
    s.on('connect', () => {
      s.emit('join', userId);
    });
  } else {
    s.emit('join', userId);
  }
  return s;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

export const joinThread = (threadId: string) => {
  getSocket().emit('join_thread', threadId);
};

export const leaveThread = (threadId: string) => {
  getSocket().emit('leave_thread', threadId);
};

export default getSocket;
