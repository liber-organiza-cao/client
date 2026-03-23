import { writable, type Writable } from "svelte/store";
import { parse } from "./utils";
import { get } from 'svelte/store';

export function useStorage<T>(key: string, defaultValue: T): Writable<T> {
    const eventKey = `localStorageUpdate:${key}`;
    const storeKey = `useStorage:${key}`;

    const storedValue = localStorage.getItem(storeKey);
    const initialValue = parse<T>(storedValue) ?? defaultValue;

    const value = writable(initialValue);

    value.subscribe((s) => {
        localStorage.setItem(storeKey, JSON.stringify(s));
        window.dispatchEvent(new CustomEvent(eventKey, { detail: s }));
    });

    const handleEventUpdate = (event: CustomEvent) => {
        const newState: T = event.detail;

        if (get(value) != newState) {
            value.set(newState);
        }

    };

    $effect(() => {
        window.addEventListener(eventKey, handleEventUpdate as EventListener);
        return () => {
            window.removeEventListener(eventKey, handleEventUpdate as EventListener);
        };
    });

    return value;
}