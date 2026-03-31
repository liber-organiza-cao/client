<script lang="ts">
    import { goto } from "$app/navigation";
    import { getInfo, type GetInfoResponse } from "$lib/api";
    import useServers from "$lib/server.svelte";
    import { debounce } from "$lib/utils";

    let url = $state("");
    let serverInfo: GetInfoResponse | undefined = $state();
    let { servers } = useServers();

    async function updateInfo() {
        const [ok, value] = await getInfo(url);
        if (ok) {
            serverInfo = value;
        } else {
            serverInfo = undefined;
        }
    }

    function submit() {
        servers.update((s) => ({
            ...s,
            [url]: {
                ...serverInfo!,
                url,
            },
        }));
        goto("/");
    }

    $effect(() => {
        if (url) {
            debounce(updateInfo)();
        }
    });
</script>

<div
    class="flex flex-col w-screen h-screen items-center justify-center bg-zinc-950"
>
    <form
        class="flex flex-col items-center gap-2"
        onsubmit={(event) => {
            event.preventDefault();
            submit();
        }}
    >
        <img class="w-44 h-44" src={`${url}/icon`} alt="icon" />
        <h1 class="text-white h-6">{serverInfo?.title}</h1>
        <input
            bind:value={url}
            class="text-white p-2 rounded-md border-2"
            placeholder="https://example.com"
        />
        <button
            type="submit"
            disabled={serverInfo == undefined}
            class="w-full bg-zinc-900 text-white p-2 rounded-md cursor-pointer"
            >Adicionar</button
        >
    </form>
</div>
