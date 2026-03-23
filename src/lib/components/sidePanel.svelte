<script lang="ts">
    import useServers from "$lib/server.svelte";
    import ServerIcon from "./serverIcon.svelte";

    const { servers } = useServers();
</script>

<aside class="flex flex-col w-16 gap-2 border-r p-2">
    <div class="flex flex-col h-full gap-2">
        {#each Object.entries($servers) as [url, data]}
            <ServerIcon {url} {data} />
        {/each}
    </div>
    <a href="/new" class="h-12 w-12 text-center">+</a>
</aside>
