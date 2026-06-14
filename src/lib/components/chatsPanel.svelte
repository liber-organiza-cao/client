<script lang="ts">
    import { currentChannel, currentServer } from "$lib/server.svelte";
    import client from "$lib/client";
    import { get } from "svelte/store";
    import type { Channel } from "lib-concord-client";

    const { channelList }: { channelList: Channel[] } = $props();

    async function selectChannel(channel: Channel) {
        const clientInstance = get(client);
        if (!clientInstance) return;

        const current = await clientInstance.joinChannel(channel.id);

        currentChannel.set(current);
    }
</script>

<aside class="flex w-60 flex-col border-r">
    <div class="flex flex-col p-4 gap-2 justify-center items-center">
        <h1 class="text-center">{$currentServer?.title}</h1>
        <h3 class="text-center text-sm">{$currentChannel?.name}</h3>
    </div>
    <hr />
    <div class="flex grow flex-col text-gray-400 gap-2 p-2">
        {#each channelList as channel}
            <button
                onclick={() => selectChannel(channel)}
                class={`cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-800 ${$currentChannel?.id === channel.id ? "bg-gray-800" : ""}`}
            >
                <span># {channel.name}</span>
            </button>
        {/each}
    </div>
</aside>
