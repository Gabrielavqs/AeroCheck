````markdown
# Plano Técnico / Technical Plan

**Referência / Reference:** `specs/01-spec-inspections.md`

## Arquitetura / Architecture

```
Next.js (React, :3000)  --HTTP/JSON-->  ASP.NET Core Web API (:5080)  --EF Core-->  SQL Server (:1433)
```

## Decisões / Decisions

| Decisão / Decision | Motivo / Reason |
|---|---|
| Controllers + EF Core | Padrão amplamente usado em .NET, simples de explicar.<br>*Widely used .NET standard, simple to explain.* |
| Enums salvos como texto no banco / Enums stored as text in the database | Legibilidade ao consultar a tabela.<br>*Readability when querying the table.* |
| Regras de negócio no controller de inspeções / Business rules in the inspections controller | Escopo pequeno; em projeto maior viraria camada de serviço.<br>*Small scope; in a larger project this would become a service layer.* |
| DTOs como `record` / DTOs as `record` | Separa o contrato da API das entidades do banco.<br>*Separates the API contract from the database entities.* |
| CORS liberado só para `http://localhost:3000` / CORS allowed only for `http://localhost:3000` | Segurança mínima em desenvolvimento.<br>*Minimum security in development.* |
| Next.js App Router com páginas client-side / Next.js App Router with client-side pages | Simplicidade para fetch + estados de UI.<br>*Simplicity for fetch + UI states.* |
| CSS puro com variáveis / Plain CSS with variables | Sem dependências extras, fácil de ler.<br>*No extra dependencies, easy to read.* |

## Estrutura de pastas / Folder Structure

```
backend/AeroCheck.Api   -> API C# / C# API
frontend                -> Next.js
database                -> scripts SQL / SQL scripts
specs                   -> specs (fonte da verdade / source of truth)
.claude/agents          -> agentes de IA / AI agents
```

## Riscos / Risks

- **PT:** O banco precisa estar no ar antes da API (usar `docker compose up -d`).
  **EN:** The database must be running before the API (use `docker compose up -d`).
- **PT:** Sem autenticação: não usar fora de ambiente local.
  **EN:** No authentication: do not use outside a local environment.
````