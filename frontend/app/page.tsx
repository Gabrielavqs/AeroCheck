"use client";

import { useCallback, useEffect, useState } from "react";
import { api, Summary } from "@/lib/api";
import { EmptyState, ErrorState, Loading } from "@/components/States";

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setSummary(await api.getSummary());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!summary) return <EmptyState text="Sem dados para exibir." />;

  const icons: Record<string, React.ReactNode> = {
    fleet: (
      <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2l-1.4 2.2L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3z" />
    ),
    tool: (
      <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.2-.5-.5-2.2 2.5-2.5z" />
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    run: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
    alert: (
      <>
        <path d="M12 3 2 21h20L12 3z" />
        <path d="M12 10v5M12 18h.01" />
      </>
    ),
  };

  const cards = [
    { label: "Aeronaves na frota", value: summary.totalAircraft, tone: "ok", icon: "fleet" },
    { label: "Em manutenção", value: summary.aircraftInMaintenance, tone: "warn", icon: "tool" },
    { label: "Inspeções pendentes", value: summary.pendingInspections, tone: "neutral", icon: "clock" },
    { label: "Inspeções em andamento", value: summary.inProgressInspections, tone: "warn", icon: "run" },
    { label: "Inspeções atrasadas", value: summary.overdueInspections, tone: "danger", icon: "alert" },
  ];

  const total = summary.totalAircraft || 1;
  const maintenancePct = Math.round((summary.aircraftInMaintenance / total) * 100);
  const operationalPct = 100 - maintenancePct;

  return (
    <>
      <header className="page-head">
        <h1>Painel</h1>
        <p className="muted">Visão geral da frota e das inspeções de manutenção.</p>
      </header>

      <section className="cards" aria-label="Resumo">
        {cards.map((card) => (
          <article key={card.label} className={`card card-${card.tone}`}>
            <div className="card-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">{icons[card.icon]}</svg>
            </div>
            <p className="card-value">{card.value}</p>
            <p className="card-label">{card.label}</p>
          </article>
        ))}
      </section>

      <section className="panel fleet" aria-label="Disponibilidade da frota">
        <h2>Disponibilidade da frota</h2>
        <div
          className="fleet-bar"
          role="img"
          aria-label={`${operationalPct}% operacional, ${maintenancePct}% em manutenção`}
        >
          <span style={{ width: `${operationalPct}%` }} />
          <span style={{ width: `${maintenancePct}%` }} />
        </div>
        <div className="legend">
          <span>
            <i style={{ background: "#12a05c" }} />
            Operacional: {operationalPct}%
          </span>
          <span>
            <i style={{ background: "#e08a00" }} />
            Em manutenção: {maintenancePct}%
          </span>
        </div>
      </section>
    </>
  );
}