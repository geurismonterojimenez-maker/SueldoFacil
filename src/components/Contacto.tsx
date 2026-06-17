import React, { useState } from 'react';
import { Mail, Clock, Send, CheckCircle, HelpCircle, ShieldAlert } from 'lucide-react';
import YmylDisclaimer from './YmylDisclaimer';

export default function Contacto() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'calculos',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    // Simulate API request
    setIsSubmitted(true);
    setFormData({ name: '', email: '', subject: 'calculos', message: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in text-slate-800 dark:text-slate-200">
      
      {/* HEADER HERO */}
      <div className="text-center space-y-4 py-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/25 text-blue-700 dark:text-blue-400 border border-blue-200/50">
          <Mail className="w-3.5 h-3.5" />
          Servicio de Atención al Usuario
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Contacto y Canales de Soporte
        </h1>
        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
          ¿Tienes sugerencias sobre nuestras calculadoras, consultas de prensa o detectaste algún desajuste laboral? Estamos disponibles para asistirte.
        </p>
      </div>

      <YmylDisclaimer type="general" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
        
        {/* COLUMNA IZQUIERDA: TARJETAS DE DATOS */}
        <div className="md:col-span-5 space-y-5">
          
          {/* CANALES FORMALES */}
          <div className="bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Canales Institucionales</h2>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-450 flex items-center justify-center shrink-0">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Correo Electrónico Directo</span>
                  <a href="mailto:contacto@sueldofacil.com" className="text-xs font-bold text-blue-650 dark:text-blue-400 hover:underline">
                    contacto@sueldofacil.com
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/10 text-blue-600 dark:text-blue-450 flex items-center justify-center shrink-0">
                  <Clock className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Horario de Atención</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 block leading-tight">
                    Lunes a Viernes
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    8:00 AM – 6:00 PM (Hora Estándar de RD)
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-450 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4.5 h-4.5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">Nivel de Respuesta Estándar</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 block">
                    Menos de 24 horas hábiles
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INFORMACIÓN SOBRE PRIVACIDAD */}
          <div className="p-4 bg-slate-100/50 dark:bg-slate-900/30 border border-slate-150 dark:border-slate-850 rounded-2xl space-y-2">
            <span className="text-[10px] font-bold text-slate-550 dark:text-slate-400 uppercase tracking-widest block">Seguridad & Privacidad de Datos</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Alineados con la Ley N° 172-13 sobre Protección de Datos de Carácter Personal en República Dominicana, sus datos nunca serán cedidos ni vendidos a terceros, utilizándose de forma exclusiva para procesar sus requerimientos informativos de soporte.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO INTERACTIVO */}
        <div className="md:col-span-7 bg-white dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-850 p-6 rounded-2xl shadow-sm">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-900">
            Formulario de Envío Seguro
          </h2>

          {isSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Formulario Enviado con Éxito</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Gracias por comunicarse con SueldoFácil. Nuestro equipo legal y de desarrollo revisará su mensaje y responderá a su bandeja en menos de 24 horas hábiles.
              </p>
              <button 
                onClick={() => setIsSubmitted(false)}
                className="text-xs font-bold text-blue-600 hover:underline pt-2 cursor-pointer"
              >
                Enviar otro mensaje
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-slate-700 dark:text-slate-350">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Juan Pérez"
                    className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:border-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Ej: juan@gmail.com"
                    className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:border-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Motivo de la Consulta
                </label>
                <select
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium"
                >
                  <option value="calculos">Incongruencia o consulta de Cálculos Laborales</option>
                  <option value="soporte">Soporte Técnico en la Plataforma</option>
                  <option value="sugerencia">Sugerencias o Nuevas Calculadoras</option>
                  <option value="legal">Información de Artículos del Blog</option>
                  <option value="prensa">Asociaciones y Colaboraciones de Prensa</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-slate-550 dark:text-slate-400 uppercase tracking-wide mb-1.5">
                  Mensaje o Especificaciones
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describa de la forma más detallada posible su consulta laboral o sugerencia de la aplicación..."
                  className="w-full bg-slate-50 hover:bg-slate-100/50 dark:bg-slate-950 dark:border-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                Enviar Mensaje Seguro <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
}
