<script lang="ts">
    import { error } from "$lib/log";
    import {
        currentChannel,
        currentServer,
        type Channel,
    } from "$lib/server.svelte";
    import socket from "$lib/socket.io.svete";
    import { get } from "svelte/store";

    function selectChannel(channel: Channel) {
        get(socket)?.emit("joinChannel", channel.id, (success) => {
            if (success) currentChannel.set(channel);
            else error("Failed to join channel");
        });
    }
</script>

<aside class="flex w-60 flex-col border-r">
    <div class="flex p-4 justify-center items-center">
        <h1 class="text-center">{$currentServer?.title}</h1>
    </div>
    <hr />
    <div class="flex grow flex-col text-gray-400 gap-2 p-2">
        {#each $currentServer?.channels as channel}
            <button
                onclick={() => selectChannel(channel)}
                class={`cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-800 ${$currentChannel?.id === channel.id ? "bg-gray-800" : ""}`}
            >
                <span># {channel.name}</span>
            </button>
        {/each}
    </div>
</aside>
