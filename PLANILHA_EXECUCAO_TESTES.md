# 📊 Planilha de Execução de Testes (v3.1.x)

Use este arquivo para registrar cada rodada de testes com rastreabilidade.

---

## Cabeçalho da rodada

- **Rodada:** ____________________
- **Build/Commit:** ____________________
- **Data:** ____/____/____
- **Responsável:** ____________________
- **Ambiente:** [ ] Local  [ ] Homologação
- **Banco:** ____________________
- **Objetivo da rodada:** ____________________

---

## Legenda de status

- `PASSOU`: comportamento esperado
- `FALHOU`: comportamento diferente do esperado
- `BLOQUEADO`: não foi possível executar por dependência externa
- `N/A`: não aplicável na rodada

---

## Registro dos casos

| ID | Módulo | Caso de teste | Prioridade | Status | Evidência (print/log) | Bug/Issue | Responsável | Tempo (min) | Observações |
|----|--------|---------------|------------|--------|------------------------|-----------|-------------|-------------|------------|
| AUTH-01 | Autenticação | Login válido redireciona para `/admin` | Alta | | | | | | |
| AUTH-02 | Autenticação | Login inválido mostra erro | Alta | | | | | | |
| AUTH-03 | Segurança | Lock por tentativas inválidas | Alta | | | | | | |
| AUTH-04 | Segurança | Rate limit em `/login` | Alta | | | | | | |
| AGD-01 | Agenda | Criar agendamento válido | Alta | | | | | | |
| AGD-02 | Agenda | Validação de data/hora inválida | Alta | | | | | | |
| AGD-03 | Agenda | Editar agendamento | Média | | | | | | |
| AGD-04 | Agenda | Excluir agendamento (POST+CSRF) | Alta | | | | | | |
| PRD-01 | Produto | Criar produto válido | Alta | | | | | | |
| PRD-02 | Produto | Bloquear payload inválido | Alta | | | | | | |
| PRD-03 | Produto | Editar e excluir produto | Média | | | | | | |
| SRV-01 | Serviço | Criar serviço válido | Alta | | | | | | |
| SRV-02 | Serviço | Validar campos obrigatórios | Alta | | | | | | |
| SRV-03 | Serviço | Editar e excluir serviço | Média | | | | | | |
| CX-01 | Caixa | Fechamento com período válido | Alta | | | | | | |
| CX-02 | Caixa | Formulário caixa com CSRF | Alta | | | | | | |
| CLI-01 | Cliente | Agenda cliente (janela prevista) | Média | | | | | | |
| CLI-02 | Cliente | Criar agendamento cliente | Alta | | | | | | |
| SEC-01 | Segurança | POST sem CSRF retorna 403 | Alta | | | | | | |
| SEC-02 | Segurança | Headers Helmet presentes | Média | | | | | | |
| SEC-03 | Segurança | Cookie sessão com flags corretas | Alta | | | | | | |
| ENV-01 | Config | Falha sem `SESSION_SECRET` | Alta | | | | | | |
| ENV-02 | Config | Falha com `SESSION_SECRET` < 32 | Alta | | | | | | |
| ENV-03 | Config | Falha sem variáveis admin | Alta | | | | | | |
| PROD-01 | Produção | Bloqueio de MemoryStore em `NODE_ENV=production` | Alta | | | | | | |

---

## Resumo da rodada

- **Total de casos planejados:** ______
- **PASSOU:** ______
- **FALHOU:** ______
- **BLOQUEADO:** ______
- **N/A:** ______
- **Taxa de sucesso:** ______ %

---

## Bugs abertos nesta rodada

| ID Bug | Severidade | Descrição curta | Impacto | Ação imediata | Responsável | Status |
|--------|------------|------------------|---------|---------------|-------------|--------|
| | Crítica/Alta/Média/Baixa | | | | | |
| | Crítica/Alta/Média/Baixa | | | | | |

---

## Decisão go/no-go

- [ ] **GO** para nova tag (sem bloqueadores)
- [ ] **NO-GO** (há bloqueadores ou risco alto)

**Justificativa:**  
____________________________________________________________________  
____________________________________________________________________

