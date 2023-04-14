
const rsa = require("./Utils/rsa")

/**
 * 
 * @param {*} primeLentgh : number
 * @returns {Object {
 *  {Base64url String} publicKey
 *  {Base64url string} privateKey 
 * }} {"publicKey": publicKey, "privateKey": privateKey}
 */
function generateRSAKeyPair(primeLentgh){
    return rsa.generateKeyPair(primeLentgh)
  }

/**
 * 
 * @param {Base64url string} publicKey 
 * @param {base64 string} plainText 
 * @returns {base64 string} cipherText
 */
function encryptPlainText(publicKey, plainText){
return rsa.encrypt(publicKey, plainText)
}

/**
 * 
 * @param {Base64url string} privateKey 
 * @param {base64 string} cipher 
 * @returns {string} plaintext
 */
function decryptCipher(privateKey, cipher){
return rsa.decrypt(privateKey, cipher)
}

  
module.exports = {
    generateRSAKeyPair,
    encryptPlainText,
    decryptCipher
  };
  