import { WebSocket } from "https://deno.land/std@0.80.0/ws/mod.ts";

class Chat {
    sockets: WebSocket[];

    constructor () {
        this.sockets = [];
    }
}

export { Chat };