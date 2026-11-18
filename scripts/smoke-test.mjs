// Automated smoke test for the AeroCheck API.
// Teste automático da API do AeroCheck.
//
// Runs the same scenarios as AeroCheck.Api.http and verifies status codes and response bodies.
// Roda os mesmos cenários do arquivo AeroCheck.Api.http e confere status e conteúdo de cada resposta.
//
// Usage / Como usar (requires Node 18+ and running API / precisa do Node 18+ e da API rodando):
//   node scripts/smoke-test.mjs
//   API_URL=http://localhost:5080 node scripts/smoke-test.mjs           (Linux/Mac, custom URL)
//   $env:API_URL="http://localhost:5080"; node scripts/smoke-test.mjs   (PowerShell)
//
// Exit codes / Códigos de saída:
//   0 = all passed / tudo certo
//   1 = check failed / alguma verificação falhou
//   2 = API unreachable / API fora do ar

const BASE = process.env.API_URL ?? "http://localhost:5080";
let passed = 0;
let failed = 0;

async function call(method, path, body) {
  const response = await fetch(BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try {
    json = await response.json();
  } catch {
    // response without JSON body / resposta sem corpo JSON
  }
  return { status: response.status, json };
}

function check(description, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  OK      ${description}`);
  } else {
    failed++;
    console.log(`  FAILED / FALHOU  ${description}${detail ? `  (${detail})` : ""}`);
  }
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const pick = () => letters[Math.floor(Math.random() * letters.length)];
const registration = `P${pick()}-${pick()}${pick()}${pick()}`; // random per run to avoid conflicts / nova a cada execução para evitar conflito

let aircraftId;
let inspectionId;

async function scenario(title, run) {
  console.log(`\n${title}`);
  try {
    await run();
  } catch (error) {
    failed++;
    console.log(`  FAILED / FALHOU  unexpected error / erro inesperado: ${error.message}`);
  }
}

// 0. Check if API is reachable / A API está no ar?
try {
  await fetch(BASE + "/api/dashboard/summary");
} catch {
  console.error(
    `Could not connect to ${BASE}. Is the API running? / Não foi possível conectar em ${BASE}. A API está rodando? (dotnet run --project backend/AeroCheck.Api)`
  );
  process.exit(2);
}

console.log(`Testing API at ${BASE} (test registration: ${registration}) / Testando a API em ${BASE} (matrícula de teste: ${registration})`);

await scenario("1. Dashboard summary / Resumo do painel", async () => {
  const r = await call("GET", "/api/dashboard/summary");
  check("status 200", r.status === 200, `got / recebeu ${r.status}`);
  for (const key of ["totalAircraft", "aircraftInMaintenance", "pendingInspections", "inProgressInspections", "overdueInspections"]) {
    check(`has counter / tem o contador ${key}`, r.json && key in r.json);
  }
});

await scenario("2. List aircraft / Listar aeronaves", async () => {
  const r = await call("GET", "/api/aircraft");
  check("status 200", r.status === 200, `got / recebeu ${r.status}`);
  check("returns a list / devolve uma lista", Array.isArray(r.json));
});

await scenario("3. Register aircraft / Cadastrar aeronave (CA1)", async () => {
  const r = await call("POST", "/api/aircraft", { registration, model: "E175", flightHours: 100 });
  check("status 201", r.status === 201, `got / recebeu ${r.status}`);
  check("starts Operational / nasce Operational", r.json?.status === "Operational", `got / recebeu ${r.json?.status}`);
  aircraftId = r.json?.id;
  check("received id / recebeu o id", Number.isInteger(aircraftId));
});

await scenario("4. Duplicate registration / Matrícula duplicada (RN6)", async () => {
  const r = await call("POST", "/api/aircraft", { registration, model: "E175", flightHours: 100 });
  check("status 409", r.status === 409, `got / recebeu ${r.status}`);
  check("readable message / mensagem legível", String(r.json?.title ?? "").includes("Já existe"), `title: ${r.json?.title}`);
});

await scenario("5. Invalid registration format / Matrícula fora do formato", async () => {
  const r = await call("POST", "/api/aircraft", { registration: "abc", model: "E175", flightHours: 0 });
  check("status 400", r.status === 400, `got / recebeu ${r.status}`);
});

await scenario("6. Register overdue inspection / Registrar inspeção atrasada (CA2, RN1, RN5)", async () => {
  const r = await call("POST", "/api/inspections", {
    aircraftId,
    type: "A-Check",
    description: "Inspeção de 600 horas",
    dueDate: "2020-01-01",
  });
  check("status 201", r.status === 201, `got / recebeu ${r.status}`);
  check("starts Pending / nasce Pending (RN1)", r.json?.status === "Pending", `got / recebeu ${r.json?.status}`);
  check("past dueDate = overdue / prazo vencido = atrasada (RN5)", r.json?.isOverdue === true);
  inspectionId = r.json?.id;
  check("received id / recebeu o id", Number.isInteger(inspectionId));
});

await scenario("7. Skip directly to Completed / Pular direto para Completed (RN2)", async () => {
  const r = await call("PATCH", `/api/inspections/${inspectionId}/status`, { status: "Completed" });
  check("status 400", r.status === 400, `got / recebeu ${r.status}`);
  check("explains invalid transition / explica a transição inválida", String(r.json?.title ?? "").includes("Transição inválida"), `title: ${r.json?.title}`);
});

await scenario("8. Start inspection / Iniciar a inspeção (CA3)", async () => {
  const r = await call("PATCH", `/api/inspections/${inspectionId}/status`, { status: "InProgress" });
  check("status 200", r.status === 200, `got / recebeu ${r.status}`);
  check("InProgress", r.json?.status === "InProgress", `got / recebeu ${r.json?.status}`);
});

await scenario("9. Aircraft in maintenance / Aeronave em manutenção (RN3)", async () => {
  const r = await call("GET", "/api/aircraft");
  const aircraft = r.json?.find?.((a) => a.id === aircraftId);
  check("aircraft InMaintenance / aeronave InMaintenance", aircraft?.status === "InMaintenance", `got / recebeu ${aircraft?.status}`);
});

await scenario("10. Complete inspection / Concluir a inspeção (CA3)", async () => {
  const r = await call("PATCH", `/api/inspections/${inspectionId}/status`, { status: "Completed" });
  check("status 200", r.status === 200, `got / recebeu ${r.status}`);
  check("Completed", r.json?.status === "Completed", `got / recebeu ${r.json?.status}`);
  check("no longer overdue / deixa de ser atrasada", r.json?.isOverdue === false);
});

await scenario("11. Aircraft returns to Operational / Aeronave volta a Operational (RN4)", async () => {
  const r = await call("GET", "/api/aircraft");
  const aircraft = r.json?.find?.((a) => a.id === aircraftId);
  check("aircraft Operational / aeronave Operational", aircraft?.status === "Operational", `got / recebeu ${aircraft?.status}`);
});

await scenario("12. Filter completed inspections / Filtrar inspeções concluídas (CA5)", async () => {
  const r = await call("GET", "/api/inspections?status=Completed");
  check("status 200", r.status === 200, `got / recebeu ${r.status}`);
  check("only Completed / só Completed", Array.isArray(r.json) && r.json.every((i) => i.status === "Completed"));
});

await scenario("13. Invalid status filter / Status inválido no filtro", async () => {
  const r = await call("GET", "/api/inspections?status=Qualquer");
  check("status 400", r.status === 400, `got / recebeu ${r.status}`);
});

console.log(`\nResult / Resultado: ${passed} checks OK / verificações OK, ${failed} failed / falharam.`);
process.exit(failed === 0 ? 0 : 1);