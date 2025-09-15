export type AuctionMode = "classic" | "mantra";
export type ClassicRole = "P" | "D" | "C" | "A";
export type MantraRole =
  | "P"
  | "DS"
  | "DC"
  | "DD"
  | "B"
  | "E"
  | "M"
  | "C"
  | "W"
  | "T"
  | "A"
  | "PC";
export interface Player {
  id: string;
  name: string;
  team: string;
  role: (ClassicRole | MantraRole)[];
  price?: number;
  assignedTo?: string;
}
export interface Team {
  id: string;
  name: string;
  budget: number;
  initialBudget: number;
  isUserTeam: boolean;
  players: Player[];
}
export interface Formation {
  name: string;
  roles: MantraRole[];
  isComplete: boolean;
  missingRoles: MantraRole[];
}
export interface AuctionState {
  mode: AuctionMode;
  teams: Team[];
  players: Player[];
  currentBid?: {
    playerId: string;
    amount: number;
    teamId: string;
  };
}
export const MANTRA_FORMATIONS = {
  "3-4-3": ["P", "DS", "DC", "DD", "E", "M", "C", "B", "W", "T", "A"],
  "4-3-3": ["P", "DS", "DC", "DC", "DD", "M", "C", "B", "W", "T", "A"],
  "3-5-2": ["P", "DS", "DC", "DD", "E", "M", "C", "B", "W", "T", "A"],
  "4-4-2": ["P", "DS", "DC", "DC", "DD", "E", "M", "C", "B", "T", "A"],
} as const;

export type FormationName = keyof typeof MANTRA_FORMATIONS;
