# Contrato da API (derivado da Spec 01) / API Contract (derived from Spec 01)

**Base URL local / Local Base URL:** `http://localhost:5080`

---

## Endpoints / Rotas

| Método / Method | Rota / Route | Descrição / Description | Respostas / Responses |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/aircraft` | **PT:** Lista aeronaves.<br>**EN:** Lists aircraft. | `200` |
| `POST` | `/api/aircraft` | **PT:** Cadastra aeronave.<br>**EN:** Registers an aircraft. | `201`, `400`, `409` |
| `GET` | `/api/inspections?status=` | **PT:** Lista inspeções (filtro opcional).<br>**EN:** Lists inspections (optional filter). | `200`, `400` |
| `POST` | `/api/inspections` | **PT:** Registra inspeção.<br>**EN:** Logs an inspection. | `201`, `400`, `404` |
| `PATCH` | `/api/inspections/{id}/status` | **PT:** Avança o status.<br>**EN:** Advances the status. | `200`, `400`, `404` |
| `GET` | `/api/dashboard/summary` | **PT:** Números do painel.<br>**EN:** Dashboard summary metrics. | `200` |

---

## Exemplos / Examples

### `POST /api/aircraft`
```json
{
  "registration": "PR-EMB",
  "model": "E195-E2",
  "flightHours": 1250.5
}