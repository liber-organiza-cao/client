import { io, Socket } from "socket.io-client";
import useServers from "./server.svelte";
import { get, writable, type Writable } from "svelte/store";

const { currentServer } = useServers();

interface ServerToClientEvents {
    updateMessages: (messages: string[]) => void,
    messageReceived: (message: string) => void,
}

interface ClientToServerEvents {
    sendMessage: (message: string) => void,
}

let ioConnection: Writable<Socket<ServerToClientEvents, ClientToServerEvents> | undefined> = writable(undefined);

currentServer.subscribe((server) => {
    get(ioConnection)?.disconnect();
    ioConnection.set(server ? io(server.url) : undefined);
})

export default ioConnection;