// Standard
import { serve } from "https://deno.land/std@0.80.0/http/server.ts";
import { acceptWebSocket, acceptable, WebSocket, isWebSocketCloseEvent } from "https://deno.land/std@0.80.0/ws/mod.ts";
import { v4 } from "https://deno.land/std@0.83.0/uuid/mod.ts";

// Local
import { Message } from "./ts/message.ts";
import { Chat } from "./ts/chat.ts";

// Initiate server
const chats = new Map<string, Chat>();
const sockets = new Map<string, WebSocket>();
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
    else if (new RegExp("^\\/chat\\/chat.html\\?name=.{1,25}&code=.{4}$", "m").test(req.url)) {
        req.respond({
            status: 200,
            body: await Deno.open("./public/chat/chat.html")
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
            sockets.set(uid, ws);

            if (!chats.has(code))
                chats.set(code, new Chat());
            chats.get(code)?.sockets.push(ws);

            for await (const ev of ws) {
                if (typeof ev === "string") { // Broadcast message to everyone
                    chats.get(code)?.sockets.forEach((socket) => {
                        const message = new Message(name, ev);
                        socket.send(JSON.stringify(message));
                    });
                }
                else if (isWebSocketCloseEvent(ev)) {
                    sockets.delete(uid);
                }
            }
        });
    }
    else if (req.url.includes(".js") || req.url.includes(".css") || req.url.includes(".html")) {
        req.respond({
            status: 200,
            body: await Deno.open("./public" + req.url)
        });
    }
}