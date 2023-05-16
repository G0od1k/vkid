let socket = io()

socket.on("data", (data) => {
    let input = document.querySelector("#room > input")
    input.placeholder = data.code
    input.value = ""

    room = data
})
