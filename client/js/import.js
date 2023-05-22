document.querySelector(`#import`).onchange = function () {
    const fr = new FileReader()

    fr.onload = function () {
        const data = JSON.parse(fr.result)
        data.forEach((x) => {
            socket.emit("add", x.name, x.url, x.audio, x.vtt, x.img)
        })
    }

    fr.readAsText(this.files[0])
    this.value = null
}
