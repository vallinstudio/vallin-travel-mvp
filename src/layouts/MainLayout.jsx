import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, ShieldCheck, ArrowRight, CheckCircle, MessageCircle, Anchor, Loader2, AlertCircle, Check } from 'lucide-react';

import { dictionary } from '../dictionary';
import { useLanguage } from '../useLanguage';

const getLocalToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const MainLayout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [prefillData, setPrefillData] = useState(null); 
  const [scrolled, setScrolled] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { lang, changeLanguage } = useLanguage();
  const t = dictionary[lang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    const consent = localStorage.getItem('vallin_cookie_consent');
    if (!consent) setShowCookieBanner(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('vallin_cookie_consent', 'true');
    setShowCookieBanner(false);
  };

  const handleOpenContact = (data = null) => {
    if (data) {
        setPrefillData(data);
    } else {
        setPrefillData(null); 
    }
    setIsContactOpen(true);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        navigate('/');
        window.scrollTo(0, 0);
    }
    setIsMenuOpen(false);
  };

  const handleFooterLink = (path) => {
      navigate(path);
      window.scrollTo(0, 0);
  };

  const handleScrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const ContactModal = () => {
    const [formStatus, setFormStatus] = useState("idle");
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
      name: '', email: '', countryCode: '+52', phone: '',
      startDate: '', endDate: '', destination: '', travelers: '', budget: '', requests: ''
    });

    useEffect(() => {
        if (prefillData && isContactOpen) {
            let travelerRange = "";
            if (prefillData.guests) {
                const g = Number(prefillData.guests);
                if (g <= 2) travelerRange = t.modal.p1;
                else if (g <= 5) travelerRange = t.modal.p2;
                else travelerRange = t.modal.p3;
            }

            let dest = prefillData.destination || "Disney World"; 
            if (prefillData.resortName) {
                if (prefillData.resortName.includes("Disneyland")) dest = "Disneyland";
                else if (prefillData.resortName.includes("Aulani")) dest = "Other";
            }

            let finalMessage = prefillData.requests || ""; 
            if (prefillData.source === 'vault') {
                finalMessage = `🎯 SMART MOUSE QUOTE REQUEST\n\nI am interested in:\n- Resort: ${prefillData.resortName}\n- Room: ${prefillData.roomName}\n- Smart Rate: $${prefillData.price?.toLocaleString()} USD\n- Estimated Savings: ${prefillData.savings}%\n\nPlease confirm availability for these dates.`;
            }

            setFormData(prev => ({
                ...prev,
                startDate: prefillData.dates?.start || prev.startDate,
                endDate: prefillData.dates?.end || prev.endDate,
                travelers: travelerRange || prev.travelers,
                destination: dest,
                requests: finalMessage
            }));
        }
    }, [prefillData, isContactOpen, t]);

    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    };

    // JS DATE BLOCKER (Fallback para iPhone)
    const handleDateChange = (e) => {
        const fieldName = e.target.name;
        const newDate = e.target.value;
        const today = getLocalToday();

        if (newDate && newDate < today) {
            alert(lang === 'es' ? "No es posible seleccionar fechas pasadas." : "You cannot select past dates.");
            setFormData({ ...formData, [fieldName]: today });
        } else {
            setFormData({ ...formData, [fieldName]: newDate });
        }
        if (errors[fieldName]) setErrors({ ...errors, [fieldName]: null });
    };

    const validateForm = () => {
      const newErrors = {};
      const { name, email, phone, startDate, endDate, destination, travelers, budget } = formData;

      if (name.trim().length < 3) newErrors.name = t.modal.errName;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = t.modal.errMail;
      if (phone.replace(/[^0-9]/g, '').length < 10) newErrors.phone = t.modal.errPhone;
      if (!startDate) newErrors.startDate = t.modal.errReq;
      if (endDate && startDate && new Date(endDate) <= new Date(startDate)) {
        newErrors.endDate = t.modal.errDate;
      }
      if (!destination) newErrors.destination = t.modal.errReq;
      if (!travelers) newErrors.travelers = t.modal.errReq;
      if (!budget) newErrors.budget = t.modal.errReq;

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;
      setFormStatus("submitting");

      const payload = {
        name: formData.name, email: formData.email,
        phone: `${formData.countryCode} ${formData.phone}`,
        dates: `${formData.startDate} to ${formData.endDate || 'Flexible'}`,
        destination: formData.destination, travelers: formData.travelers,
        budget: formData.budget, requests: formData.requests
      };

      const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwfTry8sbHFzBBPdY-rh2rAwC2t2iDS7I6C501_O0O2ECnVKENy8wwZjNqmUOTBryKb/exec";

      try {
        // REVERTIDO A JSON.STRINGIFY (Garantiza que Google Sheet reciba el formato correcto)
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST", mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        setFormStatus("success");
      } catch (error) {
        console.error("Error:", error);
        setFormStatus("error");
      }
    };

    const getWhatsAppLink = () => {
      const text = lang === 'es' 
        ? `Hola Jorge, acabo de solicitar información en vallin.travel para *${formData.destination}*. Mi nombre es *${formData.name}*.`
        : `Hi Jorge, I just requested information on vallin.travel for *${formData.destination}*. My name is *${formData.name}*.`;
      return `https://wa.me/525655857811?text=${encodeURIComponent(text)}`;
    };

    if (!isContactOpen) return null;

    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setIsContactOpen(false)}></div>
        <div className="relative bg-zinc-900 border border-white/10 w-full max-w-lg p-8 md:p-10 shadow-2xl animate-fade-in overflow-y-auto max-h-[90vh]">
          <button onClick={() => setIsContactOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition z-50"><X size={20} /></button>

          {formStatus === "success" ? (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6 border border-green-500/20">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-3xl font-serif text-white mb-2">{t.modal.successTitle}</h3>
              <p className="text-gray-400 font-light mb-8 max-w-xs mx-auto">{t.modal.successDesc1}<br/>{t.modal.successDesc2}</p>
              <div className="w-full border-t border-white/10 pt-8 mt-2">
                <p className="text-[10px] uppercase tracking-widest text-orange-400 mb-4">{t.modal.prio}</p>
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 w-full flex items-center justify-center gap-3 transition-all font-bold uppercase tracking-widest text-xs shadow-lg rounded-none">
                  <MessageCircle size={18} /> {t.modal.waBtn}
                </a>
              </div>
            </div>
          ) : (
             <form onSubmit={handleSubmit} className="flex flex-col gap-5">
               <div className="mb-8 border-l-2 border-orange-500 pl-4">
                  <h3 className="text-3xl font-serif text-white mb-1">{t.modal.title}</h3>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                      {prefillData ? "Smart Quote Configuration Loaded" : t.modal.subtitle}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.name}</label>
                       <input name="name" type="text" value={formData.name} onChange={handleChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none ${errors.name ? 'border-red-500' : 'border-white/10'}`} placeholder={t.modal.namePl} />
                       {errors.name && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.name}</span>}
                   </div>
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.email}</label>
                       <input name="email" type="email" value={formData.email} onChange={handleChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none ${errors.email ? 'border-red-500' : 'border-white/10'}`} placeholder="email@domain.com" />
                       {errors.email && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email}</span>}
                   </div>
               </div>

               <div>
                   <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.phone}</label>
                   <div className="flex gap-2">
                      <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="bg-black/40 border border-white/10 p-3 text-[16px] md:text-sm text-white focus:border-orange-500 outline-none w-24 appearance-none text-center">
                         <option value="+52">🇲🇽 +52</option><option value="+1">🇺🇸 +1</option><option value="+34">🇪🇸 +34</option><option value="+54">🇦🇷 +54</option>
                      </select>
                      <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className={`flex-1 bg-black/40 border p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none ${errors.phone ? 'border-red-500' : 'border-white/10'}`} placeholder="10 digits" />
                   </div>
                   {errors.phone && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</span>}
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.in}</label>
                       <input name="startDate" type="date" min={getLocalToday()} value={formData.startDate} onChange={handleDateChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none ${errors.startDate ? 'border-red-500' : 'border-white/10'}`} style={{colorScheme:'dark'}} />
                       {errors.startDate && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.startDate}</span>}
                   </div>
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.out}</label>
                       <input name="endDate" type="date" min={formData.startDate || getLocalToday()} value={formData.endDate} onChange={handleDateChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none ${errors.endDate ? 'border-red-500' : 'border-white/10'}`} style={{colorScheme:'dark'}} />
                       {errors.endDate && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.endDate}</span>}
                   </div>
               </div>

               <div>
                 <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.where}</label>
                 <select name="destination" value={formData.destination} onChange={handleChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm focus:border-orange-500 transition outline-none appearance-none ${formData.destination === "" ? "text-gray-500" : "text-white"} ${errors.destination ? 'border-red-500' : 'border-white/10'}`}>
                   <option value="" disabled>{t.modal.selColl}</option>
                   <option value="Disney World">{t.modal.wdw}</option>
                   <option value="Disneyland">{t.modal.dlr}</option>
                   <option value="Disney Cruise">{t.modal.dcl}</option>
                   <option value="Universal">{t.modal.uni}</option>
                   <option value="Europe">{t.modal.eur}</option>
                   <option value="Other">{t.modal.oth}</option>
                 </select>
                 {errors.destination && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.destination}</span>}
               </div>

               <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.pax}</label>
                       <select name="travelers" value={formData.travelers} onChange={handleChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm focus:border-orange-500 transition outline-none ${formData.travelers === "" ? "text-gray-500" : "text-white"} ${errors.travelers ? 'border-red-500' : 'border-white/10'}`}>
                         <option value="" disabled>{t.modal.sel}</option>
                         <option value="1-2 People">{t.modal.p1}</option>
                         <option value="Family (3-5)">{t.modal.p2}</option>
                         <option value="Large Group (6+)">{t.modal.p3}</option>
                       </select>
                       {errors.travelers && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.travelers}</span>}
                   </div>
                   <div>
                       <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.bud}</label>
                       <select name="budget" value={formData.budget} onChange={handleChange} className={`w-full bg-black/40 border p-3 text-[16px] md:text-sm focus:border-orange-500 transition outline-none ${formData.budget === "" ? "text-gray-500" : "text-white"} ${errors.budget ? 'border-red-500' : 'border-white/10'}`}>
                         <option value="" disabled>{t.modal.range}</option>
                         <option value="$3,000 - $5,000">$3,000 - $5,000</option>
                         <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                         <option value="$10,000 - $20,000">$10,000 - $20,000</option>
                         <option value="$20,000+">$20,000+</option>
                       </select>
                       {errors.budget && <span className="text-red-400 text-[9px] mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.budget}</span>}
                   </div>
               </div>

               <div>
                 <label className="text-[9px] uppercase tracking-widest text-gray-500 mb-2 block">{t.modal.req}</label>
                 <textarea name="requests" rows="4" value={formData.requests} onChange={handleChange} className="w-full bg-black/40 border border-white/10 p-3 text-[16px] md:text-sm text-white focus:border-orange-500 transition outline-none font-sans" placeholder={t.modal.reqPl}></textarea>
               </div>

                <button type="submit" disabled={formStatus === "submitting"} className="bg-white text-black py-4 mt-2 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-orange-600 hover:text-white transition shadow-lg flex justify-center items-center gap-2 w-full cursor-pointer">
                   {formStatus === "submitting" ? (<>{t.modal.proc} <Loader2 className="animate-spin" size={14}/></>) : (<>{t.modal.btn} <ArrowRight size={14} /></>)}
                </button>
             </form>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      <ContactModal />

      <nav className={`fixed w-full z-50 top-0 left-0 transition-all duration-500 border-b border-white/10 ${scrolled ? 'bg-black/95 py-4 shadow-xl' : 'bg-transparent py-6 md:py-8 border-transparent'}`}>
        <div className="px-6 md:px-12 flex items-center justify-between">
          <div onClick={handleLogoClick} className="flex flex-col cursor-pointer leading-none group flex-1">
            <div className="h-3.5 flex items-center mb-1">
              <img src="/logo.svg" alt="Vallin Travel" className="h-full w-auto object-contain filter brightness-0 invert" />
            </div>
            <span className={`text-[9px] uppercase tracking-[0.4em] mt-2 hidden md:block pl-1 transition-colors duration-300 ${scrolled ? 'text-gray-400' : 'text-gray-200'}`}>
              The Art of Smart Luxury
            </span>
          </div>

          <div className="hidden md:flex items-center justify-center gap-12 text-xs font-bold uppercase tracking-[0.2em] flex-1">
            <button onClick={() => handleScrollToSection('collections')} className="hover:text-orange-500 transition uppercase">{t.nav.collections}</button>
            <Link to="/vault" className="hover:text-orange-500 transition uppercase">{t.nav.vault}</Link>
          </div>

          <div className="hidden md:flex items-center justify-end gap-6 flex-1">
            <button 
                onClick={() => changeLanguage(lang === 'en' ? 'es' : 'en')} 
                className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition shadow-lg ${scrolled ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white hover:text-black border border-white/20 text-white'}`}
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <a href="tel:+525655857811" className={`flex items-center gap-2 text-[10px] font-bold tracking-widest hover:text-orange-500 transition ${scrolled ? 'text-gray-400' : 'text-white/80'}`}>
               <Phone size={12} /> +52 56 5585 7811
            </a>
            <button onClick={() => handleOpenContact()} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition shadow-lg ${scrolled ? 'bg-white text-black hover:bg-orange-500 hover:text-white' : 'bg-white/10 backdrop-blur-md hover:bg-white hover:text-black border border-white/20'}`}>
              {t.nav.inquire}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button 
                onClick={() => changeLanguage(lang === 'en' ? 'es' : 'en')} 
                className={`px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition shadow-lg ${scrolled ? 'bg-white text-black' : 'bg-white/10 backdrop-blur-md border border-white/20 text-white'}`}
            >
              {lang === 'en' ? 'ES' : 'EN'}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black pt-32 px-6 md:hidden">
          <div className="flex flex-col gap-8 text-xl font-serif italic text-center">
            <button onClick={() => handleScrollToSection('collections')} className="uppercase">{t.nav.collections}</button>
            <Link to="/vault" className="uppercase" onClick={() => setIsMenuOpen(false)}>{t.nav.vault}</Link>
            <button onClick={() => { setIsMenuOpen(false); handleOpenContact(); }} className="text-orange-500">{t.nav.inquireNow}</button>
            <a href="tel:+525655857811" className="text-sm font-sans tracking-widest text-gray-400">+52 56 5585 7811</a>
          </div>
        </div>
      )}

      <div className="flex-grow">
          <Outlet context={{ openContact: handleOpenContact, lang: lang }} />
      </div>

      <footer className="bg-black text-gray-400 py-20 border-t border-gray-900 text-xs">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="h-4 flex items-center mb-6">
              <img src="/logo.svg" alt="Vallin Travel" className="h-full w-auto object-contain filter brightness-0 invert opacity-80" />
            </div>
            <p className="leading-relaxed mb-6 text-gray-500">{t.footer.desc}</p>
            <a href="mailto:concierge@vallin.travel?subject=Concierge%20(Contact%20me)" className="flex items-center gap-2 text-white hover:text-orange-500 transition mb-8">
                <Mail size={14} /> concierge@vallin.travel
            </a>
            <div className="flex flex-col gap-3">
               <div className="px-3 py-2 border border-gray-800 bg-gray-900/30 text-[9px] uppercase tracking-wider flex items-center gap-2 cursor-default w-fit">
                   <ShieldCheck className="w-3 h-3 text-orange-600"/> 
                   <div className="flex items-baseline gap-1">
                       <span className="font-walt relative text-sm leading-none">Disney</span>
                       <span className="text-[9px] uppercase tracking-wider font-sans">{t.footer.cert1}</span>
                   </div>
               </div>

               <div className="px-3 py-2 border border-gray-800 bg-gray-900/30 text-[9px] uppercase tracking-wider flex items-center gap-2 cursor-default w-fit">
                   <ShieldCheck className="w-3 h-3 text-orange-600"/> 
                   <div className="flex items-baseline gap-1">
                       <span className="font-universal relative text-[9px] leading-none tracking-widest">UNIVERSAL</span>
                       <span className="text-[9px] uppercase tracking-wider font-sans">{t.footer.cert1}</span>
                   </div>
               </div>

               <div className="px-3 py-2 border border-gray-800 bg-gray-900/30 text-[9px] uppercase tracking-wider flex items-center gap-2 cursor-default w-fit">
                   <Anchor className="w-3 h-3 text-orange-600"/> {t.footer.cert2}
               </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-1">
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">{t.footer.news}</h4>
            <p className="mb-4 text-[10px] text-gray-500">{t.footer.newsSub}</p>
            <div className="flex border-b border-gray-700 pb-2">
              <input type="email" placeholder={t.footer.coming} disabled className="bg-transparent w-full outline-none text-gray-600 cursor-not-allowed" />
              <button disabled className="text-gray-600"><ArrowRight size={14}/></button>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">{t.footer.exp}</h4>
            <ul className="space-y-3 text-[11px] tracking-wide">
              <li><Link to="/vault" className="hover:text-white transition">{t.nav.vault}</Link></li>
              <li><button onClick={() => handleScrollToSection('collections')} className="hover:text-white transition">{t.nav.collections}</button></li>
              <li><button onClick={() => handleFooterLink('/about')} className="hover:text-white transition">{t.footer.about}</button></li>
              <li><button onClick={() => handleFooterLink('/smart-mouse')} className="hover:text-white transition text-left">Smart Mouse Tech</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] mb-6 text-[10px]">{t.footer.legal}</h4>
            <ul className="space-y-3 text-[11px] tracking-wide">
              <li><button onClick={() => handleFooterLink('/terms')} className="hover:text-white transition text-left">{t.footer.terms}</button></li>
              <li><button onClick={() => handleFooterLink('/terms')} className="hover:text-white transition text-left">{t.footer.privacy}</button></li>
              <li><button onClick={() => handleFooterLink('/terms')} className="hover:text-white transition text-left">{t.footer.cancel}</button></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 uppercase tracking-widest">
          <div className="flex flex-col md:flex-row items-center gap-6">
              <a href="https://vallin.studio" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
                  <img src="/studio-1.svg" alt="Vallin Studio" className="h-3 w-auto filter brightness-0 invert opacity-60" />
                  <p>© 2026 {t.footer.rights}</p>
              </a>
              <div className="flex gap-4 text-[8px] opacity-40 hover:opacity-100 transition-opacity">
                 <a href="https://es.vecteezy.com/videos-gratis/viaje" target="_blank" rel="noopener noreferrer" className="hover:text-white">Video by Vecteezy</a>
                 <span className="hidden md:inline">|</span>
                 <a href="https://es.vecteezy.com/fotos-gratis/sabana-africana" target="_blank" rel="noopener noreferrer" className="hover:text-white">Media by Vecteezy</a>
              </div>
          </div>
          <a 
            href="https://wa.me/525655857811?text=Deseo%20m%C3%A1s%20informaci%C3%B3n%20sobre%20el%20Programa%20de%20Afiliados" 
            target="_blank" 
            rel="noreferrer"
            className="mt-4 md:mt-0 hover:text-white transition cursor-pointer flex items-center gap-2"
          >
            {t.footer.aff} <ArrowRight size={10} />
          </a>
        </div>
      </footer>

      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 w-full bg-zinc-900 border-t border-orange-500/50 p-6 z-[100] shadow-2xl animate-slide-up">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1">
                    <h5 className="text-white font-serif italic text-lg mb-1">We value your privacy</h5>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-2xl">
                        We use cookies to enhance your experience, calculate "Smart Mouse" quotes, and analyze traffic. We do not sell your data. By continuing, you agree to our Terms & Privacy Policy.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setShowCookieBanner(false)} className="text-gray-500 text-[10px] uppercase tracking-widest hover:text-white transition">Decline</button>
                    <button onClick={acceptCookies} className="bg-white text-black px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-orange-500 hover:text-white transition flex items-center gap-2">
                        <Check size={14}/> Accept
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;