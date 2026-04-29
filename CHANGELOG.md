# Changelog - ServiceHub

Todos os mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/)
e este projeto adhere a [Semantic Versioning](https://semver.org/pt-BR/).

## [0.10.0] - 2026-04-28

### ✨ Adicionado

#### Sistema Multi-Empresa
- **Renomeação**: Sistema renomeado de "Espaço Lisa Ribeiro" para "ServiceHub"
- **Nome do Pacote**: `service-hub` (anteriormente `elisangela`)
- **Descrição**: Sistema genérico multi-empresa de gerenciamento de agendamentos

#### Segurança (herdado de 3.1.0)
- **CSRF Protection**: Tokens em todos os formulários
- **Validação de Input**: express-validator integrado
- **Headers de Segurança**: Helmet configurado
- **Cookies Seguros**: httpOnly, sameSite=strict

### ⚠️ Breaking Changes

- DELETE agora requer POST com CSRF token
- SESSION_SECRET é obrigatória
- Sistema renomeado para ServiceHub

---

## [3.1.0] - 2026-04-27

### ✨ Adicionado

#### Segurança
- **CSRF Protection**: Implementado tokens CSRF em todos os formulários
  - `csurf` middleware configurado
  - Tokens injetados automaticamente em `res.locals.csrfToken`
  - Validação obrigatória em todas as requisições POST
  
- **Validação e Sanitização**:
  - `express-validator` integrado para validação de entrada
  - Arquivo `utils/validators.js` com regras de validação centralizadas
  - Validações para: Produtos, Serviços, Agenda
  - Sanitização automática (trim, type checks, length limits)

- **Proteção de Headers HTTP**:
  - `helmet` middleware instalado e ativo
  - Proteção contra XSS, Clickjacking, MIME sniffing

- **Autenticação Segura**:
  - Validação obrigatória de variáveis de ambiente críticas
  - Sem credenciais padrão no código
  - `SESSION_SECRET` obrigatória com mínimo 32 caracteres
  - Cookies com flags `httpOnly` e `sameSite=strict`

- **PrismaClient Singleton**:
  - Arquivo `utils/prismaClient.js` para reutilizar conexão
  - Reduz overhead de múltiplas instâncias

#### Templates EJS
- Adicionado token CSRF em todos os formulários
  - `views/login.ejs`
  - `views/addProduto.ejs`, `views/alterarProduto.ejs`
  - `views/addServico.ejs`, `views/alterarServico.ejs`
  - `views/addAgenda.ejs`, `views/alterarAgenda.ejs`
  - `views/clientes/addAgenda.ejs`, `views/clientes/agenda.ejs`

- Mudança de método HTTP para deletar recursos:
  - Mudado de GET para POST
  - Adiciona segurança contra CSRF
  - Implementa confirmação com `onclick="return confirm()"`

- Correção de rota de busca:
  - `/cliente/search` → `/agenda/search` na template de agenda admin

#### Documentação
- Criado `SECURITY.md` - Guia completo de segurança e deployment
- Criado `CSRF_TOKENS.md` - Instruções para usar tokens em templates
- Criado `views/error.ejs` - Página de erro padronizada
- Criado `.env.example` atualizado com todas as variáveis

### 🔧 Alterado

#### Routers
- **produto.routes.js**:
  - Adicionado validações com `express-validator`
  - PrismaClient agora usa singleton
  - Mudado DELETE de GET para POST
  - Tratamento de erros melhorado
  - CSRF tokens adicionados a respostas

- **servico.routes.js**:
  - Adicionado validações com `express-validator`
  - PrismaClient agora usa singleton
  - Mudado DELETE de GET para POST
  - Tratamento de erros melhorado

- **agenda.routes.js**:
  - Adicionado validações com `express-validator`
  - PrismaClient agora usa singleton
  - Mudado DELETE de GET para POST
  - Tratamento de erros melhorado

- **clientes.routes.js**:
  - PrismaClient agora usa singleton

- **caixa.routes.js**:
  - PrismaClient agora usa singleton

- **inicio.routes.js**:
  - PrismaClient agora usa singleton

- **login.routes.js**:
  - CSRF tokens adicionados
  - Tratamento de erros melhorado

#### index.js (Principal)
- Adicionado `helmet` para proteção de headers
- Implementado middleware CSRF (`csurf`)
- Adicionado injeção de `csrfToken` em `res.locals`
- Validação obrigatória de `SESSION_SECRET`
- Validação de `HOST` configurável
- Cookies mais seguros:
  - `httpOnly: true`
  - `sameSite: 'strict'`
  - `secure: true` em produção
- Adicionado middleware global de tratamento de erros
- Proteção da rota `/cliente` com autenticação

#### auth.js
- Validação obrigatória de variáveis ambiente:
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD_HASH`
  - `ADMIN_EMAIL`
- Sem mais defaults expostos no código

### ⚠️ Breaking Changes

- **Deletar recursos agora requer POST com CSRF token**
  - Antes: `GET /produto/deletar/:id`
  - Agora: `POST /produto/deletar/:id` com token CSRF
  - Afeta: produto, servico, agenda
  - Requer atualização de templates (já incluída)

- **SESSION_SECRET obrigatória**
  - Aplicação não inicia sem esta variável configurada
  - Requer configuração em `.env` ou variável de ambiente

### 📦 Dependências Adicionadas

- `helmet@^7.x.x` - Headers de segurança HTTP
- `csurf@^1.11.0` - CSRF protection (deprecated, alternativa recomendada: implementar manualmente)
- `express-validator@^6.14.x` - Validação de entrada (já estava instalado, agora utilizado)

### 🐛 Corrigido

- Correção da rota de busca em agenda: `/cliente/search` → `/agenda/search`
- Removido hardcoding de credenciais padrão
- Múltiplas instâncias de PrismaClient criadas em cada requisição
- Status codes HTTP inconsistentes (200 para redirects)
- Falta de validação em formulários

### 📝 Notas

- `.env` precisa ser configurado com variáveis obrigatórias antes de rodar
- MemoryStore é apenas para desenvolvimento; use Redis em produção
- Todos os templates foram atualizados; não há incompatibilidades conhecidas
- Para gerar SESSION_SECRET:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### 🔗 Referências Internas

- Veja `SECURITY.md` para instruções completas de segurança
- Veja `CSRF_TOKENS.md` para documentação de tokens em templates
- Veja `SECURITY.md` para instruções de deployment em produção

---

## [3.0.0] - 2026-XX-XX

Base do projeto - versão anterior às melhorias de segurança

---

