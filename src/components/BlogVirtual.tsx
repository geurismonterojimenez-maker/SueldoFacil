import React, { useState } from 'react';
import { BlogPost, TabType } from '../types';
import { BLOG_POSTS } from '../constants';
import { BookOpen, Calendar, Clock, ArrowRight, CornerDownRight, Tag } from 'lucide-react';
import AdsenseMock from './AdsenseMock';

interface Props {
  onSelectorClick: (tab: TabType) => void;
  activePostSlug?: string | null;
  onPostSelect?: (slug: string | null) => void;
}

export default function BlogVirtual({ onSelectorClick, activePostSlug = null, onPostSelect }: Props) {
  const [selectedPost, setSelectedPost] = React.useState<BlogPost | null>(null);

  React.useEffect(() => {
    if (activePostSlug) {
      const found = BLOG_POSTS.find(post => post.slug === activePostSlug);
      if (found) {
        setSelectedPost(found);
      } else {
        setSelectedPost(null);
      }
    } else {
      setSelectedPost(null);
    }
  }, [activePostSlug]);

  const handleSelectPost = (post: BlogPost | null) => {
    setSelectedPost(post);
    if (onPostSelect) {
      onPostSelect(post ? post.slug : null);
    }
  };

  const getTargetTab = (category: string): TabType => {
    if (category === 'prestaciones') return 'prestaciones';
    if (category === 'isr') return 'isr';
    return 'salario';
  };

  return (
    <div className="space-y-8">
      {/* HEADER DEL BLOG */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-md">
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-full border border-blue-500/30">
            Consejo Laboral y Financiero
          </span>
          <h2 className="text-3xl font-bold tracking-tight">Blog Educativo & Arquitectura SEO</h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Aprende sobre tus derechos como trabajador y tus deberes como empleador conforme al Código de Trabajo dominicano (Ley 16-92) y las regulaciones fiscales vigentes.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
      </div>

      {!selectedPost ? (
        /* LISTADO DE ARTÍCULOS */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS.map(post => (
            <article 
              key={post.slug} 
              className="feed-post-item bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {post.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 leading-snug hover:text-blue-600 cursor-pointer" onClick={() => handleSelectPost(post)}>
                  {post.title}
                </h3>
                
                <p className="text-xs text-slate-500 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-600 flex items-center gap-1 font-mono">
                  <Tag className="w-3 h-3" />
                  {post.category}
                </span>

                <button 
                  onClick={() => handleSelectPost(post)}
                  className="text-xs font-semibold text-slate-900 hover:text-blue-600 flex items-center gap-1 hover:gap-1.5 transition-all text-[11px]"
                >
                  Leer Artículo completo <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        /* DETALLE ARTÍCULO COMPLETO CON SCHEMA JSON-LD AUTOMÁTICO */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* SCRIPTS DE ESQUEMAS SEO INYECTADOS DINÁMICAMENTE PARA CUMPLIR SEO 100 */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": selectedPost.title,
              "datePublished": "2026-06-04",
              "author": {
                "@type": "Organization",
                "name": "SueldoFacil Educativo"
              },
              "description": selectedPost.excerpt
            })}
          </script>
          
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": selectedPost.faq.map(item => ({
                "@type": "Question",
                "name": item.q,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": item.a
                }
              }))
            })}
          </script>

          {/* CONTENIDO PRINCIPAL (IZQUIERDA) */}
          <div className="lg:col-span-8 bg-white border border-slate-200/85 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <button 
              onClick={() => handleSelectPost(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
            >
              ← Volver al Listado de Artículos
            </button>

            <div className="space-y-3">
              <div className="flex items-center gap-2.5 text-[11px] text-slate-400 font-mono">
                <span>{selectedPost.date}</span>
                <span>•</span>
                <span>{selectedPost.readingTime}</span>
                <span>•</span>
                <span className="text-blue-600 font-bold uppercase">{selectedPost.category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {selectedPost.title}
              </h2>
            </div>

            {/* ARTICULO CUERPO */}
            <div className="text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-wrap font-sans font-medium markdown-body">
              {selectedPost.content}
            </div>

            {/* TABLA DE RESUMEN INTEGRADA */}
            <div className="border border-slate-150 rounded-xl overflow-hidden mt-6">
              <div className="bg-slate-50 p-3 font-semibold text-xs text-slate-700 border-b border-slate-150">
                Resumen Rápido del Artículo
              </div>
              <div className="divide-y divide-slate-100">
                {selectedPost.summaryTable.map((row, i) => (
                  <div key={i} className="p-3 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-650">{row.label}</span>
                    <span className="font-mono text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[11px]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs DEL ARTICULO */}
            <div className="space-y-4 border-t border-slate-100 pt-6">
              <h3 className="text-base font-bold text-slate-900">Preguntas Frecuentes Relacionadas con la Ley:</h3>
              <div className="space-y-3">
                {selectedPost.faq.map((fq, index) => (
                  <div key={index} className="bg-slate-50 p-4 border border-slate-200/80 rounded-xl space-y-1">
                    <p className="text-xs font-bold text-slate-800">{fq.q}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{fq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR DETALLE (DERECHA) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 space-y-4">
              <BookOpen className="w-8 h-8 text-blue-400" />
              <h4 className="text-sm font-bold">¿Quieres calcular el impacto legal?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Utiliza nuestra calculadora laboral dedicada para ver tus valores reales actualizados al instante de forma automática.
              </p>
              <button
                onClick={() => onSelectorClick(getTargetTab(selectedPost.category))}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                Ir a la Calculadora Relacionada
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <AdsenseMock slot="blog-article-sidebar" type="square" />
          </div>
        </div>
      )}
    </div>
  );
}
