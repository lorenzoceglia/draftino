import React from "react";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import {
  MANTRA_FORMATIONS,
  type FormationName,
  type MantraRole,
  Player,
} from "@/types";

export function FormationAnalyzer() {
  const { mode, teams } = useAuctionStore();
  if (mode !== "mantra") return null;
  const userTeam = teams.find((team) => team.isUserTeam);
  if (!userTeam) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-warning" />
            Analisi Formazioni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Seleziona una squadra come "tua" (icona corona) per vedere l'analisi
            delle formazioni.
          </p>
        </CardContent>
      </Card>
    );
  }
  const getPlayersByRole = (role: MantraRole) => {
    return userTeam.players.filter((player) => {
      const playerRoles = Array.isArray(player.role)
        ? player.role
        : [player.role];
      return playerRoles.includes(role);
    });
  };
  const analyzeFormation = (formationName: FormationName) => {
    const formation = MANTRA_FORMATIONS[formationName];

    const analysis = {
      complete: true,
      missing: [] as MantraRole[],
      excess: [] as string[],
      lineup: [] as string[],
      coverage: 0,
    };

    const totalPositions = formation.length;
    let satisfiedPositions = 0;

    const assignedPlayers = new Set<Player>();
    const slotToPlayer = new Map<number, Player | null>();

    // Ordina gli slot mettendo prima quelli con meno alternative
    const sortedFormation = [...formation]
      .map((slot, index) => ({ slot, index }))
      .sort((a, b) => {
        const lenA = Array.isArray(a.slot) ? a.slot.length : 1;
        const lenB = Array.isArray(b.slot) ? b.slot.length : 1;
        return lenA - lenB;
      });

    for (const { slot, index } of sortedFormation) {
      const slotRoles = Array.isArray(slot) ? slot : [slot];

      // Trova il giocatore migliore per questo slot
      let bestPlayer: Player | null = null;

      for (const role of slotRoles) {
        const candidates = getPlayersByRole(role).filter(p => !assignedPlayers.has(p));

        if (candidates.length > 0) {
          // Scegli il giocatore con meno ruoli: lascia i multi-ruolo per slot flessibili
          candidates.sort((a, b) => {
            const aRoles = Array.isArray(a.role) ? a.role.length : 1;
            const bRoles = Array.isArray(b.role) ? b.role.length : 1;
            return aRoles - bRoles;
          });

          bestPlayer = candidates[0];
          break;
        }
      }

      slotToPlayer.set(index, bestPlayer);

      if (bestPlayer) {
        assignedPlayers.add(bestPlayer);
        satisfiedPositions++;
      } else {
        analysis.complete = false;
        analysis.missing.push(slotRoles[0]);
      }
    }

    // Popola lineup nell'ordine originale della formazione
    for (let i = 0; i < formation.length; i++) {
      const slot = formation[i];
      const player = slotToPlayer.get(i);
      const slotStr = Array.isArray(slot) ? slot.join('/') : slot;

      if (player) {
        const playerRoles = Array.isArray(player.role) ? player.role : [player.role];
        analysis.lineup.push(`${slotStr} (${playerRoles.join('/')})`);
      } else {
        analysis.lineup.push(`⚠️ ${slotStr}`);
      }
    }

    // Trova eventuali giocatori in eccesso
    const allRoles = new Set<MantraRole>();
    formation.forEach(slot => {
      if (Array.isArray(slot)) slot.forEach(r => allRoles.add(r));
      else allRoles.add(slot);
    });

    const allAssigned = new Set(assignedPlayers);

    allRoles.forEach(role => {
      const remaining = getPlayersByRole(role).filter(p => !allAssigned.has(p));
      remaining.forEach(p => {
        if (!assignedPlayers.has(p)) {
          assignedPlayers.add(p);
          const playerRoles = Array.isArray(p.role) ? p.role : [p.role];
          analysis.excess.push(playerRoles.join('/'));
        }
      });
    });

    analysis.coverage = (satisfiedPositions / totalPositions) * 100;
    return analysis;
  };

  const formationAnalyses = Object.keys(MANTRA_FORMATIONS).map(
    (formationName) => ({
      name: formationName as FormationName,
      analysis: analyzeFormation(formationName as FormationName),
    }),
  );
  const getRoleColor = (role: MantraRole) => {
    const roleColors: Record<MantraRole, string> = {
      P: "bg-yellow-500",
      DS: "bg-blue-500",
      DC: "bg-blue-600",
      DD: "bg-blue-500",
      B: "bg-green-400",
      E: "bg-green-600",
      M: "bg-green-500",
      C: "bg-green-500",
      W: "bg-red-400",
      T: "bg-red-600",
      A: "bg-red-500",
      PC: "bg-red-700",
    };
    return roleColors[role] || "bg-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          Analisi Formazioni - {userTeam.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {formationAnalyses.map(({ name, analysis }) => (
            <div
              key={name}
              className={`p-4 rounded-lg border-2 ${
                analysis.complete
                  ? "border-success bg-success/10"
                  : analysis.coverage > 70
                    ? "border-warning bg-warning/10"
                    : "border-destructive bg-destructive/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{name}</h4>
                {analysis.complete ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 bg-muted rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      analysis.coverage === 100
                        ? "bg-success"
                        : analysis.coverage > 70
                          ? "bg-warning"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${analysis.coverage}%` }}
                  />
                </div>
                <span className="text-sm font-medium">
                  {Math.round(analysis.coverage)}%
                </span>
              </div>

              {analysis.lineup.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-success font-medium mb-1">
                    Schierati:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.lineup.map((role, index) => (
                      <Badge
                        key={index}
                        variant={role.includes('⚠️')  ? 'destructive' : 'success'}
                        className="text-xs"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.missing.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-destructive font-medium mb-1">
                    Mancanti:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.missing.map((role, index) => (
                      <Badge
                        key={index}
                        variant="destructive"
                        className="text-xs"
                      >
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {analysis.excess.length > 0 && (
                <div>
                  <p className="text-sm text-warning font-medium mb-1">
                    Eccedenti:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {analysis.excess.map((role, index) => (
                      <Badge key={index} variant="warning" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="border-t pt-6">
          <h4 className="font-semibold mb-3">Rosa Attuale</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.entries(
              userTeam.players.reduce(
                (acc, player) => {
                  const playerRoles = Array.isArray(player.role)
                    ? player.role
                    : [player.role];
                  playerRoles.forEach((role) => {
                    acc[role] = (acc[role] || 0) + 1;
                  });
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([role, count]) => (
              <div key={role} className="text-center">
                <Badge
                  variant="role"
                  className={`${getRoleColor(role as MantraRole)} w-full justify-center`}
                >
                  {role}
                </Badge>
                <p className="text-sm mt-1">{count}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
