import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Star, Zap, Lock, Users, Calendar, Search, AlertCircle, TrendingDown, ArrowRight, Info } from 'lucide-react';
import ScrollIndicator from '../components/ScrollIndicator';

// --- 1. MOTOR DE TEMPORADAS DVC 2026 (REALISTA) ---
const getSeasonTier = (dateString) => {
  if (!dateString) return 'tier2';
  const date = new Date(dateString + 'T00:00:00');
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (month === 9) return 'tier1'; 
  if ((month === 12 && day >= 15) || (month === 4 && day <= 15)) return 'tier4'; 
  if ([2, 3, 6, 7, 8].includes(month)) return 'tier3'; 
  return 'tier2'; 
};

// --- 2. BASE DE DATOS DVC 2026 (IMÁGENES ÚNICAS) ---
const dvcInventory = [
  {
    id: "vgf",
    name: "Grand Floridian Resort & Spa",
    image: "/dvc-floridian.jpg", // EXCLUSIVA
    type: "Flagship Luxury",
    rooms: [
      { type: "Resort Studio", capacity: 5, points: { tier1: 16, tier2: 19, tier3: 23, tier4: 31 }, baseCashRate: 850 },
      { type: "1-Bedroom Villa", capacity: 5, points: { tier1: 33, tier2: 39, tier3: 47, tier4: 63 }, baseCashRate: 1450 },
      { type: "2-Bedroom Villa", capacity: 9, points: { tier1: 45, tier2: 54, tier3: 64, tier4: 87 }, baseCashRate: 2300 },
      { type: "3-Bedroom Grand Villa", capacity: 12, points: { tier1: 104, tier2: 121, tier3: 142, tier4: 185 }, baseCashRate: 4200 }
    ]
  },
  {
    id: "poly",
    name: "Polynesian Villas & Bungalows",
    image: "/dvc-polynesian.jpg", // EXCLUSIVA (Ya no usa hm-bora)
    type: "Tropical Luxury",
    rooms: [
      { type: "Deluxe Studio", capacity: 5, points: { tier1: 16, tier2: 20, tier3: 25, tier4: 34 }, baseCashRate: 900 },
      { type: "Bungalow", capacity: 8, points: { tier1: 112, tier2: 130, tier3: 155, tier4: 198 }, baseCashRate: 5000 }
    ]
  },
  {
    id: "riv",
    name: "Disney's Riviera Resort",
    image: "/dvc-riviera.jpg", // EXCLUSIVA (Ya no usa hm-amalfi)
    type: "European Chic",
    rooms: [
      { type: "Tower Studio", capacity: 2, points: { tier1: 11, tier2: 13, tier3: 16, tier4: 21 }, baseCashRate: 550 },
      { type: "Deluxe Studio", capacity: 5, points: { tier1: 15, tier2: 18, tier3: 21, tier4: 28 }, baseCashRate: 780 },
      { type: "1-Bedroom Villa", capacity: 5, points: { tier1: 30, tier2: 35, tier3: 41, tier4: 55 }, baseCashRate: 1150 },
      { type: "2-Bedroom Villa", capacity: 9, points: { tier1: 40, tier2: 48, tier3: 57, tier4: 76 }, baseCashRate: 1900 }
    ]
  },
  {
    id: "blt",
    name: "Bay Lake Tower (Contemporary)",
    image: "/dvc-baylake.jpg", // EXCLUSIVA (Ya no usa exp-echo)
    type: "Modern Luxury",
    rooms: [
      { type: "Deluxe Studio", capacity: 4, points: { tier1: 14, tier2: 16, tier3: 20, tier4: 26 }, baseCashRate: 720 },
      { type: "1-Bedroom Villa", capacity: 5, points: { tier1: 28, tier2: 32, tier3: 39, tier4: 52 }, baseCashRate: 1100 },
      { type: "2-Bedroom Villa", capacity: 9, points: { tier1: 38, tier2: 43, tier3: 52, tier4: 70 }, baseCashRate: 1800 },
      { type: "3-Bedroom Grand Villa", capacity: 12, points: { tier1: 85, tier2: 98, tier3: 115, tier4: 145 }, baseCashRate: 3500 }
    ]
  },
  {
    id: "akl",
    name: "Animal Kingdom Lodge",
    image: "/dvc-akl.jpg", // EXCLUSIVA (Ya no usa hm-safari)
    type: "Exotic Luxury",
    rooms: [
      { type: "Deluxe Studio", capacity: 4, points: { tier1: 10, tier2: 12, tier3: 15, tier4: 20 }, baseCashRate: 550 },
      { type: "1-Bedroom Villa", capacity: 5, points: { tier1: 22, tier2: 26, tier3: 31, tier4: 42 }, baseCashRate: 950 },
      { type: "2-Bedroom Villa", capacity: 9, points: { tier1: 29, tier2: 34, tier3: 40, tier4: 55 }, baseCashRate: 1500 }
    ]
  }
];

// Datos de Colecciones
const collections = [
    { id: "disney", title: "Legacy & Magic", subtitle: "Disney & Universal", image: "/castillo.jpg", path: "/disney" },
    { id: "honeymoon", title: "Honeymoon", subtitle: "Curated Romance", image: "/honey.jpeg", path: "/honeymoon" },
    { id: "expedition", title: "Expedition", subtitle: "For the Intrepid", image: "/expedition.jpg", path: "/expedition" },
    { id: "wellness", title: "Wellness", subtitle: "Sanctuaries", image: "/wellness.jpeg", path: "/wellness" }
];

const VaultPage = () => {
  const { openContact } = useOutletContext();
  const navigate = useNavigate();

  // STATES
  const [guestCount, setGuestCount] = useState(2);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableOptions, setAvailableOptions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      window.scrollTo(0, 0);
      isFirstRender.current = false;
    }
  }, []);

  const handleStartDateChange = (e) => {
    const newStart = e.target.value;
    setStartDate(newStart);

    // AUTO-AJUSTE: Check-Out default a +1 día
    if (newStart) {
        // Corrección de zona horaria simple
        const d = new Date(newStart);
        d.setDate(d.getDate() + 1);
        setEndDate(d.toISOString().split('T')[0]);
    } else {
        setEndDate("");
    }
  };

  const handleEndDateChange = (e) => {
    const selectedEnd = e.target.value;
    if (startDate && selectedEnd <= startDate) {
        // Validación silenciosa: forzar +1 día si el usuario intenta fecha anterior
        const d = new Date(startDate);
        d.setDate(d.getDate() + 1);
        setEndDate(d.toISOString().split('T')[0]);
    } else {
        setEndDate(selectedEnd);
    }
  };

  // LÓGICA DE NEGOCIO
  const handleSearch = () => {
    if (!startDate || !endDate) return;

    setIsCalculating(true);
    setHasSearched(true);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      setIsCalculating(false);
      return;
    }

    const diffTime = Math.abs(end - start);
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const currentTier = getSeasonTier(startDate);

    const SEASONAL_CASH_MULTIPLIERS = { tier1: 1.0, tier2: 1.2, tier3: 1.4, tier4: 1.8 };
    const cashMultiplier = SEASONAL_CASH_MULTIPLIERS[currentTier];

    setTimeout(() => {
      const results = [];

      dvcInventory.forEach(resort => {
        // 1. Single Room
        const singleRooms = resort.rooms.filter(room => room.capacity >= guestCount);
        singleRooms.forEach(room => {
          const pointsPerNight = room.points[currentTier];
          const totalPoints = pointsPerNight * nights;

          const POINT_COST_MARKET = 22; 
          const MARGIN = 1.30; 

          const smartPrice = Math.round(totalPoints * POINT_COST_MARKET * MARGIN);
          const cashPrice = Math.round((room.baseCashRate * cashMultiplier * nights) * 1.125);

          const savings = cashPrice - smartPrice;
          const percent = Math.round((savings / cashPrice) * 100);

          results.push({
            type: "single",
            resortName: resort.name,
            resortImage: resort.image,
            roomName: room.type,
            capacity: room.capacity,
            nights,
            seasonTier: currentTier,
            cashPrice,
            smartPrice,
            savings,
            percent
          });
        });

        // 2. Split Room
        const splitRooms = resort.rooms.filter(room => (room.capacity * 2) >= guestCount && room.capacity < guestCount);
        splitRooms.forEach(room => {
          const pointsPerNight = room.points[currentTier] * 2;
          const totalPoints = pointsPerNight * nights;

          const POINT_COST_MARKET = 22; 
          const MARGIN = 1.30;

          const smartPrice = Math.round(totalPoints * POINT_COST_MARKET * MARGIN);
          const cashPrice = Math.round(((room.baseCashRate * 2) * cashMultiplier * nights) * 1.125);

          const savings = cashPrice - smartPrice;
          const percent = Math.round((savings / cashPrice) * 100);

          results.push({
            type: "split",
            resortName: resort.name,
            resortImage: resort.image,
            roomName: `2x ${room.type}`,
            capacity: room.capacity * 2,
            nights,
            seasonTier: currentTier,
            cashPrice,
            smartPrice,
            savings,
            percent
          });
        });
      });

      // Ordenar: Menor Precio Primero
      setAvailableOptions(results.sort((a, b) => a.smartPrice - b.smartPrice));
      setIsCalculating(false);
    }, 800);
  };

  return (
    <div className="bg-white text-black min-h-screen font-sans selection:bg-orange-500 selection:text-white transition-colors duration-500">

      {/* 1. HERO SECTION */}
      <div className="relative h-[60vh] md:h-[70vh] flex flex-col items-center justify-center bg-gray-900 overflow-hidden text-center px-4">
        <div className="absolute inset-0 opacity-100">
            {/* Imagen del Hero sigue siendo Floridian, esa está ok */}
            <img src="/floridian.jpg" alt="Vault Background" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto mt-10 pt-32">
            <div className="flex items-center justify-center gap-2 mb-4">
                <Lock size={16} className="text-orange-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500">
                    Smart Mouse Tech
                </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif italic mb-6 leading-none text-white drop-shadow-lg">
                The Vault
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto leading-relaxed drop-shadow-md">
                Intelligent Inventory Arbitrage. <br/>
                <span className="text-sm text-gray-300 mt-2 font-sans tracking-wide">
                    Real-Time Seasonality Analysis & Multi-Unit Logic.
                </span>
            </p>
        </div>

        <div className="pb-12">
            <ScrollIndicator targetId="engine-section" />
        </div>
      </div>

      {/* 2. ENGINE INPUTS */}
      <div id="engine-section" className="max-w-7xl mx-auto px-6 pb-20 pt-12 relative z-20">
        <div className="bg-white rounded-sm shadow-2xl border border-gray-200 overflow-hidden">

            <div className="bg-black text-white p-6 md:p-8 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h3 className="text-xl font-serif italic flex items-center gap-3">
                        <img src="/LOGO1BCO_1.svg" alt="Smart Mouse Logo" className="h-8 w-auto" />
                        SMART MOUSE (Quote Engine)
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest pl-1">
                        Configure party & dates to unlock inventory
                    </p>
                </div>
            </div>

            <div className="p-8 md:p-12 bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Users size={12} /> Party Size
                        </label>
                        <select 
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                            className="w-full bg-white border border-gray-300 p-4 font-serif text-lg focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                        >
                            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(n => (
                                <option key={n} value={n}>{n} Guests</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Calendar size={12} /> Check-In
                        </label>
                        <input 
                            type="date" 
                            className="w-full bg-white border border-gray-300 p-4 font-sans text-sm focus:outline-none focus:border-orange-500 uppercase"
                            value={startDate}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={handleStartDateChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                            <Calendar size={12} /> Check-Out
                        </label>
                        <input 
                            type="date" 
                            className={`w-full bg-white border border-gray-300 p-4 font-sans text-sm focus:outline-none focus:border-orange-500 uppercase ${!startDate ? 'opacity-50 cursor-not-allowed' : ''}`}
                            value={endDate}
                            min={startDate ? startDate : ""}
                            disabled={!startDate}
                            onChange={handleEndDateChange}
                        />
                    </div>

                    <div>
                        <button 
                            onClick={handleSearch}
                            disabled={!startDate || !endDate}
                            className={`w-full p-4 font-bold uppercase tracking-[0.2em] text-xs transition-all shadow-lg h-[54px] flex items-center justify-center gap-2
                                ${!startDate || !endDate ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-black'}
                            `}
                        >
                            {isCalculating ? "Calculating..." : <><Search size={14} /> Find Rates</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* RESULTS */}
            <div className="bg-white min-h-[300px]">

                {!hasSearched && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                        <Lock size={48} className="mb-4 text-gray-200" />
                        <p className="font-serif text-xl">System Standby</p>
                        <p className="text-xs uppercase tracking-widest mt-2">Enter trip details to calculate arbitrage.</p>
                    </div>
                )}

                {isCalculating && (
                    <div className="flex flex-col items-center justify-center h-full py-20 animate-pulse">
                        <Zap size={48} className="mb-4 text-orange-500" />
                        <p className="font-serif text-xl">Cross-referencing 2026 Point Tables...</p>
                        <p className="text-xs uppercase tracking-widest mt-2">Checking Inventory Splitting Logic</p>
                    </div>
                )}

                {!isCalculating && hasSearched && availableOptions.length > 0 && (
                    <div className="p-8">
                        <div className="flex justify-between items-end mb-6 border-b border-gray-100 pb-4">
                            <div>
                                <h4 className="font-serif text-2xl">Identified Opportunities</h4>
                                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                                    {availableOptions[0].nights} Nights &bull; {guestCount} Guests
                                </p>
                            </div>
                            <span className="text-[10px] font-bold bg-black text-white px-3 py-1 uppercase tracking-widest">
                                {availableOptions.length} Options
                            </span>
                        </div>

                        <div className="space-y-6">
                            {availableOptions.map((opt, idx) => (
                                <div key={idx} className="group border border-gray-200 p-6 hover:shadow-2xl transition-all duration-500 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">

                                        <div className="md:col-span-4 flex items-center gap-4">
                                            <div className="w-20 h-20 bg-gray-200 shrink-0 overflow-hidden rounded-sm">
                                                {/* IMAGEN ESPECÍFICA DEL DVC */}
                                                <img src={opt.resortImage} className="w-full h-full object-cover" alt={opt.resortName}/>
                                            </div>
                                            <div>
                                                <h5 className="font-serif text-lg leading-tight">{opt.resortName}</h5>
                                                <p className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-1 flex items-center gap-2">
                                                    {opt.roomName}
                                                    {opt.type === 'split' && (
                                                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[8px] rounded-sm">
                                                            MULTI-UNIT
                                                        </span>
                                                    )}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-[9px] border border-gray-200 px-2 py-0.5 rounded text-gray-400 flex items-center gap-1">
                                                        <Users size={8}/> Capacity: {opt.capacity}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-5 flex justify-between items-center px-4 md:border-l md:border-r border-gray-100">
                                            <div className="text-center opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                                <p className="text-[9px] uppercase tracking-widest text-gray-500 mb-1">Disney Direct</p>
                                                <p className="text-xl font-serif text-gray-800 line-through decoration-red-500 decoration-1">
                                                    ${opt.cashPrice.toLocaleString()}
                                                </p>
                                            </div>

                                            <ArrowRight size={16} className="text-gray-300" />

                                            <div className="text-center scale-110">
                                                <p className="text-[9px] uppercase tracking-widest text-orange-600 mb-1 font-bold">Smart Rate</p>
                                                <p className="text-2xl font-serif text-black font-medium">
                                                    ${opt.smartPrice.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="md:col-span-3 flex flex-col items-end justify-center gap-3">
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-green-600 flex items-center justify-end gap-1">
                                                    <TrendingDown size={14}/> Save {opt.percent}%
                                                </span>
                                                <span className="text-[10px] text-gray-400 block">
                                                    approx. ${opt.savings.toLocaleString()} USD
                                                </span>
                                            </div>
                                            {/* BOTÓN CONTEXTUAL INTELIGENTE */}
                                            <button 
                                                onClick={() => openContact({
                                                    source: 'vault',
                                                    resortName: opt.resortName,
                                                    roomName: opt.roomName,
                                                    price: opt.smartPrice,
                                                    savings: opt.percent,
                                                    guests: guestCount,
                                                    dates: { start: startDate, end: endDate }
                                                })}
                                                className="bg-black text-white px-6 py-3 text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-orange-600 transition w-full"
                                            >
                                                Request Quote
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!isCalculating && hasSearched && availableOptions.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
                        <AlertCircle size={48} className="mb-4 text-red-300" />
                        <p className="font-serif text-xl">High Demand / No Inventory</p>
                        <p className="text-xs uppercase tracking-widest mt-2">Try adjusting dates or splitting party size.</p>
                    </div>
                )}

            </div>
        </div>
      </div>

      {/* 3. EXPLAINER */}
      <div className="bg-gray-50 py-20 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-serif mb-12">The Smart Mouse Protocol</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                <div>
                    <div className="text-4xl text-gray-300 font-serif mb-4">01.</div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-3">Inventory Arbitrage</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        We leverage the DVC rental market, acquiring wholesale points to book premium villas at a fraction of the rack rate.
                    </p>
                </div>
                <div>
                    <div className="text-4xl text-gray-300 font-serif mb-4">02.</div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-3">Seamless Booking</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Our team handles the complexity. You receive an official Disney confirmation number linked directly to your My Disney Experience app.
                    </p>
                </div>
                <div>
                    <div className="text-4xl text-gray-300 font-serif mb-4">03.</div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-3">Intelligent Luxury</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Same room, same view, same perks. The only difference is the price you pay.
                    </p>
                </div>
            </div>
        </div>
      </div>

      {/* 4. CONTINUE YOUR JOURNEY (CAROUSEL HÍBRIDO) */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-end mb-8">
                <h3 className="text-3xl font-serif text-black">Continue Your Journey</h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1">
                    Swipe to Explore <ArrowRight size={14} />
                </span>
            </div>

            {/* CARRUSEL EN MÓVIL (SWIPE) | GRID EN DESKTOP (4 COLS) */}
            <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible scrollbar-hide">
              {collections.map((item) => (
                <div 
                    key={item.id}
                    onClick={() => {
                        navigate(item.path);
                        window.scrollTo({ top: 0, behavior: 'instant' });
                    }}
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

    </div>
  );
};

export default VaultPage;