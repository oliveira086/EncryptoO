
const Prime = require('./primes.json');
const { Buffer } = require('safe-buffer');

let oidpkcs3 = Buffer.from('06092a864886f70d010301','hex');
let onezero = Buffer.alloc(1,0);
let prime = Buffer.from(Prime.prime, 'hex');

function der ( tag, val) {
  var len = val.length;
  var enc = Buffer.alloc(4); enc[0]=tag;
  if( len < 128 ){ enc[1]=len; enc = enc.slice(0,2); }
  else if(len < 256 ){ enc[1]=0x81; enc[2]=len; enc = enc.slice(0,3); }
  else{ enc[1]=0x82; enc[2]=len>>8; enc[3]=len&0xFF; }
  return Buffer.concat([enc,val]);
}

function derpint (x) {
  return der(0x02, x[0]<128 ? x: Buffer.concat([onezero,x]));
}

function derseq (x) {
  return der(0x30, Buffer.concat(x));
}

function convertDiffieHellmanToDer (pub, g) {
  var algid = derseq([oidpkcs3, derseq([derpint(prime), derpint(g)])]);
  var spki = derseq([algid, der(0x03,Buffer.concat([ onezero, derpint(pub)]))])

  return spki.toString('hex');
}

function convertDerToDiffieHellman (publicKey) {
  let derPadding = '3082011f30819506092a864886f70d01030130818702818100b10b8f96a080e01dde92de5eae5d54ec52c99fbcfb06a3c69a6a9dca52d23b616073e28675a23d189838ef1e2ee652c013ecb4aea906112324975c3cd49b83bfaccbdd7d90c4bd7098488e9c219a73724effd6fae5644738faa31a4ff55bccc0a151af5f0dc8b4bd45bf37df365c1a65e68cfda76d4da708df1fb2bc2e4a437102010203818400028180';
  let DerToDiffiHellman = publicKey.substr(derPadding.length, publicKey.length);
  return DerToDiffiHellman;
}


module.exports = {
  convertDerToDiffieHellman,
  convertDiffieHellmanToDer
};
  