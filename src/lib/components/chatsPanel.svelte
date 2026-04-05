<script lang="ts">
    import useServers from "$lib/server.svelte";

    const { currentServer } = useServers();
</script>

<aside class="flex w-60 flex-col border-r py-4 gap-4">
    <h1 class="text-center">{$currentServer?.title}</h1>
    <hr />
    <div class="flex grow flex-col text-gray-400">
        {#each $currentServer?.channels as channel}
            <button
                class="cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-800"
            >
                <span># {channel.name}</span>
            </button>
        {/each}
    </div>
</aside>
