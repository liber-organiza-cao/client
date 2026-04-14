import { challenge_confirm, challenge_request } from './api';
import { getCookie, setCookie } from './cookie';
import * as crypto from "./crypto";
import { err, ok } from './error';
import { warn } from './log';

export async function login(mnemonic: string[]) {
    const seed = await crypto.mnemonicToSeed(mnemonic);
    const { publicKey, privateKey } = crypto.seedToKeys(seed);

    setCookie("publicKey", publicKey.toHex());
    setCookie("privateKey", privateKey.toHex());

    return { publicKey, privateKey }
}

export function useAuth() {
    const publicKeyHex = getCookie("publicKey");
    const privateKeyHex = getCookie("privateKey");

    if (!publicKeyHex || !privateKeyHex) {
        return undefined;
    }

    const publicKey = Uint8Array.fromHex(publicKeyHex);
    const privateKey = Uint8Array.fromHex(privateKeyHex);

    function sign(data: Uint8Array): Uint8Array {
        return crypto.sign(data, privateKey);
    }

    async function authWithServer(url: string) {
        const [okay, request] = await challenge_request(url, publicKey.toHex());

        if (okay!) {
            const token = request.token;
            const hash = await crypto.sha256(new TextEncoder().encode(token));
            const signature = sign(hash).toHex();
            const [okay, confirm] = await challenge_confirm(url, token, signature);

            if (okay) {
                return ok(confirm);
            } else {
                warn("Challenge confirmation failed", confirm);
                return err(confirm);
            }
        } else {
            warn("Challenge request failed", request);
            return err(request);
        }
    }

    return { publicKey, privateKey, sign, authWithServer };
}
