import { fr } from "@/lib/labels/fr";

export interface DayOption {
  key: string;
  label: string;
}

interface DayFilterProps {
  days: DayOption[];
  selected: string | null;
  onSelect: (key: string | null) => void;
}

export function DayFilter({ days, selected, onSelect }: DayFilterProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        {fr.filters.dayLabel}
      </span>
      <select
        value={selected ?? ""}
        onChange={(event) =>
          onSelect(event.target.value === "" ? null : event.target.value)
        }
        aria-label={fr.filters.dayLabel}
        className="border-2 border-border bg-card px-3 py-1 font-display text-sm uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <option value="">{fr.filters.allDays}</option>
        {days.map((day) => (
          <option key={day.key} value={day.key}>
            {day.label}
          </option>
        ))}
      </select>
    </label>
  );
}
