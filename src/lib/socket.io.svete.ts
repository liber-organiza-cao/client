import { io, Socket } from "socket.io-client";
import useServers from "./server.svelte";
import { get, writable, type Writable } from "svelte/store";
import { useAuth } from "./auth";
import { info, warn } from "./log";

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
    requestAuthChallenge: (publicKey: number[], callback: (secret: number[]) => void) => void,
    confirmAuthChallenge: (signature: number[], callback: (valid: boolean) => void) => void,
}

let ioConnection: Writable<Socket<ServerToClientEvents, ClientToServerEvents> | undefined> = writable(undefined);

currentServer.subscribe((server) => {
    get(ioConnection)?.disconnect();
    ioConnection.set(server ? io(server.url) : undefined);
});

ioConnection.subscribe((socket) => {
    if (!socket) return;

    const auth = useAuth();

    if (!auth) {
        warn("No auth found, cannot authenticate with server");
        return;
    }

    socket.emit("requestAuthChallenge", auth.publicKey, (secret) => {
        const signature = auth.sign(secret);

        socket.emit("confirmAuthChallenge", signature, (valid) => {
            if (valid) {
                info("Authentication successful");
            } else {
                warn("Authentication failed");
            }
        });
    });
});

export default ioConnection;