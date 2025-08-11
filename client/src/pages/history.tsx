import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Clock, Copy, Check, History, TriangleAlert, ArrowLeft, Languages } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface SavedPrompt {
  id: number;
  content: string;
  platform: string;
  category: string;
  customCategory?: string;
  videoContent: string;
  tones: string[];
  styles: string[];
  generationTime: number;
  createdAt: string;
}

interface PromptsResponse {
  success: boolean;
  prompts: SavedPrompt[];
  message?: string;
}

export default function HistoryPage() {
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [translatedPrompts, setTranslatedPrompts] = useState<{[key: number]: string}>({});
  const [translatingPromptId, setTranslatingPromptId] = useState<number | null>(null);
  const [copiedTranslationId, setCopiedTranslationId] = useState<number | null>(null);
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery<PromptsResponse>({
    queryKey: ["/api/prompts"],
    queryFn: async () => {
      const response = await fetch("/api/prompts?limit=50");
      return response.json();
    },
  });

  const copyToClipboard = async (prompt: SavedPrompt) => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      setCopiedPromptId(prompt.id);
      toast({
        title: "In Zwischenablage kopiert!",
        description: "Der Prompt wurde erfolgreich kopiert.",
      });
      setTimeout(() => setCopiedPromptId(null), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Kopieren fehlgeschlagen",
        description: "Der Prompt konnte nicht kopiert werden. Bitte versuche es erneut.",
      });
    }
  };

  const copyTranslation = async (prompt: SavedPrompt) => {
    try {
      await navigator.clipboard.writeText(translatedPrompts[prompt.id]);
      setCopiedTranslationId(prompt.id);
      toast({
        title: "Übersetzung kopiert!",
        description: "Die englische Übersetzung wurde in die Zwischenablage kopiert.",
      });
      setTimeout(() => setCopiedTranslationId(null), 2000);
    } catch (error) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Die Übersetzung konnte nicht kopiert werden.",
        variant: "destructive",
      });
    }
  };

  const translatePrompt = async (prompt: SavedPrompt) => {
    setTranslatingPromptId(prompt.id);
    
    try {
      const response = await fetch("/api/translate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: prompt.content }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTranslatedPrompts(prev => ({
          ...prev,
          [prompt.id]: data.translation
        }));
        
        toast({
          title: "Übersetzung erfolgreich!",
          description: "Der Prompt wurde ins Englische übersetzt.",
        });
      } else {
        toast({
          title: "Übersetzung fehlgeschlagen",
          description: data.message || "Ein Fehler ist bei der Übersetzung aufgetreten.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Übersetzung fehlgeschlagen",
        description: "Ein Fehler ist bei der Übersetzung aufgetreten.",
        variant: "destructive",
      });
    } finally {
      setTranslatingPromptId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPlatformDisplayName = (platform: string) => {
    const platformMap: Record<string, string> = {
      "youtube": "YouTube",
      "tiktok": "TikTok",
      "instagram": "Instagram",
      "facebook": "Facebook",
      "linkedin": "LinkedIn"
    };
    return platformMap[platform] || platform;
  };

  const getCategoryDisplayName = (category: string, customCategory?: string) => {
    // If category is "diverses" and customCategory exists, show the custom category
    if (category === "diverses" && customCategory) {
      return customCategory;
    }
    // Otherwise capitalize first letter for display
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <History className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Prompt-Verlauf</h1>
                <p className="text-sm text-muted-foreground">Alle bisher generierten Video-Prompts</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <a href="/" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Generator
                </a>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <Card className="p-8 text-center border-2 border-primary/20">
            <LoadingSpinner className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Prompts werden geladen...</h3>
            <p className="text-muted-foreground">Bitte warten, während wir deine gespeicherten Prompts abrufen.</p>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="bg-destructive/10 border-destructive/20 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TriangleAlert className="h-5 w-5 text-destructive" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-destructive mb-2">Fehler beim Laden</h3>
                <p className="text-destructive/80 mb-4">
                  Die Prompts konnten nicht geladen werden. Bitte versuche es erneut.
                </p>
                <Button 
                  onClick={() => refetch()}
                  variant="destructive"
                  size="sm"
                >
                  Erneut versuchen
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Success State - No Prompts */}
        {data?.success && data.prompts.length === 0 && (
          <Card className="p-8 text-center border-2 border-primary/20">
            <History className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">Noch keine Prompts generiert</h3>
            <p className="text-muted-foreground mb-4">
              Du hast noch keine Video-Prompts erstellt. Starte jetzt und generiere deine ersten Prompts!
            </p>
            <Button asChild className="gradient-bg hover:opacity-90 text-white">
              <a href="/">Prompt generieren</a>
            </Button>
          </Card>
        )}

        {/* Success State - With Prompts */}
        {data?.success && data.prompts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-card-foreground">
                {data.prompts.length} Gespeicherte Prompts
              </h2>
              <Button 
                onClick={() => refetch()}
                variant="outline"
                size="sm"
              >
                Aktualisieren
              </Button>
            </div>
            
            {data.prompts.map((prompt) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow border-2 border-primary/10 hover:border-primary/20">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <span className="bg-primary/20 text-primary text-xs font-medium px-2.5 py-1 rounded-full">
                            {getPlatformDisplayName(prompt.platform)}
                          </span>
                          <span className="bg-accent/20 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                            {getCategoryDisplayName(prompt.category, prompt.customCategory)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(prompt.createdAt)}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {(prompt.generationTime / 1000).toFixed(1)}s
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Video-Inhalt:
                        </span>
                        <p className="text-sm text-card-foreground mt-1">{prompt.videoContent.length > 100 ? prompt.videoContent.substring(0, 100) + "..." : prompt.videoContent}</p>
                        
                        {(prompt.tones.length > 0 || prompt.styles.length > 0) && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {prompt.tones.map((tone) => (
                              <span key={tone} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded">
                                {tone}
                              </span>
                            ))}
                            {prompt.styles.map((style) => (
                              <span key={style} className="bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                                {style}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-muted/30 rounded-md p-3">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Generierter Prompt:
                        </span>
                        <p className="text-card-foreground leading-relaxed mt-2">
                          {prompt.content}
                        </p>
                      </div>
                      
                      {translatedPrompts[prompt.id] && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-muted-foreground">Englische Übersetzung:</p>
                            <Button
                              onClick={() => copyTranslation(prompt)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                              title="Übersetzung kopieren"
                            >
                              {copiedTranslationId === prompt.id ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                          <p className="text-card-foreground leading-relaxed text-sm">
                            {translatedPrompts[prompt.id]}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => copyToClipboard(prompt)}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                        title="In Zwischenablage kopieren"
                      >
                        {copiedPromptId === prompt.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => translatePrompt(prompt)}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                        title={translatedPrompts[prompt.id] ? "Bereits übersetzt" : "Ins Englische übersetzen"}
                        disabled={translatingPromptId === prompt.id || translatedPrompts[prompt.id]}
                      >
                        {translatingPromptId === prompt.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                        ) : translatedPrompts[prompt.id] ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Languages className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {copiedPromptId === prompt.id && (
                    <div className="mt-3 flex items-center text-green-600 text-sm">
                      <Check className="h-4 w-4 mr-2" />
                      <span>In Zwischenablage kopiert!</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-slate-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 sm:mb-0">
              <p>&copy; 2025 Social Media Video Prompt Generator</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="/" className="text-gray-300 hover:text-gray-100 transition-colors">
                Neue Prompts generieren
              </a>
              <span className="text-gray-400">|</span>
              <span className="text-gray-300">Powered by OpenAI GPT</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}