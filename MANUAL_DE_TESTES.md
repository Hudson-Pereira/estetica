# 📋 Manual de Testes - ServiceHub

**Versão:** 0.10.0  
**Data:** 28 de abril de 2026  
**Objetivo:** Guia completo para testes manuais do sistema

---

## 📑 Índice

1. [Testes de Autenticação](#autenticação)
2. [Testes de Início](#início)
3. [Testes de Clientes](#clientes)
4. [Testes de Agenda](#agenda)
5. [Testes de Produtos](#produtos)
6. [Testes de Serviços](#serviços)
7. [Testes de Caixa](#caixa)
8. [Testes de Segurança](#segurança)
9. [Testes de Variáveis de Ambiente](#variáveis-de-ambiente)
10. [Testes de Responsividade](#responsividade)

---

## 🔐 Autenticação

### Caso de Teste 1.1: Login com Credenciais Válidas
- [ ] Acesse a página `/login`
- [ ] Insira username: `admin`
- [ ] Insira password: a senha configurada
- [ ] Clique em "Entrar"
- **Esperado:** Redirecionamento para `/inicio`

### Caso de Teste 1.2: Login com Credenciais Inválidas
- [ ] Acesse `/login`
- [ ] Insira username inválido ou password errada
- [ ] Clique em "Entrar"
- **Esperado:** Mensagem de erro ou redirecionamento para login

### Caso de Teste 1.3: Acesso a Rota Protegida sem Login
- [ ] Limpe cookies (F12 → Application → Clear site data)
- [ ] Tente acessar `/produto`, `/servico`, `/agenda`, `/caixa`
- **Esperado:** Redirecionamento para `/login`

### Caso de Teste 1.4: Logout
- [ ] Esteja logado como admin
- [ ] Clique em "Sair" ou acesse rota de logout
- [ ] Tente acessar página protegida
- **Esperado:** Redirecionamento para `/login`
### Caso de Teste 1.5: Variáveis de Ambiente Ausentes
- [ ] Renomeie temporariamente `.env` para `.env.bak`
- [ ] Tente iniciar o servidor (`npm start`)
- **Esperado:** Erro indicando variáveis obrigatórias ausentes
- [ ] Restaure o arquivo `.env`

---

## 🏠 Início

### Caso de Teste 2.1: Acessar Dashboard
- [ ] Faça login como admin
- [ ] Acesse `/inicio`
- [ ] Verifique se dashboard é exibido
- **Esperado:** Página inicial com informações resumidas

### Caso de Teste 2.2: Estatísticas do Dashboard
- [ ] Acesse `/inicio`
- [ ] Verifique se há:
  - Total de clientes cadastrados
  - Total de agendamentos do dia
  - Total de produtos/serviços
  - Saldo do caixa
- **Esperado:** Dados estatísticos visíveis

### Caso de Teste 2.3: Busca Global
- [ ] Acesse `/inicio`
- [ ] Utilize campo de busca (se existir)
- [ ] Digite nome de cliente ou serviço
- **Esperado:** Resultados relevantes exibidos
---

## 👥 Clientes

### Caso de Teste 2.1: Visualizar Lista de Clientes
- [ ] Acesse `/clientes` como admin
- [ ] Verifique se lista de clientes é exibida
- [ ] Verifique se há paginação (se aplicável)
- **Esperado:** Lista com nome, email, telefone dos clientes

### Caso de Teste 2.2: Adicionar Novo Cliente
- [ ] Clique em "Adicionar Cliente" ou similar
- [ ] Preencha formulário com dados válidos:
  - Nome: "João Silva"
  - Email: "joao@email.com"
  - Telefone: "11999999999"
- [ ] Clique em "Salvar"
- **Esperado:** Cliente adicionado à lista com sucesso

### Caso de Teste 2.3: Validação de Campos Obrigatórios
- [ ] Tente adicionar cliente sem preencher campos obrigatórios
- [ ] Clique em "Salvar"
- **Esperado:** Mensagem de validação exigindo campos obrigatórios

### Caso de Teste 2.4: Editar Cliente
- [ ] Clique em "Editar" em um cliente da lista
- [ ] Altere algum dado (ex: telefone)
- [ ] Clique em "Salvar"
- **Esperado:** Dados do cliente atualizados com sucesso

### Caso de Teste 2.5: Deletar Cliente
- [ ] Clique em "Deletar" ou botão de exclusão
- [ ] Confirme a ação
- **Esperado:** Cliente removido da lista
### Caso de Teste 2.6: Busca de Clientes
- [ ] Na lista de clientes, utilize campo de busca
- [ ] Digite parte do nome ou email
- **Esperado:** Lista filtrada com resultados relevantes
---

## 📅 Agenda

### Caso de Teste 3.1: Visualizar Agenda
- [ ] Acesse `/agenda` como admin
- [ ] Verifique se calendário ou lista de agendamentos é exibida
- [ ] Verifique se aparecem agendamentos com cliente, serviço, data e hora
- **Esperado:** Agenda visível com agendamentos

### Caso de Teste 3.2: Agendar Novo Compromisso
- [ ] Clique em "Agendar" ou "Novo Agendamento"
- [ ] Preencha formulário:
  - Cliente: selecione da lista
  - Serviço/Produto: selecione
  - Data: selecione data (mínimo amanhã)
  - Hora: selecione horário
- [ ] Clique em "Confirmar"
- **Esperado:** Agendamento criado e visível na agenda

### Caso de Teste 3.3: Validação de Data Mínima
- [ ] Tente agendar para data passada ou hoje
- [ ] Clique em "Confirmar"
- **Esperado:** Mensagem de erro indicando data mínima (amanhã)

### Caso de Teste 3.4: Editar Agendamento
- [ ] Clique em "Editar" em um agendamento
- [ ] Altere data/hora
- [ ] Clique em "Salvar"
- **Esperado:** Agendamento atualizado

### Caso de Teste 3.5: Cancelar Agendamento
- [ ] Clique em "Cancelar" ou "Deletar" em um agendamento
- [ ] Confirme ação
- **Esperado:** Agendamento removido da agenda

### Caso de Teste 3.6: Portal do Cliente - Visualizar Agendamentos
- [ ] Acesse `/cliente` (como cliente, sem autenticação de admin)
- [ ] Verifique se é exibida agenda dos próximos 7 dias
- **Esperado:** Agendamentos do cliente visíveis

### Caso de Teste 3.7: Portal do Cliente - Scroll Infinito
- [ ] Acesse `/cliente` 
- [ ] Navegue para o final da página
- [ ] Verifique se mais agendamentos carregam automaticamente
- **Esperado:** Infinite scroll funcionando

### Caso de Teste 3.8: Filtro de Agenda
- [ ] Utilize campo de busca/filtro na agenda (se existir)
- [ ] Filtre por cliente, serviço ou data
- **Esperado:** Agenda exibe apenas resultados filtrados

---

## 🛍️ Produtos

### Caso de Teste 4.1: Visualizar Lista de Produtos
- [ ] Acesse `/produto` como admin
- [ ] Verifique se lista de produtos é exibida
- [ ] Verifique colunas: nome, descrição, preço, ações
- **Esperado:** Lista completa de produtos

### Caso de Teste 4.2: Adicionar Novo Produto
- [ ] Clique em "Adicionar Produto"
- [ ] Preencha formulário:
  - Nome: "Botox Premium"
  - Descrição: "Aplicação de botox"
  - Preço: "150.00"
- [ ] Clique em "Salvar"
- **Esperado:** Produto adicionado à lista

### Caso de Teste 4.3: Validação de Preço
- [ ] Tente adicionar produto com preço inválido (negativo, letras)
- [ ] Clique em "Salvar"
- **Esperado:** Mensagem de validação de preço

### Caso de Teste 4.4: Editar Produto
- [ ] Clique em "Editar" em um produto
- [ ] Altere nome ou preço
- [ ] Clique em "Salvar"
- **Esperado:** Produto atualizado

### Caso de Teste 4.5: Deletar Produto
- [ ] Clique em "Deletar" em um produto
- [ ] Confirme ação
- **Esperado:** Produto removido da lista

### Caso de Teste 4.6: Busca de Produtos
- [ ] Utilize campo de busca na lista de produtos
- [ ] Digite parte do nome ou descrição
- **Esperado:** Lista filtrada com produtos relevantes

---

## ✂️ Serviços

### Caso de Teste 5.1: Visualizar Lista de Serviços
- [ ] Acesse `/servico` como admin
- [ ] Verifique se lista de serviços é exibida
- [ ] Verifique colunas: nome, descrição, duração, preço, ações
- **Esperado:** Lista completa de serviços

### Caso de Teste 5.2: Adicionar Novo Serviço
- [ ] Clique em "Adicionar Serviço"
- [ ] Preencha formulário:
  - Nome: "Limpeza de Pele"
  - Descrição: "Limpeza profunda da pele"
  - Duração: "60" (minutos)
  - Preço: "85.00"
- [ ] Clique em "Salvar"
- **Esperado:** Serviço adicionado à lista

### Caso de Teste 5.3: Validação de Duração
- [ ] Tente adicionar serviço com duração negativa ou inválida
- [ ] Clique em "Salvar"
- **Esperado:** Mensagem de validação

### Caso de Teste 5.4: Editar Serviço
- [ ] Clique em "Editar" em um serviço
- [ ] Altere dados
- [ ] Clique em "Salvar"
- **Esperado:** Serviço atualizado

### Caso de Teste 5.5: Deletar Serviço
- [ ] Clique em "Deletar" em um serviço
- [ ] Confirme ação
- **Esperado:** Serviço removido da lista

---

## 💰 Caixa

### Caso de Teste 6.1: Visualizar Caixa
- [ ] Acesse `/caixa` como admin
- [ ] Verifique se são exibidas:
  - Saldo total
  - Entradas do dia
  - Saídas do dia
  - Histórico de movimentações
- **Esperado:** Dashboard de caixa visível

### Caso de Teste 6.2: Registrar Entrada
- [ ] Clique em "Adicionar Entrada" ou similar
- [ ] Preencha:
  - Descrição: "Venda de serviço"
  - Valor: "150.00"
- [ ] Clique em "Confirmar"
- **Esperado:** Entrada registrada e saldo atualizado

### Caso de Teste 6.3: Registrar Saída
- [ ] Clique em "Adicionar Saída"
- [ ] Preencha:
  - Descrição: "Pagamento fornecedor"
  - Valor: "50.00"
- [ ] Clique em "Confirmar"
- **Esperado:** Saída registrada e saldo decrementado

### Caso de Teste 6.4: Fechamento de Caixa
- [ ] Acesse rota de fechamento (se existir)
- [ ] Verifique relatório do dia
- [ ] Clique em "Fechar Caixa"
- **Esperado:** Caixa fechado e novo dia iniciado

---

## 🔒 Segurança

### Caso de Teste 7.1: CSRF Protection
- [ ] Abra Developer Tools (F12)
- [ ] Acesse formulário de adicionar/editar produto
- [ ] Verifique se há token CSRF no HTML (input hidden com `_csrf`)
- [ ] Submeta formulário normalmente
- **Esperado:** Formulário enviado com sucesso (CSRF token válido)

### Caso de Teste 7.2: Tentativa de Bypass CSRF (Sem Token)
- [ ] Abra Developer Tools (F12) → Console
- [ ] Tente fazer requisição POST sem incluir CSRF token:
  ```javascript
  fetch('/produto', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({nome: 'Produto', descricao: 'Teste'})
  })
  ```
- **Esperado:** Erro de CSRF token inválido

### Caso de Teste 7.3: Validação de Input
- [ ] Tente adicionar produto com valores maliciosos:
  - Nome: `<script>alert('XSS')</script>`
  - Preço: `999999999999999`
- [ ] Clique em "Salvar"
- **Esperado:** Input sanitizado, sem execução de script

### Caso de Teste 7.4: Headers de Segurança (Helmet)
- [ ] Abra DevTools → Network
- [ ] Acesse qualquer página
- [ ] Verifique headers da resposta:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `Strict-Transport-Security` (em produção)
- **Esperado:** Headers de segurança presentes

### Caso de Teste 7.5: Session Security
- [ ] Faça login
- [ ] Verifique cookie de sessão (DevTools → Application → Cookies)
- [ ] Verifique flags:
  - `HttpOnly` ✓ (não acessível via JavaScript)
  - `Secure` (em HTTPS/produção)
  - `SameSite=Strict`
- **Esperado:** Cookies seguros configurados

### Caso de Teste 7.6: Tentativa de Acesso Direto a Rotas de DELETE
- [ ] Tente acessar diretamente via GET:
  ```
  GET /produto/delete/1
  ```
- **Esperado:** Erro ou redirecionamento (DELETE requer POST + CSRF)

### Caso de Teste 7.7: Página de Erro Genérica
- [ ] Force um erro (acesse rota inexistente ou invalide sessão)
- [ ] Verifique se página de erro genérica é exibida
- **Esperado:** Página error.ejs renderizada sem detalhes técnicos

---

## ⚙️ Variáveis de Ambiente

### Caso de Teste 9.1: SESSION_SECRET Obrigatório
- [ ] Edite `.env` e remova/comente `SESSION_SECRET`
- [ ] Tente iniciar o servidor
- **Esperado:** Erro indicando SESSION_SECRET obrigatória

### Caso de Teste 9.2: ADMIN_USERNAME Obrigatório
- [ ] Edite `.env` e remova/comente `ADMIN_USERNAME`
- [ ] Tente iniciar o servidor
- **Esperado:** Erro indicando ADMIN_USERNAME obrigatório

### Caso de Teste 9.3: ADMIN_PASSWORD_HASH Obrigatório
- [ ] Edite `.env` e remova/comente `ADMIN_PASSWORD_HASH`
- [ ] Tente iniciar o servidor
- **Esperado:** Erro indicando ADMIN_PASSWORD_HASH obrigatório

### Caso de Teste 9.4: Conexão com Banco de Dados
- [ ] Inicie o servidor com `.env` correto
- [ ] Verifique nos logs se conexão com MongoDB foi estabelecida
- **Esperado:** Conexão bem-sucedida com banco de dados

### Caso de Teste 9.5: Prisma Client Singleton
- [ ] Faça login e navegue por várias páginas
- [ ] Verifique nos logs se há múltiplas conexões Prisma
- **Esperado:** Uma única instância de PrismaClient reutilizada

---

## 📱 Responsividade

### Caso de Teste 8.1: Desktop (1920x1080)
- [ ] Redimensione navegador para desktop
- [ ] Navegue por todas as páginas
- [ ] Verifique layout, botões, formulários
- **Esperado:** Layout correto, sem scrollbar horizontal

### Caso de Teste 8.2: Tablet (768x1024)
- [ ] Abra DevTools → Toggle Device Toolbar
- [ ] Selecione iPad/tablet
- [ ] Navegue por todas as páginas
- **Esperado:** Menu responsivo, cards em grid, tudo acessível

### Caso de Teste 8.3: Mobile (375x667)
- [ ] Selecione iPhone X (ou similar)
- [ ] Navegue por todas as páginas
- [ ] Teste scroll, botões, formulários
- **Esperado:** Menu hambúrguer, layout single-column, tudo acessível

### Caso de Teste 8.4: Carousel/Slider (se existir)
- [ ] Acesse página com carousel
- [ ] Teste setas de navegação
- [ ] Teste responsividade em mobile
- **Esperado:** Carousel funciona em todos os tamanhos

---

## 🧪 Testes de Fluxo Completo

### Fluxo 1: Novo Agendamento Completo
1. [ ] Fazer login como admin
2. [ ] Adicionar novo cliente (se não existir)
3. [ ] Agendar serviço/produto para cliente
4. [ ] Visualizar na agenda
5. [ ] Fazer logout
6. [ ] Acessar portal do cliente e visualizar agendamento
- **Esperado:** Fluxo completo sem erros

### Fluxo 2: Gestão de Produtos
1. [ ] Fazer login
2. [ ] Adicionar novo produto
3. [ ] Editar produto
4. [ ] Usar produto em agendamento
5. [ ] Deletar produto (se permitido)
6. [ ] Verificar se foi removido
- **Esperado:** Produto gerenciado corretamente

### Fluxo 3: Caixa Diário
1. [ ] Fazer login
2. [ ] Registrar venda (entrada)
3. [ ] Registrar despesa (saída)
4. [ ] Visualizar saldo
5. [ ] Gerar relatório do dia
6. [ ] Fechar caixa
- **Esperado:** Caixa reconciliado corretamente

---

## 📝 Checklist Final

### Funcionalidades
- [ ] Autenticação funciona
- [ ] Clientes gerenciados corretamente
- [ ] Agenda visível e atualizável
- [ ] Produtos gerenciados
- [ ] Serviços gerenciados
- [ ] Caixa registra movimentações
- [ ] Portal do cliente acessível

### Segurança
- [ ] CSRF tokens presentes em formulários
- [ ] Inputs validados e sanitizados
- [ ] Headers de segurança (Helmet) ativados
- [ ] Cookies seguros (HttpOnly, SameSite)
- [ ] DELETE requer POST + CSRF
- [ ] Rotas protegidas exigem autenticação

### Responsividade
- [ ] Desktop: layout correto
- [ ] Tablet: responsivo
- [ ] Mobile: funcional

### Performance
- [ ] Páginas carregam rapidamente
- [ ] Sem erros no console (F12)
- [ ] Infinite scroll suave
- [ ] Sem memory leaks

---

## 🐛 Relatório de Bugs Encontrados

| Data | Funcionalidade | Problema | Status | Solução |
|------|----------------|----------|--------|---------|
| | | | | |
| | | | | |

---

## ✅ Assinatura do Testador

**Nome:** ________________  
**Data:** ________________  
**Resultado:** [ ] Aprovado [ ] Reprovado  
**Observações:** ________________________________________

---

**Última atualização:** 28 de abril de 2026 (v0.10.0)
