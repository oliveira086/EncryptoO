const EncryptoO = require("./src/Encryptoo");

module.exports = {
  init: EncryptoO.init,
  encrypt: EncryptoO.encrypt,
  decrypt: EncryptoO.decrypt,
  compare: EncryptoO.compare,
  setSecret: EncryptoO.setSecret,
  getSecret: EncryptoO.getSecret
};
