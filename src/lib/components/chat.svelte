<script lang="ts">
    import ws, { WS, type WSMessageReceive } from "$lib/webSockets";
    import { onMount } from "svelte";

    let msgs = $state<string[]>([]);

    function onMessage(this: WS, msg: WSMessageReceive) {
        console.log(msg);
    }

    function sendMessage() {
        ws.sendToCurrentServer({
            type: "ChannelMessage",
            content: "Hello, world!",
        });
    }

    onMount(() => {
        ws.onMessage = onMessage;
    });
</script>

<div class="flex h-screen flex-col gap-2 p-4">
    <hr />
    <div class="flex w-full h-full"></div>
    <form
        class="flex items-center gap-2"
        onsubmit={(e) => {
            e.preventDefault();
        }}
    >
        <textarea
            onkeydown={(e) => {
                e.preventDefault();
                if (e.key == "Enter" && !e.shiftKey) {
                    sendMessage();
                }
            }}
            class="w-full border rounded-md border-inherit bg-inherit p-2"
            rows={2}
        ></textarea>
        <button class="cursor-pointer text-3xl">▶️</button>
    </form>
</div>
