export type EncryptedEmailData = {
	ciphertext: string;
	iv: string;
};

const VALID_AES_KEY_LENGTHS = new Set([16, 24, 32]);

function decodeBase64(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);

	for (let index = 0; index < binary.length; index += 1) {
		bytes[index] = binary.charCodeAt(index);
	}

	return bytes;
}

function encodeBase64(bytes: Uint8Array): string {
	return btoa(String.fromCharCode(...bytes));
}

function toArrayBuffer(bytes: Uint8Array): ArrayBuffer {
	return new Uint8Array(bytes).buffer;
}

async function importAesKey(base64Key: string, usages: KeyUsage[]): Promise<CryptoKey> {
	const keyBytes = decodeBase64(base64Key);

	if (!VALID_AES_KEY_LENGTHS.has(keyBytes.byteLength)) {
		throw new Error('Expected a base64-encoded AES key that is 16, 24, or 32 bytes long.');
	}

	return crypto.subtle.importKey(
		'raw',
		toArrayBuffer(keyBytes),
		{ name: 'AES-GCM' },
		false,
		usages
	);
}

export async function createEncryptedEmail(
	email: string,
	base64Key: string
): Promise<EncryptedEmailData> {
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const key = await importAesKey(base64Key, ['encrypt']);
	const encodedEmail = new TextEncoder().encode(email);

	const ciphertext = new Uint8Array(
		await crypto.subtle.encrypt({ name: 'AES-GCM', iv: toArrayBuffer(iv) }, key, encodedEmail)
	);

	return {
		ciphertext: encodeBase64(ciphertext),
		iv: encodeBase64(iv)
	};
}

export async function decryptEmail(
	encryptedData: EncryptedEmailData,
	base64Key: string
): Promise<string> {
	const key = await importAesKey(base64Key, ['decrypt']);
	const iv = toArrayBuffer(decodeBase64(encryptedData.iv));
	const ciphertext = toArrayBuffer(decodeBase64(encryptedData.ciphertext));

	const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ciphertext);
	return new TextDecoder().decode(plaintext);
}
