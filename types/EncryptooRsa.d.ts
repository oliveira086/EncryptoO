export function generateRSAKeyPair(primeLentgh: number): string;
export function encryptPlainText(plainText: string, serverPublicKey: string): string;
export function decryptCipher(encryptedText: string, serverPublicKey: string): string;