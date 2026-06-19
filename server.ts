import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

interface SEOMetadata {
  title: string;
  description: string;
  canonical: string;
}

const SEO_MAP: Record<string, SEOMetadata> = {
  "/": {
    title: "SueldoFácil - Calculadoras Laborales y Financieras Dominicana",
    description: "Calculadora de prestaciones laborales, sueldo neto mensual, horas extras y retenciones de ley (AFP, SFS, ISR) en República Dominicana conforme a la Ley 16-92 y normativas de la DGII.",
    canonical: "https://sueldofacil.com/"
  },
  "/prestaciones": {
    title: "Calculadora de Prestaciones Laborales y Liquidación RD - SueldoFácil",
    description: "Calcula tus prestaciones de ley RD (cesantía, preaviso, regalía y vacaciones) conforme al Código de Trabajo (Ley 16-92) dominicano.",
    canonical: "https://sueldofacil.com/prestaciones/"
  },
  "/salario": {
    title: "Calculadora de Salario Neto Dominicano y Retenciones 2026 - SueldoFácil",
    description: "Desglosa tus deducciones mensuales TSS (AFP 2.87%, SFS 3.04%) e Impuesto Sobre la Renta (ISR) de la DGII según tu nivel salarial en RD.",
    canonical: "https://sueldofacil.com/salario/"
  },
  "/isr": {
    title: "Calculadora de Impuesto Sobre la Renta (ISR) RD - SueldoFácil",
    description: "Calcula la retención mensual del Impuesto Sobre la Renta (ISR) de la DGII según la escala y tramos impositivos vigentes en República Dominicana.",
    canonical: "https://sueldofacil.com/isr/"
  },
  "/afp-sfs": {
    title: "Calculadora de AFP y SFS (Seguridad Social) RD - SueldoFácil",
    description: "Calcula los descuentos mensuales obligatorios de Seguro Familiar de Salud (SFS 3.04%) y Administradora de Fondos de Pensiones (AFP 2.87%) en República Dominicana.",
    canonical: "https://sueldofacil.com/afp-sfs/"
  },
  "/costos": {
    title: "Calculadora de Costo Laboral de Empleados - SueldoFácil",
    description: "Calcula el costo total real de contratación en República Dominicana, incluyendo aportes TSS patronales (7.10% AFP, 7.09% SFS, ARL) y provisiones de ley.",
    canonical: "https://sueldofacil.com/costos/"
  },
  "/horas-extras": {
    title: "Calculadora de Horas Extras y Recargos de Nocturnidad RD - SueldoFácil",
    description: "Monitorea y calcula con exactitud las horas de trabajo adicionales diurnas, nocturnas y días feriados con recargo del 35%, 50% y 100%.",
    canonical: "https://sueldofacil.com/horas-extras/"
  },
  "/nominas": {
    title: "Calculadora de Nómina Colectiva RD - Registro y Deducciones TSS - SueldoFácil",
    description: "Administra y simula deducciones de nóminas de varios empleados de manera unificada bajo el Código Tributario dominicano.",
    canonical: "https://sueldofacil.com/nominas/"
  },
  "/comparador": {
    title: "Comparador de Ofertas Laborales y Beneficios en RD - SueldoFácil",
    description: "Compara de forma interactiva dos ofertas de empleo descontando impuestos nacionales de ley e integrando beneficios anuales.",
    canonical: "https://sueldofacil.com/comparador/"
  },
  "/documentos": {
    title: "Generador de Cartas Laborales y Contratos Legales de RD - SueldoFácil",
    description: "Genera al instante contratos fijos, cartas de renuncia con preaviso, cartas de despido y reclamos de aumento listos para imprimir.",
    canonical: "https://sueldofacil.com/documentos/"
  },
  "/asistente-ia": {
    title: "Asistente de Inteligencia Artificial para Ley de Trabajo Dominicana - SueldoFácil",
    description: "Asistente virtual conversacional experto en el Código de Trabajo del país y normativas de la TSS para evacuar consultas impositivas.",
    canonical: "https://sueldofacil.com/asistente-ia/"
  },
  "/blog": {
    title: "Guías, Tutoriales y Consejos Laborales de República Dominicana - SueldoFácil",
    description: "Infórmate de forma amigable sobre el impuesto de las bonificaciones, doble sueldo, despidos intempestivos y reglamentos TSS de vigencia activa.",
    canonical: "https://sueldofacil.com/blog/"
  },
  "/panel": {
    title: "Mi Panel de Banca Laboral y Bitácora del Trabajador RD - SueldoFácil",
    description: "Historial acumulativo de tus cotizaciones laborales dominicanas, planificador de fondo de ahorro y simulación de incremento salarial técnico.",
    canonical: "https://sueldofacil.com/panel/"
  },
  "/salarios-profesion": {
    title: "Guía de Salarios por Profesión en República Dominicana - SueldoFácil",
    description: "Consulta cuánto gana un programador, contador, médico o abogado en RD. Estadísticas salariales reales y tendencias por provincia de vigencia activa.",
    canonical: "https://sueldofacil.com/salarios-profesion/"
  },
  "/calcular-aumento": {
    title: "Calculadora de Aumento Salarial República Dominicana - SueldoFácil",
    description: "Calcula en cuánto incrementa tu salario neto real tras un aumento de sueldo bruto. Desglose inmediato con impuestos (SFS, AFP, ISR).",
    canonical: "https://sueldofacil.com/calcular-aumento/"
  },
  "/mi-diciembre": {
    title: "Calculadora Sueldo #13 (Doble Sueldo Pascual y Regalía) RD - SueldoFácil",
    description: "Estima de forma gratuita tu Regalía Pascual de fin de año en República Dominicana, completamente exenta de AFP, SFS e ISR.",
    canonical: "https://sueldofacil.com/mi-diciembre/"
  },
  "/biblioteca": {
    title: "Biblioteca de Legislación de Trabajo Dominicana - SueldoFácil",
    description: "Estudia las regulaciones del Código de Trabajo dominicano de manera simple. Guías sobre cesantía, preaviso, horas extras y vacaciones oficiales.",
    canonical: "https://sueldofacil.com/biblioteca/"
  },
  "/analizar-recibos": {
    title: "Auditor de Recibos de Nómina Dominicana - SueldoFácil",
    description: "Audita tus volantes de pago mensuales de forma digital. Descubre discrepancias en los descuentos de la TSS (AFP, SFS) o retenciones de ISR de la DGII.",
    canonical: "https://sueldofacil.com/analizar-recibos/"
  },
  "/plan-ahorro": {
    title: "Plan de Ahorro RD | Sueldo Fácil",
    description: "Calcula tu plan de ahorro y organiza tu presupuesto anual con herramientas gratuitas para República Dominicana.",
    canonical: "https://sueldofacil.com/plan-ahorro/"
  },
  "/presupuesto-anual": {
    title: "Presupuesto Anual RD | Sueldo Fácil",
    description: "Calcula tu plan de ahorro y organiza tu presupuesto anual con herramientas gratuitas para República Dominicana.",
    canonical: "https://sueldofacil.com/presupuesto-anual/"
  },
  "/sobre-nosotros": {
    title: "Sobre Nosotros y Equipo de Expertos | Sueldo Fácil",
    description: "Conozca el equipo de economistas, ingenieros de sistemas y consultores laborales calificados que hacen posible Sueldo Fácil en República Dominicana.",
    canonical: "https://sueldofacil.com/sobre-nosotros/"
  },
  "/politica-editorial": {
    title: "Política Editorial de Transparencia Matemática | Sueldo Fácil",
    description: "Metodologías de verificación, fuentes primarias del Ministerio de Trabajo y principios YMYL que avalan la precisión de nuestras calculadoras de nómina en RD.",
    canonical: "https://sueldofacil.com/politica-editorial/"
  },
  "/contacto": {
    title: "Contacto y Soporte Institucional | Sueldo Fácil",
    description: "Contacte al departamento de redacción y soporte analítico de Sueldo Fácil para sugerencias, aclaraciones legislativas o asesorías.",
    canonical: "https://sueldofacil.com/contacto/"
  }
};

function getSEOMetadata(urlPath: string): SEOMetadata {
  const cleanPath = urlPath.split('?')[0].replace(/\/$/, "");
  return SEO_MAP[cleanPath] || SEO_MAP["/"];
}

function injectSEOMetadata(html: string, urlPath: string): string {
  const seo = getSEOMetadata(urlPath);
  const metaTags = `
    <title>${seo.title}</title>
    <meta name="description" content="${seo.description}" />
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

  // Remove original simple generic title tag to safeguard from duplication
  let cleanHtml = html.replace(/<title>.*?<\/title>/gi, "");
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
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      try {
        const filePath = path.join(distPath, 'index.html');
        if (fs.existsSync(filePath)) {
          const rawHtml = fs.readFileSync(filePath, 'utf-8');
          const enrichedHtml = injectSEOMetadata(rawHtml, req.path);
          
          // Prevent caching of index.html so clients always request the latest hashed bundles
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
          res.set('Surrogate-Control', 'no-store');
          
          return res.status(200).type('text/html').send(enrichedHtml);
        }
      } catch (err) {
        console.error("SEO Prerender Error in Production routing:", err);
      }
      
      // Fallback response with same headers
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
