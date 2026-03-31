import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') || "http://localhost:3000";

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (!socket) {
    console.log("[Socket] Connecting to server...");
    socket = io(SOCKET_URL, {
      auth: { token },
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });

    // Listen for all events for debugging
    socket.onAny((event, ...args) => {
      console.log("[Socket] Event received:", event, args);
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
