import type { Client } from "lib-concord-client";
import { writable } from "svelte/store";

const client = writable<Client | null>(null);

export default client;