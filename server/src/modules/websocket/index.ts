import { Server as httpServer } from "http";
import { Server } from "socket.io";

export default function(server: httpServer) {
    const io = new Server(server, {
        cors: {
            origin: '*',    // Adjust based on frontend url
            methods: ["GET", "POST"]
        }
    });

    // WebSocket connection event
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
}