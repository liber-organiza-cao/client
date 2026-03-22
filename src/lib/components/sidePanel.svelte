<script lang="ts">
    import { parse } from "$lib/utils";
    import ServerIcon from "./serverIcon.svelte";

    const servers = parse<string[]>(localStorage["servers"]) ?? [];
</script>

<aside class="flex flex-col w-16 gap-2 border-r p-2">
    <div class="flex flex-col h-full gap-2">
        {#each servers as item}
            <ServerIcon url={item} />
        {/each}
    </div>
    <a href="/new" class="h-12 w-12 text-center">+</a>
</aside>
