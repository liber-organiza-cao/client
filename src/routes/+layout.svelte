<script lang="ts">
	import "./layout.css";
	import pexe from "$lib/assets/pexe.png";
	import { streamManager } from "$lib/streamManager.svelte";
	import { onMount, tick, type Snippet } from "svelte";
	import Toast, { push } from "$lib/components/toast.svelte";
	import { goto } from "$app/navigation";
	import AudioPeer from "$lib/components/AudioPeer.svelte";

	streamManager.init();

	let { children }: { children: Snippet } = $props();

	async function getUserMedia() {
		try {
			streamManager.getUserMedia({
				video: false,
				audio: {
					noiseSuppression: true,
					echoCancellation: true,
				},
			});
		} catch (e) {
			console.error(e);
			push("Please, accept permission");
		}
	}

	onMount(() => {
		getUserMedia();
	});

	if (!sessionStorage.getItem("seed")) {
		goto("/login");
	}
</script>

<svelte:head><link rel="icon" href={pexe} /></svelte:head>

<div>
	{#key streamManager.currentChannel.id}
		{#each Object.entries(streamManager.voicePeerConnections) as [_, conn]}
			<AudioPeer stream={conn.stream} />
		{/each}
	{/key}
</div>

<Toast />

{@render children?.()}
