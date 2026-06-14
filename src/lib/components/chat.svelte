<script lang="ts">
    import { tick } from "svelte";
    import { get } from "svelte/store";
    import client from "$lib/client";
    import { currentChannel } from "$lib/server.svelte";
    import { type Message } from "lib-concord-client";

    let messages = $state<Message[]>([]);
    let messageContent = $state("");
    let isLoadingMessages = $state(false);
    let hasMore = $state(true);

    let scrollContainer: HTMLDivElement | null = null;
    let previousScrollHeight = 0;
    let previousScrollTop = 0;

    const beforeId = $derived<string | undefined>(messages?.[0]?.id);

    async function scrollToBottom() {
        await tick();
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    async function sendMessage() {
        if (!messageContent.trim()) return;
        const clientInstance = get(client);

        if (!clientInstance) return;

        await clientInstance.sendMessage(messageContent);

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
    }

    async function loadMessages() {
        if (isLoadingMessages || !hasMore) return;

        if (scrollContainer) {
            previousScrollHeight = scrollContainer.scrollHeight;
            previousScrollTop = scrollContainer.scrollTop;
        }

        isLoadingMessages = true;

        const clientInstance = get(client);

        if (!clientInstance) return;

        const messages = await clientInstance.loadMessages(beforeId);

        await messagesLoaded(messages);
    }

    function onScroll() {
        if (!scrollContainer) return;

        if (scrollContainer.scrollTop <= 24) {
            loadMessages();
        }
    }

    const clientInstance = get(client);

    if (clientInstance) {
        clientInstance.onMessageReceived = messageReceived;
    }

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
