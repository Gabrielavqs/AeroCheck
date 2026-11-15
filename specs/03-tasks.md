# Tarefas / Tasks

Cada tarefa referencia a spec. Marque `[x]` quando concluída e revisada.
*Each task references the spec. Mark `[x]` when completed and reviewed.*

## Banco de dados / Database

- [x] T1 — Script de schema com tabelas Aircraft e Inspections (spec §4) / Schema script with Aircraft and Inspections tables (spec §4)
- [x] T2 — Script de dados de exemplo / Sample data script
- [x] T3 — docker-compose com SQL Server 2022 / docker-compose with SQL Server 2022

## API

- [x] T4 — Entidades, enums e `AppDbContext` (spec §4) / Entities, enums and `AppDbContext` (spec §4)
- [x] T5 — `AircraftController`: GET e POST, matrícula única (CA1, RN6) / `AircraftController`: GET and POST, unique registration (CA1, RN6)
- [x] T6 — `InspectionsController`: GET com filtro, POST (CA2, CA5, RN1) / `InspectionsController`: GET with filter, POST (CA2, CA5, RN1)
- [x] T7 — PATCH de status com transições e efeito na aeronave (CA3, RN2–RN4) / Status PATCH with transitions and effect on the aircraft (CA3, RN2–RN4)
- [x] T8 — `DashboardController` com resumo e atrasadas (CA4, RN5) / `DashboardController` with summary and overdue inspections (CA4, RN5)
- [x] T9 — CORS e Swagger / CORS and Swagger

## Front-end

- [x] T10 — Layout, navegação e estilos base (spec §7) / Layout, navigation and base styles (spec §7)
- [x] T11 — Painel com cartões de resumo (CA4) / Dashboard with summary cards (CA4)
- [x] T12 — Tela de Inspeções: lista, filtro, formulário, ações Iniciar/Concluir (CA2, CA3, CA5) / Inspections screen: list, filter, form, Start/Complete actions (CA2, CA3, CA5)
- [x] T13 — Tela de Aeronaves: lista e formulário (CA1) / Aircraft screen: list and form (CA1)

## Qualidade / Quality

- [ ] T14 — Rodar o projeto localmente e validar cada critério de aceitação / Run the project locally and validate each acceptance criterion
- [x] T15 — Testes automatizados com xUnit das regras RN1 a RN6 (backend/AeroCheck.Tests) / Automated xUnit tests for rules RN1 to RN6 (backend/AeroCheck.Tests)