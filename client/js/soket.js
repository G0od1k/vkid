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
        let videoEl = document
            .querySelector("#video-tem")
            .content.cloneNode(true)

        videoEl.querySelector(".name").value = x.name
        videoEl.querySelector(".url").value = x.url

        playlistNode.appendChild(videoEl)
    })

    if (data.playlist[data.pos]) {
        video.src ||= data.playlist[data.pos].url
    }

    room = data
})
