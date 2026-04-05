import type { ReactNode } from "react";

interface CardShellProps {
  children?: ReactNode;
  dataUpdatedAt?: number;
  error?: Error | null;
  isLoading?: boolean;
  onRetry?: () => void;
  title: string;
}

function TimeAgo({ timestamp }: { timestamp: number }) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const isStale = seconds > 30;

  return (
    <span className="text-[10px] text-text-muted">
      {isStale && (
        <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-amber-400" />
      )}
      Updated {seconds}s ago
    </span>
  );
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div className="h-4 w-full rounded bg-bg-hover" key={i} />
      ))}
    </div>
  );
}

export function CardShell({
  title,
  children,
  dataUpdatedAt,
  isLoading,
  error,
  onRetry,
}: CardShellProps) {
  return (
    <div className="rounded-lg bg-bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold text-[12px] text-text-muted uppercase tracking-wider">
          {title}
        </h3>
        {dataUpdatedAt && <TimeAgo timestamp={dataUpdatedAt} />}
      </div>

      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <div className="rounded border border-accent-red/30 p-3 text-center">
          <p className="mb-2 text-accent-red text-xs">Failed to load data</p>
          {onRetry && (
            <button
              className="text-accent-blue text-xs hover:underline"
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
