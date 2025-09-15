import { Upload, Download, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuctionStore } from "@/store/auctionStore";
import { useToast } from "@/hooks/use-toast";

export function AuctionHeader() {
  const { mode, setMode, exportState, importState, resetAuction } =
    useAuctionStore();
  const { toast } = useToast();

  const handleExport = () => {
    const data = exportState();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `asta-fantacalcio-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Export completato",
      description: "Lo stato dell'asta è stato salvato",
    });
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target?.result as string;
            importState(data);
            toast({
              title: "Import completato",
              description: "Lo stato dell'asta è stato ripristinato",
            });
          } catch (error) {
            toast({
              title: "Errore",
              description: "File non valido",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleReset = () => {
    if (
      confirm(
        "Sei sicuro di voler resettare tutto? Questa azione non può essere annullata.",
      )
    ) {
      resetAuction();
      toast({
        title: "Reset completato",
        description: "L'asta è stata resettata",
      });
    }
  };

  return (
    <header className="bg-gradient-field p-6 shadow-lg">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-primary-foreground">
              ⚽ Draftino
            </h1>
            <Badge variant="secondary" className="text-lg px-3 py-1">
              {mode === "classic" ? "Classic" : "Mantra"}
            </Badge>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={mode === "classic" ? "secondary" : "outline"}
              onClick={() => setMode("classic")}
              size="sm"
            >
              Classic
            </Button>
            <Button
              variant={mode === "mantra" ? "secondary" : "outline"}
              onClick={() => setMode("mantra")}
              size="sm"
            >
              Mantra
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleImport} variant="secondary" size="sm">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button onClick={handleExport} variant="secondary" size="sm">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleReset} variant="destructive" size="sm">
            <RefreshCw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
