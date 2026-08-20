import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { BLOG_POSTS, SEO_TAB_CONFIGS } from "./src/constants";

dotenv.config();

interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
}

const SEO_MAP: Record<string, SEOMetadata> = {
  "/": {
    title: "Calculadoras laborales RD 2026: sueldo y prestaciones",
    description: "Calcula gratis salario neto, prestaciones, liquidación, ISR, AFP y SFS en República Dominicana. Resultados desglosados con fórmulas y fuentes.",
    canonical: "https://sueldofacil.com/"
  },
  "/prestaciones": {
    title: "Calculadora de prestaciones laborales RD 2026",
    description: "Calcula gratis tu liquidación en RD: preaviso, cesantía, vacaciones y regalía proporcional. Obtén el desglose paso a paso y verifica la fórmula.",
    canonical: "https://sueldofacil.com/prestaciones/"
  },
  "/salario": {
    title: "Calculadora de Salario Neto RD 2026: AFP, SFS e ISR",
    description: "Calcula tu sueldo neto en República Dominicana desde el salario bruto. Consulta AFP, SFS, ISR, descuentos totales y pago mensual estimado.",
    canonical: "https://sueldofacil.com/salario/"
  },
  "/panel": {
    title: "Mi Panel de Banca Laboral y Bitácora del Trabajador RD - SueldoFácil",
    description: "Historial acumulativo de tus cotizaciones laborales dominicanas, planificador de fondo de ahorro y simulación de incremento salarial técnico.",
    canonical: "https://sueldofacil.com/panel/"
  },
  "/sobre-nosotros": {
    title: "Sobre Sueldo Fácil: propósito y metodología del proyecto",
    description: "Conoce por qué existe Sueldo Fácil, cómo se desarrollan sus calculadoras y qué límites tienen sus estimaciones laborales y financieras.",
    canonical: "https://sueldofacil.com/sobre-nosotros/"
  },
  "/politica-editorial": {
    title: "Política Editorial de Transparencia Matemática | Sueldo Fácil",
    description: "Consulta cómo se revisan las fórmulas, qué fuentes primarias se enlazan y cuáles son los límites de las calculadoras laborales de Sueldo Fácil.",
    canonical: "https://sueldofacil.com/politica-editorial/"
  },
  "/contacto": {
    title: "Contacto y Soporte Institucional | Sueldo Fácil",
    description: "Contacta a Sueldo Fácil para reportar errores, sugerir mejoras o solicitar una revisión editorial de una explicación o calculadora.",
    canonical: "https://sueldofacil.com/contacto/"
  },
  "/mi-diciembre": {
    title: "Calculadora Sueldo #13 (Doble Sueldo Pascual y Regalía) RD - SueldoFácil",
    description: "Estima de forma gratuita tu Regalía Pascual de fin de año en República Dominicana, completamente exenta de AFP, SFS e ISR.",
    canonical: "https://sueldofacil.com/mi-diciembre/"
  }
};

const NOINDEX_PATHS = new Set(["/panel", "/asistente-ia"]);

function isKnownPublicPath(urlPath: string): boolean {
  const cleanPath = urlPath.split("?")[0].replace(/\/+$/, "") || "/";
  if (SEO_MAP[cleanPath]) return true;
  if (["/feed.xml", "/rss.xml", "/feed"].includes(cleanPath)) return true;

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.slice("/blog/".length);
    return BLOG_POSTS.some((item) => item.slug === slug);
  }

  return Object.values(SEO_TAB_CONFIGS).some((config) => {
    try {
      return (new URL(config.canonical).pathname.replace(/\/+$/, "") || "/") === cleanPath;
    } catch {
      return false;
    }
  });
}

function getSEOMetadata(urlPath: string): SEOMetadata {
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, "") || "/";
  const directMatch = SEO_MAP[cleanPath];
  if (directMatch) return directMatch;

  if (cleanPath.startsWith("/blog/")) {
    const slug = cleanPath.slice("/blog/".length);
    const post = BLOG_POSTS.find((item) => item.slug === slug);
    if (post) {
      return {
        title: `${post.title} | SueldoFácil`,
        description: post.excerpt,
        canonical: `https://sueldofacil.com/blog/${post.slug}/`
      };
    }
  }

  const configMatch = Object.values(SEO_TAB_CONFIGS).find((config) => {
    try {
      const configPath = new URL(config.canonical).pathname.replace(/\/$/, "") || "/";
      return configPath === cleanPath;
    } catch {
      return false;
    }
  });

  if (configMatch) {
    return {
      title: configMatch.title,
      description: configMatch.description,
      canonical: configMatch.canonical
    };
  }

  return SEO_MAP["/"];
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildCrawlerContent(urlPath: string, seo: SEOMetadata): string {
  const cleanPath = urlPath.split("?")[0].replace(/\/$/, "") || "/";
  const postSlug = cleanPath.startsWith("/blog/") ? cleanPath.slice("/blog/".length) : "";
  const post = postSlug ? BLOG_POSTS.find((item) => item.slug === postSlug) : undefined;
  const navigation = Object.entries(SEO_TAB_CONFIGS)
    .filter(([key]) => !["dashboard", "ai_assistant"].includes(key))
    .map(([, config]) => `<li><a href="${escapeHtml(new URL(config.canonical).pathname)}">${escapeHtml(config.title)}</a></li>`)
    .join("");
  const articleLinks = BLOG_POSTS
    .map((item) => `<li><a href="/blog/${escapeHtml(item.slug)}/">${escapeHtml(item.title)}</a></li>`)
    .join("");
  const supplemental = post
    ? `<p>${escapeHtml(post.content)}</p>`
    : `<p>Esta herramienta ofrece una explicación práctica para trabajadores y empleadores de República Dominicana. Los resultados son orientativos y deben verificarse con las fuentes oficiales de la DGII, la TSS y el Código de Trabajo.</p>`;

  return `
    <main class="seo-route-content" style="max-width:1100px;margin:0 auto;padding:24px;font-family:Inter,Arial,sans-serif;color:#0f172a">
      <article>
        <h1>${escapeHtml(seo.title)}</h1>
        <p>${escapeHtml(seo.description)}</p>
        ${supplemental}
        <p>Última revisión editorial: julio de 2026. Sueldo Fácil presenta cálculos educativos y no sustituye asesoría legal, contable ni fiscal profesional.</p>
      </article>
      <nav aria-label="Herramientas y guías de Sueldo Fácil">
        <h2>Calculadoras y recursos relacionados</h2>
        <ul>${navigation}</ul>
        <h2>Guías laborales destacadas</h2>
        <ul>${articleLinks}</ul>
      </nav>
    </main>`;
}

function compactMetaText(value: string, maximum: number): string {
  if (value.length <= maximum) return value;
  const candidate = value.slice(0, maximum - 1);
  const boundary = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, boundary > maximum * 0.7 ? boundary : candidate.length).trim()}…`;
}

function injectSEOMetadata(html: string, urlPath: string): string {
  const sourceSeo = getSEOMetadata(urlPath);
  const seo = {
    ...sourceSeo,
    title: compactMetaText(sourceSeo.title, 65),
    description: compactMetaText(sourceSeo.description, 160)
  };
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, "") || "/";
  const robots = NOINDEX_PATHS.has(cleanPath) ? "noindex,follow" : "index,follow,max-image-preview:large";
  const metaTags = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${seo.canonical}" />
    
    <!-- Open Graph (Facebook / WhatsApp / Digital Cards) -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${seo.title}" />
    <meta property="og:description" content="${seo.description}" />
    <meta property="og:url" content="${seo.canonical}" />
    <meta property="og:site_name" content="SueldoFácil" />
    <meta property="og:image" content="https://sueldofacil.com/apple-touch-icon.png" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${seo.title}" />
    <meta name="twitter:description" content="${seo.description}" />
    
    <!-- JSON-LD Structured Data de Google -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "${seo.title}",
      "description": "${seo.description}",
      "url": "${seo.canonical}",
      "inLanguage": "es"
    }
    </script>
  `;

  // Remove any generic route tags before adding the route-specific set.
  let cleanHtml = html
    .replace(/<title>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta[^>]+name=["'](?:description|robots|twitter:card|twitter:title|twitter:description)["'][^>]*>\s*/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>\s*/gi, "")
    .replace(/<meta[^>]+property=["']og:(?:type|title|description|url|site_name|image)["'][^>]*>\s*/gi, "");
  const rootStart = cleanHtml.search(/<div id=["']root["']>/i);
  const bodyEnd = cleanHtml.search(/<\/body>/i);
  if (rootStart >= 0 && bodyEnd > rootStart) {
    cleanHtml = `${cleanHtml.slice(0, rootStart)}<div id="root">${buildCrawlerContent(urlPath, seo)}</div>\n  ${cleanHtml.slice(bodyEnd)}`;
  }
  return cleanHtml.replace("</head>", `${metaTags}\n  </head>`);
}

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
  app.disable("x-powered-by");
  app.use((req, res, next) => {
    if (req.hostname.toLowerCase() === "www.sueldofacil.com") {
      return res.redirect(301, `https://sueldofacil.com${req.originalUrl}`);
    }
    next();
  });
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    if (/\.[a-f0-9_-]{6,}\.(?:js|css|png|jpe?g|webp|svg|ico|woff2?)$/i.test(req.path)) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    } else {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    }
    next();
  });
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
    app.use(express.static(distPath, { index: false }));
    app.get('*', (req, res) => {
      try {
        if (!isKnownPublicPath(req.path)) {
          const rawHtml = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");
          const notFoundHtml = injectSEOMetadata(rawHtml, "/")
            .replace(/<title>[\s\S]*?<\/title>/i, "<title>Página no encontrada | SueldoFácil</title>")
            .replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, '<meta name="robots" content="noindex,follow" />')
            .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, "");
          return res.status(404).type("text/html").send(notFoundHtml);
        }
        if (req.path !== "/" && !req.path.endsWith("/")) {
          const queryIndex = req.originalUrl.indexOf("?");
          const query = queryIndex >= 0 ? req.originalUrl.slice(queryIndex) : "";
          return res.redirect(301, `${req.path}/${query}`);
        }
        const filePath = path.join(distPath, 'index.html');
        if (fs.existsSync(filePath)) {
          const rawHtml = fs.readFileSync(filePath, 'utf-8');
          const enrichedHtml = injectSEOMetadata(rawHtml, req.path);
          return res.status(200).type('text/html').send(enrichedHtml);
        }
      } catch (err) {
        console.error("SEO Prerender Error in Production routing:", err);
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
