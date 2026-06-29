const rooms = new Map();

function createRoom(roomId, socketId) {
    rooms.set(roomId, {
        host: socketId,
        users: [socketId],
    });
}

function roomExists(roomId) {
    return rooms.has(roomId);
}

function joinRoom(roomId, socketId) {
    if (!rooms.has(roomId)) return false;

    const room = rooms.get(roomId);

    if (!room.users.includes(socketId))
        room.users.push(socketId);

    return true;
}

function leaveRoom(roomId, socketId) {

    if (!rooms.has(roomId)) return;

    const room = rooms.get(roomId);

    room.users = room.users.filter(id => id !== socketId);

    if (room.host === socketId && room.users.length > 0)
        room.host = room.users[0];

    if (room.users.length === 0)
        rooms.delete(roomId);
    
    
    if (room.host === socketId)
        rooms.delete(roomId);
    
}

function getRoom(roomId) {
    return rooms.get(roomId);
}

function getRoomOfSocket(socketId) {

    for (const [roomId, room] of rooms.entries()) {

        if (room.users.includes(socketId))
            return roomId;
    }

    return null;
}

module.exports = {
    createRoom,
    roomExists,
    joinRoom,
    leaveRoom,
    getRoom,
    getRoomOfSocket
};