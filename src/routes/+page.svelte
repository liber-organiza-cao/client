<script lang="ts">
    import { goto } from "$app/navigation";
    import { useAuth } from "$lib/auth";
    import Chat from "$lib/components/chat.svelte";
    import ChatsPanel from "$lib/components/chatsPanel.svelte";
    import SidePanel from "$lib/components/sidePanel.svelte";
    import useServers from "$lib/server.svelte";
    import { onMount } from "svelte";

    const { servers } = useServers();

    onMount(() => {
        const auth = useAuth();
        if (!auth) {
            goto("/login");
        }
    });
</script>

<div
    class="grid w-screen grid-cols-[auto_auto_1fr_auto] border-gray-500 bg-gray-900 text-white"
>
    {#if $servers.length == 0}
        <div
            class="flex flex-col items-center justify-center gap-4 w-screen h-screen"
        >
            <h1 class="text-2xl">Nenhum servidor adicionado</h1>
            <a
                href="/new"
                class="bg-gray-800 p-2 rounded-md text-white cursor-pointer"
                >Adicionar servidor</a
            >
        </div>
    {:else}
        <SidePanel />
        <ChatsPanel />
        <Chat />
    {/if}
</div>
