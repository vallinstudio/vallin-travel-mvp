import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, ShieldCheck, Star, Phone, Mail, CheckCircle, Loader2, Calendar, AlertCircle, MessageCircle } from 'lucide-react';
import './App.css';

const VallinTravelMVP = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // --- LÓGICA DE VIDEO ---
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRefs = useRef([]);
  const videos = [{ src: '/video-hero.mp4', start: 0, end: 100 }];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- MODAL DE CONTACTO ---
  const ContactModal = () => {
    const [formStatus, setFormStatus] = useState("idle"); 
    const [errors, setErrors] = useState({});

    // Estado del Formulario
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      countryCode: '+52', // Default México
      phone: '',
      startDate: '',
      endDate: '',
      destination: '',
      travelers: '',
      budget: '',
      requests: ''
    });

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (errors[e.target.name]) {
        setErrors({ ...errors, [e.target.name]: null });
      }
    };

    // --- VALIDACIÓN ---
    const validateForm = () => {
      const newErrors = {};
      const { name, email, phone, startDate, endDate, destination, travelers, budget } = formData;

      if (name.trim().length < 3) newErrors.name = "Name is too short.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format.";
      if (phone.replace(/[^0-9]/g, '').length < 10) newErrors.phone = "Phone must be at least 10 digits.";

      if (!startDate) newErrors.startDate = "Required.";
      if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
        newErrors.endDate = "Invalid date range.";
      }

      if (!destination) newErrors.destination = "Required.";
      if (!travelers) newErrors.travelers = "Required.";
      if (!budget) newErrors.budget = "Required.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!validateForm()) return; 

      setFormStatus("submitting");

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        dates: `${formData.startDate} to ${formData.endDate || 'Flexible'}`,
        destination: formData.destination,
        travelers: formData.travelers,
        budget: formData.budget,
        requests: formData.requests
      };

      // ---------------------------------------------------------
      // URL V17 FINAL (INTEGRADA)
      // ---------------------------------------------------------
      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfTry8sbHFzBBPdY-rh2rAwC2t2iDS7I6C501_O0O2ECnVKENy8wwZjNqmUOTBryKb/exec"; 

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors", 
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        setFormStatus("success");

      } catch (error) {
        console.error("Error:", error);
        alert("Connection error. Please try again.");
        setFormStatus("error");
      }
    };

    const getWhatsAppLink = () => {
      const text = `Hola Jorge, acabo de solicitar información en vallin.travel para *${formData.destination}*. Mi nombre es *${formData.name}*.`;
      return `https://wa.me/525655857811?text=${encodeURIComponent(text)}`;
    };

    if (!isContactOpen) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsContactOpen(false)}></div>

        <div className="relative bg-zinc-900 border border-white/10 w-full max-w-lg p-8 md:p-10 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
          <button 
            onClick={() => setIsContactOpen(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-50"
          >
            <X size={20} />
          </button>

          {/* --- PANTALLA DE ÉXITO --- */}
          {formStatus === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>

              <h3 className="text-3xl font-serif text-white mb-2">Request Received</h3>
              <p className="text-gray-400 font-light mb-8 max-w-xs mx-auto">
                We have secured your request. Check your email for confirmation.
              </p>

              <div className="w-full border-t border-white/10 pt-8 mt-2">
                <p className="text-[10px] uppercase tracking-widest text-orange-400 mb-4">Want priority service?</p>

                <a 
                  href={getWhatsAppLink()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 w-full flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-widest text-xs shadow-lg rounded-none"
                >
                  <MessageCircle size={18} />
                  Confirm via WhatsApp
                </a>
              </div>
            </div>
          ) : (
            // --- FORMULARIO ---
            <>
              <div className="mb-8 border-l-2 border-orange-500 pl-4">
                <h3 className="text-3xl font-serif text-white mb-1">Design Your Trip</h3>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest">Powered by Smart Mouse Tech</p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* NOMBRE Y EMAIL */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Name *</label>
                      <input 
                        name="name" type="text" 
                        value={formData.name} onChange={handleChange}
                        className={`w-full bg-black/40 border p-3 text-sm text-white focus:border-orange-500 transition outline-none ${errors.name ? 'border-red-500' : 'border-white/10'}`} 
                        placeholder="Full Name" 
                      />
                      {errors.name && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.name}</span>}
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Email *</label>
                      <input 
                        name="email" type="email" 
                        value={formData.email} onChange={handleChange}
                        className={`w-full bg-black/40 border p-3 text-sm text-white focus:border-orange-500 transition outline-none ${errors.email ? 'border-red-500' : 'border-white/10'}`} 
                        placeholder="email@domain.com" 
                      />
                      {errors.email && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email}</span>}
                    </div>
                </div>

                {/* TELÉFONO */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Phone Number *</label>
                  <div className="flex gap-2">
                    <select 
                        name="countryCode" 
                        value={formData.countryCode} 
                        onChange={handleChange}
                        className="bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-orange-500 outline-none w-24 appearance-none text-center"
                    >
                        <option value="+52">🇲🇽 +52</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+34">🇪🇸 +34</option>
                        <option value="+54">🇦🇷 +54</option>
                        <option value="">Other</option>
                    </select>
                    <input 
                      name="phone" type="tel" 
                      value={formData.phone} onChange={handleChange}
                      className={`flex-1 bg-black/40 border p-3 text-sm text-white focus:border-orange-500 transition outline-none ${errors.phone ? 'border-red-500' : 'border-white/10'}`} 
                      placeholder="10 digits" 
                    />
                  </div>
                  {errors.phone && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</span>}
                </div>

                {/* FECHAS */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Check-in *</label>
                      <input 
                        name="startDate" type="date" 
                        value={formData.startDate} onChange={handleChange}
                        className={`w-full bg-black/40 border p-3 text-sm text-white focus:border-orange-500 transition outline-none ${errors.startDate ? 'border-red-500' : 'border-white/10'}`} 
                        style={{colorScheme: 'dark'}}
                      />
                      {errors.startDate && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.startDate}</span>}
                    </div>
                    <div>
                      <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Check-out</label>
                      <input 
                        name="endDate" type="date" 
                        min={formData.startDate} 
                        value={formData.endDate} onChange={handleChange}
                        className={`w-full bg-black/40 border p-3 text-sm text-white focus:border-orange-500 transition outline-none ${errors.endDate ? 'border-red-500' : 'border-white/10'}`} 
                        style={{colorScheme: 'dark'}}
                      />
                      {errors.endDate && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.endDate}</span>}
                    </div>
                </div>

                {/* DESTINO */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Where to? *</label>
                  <select 
                    name="destination" 
                    value={formData.destination} onChange={handleChange}
                    className={`w-full bg-black/40 border p-3 text-sm focus:border-orange-500 transition outline-none appearance-none ${formData.destination === "" ? "text-gray-500" : "text-white"} ${errors.destination ? 'border-red-500' : 'border-white/10'}`}
                  >
                    <option value="" disabled>Select a Collection...</option>
                    <option value="Disney World">Walt Disney World (Orlando)</option>
                    <option value="Disneyland">Disneyland (California)</option>
                    <option value="Disney Cruise">Disney Cruise Line</option>
                    <option value="Universal">Universal Studios</option>
                    <option value="Europe">European Expedition</option>
                    <option value="Other">Other Custom Request</option>
                  </select>
                  {errors.destination && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.destination}</span>}
                </div>

                {/* VIAJEROS Y PRESUPUESTO */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Travelers *</label>
                       <select 
                         name="travelers" 
                         value={formData.travelers} onChange={handleChange}
                         className={`w-full bg-black/40 border p-3 text-sm focus:border-orange-500 transition outline-none ${formData.travelers === "" ? "text-gray-500" : "text-white"} ${errors.travelers ? 'border-red-500' : 'border-white/10'}`}
                       >
                         <option value="" disabled>Select...</option>
                         <option>1-2 People</option>
                         <option>Family (3-5)</option>
                         <option>Large Group (6+)</option>
                       </select>
                       {errors.travelers && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.travelers}</span>}
                    </div>
                    <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Budget (USD) *</label>
                       <select 
                         name="budget" 
                         value={formData.budget} onChange={handleChange}
                         className={`w-full bg-black/40 border p-3 text-sm focus:border-orange-500 transition outline-none ${formData.budget === "" ? "text-gray-500" : "text-white"} ${errors.budget ? 'border-red-500' : 'border-white/10'}`}
                       >
                         <option value="" disabled>Range...</option>
                         <option>$3,000 - $5,000</option>
                         <option>$5,000 - $10,000</option>
                         <option>$10,000 - $20,000</option>
                         <option>$20,000+</option>
                       </select>
                       {errors.budget && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.budget}</span>}
                    </div>
                </div>

                {/* MENSAJE */}
                <div>
                  <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">Special Requests</label>
                  <textarea 
                    name="requests" rows="3" 
                    value={formData.requests} onChange={handleChange}
                    className="w-full bg-black/40 border border-white/10 p-3 text-sm text-white focus:border-orange-500 transition outline-none" 
                    placeholder="Specific hotel, celebrations, accessibility..."
                  ></textarea>
                </div>

                {/* BOTÓN */}
                <button 
                  type="submit" 
                  disabled={formStatus === "submitting"}
                  className="bg-white text-black py-4 mt-2 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 hover:text-white transition shadow-lg flex justify-center items-center gap-2 w-full cursor-pointer"
                >
                  {formStatus === "submitting" ? (
                    <>Processing <Loader2 className="animate-spin" size={14}/></>
                  ) : (
                    <>Inquire Availability <ArrowRight size={14} /></>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  };

  const collections = [
    { id: 1, title: "Legacy & Magic", subtitle: "Disney & Universal", image: "/castillo.jpg", pos: "center center" },
    { id: 2, title: "Honeymoon", subtitle: "Curated Romance", image: "/honey.jpeg", pos: "80% center" },
    { id: 3, title: "Expedition", subtitle: "For the Intrepid", image: "/expedition.jpg", pos: "center center" },
    { id: 4, title: "Wellness", subtitle: "Sanctuaries", image: "/wellness.jpeg", pos: "center 45%" }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">

      <ContactModal />

      <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 border-b border-white/10 ${scrolled ? 'bg-black/95 py-4 shadow-xl' : 'bg-transparent py-6 md:py-8 border-transparent'}`}>
        <div className="px-6 md:px-12 flex items-center justify-between">

          <div className="flex flex-col cursor-pointer leading-none group flex-1">
            <div className="h-3.5 flex items-center mb-1">
              <img src="/logo.svg" alt="Vallin Travel" className="h-full w-auto object-contain filter brightness-0 invert" />
            </div>
            <span className={`text-[9px] uppercase tracking-[0.4em] mt-2 hidden md:block pl-1 transition-colors duration-300 ${scrolled ? 'text-gray-400' : 'text-gray-200'}`}>
              The Art of Smart Luxury
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-12 text-xs font-bold uppercase tracking-[0.2em] flex-1">
            <a href="#collections" className="hover:text-orange-500 transition">Collections</a>
            <a href="#vault" className="hover:text-orange-500 transition">The Vault</a>
          </div>

          <div className="hidden md:flex items-center justify-end gap-8 flex-1">
            <a href="tel:+525655857811" className={`flex items-center gap-2 text-[10px] font-bold tracking-widest hover:text-orange-500 transition ${scrolled ? 'text-gray-400' : 'text-white/80'}`}>
               <Phone size={12} /> +52 56 5585 7811
            </a>
            <button 
              onClick={() => setIsContactOpen(true)}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition shadow-lg ${scrolled ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white hover:text-black border border-white/20'}`}
            >
              Inquire
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-32 px-6 md:hidden">
          <div className="flex flex-col gap-8 text-xl font-serif italic text-center">
            <a href="#collections" onClick={() => setIsMenuOpen(false)}>Collections</a>
            <a href="#vault" onClick={() => setIsMenuOpen(false)}>The Vault</a>
            <button onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }} className="text-orange-500">Inquire Now</button>
            <a href="tel:+525655857811" className="text-sm font-sans tracking-widest text-gray-400">+52 56 5585 7811</a>
          </div>
        </div>
      )}

      <div className="hero-wrapper relative h-screen flex flex-col justify-center items-center">
        <video autoPlay loop muted playsInline className="hero-video opacity-100">
          <source src="/video-hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>

        <div className="relative z-20 text-center px-4 animate-fade-in mt-16">
          <p className="text-[10px] md:text-xs font-bold tracking-[0.4em] uppercase mb-4 text-orange-200 border border-orange-200/30 px-4 py-2 bg-black/30 backdrop-blur-sm inline-block">
            Private Travel Design
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif mb-4 leading-tight drop-shadow-2xl">
            We don't sell<br />destinations.
          </h1>
          <p className="text-lg md:text-xl font-serif italic text-gray-300 mb-8 font-light">
            We design feelings.
          </p>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="bg-white text-black px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-orange-600 hover:text-white transition shadow-2xl"
          >
            Start Your Journey
          </button>
        </div>
      </div>

      <section id="collections" className="bg-white text-black py-24 px-6 md:px-12">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-xs font-bold text-orange-600 uppercase tracking-[0.2em] mb-3">Curated Journeys</h2>
            <h3 className="text-5xl font-serif">Explore Collections</h3>
          </div>
          <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-orange-600">
            View All <ArrowRight className="w-4 h-4"/>
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-1">
          {collections.map((item) => (
            <div key={item.id} className="card-container group cursor-pointer bg-gray-100" onClick={() => setIsContactOpen(true)}>
              <img src={item.image} alt={item.title} className="card-img" style={{ objectPosition: item.pos }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80 transition duration-500"></div>
              <div className="absolute bottom-10 left-8 text-white z-10 transform transition duration-500 group-hover:-translate-y-2">
                <h4 className="text-3xl font-serif italic mb-2">{item.title}</h4>
                <div className="text-xs uppercase tracking-widest opacity-80 mb-4 whitespace-nowrap flex items-baseline gap-1">
                   {item.subtitle.includes("Disney") ? (
                     <> <span className="font-walt text-xl leading-none transform translate-y-0.5">Disney</span> <span>& Universal</span> </>
                   ) : item.subtitle}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest border-b border-orange-500 pb-1 text-orange-300">Explore</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="vault" className="dvc-section bg-slate-900">
        <img src="/floridian.jpg" alt="Grand Floridian Style" className="dvc-bg" />
        <div className="absolute inset-0 bg-black/20 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center h-full">
          <div className="bg-black/60 backdrop-blur-xl p-10 md:p-16 border border-white/10 shadow-2xl relative">
            <div className="flex items-center gap-4 mb-8 flex-wrap items-center">
              <div className="flex items-center gap-2">
                 <div className="p-1 border border-orange-400/50 rounded-full"><Star className="w-3 h-3 text-orange-400 fill-current"/></div>
                 <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-200">Members Only Access</span>
              </div>
              <div className="flex items-center gap-2 border-l border-white/20 pl-4 ml-2 opacity-80 hover:opacity-100 transition-opacity">
                 <span className="text-[8px] uppercase tracking-widest text-gray-300 leading-tight text-right">Powered<br/>by</span>
                 <img src="/LOGO1BCO_1.svg" alt="Smart Mouse Tech" className="h-12 w-auto" />
              </div>
            </div>
            <h2 className="text-5xl md:text-7xl font-serif mb-6 leading-none text-white">The Grand<br />Floridian</h2>
            <p className="text-2xl font-serif italic text-gray-300 mb-8 font-light border-l-2 border-orange-500 pl-4">at Moderate Pricing.</p>
            <p className="text-gray-300 text-sm mb-12 leading-relaxed font-light">
              Unlock <strong><span className="font-walt text-xl">Disney</span> Vacation Club's</strong> secret inventory. 
            </p>
            <div className="grid grid-cols-2 gap-12 mb-10 border-t border-white/10 pt-8">
              <div><p className="text-[9px] uppercase tracking-widest text-gray-500 mb-2">Standard Rate</p><p className="text-xl font-serif text-gray-400 line-through decoration-white/30">$4,500 USD</p></div>
              <div><p className="text-[9px] uppercase tracking-widest text-orange-400 mb-2">Vallin Smart Rate</p><p className="text-4xl font-serif text-white">$2,300 USD</p></div>
            </div>
            <button onClick={() => setIsContactOpen(true)} className="bg-orange-700 w-full py-5 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 transition text-white shadow-2xl border border-orange-600/50">Check Availability</button>
          </div>
        </div>
      </section>

      <footer className="bg-black text-gray-400 py-20 border-t border-gray-900 text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="h-4 flex items-center mb-6"><img src="/logo.svg" alt="Vallin Travel" className="h-full w-auto object-contain filter brightness-0 invert opacity-80" /></div>
            <p className="leading-relaxed mb-6 text-gray-500">Boutique travel design specializing in high-yield experiences.</p>
            <a href="mailto:jorge@vallin.studio" className="flex items-center gap-2 text-white hover:text-orange-500 transition mb-8"><Mail size={14} /> jorge@vallin.studio</a>
            <div className="flex flex-col gap-3">
               <div className="px-3 py-2 border border-gray-800 bg-gray-900/30 text-[9px] uppercase tracking-wider flex items-center gap-2 cursor-default w-fit"><ShieldCheck className="w-3 h-3 text-orange-600"/> <span className="font-walt relative top-0.5 text-xs">Disney</span> Certified</div>
               <div className="px-3 py-2 border border-gray-800 bg-gray-900/30 text-[9px] uppercase tracking-wider flex items-center gap-2 cursor-default w-fit"><ShieldCheck className="w-3 h-3 text-orange-600"/> CLIA Member</div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Newsletter</h4>
            <p className="mb-4 text-[10px] text-gray-500">Join the inner circle.</p>
            <div className="flex border-b border-gray-700 pb-2">
              <input type="email" placeholder="Coming Soon" disabled className="bg-transparent w-full outline-none text-gray-600 cursor-not-allowed" />
              <button disabled className="text-gray-600"><ArrowRight size={14}/></button>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Explore</h4>
            <ul className="space-y-3 text-[11px] tracking-wide">
              <li><a href="#" className="hover:text-white transition">The Vault</a></li>
              <li><a href="#" className="hover:text-white transition">Collections</a></li>
              <li><a href="#" className="hover:text-white transition">About Jorge</a></li>
              <li><a href="#" className="hover:text-white transition">Smart Mouse Tech</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">Legal</h4>
            <ul className="space-y-3 text-[11px] tracking-wide">
              <li><a href="#" className="hover:text-white transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Cancellation Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
          <div className="flex flex-col md:flex-row items-center gap-6">
             <div className="flex items-center gap-3"><img src="/studio-1.svg" alt="Vallin Studio" className="h-3 w-auto filter brightness-0 invert opacity-60" /><p>&copy; 2026 All rights reserved.</p></div>
             <div className="flex gap-4 text-[8px] opacity-40 hover:opacity-100 transition-opacity">
                <a href="https://es.vecteezy.com/videos-gratis/viaje" target="_blank" rel="noopener noreferrer" className="hover:text-white">Video by Vecteezy</a>
                <span className="hidden md:inline">|</span>
                <a href="https://es.vecteezy.com/fotos-gratis/sabana-africana" target="_blank" rel="noopener noreferrer" className="hover:text-white">Media by Vecteezy</a>
             </div>
          </div>
          <p className="mt-4 md:mt-0">Independent Affiliate.</p>
        </div>
      </footer>
    </div>
  );
};

export default VallinTravelMVP;