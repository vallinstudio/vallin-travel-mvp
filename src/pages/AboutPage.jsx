import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Anchor, Compass } from 'lucide-react';
import ScrollIndicator from '../components/ScrollIndicator';

// --- IMPORTAMOS EL DICCIONARIO ---
import { dictionary } from '../dictionary';

const AboutPage = () => {
  const { openContact, lang } = useOutletContext();
  const ta = dictionary[lang].aboutPage;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Componente de Marca (Regla de Oro)
  const BrandName = () => (
    <span style={{ fontFamily: "'Syncopate', sans-serif" }} className="tracking-widest">
      <span className="font-bold">vaLLin.</span><span className="font-normal">traveL</span>
    </span>
  );

  // Prefijo para la marca según el idioma ("At " o "En ")
  const brandPrefix = lang === 'es' ? 'En ' : 'At ';

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-orange-500 selection:text-white">

      {/* 1. HERO SECTION (IMAGEN DE FONDOS CON GLOBOS) */}
      <div className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-center bg-gray-900 overflow-hidden text-center px-4">
        <div className="absolute inset-0 z-0">
          <img 
            src="/ourstory.jpg" 
            alt="Our Story" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Capa oscura elegante para que resalte el menú blanco y el texto */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 max-w-4xl mx-auto mt-10 pt-20">
          <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-orange-400 mb-6 border-b border-orange-500/30 pb-4 w-fit mx-auto">
            {ta.subtitle}
          </h2>
          <h1 className="text-5xl md:text-7xl font-serif italic mb-8 leading-none text-white drop-shadow-lg">
            {ta.title}
          </h1>
        </div>

        {/* Flecha indicadora que baja al contenido */}
        <div className="pb-12">
            <ScrollIndicator targetId="about-content" />
        </div>
      </div>

      {/* 2. CONTENIDO PRINCIPAL */}
      <div id="about-content" className="max-w-3xl mx-auto px-6 py-24 relative z-20">

        <div className="space-y-16">
          {/* SECCIÓN 1 CON REGLA DE ORO APLICADA */}
          <section className="text-center md:text-left">
            <h3 className="text-2xl font-serif mb-4 flex items-center justify-center md:justify-start gap-3">
              <Compass className="text-orange-500" size={24} />
              {ta.p1Title}
            </h3>
            <p className="text-lg md:text-xl text-gray-600 font-light leading-relaxed border-l-0 md:border-l-2 md:border-orange-500 md:pl-6 text-justify md:text-left">
              {brandPrefix}<BrandName />, {ta.p1Desc}
            </p>
          </section>

          {/* IMAGEN INTERMEDIA (CAMBIADA A TRAIN.JPG) */}
          <div className="w-full h-64 md:h-96 bg-gray-200 overflow-hidden shadow-2xl">
            <img src="/train.jpg" alt="Luxury Train Travel" className="w-full h-full object-cover" />
          </div>

          {/* SECCIÓN 2 */}
          <section className="text-center md:text-left">
            <h3 className="text-2xl font-serif mb-4">{ta.p2Title}</h3>
            <p className="text-base md:text-lg text-gray-600 font-light leading-relaxed text-justify md:text-left">
              {ta.p2Desc}
            </p>
          </section>

          {/* SECCIÓN 3: CERTIFICACIONES */}
          <section className="bg-gray-50 p-8 md:p-12 border border-gray-100 shadow-xl">
            <h3 className="text-xl font-serif mb-4 text-center">{ta.p3Title}</h3>
            <p className="text-sm text-gray-600 font-light leading-relaxed text-center mb-8">
              {ta.p3Desc}
            </p>

            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
               <div className="px-4 py-3 border border-gray-300 bg-white text-[10px] uppercase tracking-wider flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-orange-600"/> 
                   <span className="font-walt text-base leading-none capitalize">Disney</span>
                   <span>Certified</span>
               </div>
               <div className="px-4 py-3 border border-gray-300 bg-white text-[10px] uppercase tracking-wider flex items-center gap-2">
                   <ShieldCheck className="w-4 h-4 text-orange-600"/> 
                   <span className="font-universal text-[10px] leading-none tracking-widest">UNIVERSAL</span>
                   <span>Certified</span>
               </div>
               <div className="px-4 py-3 border border-gray-300 bg-white text-[10px] uppercase tracking-wider flex items-center gap-2">
                   <Anchor className="w-4 h-4 text-orange-600"/> 
                   <span>CLIA Member</span>
               </div>
            </div>
          </section>

          {/* PROMISE & CTA */}
          <section className="text-center pt-12 border-t border-gray-200">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">{ta.promiseTitle}</h3>
            <p className="text-2xl md:text-3xl font-serif italic mb-10 text-black">
              "{ta.promiseDesc}"
            </p>
            <button 
                onClick={() => openContact({ destination: "Other", requests: "I want to start designing my journey." })}
                className="bg-black text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 transition shadow-xl"
            >
                {ta.startPlan}
            </button>
          </section>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;