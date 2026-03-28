import { parse } from "./utils";
import useServers from "./server.svelte";
import { get } from "svelte/store";

export type WSMessageSend = {};
export type WSMessageReceive = {
    type: "ChatMessage",
    content: string,
};

function urlToWs(url: string) {
    return url.replace(/^http/, "ws").replace(/^https/, "wss") + "/ws";
}

export class WS<S = WSMessageSend, R = WSMessageReceive> {
    private socket: WebSocket;
    private url: string;

    onMessage: ((this: WS<S, R>, msg: R) => any) | null = null;

    constructor(url: string) {
        const ws = new WebSocket(url);

        ws.onmessage = (ev) => {
            const data = parse<R>(ev.data);
            if (data) {
                this.onMessage?.call(this, data);
            }
        };

        ws.onclose = this.reconnect.bind(this);
        ws.onerror = this.reconnect.bind(this);

        this.url = url;
        this.socket = ws;
    }

    reconnect() {
        this.socket.close();
        this.socket = new WebSocket(this.url);
    }

    Send(data: S) {
        this.socket.send(JSON.stringify(data));
    }

    Url() {
        return this.url;
    }

}

class WSManager<S = WSMessageSend, R = WSMessageReceive> {
    connections: Record<string, WS<S, R>> = {};

    onMessage: ((this: WS<S, R>, msg: R) => any) | null = null;

    send(url: string, data: S) {
        const connection = this.connections[url];
        if (connection) {
            connection.Send(data);
        }
    }

    sendToCurrentServer(data: S) {
        const { currentServer } = useServers();
        const current = get(currentServer);

        if (!current) return;

        const url = urlToWs(current.url);

        this.send(url, data);

    }

    constructor() {
        const { servers } = useServers();

        servers.subscribe((serverMap) => {
            for (const [url, _] of Object.entries(serverMap)) {
                if (!this.connections[url]) {
                    const wsUrl = urlToWs(url);
                    this.connections[url] = new WS<S, R>(wsUrl);
                }
            }
        });
    }
}

const ws = new WSManager();

export default ws;