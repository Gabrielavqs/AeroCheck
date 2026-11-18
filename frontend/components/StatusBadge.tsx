import { statusLabels } from "@/lib/api";

const toneByStatus: Record<string, string> = {
  Operational: "ok",
  InMaintenance: "warn",
  Pending: "neutral",
  InProgress: "warn",
  Completed: "ok",
  Overdue: "danger",
};

export function StatusBadge({ status }: { status: string }) {
  const label = status === "Overdue" ? "Atrasada" : statusLabels[status] ?? status;
  return <span className={`badge badge-${toneByStatus[status] ?? "neutral"}`}>{label}</span>;
}