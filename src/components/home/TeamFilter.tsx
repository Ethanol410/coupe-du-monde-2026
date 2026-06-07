import { fr } from "@/lib/labels/fr";

export interface TeamOption {
  id: string;
  name: string;
}

interface TeamFilterProps {
  teams: TeamOption[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

export function TeamFilter({ teams, selected, onSelect }: TeamFilterProps) {
  return (
    <label className="flex items-center gap-2">
      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        {fr.filters.teamLabel}
      </span>
      <select
        value={selected ?? ""}
        onChange={(event) =>
          onSelect(event.target.value === "" ? null : event.target.value)
        }
        aria-label={fr.filters.teamLabel}
        className="border-2 border-border bg-card px-3 py-1 font-display text-sm uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <option value="">{fr.filters.allTeams}</option>
        {teams.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}
