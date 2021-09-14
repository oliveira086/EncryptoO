type Decrypted<T = {}> = {
	[K in keyof T]: T[K];
};

type Encrypted<T = {}> = {
	[K in keyof T]: string
};


export function init(): string;
export function encrypt(plainText: string, serverPublicKey: string): string;
export function decrypt(encryptedText: string, serverPublicKey: string): string;
export function compare(plainText: string, encryptedText: string, serverPublicKey: string): boolean;
export function setSecret(secret: string): boolean;
export function getSecret(serverPublicKey: string): string;
export function encryptBody<T>(body: Decrypted<T>): Promise<Encrypted<T>>;
export function decryptBody<T>(body: Encrypted<T>): Promise<Decrypted<T>>;
