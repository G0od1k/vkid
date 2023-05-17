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
