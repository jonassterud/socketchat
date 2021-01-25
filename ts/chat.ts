import { WebSocket } from "https://deno.land/std@0.80.0/ws/mod.ts";
import { Message } from "./message.ts";

class Chat {
    sockets: Map<string, WebSocket>;

    constructor () {
        this.sockets = new Map<string, WebSocket>();
    }

    broadcast(message: Message) {
        const messageString = JSON.stringify(message);
        this.sockets.forEach(async (socket) => {
            await socket.send(messageString);
        });
    }
}

export { Chat };