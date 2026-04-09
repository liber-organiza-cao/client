<script lang="ts">
    import { goto } from "$app/navigation";
    import { getInfo, type GetInfoResponse } from "$lib/api";
    import { servers } from "$lib/server.svelte";
    import { debounce } from "$lib/utils";

    let url = $state("");
    let serverInfo: GetInfoResponse | undefined = $state();

    async function updateInfo() {
        const [ok, value] = await getInfo(url);
        if (ok) {
            serverInfo = value;
        } else {
            serverInfo = undefined;
        }
    }

    function submit() {
        servers.update((s) => [
            ...s,
            {
                ...serverInfo!,
                url,
            },
        ]);
        goto("/");
    }

    $effect(() => {
        if (url) {
            debounce(updateInfo)();
        }
    });
</script>

<div
    class="flex flex-col w-screen h-screen items-center justify-center bg-gray-900"
>
    <form
        class="flex flex-col items-center gap-2"
        onsubmit={(event) => {
            event.preventDefault();
            submit();
        }}
    >
        {#if serverInfo}
            <img class="w-44 h-44" src={`${url}/icon`} alt="icon" />
        {/if}
        <h1 class="text-white h-6">{serverInfo?.title}</h1>
        <input
            bind:value={url}
            class="text-white p-2 rounded-md border-2 border-gray-700 bg-gray-800"
            placeholder="https://example.com"
        />
        <button
            type="submit"
            disabled={serverInfo == undefined}
            class="w-full bg-gray-800 text-white p-2 rounded-md cursor-pointer"
            >Adicionar</button
        >
    </form>
</div>
