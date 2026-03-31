import { io, Socket } from "socket.io-client";
import useServers from "./server.svelte";

const { currentServer } = useServers();

interface ServerToClientEvents {
    messageReceived: (message: string) => void,
}

interface ClientToServerEvents {
    sendMessage: (message: string) => void,
}

let ioConnection: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

currentServer.subscribe((server) => {
    if (server) {
        ioConnection = io(server.url);
    } else {
        ioConnection = null;
    };
})

export default ioConnection;