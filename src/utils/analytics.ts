/**
 * SENSOR DE ANALÍTICA CENTRALIZADA - SUELDOFÁCIL (GA4 COMPLIANT)
 * Este módulo unifica todos los eventos analíticos de la plataforma sin duplicar código.
 * Cumple estrictamente con regulaciones de privacidad YMYL, previniendo el rastreo de datos sensibles
 * (como montos de salarios reales, nombres de usuarios o identificaciones/cédulas).
 */

type CategoryType = 'prestaciones' | 'salario' | 'isr' | 'afp_sfs' | 'costos' | 'horas_extras' | 'mi_diciembre' | 'faq' | 'contacto' | 'general';

interface AnalyticsPayload {
  category: CategoryType;
  action: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

class AnalyticsTracker {
  private isDevelopmentNode: boolean;

  constructor() {
    this.isDevelopmentNode = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1'));
  }

  /**
   * Log general safely dispatching event both to console in dev and Window.gtag in GA4
   */
  public logEvent(eventName: string, payload: AnalyticsPayload) {
    if (typeof window === 'undefined') return;

    // Filter sensitive fields to ensure compliance (YMYL strict guard)
    const securePayload = { ...payload };
    delete securePayload.userInputName;
    delete securePayload.userInputCedula;
    delete securePayload.userInputSalary;
    delete securePayload.userInputCompany;

    // Console logging in development
    if (this.isDevelopmentNode) {
      console.log(`[SUELDOFÁCIL-ANALYTICS] Event: "${eventName}"`, securePayload);
    }

    try {
      // Trigger native Google Analytics 4 (GA4) window layer
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', eventName, {
          event_category: securePayload.category,
          event_label: securePayload.label || securePayload.action,
          value: securePayload.value || 0,
          ...securePayload
        });
      }

      // Fallback for standard pixel or tagging scripts
      const customEvent = new CustomEvent('sueldofacil_analytics', {
        detail: { eventName, payload: securePayload }
      });
      window.dispatchEvent(customEvent);
    } catch (err) {
      console.warn('[ANALYTICS-ERROR] Failed to forward telemetry safely:', err);
    }
  }

  /**
   * Event: When a calculation completes successfully
   */
  public logCalculoRealizado(category: CategoryType, toolName: string) {
    this.logEvent('calculo_realizado', {
      category,
      action: 'calculo_exitoso',
      label: `Herramienta: ${toolName}`,
    });
  }

  /**
   * Event: When any PDF starts compiling or downloads
   */
  public logPdfDescargado(category: CategoryType, toolName: string) {
    this.logEvent('pdf_descargado', {
      category,
      action: 'descargar_pdf',
      label: `Exporte: ${toolName}`,
    });
  }

  /**
   * Event: When sharing results to WhatsApp
   */
  public logWhatsappCompartido(category: CategoryType, toolName: string) {
    this.logEvent('whatsapp_compartido', {
      category,
      action: 'compartir_whatsapp',
      label: `Compartido: ${toolName}`,
    });
  }

  /**
   * Event: Telemetry on Accordion FAQ items opening
   */
  public logFaqAbierta(category: CategoryType, questionText: string) {
    this.logEvent('faq_abierta', {
      category,
      action: 'ver_desglose_faq',
      label: questionText.substring(0, 100),
    });
  }

  /**
   * Event: Contact form sending action
   */
  public logContactoEnviado(supportContactType: string) {
    this.logEvent('contacto_enviado', {
      category: 'contacto',
      action: 'envio_formulario',
      label: `Tipo: ${supportContactType}`,
    });
  }

  /**
   * Event: Errors caught on fields, forms, or division limits
   */
  public logErrorCalculo(category: CategoryType, errorMessage: string) {
    this.logEvent('error_calculo', {
      category,
      action: 'excepcion_ingreso_usuario',
      label: errorMessage,
    });
  }

  /**
   * Event: Result copies to clipboard
   */
  public logResultadoCopiado(category: CategoryType, toolName: string) {
    this.logEvent('resultado_copiado', {
      category,
      action: 'copiar_resultado_clipboard',
      label: `Portapapeles: ${toolName}`,
    });
  }

  /**
   * Event: Job salary and benefits comparisons
   */
  public logComparacionRealizada() {
    this.logEvent('comparacion_realizada', {
      category: 'general',
      action: 'comparador_empleo_ejecutado',
      label: 'Sueldos Comparativos A vs B'
    });
  }
}

// Export singleton instance of analytics framework
export const analytics = new AnalyticsTracker();
