<script lang="ts">
    import io from "$lib/socket.io.svete";
    import type { Message } from "$lib/socket.io.svete";
    import { tick } from "svelte";
    import { get } from "svelte/store";

    let msgs = $state<Message[]>([]);
    let msgContent = $state("");
    let isLoadingMessages = $state(false);
    let hasMore = $state(true);

    let scrollContainer: HTMLDivElement | null = null;
    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    const beforeId = $derived<number | undefined>(msgs?.[0]?.id);

    async function scrollToBottom() {
        await tick();
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    async function sendMessage() {
        if (!msgContent.trim()) return;
        get(io)?.emit("sendMessage", msgContent);
        msgContent = "";
    }

    async function messageReceived(message: Message) {
        msgs = [...msgs, message];
        await scrollToBottom();
    }

    async function messagesLoaded(messages: Message[]) {
        hasMore = messages.length > 0;
        msgs = [...messages, ...msgs];

        await tick();

        if (scrollContainer) {
            scrollContainer.scrollTop =
                scrollContainer.scrollHeight -
                previousScrollHeight +
                previousScrollTop;
        }

        isLoadingMessages = false;
        return;
    }

    function loadMessages() {
        if (isLoadingMessages || !hasMore) return;

        if (scrollContainer) {
            previousScrollHeight = scrollContainer.scrollHeight;
            previousScrollTop = scrollContainer.scrollTop;
        }

        isLoadingMessages = true;

        get(io)?.emit("loadMessages", beforeId, messagesLoaded);
    }

    function onScroll() {
        if (!scrollContainer) return;

        if (scrollContainer.scrollTop <= 24) {
            loadMessages();
        }
    }

    io.subscribe((socket) => {
        msgs = [];
        hasMore = true;
        isLoadingMessages = false;

        if (!socket) return;

        socket.on("messageReceived", messageReceived);

        loadMessages();
    });
</script>

<div class="flex h-screen w-full flex-col">
    <div class="flex w-full h-full p-4 overflow-y-auto">
        <div
            bind:this={scrollContainer}
            onscroll={onScroll}
            class="flex w-full h-full overflow-y-auto font-mono"
        >
            <div class="flex flex-col gap-4">
                {#each msgs as msg}
                    <div class="bg-gray-800 p-2 rounded-md">{msg.content}</div>
                {/each}
            </div>
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
