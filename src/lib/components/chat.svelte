<div class="flex h-screen flex-col gap-2 p-4">
    <hr />

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
                }
            }}
            class="w-full border rounded-md border-inherit bg-inherit p-2"
            rows={2}
        ></textarea>
        <button class="text-3xl">▶️</button>
    </form>
</div>
