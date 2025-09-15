import React, { useState } from "react";
import { Users, Database, Table, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuctionHeader } from "./AuctionHeader";
import { TeamManager } from "./TeamManager";
import { PlayerManager } from "./PlayerManager";
import { AuctionTable } from "./AuctionTable";
import { FormationAnalyzer } from "./FormationAnalyzer";
import { useAuctionStore } from "@/store/auctionStore";

type TabType = "teams" | "players" | "auction" | "formations";

export function Layout() {
  const [activeTab, setActiveTab] = useState<TabType>("teams");
  const { mode } = useAuctionStore();
  const tabs = [
    { id: "teams" as const, label: "Squadre", icon: Users },
    { id: "auction" as const, label: "Asta", icon: Table },
    { id: "players" as const, label: "Giocatori", icon: Database },
    ...(mode === "mantra"
      ? [{ id: "formations" as const, label: "Formazioni", icon: Target }]
      : []),
  ];
  const renderContent = () => {
    switch (activeTab) {
      case "teams":
        return <TeamManager />;
      case "players":
        return <PlayerManager />;
      case "auction":
        return <AuctionTable />;
      case "formations":
        return <FormationAnalyzer />;
      default:
        return <TeamManager />;
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <AuctionHeader />
      <main className="max-w-7xl mx-auto p-6">
        <nav className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "field" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </nav>
        <div className="transition-all duration-200">{renderContent()}</div>
      </main>
    </div>
  );
}
