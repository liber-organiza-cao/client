import { parse } from "./utils";

export class WS<S, R> {
	private ws: WebSocket;

	onMessage?: (msg: R) => void;
	onOpen?: () => void;
	onClose?: (ev: CloseEvent) => void;
	onError?: (ev: Event) => void;

	constructor(url: string) {
		this.ws = new WebSocket(url);

		this.ws.onopen = () => {
			this.onOpen?.();
		};

		this.ws.onmessage = (raw: MessageEvent) => {
			const msg = parse<R>(raw.data);
			if (msg) {
				this.onMessage?.(msg);
			}
		};

		this.ws.onclose = (ev: CloseEvent) => {
			this.onClose?.(ev);
		};

		this.ws.onerror = (ev: Event) => {
			this.onError?.(ev);
		};
	}

	send(data: S) {
		if (this.ws.readyState === WebSocket.OPEN) {
			this.ws.send(JSON.stringify(data));
		} else {
			console.warn("WebSocket not open. Current state:", this.ws.readyState);
		}
	}

	close(code?: number, reason?: string) {
		this.ws.close(code, reason);
	}
}