const CryptO = require("./src/CyptoO");

module.exports = {
  init: CryptO.init,
  encrypt: CryptO.encrypt,
  decrypt: CryptO.decrypt,
  compare: CryptO.compare,
  setSecret: CryptO.setSecret
};
