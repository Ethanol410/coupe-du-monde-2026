import { fr } from "@/lib/labels/fr";
import { FilterChip } from "./FilterChip";

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
    <div
      role="group"
      aria-label={fr.filters.dayLabel}
      className="flex gap-2 overflow-x-auto pb-1"
    >
      <FilterChip active={selected === null} onClick={() => onSelect(null)}>
        {fr.filters.allDays}
      </FilterChip>
      {days.map((day) => (
        <FilterChip
          key={day.key}
          active={selected === day.key}
          onClick={() => onSelect(day.key)}
        >
          {day.label}
        </FilterChip>
      ))}
    </div>
  );
}
