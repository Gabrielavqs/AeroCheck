const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080";

export type Aircraft = {
  id: number;
  registration: string;
  model: string;
  status: "Operational" | "InMaintenance";
  flightHours: number;
};

export type Inspection = {
  id: number;
  aircraftId: number;
  aircraftRegistration: string;
  type: string;
  description: string;
  dueDate: string;
  status: "Pending" | "InProgress" | "Completed";
  isOverdue: boolean;
};

export type Summary = {
  totalAircraft: number;
  aircraftInMaintenance: number;
  pendingInspections: number;
  inProgressInspections: number;
  overdueInspections: number;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
      cache: "no-store",
    });
  } catch {
    throw new Error("Não foi possível conectar à API. Verifique se ela está em execução.");
  }

  if (!response.ok) {
    let message = "Ocorreu um erro inesperado.";
    try {
      const problem = await response.json();
      if (problem?.title) message = problem.title;
      if (problem?.errors) message = Object.values(problem.errors).flat().join(" ");
    } catch {
      // response without JSON body / resposta sem corpo JSON
    }
    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

export const api = {
  getSummary: () => request<Summary>("/api/dashboard/summary"),
  getAircraft: () => request<Aircraft[]>("/api/aircraft"),
  createAircraft: (data: { registration: string; model: string; flightHours: number }) =>
    request<Aircraft>("/api/aircraft", { method: "POST", body: JSON.stringify(data) }),
  getInspections: (status?: string) =>
    request<Inspection[]>(`/api/inspections${status ? `?status=${status}` : ""}`),
  createInspection: (data: { aircraftId: number; type: string; description: string; dueDate: string }) =>
    request<Inspection>("/api/inspections", { method: "POST", body: JSON.stringify(data) }),
  updateInspectionStatus: (id: number, status: "InProgress" | "Completed") =>
    request<Inspection>(`/api/inspections/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

export const statusLabels: Record<string, string> = {
  Operational: "Operacional",
  InMaintenance: "Em manutenção",
  Pending: "Pendente",
  InProgress: "Em andamento",
  Completed: "Concluída",
};