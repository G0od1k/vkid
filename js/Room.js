class Room {
    #rooms
    constructor(code, socket, rooms) {
        this.code = code
        this.users = new Set()
        this.playlist = []
        this.pos = 0
        this.speed = 1

        this.#rooms = rooms
        rooms[code] = this

        this.join(socket)
    }
    join(socket) {
        this.users.add(socket.id)
        socket.join(this.code)
        socket.emit("data", this)
    }
    leave(socket) {
        socket.leave(this.code)
        this.users.delete(socket.id)
        if (this.users.size == 0) {
            delete this.#rooms[this.code]
        }
    }
}

module.exports = Room
