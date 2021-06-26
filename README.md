# EncryptoO 🔐

### Uma lib de criptografia - Created by André Oliveira (@oliveira086)

## Node.js (Install)

Pré requisitos:

- Node.js
- npm (Node.js package  manager)

```bash
npm install Encryptoo
```
## Utilização

### Importação
Utilizando com Es6:

```javascript
import Encryptoo from 'encryptoo';
const localPublicKey = Encryptoo.init();
```

Outro modo:

```javascript
const Encryptoo = require('encyptoo');
const localPublicKey = Encryptoo.init();
```

### Encrypt 🔒
```javascript
import Encryptoo from 'encryptoo';
const cryptogram = Encryptoo.encrypt(plainText, serverPublicKey);
```

### Decrypt 🔓
```javascript
import Encyptoo from 'encryptoo';
const plainText = Encryptoo.decrypt(textEncrypted, serverPublicKey);
```

## Notas de Atualizações
### 1.0.3 ✅
Implementação dos metódos principais de encrypt e decrypt utilizando a troca de chaves Diffie Hellman e criptografia AES.