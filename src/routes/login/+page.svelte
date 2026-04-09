<script lang="ts">
    import { goto } from "$app/navigation";
    import { generateWords, login } from "$lib/auth";
    import InputWords from "$lib/components/inputWords.svelte";

    const listSize = 12;

    let words = $state<string[]>([]);

    function onWordAdd(word: string) {
        if (words.length <= listSize) {
            words = [...words, word];
        }
    }

    function onWordRemove(word: string) {
        words = words.filter((w) => w !== word);
    }

    async function onSubmit() {
        await login(words);
        goto("/");
    }
</script>

<div
    class="flex items-center justify-center w-screen h-screen bg-gray-900 text-white"
>
    <div>
        <h1 class="text-2xl font-bold mb-4 text-center">Login</h1>
        <div class="flex flex-col gap-4">
            <InputWords {onWordAdd} {onWordRemove} {listSize} {words} />
            <input
                type="button"
                value="Generate"
                onclick={() => {
                    words = generateWords(listSize);
                }}
                class="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            />
            <input
                onclick={onSubmit}
                type="button"
                value="Login"
                disabled={words.length < listSize}
                class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            />
        </div>
    </div>
</div>
