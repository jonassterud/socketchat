import { Message } from "./message.ts";

class Chat {
    messages: Message[];

    constructor () {
        this.messages = [];
    }

    send(message: Message): void {
        this.messages.push(message);
    }
}

export { Chat };