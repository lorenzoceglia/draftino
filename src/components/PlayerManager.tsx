import React, { useState } from "react";
import {
  Upload,
  Search,
  SparklesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import { useToast } from "@/hooks/use-toast";
import type { ClassicRole, MantraRole, UploadSource } from "@/types";

export function PlayerManager() {
  const { mode, players, importPlayers } = useAuctionStore();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  const classicRoles: ClassicRole[] = ["P", "D", "C", "A"];
  const mantraRoles: MantraRole[] = [
    "P",
    "DS",
    "DC",
    "DD",
    "B",
    "E",
    "M",
    "C",
    "W",
    "T",
    "A",
    "PC",
  ];

  const availableRoles = mode === "classic" ? classicRoles : mantraRoles;

  const handleUpload = async (source: UploadSource, event?: React.ChangeEvent<HTMLInputElement>) => {
    let data: unknown;

    try {
      if (source === "file") {
        if (!event?.target.files?.[0]) return;
        const file = event.target.files[0];
        const text = await file.text();
        data = JSON.parse(text);
      } else if (source === "auto") {
        const response = await fetch("/listone.json");
        if (!response.ok) throw new Error("Impossibile caricare il file");
        data = await response.json();
      }

      if (Array.isArray(data)) {
        importPlayers(data);
        toast({
          title: "Import completato",
          description: `Importati ${data.length} giocatori`,
        });
      } else {
        throw new Error("Formato non valido");
      }
    } catch (error) {
      toast({
        title: "Errore",
        description: source === "file" ? "File JSON non valido" : "File JSON non valido o non trovato",
        variant: "destructive",
      });
    }
  };


  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.team.toLowerCase().includes(searchTerm.toLowerCase());
    const playerRoles = Array.isArray(player.role)
      ? player.role
      : [player.role];
    const matchesRole =
      selectedRole === "all" || playerRoles.includes(selectedRole as ClassicRole | MantraRole);
    return matchesSearch && matchesRole;
  });

  const availablePlayers = filteredPlayers.filter((p) => !p.assignedTo);
  const assignedPlayers = filteredPlayers.filter((p) => p.assignedTo);

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

  const renderPlayerRoles = (roles: string | string[]) => {
    const roleArray = Array.isArray(roles) ? roles : [roles];

    return (
      <div className="flex gap-1 flex-wrap">
        {roleArray.map((role, index) => (
          <Badge
            key={index}
            variant="role"
            className={`${getRoleColor(role)} text-xs`}
          >
            {role}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Gestione Giocatori
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-center flex-wrap">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Cerca giocatori..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">Tutti i ruoli</option>
              {availableRoles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <Button onClick={() => handleUpload('auto')} asChild variant="field">
                <label>
                  <SparklesIcon className="w-4 h-4" />
                  Import automatico
                </label>
              </Button>
              <Button asChild variant="field">
                <label>
                  <Upload className="w-4 h-4" />
                  Import da file
                  <input
                    type="file"
                    accept=".json"
                    onChange={(e) => handleUpload("file", e)}
                    className="hidden"
                  />
                </label>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {players.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nessun giocatore importato
            </h3>
            <p className="text-muted-foreground mb-4">
              Carica un file JSON con l'elenco dei giocatori per iniziare l'asta
            </p>
            <Button asChild variant="field">
              <label>
                <Upload className="w-4 h-4" />
                Importa giocatori
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => handleUpload("file", e)}
                  className="hidden"
                />
              </label>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-green-600">
                Giocatori Disponibili ({availablePlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {availablePlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {renderPlayerRoles(player.role)}
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.team}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">
                Giocatori Assegnati ({assignedPlayers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {assignedPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-3 border rounded-lg bg-muted/20"
                  >
                    <div className="flex items-center gap-3">
                      {renderPlayerRoles(player.role)}
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {player.team}
                        </p>
                      </div>
                    </div>
                    <Badge variant="success">€{player.price}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
