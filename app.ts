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
            body: await Deno.open("./public/index.html")
        });
    }
    else if (new RegExp("^\\/\\?name=.{1,25}&code=.{4}$", "m").test(req.url)) {
        req.respond({
            status: 200,
            body: await Deno.open("./public/....html")
        });
    }
    else if (new RegExp("^\\/ws\\?name=.{1,25}&code=.{4}$", "m").test(req.url) && acceptable(req)) {
        const temp = new URL("http://" + req.url);
        acceptWebSocket({
            conn: req.conn,
            bufReader: req.r,
            bufWriter: req.w,
            headers: req.headers
        }).then(async (ws: WebSocket) => {
            const uid = v4.generate();
            sockets.set(uid, ws);

            for await (const ev of ws) {
                if (isWebSocketCloseEvent(ev)) {
                    sockets.delete(uid);
                }
            }
        });
    }
    else if (req.url === "/script.js") {
        req.respond({
            status: 200,
            body: await Deno.open("./public/script.js"),
            headers: new Headers({ "Content-Type": "text/javascript" })
        });
    }
    else if (req.url === "/style.css") {
        req.respond({
            status: 200,
            body: await Deno.open("./public/style.css"),
            headers: new Headers({ "Content-Type": "text/css" })
        });
    }
}