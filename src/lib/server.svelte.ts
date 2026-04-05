import { useStorage } from "./storage.svelte";

export interface ServerData {
    url: string,
    title: string,
    channels: string[],
}

export default function useServers() {
    let servers = useStorage<ServerData[]>("servers", []);
    let currentServer = useStorage<ServerData | undefined>("currentServer", undefined);

    return {
        servers,
        currentServer
    }
}