const EncryptoO = require("./src/Encryptoo");

module.exports = {
  init: EncryptoO.init,
  encrypt: EncryptoO.encrypt,
  encryptBody: EncryptoO.encryptBody,
  decrypt: EncryptoO.decrypt,
  decryptBody: EncryptoO.decryptBody,
  compare: EncryptoO.compare,
  setSecret: EncryptoO.setSecret,
  getSecret: EncryptoO.getSecret
};
