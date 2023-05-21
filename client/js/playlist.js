document.querySelector("#addVideoForm").addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit(
        "add",
        ...["Name", "Url", "Audio", "Vtt"].map(
            (x) => document.querySelector("#addVideo" + x).value
        )
    )
})
