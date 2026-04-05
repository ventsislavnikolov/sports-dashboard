import { type ReactNode } from "react";

interface CardShellProps {
  title: string;
  children?: ReactNode;
  dataUpdatedAt?: number;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
}

function TimeAgo({ timestamp }: { timestamp: number }) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  const isStale = seconds > 30;

  return (
    <span className="text-[10px] text-text-muted">
      {isStale && (
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mr-1" />
      )}
      Updated {seconds}s ago
    </span>
  );
}

function Skeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-4 bg-bg-hover rounded w-full" />
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
    <div className="bg-bg-surface rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[12px] font-bold uppercase tracking-wider text-text-muted">
          {title}
        </h3>
        {dataUpdatedAt && <TimeAgo timestamp={dataUpdatedAt} />}
      </div>

      {isLoading ? (
        <Skeleton />
      ) : error ? (
        <div className="border border-accent-red/30 rounded p-3 text-center">
          <p className="text-accent-red text-xs mb-2">Failed to load data</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-accent-blue hover:underline"
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
