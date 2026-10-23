import { WebSocket, WebSocketServer } from "ws";

const port = Number(process.env.PORT ?? 8080);
const wss = new WebSocketServer({ port });
interface User {
    socket: WebSocket;
    room: string;
}
const allSockets: User[] = [];


wss.on("connection", (socket) => {

    console.log(`New client connected.`);

    socket.on("message", (message) => {
        try {
            const parsedMessage: {
                type?: string;
                payload?: { roomId?: unknown; message?: unknown };
            } = JSON.parse(message.toString());

            if (parsedMessage.type === "join") {
                const roomId = parsedMessage.payload?.roomId;
                if (typeof roomId !== "string" || roomId.length === 0) {
                    socket.send(JSON.stringify({ type: "error", message: "A roomId is required." }));
                    return;
                }

                const existingUser = allSockets.find((user) => user.socket === socket);
                if (existingUser) {
                    existingUser.room = roomId;
                } else {
                    allSockets.push({ socket, room: roomId });
                }
                return;
            }

            if (parsedMessage.type === "chat") {
                const currentUser = allSockets.find((user) => user.socket === socket);
                const chatMessage = parsedMessage.payload?.message;

                if (!currentUser || typeof chatMessage !== "string") {
                    return;
                }

                for (const user of allSockets) {
                    if (user.room === currentUser.room && user.socket.readyState === WebSocket.OPEN) {
                        user.socket.send(chatMessage);
                    }
                }
            }
        } catch {
            socket.send(JSON.stringify({ type: "error", message: "Invalid message format." }));
        }
    });

    socket.on("close", () => {
        console.log(`Client disconnected. Total clients: ${allSockets.length}`);
        const index = allSockets.findIndex((user) => user.socket === socket);
        if (index !== -1) {
            allSockets.splice(index, 1);
        }
    });
});
