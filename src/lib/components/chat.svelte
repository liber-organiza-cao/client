<script lang="ts">
    import { onMount, tick } from "svelte";
    import { Client, type Message } from "lib-concord-client";

    let { client }: { client: Client } = $props();

    let messages = $state<Message[]>([]);
    let messageContent = $state("");

    let scrollContainer: HTMLDivElement | null = null;
    let isLoadingMessages = false;
    let hasMore = true;

    const beforeId = $derived<string | undefined>(messages?.[0]?.id);

    async function scrollToBottom() {
        await tick();
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }

    async function sendMessage() {
        if (!messageContent.trim()) return;

        await client.sendMessage(messageContent);

        messageContent = "";
    }

    async function messageReceived(message: Message) {
        messages = [...messages, message];
        await scrollToBottom();
    }

    async function messagesLoaded(msgs: Message[]) {
        hasMore = msgs.length > 0;

        if (scrollContainer) {
            const previousScrollHeight = scrollContainer.scrollHeight;
            const previousScrollTop = scrollContainer.scrollTop;

            messages = [...msgs, ...messages];

            await tick();

            scrollContainer.scrollTop =
                scrollContainer.scrollHeight -
                previousScrollHeight +
                previousScrollTop;
        } else {
            messages = [...msgs, ...messages];
        }
    }

    async function loadMessages() {
        if (isLoadingMessages || !hasMore) return;

        isLoadingMessages = true;

        const messages = await client.loadMessages(beforeId);

        await messagesLoaded(messages);

        isLoadingMessages = false;
    }

    function onScroll() {
        if (!scrollContainer) return;

        if (scrollContainer.scrollTop <= 24) {
            loadMessages();
        }
    }

    onMount(() => {
        client.onMessageReceived = messageReceived;

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
        class="flex items-center gap-2 p-2 h-18"
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
