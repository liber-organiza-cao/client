import { Socket } from "socket.io-client";
import { writable } from "svelte/store";

export interface Message {
    id: number,
    content: string,
}

export interface ServerToClientEvents {
    messageReceived: (message: Message) => void,
}

export interface ClientToServerEvents {
    joinChannel: (channelId: number) => void,
    sendMessage: (message: string) => void,
    loadMessages: (beforeId?: number, callback?: (messages: Message[]) => void) => void,
    requestAuthChallenge: (publicKey: number[], callback: (secret: number[]) => void) => void,
    confirmAuthChallenge: (signature: number[], callback: (valid: boolean) => void) => void,
}

export type SocketConnection = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket = writable<SocketConnection | null>(null);

export default socket;