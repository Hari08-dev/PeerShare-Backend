const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("create-room", (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} created ${roomId}`);
    });

    socket.on("join-room", (roomId) => {
        socket.join(roomId);

        socket.to(roomId).emit("user-joined", {
            socketId: socket.id,
        });

        console.log(`${socket.id} joined ${roomId}`);
    });

    socket.on("disconnect", () => {
        console.log("Disconnected:", socket.id);
    });
});

server.listen(3001, () => {
    console.log("Server running on port 3001");
});