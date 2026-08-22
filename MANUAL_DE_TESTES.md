# 📋 Manual de Testes - Estetica (v3.1.x)

**Versão alvo:** 3.1.x (pré-release)  
**Objetivo:** validar funcionalidades reais do projeto e hardening de segurança antes de nova tag estável.

---

## Escopo real do sistema

Este manual cobre as rotas e módulos existentes:
- Autenticação (`/login`)
- Área admin (`/admin`)
- Agenda admin (`/agenda`)
- Produtos (`/produto`)
- Serviços (`/servicos`)
- Caixa (`/caixa`)
- Área cliente autenticada (`/cliente`, `/cliente/agenda`, `/cliente/infos`)

---

## Pré-requisitos

- [ ] `.env` configurado com `SESSION_SECRET` (32+ chars), `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_EMAIL`, `DATABASE_URL`
- [ ] Banco acessível
- [ ] Instalação concluída (`npm install`)
- [ ] Execução local iniciada (`npm run start:dev`)

---

## 1) Autenticação e acesso

### 1.1 Login válido
- [ ] Acessar `/login`
- [ ] Informar usuário e senha corretos
- [ ] Enviar formulário
- **Esperado:** redireciona para `/admin`

### 1.2 Login inválido
- [ ] Acessar `/login`
- [ ] Informar senha incorreta
- [ ] Enviar formulário
- **Esperado:** redireciona para `/login?fail=true` com mensagem de erro

### 1.3 Rotas protegidas sem sessão
- [ ] Limpar cookies/sessão
- [ ] Tentar acessar `/admin`, `/agenda`, `/produto`, `/servicos`, `/caixa`, `/cliente`
- **Esperado:** redirecionamento para `/login?fail=true`

### 1.4 Lock temporário por tentativas inválidas
- [ ] Fazer 5+ tentativas inválidas para o mesmo usuário/IP em até 15 minutos
- [ ] Tentar novo login imediatamente
- **Esperado:** resposta 429 com mensagem de bloqueio temporário

### 1.5 Rate limit da rota de login
- [ ] Disparar várias requisições para `/login` rapidamente
- **Esperado:** após limite, resposta de rate limiting

---

## 2) Agenda (admin)

### 2.1 Listagem
- [ ] Acessar `/agenda`
- **Esperado:** lista carregada sem erro

### 2.2 Criar agendamento válido
- [ ] Acessar `/agenda/add`
- [ ] Preencher nome, data válida, hora válida e enviar
- **Esperado:** redireciona para `/agenda` com item criado

### 2.3 Validação de data/hora
- [ ] Enviar data inválida e/ou hora fora de `HH:mm`
- **Esperado:** validação bloqueia operação

### 2.4 Editar agendamento
- [ ] Acessar `/agenda/alterar/:id`
- [ ] Alterar dados e salvar
- **Esperado:** atualização aplicada

### 2.5 Excluir agendamento (POST + CSRF)
- [ ] Excluir pela UI
- **Esperado:** exclusão concluída via POST com confirmação

### 2.6 Busca por data
- [ ] Buscar com data válida e inválida
- **Esperado:** válida retorna resultados; inválida mostra erro amigável

---

## 3) Produtos

### 3.1 Listagem
- [ ] Acessar `/produto`
- **Esperado:** lista carregada

### 3.2 Criar produto válido
- [ ] Acessar `/produto/add`
- [ ] Enviar nome, descrição, valor, vendedor, estoque, data
- **Esperado:** criado com sucesso

### 3.3 Validação
- [ ] Enviar campos obrigatórios vazios ou valor negativo
- **Esperado:** bloqueio de validação

### 3.4 Editar
- [ ] Acessar `/produto/alterar/:id`
- [ ] Alterar e salvar
- **Esperado:** atualizado

### 3.5 Excluir
- [ ] Excluir item da lista
- **Esperado:** remoção via POST com CSRF

---

## 4) Serviços

### 4.1 Listagem
- [ ] Acessar `/servicos`
- **Esperado:** lista carregada

### 4.2 Criar serviço válido
- [ ] Acessar `/servicos/add`
- [ ] Enviar dados válidos
- **Esperado:** criado com sucesso

### 4.3 Validação
- [ ] Enviar payload inválido (campos obrigatórios vazios)
- **Esperado:** bloqueio de validação

### 4.4 Editar e excluir
- [ ] Editar um serviço
- [ ] Excluir um serviço
- **Esperado:** operações concluídas sem erro

---

## 5) Caixa

### 5.1 Acesso à tela
- [ ] Acessar `/caixa`
- **Esperado:** formulário exibido

### 5.2 Fechamento com período válido
- [ ] Informar data inicial/final e enviar
- **Esperado:** cálculo exibido sem erro

### 5.3 CSRF no formulário de caixa
- [ ] Inspecionar HTML do formulário
- **Esperado:** existe `<input name="_csrf">`

---

## 6) Área cliente

### 6.1 Página inicial cliente
- [ ] Acessar `/cliente`
- **Esperado:** renderiza página de cliente (autenticado)

### 6.2 Agenda cliente (próxima semana)
- [ ] Acessar `/cliente/agenda`
- **Esperado:** lista apenas janela prevista pela regra atual

### 6.3 Agendamento cliente
- [ ] Acessar `/cliente/agenda/add`
- [ ] Criar agendamento para data permitida
- **Esperado:** agendamento concluído e refletido na agenda

### 6.4 Busca cliente
- [ ] Buscar data válida e inválida em `/cliente/search`
- **Esperado:** resultados corretos e mensagem amigável para inválida

---

## 7) Segurança (hardening)

### 7.1 CSRF
- [ ] Tentar POST sem token CSRF (ex: DevTools/fetch)
- **Esperado:** 403 com mensagem de token inválido/expirado

### 7.2 Headers de segurança
- [ ] Verificar resposta HTTP
- **Esperado:** headers de `helmet` presentes

### 7.3 Cookie de sessão
- [ ] Verificar cookie de sessão no navegador
- **Esperado:** `HttpOnly` e `SameSite=Strict` ativos (`Secure` em produção/HTTPS)

### 7.4 Delete não acessível por GET
- [ ] Tentar URL de delete via GET
- **Esperado:** não executa deleção

### 7.5 Rate limit global
- [ ] Fazer burst de requests na aplicação
- **Esperado:** aplicação limita quando ultrapassa o teto configurado

### 7.6 Inicialização segura em produção
- [ ] Rodar com `NODE_ENV=production` sem store de sessão externa
- **Esperado:** app bloqueia subida (a menos que bypass temporário esteja ativo)

---

## 8) Variáveis de ambiente

### 8.1 SESSION_SECRET ausente
- [ ] Remover `SESSION_SECRET`
- [ ] Iniciar aplicação
- **Esperado:** erro de configuração obrigatória

### 8.2 SESSION_SECRET fraco
- [ ] Usar `SESSION_SECRET` com menos de 32 caracteres
- [ ] Iniciar aplicação
- **Esperado:** erro de tamanho mínimo

### 8.3 Credenciais admin ausentes
- [ ] Remover `ADMIN_USERNAME` ou `ADMIN_PASSWORD_HASH` ou `ADMIN_EMAIL`
- [ ] Iniciar aplicação
- **Esperado:** erro informando variáveis ausentes

---

## 9) Teste de regressão rápida (go/no-go)

Executar em sequência:
- [ ] Login válido
- [ ] Criar produto
- [ ] Criar serviço
- [ ] Criar agendamento admin
- [ ] Criar agendamento cliente
- [ ] Rodar fechamento de caixa
- [ ] Excluir 1 item de cada módulo (produto/serviço/agenda)
- [ ] Repetir login inválido até bloquear

**Critério de aprovação:** nenhum erro 500 inesperado nos fluxos acima.

---

## Registro de bugs encontrados

| Data | Fluxo | Problema | Severidade | Status | Solução |
|------|------|----------|------------|--------|---------|
| | | | | | |
| | | | | | |

---

## Planilha de execução

Para execução operacional por rodada (com evidências, tempo e decisão go/no-go), use:
- `PLANILHA_EXECUCAO_TESTES.md`

---

## Assinatura do teste

**Nome:** ________________  
**Data:** ________________  
**Resultado final:** [ ] Aprovado para nova tag [ ] Reprovado  
**Observações:** ________________________________________

---

**Última atualização:** 30 de abril de 2026
