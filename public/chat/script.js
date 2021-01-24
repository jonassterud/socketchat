// deno-lint-ignore-file

const url = new URL(window.location.href);
const ws = new WebSocket(`ws://${url.host}/ws${url.search}`);

ws.onopen = (_) => {
    ws.send("connected");
}

window.onload = () => {
    const messages = document.querySelector("div#messages");

    ws.onmessage = (ev) => {
        const evObj = JSON.parse(ev.data);
        const element = `<p class="message"><span class="author">${evObj.author}</span>: <span class="content">${evObj.message}</span><br><span class="time">${evObj.time}</span></p>`;
        messages.innerHTML += element;
    }
}