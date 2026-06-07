import { fr, groupLabel, stageShortLabel } from "@/lib/labels/fr";
import type { Stage } from "@/lib/providers/types";
import { FilterChip } from "./FilterChip";

interface GroupFilterProps {
  groups: string[];
  stages: Stage[];
  /** "" = tout, "group:A", "stage:FINAL". */
  selected: string;
  onSelect: (key: string) => void;
}

export function GroupFilter({ groups, stages, selected, onSelect }: GroupFilterProps) {
  return (
    <div
      role="group"
      aria-label={fr.filters.groupLabel}
      className="flex flex-wrap gap-2"
    >
      <FilterChip active={selected === ""} onClick={() => onSelect("")}>
        {fr.filters.allGroups}
      </FilterChip>
      {groups.map((group) => (
        <FilterChip
          key={group}
          active={selected === `group:${group}`}
          onClick={() => onSelect(`group:${group}`)}
        >
          {groupLabel(group)}
        </FilterChip>
      ))}
      {stages.map((stage) => (
        <FilterChip
          key={stage}
          active={selected === `stage:${stage}`}
          onClick={() => onSelect(`stage:${stage}`)}
        >
          {stageShortLabel(stage)}
        </FilterChip>
      ))}
    </div>
  );
}
