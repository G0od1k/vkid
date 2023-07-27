const User = require("./User")

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

        setInterval(() => this.ping(), 5000)
    }
    join(socket) {
        this.users[socket.id] = new User(socket)
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
    emit(...args) {
        this.#io.to(this.code).emit(...args)
    }
    update() {
        this.emit("room", this)
    }
    ping() {
        Object.keys(this.users).forEach((id) => {
            const start = Date.now()
            this.#io
                .to(id)
                .emit("ping", () =>
                    this.emit("pingdata", id, Date.now() - start)
                )
        })
    }
}

module.exports = Room
