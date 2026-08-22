# NEXT STEPS - Estado real do projeto

Documento revisado para refletir o estado atual do código, sem assumir "100% pronto".

## Status atual (realista)

- Segurança base implementada: `helmet`, `csurf`, validações e sessão.
- Projeto ainda não validado ponta a ponta em produção.
- Há melhorias pendentes de confiabilidade, disponibilidade e hardening.
- A tag `v3.1.0` existe no Git, mas representa um marco técnico interno, não um release validado em produção.

## SemVer e tag (análise)

### O que existe hoje
- `package.json`: `3.1.0`
- Tag Git existente: `v3.1.0`

### Avaliação
- Como o sistema ainda não esteve estável em produção, o ideal é tratar essa fase como **pré-release**.
- Para novos marcos, prefira:
  - `3.1.0-rc.1` (release candidate), ou
  - `3.1.1` para correções de bug sem novas features.

### Recomendação prática
- Não apagar/alterar a tag antiga agora.
- Criar a próxima tag somente após checklist mínimo de funcionamento completo e testes manuais concluídos.

## Checklist técnico do que já está OK

### Segurança no código
- [x] `helmet` ativo no `index.js`
- [x] `csurf` ativo com tratamento de erro `EBADCSRFTOKEN`
- [x] Tokens CSRF nos formulários de login, agenda, produto, serviço e cliente
- [x] Formulário de fechamento de caixa com token CSRF
- [x] Rotas de deleção usando `POST` (não `GET`)
- [x] `SESSION_SECRET` obrigatória no startup
- [x] Validações com `express-validator` em rotas principais
- [x] Prisma singleton em `utils/prismaClient.js`

### Estrutura
- [x] 7 routers no projeto (`agenda`, `caixa`, `clientes`, `inicio`, `login`, `produto`, `servico`)
- [x] Documentação de apoio presente (`SECURITY.md`, `CHANGELOG.md`, `CSRF_TOKENS.md`, etc.)

## Pendências antes de considerar release estável

### Segurança e hardening
- [x] Adicionar rate limit nas rotas de login e sensíveis
- [ ] Definir política de lockout/backoff para tentativas de login
- [ ] Revisar uso de `csurf` (pacote legada) e planejar alternativa futura

### Confiabilidade
- [x] Padronizar tratamento de erro em `clientes.routes.js`
- [ ] Garantir respostas consistentes de erro em todas as rotas
- [ ] Criar smoke test manual mínimo para fluxo principal

### Disponibilidade
- [x] Adicionar endpoint de healthcheck (`/healthz`)
- [ ] Definir strategy de readiness para deploy
- [ ] Trocar sessão para Redis em produção (evitar `MemoryStore` em ambiente produtivo)

### Funcionalidade (go-live)
- [ ] Validar fluxo completo: login -> agenda -> produto -> serviço -> caixa
- [ ] Validar permissões e redirecionamentos de autenticação
- [ ] Executar checklist manual completo no `MANUAL_DE_TESTES.md`

## Verificação local rápida

```bash
npm run start:dev
```

Testes manuais mínimos:
1. [ ] Login válido e inválido
2. [ ] Criar/editar/excluir produto
3. [ ] Criar/editar/excluir serviço
4. [ ] Criar/editar/excluir agendamento
5. [ ] Buscar agenda por data
6. [ ] Fechamento de caixa com intervalo de datas

## Preparação de produção

- [ ] Configurar `.env` com valores reais seguros
- [ ] Gerar `SESSION_SECRET` forte (32+ bytes)
- [ ] Gerar `ADMIN_PASSWORD_HASH` com bcrypt
- [ ] Habilitar HTTPS/SSL no ambiente final
- [ ] Configurar monitoramento de erros e logs

## Quando liberar nova versão

Critérios recomendados:
- Sem erros críticos nos fluxos principais
- Checklist manual mínimo 100% concluído
- Deploy de teste realizado com sucesso

Versionamento sugerido:
- Correções imediatas: `3.1.1`
- Pré-release validável: `3.1.1-rc.1`
- Release estável após validação real: `3.2.0` (se incluir melhorias novas) ou `3.1.1` (se apenas bugfix)

