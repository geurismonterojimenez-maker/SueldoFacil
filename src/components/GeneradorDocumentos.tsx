import React, { useState } from 'react';
import { TipoCarta, CartaInput } from '../types';
import { FileText, Copy, Printer, Check, Info, ShieldCheck } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

export default function GeneradorDocumentos() {
  const [tipo, setTipo] = useState<TipoCarta>('renuncia');
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState<CartaInput>({
    nombreTrabajador: 'Juan Pérez Díaz',
    cedulaTrabajador: '001-0000000-0',
    nombreEmpresa: 'Corporación Comercial Dominicana SAS',
    rncEmpresa: '1-30-55555-5',
    puestoTrabajo: 'Analista de Operaciones',
    fechaEfectiva: '2026-06-30',
    salarioPactado: '45000',
    justificacionAumento: 'cumplimiento constante de métricas de ventas y aumento del costo de vida'
  });

  const handleInputChange = (field: keyof CartaInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const getTemplateContent = (): string => {
    const options: Record<string, string> = {
      esDOLocaleDate: new Date().toLocaleDateString('es-DO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    };

    switch (tipo) {
      case 'renuncia':
        return `Santo Domingo, República Dominicana
A la fecha de hoy: ${options.esDOLocaleDate}

Señores:
DEPARTAMENTO DE RECURSOS HUMANOS
${input.nombreEmpresa}
RNC: ${input.rncEmpresa || 'N/D'}
Su Despacho.-

Asunto: Comunicación de Dimisión Voluntaria (Renuncia Formal)

Distinguidos Señores:

Por medio de la presente comunicación, yo, ${input.nombreTrabajador}, dominicano, mayor de edad, titular de la Cédula de Identidad y Electoral No. ${input.cedulaTrabajador}, en pleno uso de mis derechos civiles y constitucionales, tengo a bien notificarles formalmente mi renuncia irrevocable al puesto de ${input.puestoTrabajo} que vengo desempeñando en su distinguida institución.

Esta renuncia se hará efectiva laboralmente el día ${input.fechaEfectiva}, motivo por el cual procedo a manifestar lo siguiente:

1. Se otorga formal aviso laboral conforme a lo pactado en el Código de Trabajo de la República Dominicana (Ley No. 16-92) para cumplir con el período legal de preaviso que me corresponde.
2. Solicito la elaboración de mi saldo de liquidación correspondiente a mis derechos adquiridos irrenunciables, tales como: Vacaciones proporcionales no tomadas, Regalía Pascual (Sueldo 13 proporcional) y la retribución de cualquier otro incentivo pendiente de pago.

Agradezco profundamente la valiosa oportunidad que me brindaron de formar parte de su organización durante este tiempo, lo cual me ha permitido crecer tanto a nivel profesional como humano.

Sin otro particular a qué referirme por el momento, se despide atentamente,

__________________________________________
${input.nombreTrabajador}
Cédula: ${input.cedulaTrabajador}`;

      case 'despido':
        return `Santo Domingo, República Dominicana
A la fecha de hoy: ${options.esDOLocaleDate}

Señor(a):
${input.nombreTrabajador}
Cédula de Identidad No. ${input.cedulaTrabajador}
Ciudad.-

Asunto: Carta de Desahucio Patronal (Terminación del Contrato de Trabajo de Ley)

Distinguido(a) Colaborador(a):

Por medio de la presente, la empresa ${input.nombreEmpresa}, RNC No. ${input.rncEmpresa || 'N/D'}, tiene a bien comunicarle formalmente de la rescisión de su contrato de trabajo por mutuo desahucio patronal ordinario, de conformidad con lo estipulado en el Artículo 75 y subsecuentes del Código de Trabajo de la República Dominicana.

Esta finalización de término de servicio será de carácter efectivo y permanente a partir del día ${input.fechaEfectiva}, cesando sus funciones correspondientes al cargo de ${input.puestoTrabajo}.

Le informamos formalmente que la empresa se compromete a pagarle y liquidarle todas las prestaciones laborales obligatorias que la ley dominicana prevé para este tipo de salida, consistiendo en:
- El importe correspondiente a los días de Preaviso de Ley (si procede).
- El importe correspondiente a la Cesantía de Ley.
- Los conceptos irrenunciables de Vacaciones proporcionales acumuladas y Regalía Pascual (Sueldo 13 proporcional).

Su cheque de descargo y liquidación final estará disponible para entrega en nuestras oficinas de Recursos Humanos en un plazo no mayor a diez (10) días laborables a partir de su fecha efectiva de salida, en estricto apego al Artículo 86 del Código Laboral Dominicano.

Le agradecemos profundamente los servicios prestados durante su estadía y le deseamos éxitos en sus futuros proyectos personales.

Atentamente,

__________________________________________
DEPARTAMENTO DE RECURSOS HUMANOS
Por: ${input.nombreEmpresa}`;

      case 'aumento':
        return `Santo Domingo, República Dominicana
A la fecha de hoy: ${options.esDOLocaleDate}

Señor(a):
GERENCIA GENERAL / RECURSOS HUMANOS
${input.nombreEmpresa}
Ciudad.-

Asunto: Solicitud Formal de Revisión y Reajuste Salarial

Distinguido(a) Gerente:

Quien suscribe, ${input.nombreTrabajador}, en mi calidad de ${input.puestoTrabajo} de su prestigiosa empresa, me dirijo a ustedes de la manera más respetuosa con el propósito de manifestarles formalmente mi solicitud de revisión salarial.

Durante mi trayectoria en la empresa, me he dedicado con total entrega, proactividad e identificación con la visión institucional. He asumido responsabilidades clave y he logrado resultados sumamente positivos en mi área de trabajo. Mi salario bruto mensual actual es de RD$ ${parseFloat(input.salarioPactado || '0').toLocaleString('en-US')}.

Tomando en cuenta mi desempeño, mi compromiso organizacional, el incremento comprobado de responsabilidades y la coyuntura del incremento del costo de vida en el país, acudo ante ustedes para requerir formalmente un reajuste proporcional de mi sueldo. Considero justa esta revisión debido a que he sustentado mi labor en:
- ${input.justificacionAumento}.

Confío plenamente en la política de de recursos humanos y méritos de nuestra distinguida empresa, y aspiro a que podamos acordar un incentivo que refleje equitativamente mis aportes. Quedo plenamente a su entera disposición para reunirnos en una breve sesión de evaluación y conversar de manera directa al respecto.

Agradeciendo de antemano su receptividad y la fina atención prestada a esta misiva, se despide con alta consideración,

Atentamente,

__________________________________________
${input.nombreTrabajador}
Puesto: ${input.puestoTrabajo}`;

      case 'contrato_indefinido':
        return `CONTRATO INDIVIDUAL DE TRABAJO POR TIEMPO INDEFINIDO

Entre una parte, la empresa ${input.nombreEmpresa}, sociedad comercial organizada de acuerdo con las leyes de la República Dominicana, RNC No. ${input.rncEmpresa || 'N/D'}, con su domicilio social en el país, debidamente representada por su apoderado de Recursos Humanos, que en lo sucesivo se denominará "EL EMPLEADOR"; 

Y de la otra parte, el señor ${input.nombreTrabajador}, dominicano, mayor de edad, de estado civil e idóneo para laborar, Cédula de Identidad No. ${input.cedulaTrabajador}, con su domicilio real, quien en lo sucesivo del contrato se denominará "EL TRABAJADOR".

SE HA CONVENIDO Y PACTADO LO SIGUIENTE:

PRIMERO: EL TRABAJADOR se compromete a prestar sus servicios personales a favor del EMPLEADOR en calidad y funciones correspondientes a: ${input.puestoTrabajo}. Dichos servicios se prestarán con la debida responsabilidad, diligencia y ética profesional.

SEGUNDO: EL TRABAJADOR devengará una retribución ordinaria fija mensual de RD$ ${parseFloat(input.salarioPactado || '0').toLocaleString('en-US')} (Pesos Dominicanos), la cual le será liquidada por períodos mensuales o quincenales, sujeta a los descuentos que dispone la Ley 87-01 sobre la Seguridad Social y el Impuesto Sobre la Renta (ISR) que dicte la DGII.

TERCERO: La vigencia del presente contrato individual se pacta por Tiempo Indefinido, considerándose formalmente iniciado a partir del día ${input.fechaEfectiva}.

CUARTO: Las partes acuerdan expresamente someterse a las disposiciones de jornada de trabajo, descansos, vacaciones y régimen laboral ordinario que rige de manera soberana el Código de Trabajo de la República Dominicana (Ley No. 16-92).

Hecho de buena fe en dos (2) originales de un mismo tenor y efecto legal, en la ciudad de Santo Domingo, República Dominicana, a la fecha de hoy: ${options.esDOLocaleDate}.

______________________                   ______________________
     EL EMPLEADOR                             EL TRABAJADOR`;

      case 'contrato_definido':
        return `CONTRATO DE TRABAJO TEMPORAL POR TIEMPO DETERMINADO (A PLAZO FIJO)

Entre una parte, la sociedad comercial ${input.nombreEmpresa}, RNC No. ${input.rncEmpresa || 'N/D'}, que en lo sucesivo del presente contrato se denominará para fines de ley "EL EMPLEADOR";

Y de la otra parte, el señor ${input.nombreTrabajador}, Cédula de Identidad No. ${input.cedulaTrabajador}, quien en lo sucesivo del contrato se denominará "EL TRABAJADOR".

SE HA PACTADO LO SIGUIENTE:

PRIMERO: EL TRABAJADOR es contratado de manera específica y temporal bajo la modalidad de obra o servicio determinado conforme al Artículo 33 del Código de Trabajo, orientándose exclusivamente a las funciones de: ${input.puestoTrabajo}.

SEGUNDO: La duración contractual pactada de mutuo acuerdo queda fijada por un período límite de un (1) año, finalizando obligatoriamente el día ${input.fechaEfectiva}, fecha en la cual el presente contrato se resolverá de pleno derecho y sin responsabilidad patronal de auxilio de cesantía o preaviso, salvo los derechos adquiridos acumulados.

TERCERO: El salario mensual pactado es de RD$ ${parseFloat(input.salarioPactado || '0').toLocaleString('en-US')} (Pesos Dominicanos) mensuales, sujeto a deducciones reglamentarias de SFS, AFP.

Hecho de buena fe, en Santo Domingo, República Dominicana, a la fecha de hoy: ${options.esDOLocaleDate}.

______________________                   ______________________
     EL EMPLEADOR                             EL TRABAJADOR`;

      default:
        return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getTemplateContent());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<pre style="font-family: inherit; font-size: 14px; white-space: pre-wrap; padding: 40px;">${getTemplateContent()}</pre>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* CARD FORMULARIO (IZQUIERDA) */}
      <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="w-2 h-5 bg-blue-600 rounded-full inline-block"></span>
            Generador de Cartas y Contratos
          </h2>
          <p className="text-xs text-slate-500 mt-1">Generación automática de correspondencia profesional y contratos laborales válidos en la República Dominicana.</p>
        </div>

        {/* SELECT TIPO DE DOCUMENTO */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Selecciona el tipo de Documento</label>
          <div className="flex flex-col gap-1.5">
            {[
              { id: 'renuncia', label: 'Carta de Renuncia Formal' },
              { id: 'despido', label: 'Carta de Desahucio Patronal' },
              { id: 'aumento', label: 'Carta solicitud de aumento salarial' },
              { id: 'contrato_indefinido', label: 'Contrato de Trabajo por tiempo Indefinido' },
              { id: 'contrato_definido', label: 'Contrato de Trabajo a Plazo Fijo' },
            ].map(doc => (
              <button
                key={doc.id}
                onClick={() => setTipo(doc.id as TipoCarta)}
                className={`text-left text-xs p-3 rounded-xl border transition-all ${
                  tipo === doc.id
                    ? 'bg-blue-50/50 border-blue-500/30 text-blue-750 font-semibold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-medium'
                }`}
              >
                {doc.label}
              </button>
            ))}
          </div>
        </div>

        {/* FACTORES DINÁMICOS */}
        <div className="space-y-4 border-t border-slate-100 pt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Datos para Dinamizar Documento</p>
          
          <div>
            <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Nombre Completo de Colaborador</label>
            <input
              type="text"
              value={input.nombreTrabajador}
              onChange={e => handleInputChange('nombreTrabajador', e.target.value)}
              className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Cédula del Trabajador</label>
              <input
                type="text"
                placeholder="001-0000000-0"
                value={input.cedulaTrabajador}
                onChange={e => handleInputChange('cedulaTrabajador', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Nombre Empresa / Empleador</label>
              <input
                type="text"
                value={input.nombreEmpresa}
                onChange={e => handleInputChange('nombreEmpresa', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">RNC de la Empresa (Opcional)</label>
              <input
                type="text"
                placeholder="1-30-55555-5"
                value={input.rncEmpresa}
                onChange={e => handleInputChange('rncEmpresa', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Nombre del Puesto Laboral</label>
              <input
                type="text"
                value={input.puestoTrabajo}
                onChange={e => handleInputChange('puestoTrabajo', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Fecha Efectiva / Inicio</label>
              <input
                type="date"
                value={input.fechaEfectiva}
                onChange={e => handleInputChange('fechaEfectiva', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Salario Mensual RD$ (Opcional)</label>
              <input
                type="number"
                value={input.salarioPactado}
                onChange={e => handleInputChange('salarioPactado', e.target.value)}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800 font-mono"
              />
            </div>
          </div>

          {tipo === 'aumento' && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-600 uppercase mb-1">Justificación del Aumento</label>
              <textarea
                value={input.justificacionAumento}
                onChange={e => handleInputChange('justificacionAumento', e.target.value)}
                rows={2}
                className="w-full bg-slate-50 border border-slate-250 rounded-xl py-2 px-3 text-xs focus:ring-1 focus:ring-blue-500/10 focus:border-blue-500 text-slate-800"
              />
            </div>
          )}
        </div>

        {/* ESPACIO ANUNCIO RESPONSIVO NO INTRUSIVO */}
        <AdsenseMock slot="generador-sidebar" type="square" />
      </div>

      {/* VISTA PREVIA DEL DOCUMENTO LEGAL (DERECHA) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between self-stretch min-h-[550px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <span className="text-xs font-semibold tracking-widest text-slate-400 uppercase">
                Vista Previa del Documento Seleccionado
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] bg-emerald-950 text-emerald-400 font-bold px-2 py-1 rounded-full border border-emerald-800 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              FORMATO ESTÁNDAR LEGAL RD
            </div>
          </div>

          {/* CANVAS PREVIA PAPEL */}
          <div className="bg-white text-slate-900 rounded-xl p-6 text-xs leading-relaxed font-sans font-medium h-[400px] overflow-y-auto whitespace-pre-wrap shadow-inner border border-slate-200">
            {getTemplateContent()}
          </div>
        </div>

        {/* ACCIONES */}
        <div className="flex gap-2.5 mt-5 border-t border-slate-800 pt-5">
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all border border-slate-700 relative"
          >
            <Copy className="w-4 h-4" />
            {copied ? '¡Copiado al Portapapeles!' : 'Copiar Texto'}
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Formato Limpio
          </button>
        </div>
      </div>
    </div>
  );
}
