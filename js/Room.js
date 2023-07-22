class Room {
    #rooms
    #io
    constructor(code, socket, rooms, io) {
        this.code = code
        this.users = {}
        this.playlist = []
        this.pos = 0
        this.speed = 1

        this.#rooms = rooms
        rooms[code] = this

        this.#io = io

        this.join(socket)
    }
    join(socket) {
        this.users[socket.id] = true
        socket.join(this.code)

        this.update()
        socket.emit("playlist", this)
    }
    leave(socket) {
        socket.leave(this.code)
        delete this.users[socket.id]

        this.update()

        if (Object.keys(this.users).length == 0) {
            delete this.#rooms[this.code]
        }
    }
    update() {
        this.#io.to(this.code).emit("room", this)
    }
}

module.exports = Room
