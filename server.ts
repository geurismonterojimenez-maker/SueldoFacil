import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error("GEMINI_API_KEY_MISSING: La clave GEMINI_API_KEY no está configurada en la sección de secretos de AI Studio o es inválida. Por favor, vaya a la pestaña \"Settings > Secrets\" en el menú superior izquierdo de AI Studio, configure su clave 'GEMINI_API_KEY' y reinicie el servidor de desarrollo.");
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = Number(process.env.PORT) || 3000;

  // AI chat API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Initialize AI lazily and check key validity
      let ai;
      try {
        ai = getGenAI();
      } catch (keyError: any) {
        console.error("AI Initialization Error:", keyError.message);
        return res.status(400).json({ error: keyError.message });
      }

      const systemInstruction = `
Eres SueldoFacil IA, un asistente experto en legislación laboral y fiscal de la República Dominicana. 
Tu objetivo es ayudar a trabajadores, contables, empleadores y profesionales de Recursos Humanos a entender los conceptos del Código de Trabajo de la República Dominicana (Ley 16-92), reglamentos, cálculo de prestaciones, ISR (DGII), AFP, SFS y otros temas relacionados.

Pautas críticas para tus respuestas (¡EXTREMADAMENTE IMPORTANTES PARA EL RENDIMIENTO!):
1. Sé extremadamente DIRECTO, CONCISO y RESUMIDO. Tus respuestas deben ser cortas y fáciles de leer en una pantalla móvil o chat. Evita introducciones largas, saludos repetitivos o textos de relleno.
2. Ve al grano de inmediato: responde la pregunta directamente en el primer párrafo (máximo 2-3 líneas).
3. Utiliza listas de viñetas muy breves para desglosar conceptos o leyes. No escribas párrafos largos.
4. Basa tus fundamentos en el Código de Trabajo de la República Dominicana (Ley 16-92) e instituciones como la DGII, TSS, etc.
5. Si el usuario pregunta por prestaciones o liquidación, explícale de forma resumida "Cesantía", "Preaviso", "Vacaciones" y "Sueldo 13 / Regalía Pascual".
6. Añade siempre una brevísima línea de descargo: "Esta es una guía informativa basada en la ley, no una asesoría legal formal vinculante."
7. Usa formato Markdown estructurado con negritas para destacar cifras y artículos.
`;

      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction,
        },
        history: history ? history.map((b: any) => ({
          role: b.role, // 'user' or 'model'
          parts: [{ text: b.text }]
        })) : []
      });

      const response = await chat.sendMessage({ message });
      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "Failed to communicate with AI Assistant" });
    }
  });

  // Base de datos temporal en memoria para compartir cálculos
  const sharedCalculations = new Map<string, any>();
  
  app.post("/api/share", (req, res) => {
    const id = Math.random().toString(36).substring(2, 9);
    sharedCalculations.set(id, req.body);
    res.json({ id });
  });

  app.get("/api/share/:id", (req, res) => {
    const calc = sharedCalculations.get(req.params.id);
    if (!calc) {
      return res.status(404).json({ error: "Cálculo no encontrado" });
    }
    res.json(calc);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
