module.exports = function (io, socket) {

    socket.on("offer", ({ target, offer }) => {

        io.to(target).emit("offer", {
            sender: socket.id,
            offer,
        });

    });

    socket.on("answer", ({ target, answer }) => {

        io.to(target).emit("answer", {
            sender: socket.id,
            answer,
        });

    });

    socket.on("ice-candidate", ({ target, candidate }) => {

        io.to(target).emit("ice-candidate", {
            sender: socket.id,
            candidate,
        });

    });

};