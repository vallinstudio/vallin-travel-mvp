import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const NextJourney = ({ current }) => {
  const navigate = useNavigate();

  // Definimos todas las colecciones aquí para centralizar la navegación
  const allCollections = [
    { 
      id: "disney", 
      title: "Legacy & Magic", 
      subtitle: "Disney & Universal", 
      image: "/castillo.jpg", 
      path: "/disney" 
    },
    { 
      id: "honeymoon", 
      title: "Honeymoon", 
      subtitle: "Curated Romance", 
      image: "/honey.jpeg", 
      path: "/honeymoon" 
    },
    { 
      id: "expedition", 
      title: "Expedition", 
      subtitle: "For the Intrepid", 
      image: "/expedition.jpg", 
      path: "/expedition" 
    },
    { 
      id: "wellness", 
      title: "Wellness", 
      subtitle: "Sanctuaries", 
      image: "/wellness.jpeg", 
      path: "/wellness" 
    }
  ];

  // Filtramos para NO mostrar la página donde ya estás
  const suggestions = allCollections.filter(item => item.id !== current);

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'instant' }); // Te lleva arriba inmediatamente
  };

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8">
            <h3 className="text-3xl font-serif text-black">Continue Your Journey</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                Swipe to Explore <ArrowRight size={14} />
            </span>
        </div>

        {/* CONTENEDOR CARRUSEL (MOBILE SWIPE / DESKTOP GRID) */}
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible scrollbar-hide">
          {suggestions.map((item) => (
            <div 
                key={item.id}
                onClick={() => handleNavigate(item.path)}
                className="relative flex-none w-[85vw] md:w-auto aspect-[4/3] cursor-pointer group snap-center bg-gray-200 overflow-hidden"
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>

              <div className="absolute bottom-6 left-6 text-white">
                <p className="text-[9px] font-bold uppercase tracking-widest text-orange-300 mb-1">
                    {item.subtitle}
                </p>
                <h4 className="text-2xl font-serif italic">
                    {item.title}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NextJourney;