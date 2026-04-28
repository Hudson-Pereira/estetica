# Instruções para Atualizar Formulários EJS com Token CSRF

## Resumo

Todos os formulários que modificam dados (POST, PUT, DELETE) agora requerem um token CSRF para proteção contra ataques.

O token é automaticamente injetado em `res.locals.csrfToken` em todas as respostas renderizadas.

## Como Usar em Seus Templates EJS

### 1. Adicionar Token em Formulários HTML

**Antes:**
```html
<form action="/produto/add" method="POST">
    <input type="text" name="nome" />
    <button type="submit">Enviar</button>
</form>
```

**Depois:**
```html
<form action="/produto/add" method="POST">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <input type="text" name="nome" />
    <button type="submit">Enviar</button>
</form>
```

### 2. Formulários que Precisam de Atualização

Os seguintes formulários EJS devem incluir o token CSRF:

**Admin (Protegidos):**
- [ ] `views/addProduto.ejs` - Adicionar produto
- [ ] `views/alterarProduto.ejs` - Alterar produto
- [ ] `views/addServico.ejs` - Adicionar serviço
- [ ] `views/alterarServico.ejs` - Alterar serviço
- [ ] `views/addAgenda.ejs` - Adicionar agendamento
- [ ] `views/alterarAgenda.ejs` - Alterar agendamento
- [ ] `views/produto.ejs` - Botão deletar
- [ ] `views/servico.ejs` - Botão deletar
- [ ] `views/agenda.ejs` - Botão deletar/alterar
- [ ] `views/login.ejs` - Login

**Cliente (Públicos):**
- [ ] `views/clientes/addAgenda.ejs` - Agendar
- [ ] `views/clientes/agenda.ejs` - Deletar/alterar agendamento

### 3. Para Botões de Delete (GET → POST)

**Antes (inseguro - GET):**
```html
<a href="/produto/deletar/<%= produto.id %>">Deletar</a>
```

**Depois (seguro - POST):**
```html
<form method="POST" action="/produto/deletar/<%= produto.id %>" style="display: inline;">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <button type="submit" onclick="return confirm('Tem certeza?')">Deletar</button>
</form>
```

### 4. Para Formulários com Busca/Search

```html
<form method="POST" action="/agenda/search">
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
    <input type="date" name="search" />
    <button type="submit">Buscar</button>
</form>
```

## Exemplo Completo

```html
<!DOCTYPE html>
<html>
<head>
    <title>Adicionar Produto</title>
</head>
<body>
    <h1>Adicionar Produto</h1>
    
    <form method="POST" action="/produto/add">
        <!-- Token CSRF obrigatório -->
        <input type="hidden" name="_csrf" value="<%= csrfToken %>">
        
        <!-- Campos do formulário -->
        <label>Nome:</label>
        <input type="text" name="nome" required />
        
        <label>Descrição:</label>
        <textarea name="descricao" required></textarea>
        
        <label>Valor:</label>
        <input type="number" name="valor" step="0.01" required />
        
        <button type="submit">Salvar</button>
    </form>
</body>
</html>
```

## ⚠️ Importante

1. **Token Hidden:** Sempre use `<input type="hidden">` para o token CSRF
2. **Nome do Campo:** Deve ser `_csrf` (nome padrão do csurf)
3. **Método POST:** Use POST para modificar dados (não GET)
4. **Confirmação:** Use `onclick="return confirm(...)"` para deletar

## Teste

Se o token não for incluído, você receberá:
```
HTTP 403 - Token CSRF inválido ou expirado
```

Se incluir corretamente:
```
HTTP 302 - Redirect (sucesso)
```

## Mais Informações

Veja `SECURITY.md` para mais detalhes sobre proteção CSRF.
