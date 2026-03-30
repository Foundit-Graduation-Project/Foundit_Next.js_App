import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:3000";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[Admin Socket] Connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Admin Socket] Connection error:", err.message);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    console.warn("[Admin Socket] Socket not connected. Call connectSocket first.");
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
