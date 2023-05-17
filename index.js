const express = require("express")
const app = express()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)

const Room = require("./js/Room")

const rooms = {}

function genRoom(socket) {
    let code = ""
    do {
        code = new Array(4)
            .fill()
            .map((x) => String.fromCharCode(0x41 + ~~(Math.random() * 26)))
            .join("")
    } while (rooms[code] != undefined)

    return new Room(code, socket, rooms)
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html")
})

app.use(express.static("client"))

io.on("connection", (socket) => {
    /**
     * @type Room
     */
    let room = genRoom(socket)

    socket.on("disconnect", () => {
        room.leave(socket)

        console.log("a user disconnected")
    })

    socket.on("join", (code) => {
        if (rooms[code] == undefined) return 0

        room.leave(socket)

        room = rooms[code]
        room.join(socket)
    })

    socket.on("add", (name, url) => {
        room.playlist.push({
            name: name || "Name",
            url: url || "#",
        })
        io.to(room.code).emit("data", room)
    })

    console.log("a user connected")
    console.log(Object.keys(rooms).join(" "))
})

server.listen(3000, () => {
    console.log("3000")
})
