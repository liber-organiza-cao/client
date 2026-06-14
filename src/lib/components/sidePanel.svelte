<script lang="ts">
    import { servers } from "$lib/server.svelte";
    import ServerIcon from "./serverIcon.svelte";

    const { onAddServerClick } = $props();
</script>

<aside class="flex flex-col w-16 gap-2 border-r p-2">
    <div class="flex flex-col h-full gap-2">
        {#each $servers as data}
            <ServerIcon {data} />
        {/each}
    </div>
    <button
        onclick={onAddServerClick}
        class="h-12 w-12 text-center cursor-pointer">+</button
    >
</aside>
