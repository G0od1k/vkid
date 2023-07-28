let room
const dialog = document.querySelector("dialog")

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

dialog.addEventListener("submit", (e) => {
    let name = dialog.querySelector("input").value
    localStorage.setItem("name", name)
    socket.emit("rename", name)
})

socket.emit("rename", localStorage.getItem("name"))
