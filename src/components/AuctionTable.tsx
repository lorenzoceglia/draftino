import React, { useState } from "react";
import { Plus, Trash2, DollarSign, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useAuctionStore } from "@/store/auctionStore";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@/types";

export function AuctionTable() {
  const { teams, players, assignPlayer, removePlayerFromTeam } =
    useAuctionStore();
  const { toast } = useToast();
  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [bidAmount, setBidAmount] = useState<number>(1);
  const [selectedTeam, setSelectedTeam] = useState<string>("");
  const [openPlayerSelect, setOpenPlayerSelect] = useState(false);
  const [openTeamSelect, setOpenTeamSelect] = useState(false);

  const availablePlayers = players.filter((p) => !p.assignedTo);

  const handleAssignPlayer = () => {
    if (!selectedPlayer || !selectedTeam || bidAmount <= 0) {
      toast({
        title: "Errore",
        description:
          "Seleziona giocatore, squadra e inserisci un prezzo valido",
        variant: "destructive",
      });
      return;
    }

    const team = teams.find((t) => t.id === selectedTeam);
    if (!team || team.budget < bidAmount) {
      toast({
        title: "Budget insufficiente",
        description: "La squadra non ha abbastanza crediti",
        variant: "destructive",
      });
      return;
    }

    assignPlayer(selectedPlayer, selectedTeam, bidAmount);

    const player = players.find((p) => p.id === selectedPlayer);
    const teamObj = teams.find((t) => t.id === selectedTeam);

    if (player && teamObj) {
      toast({
        title: "Giocatore assegnato!",
        description: `${player.name} a ${teamObj.name} per €${bidAmount}`,
        variant: teamObj.isUserTeam ? "default" : undefined,
      });
    }

    setSelectedPlayer("");
    setBidAmount(1);
    setSelectedTeam("");
  };

  const handleRemovePlayer = (playerId: string) => {
    removePlayerFromTeam(playerId);
    const player = players.find((p) => p.id === playerId);
    toast({
      title: "Giocatore rimosso",
      description: `${player?.name} è stato rimosso dalla squadra`,
    });
  };

  const getRoleColor = (role: string) => {
    const roleColors: Record<string, string> = {
      P: "bg-yellow-500",
      D: "bg-blue-500",
      DS: "bg-blue-500",
      DC: "bg-blue-600",
      DD: "bg-blue-500",
      C: "bg-green-500",
      M: "bg-green-500",
      E: "bg-green-600",
      B: "bg-green-400",
      A: "bg-red-500",
      W: "bg-red-400",
      T: "bg-red-600",
      PC: "bg-red-700",
    };
    return roleColors[role] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Assegna Giocatore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Popover
                open={openPlayerSelect}
                onOpenChange={setOpenPlayerSelect}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openPlayerSelect}
                    className="w-full justify-between"
                  >
                    {selectedPlayer
                      ? (() => {
                          const player = availablePlayers.find(
                            (p) => p.id === selectedPlayer,
                          );
                          return player
                            ? `${player.name} (${player.role})`
                            : "Seleziona giocatore";
                        })()
                      : "Seleziona giocatore"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cerca giocatore..." />
                    <CommandList>
                      <CommandEmpty>Nessun giocatore trovato.</CommandEmpty>
                      <CommandGroup>
                        {availablePlayers.map((player) => (
                          <CommandItem
                            key={player.id}
                            value={`${player.name} ${player.team} ${player.role}`}
                            onSelect={() => {
                              setSelectedPlayer(player.id);
                              setOpenPlayerSelect(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedPlayer === player.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {(Array.isArray(player.role)
                                  ? player.role
                                  : [player.role]
                                ).map((role, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="role"
                                    className={`${getRoleColor(role)} text-xs`}
                                  >
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                              <span>{player.name}</span>
                              <span className="text-sm text-muted-foreground">
                                - {player.team}
                              </span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Popover open={openTeamSelect} onOpenChange={setOpenTeamSelect}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openTeamSelect}
                    className="w-full justify-between"
                  >
                    {selectedTeam
                      ? (() => {
                          const team = teams.find((t) => t.id === selectedTeam);
                          return team
                            ? `${team.name} (€${team.budget})`
                            : "Seleziona squadra";
                        })()
                      : "Seleziona squadra"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Cerca squadra..." />
                    <CommandList>
                      <CommandEmpty>Nessuna squadra trovata.</CommandEmpty>
                      <CommandGroup>
                        {teams.map((team) => (
                          <CommandItem
                            key={team.id}
                            value={team.name}
                            onSelect={() => {
                              setSelectedTeam(team.id);
                              setOpenTeamSelect(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedTeam === team.id
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                            <div className="flex items-center gap-2">
                              <span>{team.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                €{team.budget}
                              </Badge>
                              {team.isUserTeam && (
                                <Badge variant="warning" className="text-xs">
                                  TUA
                                </Badge>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Input
                type="number"
                placeholder="Prezzo"
                value={bidAmount}
                onChange={(e) => setBidAmount(Number(e.target.value))}
                min="1"
              />
            </div>
            <Button
              onClick={handleAssignPlayer}
              variant="success"
              className="w-full"
            >
              <Plus className="w-4 h-4" />
              Assegna
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${teams.length + 1}, minmax(250px, 1fr))`,
            }}
          >
            <div className="bg-muted p-4 font-semibold border-r">Squadre</div>
            {teams.map((team) => (
              <div
                key={team.id}
                className={`p-4 font-semibold border-r ${team.isUserTeam ? "bg-primary/10 border-primary" : "bg-muted"}`}
              >
                <div className="flex items-center gap-2">
                  {team.name}
                  {team.isUserTeam && (
                    <Badge variant="warning" className="text-xs">
                      TUA
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Budget: €{team.budget}
                </div>
              </div>
            ))}

            {Array.from({
              length: Math.max(...teams.map((t) => t.players.length), 1),
            }).map((_, rowIndex) => (
              <React.Fragment key={rowIndex}>
                <div className="p-4 border-r border-b bg-muted/50 text-sm font-medium">
                  Giocatore {rowIndex + 1}
                </div>
                {teams.map((team) => {
                  const player = team.players[rowIndex];
                  return (
                    <div
                      key={team.id}
                      className="p-4 border-r border-b min-h-[80px]"
                    >
                      {player ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {(Array.isArray(player.role)
                                  ? player.role
                                  : [player.role]
                                ).map((role, idx) => (
                                  <Badge
                                    key={idx}
                                    variant="role"
                                    className={getRoleColor(role)}
                                  >
                                    {role}
                                  </Badge>
                                ))}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {player.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {player.team}
                                </p>
                              </div>
                            </div>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemovePlayer(player.id)}
                              className="h-6 w-6"
                            >
                              <Trash2 className="w-3 h-3 text-destructive" />
                            </Button>
                          </div>
                          <div className="flex justify-between items-center">
                            <Badge variant="success" className="text-xs">
                              €{player.price}
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground text-sm py-4">
                          -
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
