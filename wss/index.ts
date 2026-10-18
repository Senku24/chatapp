import { WebSocketServer } from "ws" ;

const wss = new WebSocketServer({ port: 8080 });


let usercount = 0;
wss.on("connection",  (socket) => {
    usercount = usercount + 1;
    console.log(`New client connected. Total clients: ${usercount}`);

    socket.on("message", (message) => {
        console.log(`Received message: ${message}`);
        socket.send(`Echo: ${message} message received by server`);
    });

})