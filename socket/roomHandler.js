const {
    createRoom,
    roomExists,
    joinRoom,
    leaveRoom,
    getRoom,
    getRoomOfSocket
} = require("../utils/roomManager");

function generateRoomId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

module.exports = function(io, socket){

    socket.on("create-room", ()=>{

        let roomId;

        do{
            roomId = generateRoomId();
        }while(roomExists(roomId));

        createRoom(roomId, socket.id);

        socket.join(roomId);

        socket.emit("room-created",{
            roomId,
            host:true
        });

    });

    socket.on("join-room",(roomId)=>{

        roomId = roomId.trim().toUpperCase();

        if(!roomExists(roomId)){
            socket.emit("room-error","Room does not exist");
            return;
        }

        joinRoom(roomId,socket.id);

        socket.join(roomId);

        socket.emit("room-joined",{
            roomId,
            host:false
        });

        io.to(roomId).emit("room-users",getRoom(roomId).users);

        socket.to(roomId).emit("peer-joined",socket.id);

    });

    socket.on("leave-room",()=>{

        const roomId = getRoomOfSocket(socket.id);

        if(!roomId) return;

        leaveRoom(roomId,socket.id);

        socket.leave(roomId);

        const room = getRoom(roomId);

        if(room)
            io.to(roomId).emit("room-users",room.users);

        socket.to(roomId).emit("peer-left",socket.id);

    });

    socket.on("disconnect",()=>{

        const roomId = getRoomOfSocket(socket.id);

        if(!roomId) return;

        leaveRoom(roomId,socket.id);

        const room = getRoom(roomId);

        if(room)
            io.to(roomId).emit("room-users",room.users);

        socket.to(roomId).emit("peer-left",socket.id);

    });

}