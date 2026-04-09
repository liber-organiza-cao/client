<script lang="ts">
    import { tick } from "svelte";
    import { get } from "svelte/store";
    import socket, { type Message } from "$lib/socket.io.svete";
    import { currentChannel } from "$lib/server.svelte";

    let messages = $state<Message[]>([]);
    let messageContent = $state("");
    let isLoadingMessages = $state(false);
    let hasMore = $state(true);

    let scrollContainer: HTMLDivElement | null = null;
    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    const beforeId = $derived<number | undefined>(messages?.[0]?.id);

    async function scrollToBottom() {
        await tick();
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    async function sendMessage() {
        if (!messageContent.trim()) return;
        get(socket)?.emit("sendMessage", messageContent);
        messageContent = "";
    }

    async function messageReceived(message: Message) {
        messages = [...messages, message];
        await scrollToBottom();
    }

    async function messagesLoaded(msgs: Message[]) {
        hasMore = msgs.length > 0;
        messages = [...msgs, ...messages];

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

        get(socket)?.emit("loadMessages", beforeId, messagesLoaded);
    }

    function onScroll() {
        if (!scrollContainer) return;

        if (scrollContainer.scrollTop <= 24) {
            loadMessages();
        }
    }

    socket.subscribe((socket) => {
        if (!socket) return;

        socket.on("messageReceived", messageReceived);
    });

    currentChannel.subscribe(() => {
        messages = [];
        hasMore = true;
        isLoadingMessages = false;

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
                {#each messages as msg}
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
            bind:value={messageContent}
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
