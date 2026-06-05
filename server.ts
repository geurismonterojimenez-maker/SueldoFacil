import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { SEO_TAB_CONFIGS, BLOG_POSTS } from "./src/constants";

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

let cachedIndexHtml: string | null = null;

async function startServer() {
  const app = express();
  app.use(express.json());
  const PORT = Number(process.env.PORT) || 3000;

  // Gemini API Key validation warning at startup
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("⚠️ [ADVERTENCIA] La variable GEMINI_API_KEY no está configurada o es inválida en el entorno. El Asistente de IA (chat) estará inhabilitado.");
  }

  // Redirect trailing slash URLs to non-trailing slash URLs for SEO (301 redirect)
  app.use((req, res, next) => {
    if (req.path.length > 1 && req.path.endsWith('/')) {
      const query = req.url.slice(req.path.length);
      const safePath = req.path.slice(0, -1) + query;
      return res.redirect(301, safePath);
    }
    next();
  });

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

  // FEED & RSS Auto-Detection endpoints for Google AdSense crawlers (in-feed ads / automated matching)
  const generateFeedXML = () => {
    return `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sueldo Fácil - Calculadoras Laborales y Financieras Dominicanas</title>
    <link>https://sueldofacil.com</link>
    <description>Blog Educativo y herramientas financieras de Ley 16-92 y normativas de la TSS en República Dominicana</description>
    <language>es-do</language>
    <lastBuildDate>Thu, 04 Jun 2026 13:28:28 GMT</lastBuildDate>
    <atom:link href="https://sueldofacil.com/feed.xml" rel="self" type="application/rss+xml" />
    
    <item>
      <title>Guía Definitiva sobre Prestaciones Laborales y Liquidación en República Dominicana</title>
      <link>https://sueldofacil.com/blog/guia-definitiva-liquidacion-prestaciones-dominicana</link>
      <guid>https://sueldofacil.com/blog/guia-definitiva-liquidacion-prestaciones-dominicana</guid>
      <pubDate>Mon, 01 Jun 2026 12:00:00 GMT</pubDate>
      <description><![CDATA[¿Te despidieron o deseas renunciar? Te enseñamos cómo se calculan el preaviso, la cesantía y otros derechos conforme a la Ley 16-92.]]></description>
    </item>
    
    <item>
      <title>Cómo calcula la DGII el Impuesto Sobre la Renta (ISR) para Empleados en RD</title>
      <link>https://sueldofacil.com/blog/como-funciona-impuesto-sobre-la-renta-personas-fisicas-rd</link>
      <guid>https://sueldofacil.com/blog/como-funciona-impuesto-sobre-la-renta-personas-fisicas-rd</guid>
      <pubDate>Fri, 15 May 2026 12:00:00 GMT</pubDate>
      <description><![CDATA[Te explicamos los tramos salariales vigentes para 2026 y cómo la deducción de la AFP reduce tus obligaciones impositivas.]]></description>
    </item>
  </channel>
</rss>`;
  };

  const handleFeedRequest = (req: any, res: any) => {
    res.set("Content-Type", "application/rss+xml; charset=utf-8");
    res.status(200).send(generateFeedXML());
  };

  app.get("/feed.xml", handleFeedRequest);
  app.get("/rss.xml", handleFeedRequest);
  app.get("/feed", handleFeedRequest);

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
    
    // SEO Dynamic Meta Injection
    app.get('*', (req, res) => {
      try {
        const indexPath = path.join(distPath, 'index.html');
        if (!cachedIndexHtml) {
          if (!fs.existsSync(indexPath)) {
            return res.status(404).send('Not Found');
          }
          cachedIndexHtml = fs.readFileSync(indexPath, 'utf8');
        }
        let html = cachedIndexHtml;

        // Extract path and find matching SEO
        const reqPath = req.path;
        let title = "SueldoFacil - Herramientas Laborales República Dominicana";
        let description = "Calculadora de prestaciones, salarios, ISR y asistencia de inteligencia artificial en la República Dominicana.";
        let canonical = `https://sueldofacil.com${reqPath}`;

        if (reqPath.startsWith('/blog/')) {
          const slug = reqPath.substring(6).replace(/\/$/, '');
          const post = BLOG_POSTS.find(p => p.slug === slug);
          if (post) {
            title = `${post.title} | SueldoFácil`;
            description = post.excerpt;
            canonical = `https://sueldofacil.com/blog/${slug}`;
          }
        } else {
          // Map pathname to tab name
          const cleanPath = reqPath.replace(/\/$/, '') || '/';
          // Find matching tab in SEO_TAB_CONFIGS
          const tabEntry = Object.entries(SEO_TAB_CONFIGS).find(([t, seo]) => {
            const tabCanonicalPath = new URL(seo.canonical || 'https://sueldofacil.com/').pathname;
            return tabCanonicalPath.replace(/\/$/, '') === cleanPath.replace(/\/$/, '');
          });
          
          if (tabEntry) {
            const seo = tabEntry[1];
            title = seo.title;
            description = seo.description;
            canonical = seo.canonical || canonical;
          }
        }

        // Replace original title tag
        html = html.replace(
          /<title>[^<]*<\/title>/,
          `<title>${title}</title>`
        );

        // Inject description, canonical, open graph, and twitter card tags before </head>
        const seoTags = `
    <meta name="description" content="${description}" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:type" content="${reqPath.startsWith('/blog/') ? 'article' : 'website'}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
`;
        html = html.replace('</head>', `${seoTags}\n</head>`);

        res.status(200).send(html);
      } catch (err) {
        console.error("SEO Injection Error:", err);
        res.sendFile(path.join(distPath, 'index.html'));
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
