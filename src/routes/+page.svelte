<script lang="ts">
    import { goto } from "$app/navigation";
    import { useAuth } from "$lib/auth";
    import Chat from "$lib/components/chat.svelte";
    import ChatsPanel from "$lib/components/chatsPanel.svelte";
    import SidePanel from "$lib/components/sidePanel.svelte";
    import { info, warn } from "$lib/log";
    import {
        currentChannel,
        currentServer,
        servers,
        type ServerData,
    } from "$lib/server.svelte";
    import socket from "$lib/socket.io.svete";
    import { io } from "socket.io-client";
    import { onMount } from "svelte";

    const auth = useAuth();

    async function onSocketConnect() {}

    async function onSocketDisconnect() {}

    async function onCurrentServerChange(current: ServerData | undefined) {
        currentChannel.set(undefined);

        const url = current?.url;

        if (!url) {
            socket.update((oldSocket) => {
                oldSocket?.disconnect();
                return null;
            });
            return;
        }

        const [ok, value] = await auth!.authWithServer(url);

        if (!ok) {
            warn("Authentication with server failed", value);
            return;
        }

        const token = value.token;

        socket.update((oldSocket) => {
            oldSocket?.disconnect();

            const socket = url ? io(url, { auth: { token } }) : null;

            socket?.on("connect", () => {
                info("OnSocketConnect");
                onSocketConnect();
            });
            socket?.on("disconnect", () => {
                info("OnSocketDisconnect");
                onSocketDisconnect();
            });

            return socket;
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
