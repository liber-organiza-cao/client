import { parseErr, type Result } from "./error";

export function clamp(value: number, min: number, max: number) {
	return Math.min(Math.max(value, min), max);
}

export function debounce(callback: Function, wait = 1000) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
}

export function parse<T>(input: any): T | undefined {
	const data = String(input);
	const [ok, value] = parseErr<T, any>(JSON.parse, data);
	if (ok) {
		return value;
	} else {
		return undefined;
	}
}

export async function fetch(input: URL | Request | string, init?: RequestInit): Promise<Result<Response, any>> {
	return await parseErr<Response, any>(window.fetch, input, init);
}

export function bytesToBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

export function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	const len = binary.length;
	const bytes = new Uint8Array(len);

	for (let i = 0; i < len; i++) {
		bytes[i] = binary.charCodeAt(i);
	}

	return bytes;
}