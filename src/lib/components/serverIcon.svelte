<script lang="ts">
    import { type GetInfoResponse } from "../api";
    import useServers from "$lib/server.svelte";

    const { url, data }: { url: string; data: GetInfoResponse } = $props();
    let { currentServer } = useServers();

    async function onClick() {
        currentServer.set({ url, data });
    }
</script>

<button
    onclick={onClick}
    class="relative flex flex-col items-center justify-center group cursor-pointer"
>
    <img src={`${url}/icon`} alt="icon" class="h-12 w-12" />
    <div
        class="absolute bg-slate-700 w-20 rounded-md items-center justify-center flex left-full ml-2 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
    >
        <p>{data.title}</p>
    </div>
</button>
