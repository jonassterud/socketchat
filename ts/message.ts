class Message {
    sender: string;
    message: string;
    date: Date;

    constructor (sender: string, message: string) {
        this.sender = sender;
        this.message = message;
        this.date = new Date();
    }
}

export { Message };