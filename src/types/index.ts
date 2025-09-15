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
export type UploadSource = "file" | "auto";
export interface Team {
  id: string;
  name: string;
  budget: number;
  initialBudget: number;
  isUserTeam: boolean;
  players: Player[];
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
  "3-4-3": ["P", "DC", "DC", ["DC","B"], "E", ["M","C"], "C", "E", ["W","A"],["W","A"], ["A","PC"]],
  "3-4-1-2": ["P", "DC", "DC", ["DC","B"], "E", ["M","C"], "C", "E", "T", ["A","PC"], ["A","PC"]],
  "3-4-2-1": ["P", "DC", "DC", ["DC","B"], "E", ["M","C"], "M", ["E","W"], "T", ["A","T"], ["A","PC"]],
  "3-5-2": ["P", "DC", "DC", ["DC","B"], "E", "M", ["M","C"], "C", ["E","W"], ["A","PC"], ["A","PC"]],
  "3-5-1-1": ["P", "DC", "DC", ["DC","B"], "M", "C", "M", ["E","W"], ["E","W"], ["A","T"], ["A","PC"]],
  "4-3-3": ["P", "DD", "DC", "DC", "DS", ["M","C"], "M", "C", ["W","A"], ["A","PC"], ["A","PC"]],
  "4-3-1-2": ["P", "DD", "DC", "DC", "DS", ["M","C"], "M", "C", "T", ["T","A","PC"], ["A","PC"]],
  "4-4-2": ["P", "DD", "DC", "DC", "DS", ["M","C"], "C", "E", ["E","W"], ["A","PC"], ["A","PC"]],
  "4-1-4-1": ["P", "DD", "DC", "DC", "DS", "M", "T", ["C","T"], ["E","W"], "W", ["A","PC"]],
  "4-4-1-1": ["P", "DD", "DC", "DC", "DS", "M", "C", ["E","W"], ["E","W"], ["T","A"], ["A","PC"]],
  "4-2-3-1": ["P", "DD", "DC", "DC", "DS", "M", ["M","C"], ["W","T"],"T" , ["W","A"], ["A","PC"]],
} as const;

export type FormationName = keyof typeof MANTRA_FORMATIONS;
