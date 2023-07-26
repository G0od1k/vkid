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

    return new Room(code, socket, rooms, io)
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html")
})

app.get("/rooms", (req, res) => {
    res.sendFile(__dirname + "/client/rooms/index.html")
})

app.get("/rooms.json", (req, res) => {
    res.send(Object.values(rooms))
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
        if (rooms[code] == undefined || code == room.code) return 0

        room.leave(socket)

        room = rooms[code]
        room.join(socket)
    })

    socket.on("open", (pos) => {
        if (!room.playlist[pos]) return 0
        room.emit("open", (room.pos = pos))
    })

    socket.on("add", (name, url, audio, vtt, img) => {
        room.playlist.push({
            name: name || "Name",
            url: url || "#",
            audio: audio || "#",
            vtt: vtt || "#",
            img: img,
        })
        room.emit("playlist", room)
    })

    socket.on("delete", (i) => {
        if (i == room.pos) room.pos = -1
        room.playlist.splice(i, 1)
        room.emit("playlist", room)
    })

    socket.on("up", (i) => {
        if (i == 0) return
        ;[room.playlist[i], room.playlist[i - 1]] = [
            room.playlist[i - 1],
            room.playlist[i],
        ]
        room.emit("playlist", room)
    })

    socket.on("down", (i) => {
        if (i == room.playlist.length - 1) return
        ;[room.playlist[i], room.playlist[i + 1]] = [
            room.playlist[i + 1],
            room.playlist[i],
        ]
        room.emit("playlist", room)
    })

    socket.on("play", (time, id) => {
        room.emit("play", time, id)
    })

    socket.on("pause", (time, id) => {
        room.emit("pause", time, id)
    })

    socket.on("setSpeed", (speed) => {
        room.emit("setSpeed", (room.speed = speed))
    })

    socket.on("rewind", (time) => {
        room.emit("rewind", time)
    })

    console.log("a user connected")
    console.log(Object.keys(rooms).join(" "))
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(port)
})
