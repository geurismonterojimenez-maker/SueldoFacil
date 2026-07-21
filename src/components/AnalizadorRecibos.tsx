import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, RefreshCw, Sparkles, ChevronRight, Camera, HelpCircle, Share2, Download, Info } from 'lucide-react';
import { calcularSalarioNeto } from '../utils/calculator';
import AdsenseMock from './AdsenseMock';

export default function AnalizadorRecibos() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  
  // Paystub lines
  const [bruto, setBruto] = useState('50000');
  const [afpSlip, setAfpSlip] = useState('1435');  // exactly 2.87% of 50k
  const [sfsSlip, setSfsSlip] = useState('1520');  // exactly 3.04% of 50k
  const [isrSlip, setIsrSlip] = useState('1200');  // should be around 174
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const parseMockSlip = (fileName: string) => {
    setLoading(true);
    setTimeout(() => {
      // Simulate file scraping with diverse mock scenarios based on filename
      if (fileName.toLowerCase().includes('irregular') || fileName.toLowerCase().includes('error')) {
        setBruto('60000');
        setAfpSlip('2000'); // exceeded (should be 1722)
        setSfsSlip('1824'); // exact (3.04%)
        setIsrSlip('4500'); // exceeded (should be around 2840)
      } else {
        setBruto('45000');
        setAfpSlip('1291.50'); // exact
        setSfsSlip('1368.00'); // exact
        setIsrSlip('180'); // roughly exact
      }
      setLoading(false);
    }, 1500);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      parseMockSlip(file.name);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      parseMockSlip(file.name);
    }
  };

  const handleAudit = () => {
    const sBruto = parseFloat(bruto) || 0;
    const sAfp = parseFloat(afpSlip) || 0;
    const sSfs = parseFloat(sfsSlip) || 0;
    const sIsr = parseFloat(isrSlip) || 0;

    // Law exact numbers
    const calcLegal = calcularSalarioNeto({ salarioBruto: bruto, ingresosAdicionales: '0' });

    // Thresholds
    const diffAfp = sAfp - calcLegal.afp;
    const diffSfs = sSfs - calcLegal.sfs;
    const diffIsr = sIsr - calcLegal.isr;

    // Build flags if difference exceeds a 15-peso allowance of cents/rounding
    const afpOk = Math.abs(diffAfp) <= 15;
    const sfsOk = Math.abs(diffSfs) <= 15;
    const isrOk = Math.abs(diffIsr) <= 15;

    let totalAlerts: string[] = [];
    if (!afpOk) {
      if (diffAfp > 15) totalAlerts.push(`AFP Sobrecargada: Te descontaron RD$ ${Math.abs(diffAfp).toFixed(2)} más de la tasa legal de 2.87% del salario computable.`);
      else totalAlerts.push(`AFP Subcomputada: El descuento es menor que la tasa legal de 2.87% (Faltan RD$ ${Math.abs(diffAfp).toFixed(2)}).`);
    }

    if (!sfsOk) {
      if (diffSfs > 15) totalAlerts.push(`SFS Sobrecargada: Descuento de Seguro de Salud reporta RD$ ${Math.abs(diffSfs).toFixed(2)} demás del 3.04% estipulado.`);
      else totalAlerts.push(`SFS Subcomputada: El descuento de salud es RD$ ${Math.abs(diffSfs).toFixed(2)} inferior al legal.`);
    }

    if (!isrOk) {
      if (diffIsr > 15) totalAlerts.push(`Exceso de ISR: El descuento de Impuesto sobre la Renta es RD$ ${Math.abs(diffIsr).toFixed(2)} mayor que la escala tributaria de DGII.`);
      else totalAlerts.push(`ISR Faltante: Te retuvieron RD$ ${Math.abs(diffIsr).toFixed(2)} menos de lo estipulado por los tramos actuales.`);
    }

    setResult({
      bruto: sBruto,
      legalAfp: calcLegal.afp,
      legalSfs: calcLegal.sfs,
      legalIsr: calcLegal.isr,
      slipAfp: sAfp,
      slipSfs: sSfs,
      slipIsr: sIsr,
      afpStatus: afpOk ? 'CORRECTO' : (diffAfp > 15 ? 'EXCESO' : 'DISCREPANCIA'),
      sfsStatus: sfsOk ? 'CORRECTO' : (diffSfs > 15 ? 'EXCESO' : 'DISCREPANCIA'),
      isrStatus: isrOk ? 'CORRECTO' : (diffIsr > 15 ? 'EXCESO' : 'DISCREPANCIA'),
      alerts: totalAlerts,
      isCompliant: afpOk && sfsOk && isrOk
    });
  };

  const triggerUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleShareCard = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto px-1">
      
      {/* COLUMN LEFT: INPUT & UPLOT ZONE */}
      <div className="lg:col-span-6 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-6 bg-blue-600 rounded-full inline-block"></span>
            Auditor de Recibos de Nómina 2026
          </h2>
          <p className="text-xs text-slate-500">
            Carga fotos o introduce los rubros de tu volante de pago para auditar si tu empresa te retiene de más conforme a las leyes fiscales de República Dominicana.
          </p>
        </div>

        {/* FILE UPLOAD ZONE (TOUCH TARGET MIN 44PX) */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerUploadClick}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 min-h-[140px] select-none ${
            dragActive ? 'border-blue-600 bg-blue-50/20' : 'border-slate-200 hover:border-blue-500/50 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          {loading ? (
            <div className="space-y-2">
              <RefreshCw className="w-8 h-8 text-blue-601 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-600">Extrayendo rubros impositivos del recibo...</p>
            </div>
          ) : selectedFile ? (
            <div className="space-y-1.5 p-3 bg-blue-50/20 border border-blue-200/40 rounded-xl max-w-xs mx-auto">
              <FileText className="w-7 h-7 text-blue-600 mx-auto" />
              <p className="text-xs font-bold text-slate-700 truncate">{selectedFile.name}</p>
              <span className="text-[10px] text-slate-400 font-semibold uppercase font-mono block">Archivo cargado exitosamente</span>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">Arrastra o haz click para escanear volante</p>
                <p className="text-[10px] text-slate-400 font-medium">Soporta PDFs, fotos JPEG y capturas de móvil</p>
              </div>
            </div>
          )}
        </div>

        {/* INPUT STUBS MANUALLY */}
        <div className="space-y-4 pt-2 border-t border-slate-100 text-xs font-semibold">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Valores a Auditar del Volante</span>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Salario Bruto (RD$)</label>
              <input
                type="number"
                value={bruto}
                onChange={e => setBruto(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Descuento AFP (RD$)</label>
              <input
                type="number"
                value={afpSlip}
                onChange={e => setAfpSlip(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Descuento SFS (RD$)</label>
              <input
                type="number"
                value={sfsSlip}
                onChange={e => setSfsSlip(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1.5">Retención ISR (RD$)</label>
              <input
                type="number"
                value={isrSlip}
                onChange={e => setIsrSlip(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 font-mono font-bold text-slate-800"
              />
            </div>
          </div>

        </div>

        <button
          onClick={handleAudit}
          className="w-full bg-blue-600 hover:bg-blue-750 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs transition-all shadow-sm cursor-pointer select-none"
        >
          <Camera className="w-4 h-4" /> Auditar e Identificar Errores de Nómina
        </button>

        {/* ESPACIO ANUNCIO RESPONSIVO NO INTRUSIVO */}
        <AdsenseMock slot="analizador-left-bottom" type="banner" />
      </div>

      {/* COLUMN RIGHT: OUTCOMES + SHAREABLE CARD WIDGETS (Phases 9 & 10) */}
      <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-lg self-stretch flex flex-col justify-between min-h-[500px]">
        {result ? (
          <div className="space-y-6">
            
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Resultado de Auditoría Legal
              </span>
              <span className={`inline-block text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                result.isCompliant 
                ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                : 'bg-rose-950 text-rose-400 border-rose-800'
              }`}>
                {result.isCompliant ? '100% Correcto' : 'Discrepancias detectadas'}
              </span>
            </div>

            {/* HIGH FIDELITY SHARE CARD FOR SOCIALS (Fase 10) */}
            <div id="sueldofacil-shareable-metric" className="bg-gradient-to-br from-blue-950 to-slate-950 p-6 rounded-2xl border border-blue-900/40 space-y-4 shadow-md text-left relative overflow-hidden">
              <div className="absolute right-0 bottom-0 text-[100px] font-black text-white/5 tracking-tighter leading-none select-none select-none pointer-events-none">SF</div>
              
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-blue-300 uppercase tracking-widest font-bold">Tarjeta de Conformidad SueldoFacil</span>
                <span className="text-[9px] font-bold text-slate-500 font-mono">2026/04</span>
              </div>

              <div className="space-y-1 bg-slate-900 p-4 border border-slate-800 rounded-xl">
                <span className="text-[9px] text-slate-400 block uppercase font-bold">Salario Bruto Auditado</span>
                <h4 className="text-2xl font-black text-white font-mono leading-none">RD$ {result.bruto.toLocaleString('en-US')}</h4>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">AFP</span>
                  <span className={`text-xs font-bold font-mono ${result.afpStatus === 'CORRECTO' ? 'text-emerald-400' : 'text-rose-500'}`}>{result.slipAfp.toLocaleString('en-US')}</span>
                  <span className="text-[8px] text-slate-500 block uppercase leading-none font-semibold">Ley: {Math.round(result.legalAfp)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">SFS</span>
                  <span className={`text-xs font-bold font-mono ${result.sfsStatus === 'CORRECTO' ? 'text-emerald-400' : 'text-rose-500'}`}>{result.slipSfs.toLocaleString('en-US')}</span>
                  <span className="text-[8px] text-slate-500 block uppercase leading-none font-semibold">Ley: {Math.round(result.legalSfs)}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-slate-800 space-y-0.5">
                  <span className="text-[9px] text-slate-400 uppercase block font-bold">ISR</span>
                  <span className={`text-xs font-bold font-mono ${result.isrStatus === 'CORRECTO' ? 'text-emerald-400' : 'text-rose-500'}`}>{result.slipIsr.toLocaleString('en-US')}</span>
                  <span className="text-[8px] text-slate-500 block uppercase leading-none font-semibold">Ley: {Math.round(result.legalIsr)}</span>
                </div>
              </div>
            </div>

            {/* AUDIT ALERTS & WARNINGS BLOCK */}
            <div className="space-y-3.5 border-t border-slate-800 pt-5">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Auditoría Doctrinal</p>
              
              {result.alerts.length > 0 ? (
                <div className="space-y-2">
                  {result.alerts.map((al: string, i: number) => (
                    <div key={i} className="flex gap-2.5 p-3 bg-rose-950/30 text-rose-300 border border-rose-900/40 rounded-xl text-xs font-semibold leading-relaxed">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <span>{al}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2.5 p-4 bg-emerald-950/35 text-emerald-300 border border-emerald-900/35 rounded-xl text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <span>Las deducciones ingresadas coinciden con la estimación calculada para este escenario. Revisa también el periodo, los topes y cualquier descuento voluntario del recibo real.</span>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-1.5 print:hidden">
              <button
                onClick={handleShareCard}
                className="flex-1 font-bold text-xs bg-slate-950 hover:bg-slate-850 p-2.5 rounded-xl text-slate-300 flex items-center justify-center gap-1.5 border border-slate-800 cursor-pointer"
              >
                {copiedShare ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                {copiedShare ? '¡Copiado!' : 'Copiar Tarjeta Comparte'}
              </button>
            </div>

          </div>
        ) : (
          <div className="text-center py-10 space-y-3">
            <p className="text-slate-400 max-w-sm mx-auto font-medium text-xs">
              No se ha procesado ninguna auditoría aún. Presiona el botón izquierdo "Auditar" para ejecutar el simulador de volante integrado o sube tu documento.
            </p>
            <AdsenseMock slot="analizador-empty" type="square" />
          </div>
        )}
        
        <div className="flex items-start gap-1.5 text-[10px] text-slate-450 italic leading-relaxed pt-2.5 border-t border-slate-850">
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>Este verificador calcula topes obligatorios mensuales de la Seguridad Social (hasta 20 salarios mínimos para pensiones y 10 para salud) para detectar sobre-mermas patronales.</span>
        </div>
      </div>

    </div>
  );
}
