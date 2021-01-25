// Standard
import { serve } from "https://deno.land/std@0.80.0/http/server.ts";
import { acceptWebSocket, acceptable, WebSocket, isWebSocketCloseEvent } from "https://deno.land/std@0.80.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.83.0/uuid/mod.ts";

// Local
import { Message } from "./ts/message.ts";
import { Chat } from "./ts/chat.ts";

// Initiate server
const chats = new Map<string, Chat>();
const server = serve({ port: 3000 });
console.log("http://localhost:3000/");

// Connect event
for await (const req of server) {
    if (req.url === "/") {
        req.respond({
            status: 200,
            body: await Deno.open("./public/index/index.html")
        });
    }
    else if (new RegExp("^\\/chat.html\\?name=.{1,25}&code=.{4}$", "m").test(req.url)) {
        req.respond({
            status: 200,
            body: await Deno.open("./public/chat/chat.html")
        });
    }
    else if (req.url.includes(".js")) {
        req.respond({
            status: 200,
            body: await Deno.open("./public" + req.url),
            headers: new Headers({ "Content-Type": "application/javascript" })
        });
    }
    else if (req.url.includes(".css")) {
        req.respond({
            status: 200,
            body: await Deno.open("./public" + req.url),
            headers: new Headers({ "Content-Type": "text/css" })
        });
    }
    else if (new RegExp("^\\/ws\\?name=.{1,25}&code=.{4}$", "m").test(req.url) && acceptable(req)) {
        const params = new URLSearchParams(req.url.slice(req.url.indexOf("?") + 1));
        const name = params.get("name");
        const code = params.get("code");
        if (!name || !code) {
            await req.respond({ status: 400 });
            break;
        }

        acceptWebSocket({
            conn: req.conn,
            bufReader: req.r,
            bufWriter: req.w,
            headers: req.headers
        }).then(async (ws: WebSocket) => {
            const uid = v4.generate();

            if (!chats.has(code))
                chats.set(code, new Chat());
            chats.get(code)?.sockets.set(uid, ws);
            chats.get(code)?.broadcast(new Message(name, "connected"));

            for await (const ev of ws) {
                if (typeof ev === "string") { // Broadcast message to everyone
                    chats.get(code)?.broadcast(new Message(name, ev));
                }
                else if (isWebSocketCloseEvent(ev)) {
                    chats.get(code)?.sockets.delete(uid);
                    chats.get(code)?.broadcast(new Message(name, "disconnected"));
                }
            }
        });
    }
}