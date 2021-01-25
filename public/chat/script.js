// deno-lint-ignore-file

const url = new URL(window.location.href);
const ws = new WebSocket(`ws://${url.host}/ws${url.search}`);

window.onload = () => {
    const messagesElement = document.querySelector("div#messages");
    const sendButton = document.querySelector("input#send");
    const message = document.querySelector("input#message");

    ws.onmessage = (ev) => {
        const evObj = JSON.parse(ev.data);
        const element = `<p class="message"><span class="author" style="color:${evObj.color};">${evObj.author}</span>: <span class="content">${evObj.message}</span><br><span class="time">${evObj.time}</span></p>`;
        messagesElement.innerHTML += element;
        document.scrollingElement.scrollTop = document.scrollingElement.scrollHeight
    }

    ws.onopen = (_) => {
        sendButton.onclick = () => {
            if (message.value.length > 0) {
                ws.send(message.value);
                message.value = "";
            }
        }
    }

    window.onkeydown = (e) => {
        if (e.code === "Enter")
            sendButton.click();
    }
}