<script lang="ts">
    import { currentServerInfo } from "$lib/ServerManager.svelte";
</script>

<aside class="flex w-60 flex-col border-r p-2 gap-12">
    <div class="flex w-full p-2"></div>
    <h1 class="text-center">{$currentServerInfo?.title}</h1>
    <hr />

    <div class="mt-2 flex grow flex-col text-gray-400"></div>

    <hr />
</aside>
