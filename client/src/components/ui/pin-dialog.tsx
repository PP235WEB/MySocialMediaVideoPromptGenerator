import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PinDialog({ open, onOpenChange, onSuccess }: PinDialogProps) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate slight delay for security appearance
    await new Promise(resolve => setTimeout(resolve, 500));

    if (pin === "55555") {
      onSuccess();
      onOpenChange(false);
      setPin("");
      toast({
        title: "Zugang gewährt",
        description: "Pin korrekt eingegeben.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Falscher Pin",
        description: "Bitte geben Sie den korrekten Pin ein.",
      });
      setPin("");
    }
    
    setIsLoading(false);
  };

  const handleClose = () => {
    setPin("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-card-foreground">
            <Lock className="h-5 w-5 mr-2 text-primary" />
            Pin-Eingabe
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin" className="text-card-foreground">
              Bitte geben Sie den Pin ein:
            </Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Pin eingeben..."
              className="text-center text-lg tracking-widest"
              maxLength={5}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button
              type="submit"
              disabled={isLoading || pin.length !== 5}
              className="gradient-bg hover:opacity-90 text-white"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Prüfen...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Bestätigen
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}