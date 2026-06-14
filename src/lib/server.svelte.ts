import { writable } from "svelte/store";
import { useStorage } from "./storage.svelte";
import type { Channel } from "lib-concord-client";

export interface ServerData {
    url: string,
    title: string,
}

export const servers = useStorage<ServerData[]>("servers", []);
export const currentServer = useStorage<ServerData | undefined>("currentServer", undefined);
export const currentChannel = writable<Channel | undefined>();