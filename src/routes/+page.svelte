<script lang="ts">
    import { goto } from "$app/navigation";
    import { useAuth } from "$lib/auth";
    import Chat from "$lib/components/chat.svelte";
    import ChatsPanel from "$lib/components/chatsPanel.svelte";
    import SidePanel from "$lib/components/sidePanel.svelte";
    import { info } from "$lib/log";
    import {
        currentChannel,
        currentServer,
        servers,
        type ServerData,
    } from "$lib/server.svelte";
    import client from "$lib/client";
    import { onMount } from "svelte";
    import { Client } from "lib-concord-client";
    import { sha256, sign } from "lib-concord-client/dist/crypto";
    import { stringToUint8Array } from "lib-concord-client/dist/utils";

    const auth = useAuth();

    async function onSocketConnect(client: Client) {
        const challengeValue = await client.requestChallenge(auth?.publicKey!);

        const hash = sha256(stringToUint8Array(challengeValue.token));
        const signature = sign(hash, auth?.privateKey!);
        const confirmValue = await client.confirmChallenge(
            challengeValue.token,
            signature,
        );

        await client.auth(confirmValue.token);
    }

    async function onSocketDisconnect() {}

    async function onCurrentServerChange(current: ServerData | undefined) {
        currentChannel.set(undefined);

        const url = current?.url;

        client.update((old: Client | null) => {
            old?.close();

            if (!url) return null;

            const client = new Client(url);

            client.onOpen = async () => {
                info("OnSocketConnect");
                onSocketConnect(client);
            };

            client.onClose = () => {
                info("OnSocketDisconnect");
                onSocketDisconnect();
            };

            return client;
        });
    }

    onMount(() => {
        if (!auth) {
            goto("/login");
        }
    });

    currentServer.subscribe(onCurrentServerChange);
</script>

<div class="w-screen h-screen bg-gray-900 text-white">
    {#if $servers.length == 0}
        <div
            class="flex flex-col items-center justify-center gap-4 w-full h-full"
        >
            <h1 class="text-2xl">Nenhum servidor adicionado</h1>
            <a
                class="bg-gray-800 p-2 rounded-md text-white cursor-pointer"
                href="/new"
            >
                Adicionar servidor
            </a>
        </div>
    {:else if $currentServer}
        <div class="grid w-full h-full grid-cols-[auto_auto_1fr_auto]">
            <SidePanel />
            <ChatsPanel />
            {#if $currentChannel}
                <Chat />
            {/if}
        </div>
    {:else}
        <div class="flex flex-row w-full h-full">
            <SidePanel />
            <div
                class="flex w-full h-full flex-col items-center justify-center gap-4"
            >
                <h1 class="text-2xl text-center">Selecione um servidor</h1>
            </div>
        </div>
    {/if}
</div>
