"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Aircraft, api, Inspection } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState, ErrorState, Loading } from "@/components/States";

const filters = [
  { value: "", label: "Todas" },
  { value: "Pending", label: "Pendentes" },
  { value: "InProgress", label: "Em andamento" },
  { value: "Completed", label: "Concluídas" },
];

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function InspectionsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [aircraftId, setAircraftId] = useState("");
  const [type, setType] = useState("A-Check");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [list, fleet] = await Promise.all([
        api.getInspections(filter || undefined),
        api.getAircraft(),
      ]);
      setInspections(list);
      setAircraft(fleet);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await api.createInspection({
        aircraftId: Number(aircraftId),
        type,
        description: description.trim(),
        dueDate,
      });
      setDescription("");
      setDueDate("");
      await load();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function handleAdvance(inspection: Inspection) {
    setActionError(null);
    const next = inspection.status === "Pending" ? "InProgress" : "Completed";
    try {
      await api.updateInspectionStatus(inspection.id, next);
      await load();
    } catch (e) {
      setActionError((e as Error).message);
    }
  }

  return (
    <>
      <header className="page-head">
        <h1>Inspeções</h1>
        <p className="muted">Registre, filtre e acompanhe as inspeções de manutenção.</p>
      </header>

      <form className="panel form" onSubmit={handleCreate}>
        <h2>Registrar inspeção</h2>
        <div className="form-grid">
          <label>
            Aeronave
            <select value={aircraftId} onChange={(e) => setAircraftId(e.target.value)} required>
              <option value="">Selecione…</option>
              {aircraft.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.registration} — {a.model}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tipo
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>A-Check</option>
              <option>C-Check</option>
              <option>Estrutural</option>
            </select>
          </label>
          <label>
            Prazo
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </label>
        </div>

        <label style={{ marginBottom: "16px" }}>
          Descrição
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            placeholder="Ex.: Inspeção de 600 horas"
            required
          />
        </label>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Registrar"}
        </button>
      </form>

      <div className="filters" role="group" aria-label="Filtrar por status">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            className={`chip ${filter === f.value ? "chip-active" : ""}`}
            aria-pressed={filter === f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {actionError && (
        <p className="form-error" role="alert">
          {actionError}
        </p>
      )}

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && inspections.length === 0 && (
        <EmptyState text="Nenhuma inspeção encontrada." />
      )}

      {!loading && !error && inspections.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Aeronave</th>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Prazo</th>
                <th>Status</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((i) => (
                <tr key={i.id}>
                  <td data-label="Aeronave">
                    <strong>{i.aircraftRegistration}</strong>
                  </td>
                  <td data-label="Tipo">{i.type}</td>
                  <td data-label="Descrição">{i.description}</td>
                  <td data-label="Prazo">{formatDate(i.dueDate)}</td>
                  <td data-label="Status">
                    <StatusBadge status={i.status} /> {i.isOverdue && <StatusBadge status="Overdue" />}
                  </td>
                  <td data-label="Ação">
                    {i.status === "Pending" && (
                      <button type="button" className="btn" onClick={() => handleAdvance(i)}>
                        Iniciar
                      </button>
                    )}
                    {i.status === "InProgress" && (
                      <button type="button" className="btn" onClick={() => handleAdvance(i)}>
                        Concluir
                      </button>
                    )}
                    {i.status === "Completed" && <span className="muted">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}