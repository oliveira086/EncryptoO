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
### Troca de chaves

O fluxo de troca de chaves deve partir do frontend para o backend. O front deve montar um objeto semelhate esse abaixo:
```javascript
  {
    clientPublicKey: Encryptoo.init()
  }
```
Após montar o objeto deverá realizar uma requisição post ao seu backend.

Após receber a requisição no backend você deve enviar sua chave publica como resposta da requisição, para o frontend.
```javascript
let serverPublicKey = Encryptoo.init();

response.status(200).json({
  serverPublicKey: serverPublicKey,
}).send();
```
Depois de receber a chave publica do frontend você decide a melhor forma de atrelar aquela chave com a sessão atual do front. Com a chave publica do frontend você já consegue encryptar e decryptar as informações fornecidas pelo front como também ele consegue decryptar as informações que o backend envia.

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

## Atualizações futuras

- [ ] Adicionar suporte para Typescript.
- [ ] Adicionar método de sign.
- [ ] Adicionar criptografia RSA.
## Notas de Atualizações
### 1.0.5 ✅
Implementação dos metódos principais de encrypt e decrypt utilizando a troca de chaves Diffie Hellman e criptografia AES.