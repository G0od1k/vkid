class User {
    constructor(socket) {
        this.id = socket.id
        this.name = socket.name
    }
}

module.exports = User
