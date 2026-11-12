# Constituição do Projeto AeroCheck / AeroCheck Project Constitution

Princípios que toda implementação (humana ou de agente de IA) deve respeitar.  
*Principles that every implementation (human or AI agent) must respect.*

---

## Produto / Product

- **PT:** AeroCheck é um sistema simples para acompanhar inspeções de manutenção de uma frota de aeronaves.  
  **EN:** AeroCheck is a simple system to track maintenance inspections of an aircraft fleet.

- **PT:** Contexto: manutenção e segurança operacional são pilares da aviação; rastreabilidade é prioridade.  
  **EN:** Context: maintenance and operational safety are pillars of aviation; traceability is a priority.

---

## Tecnologia / Technology

- **PT:** Back-end: C# / .NET 8, Web API com Controllers, Entity Framework Core.  
  **EN:** Back-end: C# / .NET 8, Web API with Controllers, Entity Framework Core.

- **PT:** Banco de dados: SQL Server (2022).  
  **EN:** Database: SQL Server (2022).

- **PT:** Front-end: React + Next.js (App Router) com TypeScript.  
  **EN:** Front-end: React + Next.js (App Router) with TypeScript.

- **PT:** Comunicação: API REST em JSON.  
  **EN:** Communication: REST API in JSON.

---

## Qualidade / Quality

1. **PT:** Nenhum código sem spec: toda funcionalidade nasce em `specs/`.  
   **EN:** No code without spec: every feature originates in `specs/`.

2. **PT:** Regras de negócio ficam no back-end; o front-end só apresenta e valida o básico.  
   **EN:** Business rules stay in the back-end; the front-end only presents and validates the basics.

3. **PT:** A API valida toda entrada e devolve códigos HTTP corretos (400, 404, 409).  
   **EN:** The API validates all input and returns correct HTTP codes (400, 404, 409).

4. **PT:** Nomes de código em inglês; textos da interface bilíngues (português e inglês).  
   **EN:** Code names in English; bilingual interface texts (Portuguese and English).

5. **PT:** Mudou o comportamento? Atualize a spec antes de alterar o código.  
   **EN:** Did the behavior change? Update the spec before changing the code.

---

## UX/UI

- **PT:** Interface clara, responsiva (celular e desktop), com estados de carregamento, erro e lista vazia.  
  **EN:** Clear, responsive interface (mobile and desktop), with loading, error, and empty list states.

- **PT:** Status sempre indicados por texto + cor (não depender apenas de cor).  
  **EN:** Status always indicated by text + color (do not rely on color alone).

- **PT:** Elementos navegáveis por teclado e com foco visível.  
  **EN:** Elements keyboard-navigable and with visible focus.

---

## Uso de IA / Use of AI

- **PT:** Agentes seguem o fluxo: Spec → Plano → Tarefas → Implementação → Revisão (ver `AGENTS.md`).  
  **EN:** Agents follow the flow: Spec → Plan → Tasks → Implementation → Review (see `AGENTS.md`).

- **PT:** Todo código gerado por IA é revisado por uma pessoa antes de ser aceito.  
  **EN:** All AI-generated code is reviewed by a person before being accepted.