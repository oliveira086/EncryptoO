// Importações necessárias
const Crypto = require("diffie-hellman/browser");
const {
  createCipheriv,
  createDecipheriv,
  pbkdf2Sync,
} = require("browser-crypto");
const Prime = require("./Utils/primes.json");
const { Buffer } = require("safe-buffer");
const Der = require("./Utils/der");
// ======================

// Declarações de variáveis globais
const _primeNumber = Buffer.from(Prime.prime, "hex");
let _clientPublicKey;
let _clientPrivateKey;
let _iv;
// ================================

/*
  Função que inicia o diffie hellman gerando as chaves publica e privada
  @return {
    publicKeyInDerFormat: Essa função após gerar o par de chaves retorna
    a chave publica em formato DER(asn1)
  }
*/

function init() {
  const DiffieHellman = Crypto.createDiffieHellman(_primeNumber);
  let generateKeys = DiffieHellman.generateKeys();
  _clientPublicKey = DiffieHellman.getPublicKey().toString("hex").toUpperCase();
  _clientPrivateKey = DiffieHellman.getPrivateKey()
    .toString("hex")
    .toUpperCase();

  let publicKeyInDerFormat = Der.convertDiffieHellmanToDer(
    generateKeys,
    DiffieHellman.getGenerator()
  );
  return publicKeyInDerFormat.toUpperCase();
}
// ======================================================================

/*
  Função que calcula o segredo criptografico (Chave AES)
  @params {
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves
  }
  @return {
    Secret: Essa função retorna uma string hexadecimal de 32 bytes
    que sera usado como o segredo na criptografia AES
  }

*/
function computeSecret(serverPublicKey) {
  const ServerPublicKey = Der.convertDerToDiffieHellman(serverPublicKey);
  const DiffieHellman = Crypto.createDiffieHellman(_primeNumber);
  DiffieHellman.setPublicKey(Buffer.from(ServerPublicKey, "hex"));
  DiffieHellman.setPrivateKey(Buffer.from(_clientPrivateKey, "hex"));
  let secret = DiffieHellman.computeSecret(Buffer.from(ServerPublicKey, "hex"));
  _iv = secret.toString("hex");

  return secret.toString("hex").substr(0, 32).toUpperCase();
}
// ===================================================================

/*
  Função criada para gerar um initial vector randomico a cada troca
  de chaves realizada

  @params {
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves 
  }
  @return {
    O retorno dessa função e uma nova chave criptografica que sera
    utilizada com iv
  }

  ~Essa implementação poderá mudar no futuro por questões de melhorias
  de segurança na lib~

*/
function generateRandomIv(serverPublicKey) {
  return pbkdf2Sync(computeSecret(serverPublicKey), "salt", 1, 16, "sha512");
}

// ===================================================================

/*
  Função que realiza a criptografia do payload fornecido utilizando
  AES-256-CBC
  @params {
    plainText: O texto que sera criptografado
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves 
  }

  @return {
    O valor encriptado e concatenado com outros valores ambos em base64.
    São eles: plaintextEncriptado\\initialVector(iv).
  }

  ~Essa implementação poderá mudar no futuro por questões de melhorias
  na segurança da lib~

*/

function encrypt(plainText, serverPublicKey) {
  let key = Buffer.from(computeSecret(serverPublicKey));
  let iv = generateRandomIv(serverPublicKey);
  const initialEncrypt = createCipheriv("aes-256-cbc", key, iv);
  initialEncrypt.setAutoPadding(true);
  let encrypted = initialEncrypt.update(plainText, null, "base64");
  encrypted += initialEncrypt.final("base64");

  return `${encrypted}\\${iv.toString("base64")}`;
}

// ================================================================
/*
  Função que realiza a descriptografia do criptograma fornecido
  utilizando AES-256-CBC

  @params {
    plainText: O texto que sera criptografado
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves 
  }

  @return {
    O valor encriptado e concatenado com outros valores ambos em base64.
    São eles: plaintextEncriptado\\initialVector(iv).
  }
*/
function decrypt(encryptedText, serverPublicKey) {
  let textEncryptedSplit = encryptedText.split("\\");
  let key = Buffer.from(computeSecret(serverPublicKey));

  const initalDecrypt = createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(textEncryptedSplit[1], "base64")
  );
  initalDecrypt.setAutoPadding(true);
  let decrypted = initalDecrypt.update(
    textEncryptedSplit[0],
    "base64",
    "utf-8"
  );
  decrypted += initalDecrypt.final("utf-8");

  return decrypted;
}

// ================================================================
/*
  Função que realiza a comparação do texto fornecido com o texto encriptado
  utilizando AES-256-CBC

  @params {
    plainText: O texto que será comparado com o encriptado
    encryptedText: O texto encriptado
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves 
  }

  @return {
    Um boolean [True or False]
  }
*/

function compare(plainText, encryptedText, serverPublicKey) {
  let textEncryptedSplit = encryptedText.split("\\");
  let key = Buffer.from(computeSecret(serverPublicKey));

  const initalDecrypt = createDecipheriv(
    "aes-256-cbc",
    key,
    Buffer.from(textEncryptedSplit[1], "base64")
  );
  initalDecrypt.setAutoPadding(true);
  let decryptedCompare = initalDecrypt.update(
    textEncryptedSplit[0],
    "base64",
    "utf-8"
  );
  decryptedCompare += initalDecrypt.final("utf-8");

  if (plainText == decryptedCompare) {
    return true;
  }
  return false;
}

module.exports = {
  init,
  encrypt,
  decrypt,
  compare,
};
