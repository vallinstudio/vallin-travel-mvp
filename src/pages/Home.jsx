import React from 'react';
import { ArrowRight, Star, ChevronsDown } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';

// Importar Diccionario
import { dictionary } from '../dictionary';

const Home = () => {
  const { openContact, lang } = useOutletContext();
  const navigate = useNavigate();
  const t = dictionary[lang]; // Variables de texto en el idioma activo

  const handleScrollDown = () => {
    const section = document.getElementById('collections');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const collections = [
    { 
      id: 1, 
      title: t.coll.c1, 
      subtitle: "Disney & Universal", 
      image: "/castillo.jpg", 
      pos: "center center",
      path: "/disney" 
    },
    { 
      id: 2, 
      title: t.coll.c2, 
      subtitle: t.coll.sub2, 
      image: "/honey.jpeg", 
      pos: "80% center",
      path: "/honeymoon"
    },
    { 
      id: 3, 
      title: t.coll.c3, 
      subtitle: t.coll.sub3, 
      image: "/expedition.jpg", 
      pos: "center center",
      path: "/expedition" 
    },
    { 
      id: 4, 
      title: t.coll.c4, 
      subtitle: t.coll.sub4, 
      image: "/wellness.jpeg", 
      pos: "center 45%",
      path: "/wellness"   
    }
  ];

  return (
    <>
      {/* 1. HERO SECTION */}
      <div className="hero-wrapper relative h-[100dvh] flex flex-col justify-center items-center bg-black">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            preload="auto"
            className="hero-video opacity-100"
        >
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>

        <div className="hero-overlay"></div>

        <div className="relative z-20 text-center px-4 animate-fade-in">
          <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 text-orange-200 border border-orange-200/30 px-4 py-2 bg-black/30 backdrop-blur-sm inline-block">
            {t.hero.badge}
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 leading-tight drop-shadow-2xl">
            {t.hero.title1}<br />{t.hero.title2}
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-gray-300 mb-8 font-light">
            {t.hero.subtitle}
          </p>

          <button 
            onClick={() => openContact({ destination: "Other", requests: "I am interested in starting a custom journey (General Inquiry from Home)." })}
            className="group relative px-10 py-4 overflow-hidden transition-all duration-300 bg-transparent border border-white hover:bg-white"
          >
            <span className="relative z-10 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-300 group-hover:text-black">
              {t.hero.btn}
            </span>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] group-hover:bg-white transition-all duration-300"></div>
          </button>
        </div>

        <div 
            onClick={handleScrollDown}
            className="absolute bottom-24 md:bottom-10 left-0 right-0 mx-auto w-fit z-20 cursor-pointer text-white/80 hover:text-white transition-colors animate-bounce p-4"
        >
            <ChevronsDown size={32} strokeWidth={1.5} />
        </div>
      </div>

      {/* 2. COLLECTIONS GRID */}
      <section id="collections" className="bg-white text-black py-24 px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mb-3">{t.coll.over}</h2>
            <h3 className="text-5xl font-serif">{t.coll.title}</h3>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-orange-600">
            {t.coll.viewAll} <ArrowRight className="w-4 h-4"/>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {collections.map((item) => (
            <div 
                key={item.id} 
                className="card-container group cursor-pointer bg-gray-100" 
                onClick={() => item.path ? navigate(item.path) : openContact()}
            >
              <img src={item.image} alt={item.title} className="card-img" style={{ objectPosition: item.pos }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 transition duration-500"></div>
              <div className="absolute bottom-10 left-8 text-white z-10 transform transition duration-500 group-hover:-translate-y-2">
                <h4 className="text-3xl font-serif italic mb-2">{item.title}</h4>

                <div className="text-xs uppercase tracking-widest opacity-80 mb-4 whitespace-nowrap flex items-center h-6">
                    {item.subtitle.includes("Disney") ? (
                      <div className="flex items-baseline gap-1.5 opacity-90">
                        <span className="font-walt text-xl leading-none">Disney</span>
                        <span className="text-[8px] opacity-60 relative -top-0.5">&</span>
                        <span className="font-universal text-[10px] tracking-widest leading-none">UNIVERSAL</span>
                      </div>
                    ) : (
                      <span>{item.subtitle}</span>
                    )}
                </div>

                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-orange-500 pb-1 text-orange-300">{t.coll.explore}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. THE VAULT TEASER */}
      <section id="vault" className="dvc-section bg-slate-900">
        <img src="/floridian.jpg" alt="Grand Floridian Style" className="dvc-bg" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center h-full">
          <div className="bg-black/60 backdrop-blur-xl p-10 md:p-16 border border-white/10 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-8 flex-wrap items-center">
              <div className="flex items-center gap-2">
                 <div className="p-1 border border-orange-400/50 rounded-full"><Star className="w-3 h-3 text-orange-400 fill-current"/></div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-200">{t.vault.badge}</span>
              </div>
              <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2 opacity-80 hover:opacity-100 transition-opacity">
                 <span className="text-[8px] uppercase tracking-widest text-gray-300 leading-tight text-right whitespace-pre-line">{t.vault.powered}</span>
                 <img src="/LOGO1BCO_1.svg" alt="Smart Mouse Tech" className="h-12 w-auto" />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-none text-white">{t.vault.title1}<br />{t.vault.title2}</h2>
            <p className="text-2xl font-serif italic text-gray-300 mb-8 font-light border-l-2 border-orange-500 pl-4">{t.vault.subtitle}</p>
            <p className="text-gray-300 text-sm mb-12 leading-relaxed font-light">
              {/* AQUÍ ESTÁ LA MAGIA DEL IDIOMA PARA LA 'S */}
              {t.vault.desc1} <strong><span className="font-walt text-xl">Disney</span> Vacation Club{lang === 'en' ? "'s" : ""}</strong> {t.vault.desc2} 
            </p>
            <div className="grid grid-cols-2 gap-12 mb-10 border-t border-white/10 pt-8">
              <div><p className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">{t.vault.stdRate}</p><p className="text-xl font-serif text-gray-400 line-through decoration-white/30">$4,500 USD</p></div>
              <div><p className="text-[9px] uppercase tracking-widest text-orange-400 mb-2">{t.vault.smartRate}</p><p className="text-4xl font-serif text-white">$2,300 USD</p></div>
            </div>
            <button 
                onClick={() => navigate('/vault')} 
                className="bg-orange-700 w-full py-5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 transition text-white shadow-2xl border border-orange-600/50"
            >
                {t.vault.btn}
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;