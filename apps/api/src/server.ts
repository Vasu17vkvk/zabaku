import http from "http";

import app from "./app";
import { env } from "./config/env";
import { connectDatabase } from "./database/connection";

import { initializeSocket } from "./socket/socket";

async function startServer() {
    try {
        await connectDatabase();

        const server = http.createServer(app);

        initializeSocket(server);

        server.listen(env.PORT, () => {
            console.log(
                `🚀 Zabaku API is running on http://localhost:${env.PORT}`
            );
        });
    } catch (error) {
        console.error("Unable to start server", error);
    }
}

startServer();