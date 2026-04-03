import { io, Socket } from "socket.io-client";
import useServers from "./server.svelte";
import { get, writable, type Writable } from "svelte/store";

const { currentServer } = useServers();

export interface Message {
    id: number,
    content: string,
}

interface ServerToClientEvents {
    messageReceived: (message: Message) => void,
}

interface ClientToServerEvents {
    sendMessage: (message: string) => void,
    loadMessages: (beforeId?: number, callback?: (messages: Message[]) => void) => void,
}

let ioConnection: Writable<Socket<ServerToClientEvents, ClientToServerEvents> | undefined> = writable(undefined);

currentServer.subscribe((server) => {
    get(ioConnection)?.disconnect();
    ioConnection.set(server ? io(server.url) : undefined);
})

export default ioConnection;