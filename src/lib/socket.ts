import { io, Socket } from "socket.io-client";
import { API_BASE_URL } from "./api";

// ---------------------------------------------------------------------------
// Event payload interfaces
// ---------------------------------------------------------------------------

export interface SocketNotificationPayload {
  _id?: string;
  id?: string;
  title: string;
  body?: string;
  message?: string;
  kind?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  entityRef?: {
    type?: string;
    id?: string;
    projectId?: string;
    taskId?: string;
    url?: string;
  };
  [key: string]: unknown;
}

export interface SocketTaskPayload {
  _id?: string;
  id?: string;
  projectId?: string;
  title?: string;
  status?: string;
  assignee?: string | { id?: string; name?: string };
  [key: string]: unknown;
}

export interface SocketCommentPayload {
  _id?: string;
  id?: string;
  taskId?: string;
  content?: string;
  text?: string;
  author?: { name?: string };
  [key: string]: unknown;
}

export interface SocketActivityPayload {
  _id?: string;
  id?: string;
  taskId?: string;
  action?: string;
  user?: string;
  message?: string;
  [key: string]: unknown;
}

export interface ServerToClientEvents {
  "notification:new": (data: SocketNotificationPayload) => void;
  "task:created": (data: SocketTaskPayload) => void;
  "task:updated": (data: SocketTaskPayload) => void;
  "task:deleted": (data: { id?: string; taskId?: string; projectId?: string }) => void;
  "task:statusChanged": (data: { id?: string; taskId?: string; status: string; task?: SocketTaskPayload; projectId?: string }) => void;
  "comment:created": (data: SocketCommentPayload) => void;
  "comment:updated": (data: SocketCommentPayload) => void;
  "comment:deleted": (data: { id?: string; commentId?: string; taskId?: string }) => void;
  "activity:new": (data: SocketActivityPayload) => void;
}

export interface ClientToServerEvents {
  join: (userId: string) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

// ---------------------------------------------------------------------------
// Singleton Socket.IO Client
// ---------------------------------------------------------------------------

let socketInstance: TypedSocket | null = null;
let currentUserId: string | null = null;

/** Returns the active socket instance if connected. */
export function getSocket(): TypedSocket | null {
  return socketInstance;
}

/** Connect (or reuse) the singleton Socket.IO instance. */
export function connectSocket(userId?: string): TypedSocket {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("zabaku_token") || localStorage.getItem("token")
      : null;

  if (userId) {
    currentUserId = userId;
  }

  if (!socketInstance) {
    socketInstance = io(API_BASE_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socketInstance.on("connect", () => {
      if (currentUserId && socketInstance) {
        socketInstance.emit("join", currentUserId);
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("[Socket.IO] Connection error:", err.message);
    });

    socketInstance.on("disconnect", () => {
      // Automatic reconnect handles transient disconnects
    });
  } else if (!socketInstance.connected) {
    socketInstance.connect();
    if (currentUserId && socketInstance.connected) {
      socketInstance.emit("join", currentUserId);
    }
  } else if (userId && currentUserId) {
    socketInstance.emit("join", currentUserId);
  }

  return socketInstance;
}

/** Disconnect and clear the singleton socket. */
export function disconnectSocket(): void {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
    currentUserId = null;
  }
}