let socket = io()

socket.on("data", (data) => {
    let input = document.querySelector("#room > input")
    input.placeholder = data.code
    input.value = ""

    const playlistNode = document.querySelector("#playlist")

    Object.values(playlistNode.children).forEach((e) => {
        playlistNode.removeChild(e)
    })

    data.playlist.forEach((x, i) => {
        let videoNode = document
            .querySelector("#video-tem")
            .content.cloneNode(true)

        videoNode.querySelector(".name").value = x.name
        videoNode.querySelector(".url").value = x.url

        videoNode.querySelector(".play").onclick = () => {
            socket.emit("open", i)
        }

        playlistNode.appendChild(videoNode)
    })

    if (data.playlist[data.pos]) {
        title.innerText ||= data.playlist[data.pos].name
        video.src ||= data.playlist[data.pos].url
    }

    room = data
})

socket.on("open", (pos) => {
    playButton.style.background = "url(./svg/play.svg)"
    title.innerText = room.playlist[pos].name
    video.src = room.playlist[pos].url
})

socket.on("play", (time) => {
    video.currentTime = time
    video.play()
    playButton.style.background = "url(./svg/pause.svg)"
})

socket.on("pause", (time) => {
    video.currentTime = time
    video.pause()
    playButton.style.background = "url(./svg/play.svg)"
})

socket.on("rewind", (time) => {
    if (video.paused) {
        video.currentTime = time
    } else {
        video.pause()
        video.currentTime = time
        setTimeout(() => {
            video.play()
        }, 1000)
    }
})
