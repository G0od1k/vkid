const video = document.querySelector(`video`),
    playButton = document.querySelector(`#play`)

video.onplay = () => {
    socket.emit("play", video.currentTime)
}

video.onpause = () => {
    socket.emit("pause", video.currentTime)
}

playButton.onclick = () => {
    video.paused ? video.play() : video.pause()
}

video.ontimeupdate = function () {
    let hours = video.duration >= 3600

    function formatTime(seconds) {
        return new Date((seconds || 0) * 1000 + 82800000).toLocaleTimeString(
            undefined,
            {
                hour: hours ? "2-digit" : undefined,
                minute: "2-digit",
                second: "2-digit",
                hourCycle: "h23",
            }
        )
    }

    document.querySelector("#time").innerText = [
        video.currentTime,
        video.duration,
    ]
        .map((x) => formatTime(x))
        .join("\n")
}
