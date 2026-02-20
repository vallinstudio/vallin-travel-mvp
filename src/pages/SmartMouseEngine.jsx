import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Users, Calendar, Search, 
  ArrowRight, Sparkles, Check, Phone, Video, 
  FileText, BookOpen, Ship, Castle,
  MapPin, X, Download, Anchor, Info, Clock, ExternalLink, Globe, AlertCircle
} from 'lucide-react';

// --- 0. BRANDING COMPONENTS ---
const BrandName = ({ dark = false }) => (
  <span style={{ fontFamily: "'Syncopate', sans-serif" }} className={`tracking-tighter select-none ${dark ? 'text-[#0f172a]' : 'text-white'}`}>
    <span className="font-bold">SMART</span><span className={`font-light ${dark ? 'text-[#0f172a]' : 'text-[#d4af37]'}`}>MOUSE</span>
  </span>
);

const VallinBrand = () => (
  <span style={{ fontFamily: "'Syncopate', sans-serif" }} className="tracking-widest text-[10px]">
    <span className="font-bold">vaLLin.</span><span className="font-normal">traveL</span>
  </span>
);

// --- 1. DATA & LOGIC ---

const getNextDay = (dateString) => {
    if (!dateString) return "";
    // Fix zona horaria para asegurar calculo correcto
    const date = new Date(dateString + 'T00:00:00');
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};

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

// DURACIONES DINÁMICAS
const CRUISE_DURATIONS = {
    caribbean: [
        { val: 3, label: "3 Nights (Bahamas)" },
        { val: 4, label: "4 Nights (Bahamas/Caribbean)" },
        { val: 5, label: "5 Nights (Western Caribbean)" },
        { val: 7, label: "7 Nights (Eastern/Western Caribbean)" }
    ],
    europe: [
        { val: 7, label: "7 Nights (Mediterranean/Fjords)" },
        { val: 10, label: "10+ Nights (Grand Europe)" }
    ],
    alaska: [
        { val: 5, label: "5 Nights (Alaskan Sampler)" },
        { val: 7, label: "7 Nights (Dawes Glacier)" },
        { val: 9, label: "9 Nights (Alaskan Explorer)" }
    ],
    hawaii: [
        { val: 10, label: "10 Nights (Honolulu - Vancouver)" },
        { val: 13, label: "13 Nights (South Pacific Repositioning)" }
    ]
};

const EXOTIC_DESTINATIONS = [
    "Australia & New Zealand", "Panama Canal", "Transatlantic",
    "Singapore / Southeast Asia", "South Pacific", "Other Global Destination"
];

// INVENTARIO
const dvcInventory = [
  { id: "vgf", name: "Grand Floridian Resort", image: "/dvc-floridian.jpg", type: "Flagship Luxury", 
    rooms: [
      { type: "Resort Studio", capacity: 5, points: { tier1: 16, tier2: 19, tier3: 23, tier4: 31 }, baseCashRate: 850 },
      { type: "1-Bedroom Villa", capacity: 5, points: { tier1: 33, tier2: 39, tier3: 47, tier4: 63 }, baseCashRate: 1450 },
      { type: "2-Bedroom Villa", capacity: 9, points: { tier1: 45, tier2: 54, tier3: 64, tier4: 87 }, baseCashRate: 2300 }
    ] 
  },
  { id: "poly", name: "Polynesian Villas", image: "/dvc-polynesian.jpg", type: "Tropical Luxury", 
    rooms: [
      { type: "Deluxe Studio", capacity: 5, points: { tier1: 16, tier2: 20, tier3: 25, tier4: 34 }, baseCashRate: 900 },
      { type: "Bungalow", capacity: 8, points: { tier1: 115, tier2: 135, tier3: 160, tier4: 190 }, baseCashRate: 5000 }
    ] 
  },
  { id: "riv", name: "Disney's Riviera Resort", image: "/dvc-riviera.jpg", type: "European Chic", 
    rooms: [
      { type: "Tower Studio", capacity: 2, points: { tier1: 11, tier2: 13, tier3: 16, tier4: 21 }, baseCashRate: 550 },
      { type: "Deluxe Studio", capacity: 5, points: { tier1: 15, tier2: 18, tier3: 21, tier4: 28 }, baseCashRate: 780 }
    ] 
  }
];

const globalInventory = {
  florida: [
    { id: "wdw-akl", name: "Animal Kingdom Lodge", image: "/wdw-akl.jpg", type: "Deluxe", baseRate: 680, capacity: 4, tags: ["Savanna View"] },
    { id: "wdw-poly-htl", name: "Polynesian Village", image: "/wdw-poly.jpg", type: "Deluxe", baseRate: 850, capacity: 5, tags: ["Monorail"] },
    { id: "wdw-cont", name: "Contemporary Resort", image: "/wdw-contemporary.jpg", type: "Deluxe", baseRate: 790, capacity: 5, tags: ["Monorail"] },
    { id: "wdw-yc", name: "Disney's Yacht Club", image: "/wdw-yacht.jpg", type: "Deluxe", baseRate: 720, capacity: 5, tags: ["Epcot Area"] },
    { id: "wdw-csr", name: "Coronado Springs", image: "/wdw-coronado.jpg", type: "Moderate", baseRate: 380, capacity: 4, tags: ["Tower"] },
    { id: "wdw-pop", name: "Pop Century Resort", image: "/wdw-pop.jpg", type: "Value", baseRate: 210, capacity: 4, tags: ["Skyliner"] }
  ],
  california: [
    { id: "dlr-gch", name: "Grand Californian", image: "/dlr-grandcal.jpg", type: "Premium", baseRate: 980, capacity: 5, tags: ["Luxury"] },
    { id: "dlr-dlh", name: "Disneyland Hotel", image: "/dlr-disneylandhotel.jpg", type: "Classic", baseRate: 650, capacity: 5, tags: ["Iconic"] },
    { id: "dlr-pp", name: "Pixar Place Hotel", image: "/dlr-pixar.jpg", type: "Moderate", baseRate: 490, capacity: 4, tags: ["New"] }
  ],
  europe: [
    { id: "dlp-hotel", name: "Disneyland Hotel Paris", image: "/global-paris.jpg", type: "Royal 5-Star", baseRate: 1200, capacity: 4, tags: ["Royal Entry"] },
    { id: "dlp-marvel", name: "Hotel New York - Marvel", image: "/global-marvel.jpg", type: "4-Star", baseRate: 650, capacity: 4, tags: ["Marvel Theme"] } 
  ],
  asia: [
    { id: "t-mira", name: "Tokyo DisneySea MiraCosta", image: "/global-tokyo.jpg", type: "Luxury", baseRate: 800, capacity: 4, tags: ["In-Park"] },
    { id: "sh-dlh", name: "Shanghai Disneyland Hotel", image: "/global-shanghai.jpg", type: "Signature", baseRate: 500, capacity: 4, tags: ["Art Nouveau"] },
    { id: "hk-dlh", name: "Hong Kong Disneyland Hotel", image: "/global-hk.jpg", type: "Victorian", baseRate: 450, capacity: 4, tags: ["Sea View"] }
  ]
};

const cruiseInventory = {
  caribbean: [ 
    { id: "dcl-wish", name: "Disney Wish / Treasure", image: "/dcl-wish.jpg", route: "Bahamas", validMonths: [1,2,3,4,5,6,7,8,9,10,11,12], baseRatePerNight: 350 },
    { id: "dcl-magic", name: "Disney Magic", image: "/dcl-magic.jpg", route: "Caribbean", validMonths: [1,2,3,4,5,6,7,8,9,10,11,12], baseRatePerNight: 300 }
  ],
  europe: [ 
    { id: "dcl-fantasy", name: "Disney Fantasy", image: "/dcl-europe.jpg", route: "Mediterranean", validMonths: [5,6,7,8], baseRatePerNight: 450 }
  ],
  alaska: [ 
    { id: "dcl-wonder", name: "Disney Wonder", image: "/dcl-alaska.jpg", route: "Alaska", validMonths: [5,6,7,8,9], baseRatePerNight: 400 }
  ],
  hawaii: [ 
    { id: "dcl-wonder-h", name: "Disney Wonder", image: "/dcl-hawaii.jpg", route: "Hawaii", validMonths: [2,9], baseRatePerNight: 340 } 
  ]
};

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfTry8sbHFzBBPdY-rh2rAwC2t2iDS7I6C501_O0O2ECnVKENy8wwZjNqmUOTBryKb/exec";

// --- 2. MOTOR LOGIC ---
const SmartMouseEngine = () => {
  const navigate = useNavigate();

  // STATES
  const [step, setStep] = useState(0); 
  const [vibe, setVibe] = useState(null); 
  const [subRegion, setSubRegion] = useState(null);

  // FORM DATA
  const [guestCount, setGuestCount] = useState(2);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [cruiseNights, setCruiseNights] = useState(""); 
  const [exoticDest, setExoticDest] = useState("");
  const [specialReq, setSpecialReq] = useState("");

  // CONTACT DATA
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+52");
  const [leadPhone, setLeadPhone] = useState("");

  // CHECKOUT DATA
  const [results, setResults] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('smart'); 
  const [conciergeAddOn, setConciergeAddOn] = useState(false);
  const [insuranceCheck, setInsuranceCheck] = useState(false);
  const [legalCheck, setLegalCheck] = useState(false);

  // MODAL DATA
  const [showMagnetModal, setShowMagnetModal] = useState(false);
  const [magnetType, setMagnetType] = useState('free'); 
  const [magnetData, setMagnetData] = useState({ name: '', email: '', phone: '', handle: '' });

  // REFS
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // RESETEAR DATOS AL CAMBIAR
  useEffect(() => {
      setStartDate("");
      setEndDate("");
      setCruiseNights(""); 
      setExoticDest("");
  }, [vibe, subRegion]);

  // --- ACTIONS ---
  const handleVibeSelect = (selectedVibe) => {
    setVibe(selectedVibe);
    if (selectedVibe === 'dvc') {
        setSubRegion('florida'); 
        setStep(1);
    } else {
        setStep(0.5); 
    }
  };

  const handleSubRegionSelect = (r) => {
      setSubRegion(r);
      setStep(1);
      if (vibe === 'cruise' && r !== 'exotic') {
          const defaults = { 'caribbean': 4, 'europe': 7, 'alaska': 7, 'hawaii': 10 };
          setCruiseNights(defaults[r] || 4);
      }
  };

  const switchToDVC = () => {
      setVibe('dvc');
      setSubRegion('florida');
      setStep(1);
  };

  // --- LOGICA DE FECHAS MEJORADA (AUTO-FILL +1) ---
  const handleStartDateChange = (e) => {
      const newStart = e.target.value;
      setStartDate(newStart);

      // Si estamos en hotel (DVC/Global), auto-rellenar checkout para que el calendario abra en el mes correcto
      if (newStart && vibe !== 'cruise') {
          const nextDay = getNextDay(newStart);
          setEndDate(nextDay);
      }
  };

  const handleSearch = () => {
    // CAMINO EXÓTICO
    if (vibe === 'cruise' && subRegion === 'exotic') {
        if (!exoticDest) return alert("Please select a destination of interest.");
        setSelectedOption({ name: "Custom Portfolio", sub: exoticDest, price: "TBD", desc: "Manual Quote" });
        setStep(4);
        return;
    }

    if (!startDate) return;

    // VALIDACIÓN CRUCEROS
    if (vibe === 'cruise') {
        const date = new Date(startDate);
        const month = date.getMonth() + 1;
        const inventory = cruiseInventory[subRegion] || cruiseInventory.caribbean;
        const isValidSeason = inventory.some(ship => ship.validMonths.includes(month));
        if (!isValidSeason) {
            alert(`Note: Most ${subRegion?.toUpperCase()} cruises do not sail in this month. Please try a different date.`);
            return;
        }
    } else {
        // VALIDACIÓN HOTELES
        if (!endDate) {
            alert("Please select a Check-Out date.");
            return;
        }
        if (new Date(endDate) <= new Date(startDate)) {
            alert("Check-Out date must be after Check-In date.");
            return;
        }
    }

    setStep(2); 

    setTimeout(() => {
      let calcResults = [];
      const start = new Date(startDate);
      const safeCruiseNights = cruiseNights || 4;
      const nights = vibe === 'cruise' ? parseInt(safeCruiseNights) : Math.max(1, Math.ceil((new Date(endDate) - start)/(1000*60*60*24)));

      const currentTier = getSeasonTier(startDate);
      const SEASONAL_CASH_MULTIPLIERS = { tier1: 1.0, tier2: 1.2, tier3: 1.4, tier4: 1.8 };
      const cashMultiplier = SEASONAL_CASH_MULTIPLIERS[currentTier];

      const reqLower = specialReq.toLowerCase();
      const guests = parseInt(guestCount);

      if (vibe === 'dvc') {
        dvcInventory.forEach(resort => {
          const isPriority = reqLower.includes(resort.name.toLowerCase().split(' ')[0].toLowerCase());
          resort.rooms.forEach(room => {
            const roomsNeeded = Math.ceil(guests / room.capacity);
            const pointsPerNight = room.points[currentTier];
            const totalPoints = pointsPerNight * nights * roomsNeeded;
            const smart = Math.round(totalPoints * 22 * 1.30); 
            const rack = Math.round(room.baseCashRate * nights * roomsNeeded * 1.125); 
            const subTitle = roomsNeeded > 1 ? `${roomsNeeded}x ${room.type}` : room.type;

            calcResults.push({
              id: resort.id, name: resort.name, sub: subTitle, image: resort.image,
              price: smart, retail: rack, savings: Math.round(((rack-smart)/rack)*100),
              tag: "SMART MOUSE EXCLUSIVE", nights, priority: isPriority,
              desc: `${nights} Nights • ${roomsNeeded > 1 ? 'Multi-Room' : 'Single Unit'}`
            });
          });
        });
      } 
      else if (vibe === 'global') {
        const inventory = globalInventory[subRegion] || globalInventory.florida;
        inventory.forEach(hotel => {
          const isPriority = reqLower.includes(hotel.name.toLowerCase().split(' ')[0].toLowerCase());
          const roomsNeeded = Math.ceil(guests / hotel.capacity);
          const price = Math.round(hotel.baseRate * cashMultiplier * nights * roomsNeeded * 1.125); 
          const subTitle = roomsNeeded > 1 ? `${roomsNeeded}x ${hotel.type} Rooms` : `${hotel.type} Room`;

          calcResults.push({
            id: hotel.id, name: hotel.name, sub: subTitle, image: hotel.image,
            price: price, retail: 0, savings: 0,
            tag: "DIRECT RATE", nights, priority: isPriority,
            desc: `${nights} Nights • ${roomsNeeded > 1 ? 'Multi-Room' : 'Single Unit'}`
          });
        });
      }
      else if (vibe === 'cruise') {
        const inventory = cruiseInventory[subRegion] || cruiseInventory.caribbean;
        inventory.forEach(ship => {
          const month = start.getMonth() + 1;
          if (ship.validMonths.includes(month)) {
              const cabinTypes = [
                  { name: "Interior", img: "/dcl-intern.jpg", factor: 1.0 },
                  { name: "Oceanview", img: "/dcl-ocean.jpg", factor: 1.2 },
                  { name: "Verandah", img: "/dcl-verandah.jpg", factor: 1.5 },
                  { name: "Concierge", img: "/dcl-concierge.jpg", factor: 2.5 }
              ];

              cabinTypes.forEach(cabin => {
                const price = Math.round(ship.baseRatePerNight * cabin.factor * nights * guests * cashMultiplier);
                calcResults.push({
                  id: ship.id, name: ship.name, sub: cabin.name + " Stateroom", 
                  image: cabin.img, shipImage: ship.image,
                  price: price, retail: 0, savings: 0,
                  tag: ship.route, nights: `${nights} Nights`, priority: false,
                  desc: `Total for ${guests} Guests`
                });
              });
          }
        });
      }

      calcResults.sort((a,b) => a.price - b.price);
      setResults(calcResults);
      setStep(3);
    }, 1500);
  };

  const handleBookNow = (opt) => {
    setSelectedOption(opt);
    setStep(4);
  };

  const handleCustomRequest = () => {
      setVibe('Custom Request');
      setSubRegion('Global');
      setSelectedOption({ name: 'Custom Itinerary', sub: 'Tailor Made', price: 0, desc: 'Manual Quote' });
      setStep(4);
  };

  const sendDataToScript = async (payload) => {
    try {
        await fetch(GOOGLE_SCRIPT_URL, {
            method: "POST", mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch (error) { console.error("Script Error", error); }
  };

  const handleMagnetSubmit = (e) => {
      e.preventDefault();
      const product = magnetType === 'free' ? "Basic Guide (Free)" : "Insider Secrets ($19 Offer)";
      const action = magnetType === 'free' ? "Sent via Email" : "Needs Payment Link";
      sendDataToScript({
          source: "LEAD_MAGNET_SMART_MOUSE",
          name: magnetData.name,
          email: magnetData.email,
          phone: magnetData.phone,
          requests: `Requested: ${product}. Action: ${action}. Handle: ${magnetData.handle}`
      });
      alert(magnetType === 'free' ? "Guide sent! Check your inbox." : "Request received. We will send the secure payment link to your WhatsApp/Email.");
      setShowMagnetModal(false);
  };

  const finalizeBooking = (contactMethod) => {
    if (!leadName || !leadEmail || !leadPhone) { alert("Please fill in all Contact Details."); return; }
    if (!legalCheck) { alert("Please accept the Terms to proceed."); return; }

    let planDetails = "";
    if (selectedPlan === 'diy') planDetails = conciergeAddOn ? "DIY + CONCIERGE ($150)" : "DIY (Basic) - $0";
    if (selectedPlan === 'smart') planDetails = "SMART PROTOCOL ($150)";
    if (selectedPlan === 'concierge') planDetails = "EXISTING BOOKING PLANNING ($200)";

    const insuranceNote = insuranceCheck ? "⚠️ CLIENT WANTS INSURANCE QUOTE" : "No Insurance";

    const dest = (vibe === 'cruise' && subRegion === 'exotic') ? `CRUISE - ${exoticDest}` : `${vibe?.toUpperCase()} - ${subRegion?.toUpperCase()}`;
    const dateStr = (vibe === 'cruise' && subRegion === 'exotic') ? "Flexible" : `${startDate} to ${endDate || (cruiseNights + " Nights")}`;
    const selName = selectedOption?.name || "Unknown";
    const selSub = selectedOption?.sub || "Unknown";
    const selPrice = selectedOption?.price || "TBD";

    const payload = {
        source: "SMART_MOUSE_ENGINE",
        name: leadName,
        email: leadEmail,
        phone: `${countryCode} ${leadPhone}`,
        destination: dest,
        dates: dateStr,
        requests: `PLAN: ${planDetails}\nSELECTION: ${selName} (${selSub})\nQUOTE: ${selPrice}\nNOTES: ${specialReq}\n${insuranceNote}\nCONTACT PREF: ${contactMethod}`,
        travelers: `${guestCount} Guests`
    };

    sendDataToScript(payload);
    setStep(5);
  };

  const today = new Date().toISOString().split('T')[0];

  // --- RENDERERS ---

  const renderVibeSelector = () => (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Choose Your <span className="text-[#d4af37]">Adventure</span></h1>
        <p className="text-slate-400 text-sm">Select an experience to calibrate the pricing engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* DVC */}
        <div onClick={() => handleVibeSelect('dvc')} className="relative h-[28rem] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-[#d4af37] group transition-all z-10 bg-black">
            <img src="/sm-vibe-dvc.jpg" alt="DVC" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"/>
            <div className="absolute top-4 right-4 bg-[#d4af37] text-[#0f172a] text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg z-10">
                <BrandName dark={true}/> <span className="font-sans">Exclusive</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-8 z-10">
                <div className="text-[#d4af37] mb-2"><Lock size={24}/></div>
                <h3 className="text-white leading-none mb-2">
                    <span className="font-walt text-3xl block mb-1">Disney</span>
                    <span className="font-sans font-light text-xl tracking-[0.2em] text-slate-200">VACATION CLUB</span>
                </h3>
                <p className="text-[10px] text-[#d4af37] font-bold uppercase tracking-widest mt-2 border-t border-slate-700 pt-2">
                    Open to Everyone • No Membership Needed
                </p>
                <p className="text-xs text-slate-400 mt-1">Luxury Villas at Moderate Prices</p>
            </div>
        </div>

        {/* GLOBAL */}
        <div onClick={() => handleVibeSelect('global')} className="relative h-[28rem] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-blue-500 group transition-all z-10 bg-black">
            <img src="/sm-vibe-parks.jpg" alt="Global" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"/>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-8 z-10">
                <div className="text-blue-400 mb-2"><Castle size={24}/></div>
                <h3 className="font-serif text-2xl text-white tracking-widest uppercase mb-3">WORLDS OF MAGIC</h3>
                <div className="text-slate-300 leading-none flex items-baseline gap-2 whitespace-nowrap overflow-hidden">
                    <span className="font-walt text-lg">Walt Disney<span className="font-sans text-[8px] uppercase tracking-widest ml-0.5">World</span></span>
                    <span className="text-slate-500 px-1">•</span>
                    <span className="font-enchanted text-lg">Disneyland</span>
                    <span className="text-slate-500 px-1">•</span>
                    <span className="font-universal text-[8px] tracking-widest text-slate-400">UNIVERSAL</span>
                </div>
            </div>
        </div>

        {/* CRUISE */}
        <div onClick={() => handleVibeSelect('cruise')} className="relative h-[28rem] rounded-2xl overflow-hidden cursor-pointer border border-slate-800 hover:border-red-500 group transition-all z-10 bg-black">
            <img src="/sm-vibe-cruise.jpg" alt="Cruise" className="w-full h-full object-cover opacity-60 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"/>
            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent p-8 z-10">
                <div className="text-red-400 mb-2"><Ship size={24}/></div>
                <h3 className="text-white leading-none mb-2">
                    <span className="font-walt text-4xl block mb-1">Disney</span>
                    <span className="font-sans font-light text-xl tracking-[0.2em] text-slate-200">CRUISE LINE</span>
                </h3>
                <p className="text-xs text-slate-300 mt-2">High Seas & Private Islands</p>
            </div>
        </div>
      </div>

      <div className="text-center mt-12">
          <button onClick={() => window.open('https://wa.me/525655857811', '_blank')} className="text-slate-400 hover:text-[#d4af37] text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
              <Phone size={14}/> Not sure? Chat with an Expert now via WhatsApp
          </button>
      </div>
    </div>
  );

  const renderSubRegionSelector = () => (
    <div className="max-w-5xl mx-auto px-6 py-20 text-center animate-in fade-in zoom-in duration-500">
        <button onClick={() => setStep(0)} className="text-slate-500 hover:text-white text-xs flex items-center gap-1 mx-auto mb-10"><ArrowRight className="rotate-180" size={12}/> RETURN TO VIBES</button>
        <h2 className="text-3xl md:text-5xl font-serif text-white mb-12">Where is the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Magic</span> happening?</h2>

        <div className="flex flex-wrap justify-center gap-4">
            {vibe === 'global' ? 
                ['Florida', 'California', 'Europe', 'Asia'].map(r => (
                    <button key={r} onClick={() => handleSubRegionSelect(r.toLowerCase())} className="p-8 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-[#d4af37] transition text-white font-bold text-lg font-serif w-full md:w-auto min-w-[200px]">
                        {r}
                    </button>
                )) : 
                ['Caribbean', 'Europe', 'Alaska', 'Hawaii', 'Exotic / Global'].map(r => (
                    <button key={r} onClick={() => r === 'Exotic / Global' ? handleSubRegionSelect('exotic') : handleSubRegionSelect(r.toLowerCase())} className={`p-8 border border-slate-700 rounded-xl hover:bg-slate-800 hover:border-[#d4af37] transition text-white font-bold font-serif w-full md:w-auto min-w-[200px] ${r === 'Exotic / Global' ? 'text-sm md:text-base bg-slate-900 border-[#d4af37]/30 text-[#d4af37]' : 'text-lg'}`}>
                        {r}
                    </button>
                ))
            }
        </div>
    </div>
  );

  const renderInputs = () => (
    <div className="max-w-4xl mx-auto px-6 py-20 animate-in slide-in-from-right duration-500">
      <button onClick={() => setStep(vibe === 'dvc' ? 0 : 0.5)} className="text-slate-500 hover:text-white text-xs flex items-center gap-1 mb-8"><ArrowRight className="rotate-180" size={12}/> BACK</button>

      <div className="bg-[#1e293b] p-8 md:p-12 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-[#d4af37] opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="mb-8">
            <h2 className="text-3xl font-serif text-white flex items-center gap-3">
            {vibe === 'dvc' && <><Lock className="text-[#d4af37]"/> DVC Arbitrage Engine</>}
            {vibe === 'global' && <><Castle className="text-blue-400"/> Global Parks Config</>}
            {vibe === 'cruise' && <><Ship className="text-red-400"/> Cruise Line Config</>}
            </h2>
            <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest pl-1">
                {subRegion === 'exotic' 
                    ? "Tell us about your dream destination. Manual verification required."
                    : (vibe === 'dvc' ? "Configure parameters to unlock wholesale pricing." 
                    : "Select dates to access our verified inventory.")}
            </p>
        </div>

        {/* CROSS-SELLING NUDGE */}
        {vibe === 'global' && subRegion === 'florida' && guestCount >= 5 && (
            <div onClick={switchToDVC} className="mb-6 bg-[#d4af37]/10 border border-[#d4af37]/30 p-4 rounded-lg flex items-center gap-3 animate-in fade-in cursor-pointer hover:bg-[#d4af37]/20 transition group">
                <Info size={18} className="text-[#d4af37] shrink-0"/>
                <div className="flex-1">
                    <p className="text-xs font-bold text-[#d4af37] mb-1">Pro Tip for Large Groups</p>
                    <p className="text-[10px] text-slate-300">For groups of 5+, DVC Villas (1BR/2BR) offer better value and space.</p>
                </div>
                <div className="text-[10px] font-bold text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Click to Switch <ExternalLink size={10}/>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">Travel Party</label>
            <div className="relative cursor-pointer">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18}/>
              <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-12 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none cursor-pointer appearance-none h-14">
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Guests</option>)}
              </select>
            </div>
          </div>

          {/* LOGICA EXOTICA vs NORMAL */}
          {subRegion === 'exotic' ? (
              <div className="group">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">Select Interest</label>
                  <div className="relative cursor-pointer w-full">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18}/>
                      <select value={exoticDest} onChange={(e) => setExoticDest(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-12 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none cursor-pointer appearance-none h-14">
                          <option value="">Select Destination...</option>
                          {EXOTIC_DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                  </div>
              </div>
          ) : (
            <>
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">{vibe === 'cruise' ? 'Sail Date (Approx)' : 'Check-In'}</label>
                    <div className="relative cursor-pointer w-full" onClick={() => startPickerRef.current.showPicker()}>
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18}/>
                    <input 
                        ref={startPickerRef}
                        type="date" 
                        min={today}
                        value={startDate} 
                        onChange={handleStartDateChange} 
                        className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-12 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 h-14" 
                        style={{colorScheme:"dark"}}
                    />
                    </div>
                </div>

                {vibe !== 'cruise' ? (
                    <div className="group">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">Check-Out</label>
                    <div className="relative cursor-pointer w-full" onClick={() => endPickerRef.current.showPicker()}>
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18}/>
                        <input 
                            ref={endPickerRef}
                            type="date" 
                            min={startDate ? getNextDay(startDate) : today} 
                            value={endDate} 
                            onChange={(e) => setEndDate(e.target.value)} 
                            className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-12 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none cursor-pointer appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 h-14" 
                            style={{colorScheme:"dark"}}
                        />
                    </div>
                    </div>
                ) : (
                    <div className="group">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">Itinerary Length</label>
                        <div className="relative cursor-pointer w-full">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" size={18}/>
                            <select value={cruiseNights} onChange={(e) => setCruiseNights(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-12 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none cursor-pointer appearance-none h-14">
                                {(CRUISE_DURATIONS[subRegion] || CRUISE_DURATIONS['caribbean']).map(opt => (
                                    <option key={opt.val} value={opt.val}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </>
          )}

          <div className={`${vibe === 'cruise' || subRegion === 'exotic' ? 'md:col-span-1' : 'md:col-span-1'}`}>
             <label className="text-[10px] font-bold text-slate-500 uppercase block mb-3 tracking-wider">Special Requests</label>
             <input type="text" placeholder={vibe === 'cruise' ? "e.g. Celebration, First Time..." : "e.g. Animal Kingdom Lodge, Near Epcot..."} value={specialReq} onChange={(e) => setSpecialReq(e.target.value)} className="w-full bg-[#0f172a] border border-slate-600 rounded-xl py-3.5 px-4 text-white text-base sm:text-sm focus:border-[#d4af37] outline-none h-14"/>
          </div>
        </div>

        <button onClick={handleSearch} className="w-full bg-gradient-to-r from-[#d4af37] to-yellow-700 text-[#0f172a] font-bold py-5 rounded-xl text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition transform hover:-translate-y-1 flex items-center justify-center gap-3">
          {subRegion === 'exotic' ? <><FileText size={20}/> REQUEST PORTFOLIO</> : <><Sparkles size={20}/> ACTIVATE ENGINE</>}
        </button>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white mb-2 flex items-center gap-1"><ArrowRight className="rotate-180" size={12}/> EDIT PARAMETERS</button>
          <h2 className="text-3xl font-serif text-white">Smart Opportunities</h2>
        </div>

        <div className="flex gap-2">
            {vibe === 'cruise' && (
                <div className="px-4 py-2 border border-[#d4af37]/30 bg-[#d4af37]/10 rounded-full text-[#d4af37] text-[10px] font-bold flex items-center gap-2">
                    <Anchor size={12}/> Ask about Land & Sea
                </div>
            )}
            <button onClick={handleCustomRequest} className="bg-white/10 border border-white/20 text-white text-xs px-4 py-2 rounded-full hover:bg-white hover:text-black transition">
                Can't find your dream? Request Custom Quote
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {results.map((r, idx) => (
          <div key={idx} className={`bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row group ${r.priority ? 'ring-4 ring-[#d4af37]' : ''}`}>
            <div className="md:w-1/3 relative h-56 md:h-auto overflow-hidden">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute top-3 left-3 bg-[#0f172a] text-[#d4af37] text-[10px] font-bold px-3 py-1 uppercase tracking-wider shadow-lg">{r.tag}</div>
              {r.priority && <div className="absolute bottom-3 left-3 bg-green-600 text-white text-[9px] font-bold px-2 py-1 rounded">MATCHES REQUEST</div>}
            </div>
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">

              <div className="flex items-start gap-3">
                 {vibe === 'cruise' && (
                     <div className="w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0">
                         <img src={r.shipImage} className="w-full h-full object-cover" alt="Ship"/>
                     </div>
                 )}
                 <div>
                    <h3 className="text-2xl font-serif text-[#0f172a] font-bold mb-1">{r.name}</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{r.sub}</p>
                 </div>
              </div>

              <div className="flex gap-4 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
                   <span className="flex items-center gap-1"><Users size={14}/> {guestCount} Guests</span>
                   <span className="flex items-center gap-1"><Calendar size={14}/> {r.desc}</span>
                   <span className="flex items-center gap-1"><MapPin size={14}/> {subRegion?.toUpperCase()}</span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  {r.savings > 0 && <p className="text-xs text-red-400 line-through font-bold">Rack Rate: ${r.retail.toLocaleString()}</p>}
                  <div className="flex items-baseline gap-1">
                      <span className="text-sm text-slate-400">{vibe === 'cruise' ? 'From' : 'Est. Quote'}</span>
                      <p className="text-4xl font-bold text-[#0f172a]">${r.price.toLocaleString()}</p>
                  </div>
                  <p className="text-[9px] text-slate-400">Subject to availability & dynamic pricing</p>
                </div>
                <div className="text-right">
                  {r.savings > 0 && <span className="block text-green-600 font-bold text-xs mb-2 bg-green-50 px-2 py-1 rounded">Save {r.savings}%</span>}
                  <button onClick={() => handleBookNow(r)} className="bg-[#0f172a] text-white px-8 py-4 rounded-lg text-xs font-bold hover:bg-[#d4af37] hover:text-black transition shadow-xl hover:shadow-2xl">
                    SELECT PROPERTY
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-8 duration-700">

      {/* LEFT: PLANS (7 Cols) */}
      <div className="lg:col-span-7 space-y-8">
        <div>
           <button onClick={() => setStep(3)} className="text-xs text-slate-500 hover:text-white mb-4 flex items-center gap-1"><ArrowRight className="rotate-180" size={12}/> CHANGE PROPERTY</button>
           <h2 className="text-3xl font-serif text-white mb-2">Service Level Selection</h2>
           <p className="text-slate-400 text-sm">How should we orchestrate your magic? Choose your planning tier.</p>
           <p className="text-[10px] text-[#d4af37] font-bold mt-1">No payment required now. You pay only after itinerary approval.</p>
        </div>

        <div className="space-y-4">
           {/* DIY */}
           <div onClick={() => { setSelectedPlan('diy'); setConciergeAddOn(false); }} className={`p-6 rounded-2xl border-2 cursor-pointer transition flex items-center gap-5 ${selectedPlan === 'diy' ? 'border-[#d4af37] bg-[#1e293b]' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'}`}>
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300"><FileText size={20}/></div>
              <div className="flex-1">
                 <h4 className="font-bold text-white">Basic Route (DIY)</h4>
                 <p className="text-[10px] text-slate-400">Booking Only. No planning services included.</p>
              </div>
              <span className="text-green-400 font-bold text-sm">$0 Fee</span>
           </div>

           {/* SMART MOUSE */}
           <div onClick={() => { setSelectedPlan('smart'); setConciergeAddOn(false); }} className={`p-6 rounded-2xl border-2 cursor-pointer transition flex items-center gap-5 relative overflow-hidden ${selectedPlan === 'smart' ? 'border-[#d4af37] bg-[#1e293b] shadow-[0_0_30px_rgba(212,175,55,0.1)]' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'}`}>
              <div className="absolute top-0 right-0 bg-[#d4af37] text-[#0f172a] text-[9px] font-bold px-3 py-1">MOST POPULAR</div>
              <div className="w-12 h-12 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0f172a]"><Sparkles size={24}/></div>
              <div className="flex-1">
                 <h4 className="font-bold text-white">Smart Mouse Protocol</h4>
                 <p className="text-[10px] text-slate-300">Full Planning (Dining, Genie+, Strategy) for bookings made with us.</p>
              </div>
              <div className="text-right">
                 <span className="text-[#d4af37] font-bold text-lg block">$150</span>
              </div>
           </div>

           {/* CONCIERGE */}
           <div onClick={() => { setSelectedPlan('concierge'); setConciergeAddOn(false); }} className={`p-6 rounded-2xl border-2 cursor-pointer transition flex items-center gap-5 ${selectedPlan === 'concierge' ? 'border-[#d4af37] bg-[#1e293b]' : 'border-slate-800 bg-slate-900/50 hover:bg-slate-800'}`}>
              <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-300"><Calendar size={20}/></div>
              <div className="flex-1">
                 <h4 className="font-bold text-white">Planning for Existing Bookings</h4>
                 <p className="text-[10px] text-slate-400">"I already have a booking confirmation, but I need professional planning."</p>
              </div>
              <span className="text-white font-bold text-sm">$200</span>
           </div>
        </div>

        {/* RESOURCES */}
        <div className="pt-8 border-t border-slate-800">
           <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Self-Service Resources</h4>
           <div className="grid grid-cols-2 gap-4">
              <div onClick={() => { setMagnetType('free'); setShowMagnetModal(true); }} className="bg-slate-900 border border-slate-800 p-4 rounded-xl text-center cursor-pointer hover:border-slate-500 transition group">
                 <BookOpen className="mx-auto text-slate-400 mb-2 group-hover:text-white" size={20}/>
                 <p className="text-xs font-bold text-white">Basic Guide</p>
                 <span className="text-[10px] text-green-500 font-bold">FREE DOWNLOAD</span>
              </div>
              <div onClick={() => { setMagnetType('paid'); setShowMagnetModal(true); }} className="bg-slate-900 border border-[#d4af37]/30 p-4 rounded-xl text-center cursor-pointer hover:bg-slate-800 transition relative overflow-hidden group">
                 <div className="absolute top-0 right-0 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5">OFFER</div>
                 <Sparkles className="mx-auto text-[#d4af37] mb-2 group-hover:animate-spin" size={20}/>
                 <p className="text-xs font-bold text-white">Insider Secrets</p>
                 <div className="flex justify-center gap-2 items-center mt-1">
                    <span className="text-[9px] text-slate-500 line-through">$49</span>
                    <span className="text-[10px] text-[#d4af37] font-bold">$19</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* RIGHT: FINALIZE (5 Cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-8 text-[#0f172a] h-fit shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-2 bg-[#d4af37]"></div>

         <h3 className="font-serif font-bold text-xl mb-6 text-center">Confirm Request</h3>

         <div className="bg-slate-50 p-4 rounded-xl mb-6 text-xs border border-slate-200 space-y-2">
            <div className="flex justify-between font-bold">
                <span>Property:</span>
                <span>{selectedOption.name}</span>
            </div>
            <div className="flex justify-between text-slate-500">
                <span>Unit:</span>
                <span>{selectedOption.sub}</span>
            </div>
            <div className="flex justify-between text-slate-500">
                <span>Travelers:</span>
                <span>{guestCount} Guests</span>
            </div>
            <div className="flex justify-between text-slate-500 border-b border-slate-200 pb-2">
                <span>Dates:</span>
                <span>{subRegion === 'exotic' ? "Flexible / TBD" : (vibe === 'cruise' ? `${startDate} (${cruiseNights} Nights)` : `${startDate} / ${endDate}`)}</span>
            </div>
            <div className="flex justify-between font-bold pt-1 text-lg">
                <span>Est. Quote:</span>
                <span>{selectedOption.price === 'TBD' ? 'Manual Quote' : `$${selectedOption.price.toLocaleString()}`}</span>
            </div>
         </div>

         {/* LEGAL DISCLAIMER */}
         <div className="mb-6 flex gap-2 items-start bg-yellow-50 p-3 rounded text-[9px] text-yellow-800 border border-yellow-100">
             <AlertCircle size={14} className="shrink-0 mt-0.5"/>
             <p>Quotes are illustrative based on live market data. Final availability and pricing are subject to venue confirmation upon booking.</p>
         </div>

         {/* UPSELL DIY */}
         {selectedPlan === 'diy' && (
            <div onClick={() => setConciergeAddOn(!conciergeAddOn)} className={`mb-6 border p-4 rounded-xl cursor-pointer flex items-center justify-between transition ${conciergeAddOn ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-white border-slate-300 text-slate-500 hover:border-[#0f172a]'}`}>
               <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 border rounded flex items-center justify-center ${conciergeAddOn ? 'bg-[#d4af37] border-none text-black' : 'bg-white'}`}>
                     {conciergeAddOn && <Check size={12} strokeWidth={4}/>}
                  </div>
                  <div>
                     <p className={`text-xs font-bold ${conciergeAddOn ? 'text-white' : 'text-slate-800'}`}>Add Full Concierge</p>
                     <p className="text-[9px]">Changed your mind? Add Strategy.</p>
                  </div>
               </div>
               <div className="text-right">
                  <span className={`block text-xs font-bold ${conciergeAddOn ? 'text-[#d4af37]' : 'text-black'}`}>$150</span>
                  <span className="text-[9px] line-through decoration-red-500">$200</span>
               </div>
            </div>
         )}

         {/* FORM DE CONTACTO */}
         <div className="space-y-4">
            <div>
               <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Full Name *</label>
               <input required type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Full Legal Name" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#0f172a] transition max-w-full"/>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Email *</label>
                   <input required type="email" value={leadEmail} onChange={(e) => setLeadEmail(e.target.value)} placeholder="email@domain.com" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#0f172a] transition max-w-full"/>
                </div>
                <div>
                   <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Phone *</label>
                   <div className="flex gap-2">
                      <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#0f172a] w-20 text-center appearance-none cursor-pointer">
                         <option value="+52">🇲🇽</option>
                         <option value="+1">🇺🇸</option>
                         <option value="+34">🇪🇸</option>
                         <option value="+44">🇬🇧</option>
                         <option value="+33">🇫🇷</option>
                      </select>
                      <input required type="tel" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} placeholder="10 digits" className="flex-1 bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm outline-none focus:border-[#0f172a] transition max-w-full"/>
                   </div>
                </div>
            </div>

            <div className="flex items-start gap-2 py-2">
                <input type="checkbox" checked={insuranceCheck} onChange={(e) => setInsuranceCheck(e.target.checked)} className="mt-1 accent-[#d4af37]"/>
                <div>
                    <p className="text-xs font-bold text-slate-700">I am interested in Travel Protection</p>
                    <p className="text-[9px] text-slate-400">Highly Recommended. We will quote this for you.</p>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-4 border-t border-slate-100 pt-4">
               <input type="checkbox" checked={legalCheck} onChange={(e) => setLegalCheck(e.target.checked)} className="accent-[#d4af37] cursor-pointer"/>
               <label onClick={() => setLegalCheck(!legalCheck)} className="text-[10px] text-slate-500 cursor-pointer hover:text-black">I accept the Terms & Conditions.</label>
            </div>

            <button onClick={() => finalizeBooking('Web Form')} className="w-full bg-[#0f172a] text-white py-4 rounded-xl text-sm font-bold hover:bg-[#d4af37] hover:text-[#0f172a] transition shadow-lg flex items-center justify-center gap-2">
                CONFIRM REQUEST <ArrowRight size={16}/>
            </button>
         </div>
      </div>
    </div>
  );

  const renderMagnetModal = () => (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setShowMagnetModal(false)}></div>
          <div className="relative bg-[#1e293b] border border-[#d4af37] p-8 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-300">
              <button onClick={() => setShowMagnetModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
              <div className="text-center mb-6">
                  <div className="bg-[#d4af37] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0f172a]"><Download size={24}/></div>
                  <h3 className="text-2xl font-serif text-white">
                      {magnetType === 'free' ? "Unlock the Guide" : "Get Insider Secrets"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2">
                      {magnetType === 'free' 
                        ? "Enter your details to receive the PDF directly." 
                        : "We will send a secure payment link to your preferred contact."}
                  </p>
              </div>
              <form onSubmit={handleMagnetSubmit} className="space-y-4">
                  <input required type="text" placeholder="First Name" value={magnetData.name} onChange={e => setMagnetData({...magnetData, name: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded p-3 text-white text-sm focus:border-[#d4af37] outline-none"/>
                  <input required type="email" placeholder="Email Address" value={magnetData.email} onChange={e => setMagnetData({...magnetData, email: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded p-3 text-white text-sm focus:border-[#d4af37] outline-none"/>
                  <input required type="tel" placeholder="Phone Number" value={magnetData.phone} onChange={e => setMagnetData({...magnetData, phone: e.target.value})} className="w-full bg-[#0f172a] border border-slate-700 rounded p-3 text-white text-sm focus:border-[#d4af37] outline-none"/>
                  <button type="submit" className="w-full bg-[#d4af37] text-black font-bold py-3 rounded hover:bg-white transition">
                      {magnetType === 'free' ? "SEND IT TO ME" : "REQUEST PAYMENT LINK"}
                  </button>
              </form>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-[#d4af37] selection:text-[#0f172a]">
      {showMagnetModal && renderMagnetModal()}

      {/* HEADER */}
      <nav className="border-b border-slate-800 bg-[#0f172a]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setStep(0)}>
            <div className="group-hover:scale-105 transition-transform"><BrandName /></div>
          </div>
          <button onClick={() => navigate('/')} className="text-[10px] font-bold text-slate-500 hover:text-white transition tracking-widest border border-slate-800 px-4 py-2 rounded hover:border-slate-500">
            EXIT ENGINE
          </button>
        </div>
      </nav>

      {/* STEPS */}
      {step === 0 && renderVibeSelector()}
      {step === 0.5 && renderSubRegionSelector()}
      {step === 1 && renderInputs()}
      {step === 2 && (
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
           <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mb-6"></div>
           <h3 className="text-2xl font-serif text-white animate-pulse">Calculating Magic...</h3>
           <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest">Accessing 2026 Inventory</p>
        </div>
      )}
      {step === 3 && renderResults()}
      {step === 4 && renderCheckout()}

      {/* SUCCESS SCREEN */}
      {step === 5 && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center animate-in zoom-in duration-500">
           <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white mb-8 shadow-[0_0_50px_rgba(34,197,94,0.5)]">
              <Check size={48} className="animate-bounce"/>
           </div>
           <h2 className="text-4xl md:text-5xl font-serif text-white mb-4">Request Received</h2>
           <p className="text-slate-400 max-w-md mx-auto leading-relaxed mb-10 text-sm">
              We have received your configuration securely. A certified consultant will review your request and contact you via Email/WhatsApp shortly.
           </p>

           <div className="flex flex-col gap-4 w-full max-w-sm">
               <button onClick={() => window.open('https://wa.me/525655857811', '_blank')} className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg">
                   <Phone size={18}/> Chat on WhatsApp (Optional)
               </button>
               <button onClick={() => setStep(0)} className="text-xs text-slate-500 hover:text-white mt-4 transition">Start New Search</button>
           </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 px-4 mt-auto bg-[#020617]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-600">
            <p>Smart Mouse is an independent engine powered by <VallinBrand/>.</p>
            <p>Not affiliated with The Walt Disney Company. All rights reserved 2026.</p>
         </div>
      </footer>

    </div>
  );
};

export default SmartMouseEngine;