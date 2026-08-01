import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;

export function initializeSocket(server: HTTPServer) {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.id}`);

        socket.on("join", (userId: string) => {
            socket.join(userId);

            console.log(
                `✅ User ${userId} joined room ${userId}`
            );
        });

        socket.on("disconnect", () => {
            console.log(`❌ User disconnected: ${socket.id}`);
        });
    });

    return io;
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
}