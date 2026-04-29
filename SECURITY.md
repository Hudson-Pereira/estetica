# 🔒 Guia de Segurança - ServiceHub

## Configuração Inicial de Segurança

### 1. Variáveis de Ambiente Obrigatórias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```bash
PORT=3000
HOST=localhost
NODE_ENV=development
DATABASE_URL="mongodb+srv://seu_usuario:sua_senha@seu_cluster.mongodb.net/seu_db"
ADMIN_USERNAME="seu_usuario_admin"
ADMIN_PASSWORD_HASH="$2a$10$seu_hash_bcrypt_aqui"
ADMIN_EMAIL="admin@seu_email.com"
SESSION_SECRET="uma_chave_muito_segura_com_minimo_32_caracteres"
```

### 2. Gerar Hash Bcrypt para a Senha

Use uma dessas opções:

**Opção A - Online (bcrypt-generator.com):**
- Vá para https://bcrypt-generator.com/
- Insira sua senha
- Copie o hash gerado

**Opção B - Node.js:**
```bash
node -e "require('bcryptjs').hash('sua_senha_aqui', 10, (err, hash) => console.log(hash))"
```

**Opção C - npm package:**
```bash
npm install -g bcrypt-cli
bcrypt 'sua_senha_aqui'
```

### 3. Gerar SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Ou use um gerador UUID: https://www.uuidgenerator.net/

## ✅ Melhorias de Segurança Implementadas

### 1. **Proteção de Headers HTTP**
- ✅ Helmet.js instalado e ativo
- Protege contra: XSS, Clickjacking, MIME sniffing, etc.

### 2. **Proteção CSRF (Cross-Site Request Forgery)**
- ✅ Tokens CSRF gerados automaticamente
- ✅ Validação obrigatória em formulários
- ✅ Injeção automática em res.locals

### 3. **Validação e Sanitização de Entrada**
- ✅ Express-validator integrado
- ✅ Validações em todos os formulários
- ✅ Limites de tamanho (10MB)
- ✅ Trim automático de strings

### 4. **Autenticação Segura**
- ✅ Bcryptjs para hash de senhas
- ✅ Validação de variáveis de ambiente obrigatórias
- ✅ Sem credenciais padrão no código
- ✅ Rota `/cliente` protegida com autenticação

### 5. **Gerenciamento de Sessão**
- ✅ HttpOnly cookies (não acessível via JavaScript)
- ✅ SameSite=Strict (proteção CSRF)
- ✅ Secure flag em produção (HTTPS only)
- ✅ TTL de 1 hora configurado

### 6. **PrismaClient Singleton**
- ✅ Evita múltiplas conexões de banco de dados
- ✅ Melhor performance e confiabilidade
- ✅ Arquivo centralizado: `utils/prismaClient.js`

### 7. **Erros HTTP Apropriados**
- ✅ Status codes corretos (302 para redirect, 400 para validação, etc.)
- ✅ Mensagens de erro genéricas para usuário
- ✅ Logging detalhado para debugging

### 8. **Remoção de Métodos Inseguros**
- ✅ GET não mais usa deletar recursos
- ✅ Mudado para POST com CSRF protection
- ✅ Rotas: `/deletar/:id` agora usa POST

### 9. **Host Seguro**
- ✅ Host padrão: localhost (não 0.0.0.0)
- ✅ Configurável via variável `HOST`
- ✅ Production-ready

## 🚀 Deployment em Produção

### Antes de deployar:

1. **Configure NODE_ENV=production**
   ```bash
   NODE_ENV=production
   ```

2. **Use HTTPS**
   - Configure certificado SSL/TLS
   - Cookies terão flag `secure` automaticamente

3. **Banco de Dados Seguro**
   - Use MongoDB Atlas com autenticação forte
   - Configure IP whitelist
   - Use conexão com credenciais robustas

4. **Session Store de Produção**
   - ⚠️ MemoryStore é apenas para desenvolvimento
   - Use Redis ou MongoDB para sessões em produção
   - Instale: `npm install connect-redis redis`

5. **Variáveis de Ambiente**
   - Nunca commite `.env` no git
   - Configure no servidor/hosting (ex: Vercel, Heroku, AWS)
   - Regenere SESSION_SECRET para cada deploy

6. **Logs e Monitoramento**
   - Implemente logging estruturado (Winston, Pino)
   - Configure alertas para erros
   - Monitore tentativas de login

## 📋 Checklist de Segurança

- [ ] `.env` configurado com variáveis obrigatórias
- [ ] SESSION_SECRET gerado e forte (32+ caracteres)
- [ ] ADMIN_PASSWORD_HASH é um hash bcrypt válido
- [ ] NODE_ENV=production em produção
- [ ] HTTPS/SSL configurado em produção
- [ ] `.env` adicionado ao `.gitignore`
- [ ] Nenhuma credencial no código-fonte
- [ ] PrismaClient usando singleton
- [ ] Helmet e CSRF protection ativos
- [ ] Validação em todos os formulários
- [ ] Rota /cliente protegida
- [ ] Nenhuma rota DELETE usa método GET

## 🐛 Troubleshooting

### Erro: "SESSION_SECRET não configurada"
- Certifique-se que `.env` existe na raiz do projeto
- SESSION_SECRET está definido e não vazio

### Erro: "Variáveis de ambiente obrigatórias não configuradas"
- Verifique: ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_EMAIL
- Regenere o hash bcrypt se necessário

### Erro: "Token CSRF inválido ou expirado"
- Limpe cookies do navegador
- Recarregue a página
- Certifique-se que formulários incluem CSRF token

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentação](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [bcryptjs Docs](https://www.npmjs.com/package/bcryptjs)
- [Prisma Security](https://www.prisma.io/docs/orm/overview/security)

---

**Última atualização:** 27 de abril de 2026
