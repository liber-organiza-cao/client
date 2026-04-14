import { wordlist } from "@scure/bip39/wordlists/english.js";
import { secp256k1 } from '@noble/curves/secp256k1.js';
import { HDKey } from "@scure/bip32";
import * as bip39 from "@scure/bip39";
import * as sha from '@noble/hashes/sha2.js';

export function generateMnemonic(length: number = 12): string[] {
    return bip39.generateMnemonic(wordlist, (length / 3) * 32).split(" ");
}

export function mnemonicToSeed(mnemonic: string[], passphrase?: string) {
    return bip39.mnemonicToSeed(mnemonic.join(" "), passphrase);
}

export function seedToKeys(seed: Uint8Array) {
    const root = HDKey.fromMasterSeed(seed);

    return {
        privateKey: root.privateKey!,
        publicKey: root.publicKey!
    };
}

export function sign(data: Uint8Array, privateKey: Uint8Array) {
    return secp256k1.sign(data, privateKey, { prehash: false, format: "der" });
}

export function sha256(data: Uint8Array): Uint8Array {
    return sha.sha256(data);
}
