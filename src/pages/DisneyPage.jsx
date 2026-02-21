import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Star, Zap, MapPin } from 'lucide-react';
import NextJourney from '../components/NextJourney';
import ScrollIndicator from '../components/ScrollIndicator';
import { dictionary } from '../dictionary';

const getHubs = (td) => ({
  orlando: {
    id: "orlando", label: "Orlando", title: td.orlTitle, subtitle: td.orlSub, description: td.orlDesc, heroImage: "/ML_Orlando.jpeg", 
    brands: [
      { brandPart: "Walt Disney", fontClass: "font-walt capitalize", locPart: "World", highlight: td.wdwHL, vibe: td.wdwVibe,
        items: [{ name: "Magic Kingdom", media: "/wdw-magic.jpg" }, { name: "EPCOT", media: "/wdw-epcot.jpg" }, { name: "Hollywood Studios", media: "/wdw-hollywood.jpg" }, { name: "Animal Kingdom", media: "/wdw-animal.jpg" }]
      },
      { brandPart: "UNIVERSAL", fontClass: "font-universal tracking-widest uppercase", locPart: "Orlando Resort", highlight: td.uniHL, vibe: td.uniVibe,
        items: [{ name: "Universal Studios", media: "/uni-harry.jpg" }, { name: "Islands of Adventure", media: "/uni-island.jpg" }, { name: "Epic Universe", media: "/uni-epic.jpg" }]
      }
    ],
    extended: [{ name: "SeaWorld", image: "/sea-orca.jpg" }, { name: "Discovery Cove", image: "/discovery-ray.jpg" }, { name: "Legoland", image: "/lego-ferrari.jpg" }],
    vipPromise: td.orlVIP
  },
  california: {
    id: "california", label: "California", title: td.calTitle, subtitle: td.calSub, description: td.calDesc, heroImage: "/ML_California.jpg", 
    brands: [
      { brandPart: "Disneyland", fontClass: "font-enchanted text-4xl", locPart: "Resort", highlight: td.dlrHL, vibe: td.dlrVibe,
        items: [{ name: "Disneyland Park", media: "/dlr-castle.jpg" }, { name: "California Adventure", media: "/dlr-cars.jpg" }]
      },
      { brandPart: "UNIVERSAL", fontClass: "font-universal tracking-widest uppercase", locPart: "Studios Hollywood", highlight: td.uhHL, vibe: td.uhVibe,
        items: [{ name: "Universal Studios", media: "/uni-hollywood.jpg" }]
      }
    ],
    extended: [{ name: "Knott's Berry Farm", image: "/knotts-snoopy.jpg" }, { name: "Legoland CA", image: "/lego-california.jpg" }],
    vipPromise: td.calVIP
  },
  global: {
    id: "global", label: "Global Icons", title: td.gloTitle, subtitle: td.gloSub, description: td.gloDesc, heroImage: "/ML_Global.jpg",
    brands: [
      { brandPart: "Disneyland", fontClass: "font-walt capitalize", locPart: "Paris", highlight: td.dlpHL, vibe: td.dlpVibe,
        items: [{ name: "Disneyland Park", media: "/dlp-cascades.jpg" }, { name: "Walt Disney Studios", media: "/dlp-studios.jpg", position: "center 85%" }]
      },
      { prefix: "Tokyo", brandPart: "Disney", fontClass: "font-walt capitalize", locPart: "Resort", highlight: td.tkyHL, vibe: td.tkyVibe,
        items: [{ name: "Tokyo Disneyland", media: "/dlt-tokyo.jpg" }, { name: "Tokyo DisneySea", media: "/dlt-seas.jpg" }]
      },
      { prefix: "Shanghai", brandPart: "Disney", fontClass: "font-walt capitalize", locPart: "Resort", highlight: td.shgHL, vibe: td.shgVibe,
        items: [{ name: "Shanghai Disneyland", media: "/dls-zootopia.jpg" }]
      },
      { prefix: "Hong Kong", brandPart: "Disneyland", fontClass: "font-walt capitalize", locPart: "", highlight: td.hkgHL, vibe: td.hkgVibe,
        items: [{ name: "HK Disneyland", media: "/dlhk-frozen.jpg" }]
      },
      { brandPart: "UNIVERSAL", fontClass: "font-universal tracking-widest uppercase", locPart: "Studios Japan", highlight: td.usjHL, vibe: td.usjVibe,
        items: [{ name: "Universal Japan", media: "/unj-kong.jpg" }]
      }
    ],
    extended: [{ name: "Ferrari World", image: "/ferrari-rossa.jpg" }, { name: "Warner Bros", image: "/wb-pedro.jpg" }, { name: "Legoland Billund", image: "/lego-billund.jpg" }],
    vipPromise: td.gloVIP
  },
  sea: {
    id: "sea", label: "High Seas", title: td.seaTitle, subtitle: td.seaSub, description: td.seaDesc, heroImage: "/ML_Cruise.jpg",
    brands: [
      { brandPart: "Disney", fontClass: "font-walt capitalize", locPart: "Cruise Line", highlight: td.dclHL, vibe: td.dclVibe,
        items: [{ name: "The Fleet", media: "/dc-ship.jpg" }, { name: "Private Islands", media: "/dc-island.jpg" }]
      }
    ],
    extended: [{ name: "Land & Sea", image: "/dc-landsea.jpg" }, { name: "Adventures by Disney", image: "/dc-adventures.jpg" }],
    vipPromise: td.seaVIP
  }
});

const LegacyMagic = () => {
  const { openContact, lang } = useOutletContext();
  const td = dictionary[lang].disneyPage;
  const tfo = dictionary[lang].formOptions;
  const hubs = getHubs(td); 

  const [activeHub, setActiveHub] = useState('orlando');
  const [activeItems, setActiveItems] = useState({});
  const isFirstRender = useRef(true);

  useEffect(() => {
    setActiveItems({});
    if (isFirstRender.current) {
      window.scrollTo(0, 0);
      isFirstRender.current = false;
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeHub]);

  const handleItemActivate = (cardIndex, itemIndex) => {
    setActiveItems(prev => ({ ...prev, [cardIndex]: itemIndex }));
  };

  const currentHub = hubs[activeHub];
  if (!currentHub) return null; 

  const getDestinationValue = () => {
    if (activeHub === 'sea') return "Disney Cruise";
    if (activeHub === 'california') return "Disneyland";
    if (activeHub === 'orlando') return "Disney World";
    return "Other";
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-orange-500 selection:text-white transition-colors duration-500">
      <div className="relative h-[65vh] md:h-[75vh] flex items-end pb-16 justify-center overflow-hidden bg-gray-900">
        {Object.values(hubs).map((hub) => {
            const isActive = activeHub === hub.id;
            return (
                <div key={hub.id} className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`} style={{ pointerEvents: isActive ? 'auto' : 'none' }}>
                    <img src={hub.heroImage} alt={hub.title} className="w-full h-full object-cover" loading="eager" fetchPriority={isActive ? "high" : "auto"}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent"></div>
                </div>
            );
        })}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto">
            <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-orange-600 mb-4 block border-b border-orange-600/30 pb-4 w-fit mx-auto">{currentHub.subtitle}</span>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6 leading-none text-black drop-shadow-sm">{currentHub.title}</h1>
            <p className="text-sm md:text-lg text-gray-700 font-light max-w-2xl mx-auto leading-relaxed">{currentHub.description}</p>
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-md">
        <div className="grid grid-cols-4 h-20 md:h-28 gap-px bg-gray-200">
            {Object.values(hubs).map((hub) => (
                <button key={hub.id} onClick={() => setActiveHub(hub.id)} className="relative group overflow-hidden focus:outline-none bg-white">
                    <img src={hub.heroImage} alt={hub.label} className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${activeHub === hub.id ? 'opacity-100 grayscale-0' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-60'}`}/>
                    <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${activeHub === hub.id ? 'bg-black/20' : 'bg-white/60 group-hover:bg-black/10'}`}>
                        <span className={`text-[9px] md:text-xs font-bold uppercase tracking-[0.15em] px-2 py-1 transition-all duration-300 ${activeHub === hub.id ? 'text-white border-b-2 border-orange-500 shadow-sm' : 'text-gray-600'}`}>{hub.label}</span>
                    </div>
                    {activeHub === hub.id && <div className="absolute bottom-0 left-0 w-full h-1.5 bg-orange-500"></div>}
                </button>
            ))}
        </div>
      </div>

      <ScrollIndicator targetId="hub-content" />

      <div id="hub-content" className="max-w-7xl mx-auto px-6 pb-20 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {currentHub.brands.map((brand, idx) => {
                const currentItemIndex = activeItems[idx] !== undefined ? activeItems[idx] : 0;
                const currentItem = brand.items[currentItemIndex];
                if (!currentItem) return null;

                const msg = tfo.autoFill.disney
                  .replace('{brand}', brand.brandPart)
                  .replace('{location}', brand.locPart)
                  .replace('{hub}', currentHub.label)
                  .replace('{item}', currentItem.name);

                return (
                    <div key={idx} className="relative border border-gray-200 p-8 md:p-12 hover:shadow-2xl transition-all duration-500 group overflow-hidden rounded-sm h-full flex flex-col justify-between border-orange-500/0 bg-gray-200">
                        <div className="absolute inset-0 z-0">
                             <img key={currentItem.media} src={currentItem.media} alt={currentItem.name} className="w-full h-full object-cover transition-transform duration-700" style={{ objectPosition: currentItem.position || "center" }} loading="eager" fetchPriority="high"/>
                             <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90"></div>
                        </div>

                        <div className="relative z-10 text-white drop-shadow-md transition-colors duration-300">
                            <div className="mb-6 flex flex-wrap items-baseline gap-x-2">
                                {brand.prefix && <span className="font-serif text-2xl md:text-3xl text-gray-200">{brand.prefix}</span>}
                                <span className={`${brand.fontClass} text-3xl md:text-4xl text-white`}>{brand.brandPart}</span>
                                <span className="font-serif text-2xl md:text-3xl italic text-gray-200">{brand.locPart}</span>
                            </div>
                            <p className="text-[10px] uppercase tracking-widest mb-6 font-bold flex items-center gap-2 text-orange-300"><Star size={10} fill="currentColor" /> {brand.vibe}</p>
                            <p className="leading-relaxed mb-8 font-light text-sm md:text-base border-l-2 pl-4 text-white border-orange-500">{brand.highlight}</p>
                            <div className="mb-8">
                                <ul className="text-xs space-y-2 font-medium cursor-pointer text-white">
                                    {brand.items.map((item, pIdx) => {
                                        const isActive = pIdx === currentItemIndex;
                                        return (
                                        <li key={pIdx} onClick={() => handleItemActivate(idx, pIdx)} onMouseEnter={() => handleItemActivate(idx, pIdx)} className={`flex items-center gap-3 py-3 border-b transition-all duration-300 ${isActive ? 'border-orange-500 text-orange-300 pl-4 bg-black/30 backdrop-blur-sm rounded-r' : 'border-white/20 hover:text-orange-200 hover:pl-2'}`}>
                                            <MapPin size={14} className={isActive ? 'text-orange-500' : 'text-gray-300'} /> <span className="text-sm tracking-wide">{item.name}</span>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                        </div>

                        <button 
                            onClick={() => openContact({ destination: getDestinationValue(), requests: msg })}
                            className="relative z-10 text-[10px] font-bold uppercase tracking-[0.25em] border-b pb-1 transition-all w-fit mt-4 text-white border-white hover:text-orange-300 hover:border-orange-300"
                        >
                            {td.exploreAcc}
                        </button>
                    </div>
                );
            })}
        </div>

        <div className="mt-16 bg-gray-50 p-8 md:p-12 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                <div className="md:col-span-5 pr-8 md:border-r border-gray-200">
                    <div className="flex items-center gap-2 mb-6">
                         <Zap size={14} className="text-orange-500"/>
                         <h3 className="font-serif text-2xl text-black">{td.extHor}</h3>
                    </div>
                    {currentHub.extended && currentHub.extended.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                            {currentHub.extended.map((item, exIdx) => (
                                <div key={exIdx} className="group relative aspect-square bg-gray-200 overflow-hidden cursor-default shadow-sm border border-gray-200">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 w-full p-1 pb-2 flex items-end justify-center">
                                        <p className="text-[7px] md:text-[9px] font-bold text-white uppercase tracking-wider leading-none text-center whitespace-normal px-1">{item.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400 italic">{td.addons}</p>
                    )}
                </div>

                <div className="md:col-span-7 md:pl-4 flex flex-col justify-center items-start">
                    <h3 className="font-serif text-2xl text-black mb-4">{td.vipDiff}</h3>
                    <p className="text-lg text-gray-700 font-light mb-8 leading-relaxed italic border-l-2 border-orange-500 pl-6">
                        "{currentHub.vipPromise}"
                    </p>
                    <button 
                        onClick={() => openContact({ 
                            destination: getDestinationValue(), 
                            requests: lang === 'es' ? `Planeación VIP para ${currentHub.label}. Interesado en La Diferencia VIP: "${currentHub.vipPromise}"` : `VIP Planning for ${currentHub.label}. Interested in The VIP Difference: "${currentHub.vipPromise}"`
                        })} 
                        className="bg-black text-white px-10 py-5 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 transition shadow-xl w-full md:w-auto"
                    >
                        {td.startPlan}
                    </button>
                </div>
            </div>
        </div>
      </div>

      <NextJourney current="disney" />
    </div>
  );
};

export default LegacyMagic;