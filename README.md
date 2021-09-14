# EncryptoO 🔐

### Uma biblioteca de criptografia com troca de chaves embutida
```
Created by André Oliveira (@oliveira086)
```

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

### Compare 🤝
```javascript
import Encryptoo from 'encryptoo';
const verifySing = Encryptoo.compare(plainText, cryptogram, serverPublicKey);
```
### Set secret 🔑⬅️
```javascript
import Encryptoo from 'encryptoo';
Encryptoo.setSecret(secret);
```
O segredo deve ter 32 bytes

### Get secret 🔑➡️
```javascript
import Encryptoo from 'encryptoo';
const secret = Encryptoo.getSecret(serverPublicKey);
```

## Caracteristicas 
 - Troca de chaves Diffie Hellman
 - Criptografia AES
## Atualizações futuras

- [x] Adicionar suporte para Typescript.
- [x] Adicionar método de sign - Implementado por @fgalmeida
- [ ] Adicionar criptografia RSA.
## Notas de Atualizações

### 1.0.8 ✅
- Implementação de types e suporte para typescript
### 1.0.7 ✅
- Implementação do metodo de compare(sign) para verificar se aquele criptograma realmente foi crifrado por o sistema devido.
- Foi adicionado os metodos de inserção de um segredo criptografico e a sua visualização

### 1.0.6 ✅
Implementação dos metódos principais de encrypt e decrypt utilizando a troca de chaves Diffie Hellman e criptografia AES.