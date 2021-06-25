const Crypto = require ('diffie-hellman/browser');
const {createCipheriv, createDecipheriv, pbkdf2Sync} = require ( 'browser-crypto');
const Prime = require ( './Utils/primes.json');
const  { Buffer } = require ( 'safe-buffer');
const Der = require ( './Utils/der');

let _clientPublicKey;
let _clientPrivateKey;

let _iv;
  
function init () {
  const DiffieHellman = Crypto.createDiffieHellman(Buffer.from(Prime.prime, 'hex'))
  let generateKeys = DiffieHellman.generateKeys();
  _clientPublicKey = DiffieHellman.getPublicKey().toString('hex').toUpperCase();
  _clientPrivateKey = DiffieHellman.getPrivateKey().toString('hex').toUpperCase();

  let publicKeyInDerFormat = Der.convertDiffieHellmanToDer(generateKeys, DiffieHellman.getGenerator())
  return publicKeyInDerFormat.toUpperCase();
}

function computeSecret (serverPublicKey) {
  const ServerPublicKey = Der.convertDerToDiffieHellman(serverPublicKey)
  const DiffieHellman = Crypto.createDiffieHellman(Buffer.from(Prime.prime, 'hex'));
  DiffieHellman.setPublicKey(Buffer.from(ServerPublicKey), 'hex');
  DiffieHellman.setPrivateKey(Buffer.from(_clientPrivateKey, 'hex'));
  let secret = DiffieHellman.computeSecret(Buffer.from(ServerPublicKey, 'hex'));
  console.log(secret.toString('hex').substr(0, 32).toUpperCase());
  _iv = secret.toString('hex');
  return secret.toString('hex').substr(0, 32).toUpperCase();
}

function generateRandomIv (serverPublicKey) {
  return pbkdf2Sync(computeSecret(serverPublicKey), 'salt', 1, 16, 'sha512')
}

function encrypt (plainText, serverPublicKey) {
  let key = Buffer.from(computeSecret(serverPublicKey));
  let iv = generateRandomIv(serverPublicKey);
  const initialEncrypt = createCipheriv('aes-256-cbc', key, iv);
  initialEncrypt.setAutoPadding(true);
  let encrypted = initialEncrypt.update(plainText, null, 'base64');
  encrypted += initialEncrypt.final('base64');

  return `${encrypted}\\${iv.toString('base64')}`;
}

function decrypt (encryptedText, serverPublicKey) {

  let textEncryptedSplit = encryptedText.split('\\');
  let key = Buffer.from(computeSecret(serverPublicKey));
    
  const initalDecrypt = createDecipheriv('aes-256-cbc', key, Buffer.from(textEncryptedSplit[1], 'base64'));
  initalDecrypt.setAutoPadding(true);
  let decrypted = initalDecrypt.update(textEncryptedSplit[0], 'base64', 'utf-8');
  decrypted += initalDecrypt.final('utf-8');

  return decrypted
}

module.exports = {
  init,
  encrypt,
  decrypt
}