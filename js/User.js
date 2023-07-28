class User {
    constructor(socket) {
        this.id = socket.id
        this.name = socket.name || socket.id.slice(0, 6)
    }
}

module.exports = User
