```

---

## Features & Business Rules / Funcionalidades e Regras de Negócio

- **Dashboard / Painel:** Fleet overview with total aircraft, aircraft in maintenance, pending/in-progress/overdue inspections, and fleet availability bar. *(Visão geral da frota com total de aeronaves, em manutenção, inspeções pendentes/em andamento/atrasadas e barra de disponibilidade).*
- **Aircraft Management / Gestão de Aeronaves:** Fleet listing and registration with unique tail number validation (`AA-AAA` format). *(Listagem e cadastro da frota com validação de matrícula única no formato `AA-AAA`).*
- **Inspection Workflow / Fluxo de Inspeções:** Registration, status filtering, and sequential state transitions (`Pending` → `InProgress` → `Completed`). *(Registro, filtro por status e transições sequenciais de estado).*
  - Starting an inspection automatically updates the aircraft status to `InMaintenance`. *(Iniciar uma inspeção coloca a aeronave automaticamente em manutenção).*
  - Completing all active inspections returns the aircraft to `Operational`. *(Concluir todas as inspeções ativas devolve a aeronave ao status operacional).*
  - Overdue detection flags inspections past their due date that have not been completed. *(Detecção de atraso sinaliza inspeções com prazo vencido ainda não concluídas).*

---

## Running Locally / Como Rodar Localmente

**Prerequisites / Pré-requisitos:** .NET 8 SDK, Node.js 18+, and Docker.

### 1. Database / Banco de Dados

```bash
docker compose up -d
# Wait ~20 seconds for SQL Server to initialize, then run / Aguarde ~20s e execute:
docker exec aerocheck-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Aero@12345" -C -i /scripts/01_schema.sql
docker exec aerocheck-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Aero@12345" -C -i /scripts/02_seed.sql
```

### 2. Back-end API

```bash
dotnet run --project backend/AeroCheck.Api
```

- API: `http://localhost:5080`
- Swagger UI: `http://localhost:5080/swagger`

### 3. Front-end

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

- Web App: `http://localhost:3000`

---

## Running Tests / Como Testar

```bash
# Unit tests (xUnit — business rules RN1–RN6) / Testes unitários das regras RN1–RN6
dotnet test AeroCheck.slnx

# Automated API smoke test (with the API running) / Smoke test automatizado (com a API rodando)
node scripts/smoke-test.mjs
```
