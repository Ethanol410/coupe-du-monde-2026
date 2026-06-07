import { cn } from "@/lib/utils";
import { statusLabel } from "@/lib/labels/fr";
import type { MatchStatus } from "@/lib/providers/types";

const TONE: Record<MatchStatus, string> = {
  LIVE: "bg-primary text-primary-foreground",
  HALFTIME: "bg-primary text-primary-foreground",
  FINISHED: "border border-border text-foreground",
  SCHEDULED: "border border-border text-muted-foreground",
  POSTPONED: "border border-border text-muted-foreground",
};

interface StatusBadgeProps {
  status: MatchStatus;
  minute: number | null;
}

export function StatusBadge({ status, minute }: StatusBadgeProps) {
  const live = status === "LIVE" || status === "HALFTIME";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 font-display text-xs uppercase tracking-wider",
        TONE[status],
      )}
    >
      {live && (
        <span
          className="live-dot inline-block size-2 rounded-full bg-current"
          aria-hidden
        />
      )}
      {statusLabel(status)}
      {live && minute !== null && (
        <span className="tabular-nums">{minute}&apos;</span>
      )}
    </span>
  );
}
