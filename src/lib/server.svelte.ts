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

export default function useServers() {
    let servers = useStorage<ServerData[]>("servers", []);
    let currentServer = useStorage<ServerData | undefined>("currentServer", undefined);

    return {
        servers,
        currentServer
    }
}