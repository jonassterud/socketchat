// deno-lint-ignore-file

const url = new URL(window.location.href);
const ws = new WebSocket(`ws://${url.host}/ws${url.search}`);

window.onload = () => {
    const messagesElement = document.querySelector("div#messages");
    const sendButton = document.querySelector("input#send");
    const message = document.querySelector("input#message");

    ws.onmessage = (ev) => {
        const evObj = JSON.parse(ev.data);
        const element = `<p class="message"><span class="author">${evObj.author}</span>: <span class="content">${evObj.message}</span><br><span class="time">${evObj.time}</span></p>`;
        messagesElement.innerHTML += element;
    }

    ws.onopen = (_) => {
        ws.send("connected");
        sendButton.onclick = () => {
            ws.send(message.value);
        }
    }

    window.onkeydown = (e) => {
        if (e.code === "Enter")
            sendButton.click();
    }
}