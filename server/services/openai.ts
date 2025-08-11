import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const primaryApiKey = process.env.OPENAI_API_KEY;
const fallbackApiKey = process.env.REPLIT_APP_VPG;

let openai = new OpenAI({ 
  apiKey: primaryApiKey || fallbackApiKey || "default_key" 
});

// Function to create OpenAI client with specific API key
function createOpenAIClient(apiKey: string): OpenAI {
  return new OpenAI({ apiKey });
}

// Function to make OpenAI request with fallback
async function makeOpenAIRequest(requestFn: (client: OpenAI) => Promise<any>): Promise<any> {
  // Try primary API key first
  if (primaryApiKey) {
    try {
      const primaryClient = createOpenAIClient(primaryApiKey);
      return await requestFn(primaryClient);
    } catch (error: any) {
      console.warn("Primary API key failed, trying fallback:", error.message);
      
      // If primary fails and we have a fallback, try it
      if (fallbackApiKey) {
        try {
          const fallbackClient = createOpenAIClient(fallbackApiKey);
          return await requestFn(fallbackClient);
        } catch (fallbackError: any) {
          console.error("Fallback API key also failed:", fallbackError.message);
          throw fallbackError;
        }
      } else {
        throw error;
      }
    }
  } 
  // If no primary key, try fallback directly
  else if (fallbackApiKey) {
    const fallbackClient = createOpenAIClient(fallbackApiKey);
    return await requestFn(fallbackClient);
  }
  // No API keys available
  else {
    throw new Error("Keine OpenAI API-Keys verfügbar");
  }
}

export interface GeneratePromptsRequest {
  platform: string;
  category: string;
  customCategory?: string;
  videoContent: string;
  tones: string[];
  styles: string[];
}

export interface GeneratedPrompt {
  id: number;
  content: string;
  category: string;
}

export async function generateVideoPrompts(
  request: GeneratePromptsRequest
): Promise<GeneratedPrompt[]> {
  try {
    const platformTranslations = {
      "youtube": "YouTube",
      "tiktok": "TikTok",
      "instagram": "Instagram", 
      "facebook": "Facebook",
      "linkedin": "LinkedIn"
    };

    const categoryTranslations = {
      "tutorial": "Tutorial",
      "produkt-demo": "Produkt-Demonstration", 
      "storytelling": "Storytelling"
    };

    const platformName = platformTranslations[request.platform as keyof typeof platformTranslations] || request.platform;
    // Use custom category if provided and category is "diverses", otherwise use the category
    const effectiveCategory = request.category === "diverses" && request.customCategory 
      ? request.customCategory 
      : request.category;
    const categoryName = categoryTranslations[request.category as keyof typeof categoryTranslations] || effectiveCategory;

    const platformSpecs = {
      "youtube": "längere Videos (5-15 Minuten), detaillierte Erklärungen, SEO-optimierte Titel",
      "tiktok": "kurze, dynamische Videos (15-60 Sekunden), Trends, Hashtags, schnelle Cuts",
      "instagram": "quadratische oder vertikale Videos (15-90 Sekunden), ästhetisch ansprechend, Stories/Reels",
      "facebook": "Videos für verschiedene Altersgruppen (1-3 Minuten), Engagement-fokussiert, teilbar",
      "linkedin": "professionelle Inhalte (1-5 Minuten), Business-orientiert, Educational Content"
    };

    const platformSpec = platformSpecs[request.platform as keyof typeof platformSpecs] || "Social Media Videos";

    const tonesText = request.tones.length > 0 ? `Gewünschte Tonarten: ${request.tones.join(", ")}` : "";
    const stylesText = request.styles.length > 0 ? `Gewünschte Stilarten: ${request.styles.join(", ")}` : "";
    
    const systemPrompt = `Du bist ein Experte für Social Media Video-Content und hilfst dabei, kreative und ansprechende Video-Prompts zu erstellen. Deine Aufgabe ist es, genau 3 verschiedene, detaillierte Video-Prompts auf Deutsch zu generieren.

Plattform: ${platformName}
Kategorie: ${categoryName}
Inhalt und Ziel: ${request.videoContent}
${tonesText}
${stylesText}

Plattform-spezifische Anforderungen für ${platformName}: ${platformSpec}

Erstelle 3 verschiedene Video-Prompts, die:
- Optimal für ${platformName} zugeschnitten sind
- Spezifisch für die gewählte Kategorie ${categoryName} sind
- Den beschriebenen Inhalt und das Ziel des Videos umsetzen
- Die gewünschten Ton- und Stilarten berücksichtigen (falls angegeben)
- Den plattformspezifischen Anforderungen entsprechen
- Konkrete Handlungsanweisungen und Umsetzungsideen enthalten
- Engaging und für die Zielgruppe der Plattform optimiert sind
- Verschiedene kreative Ansätze für dasselbe Thema bieten

Antworte ausschließlich im JSON-Format mit folgendem Schema:
{
  "prompts": [
    {
      "id": 1,
      "content": "Detaillierte Beschreibung des ersten Video-Prompts...",
      "category": "${categoryName}"
    },
    {
      "id": 2, 
      "content": "Detaillierte Beschreibung des zweiten Video-Prompts...",
      "category": "${categoryName}"
    },
    {
      "id": 3,
      "content": "Detaillierte Beschreibung des dritten Video-Prompts...",
      "category": "${categoryName}"
    }
  ]
}`;

    const response = await makeOpenAIRequest((client) =>
      client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
        temperature: 0.8
      })
    );

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    if (!result.prompts || !Array.isArray(result.prompts) || result.prompts.length !== 3) {
      throw new Error("Ungültige Antwort von OpenAI API");
    }

    return result.prompts;

  } catch (error) {
    console.error("Fehler bei der Prompt-Generierung:", error);
    throw new Error(`Prompt-Generierung fehlgeschlagen: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}

export async function translateText(text: string): Promise<string> {
  try {
    const response = await makeOpenAIRequest((client) =>
      client.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Du bist ein professioneller Übersetzer. Übersetze den folgenden deutschen Text ins Englische. Behalte den Stil, Ton und die Bedeutung bei. Antworte nur mit der Übersetzung, ohne zusätzliche Erklärungen."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      })
    );

    const translation = response.choices[0]?.message?.content;
    
    if (!translation) {
      throw new Error("Keine Übersetzung erhalten");
    }

    return translation.trim();

  } catch (error: any) {
    console.error("OpenAI translation error:", error);
    throw new Error("Fehler bei der Übersetzung: " + error.message);
  }
}
