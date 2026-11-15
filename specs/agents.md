
# AGENTS.md — Guia para agentes de IA / Guide for AI Agents

Este projeto segue **SDD (Spec-Driven Development)**: a spec é a fonte da verdade e o código é consequência dela.
*This project follows **SDD (Spec-Driven Development)**: the spec is the source of truth and the code is a consequence of it.*

## Leia antes de qualquer coisa / Read before anything else

1. `specs/00-constitution.md`
2. `specs/01-spec-inspections.md`
3. `specs/api-contract.md`

## Fluxo obrigatório / Required workflow

```
Spec -> Plano / Plan -> Tarefas / Tasks -> Implementação / Implementation -> Revisão / Review
```

1. **Spec:** descreve o quê e por quê (regras, critérios de aceitação). Sem decisões técnicas. / Describes what and why (rules, acceptance criteria). No technical decisions.
2. **Plano / Plan:** descreve como (arquitetura, decisões). / Describes how (architecture, decisions).
3. **Tarefas / Tasks:** quebra o plano em passos pequenos, cada um ligado a um critério da spec. / Breaks the plan into small steps, each linked to a spec criterion.
4. **Implementação / Implementation:** um agente executa uma tarefa por vez. / One agent executes one task at a time.
5. **Revisão / Review:** outro agente confere o código contra a spec e a constituição. / Another agent checks the code against the spec and the constitution.

## Agentes / Agents (`.claude/agents/`)

| Agente / Agent | Papel / Role |
|---|---|
| `spec-writer` | Escreve e refina specs e critérios de aceitação / Writes and refines specs and acceptance criteria |
| `api-dev` | Implementa tarefas de back-end (C#/.NET, SQL Server) / Implements back-end tasks (C#/.NET, SQL Server) |
| `frontend-dev` | Implementa tarefas de front-end (Next.js, React, UX/UI) / Implements front-end tasks (Next.js, React, UX/UI) |
| `reviewer` | Revisa implementação contra a spec; não altera código / Reviews implementation against the spec; does not change code |

## Regras para os agentes / Rules for agents

- Não implemente nada que não esteja na spec. Se faltar algo, proponha uma mudança na spec primeiro.
  *Do not implement anything that is not in the spec. If something is missing, propose a spec change first.*
- Uma tarefa por vez; ao terminar, marque em `specs/03-tasks.md`.
  *One task at a time; when done, mark it in `specs/03-tasks.md`.*
- Mantenha o contrato em `specs/api-contract.md` igual ao código.
  *Keep the contract in `specs/api-contract.md` identical to the code.*
- Nunca coloque senhas reais no repositório (a senha do `docker-compose.yml` é apenas de desenvolvimento local).
  *Never put real passwords in the repository (the password in `docker-compose.yml` is for local development only).*

## Exemplo de uso / Usage example

> "Use o agente `api-dev` para executar a tarefa T7 de `specs/03-tasks.md`." / "Use the `api-dev` agent to execute task T7 from `specs/03-tasks.md`."
>
> "Use o agente `reviewer` para revisar a T7 contra a spec." / "Use the `reviewer` agent to review T7 against the spec."
