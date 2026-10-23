import { WebSocketServer, WebSocket } from "ws" ;

const wss = new WebSocketServer({ port: 8080 });
interface User {
    socket: WebSocket;
    room: string;
}
let allSockets : User[] = [];


wss.on("connection",  (socket) => {

    console.log(`New client connected. Total clients: ${allSockets.length}`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        if(parsedMessage.type === "join") {
            allSockets.push({ socket, room: parsedMessage.payload.roomId });
        }
        if(parsedMessage.type === "chat") {
            const currentUserRoom =  find((x) => x.socket === socket)?.room;
        }
    });

    socket.on("disconnect", () => {
        console.log(`Client disconnected. Total clients: ${allSockets.length}`);
        allSockets = allSockets.filter((s) => s.socket !== socket);
    });
})