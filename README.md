# CryptoO 🔐

### Uma lib de criptografia - Created by André Oliveira (@oliveira086)

## Node.js (Install)

Pré requisitos:

- Node.js
- npm (Node.js package  manager)

```bash
npm install cryptoo
```
## Utilização

### Importação
Utilizando com Es6:

```javascript
import Cryptoo from 'cryptoo';
const localPublicKey = Cryptoo.init();
```

Outro modo:

```javascript
const Cryptoo = require('Cryptoo');
const localPublicKey = Cryptoo.init();
```

### Encrypt 🔒
```javascript
import Cryptoo from 'cryptoo';
const cryptogram = Cryptoo.encrypt(plainText, serverPublicKey);
```

### Decrypt 🔓
```javascript
import Cryptoo from 'cryptoo';
const plainText = Cryptoo.decrypt(textEncrypted, serverPublicKey);
```

## Notas de Atualizações
### 1.0.0 ✅
Implementação dos metódos principais de encrypt e decrypt utilizando a troca de chaves Diffie Hellman e criptografia AES.