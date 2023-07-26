function update() {
    fetch("/rooms.json")
        .then((data) => data.json())
        .then((data) => {
            let roomsNode = document.querySelector("#rooms")

            Object.values(roomsNode.children).forEach((e) => {
                roomsNode.removeChild(e)
            })

            data.forEach((room, i) => {
                let roomNode = document
                    .querySelector("#room-tem")
                    .content.firstElementChild.cloneNode(true)

                roomNode.onclick = () =>
                    (window.location = new URL(
                        "?room=" + room.code,
                        location.origin
                    ))

                roomNode.querySelector(".code").innerText = room.code
                roomNode.querySelector(".users").innerText = Object.values(
                    room.users
                ).length

                roomsNode.appendChild(roomNode)
            })
        })
}

document.querySelector("#reload").onclick = update

update()

setInterval(update, 5000)
