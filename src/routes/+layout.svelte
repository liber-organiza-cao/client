<script lang="ts">
	import "./layout.css";
	import pexe from "$lib/assets/pexe.png";
	import { type Snippet } from "svelte";
	import Toast from "$lib/components/toast.svelte";

	let { children }: { children: Snippet } = $props();
</script>

<svelte:head><link rel="icon" href={pexe} /></svelte:head>

<Toast />

{@render children?.()}
