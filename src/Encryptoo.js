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
let _key;
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
  _key = secret.toString("hex").substr(0, 32).toUpperCase();
  _iv = secret.toString("hex");
}
// ===================================================================

/*
  Função criada para fazer o controle da geração de uma nova segredo
  ou utilizar o já gerado ou inserido
  @params {
    serverPublicKey: Chave publica que o servidor retorna no momento
    da troca de chaves 
  }
  @return {
    O retorno dessa função e um novo segredo ou aquele inserido em
    um momento anterior
  }
*/
function getSecret(serverPublicKey) {
  if(_key == "" || _key == undefined) {
    computeSecret(serverPublicKey);
  }
  return _key;
}
// ===============================================================

/*
  Função criada para inserir uma secredo criptográfico já existente
  A chave criptografica deve ter 32 bytes
  @params {
    secret: Segredo criptografico resultante de uma troca de chaves
  }
  @return {
    O retorno dessa função e apenas uma confirmação de sucesso ou
    problema com o tamanho da chave
  }
*/

function setSecret(secret) {
  if(secret.length == 32) {
    _key = secret;
    return true;
  }
  return false; 
}

// ================================================================

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
function generateRandomIv() {
  return pbkdf2Sync(_key, "salt", 1, 16, "sha512");
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
  let key = Buffer.from(getSecret(serverPublicKey));
  let iv = generateRandomIv();
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
  let key = Buffer.from(getSecret(serverPublicKey));

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
  Função que realiza a comparação do texto fornecido com o criptograma
  utilizando AES-256-CBC
  @params {
    plainText: O texto que sera comparado
    encryptedText: O texto encriptado como referencia
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
  let iv = Buffer.from(textEncryptedSplit[1], "base64");

  const initialEncrypt = createCipheriv("aes-256-cbc", key, iv);
  initialEncrypt.setAutoPadding(true);
  let cipherText = initialEncrypt.update(plainText, null, "base64");
  cipherText += initialEncrypt.final("base64");

  const comparedText = `${cipherText}\\${iv.toString("base64")}`;

  if (comparedText == encryptedText) {
    return true;
  }
  return false;
}

module.exports = {
  init,
  encrypt,
  decrypt,
  compare,
  setSecret,
  getSecret
};
