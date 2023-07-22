let room

document.querySelector(`#room`).addEventListener("submit", (e) => {
    e.preventDefault()
    socket.emit("join", e.target.querySelector("input").value.toUpperCase())
})

socket.emit(
    "join",
    new URLSearchParams(window.location.search).get("room")?.toUpperCase()
)

document.querySelector("#room > footer > .copy").onclick = () => {
    navigator.clipboard.writeText(
        new URL("?room=" + room.code, window.location.href).href
    )
}
