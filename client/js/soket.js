let socket = io()

socket.on("playlist", (data) => {
    const playlistNode = document.querySelector("#playlist")

    Object.values(playlistNode.children).forEach((e) => {
        playlistNode.removeChild(e)
    })

    data.playlist.forEach((x, i) => {
        let videoNode = document
            .querySelector("#video-tem")
            .content.firstElementChild.cloneNode(true)

        videoNode.querySelector(".name").value = x.name
        videoNode.querySelector(".url").value = x.url
        videoNode.querySelector(".audio").value = x.audio
        videoNode.querySelector(".vtt").value = x.vtt

        x.img && (videoNode.querySelector("img").src = x.img)

        videoNode.querySelector("img").onclick = () => {
            socket.emit("open", i)
        }

        videoNode.querySelector(".play").onclick = () => {
            socket.emit("open", i)
        }

        videoNode.querySelector(".cross").onclick = () => {
            socket.emit("delete", i)
        }

        videoNode.querySelector(".arrow-up").onclick = () => {
            socket.emit("up", i)
        }

        videoNode.querySelector(".arrow-down").onclick = () => {
            socket.emit("down", i)
        }

        if (i == 0) {
            videoNode
                .querySelector(".video > div")
                .removeChild(videoNode.querySelector(".arrow-up"))
        }

        if (i == data.playlist.length - 1) {
            videoNode
                .querySelector(".video > div")
                .removeChild(videoNode.querySelector(".arrow-down"))
        }

        playlistNode.appendChild(videoNode)
    })

    let videoData = data.playlist[data.pos]

    if (videoData) {
        title.innerText ||= videoData.name
        video.src ||= videoData.url
        audio.src ||= videoData.audio
        if (!vtt.src) setVtt(videoData.vtt)
        video.poster ||= videoData.img
        setNowPlaying(data.pos)
    }

    setSpeed(data.speed)

    room = data
})

socket.on("room", (data) => {
    let input = document.querySelector("#code")
    input.placeholder = data.code
    input.value = ""

    let usersNode = document.querySelector(`#users`)

    Object.values(usersNode.children).forEach((e) => {
        usersNode.removeChild(e)
    })

    Object.values(data.users).forEach((user) => {
        let userNode = document
            .querySelector("#user-tem")
            .content.firstElementChild.cloneNode(true)

        userNode.id = "user-" + user.id

        if (socket.id == user.id) {
            userNode.classList.add("you")
            userNode.querySelector(".name").ondblclick = () =>
                dialog.showModal()
        }

        userNode.querySelector(".name").innerText =
            user.name || user.id.slice(0, 6)

        usersNode.appendChild(userNode)
    })

    room = data
})

socket.on("pingdata", (id, ping) => {
    document.querySelector(`#user-${id} > .ping`).innerHTML =
        Math.min(ping, 999) + "<small>ms</small>"
})

socket.on("open", (pos) => {
    playButton.style.background = "url(./svg/play.svg)"

    setNowPlaying((room.pos = pos))

    let videoData = room.playlist[pos]

    title.innerText = videoData.name
    video.src = videoData.url
    audio.src = videoData.audio
    setVtt(videoData.vtt)
    video.poster = videoData.img
})

socket.on("play", (time, id) => {
    setCurrentTime(time)
    if (id != socket.id) {
        video.play()
    }
    playButton.style.background = "url(./svg/pause.svg)"
})

socket.on("pause", (time, id) => {
    setCurrentTime(time)
    if (id != socket.id) {
        video.pause()
    }
    playButton.style.background = "url(./svg/play.svg)"
})

socket.on("rewind", (time) => {
    if (videoIsPlaying()) {
        video.pause()
        setCurrentTime(time)
        setTimeout(() => {
            video.play()
        }, 1000)
    } else {
        setCurrentTime(time)
    }
})

socket.on("setSpeed", setSpeed)

socket.on("ping", (callback) => callback())

function setNowPlaying(pos) {
    document.querySelector(".nowplaying")?.classList.remove("nowplaying")
    document
        .querySelector(`.video:nth-child(${pos + 1})`)
        ?.classList.add("nowplaying")
}

function setCurrentTime(time) {
    audio.currentTime = video.currentTime = time
}

function setVtt(url) {
    fetch(url)
        .then((res) => res.text())
        .then((txt) => {
            vtt.src = `data:text/plain;charset=utf-8;base64,${btoa(
                unescape(encodeURIComponent(txt))
            )}`
        })
}

function setSpeed(value) {
    speed.value = value
    speed.innerText = value + "x"
    video.playbackRate = value
    audio.playbackRate = value
}
