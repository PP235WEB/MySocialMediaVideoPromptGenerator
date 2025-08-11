import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { PinDialog } from "@/components/ui/pin-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { promptRequestSchema, platformCategories, toneOptions, styleOptions, type PromptRequest, type Prompt } from "@shared/schema";
import { Video, Tag, Hash, Copy, RotateCcw, Plus, TriangleAlert, Clock, Check, Monitor, Palette, Volume2, Mic, MicOff, Languages, ArrowLeft, History, FileJson } from "lucide-react";

// Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface PromptResponse {
  prompts: Prompt[];
  generationTime: number;
  success: boolean;
  message?: string;
}

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [generationTime, setGenerationTime] = useState<number>(0);
  const [copiedPromptId, setCopiedPromptId] = useState<number | null>(null);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [translatedPrompts, setTranslatedPrompts] = useState<{[key: number]: string}>({});
  const [translatingPromptId, setTranslatingPromptId] = useState<number | null>(null);
  const [copiedTranslationId, setCopiedTranslationId] = useState<number | null>(null);
  const [copiedJsonId, setCopiedJsonId] = useState<number | null>(null);
  const { toast } = useToast();

  const form = useForm<PromptRequest>({
    resolver: zodResolver(promptRequestSchema),
    defaultValues: {
      platform: "" as any,
      category: "" as any,
      customCategory: "",
      videoContent: "",
      tones: [],
      styles: []
    }
  });

  const selectedPlatform = form.watch("platform");
  const selectedCategory = form.watch("category");
  const availableCategories = selectedPlatform ? platformCategories[selectedPlatform as keyof typeof platformCategories] : [];
  const showCustomCategoryField = selectedCategory === "diverses";

  // Reset category when platform changes
  const handlePlatformChange = (value: string) => {
    form.setValue("platform", value as "youtube" | "tiktok" | "instagram" | "facebook" | "linkedin");
    form.setValue("category", ""); // Reset category when platform changes
    form.setValue("customCategory", ""); // Reset custom category as well
  };

  // Show video content field only after category is selected
  const showVideoContentField = selectedCategory && selectedCategory !== "";

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'de-DE';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          const currentValue = form.getValues('videoContent') || '';
          const newValue = currentValue + (currentValue ? ' ' : '') + finalTranscript;
          form.setValue('videoContent', newValue);
        }
      };

      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Spracherkennung fehlgeschlagen",
          description: "Bitte überprüfen Sie Ihre Mikrofonberechtigung.",
        });
      };

      setRecognition(recognitionInstance);
    }
  }, [form, toast]);

  const toggleSpeechRecognition = () => {
    if (!recognition) {
      toast({
        variant: "destructive",
        title: "Spracherkennung nicht verfügbar",
        description: "Ihr Browser unterstützt keine Spracherkennung.",
      });
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  const generatePrompts = useMutation({
    mutationFn: async (data: PromptRequest): Promise<PromptResponse> => {
      const response = await apiRequest("POST", "/api/generate-prompts", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        setPrompts(data.prompts);
        setGenerationTime(data.generationTime);
        toast({
          title: "Prompts erfolgreich generiert!",
          description: `${data.prompts.length} Video-Prompts in ${data.generationTime.toFixed(1)}s erstellt.`,
        });
      } else {
        throw new Error(data.message || "Unbekannter Fehler");
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Fehler bei der Prompt-Generierung",
        description: error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten",
      });
    }
  });

  const onSubmit = (data: PromptRequest) => {
    generatePrompts.mutate(data);
  };

  const copyToClipboard = async (prompt: Prompt) => {
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

  const copyTranslation = async (prompt: Prompt) => {
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

  const copyAsJson = async (prompt: Prompt) => {
    try {
      const jsonData = {
        id: prompt.id,
        content: prompt.content,
        category: prompt.category,
        platform: prompt.platform,
        ...(translatedPrompts[prompt.id] && { translation: translatedPrompts[prompt.id] }),
        timestamp: new Date().toISOString()
      };
      
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopiedJsonId(prompt.id);
      toast({
        title: "JSON kopiert!",
        description: "Der Prompt wurde als JSON-Format in die Zwischenablage kopiert.",
      });
      setTimeout(() => setCopiedJsonId(null), 2000);
    } catch (error) {
      toast({
        title: "Fehler beim Kopieren",
        description: "Das JSON-Format konnte nicht kopiert werden.",
        variant: "destructive",
      });
    }
  };

  const translatePrompt = async (prompt: Prompt) => {

    setTranslatingPromptId(prompt.id);
    
    try {
      const response = await apiRequest("POST", "/api/translate-prompt", { content: prompt.content });
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
        throw new Error(data.message || "Übersetzung fehlgeschlagen");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Übersetzungsfehler",
        description: "Der Prompt konnte nicht übersetzt werden. Bitte versuche es erneut.",
        variant: "destructive",
      });
    } finally {
      setTranslatingPromptId(null);
    }
  };

  const regeneratePrompts = () => {
    const currentValues = form.getValues();
    if (currentValues.category && currentValues.videoContent) {
      generatePrompts.mutate(currentValues);
    }
  };

  const startNewSearch = () => {
    form.reset();
    setPrompts([]);
    setGenerationTime(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                <Video className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Social Media Video Prompt Generator</h1>
                <p className="text-sm text-muted-foreground">Generiere kreative Prompts für deine Social Media Videos</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPinDialog(true)}
                className="flex items-center"
              >
                <Clock className="h-4 w-4 mr-2" />
                Verlauf
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt Generator Form */}
        <Card className="mb-8 border-2 border-primary/20">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-card-foreground mb-2">Prompt-Parameter eingeben</h2>
              <p className="text-muted-foreground">Wähle zuerst eine Plattform, dann eine Kategorie und gib relevante Schlagworte ein, um maßgeschneiderte Video-Prompts zu generieren.</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                        <Monitor className="h-4 w-4 text-muted-foreground mr-2" />
                        Plattform auswählen
                      </FormLabel>
                      <Select onValueChange={handlePlatformChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="- Bitte auswählen -" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="tiktok">TikTok</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                        <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                        Kategorie auswählen
                      </FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={!selectedPlatform}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={selectedPlatform ? "- Bitte auswählen -" : "Erst Plattform wählen"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category.charAt(0).toUpperCase() + category.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {showCustomCategoryField && (
                  <FormField
                    control={form.control}
                    name="customCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                          <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                          Individuelle Kategorie eingeben
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="z.B. Comedy-Sketches, Fitness-Tipps, Kochrezepte..." 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

{showVideoContentField && (
                  <FormField
                    control={form.control}
                    name="videoContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                          <Hash className="h-4 w-4 text-muted-foreground mr-2" />
                          Inhalt und Ziel des Videos
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Textarea
                              placeholder="Beschreibe den gewünschten Inhalt und das Ziel deines Videos. Was soll vermittelt werden? Welche Botschaft oder welchen Nutzen soll das Video haben?"
                              className="resize-none pr-12"
                              rows={4}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className={`absolute top-2 right-2 h-8 w-8 p-0 ${
                                isListening 
                                  ? 'text-red-500 hover:text-red-600 animate-pulse' 
                                  : 'text-muted-foreground hover:text-black'
                              }`}
                              onClick={toggleSpeechRecognition}
                              title={isListening ? "Aufnahme stoppen" : "Spracherkennung starten"}
                            >
                              {isListening ? (
                                <MicOff className="h-4 w-4" />
                              ) : (
                                <Mic className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <p className="text-xs text-muted-foreground">Je detaillierter die Beschreibung, desto passender die generierten Prompts</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {showVideoContentField && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="tones"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                            <Volume2 className="h-4 w-4 text-muted-foreground mr-2" />
                            Tonarten (optional)
                          </FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {toneOptions.map((tone) => (
                              <FormField
                                key={tone}
                                control={form.control}
                                name="tones"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={tone}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(tone)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, tone])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== tone
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {tone.charAt(0).toUpperCase() + tone.slice(1)}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="styles"
                      render={() => (
                        <FormItem>
                          <FormLabel className="flex items-center text-sm font-medium text-card-foreground">
                            <Palette className="h-4 w-4 text-muted-foreground mr-2" />
                            Stilarten (optional)
                          </FormLabel>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {styleOptions.map((style) => (
                              <FormField
                                key={style}
                                control={form.control}
                                name="styles"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={style}
                                      className="flex flex-row items-center space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(style)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, style])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== style
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="text-sm font-normal cursor-pointer">
                                        {style.charAt(0).toUpperCase() + style.slice(1)}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full gradient-bg hover:opacity-90 text-white"
                  disabled={generatePrompts.isPending || !showVideoContentField}
                >
                  {generatePrompts.isPending ? (
                    <>
                      <LoadingSpinner className="h-4 w-4 mr-2" />
                      Prompts werden generiert...
                    </>
                  ) : (
                    <>
                      <Video className="h-4 w-4 mr-2" />
                      Prompts generieren
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {generatePrompts.isPending && (
          <Card className="p-8 text-center">
            <LoadingSpinner className="mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">Prompts werden generiert...</h3>
            <p className="text-slate-600">Bitte warten, während wir kreative Video-Prompts für dich erstellen.</p>
            <div className="mt-4 bg-slate-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full w-1/3 animate-pulse"></div>
            </div>
          </Card>
        )}

        {/* Error State */}
        {generatePrompts.isError && (
          <Card className="bg-red-50 border-red-200 p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <TriangleAlert className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-red-800 mb-2">Fehler bei der Prompt-Generierung</h3>
                <p className="text-red-700 mb-4">
                  {generatePrompts.error instanceof Error 
                    ? generatePrompts.error.message 
                    : "Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut."}
                </p>
                <Button 
                  onClick={regeneratePrompts}
                  variant="destructive"
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Erneut versuchen
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Prompt Results */}
        {prompts.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Generierte Video-Prompts</h2>
              <div className="text-sm text-slate-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Generiert in {generationTime.toFixed(1)}s</span>
              </div>
            </div>
            
            {prompts.map((prompt, index) => (
              <Card key={prompt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center mb-3">
                        <span className="bg-primary/10 text-primary text-xs font-medium px-2.5 py-1 rounded-full mr-3">
                          Prompt #{index + 1}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">{prompt.category}</span>
                      </div>
                      <p className="text-card-foreground leading-relaxed mb-4">
                        {prompt.content}
                      </p>
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
                          <LoadingSpinner className="h-4 w-4" />
                        ) : translatedPrompts[prompt.id] ? (
                          <Check className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Languages className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() => copyAsJson(prompt)}
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center"
                        title="Als JSON kopieren"
                      >
                        {copiedJsonId === prompt.id ? (
                          <Check className="h-4 w-4 text-purple-600" />
                        ) : (
                          <FileJson className="h-4 w-4" />
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

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button 
                onClick={regeneratePrompts}
                variant="outline"
                className="flex-1"
                disabled={generatePrompts.isPending}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Neue Prompts generieren
              </Button>
              <Button 
                onClick={startNewSearch}
                variant="outline"
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" />
                Neue Suche starten
              </Button>
            </div>
          </div>
        )}
      </main>
      {/* Footer */}
      <footer className="border-t border-slate-200 mt-12 bg-[#0f131a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 sm:mb-0">
              <p>&copy; 2025 Social Media Video Prompt Generator</p>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span className="text-gray-300">Powered by KI</span>
            </div>
          </div>
        </div>
      </footer>
      {/* PIN Dialog */}
      <PinDialog
        open={showPinDialog}
        onOpenChange={setShowPinDialog}
        onSuccess={() => {
          window.location.href = "/history";
        }}
      />
    </div>
  );
}
