import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertTriangle, Copyright } from 'lucide-react';

const TermsPage = () => {
  const [activeTab, setActiveTab] = useState('terms');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // CORRECCIÓN DEFINITIVA REGLA DE ORO:
  // Forzamos font-bold para la primera parte y font-normal para la segunda.
  const BrandName = () => (
    <span style={{ fontFamily: "'Syncopate', sans-serif" }} className="tracking-widest text-xs md:text-sm">
      <span className="font-bold">vaLLin.</span><span className="font-normal">traveL</span>
    </span>
  );

  return (
    <div className="bg-black text-gray-300 min-h-screen pt-32 pb-20 px-6 font-sans selection:bg-orange-500 selection:text-white">

      <div className="max-w-4xl mx-auto">

        {/* HEADER LEGAL */}
        <div className="mb-12 border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">Legal & Compliance</h1>
            <p className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-6">Last Updated: January 2026</p>

            <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold">
                <button 
                    onClick={() => setActiveTab('terms')}
                    className={`px-4 py-2 border transition-all ${activeTab === 'terms' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
                >
                    Terms & Service
                </button>
                <button 
                    onClick={() => setActiveTab('privacy')}
                    className={`px-4 py-2 border transition-all ${activeTab === 'privacy' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
                >
                    Privacy & Data Ownership
                </button>
                <button 
                    onClick={() => setActiveTab('trademarks')}
                    className={`px-4 py-2 border transition-all ${activeTab === 'trademarks' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
                >
                    Trademarks & Attribution
                </button>
            </div>
        </div>

        {/* CONTENIDO: TERMS & SERVICE */}
        {activeTab === 'terms' && (
            <div className="space-y-12 animate-fade-in">
                <section>
                    <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                        <Shield size={18} className="text-orange-500"/> 1. Legal Identity & Relationship
                    </h3>
                    <div className="text-sm leading-relaxed text-gray-400 space-y-4 text-justify">
                        <p>
                            <strong>Jorge Ramírez Pérez</strong>, operating commercially under the trademark <BrandName />, is a registered "Persona Física con Actividad Empresarial" under Mexican Law, authorized to act as a Travel Agency and Experience Designer.
                        </p>
                        <p>
                            By engaging our services, the Client acknowledges that their primary commercial and fiduciary relationship is established directly and exclusively with <strong>Jorge Ramírez Pérez (<BrandName />)</strong>.
                        </p>
                        <div className="p-4 border-l-2 border-orange-500 bg-white/5">
                            <p className="text-white font-bold mb-2 text-xs uppercase tracking-widest">Fiduciary Duty & Supplier Selection (The "Freedom of Choice" Clause)</p>
                            <p>
                                The Client authorizes <BrandName /> to act as their sole representative to procure, negotiate, and book travel services through <strong>any wholesale operator, global supplier, or direct partner</strong> that provides the best value, conditions, and availability for the Client's specific needs. 
                            </p>
                            <p className="mt-3">
                                <BrandName /> maintains complete independence and is not exclusively bound to any single wholesale aggregator (including, but not limited to, Operadora MH, Mega Travel, or similar entities). We reserve the right to bypass specific operators if direct booking or alternative luxury consortiums offer superior benefits to our Client.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-serif text-white mb-4">2. Client Ownership & Portability</h3>
                    <p className="text-sm leading-relaxed text-gray-400 text-justify">
                        All client profiles, preferences, travel history, and communication records generated through <BrandName /> properties are the <strong>sole and exclusive intellectual property and asset of Jorge Ramírez Pérez</strong>. Third-party suppliers and wholesale operators are strictly categorized as "Data Processors" for the limited purpose of fulfilling specific reservations. They hold no claim, ownership, or solicitation rights over <BrandName />'s clientele.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-serif text-white mb-4">3. Booking Conditions & Liability</h3>
                    <p className="text-sm leading-relaxed text-gray-400 text-justify">
                        While <BrandName /> curates experiences, the final execution of transport, accommodation, and activities is performed by third-party suppliers. <BrandName /> is not liable for acts of God, operational cancellations by airlines/hotels, or changes in third-party terms. However, we advocate firmly on behalf of our clients in all dispute resolutions.
                    </p>
                </section>
            </div>
        )}

        {/* CONTENIDO: PRIVACY */}
        {activeTab === 'privacy' && (
            <div className="space-y-12 animate-fade-in">
                <section>
                    <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2">
                        <Lock size={18} className="text-orange-500"/> Data Sovereignty
                    </h3>
                    <p className="text-sm leading-relaxed text-gray-400 text-justify mb-4">
                        Your privacy is paramount. Unlike mass-market agencies, <strong><BrandName /> does not sell, rent, or trade your personal information.</strong>
                    </p>
                    <p className="text-sm leading-relaxed text-gray-400 text-justify">
                        When booking implies a third-party wholesaler (e.g., for specific Disney or Universal packages), only the minimum data required for the reservation is transmitted. We explicitly prohibit these third parties from adding your data to their marketing databases or contacting you directly, enforcing our "Non-Solicitation" agreements with them.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-serif text-white mb-4">Cookies & Digital Tracking</h3>
                    <p className="text-sm leading-relaxed text-gray-400 text-justify mb-4">
                        This site uses essential cookies to ensure functionality (such as the "Smart Mouse" quote engine) and analytical cookies to improve user experience.
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-2">
                        <li><strong>Essential Cookies:</strong> Required for the site to work. Cannot be disabled.</li>
                        <li><strong>Performance Cookies:</strong> Help us understand traffic patterns (e.g., which Collections are most popular).</li>
                    </ul>
                </section>
            </div>
        )}

        {/* CONTENIDO: TRADEMARKS */}
        {activeTab === 'trademarks' && (
            <div className="space-y-12 animate-fade-in">
                <div className="bg-orange-900/20 border border-orange-500/30 p-6 rounded-sm">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={20}/>
                        <div>
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">Non-Affiliation & Fair Use Disclaimer</h4>
                            <p className="text-[11px] text-gray-300 leading-relaxed text-justify">
                                <BrandName /> (Jorge Ramírez Pérez) is an independent travel retailer. We are authorized sellers/intermediaries for the brands listed below but are not the owners of their intellectual property. The use of names, trademarks, and logos on this site is strictly for <strong>descriptive and nominative fair use purposes</strong> to identify the specific services and destinations being offered for sale.
                            </p>
                        </div>
                    </div>
                </div>

                <section>
                    <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2">
                        <Copyright size={18} className="text-gray-500"/> Trademark Acknowledgments
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-500 leading-relaxed uppercase tracking-wide">

                        {/* THEME PARKS */}
                        <div>
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">Entertainment & Theme Parks</h4>
                            <p className="mb-2">
                                <strong>DISNEY:</strong> As to Disney artwork/properties: © Disney. Mickey Mouse, Disney Cruise Line, Disney Vacation Club, Adventures by Disney, and all related titles and indicia are trademarks of The Walt Disney Company and its affiliates.
                            </p>
                            <p className="mb-2">
                                <strong>UNIVERSAL:</strong> Universal elements and all related indicia TM & © 2026 Universal Studios. All rights reserved. Harry Potter, Jurassic World, Nintendo, Mario Bros, Donkey Kong Country are trademarks of their respective owners.
                            </p>
                            <p>
                                <strong>OTHERS:</strong> LEGO®, the LEGO logo, the Brick and Knob configurations, the Minifigure, LEGOLAND® are trademarks of the LEGO Group. Peanuts® and Snoopy® are registered trademarks of Peanuts Worldwide LLC. Ferrari World™ is a trademark of Ferrari S.p.A. Warner Bros.™ trademarks are property of Warner Bros. Entertainment Inc.
                            </p>
                        </div>

                        {/* LUXURY HOTELS */}
                        <div>
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">Ultra-Luxury Hospitality</h4>
                            <p>
                                The following trademarks are the property of their respective owners and are used herein solely to identify the specific properties available for booking: 
                                Four Seasons®, Aman®, Belmond®, Rosewood®, One&Only®, Soneva®, The Brando®, Six Senses®, Hilton® (Waldorf Astoria), Hyatt® (Park Hyatt), Relais & Châteaux®, and other listed hotel groups.
                            </p>
                        </div>

                        {/* EXPEDITION & WELLNESS */}
                        <div>
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">Expedition & Wellness Partners</h4>
                            <p>
                                Silversea®, Ponant®, White Desert®, Lindblad Expeditions®, Quasar®, Ecoventura®, Metropolitan Touring®, Mashpi Lodge®, Awasi®, Explora®, EOLO®, Clinique La Prairie®, SHA Wellness®, Chenot®, Lanserhof®, COMO®, Ananda®, Miraval®.
                            </p>
                        </div>

                        {/* MEDIA ATTRIBUTION */}
                        <div>
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">Media Credits & Attribution</h4>
                            <p className="mb-2">
                                Primary destination photography is sourced from official supplier media hubs (Disney Travel Agents, Universal Partner Community, Hotel Media Kits) for authorized promotional use.
                            </p>
                            <p>
                                Supplemental stock footage and imagery: <br/>
                                <a href="https://www.vecteezy.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Free Stock Video by Vecteezy</a> | <a href="https://www.vecteezy.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Stock Photos by Vecteezy</a>
                            </p>
                            <p>
                                Government Tourism Boards: Images from Visit Greenland, Visit Iceland, PromPeru, and Quito Turismo are used with gratitude for destination promotion.
                            </p>
                        </div>

                    </div>
                </section>
            </div>
        )}

      </div>
    </div>
  );
};

export default TermsPage;