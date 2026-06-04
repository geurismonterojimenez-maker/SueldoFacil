import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, AlertCircle, HelpCircle, CornerDownLeft, Loader2, ClipboardCheck, Play, ChevronRight, FileText, Check, Award, Copy, Download } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const PRESET_PROMPTS = [
  "¿Cuáles son mis derechos si decido renunciar?",
  "¿Cómo se reparte la bonificación anual según la ley?",
  "¿Tengo derecho a vacaciones pagadas el primer año?",
  "¿Qué es la regalía pascual y cuándo debe pagarse?"
];

interface AsistenteIAProps {
  initialMessage?: string | null;
  onClearInitialMessage?: () => void;
}

export default function AsistenteIA({ initialMessage, onClearInitialMessage }: AsistenteIAProps = {}) {
  const [activeMode, setActiveMode] = useState<'chat' | 'expert'>('chat');

  // Interactive Quiz Wizard State for Liquidation
  const [expertStep, setExpertStep] = useState(1);
  const [expertReason, setExpertReason] = useState('Desahucio por el Empleador (Te cancelaron)');
  const [expertAntiguity, setExpertAntiguity] = useState('De 1 a 5 años');
  const [expertSalary, setExpertSalary] = useState('45050');
  const [expertVacationsTaken, setExpertVacationsTaken] = useState('No, no he tomado mis vacaciones del año');
  const [expertBonuses, setExpertBonuses] = useState('Sí, tengo bonificación acumulada por cobrar');

  const [expertReport, setExpertReport] = useState<string | null>(null);
  const [expertLoading, setExpertLoading] = useState(false);
  const [expertError, setExpertError] = useState<string | null>(null);
  const [reportCopied, setReportCopied] = useState(false);

  // Chat standard state
  const [messages, setMessages] = useState<Message[]>(() => {
    const base: Message[] = [
      {
        role: 'model',
        text: "¡Hola! Soy SueldoFacil IA, tu asistente experto en legislación laboral dominicana. Puedo ayudarte a aclarar dudas sobre el Código de Trabajo (Ley 16-92), cesantía, preaviso, ISR (DGII), vacaciones, Seguridad Social y más.\n\n¿En qué te puedo asesorar hoy?"
      }
    ];
    if (initialMessage) {
      base.push({ role: 'user', text: initialMessage });
    }
    return base;
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialMessage) {
      const runInitialRequest = async () => {
        setLoading(true);
        setErrorStatus(null);
        try {
          const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: initialMessage,
              history: [
                {
                  role: 'model',
                  text: "¡Hola! Soy SueldoFacil IA, tu asistente experto en legislación laboral dominicana. Puedo ayudarte a aclarar dudas sobre el Código de Trabajo (Ley 16-92), cesantía, preaviso, ISR (DGII), vacaciones, Seguridad Social y más.\n\n¿En qué te puedo asesorar hoy?"
                }
              ]
            })
          });

          let data;
          try {
            data = await response.json();
          } catch (jsonErr) {
            // failed to parse json
          }

          if (!response.ok) {
            throw new Error(data?.error || 'Hubo un error al conectar con el servidor de IA.');
          }

          if (data && data.error) {
            throw new Error(data.error);
          }

          setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        } catch (err: any) {
          console.error(err);
          setErrorStatus(err.message || 'Error de conexión');
        } finally {
          setLoading(false);
          if (onClearInitialMessage) {
            onClearInitialMessage();
          }
        }
      };
      runInitialRequest();
    }
  }, [initialMessage]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;
    
    const userMsg: Message = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);
    setErrorStatus(null);

    const historySlice = messages.slice(-10);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          history: historySlice
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        // failed to parse json
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Hubo un error al conectar con el servidor de IA.');
      }

      if (data && data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'model', text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus(err.message || 'Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  // Launch Expert Liquidation Advisor Wizard
  const handleGenerateExpertReport = async () => {
    setExpertLoading(true);
    setExpertError(null);
    setExpertReport(null);

    const promptText = `
Hola Gemini. Actúa como el Consultor Senior de Liquidación de SueldoFacil.com.
Genera un INFORME DE LIQUIDACIÓN Y PAUTAS DE NEGOCIACIÓN LABORAL. Debe ser muy directo, resumido y breve, evitando introducciones largas.

DATOS CLAVE DEL USUARIO:
- Razón formal de la desvinculación: ${expertReason}
- Antigüedad / Tiempo de servicio continuo: ${expertAntiguity}
- Salario bruto mensual de referencia: RD$ ${expertSalary}
- Estado de sus vacaciones: ${expertVacationsTaken}
- Reclamación de otros bonos acumulados: ${expertBonuses}

REQUERIMIENTOS DEL INFORME (Sé muy sintético y ve al grano):
1. EXPLICACIÓN LEGAL BREVE: Cuál es su derecho específico de salida en viñetas cortas de 2 líneas.
2. CÁLCULO ESTIMADO SINTÉTICO: Estima numéricamente de forma directa dividiendo salario mensual entre 23.83 para el diario.
3. AUDITORÍA FISCAL RÁPIDA: Si tributa TSS o ISR de la DGII.
4. LIBRETO DE NEGOCIACIÓN COMPACTO: Un guion muy breve de 1-2 frases clave para negociar con Recursos Humanos.
5. RECOMENDACIÓN CLAVE: Recordatorio de que tienen 10 días para pagar y no firmar descargos sin revisar.

Haz el informe sumamente estructurado, con viñetas elegantes y párrafos muy cortos.
    `;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: promptText,
          history: []
        })
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        // failed to parse json
      }

      if (!response.ok) {
        throw new Error(data?.error || 'Servidor inaccesible. Verifique api key.');
      }

      if (data && data.error) throw new Error(data.error);

      setExpertReport(data.text);
      setExpertStep(5); // Show report step
    } catch (e: any) {
      console.error(e);
      setExpertError(e.message || 'Hubo un error de conexión al generar el informe.');
    } finally {
      setExpertLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!expertReport) return;
    navigator.clipboard.writeText(expertReport);
    setReportCopied(true);
    setTimeout(() => setReportCopied(false), 2000);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-xs font-semibold">
      
      {/* PANEL IZQUIERDO DE AYUDA / SUGERENCIAS */}
      <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="p-1 px-2 rounded-lg bg-blue-100/80 text-blue-600">
              <Sparkles className="w-4 h-4 fill-blue-600/20" />
            </span>
            Asesor Laboral Inteligente (IA)
          </h2>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Nuestra plataforma cuenta con dos modalidades para guiarte en materia de derechos:
          </p>
        </div>

        {/* MODE TOGGLES */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => { setActiveMode('chat'); setExpertStep(1); }}
            className={`w-full py-3 px-4 rounded-xl border font-bold flex items-center justify-between text-left transition-all cursor-pointer ${
              activeMode === 'chat' 
                ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>Conversación & Leyes Libres</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => { setActiveMode('expert'); setExpertStep(1); setExpertReport(null); }}
            className={`w-full py-3 px-4 rounded-xl border font-bold flex items-center justify-between text-left transition-all cursor-pointer ${
              activeMode === 'expert' 
                ? 'border-blue-600 bg-blue-50/50 text-blue-600' 
                : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="space-y-0.5">
              <span>IA Experta en Liquidación (Paso a Paso)</span>
              <span className="text-[10px] text-slate-450 block font-semibold leading-none">Genera libreto y auditoría formal</span>
            </div>
            <Award className="w-4.5 h-4.5" />
          </button>
        </div>

        {activeMode === 'chat' ? (
          /* PRESET LIST ONLY IN CHAT MODE */
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Preguntas comunes</span>
            <div className="flex flex-col gap-2">
              {PRESET_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="text-left text-xs text-slate-700 bg-slate-50 hover:bg-blue-50/50 hover:text-blue-700 p-3 rounded-xl border border-slate-200 hover:border-blue-200 transition-all cursor-pointer font-medium disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* INFO IN EXPERT MODE */
          <div className="bg-slate-50 p-4 border border-blue-100 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-blue-700 block uppercase tracking-wide">Informe de Negociación</span>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              El asistente estructurado recopila tus datos contractuales y genera un expediente detallado para audiencias preliminares de mutuo acuerdo con tu empleador.
            </p>
          </div>
        )}

        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0" />
            Descargo de Responsabilidad (Aviso)
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
            Este consultor virtual procesa de forma educativa los coeficientes de desahucio. No sustituye la consulta formal del Ministerio de Trabajo dominicano.
          </p>
        </div>

        <AdsenseMock slot="ia-sidebar" type="square" />
      </div>

      {/* CHAT WINDOW DERECHA */}
      <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm h-[650px] justify-between">
        
        {/* HEADER */}
        <div className="bg-slate-900 px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse"></span>
              <Bot className="w-9 h-9 text-blue-400 bg-slate-800 border border-slate-700 p-1.5 rounded-xl" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {activeMode === 'chat' ? 'Consultor de Legislación Laboral' : 'IA Experta de Liquidaciones'}
              </p>
              <p className="text-[10px] text-emerald-400 font-medium">SueldoFacil Base Activa • Dominicano</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full border border-slate-700 font-mono">
            {activeMode === 'chat' ? 'CHAT LIBRE' : 'PASO A PASO'}
          </span>
        </div>

        {activeMode === 'chat' ? (
          /* MODALIDAD CHAT ORDINARIA */
          <div className="flex flex-col justify-between flex-1 overflow-hidden">
            {/* MESSAGES FLOW */}
            <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 bg-slate-50">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex gap-3 max-w-[85%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`p-1.5 rounded-xl shrink-0 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-slate-300'}`}>
                    {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-sm' 
                      : 'bg-white text-slate-800 border border-slate-250 rounded-tl-none whitespace-pre-wrap shadow-sm font-semibold'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="p-1.5 rounded-xl bg-slate-950 text-slate-400 animate-pulse">
                    <Bot className="w-4 h-4 animate-spin text-blue-500" />
                  </div>
                  <div className="bg-white border border-slate-200 p-4 rounded-2xl rounded-tl-none text-xs text-slate-500 font-medium flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    SueldoFacil IA está analizando el Código de Trabajo...
                  </div>
                </div>
              )}

              {errorStatus && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold">
                  <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                  Error: {errorStatus}. Revisa la conexión en secrets.
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT FORM */}
            <div className="p-4 border-t border-slate-150 bg-white">
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage(inputMessage);
                }}
                className="flex items-center gap-2.5"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={e => setInputMessage(e.target.value)}
                  disabled={loading}
                  placeholder="Haz una pregunta sobre liquidaciones, ISR, salarios o el Código laboral..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-xs font-semibold focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-bold p-3 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400 px-1 font-mono">
                <span>República Dominicana • Ley 16-92</span>
                <span className="flex items-center gap-1"><CornerDownLeft className="w-3 h-3" />Enter para enviar</span>
              </div>
            </div>
          </div>
        ) : (
          /* MODALIDAD EXPERTA GUIADA (WIZARD) FASE 7 */
          <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto p-6 justify-between">
            
            {expertStep === 1 && (
              <div className="space-y-6 animate-fade-in self-stretch max-w-lg mx-auto py-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-105 text-blue-700 px-2 py-0.5 rounded-full font-extrabold uppercase">Paso 1 de 4</span>
                  <h3 className="text-base font-bold text-slate-900">¿Cuál es el motivo de la salida del empleo?</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">El Código de Trabajo de República Dominicana aplica coeficientes de prestaciones distintos según las causales de despido o renuncia.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Desahucio por el Empleador (Te cancelaron)',
                    'Renuncia Voluntaria (Dimisión ordinaria)',
                    'Despido Justificado (Por alegada falta grave)',
                    'Mutuo Acuerdo Pactado'
                  ].map(val => (
                    <button
                      key={val}
                      onClick={() => setExpertReason(val)}
                      className={`text-left p-3.5 border rounded-xl font-extrabold text-xs transition-all flex items-center justify-between cursor-pointer ${
                        expertReason === val ? 'bg-blue-600/5 border-blue-550 text-blue-650' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/50'
                      }`}
                    >
                      <span>{val}</span>
                      {expertReason === val && <Check className="w-4.5 h-4.5 text-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button onClick={() => setExpertStep(2)} className="bg-blue-600 hover:bg-blue-750 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-1 text-xs cursor-pointer">
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {expertStep === 2 && (
              <div className="space-y-6 animate-fade-in self-stretch max-w-lg mx-auto py-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-105 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Paso 2 de 4</span>
                  <h3 className="text-base font-bold text-slate-900">¿Cuánto tiempo de servicio acumulaste de forma continua?</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">La antigüedad define la cantidad de salarios integrados que te corresponden por concepto de preaviso y auxilio de cesantía legal.</p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    'Menos de 3 meses (Período probatorio regular)',
                    'De 3 a 6 meses',
                    'De 6 a 11 meses',
                    'De 1 a 5 años',
                    'Más de 5 años continuo'
                  ].map(val => (
                    <button
                      key={val}
                      onClick={() => setExpertAntiguity(val)}
                      className={`text-left p-3.5 border rounded-xl font-bold text-xs transition-all flex items-center justify-between cursor-pointer ${
                        expertAntiguity === val ? 'bg-blue-600/5 border-blue-550 text-blue-650' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50/50'
                      }`}
                    >
                      <span>{val}</span>
                      {expertAntiguity === val && <Check className="w-4.5 h-4.5 text-blue-600" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setExpertStep(1)} className="border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer">
                    Atrás
                  </button>
                  <button onClick={() => setExpertStep(3)} className="bg-blue-600 hover:bg-blue-750 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-1 text-xs cursor-pointer">
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {expertStep === 3 && (
              <div className="space-y-6 animate-fade-in self-stretch max-w-lg mx-auto py-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-105 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Paso 3 de 4</span>
                  <h3 className="text-base font-bold text-slate-900">Salario Promedio Ordinario Mensual de la última quincena (RD$)</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">El promedio imponible mensual se utiliza para calcular tu ingreso diario del Código (Salario Bruto / 23.83).</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold text-slate-500">Salario Mensual Bruto (RD$)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">RD$</span>
                    <input
                      type="number"
                      value={expertSalary}
                      onChange={e => setExpertSalary(e.target.value)}
                      className="w-full bg-white border border-slate-250 py-3.5 pl-11 pr-3 text-xs font-bold font-mono text-slate-800 rounded-xl"
                      placeholder="45000"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setExpertStep(2)} className="border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer">
                    Atrás
                  </button>
                  <button onClick={() => setExpertStep(4)} className="bg-blue-600 hover:bg-blue-750 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-1 text-xs cursor-pointer">
                    Siguiente <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {expertStep === 4 && (
              <div className="space-y-6 animate-fade-in self-stretch max-w-lg mx-auto py-4">
                <div className="space-y-1">
                  <span className="text-[9px] bg-blue-105 text-blue-700 px-2 py-0.5 rounded-full font-bold uppercase">Paso 4 de 4</span>
                  <h3 className="text-base font-bold text-slate-900">Condiciones Adicionales y Adjudicaciones</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">Indica si has tomado las vacaciones correspondientes al año en curso o si tienes pagos pendientes regulados.</p>
                </div>

                <div className="space-y-4 font-semibold text-xs text-slate-800">
                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">¿Tomaste tus vacaciones del año regular?</span>
                    <select
                      value={expertVacationsTaken}
                      onChange={e => setExpertVacationsTaken(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-3"
                    >
                      <option>No, no he tomado mis vacaciones del año</option>
                      <option>Sí, ya tomé íntegramente mis vacaciones de este año</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase">¿La empresa declaró utilidades para cobrar Bonificación acumulada?</span>
                    <select
                      value={expertBonuses}
                      onChange={e => setExpertBonuses(e.target.value)}
                      className="w-full bg-white border border-slate-250 rounded-xl py-2.5 px-3"
                    >
                      <option>Sí, tengo bonificación acumulada por cobrar</option>
                      <option>No, no poseo bonificación acumulada en el período</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={() => setExpertStep(3)} className="border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold py-2.5 px-5 rounded-xl text-xs cursor-pointer">
                    Atrás
                  </button>
                  <button
                    onClick={handleGenerateExpertReport}
                    disabled={expertLoading}
                    className="bg-blue-600 hover:bg-blue-750 disabled:bg-slate-200 text-white font-extrabold py-3 px-6 rounded-xl flex items-center gap-1.5 text-xs cursor-pointer"
                  >
                    {expertLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Procesando Auditoría IA...
                      </>
                    ) : (
                      <>
                        Generar Informe de Negociación <Sparkles className="w-4 h-4 fill-white/10" />
                      </>
                    )}
                  </button>
                </div>

                {expertError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold leading-normal">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    Error: {expertError}. Revisa tu conexión de Gemini.
                  </div>
                )}
              </div>
            )}

            {expertStep === 5 && expertReport && (
              /* REPORT OUTPUT VIEW FOR WIZARD */
              <div className="space-y-6 animate-fade-in self-stretch py-2 font-semibold">
                
                {/* TOOLBAR */}
                <div className="flex flex-wrap gap-2 justify-between items-center bg-slate-950 p-4 border border-slate-800 rounded-2xl text-white print:hidden">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500 w-2.5 h-2.5 rounded-full animate-pulse"></div>
                    <span className="text-xs font-bold">Informe de Liquidación Generado Exitosamente</span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyReport}
                      className="bg-slate-900 border border-slate-705 p-2 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-slate-800"
                    >
                      {reportCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      {reportCopied ? 'Copiado' : 'Copiar Informe'}
                    </button>
                    <button 
                      onClick={handlePrintReport}
                      className="bg-blue-600 text-white p-2 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer hover:bg-blue-700"
                    >
                      <Download className="w-3.5 h-3.5" /> Descargar PDF
                    </button>
                  </div>
                </div>

                {/* OUTPUT MARKDOWN BLOCK RENDERED ELEGANTLY */}
                <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-4 print:border-none print:shadow-none text-xs">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-black text-slate-900 uppercase">Expediente de Mediación Laboral</h4>
                      <p className="text-[10px] text-slate-400 font-mono font-medium">SueldoFacil IA Virtual Advisor • Generado 2026</p>
                    </div>
                    <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-205 py-0.5 px-2 rounded-full font-bold">
                      EXCLUSIVO
                    </span>
                  </div>

                  {/* REPORT TEXT */}
                  <div className="whitespace-pre-wrap text-slate-750 leading-relaxed font-semibold text-xs space-y-3 prose">
                    {expertReport}
                  </div>
                </div>

                <div className="flex gap-3 pt-2 print:hidden justify-center">
                  <button
                    onClick={() => setExpertStep(1)}
                    className="border border-slate-205 hover:bg-slate-100 bg-white text-slate-600 font-bold py-2.5 px-6 rounded-xl text-xs cursor-pointer select-none"
                  >
                    Crear Nueva Consulta Especializada
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
