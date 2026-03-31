<script lang="ts">
    import io from "$lib/socket.io.svete";
    import { onMount } from "svelte";

    let msgs = $state<string[]>([]);
    let msgContent = $state("");
    let scrollContainer: HTMLDivElement | null = null;

    function scrollToBottom() {
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    async function sendMessage() {
        if (!msgContent.trim()) return;
        io?.emit("sendMessage", msgContent);
        msgContent = "";
    }

    async function messageReceived(content: string) {
        msgs = [...msgs, content];
        scrollToBottom();
    }

    onMount(() => {
        io?.on("messageReceived", messageReceived);
    });
</script>

<div class="flex h-screen flex-col">
    <div
        bind:this={scrollContainer}
        class="flex w-full h-full p-10 overflow-y-auto"
    >
        <div class="flex flex-col gap-4">
            {#each msgs as msg}
                <div class="bg-gray-800 p-2 rounded-md">{msg}</div>
            {/each}
        </div>
    </div>
    <hr />
    <form
        class="flex items-center gap-2 p-4"
        onsubmit={(e) => {
            e.preventDefault();
            sendMessage();
        }}
    >
        <textarea
            bind:value={msgContent}
            onkeydown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                }
            }}
            class="w-full border rounded-md border-inherit bg-inherit p-1.5"
        ></textarea>
        <button type="submit" class="cursor-pointer text-3xl">▶️</button>
    </form>
</div>
