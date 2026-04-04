import * as secp from '@noble/secp256k1';
import * as bip39 from 'bip39';

import { getCookie, setCookie } from './cookie';
import { base64ToBytes, bytesToBase64 } from './utils';
import { hmac } from '@noble/hashes/hmac.js';
import { sha256 } from '@noble/hashes/sha2.js';

import buffer from "buffer";

secp.hashes.hmacSha256 = (key, msg) => hmac(sha256, key, msg);
secp.hashes.sha256 = sha256;

(window as any).Buffer = (window as any).Buffer || buffer.Buffer;

export function generateWords(wordLength: number): string[] {
    const strength = (wordLength / 3) * 32;
    return bip39.generateMnemonic(strength).split(" ");
}

export async function login(words: string[]) {
    const wordsStr = words.join(" ");
    const seed = await bip39.mnemonicToSeedSync(wordsStr);

    const { secretKey, publicKey } = secp.keygen(seed);

    const base64PublicKey = bytesToBase64(publicKey);
    const base64SecretKey = bytesToBase64(secretKey);

    setCookie("publicKey", base64PublicKey);
    setCookie("secretKey", base64SecretKey);

    return { secretKey, publicKey }
}

export function useAuth() {
    const publicKeyBase64 = getCookie("publicKey");
    const secretKeyBase64 = getCookie("secretKey");

    if (!publicKeyBase64 || !secretKeyBase64) {
        return undefined;
    }

    const publicKey = base64ToBytes(publicKeyBase64);
    const secretKey = base64ToBytes(secretKeyBase64);

    function sign(message: Uint8Array): Uint8Array {
        return secp.sign(message, secretKey, { prehash: false, format: "compact" });
    }

    return { publicKey, secretKey, sign };
}
