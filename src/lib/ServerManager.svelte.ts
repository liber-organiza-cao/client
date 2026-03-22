import { writable } from "svelte/store";
import { parse } from "./utils";
import { getInfo, type GetInfoResponse } from "./api";

export const servers = writable<string[]>(parse(localStorage.getItem("servers")) ?? []);
export const currentServer = writable<string>(parse(localStorage.getItem("currentServer")) ?? "");
export const currentServerInfo = writable<GetInfoResponse | undefined>();

servers.subscribe((value) => {
    localStorage.setItem("servers", JSON.stringify(value));
});

currentServer.subscribe(async (url) => {
    localStorage.setItem("currentServer", JSON.stringify(url));
    const [ok, value] = await getInfo(url);
    if (ok) {
        currentServerInfo.set(value);
    }
});
