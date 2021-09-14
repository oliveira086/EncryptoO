export function init(): string;
export function encrypt(plainText: string, serverPublicKey: string): string;
export function decrypt(encryptedText: string, serverPublicKey: string): string;
export function compare(plainText: string, encryptedText: string, serverPublicKey: string): boolean;
export function setSecret(secret: string): boolean;
export function getSecret(serverPublicKey: string): string;
