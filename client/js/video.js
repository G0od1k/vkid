const video = document.querySelector(`video`),
    audio = document.querySelector(`audio`),
    vtt = document.querySelector(`track`),
    playButton = document.querySelector(`#play`),
    range = document.querySelector(`#range`),
    videoBox = document.querySelector(`#videoBox`),
    speed = document.querySelector(`#speed`),
    volume = document.querySelector(`#volume`)

function videoIsPlaying() {
    return !!(
        video.currentTime > 0 &&
        !video.paused &&
        !video.ended &&
        video.readyState > 2
    )
}

let prevPlayTime = 0

video.onplay = (e) => {
    if (e.timeStamp - prevPlayTime > 100) {
        socket.emit("play", video.currentTime, socket.id)
    }
    prevPlayTime = e.timeStamp
}

video.onpause = () => {
    socket.emit("pause", video.currentTime, socket.id)
}

playButton.onclick = () => {
    videoIsPlaying() ? video.pause() : video.play()
}

document.querySelector(`#fullscreen`).onclick = () => {
    if (document.fullscreenElement) {
        document.exitFullscreen()
    } else {
        videoBox.requestFullscreen()
    }
}

let onFullscreenTimeoutIds = []

video.onclick = (e) => {
    if (e.detail == 1) {
        onFullscreenTimeoutIds.push(
            setTimeout(() => {
                play.click()
            }, 200)
        )
    } else {
        document.querySelector(`#fullscreen`).click()
        onFullscreenTimeoutIds.forEach((x) => clearTimeout(x))
        onFullscreenTimeoutIds = []
    }
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

    document.querySelector("#subtitles").innerHTML =
        vtt.track.activeCues?.[0]?.text ?? ""
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

volume.oninput = (e) => setVolume(e.target.valueAsNumber)

volume.onwheel = (e) =>
    setVolume(
        Math.max(
            Math.min(
                video.volume + Math.sign(-e.deltaY) * volume.step,
                volume.max
            ),
            volume.min
        )
    )

function setVolume(value = 1) {
    volume.value = audio.volume = video.volume = value
    volume.setAttribute("displayValue", Math.round(value * 100) + "%")
}

vtt.track.mode = "hidden"

speed.onwheel = (e) => {
    let step = e.shiftKey ? 0.0625 : 0.25

    socket.emit(
        "setSpeed",
        Math.max(Math.min(speed.value + Math.sign(-e.deltaY) * step, 16), step)
    )
}

speed.onclick = () => {
    socket.emit("setSpeed", 1)
}
