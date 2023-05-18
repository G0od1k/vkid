const video = document.querySelector(`video`),
    playButton = document.querySelector(`#play`),
    range = document.querySelector(`#range`)

video.onplay = () => {
    socket.emit("play", video.currentTime)
}

video.onpause = () => {
    socket.emit("pause", video.currentTime)
}

playButton.onclick = () => {
    video.paused ? video.play() : video.pause()
}

range.onclick = (e) => {
    socket.emit("rewind", video.duration * (e.offsetX / range.offsetWidth))
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

    range.querySelector("#rangeTime").style.width =
        100 * (video.currentTime / video.duration) + "%"
}

video.addEventListener("progress", () => {
    const duration = video.duration
    if (duration > 0) {
        for (let i = 0; i < video.buffered.length; i++) {
            if (
                video.buffered.start(video.buffered.length - 1 - i) <
                video.currentTime
            ) {
                range.querySelector("#rangeBuff").style.width = `${
                    (video.buffered.end(video.buffered.length - 1 - i) * 100) /
                    duration
                }%`
                break
            }
        }
    }
})
