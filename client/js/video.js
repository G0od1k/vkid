const video = document.querySelector(`video`)

video.onplay = () => {
    socket.emit("play", video.currentTime)
}

video.onpause = () => {
    socket.emit("pause", video.currentTime)
}
