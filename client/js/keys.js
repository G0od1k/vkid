document.onkeydown = (e) => {
    if (e.target.nodeName == "INPUT") return 0

    const rewindValues = {
        ArrowLeft: -5,
        ArrowRight: 5,
        KeyJ: -10,
        KeyL: 10,
        Comma: -1 / 30,
        Period: 1 / 30,
    }

    //* Fullscreen
    if (e.code == "KeyF") {
        document.querySelector(`#fullscreen`).click()
    }
    //* Subtitle
    else if (e.code == "KeyC") document.querySelector("#subtitlesBtn").click()
    //* Pause
    else if (e.code == "Space") {
        playButton.blur()
        playButton.click()
    }
    //* Rewind
    else if (rewindValues[e.code])
        socket.emit("rewind", video.currentTime + rewindValues[e.code])
    //* Mute
    else if (e.code == "KeyM") video.muted = audio.muted = !video.muted
    //* Volume
    else if (e.code == "ArrowUp" || e.code == "ArrowDown")
        volume.dispatchEvent(
            new WheelEvent("wheel", {
                deltaY: (e.code == "ArrowDown") * 2 - 1,
                shiftKey: e.shiftKey,
            })
        )
    //* Speed
    else if (e.code == "BracketLeft" || e.code == "BracketRight")
        speed.dispatchEvent(
            new WheelEvent("wheel", {
                deltaY: (e.code == "BracketLeft") * 2 - 1,
                shiftKey: e.shiftKey,
            })
        )
    //* Restore speed
    else if (e.code == "Equal") speed.click()

    e.preventDefault()
}
