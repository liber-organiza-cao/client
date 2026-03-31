<script lang="ts">
    import Chat from "$lib/components/chat.svelte";
    import ChatsPanel from "$lib/components/chatsPanel.svelte";
    import SidePanel from "$lib/components/sidePanel.svelte";
</script>

<div
    class="grid w-screen grid-cols-[auto_auto_1fr_auto] border-gray-500 bg-gray-900 text-white"
>
    <SidePanel />
    <ChatsPanel />
    <Chat />
</div>
