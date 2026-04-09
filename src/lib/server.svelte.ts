import { useStorage } from "./storage.svelte";

export interface Channel {
    id: number,
    name: string,
}

export interface ServerData {
    url: string,
    title: string,
    channels: Channel[],
}

export const servers = useStorage<ServerData[]>("servers", []);
export const currentServer = useStorage<ServerData | undefined>("currentServer", undefined);
export const currentChannel = useStorage<Channel | undefined>("currentChannel", undefined);