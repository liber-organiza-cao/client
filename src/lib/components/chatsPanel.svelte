<script lang="ts">
    import useServers from "$lib/server.svelte";
    const { currentServer } = useServers();
</script>

<aside class="flex w-60 flex-col border-r p-2 gap-12">
    <div class="flex w-full p-2"></div>
    <h1 class="text-center">{$currentServer?.data.title}</h1>
    <hr />

    <div class="mt-2 flex grow flex-col text-gray-400"></div>

    <hr />
</aside>
