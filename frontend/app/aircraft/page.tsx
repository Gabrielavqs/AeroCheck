"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Aircraft, api } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState, ErrorState, Loading } from "@/components/States";

export default function AircraftPage() {
  const [aircraft, setAircraft] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [registration, setRegistration] = useState("");
  const [model, setModel] = useState("");
  const [flightHours, setFlightHours] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setAircraft(await api.getAircraft());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await api.createAircraft({
        registration: registration.trim().toUpperCase(),
        model: model.trim(),
        flightHours: Number(flightHours),
      });
      setRegistration("");
      setModel("");
      setFlightHours("0");
      await load();
    } catch (e) {
      setFormError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <header className="page-head">
        <h1>Aeronaves</h1>
        <p className="muted">Frota cadastrada e situação de cada aeronave.</p>
      </header>

      <form className="panel form" onSubmit={handleSubmit}>
        <h2>Cadastrar aeronave</h2>
        <div className="form-grid">
          <label>
            Matrícula
            <input
              value={registration}
              onChange={(e) => setRegistration(e.target.value)}
              placeholder="PR-EMB"
              maxLength={6}
              required
            />
            <small>Formato AA-AAA</small>
          </label>
          <label>
            Modelo
            <input
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="E195-E2"
              required
            />
          </label>
          <label>
            Horas de voo
            <input
              type="number"
              min={0}
              step="0.1"
              value={flightHours}
              onChange={(e) => setFlightHours(e.target.value)}
              required
            />
          </label>
        </div>

        {formError && (
          <p className="form-error" role="alert">
            {formError}
          </p>
        )}

        <button className="btn btn-primary" type="submit" disabled={saving}>
          {saving ? "Salvando…" : "Cadastrar"}
        </button>
      </form>

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={load} />}
      {!loading && !error && aircraft.length === 0 && (
        <EmptyState text="Nenhuma aeronave cadastrada." />
      )}

      {!loading && !error && aircraft.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Modelo</th>
                <th>Horas de voo</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {aircraft.map((a) => (
                <tr key={a.id}>
                  <td data-label="Matrícula">
                    <strong>{a.registration}</strong>
                  </td>
                  <td data-label="Modelo">{a.model}</td>
                  <td data-label="Horas de voo">{a.flightHours.toLocaleString("pt-BR")}</td>
                  <td data-label="Situação">
                    <StatusBadge status={a.status} />
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