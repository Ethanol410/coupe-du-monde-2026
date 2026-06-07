"use client";

import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fr } from "@/lib/labels/fr";

export interface TeamOption {
  id: string;
  name: string;
  flagUrl: string | null;
}

interface TeamFilterProps {
  teams: TeamOption[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

function Flag({ url }: { url: string | null }) {
  if (!url) {
    return (
      <span
        className="h-3.5 w-5 shrink-0 border border-border bg-secondary"
        aria-hidden
      />
    );
  }
  return (
    <Image
      src={url}
      alt=""
      width={20}
      height={14}
      className="h-3.5 w-5 shrink-0 border border-border object-cover"
      unoptimized
    />
  );
}

export function TeamFilter({ teams, selected, onSelect }: TeamFilterProps) {
  const byId = new Map(teams.map((team) => [team.id, team]));

  return (
    <div className="flex items-center gap-2">
      <span className="font-display text-xs uppercase tracking-widest text-muted-foreground">
        {fr.filters.teamLabel}
      </span>
      <Select
        value={selected}
        onValueChange={(value: string | null) => onSelect(value)}
      >
        <SelectTrigger
          aria-label={fr.filters.teamLabel}
          className="h-auto rounded-none border-2 border-border bg-card py-1 font-display text-sm uppercase tracking-wide"
        >
          <SelectValue>
            {(value: string | null) => {
              const team = value ? byId.get(value) : undefined;
              if (!team) return fr.filters.allTeams;
              return (
                <span className="flex items-center gap-2">
                  <Flag url={team.flagUrl} />
                  {team.name}
                </span>
              );
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>{fr.filters.allTeams}</SelectItem>
          {teams.map((team) => (
            <SelectItem key={team.id} value={team.id}>
              <Flag url={team.flagUrl} />
              {team.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
