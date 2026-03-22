<script lang="ts">
    import { onMount } from "svelte";
    import { getInfo, type GetInfoResponse } from "../api";
    import { push } from "./toast.svelte";
    import { currentServer } from "$lib/ServerManager.svelte";

    const { url }: { url: string } = $props();

    let info: GetInfoResponse | undefined = $state();

    async function onClick() {
        currentServer.set(url);
    }

    onMount(async () => {
        const [ok, value] = await getInfo(url);
        if (ok) {
            info = value;
        } else {
            push("Erro ao carregar dados do servidor");
        }
    });
</script>

<button
    onclick={onClick}
    class="relative flex flex-col items-center justify-center group cursor-pointer"
>
    <img src={`${url}/icon`} alt="icon" class="h-12 w-12" />
    <div
        class="absolute bg-slate-700 w-20 rounded-md items-center justify-center flex left-full ml-2 opacity-0 translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
    >
        <p>{info?.title}</p>
    </div>
</button>
