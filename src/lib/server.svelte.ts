import type { GetInfoResponse } from "./api";
import { useStorage } from "./storage.svelte";

export interface Server {
    url: string,
    data: GetInfoResponse
}

export default function useServers() {
    let servers = useStorage<Record<string, GetInfoResponse>>("servers", {});
    let currentServer = useStorage<Server | undefined>("currentServer", undefined);

    return {
        servers,
        currentServer
    }
}