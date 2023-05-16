let room

document.querySelector(`#room`).addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("join", e.target.querySelector("input").value.toUpperCase())
})
