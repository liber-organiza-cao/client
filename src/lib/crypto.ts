import { wordlist } from "@scure/bip39/wordlists/english.js";
import { ed25519 } from '@noble/curves/ed25519.js';
import * as bip39 from "@scure/bip39";
import * as sha from '@noble/hashes/sha2.js';

export function generateMnemonic(length: number = 12): string[] {
    return bip39.generateMnemonic(wordlist, (length / 3) * 32).split(" ");
}

export async function mnemonicToSeed(mnemonic: string[], passphrase?: string) {
    const seed = await bip39.mnemonicToSeed(mnemonic.join(" "), passphrase);
    return seed.slice(0, 32);
}

export function seedToKeys(seed: Uint8Array) {
    const { secretKey: privateKey, publicKey } = ed25519.keygen(seed);

    return {
        privateKey: privateKey!,
        publicKey: publicKey!
    };
}

export function sign(data: Uint8Array, privateKey: Uint8Array) {
    return ed25519.sign(data, privateKey, {});
}

export function sha256(data: Uint8Array): Uint8Array {
    return sha.sha256(data);
}
