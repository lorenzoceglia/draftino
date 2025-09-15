import React, { useState } from "react";
import { Plus, Edit, Trash2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import type { Team } from "@/types";

export function TeamManager() {
  const { teams, addTeam, updateTeam, removeTeam } = useAuctionStore();
  const [newTeam, setNewTeam] = useState({
    name: "",
    budget: 500,
    isUserTeam: false,
  });
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const handleAddTeam = () => {
    if (newTeam.name && newTeam.budget > 0) {
      addTeam({
        name: newTeam.name,
        budget: newTeam.budget,
        initialBudget: newTeam.budget,
        isUserTeam: newTeam.isUserTeam,
      });
      setNewTeam({ name: "", budget: 500, isUserTeam: false });
    }
  };
  const handleEditTeam = (team: Team) => {
    updateTeam(team.id, team);
    setEditingTeam(null);
  };
  const toggleUserTeam = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      teams.forEach((t) => {
        if (t.id !== teamId && t.isUserTeam) {
          updateTeam(t.id, { isUserTeam: false });
        }
      });
      updateTeam(teamId, { isUserTeam: !team.isUserTeam });
    }
  };
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 flex-wrap">
            <Plus className="w-5 h-5" />
            Aggiungi Squadra
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder="Nome squadra"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
              />
            </div>
            <div className="w-32">
              <Input
                type="number"
                placeholder="Budget"
                value={newTeam.budget}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, budget: Number(e.target.value) })
                }
                min="1"
              />
            </div>
            <Button onClick={handleAddTeam} variant="field">
              Aggiungi
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Card
            key={team.id}
            className={team.isUserTeam ? "border-primary border-2" : ""}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  {team.isUserTeam && (
                    <Crown className="w-4 h-4 text-warning" />
                  )}
                  {editingTeam === team.id ? (
                    <Input
                      value={team.name}
                      onChange={(e) =>
                        updateTeam(team.id, { name: e.target.value })
                      }
                      onBlur={() => setEditingTeam(null)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && setEditingTeam(null)
                      }
                      autoFocus
                    />
                  ) : (
                    team.name
                  )}
                </CardTitle>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => toggleUserTeam(team.id)}
                    className={
                      team.isUserTeam ? "text-warning" : "text-muted-foreground"
                    }
                  >
                    <Crown className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setEditingTeam(team.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => removeTeam(team.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Budget rimanente:
                </span>
                <Badge
                  variant={
                    team.budget < 50
                      ? "destructive"
                      : team.budget < 100
                        ? "warning"
                        : "success"
                  }
                >
                  €{team.budget}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Giocatori:
                </span>
                <Badge variant="secondary">{team.players.length}</Badge>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{
                    width: `${
                      ((team.initialBudget - team.budget) /
                        team.initialBudget) *
                      100
                    }%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
