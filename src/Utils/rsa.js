const bigintCryptoUtils = require('bigint-crypto-utils')

async function generateKeyPair(primeLentgh){

    const p = await bigintCryptoUtils.prime(primeLentgh);
    const q = await bigintCryptoUtils.prime(primeLentgh);

    const n = p*q;

    const phi = (p-1n) * (q-1n)

    const e = await bigintCryptoUtils.prime(primeLentgh);
    while(bigintCryptoUtils.gcd(e, phi) !== 1n){
        console.log(e)
        e = await bigintCryptoUtils.prime(primeLentgh)
    }

    const d = bigintCryptoUtils.modInv(e, phi)

    const publicKey = Buffer.from(`${e}:${n}`).toString('base64url')
    const privateKey = Buffer.from(`${d}:${n}`).toString('base64url')
    
    return {"publicKey": publicKey, "privateKey": privateKey}
}


async function encrypt(publicKey, plainText){
    return await _encryptPlainText(publicKey, plainText)
}

async function decrypt(privateKey, cipher){
    return await _decryptPlainText(privateKey, cipher)
}  
  
async function _encryptPlainText(publicKey, plainText){

    const decodedPublicKey = Buffer.from(publicKey, 'base64url').toString('utf8')

    const cipherStruct = decodedPublicKey.split(':')

    const e = cipherStruct[0]
    const n = cipherStruct[1]

    const plainTextBytes = Buffer.from(plainText, "utf-8")

    const plainTextInt = BigInt('0x'+ plainTextBytes.toString('hex'))

    const cipherInt = bigintCryptoUtils.modPow(plainTextInt, BigInt(e), BigInt(n))

    const encodedCipher = Buffer.from(cipherInt.toString()).toString('base64')

    return encodedCipher

}

async function _decryptPlainText(privateKey, cipherText){

    const decodedPrivateKey = Buffer.from(privateKey, 'base64url').toString('utf8')
    const cipherStruct = decodedPrivateKey.split(':')

    const d = cipherStruct[0]
    const n = cipherStruct[1]

    const cipherInt = Buffer.from(cipherText, 'base64').toString('utf-8')

    const plainTextInt = BigInt(bigintCryptoUtils.modPow(BigInt(cipherInt), BigInt(d), BigInt(n)))

    let paddedStr = BigInt(plainTextInt).toString(2)

    while(paddedStr.length % 8 !== 0){
        paddedStr = '0' + paddedStr
    }

    const bytes = paddedStr.match(/.{1,8}/g);
    const chars = bytes.map(byte => String.fromCharCode(parseInt(byte, 2))); 
    const binaryString = chars.join(''); 

    return binaryString
}
generateKeyPair(1024).then(res => {

    return res
    }).then(async res => {
        const cipher = await encrypt(res["publicKey"], "Rsa cryptography test")
        return [cipher, res];
    }).then(async (res) => {
        const cipher = res[0]
        console.log(`\n--------- CIPHER ------ \n ${cipher}\n`)
        const keyPairRes = res[1]
        return await decrypt(keyPairRes["privateKey"], cipher);
    }).then((decrypted) => {
        console.log(`\n--------- PLAINTEXT ------ \n ${decrypted}\n`)
    }).catch((error) => {
        console.error(error);
    });
        
