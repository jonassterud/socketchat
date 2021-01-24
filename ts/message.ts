class Message {
    author: string;
    message: string;
    time: string;

    constructor (author: string, message: string) {
        this.author = author;
        this.message = message;
        this.time = new Date().toTimeString();
    }
}

export { Message };