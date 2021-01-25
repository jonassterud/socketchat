class Message {
    author: string;
    message: string;
    color: string;
    time: string;

    constructor (author: string, message: string, color: string) {
        this.author = author;
        this.message = message;
        this.color = color;
        this.time = new Date().toTimeString().slice(0, 8);
    }
}

export { Message };