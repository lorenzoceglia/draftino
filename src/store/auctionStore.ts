import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuctionState, Team, Player, AuctionMode } from "@/types";

interface AuctionStore extends AuctionState {
  setMode: (mode: AuctionMode) => void;
  addTeam: (team: Omit<Team, "id" | "players">) => void;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  importPlayers: (players: Omit<Player, "id">[]) => void;
  assignPlayer: (playerId: string, teamId: string, price: number) => void;
  removePlayerFromTeam: (playerId: string) => void;
  exportState: () => string;
  importState: (state: string) => void;
  resetAuction: () => void;
}

const initialState: AuctionState = {
  mode: "classic",
  teams: [],
  players: [],
  currentBid: undefined,
};

export const useAuctionStore = create<AuctionStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      setMode: (mode) => set({ mode }),
      addTeam: (teamData) => {
        const id = crypto.randomUUID();
        const newTeam: Team = {
          ...teamData,
          id,
          players: [],
        };
        set((state) => ({
          teams: [...state.teams, newTeam],
        }));
      },
      updateTeam: (id, updates) =>
        set((state) => ({
          teams: state.teams.map((team) =>
            team.id === id ? { ...team, ...updates } : team,
          ),
        })),
      removeTeam: (id) =>
        set((state) => ({
          teams: state.teams.filter((team) => team.id !== id),
        })),
      importPlayers: (playersData) => {
        const players = playersData.map((player) => ({
          ...player,
          id: crypto.randomUUID(),
          role: Array.isArray(player.role) ? player.role : [player.role],
        }));
        set({ players });
      },
      assignPlayer: (playerId, teamId, price) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        const team = state.teams.find((t) => t.id === teamId);

        if (!player || !team || team.budget < price) return;

        const updatedPlayer = { ...player, price, assignedTo: teamId };
        const updatedTeam = {
          ...team,
          budget: team.budget - price,
          players: [...team.players, updatedPlayer],
        };

        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? updatedPlayer : p,
          ),
          teams: state.teams.map((t) => (t.id === teamId ? updatedTeam : t)),
        }));
      },
      removePlayerFromTeam: (playerId) => {
        const state = get();
        const player = state.players.find((p) => p.id === playerId);
        if (!player || !player.assignedTo || !player.price) return;

        const team = state.teams.find((t) => t.id === player.assignedTo);
        if (!team) return;

        const updatedPlayer = {
          ...player,
          price: undefined,
          assignedTo: undefined,
        };
        const updatedTeam = {
          ...team,
          budget: team.budget + player.price,
          players: team.players.filter((p) => p.id !== playerId),
        };

        set((state) => ({
          players: state.players.map((p) =>
            p.id === playerId ? updatedPlayer : p,
          ),
          teams: state.teams.map((t) => (t.id === team.id ? updatedTeam : t)),
        }));
      },
      exportState: () => {
        const state = get();
        return JSON.stringify({
          mode: state.mode,
          teams: state.teams,
          players: state.players,
        });
      },
      importState: (stateString) => {
        try {
          const state = JSON.parse(stateString);
          const migratedPlayers = (state.players || []).map((player: any) => ({
            ...player,
            role: Array.isArray(player.role) ? player.role : [player.role],
          }));
          set({
            mode: state.mode,
            teams: state.teams || [],
            players: migratedPlayers,
          });
        } catch (error) {
          console.error("Failed to import state:", error);
        }
      },

      resetAuction: () => set(initialState),
    }),
    {
      name: "auction-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
