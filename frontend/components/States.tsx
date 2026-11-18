export function Loading() {
  return (
    <div role="status" aria-label="Carregando">
      <div className="skeleton-row" />
      <div className="skeleton-row" />
      <div className="skeleton-row" />
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="state state-error" role="alert">
      <p>{message}</p>
      <button type="button" className="btn" onClick={onRetry}>
        Tentar novamente
      </button>
    </div>
  );
}

export function EmptyState({ text }: { text: string }) {
  return <p className="state">{text}</p>;
}