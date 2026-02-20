import React, { useState, useEffect } from 'react'; 
import { useOutletContext } from 'react-router-dom';
import { Shield, Lock, AlertTriangle, Copyright } from 'lucide-react'; 

const TermsPage = () => { 
  const { lang } = useOutletContext(); // Obtenemos el idioma activo
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
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">
              {lang === 'es' ? 'Legal & Cumplimiento' : 'Legal & Compliance'}
            </h1> 
            <p className="text-xs uppercase tracking-widest text-orange-500 font-bold mb-6">
              {lang === 'es' ? 'Última Actualización: Enero 2026' : 'Last Updated: January 2026'}
            </p> 

            <div className="flex flex-wrap gap-4 text-[10px] uppercase tracking-widest font-bold"> 
                <button  
                    onClick={() => setActiveTab('terms')} 
                    className={`px-4 py-2 border transition-all ${activeTab === 'terms' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`} 
                > 
                    {lang === 'es' ? 'Términos & Servicio' : 'Terms & Service'}
                </button> 
                <button  
                    onClick={() => setActiveTab('privacy')} 
                    className={`px-4 py-2 border transition-all ${activeTab === 'privacy' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`} 
                > 
                    {lang === 'es' ? 'Privacidad & Propiedad de Datos' : 'Privacy & Data Ownership'}
                </button> 
                <button  
                    onClick={() => setActiveTab('trademarks')} 
                    className={`px-4 py-2 border transition-all ${activeTab === 'trademarks' ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`} 
                > 
                    {lang === 'es' ? 'Marcas & Atribución' : 'Trademarks & Attribution'}
                </button> 
            </div> 
        </div> 

        {/* CONTENIDO: TERMS & SERVICE */} 
        {activeTab === 'terms' && ( 
            <div className="space-y-12 animate-fade-in"> 
                <section> 
                    <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2"> 
                        <Shield size={18} className="text-orange-500"/> 
                        {lang === 'es' ? '1. Identidad Legal & Relación' : '1. Legal Identity & Relationship'}
                    </h3> 
                    <div className="text-sm leading-relaxed text-gray-400 space-y-4 text-justify"> 
                        <p> 
                            <strong>Jorge Ramírez Pérez</strong>, {lang === 'es' ? 'operando comercialmente bajo la marca' : 'operating commercially under the trademark'} <BrandName />, {lang === 'es' ? 'es una "Persona Física con Actividad Empresarial" registrada bajo las leyes mexicanas, autorizada para actuar como Agencia de Viajes y Diseñador de Experiencias.' : 'is a registered "Persona Física con Actividad Empresarial" under Mexican Law, authorized to act as a Travel Agency and Experience Designer.'} 
                        </p> 
                        <p> 
                            {lang === 'es' ? 'Al contratar nuestros servicios, el Cliente reconoce que su relación comercial y fiduciaria principal se establece directa y exclusivamente con' : 'By engaging our services, the Client acknowledges that their primary commercial and fiduciary relationship is established directly and exclusively with'} <strong>Jorge Ramírez Pérez (<BrandName />)</strong>. 
                        </p> 
                        <div className="p-4 border-l-2 border-orange-500 bg-white/5"> 
                            <p className="text-white font-bold mb-2 text-xs uppercase tracking-widest">
                                {lang === 'es' ? 'Deber Fiduciario & Selección de Proveedores (La Cláusula de "Libertad de Elección")' : 'Fiduciary Duty & Supplier Selection (The "Freedom of Choice" Clause)'}
                            </p> 
                            <p> 
                                {lang === 'es' ? 'El Cliente autoriza a' : 'The Client authorizes'} <BrandName /> {lang === 'es' ? 'a actuar como su único representante para procurar, negociar y reservar servicios de viaje a través de' : 'to act as their sole representative to procure, negotiate, and book travel services through'} <strong>{lang === 'es' ? 'cualquier operador mayorista, proveedor global o socio directo' : 'any wholesale operator, global supplier, or direct partner'}</strong> {lang === 'es' ? 'que brinde el mejor valor, condiciones y disponibilidad para las necesidades específicas del Cliente.' : 'that provides the best value, conditions, and availability for the Client\'s specific needs.'}  
                            </p> 
                            <p className="mt-3"> 
                                <BrandName /> {lang === 'es' ? 'mantiene total independencia y no está vinculada exclusivamente a ningún agregador mayorista único (incluyendo, pero no limitado a, Operadora MH, Mega Travel, o entidades similares). Nos reservamos el derecho de omitir operadores específicos si la reserva directa o consorcios de lujo alternativos ofrecen beneficios superiores a nuestro Cliente.' : 'maintains complete independence and is not exclusively bound to any single wholesale aggregator (including, but not limited to, Operadora MH, Mega Travel, or similar entities). We reserve the right to bypass specific operators if direct booking or alternative luxury consortiums offer superior benefits to our Client.'} 
                            </p> 
                        </div> 
                    </div> 
                </section> 

                <section> 
                    <h3 className="text-xl font-serif text-white mb-4">
                        {lang === 'es' ? '2. Propiedad de Clientes & Portabilidad' : '2. Client Ownership & Portability'}
                    </h3> 
                    <p className="text-sm leading-relaxed text-gray-400 text-justify"> 
                        {lang === 'es' ? 'Todos los perfiles de clientes, preferencias, historial de viajes y registros de comunicación generados a través de las propiedades de' : 'All client profiles, preferences, travel history, and communication records generated through'} <BrandName /> {lang === 'es' ? 'son' : 'are the'} <strong>{lang === 'es' ? 'propiedad intelectual y activo único y exclusivo de Jorge Ramírez Pérez' : 'sole and exclusive intellectual property and asset of Jorge Ramírez Pérez'}</strong>. {lang === 'es' ? 'Los proveedores de terceros y operadores mayoristas están estrictamente categorizados como "Procesadores de Datos" para el propósito limitado de cumplir con reservas específicas. No tienen ningún derecho de reclamo, propiedad o solicitud sobre la clientela de' : 'Third-party suppliers and wholesale operators are strictly categorized as "Data Processors" for the limited purpose of fulfilling specific reservations. They hold no claim, ownership, or solicitation rights over'} <BrandName />{lang === 'es' ? '.' : '\'s clientele.'} 
                    </p> 
                </section> 

                <section> 
                    <h3 className="text-xl font-serif text-white mb-4">
                        {lang === 'es' ? '3. Condiciones de Reserva & Responsabilidad' : '3. Booking Conditions & Liability'}
                    </h3> 
                    <p className="text-sm leading-relaxed text-gray-400 text-justify"> 
                        {lang === 'es' ? 'Mientras que' : 'While'} <BrandName /> {lang === 'es' ? 'cura experiencias, la ejecución final del transporte, alojamiento y actividades es realizada por proveedores de terceros.' : 'curates experiences, the final execution of transport, accommodation, and activities is performed by third-party suppliers.'} <BrandName /> {lang === 'es' ? 'no es responsable por casos de fuerza mayor, cancelaciones operativas por aerolíneas/hoteles, o cambios en los términos de terceros. Sin embargo, abogamos firmemente en nombre de nuestros clientes en todas las resoluciones de disputas.' : 'is not liable for acts of God, operational cancellations by airlines/hotels, or changes in third-party terms. However, we advocate firmly on behalf of our clients in all dispute resolutions.'} 
                    </p> 
                </section> 
            </div> 
        )} 

        {/* CONTENIDO: PRIVACY */} 
        {activeTab === 'privacy' && ( 
            <div className="space-y-12 animate-fade-in"> 
                <section> 
                    <h3 className="text-xl font-serif text-white mb-4 flex items-center gap-2"> 
                        <Lock size={18} className="text-orange-500"/> {lang === 'es' ? 'Soberanía de Datos' : 'Data Sovereignty'} 
                    </h3> 
                    <p className="text-sm leading-relaxed text-gray-400 text-justify mb-4"> 
                        {lang === 'es' ? 'Su privacidad es primordial. A diferencia de las agencias de mercado masivo,' : 'Your privacy is paramount. Unlike mass-market agencies,'} <strong><BrandName /> {lang === 'es' ? 'no vende, alquila ni intercambia su información personal.' : 'does not sell, rent, or trade your personal information.'}</strong> 
                    </p> 
                    <p className="text-sm leading-relaxed text-gray-400 text-justify"> 
                        {lang === 'es' ? 'Cuando la reserva implica a un mayorista de terceros (ej., para paquetes específicos de Disney o Universal), solo se transmite el mínimo de datos requeridos para la reserva. Prohibimos explícitamente a estos terceros agregar sus datos a sus bases de datos de marketing o contactarlo directamente, haciendo cumplir nuestros acuerdos de "No Solicitación" con ellos.' : 'When booking implies a third-party wholesaler (e.g., for specific Disney or Universal packages), only the minimum data required for the reservation is transmitted. We explicitly prohibit these third parties from adding your data to their marketing databases or contacting you directly, enforcing our "Non-Solicitation" agreements with them.'} 
                    </p> 
                </section> 

                <section> 
                    <h3 className="text-xl font-serif text-white mb-4">
                        {lang === 'es' ? 'Cookies & Rastreo Digital' : 'Cookies & Digital Tracking'}
                    </h3> 
                    <p className="text-sm leading-relaxed text-gray-400 text-justify mb-4"> 
                        {lang === 'es' ? 'Este sitio utiliza cookies esenciales para garantizar la funcionalidad (como el motor de cotizaciones "Smart Mouse") y cookies analíticas para mejorar la experiencia del usuario.' : 'This site uses essential cookies to ensure functionality (such as the "Smart Mouse" quote engine) and analytical cookies to improve user experience.'} 
                    </p> 
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-2"> 
                        <li><strong>{lang === 'es' ? 'Cookies Esenciales:' : 'Essential Cookies:'}</strong> {lang === 'es' ? 'Requeridas para que el sitio funcione. No se pueden desactivar.' : 'Required for the site to work. Cannot be disabled.'}</li> 
                        <li><strong>{lang === 'es' ? 'Cookies de Rendimiento:' : 'Performance Cookies:'}</strong> {lang === 'es' ? 'Nos ayudan a entender los patrones de tráfico (ej., qué Colecciones son más populares).' : 'Help us understand traffic patterns (e.g., which Collections are most popular).'}</li> 
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
                            <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-2">
                                {lang === 'es' ? 'Descargo de No Afiliación & Uso Justo' : 'Non-Affiliation & Fair Use Disclaimer'}
                            </h4> 
                            <p className="text-[11px] text-gray-300 leading-relaxed text-justify"> 
                                <BrandName /> {lang === 'es' ? '(Jorge Ramírez Pérez) es un minorista de viajes independiente. Somos vendedores/intermediarios autorizados de las marcas enumeradas a continuación, pero no somos los propietarios de su propiedad intelectual. El uso de nombres, marcas registradas y logotipos en este sitio es estrictamente para' : '(Jorge Ramírez Pérez) is an independent travel retailer. We are authorized sellers/intermediaries for the brands listed below but are not the owners of their intellectual property. The use of names, trademarks, and logos on this site is strictly for'} <strong>{lang === 'es' ? 'fines de uso justo descriptivo y nominativo' : 'descriptive and nominative fair use purposes'}</strong> {lang === 'es' ? 'para identificar los servicios y destinos específicos que se ofrecen a la venta.' : 'to identify the specific services and destinations being offered for sale.'} 
                            </p> 
                        </div> 
                    </div> 
                </div> 

                <section> 
                    <h3 className="text-xl font-serif text-white mb-6 flex items-center gap-2"> 
                        <Copyright size={18} className="text-gray-500"/> 
                        {lang === 'es' ? 'Reconocimientos de Marcas Registradas' : 'Trademark Acknowledgments'} 
                    </h3> 

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-[10px] text-gray-500 leading-relaxed uppercase tracking-wide"> 

                        {/* THEME PARKS */} 
                        <div> 
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">
                                {lang === 'es' ? 'Entretenimiento & Parques Temáticos' : 'Entertainment & Theme Parks'}
                            </h4> 
                            <p className="mb-2"> 
                                <strong>DISNEY:</strong> {lang === 'es' ? 'En cuanto al arte/propiedades de Disney: © Disney. Mickey Mouse, Disney Cruise Line, Disney Vacation Club, Adventures by Disney, y todos los títulos e indicios relacionados son marcas registradas de The Walt Disney Company y sus afiliados.' : 'As to Disney artwork/properties: © Disney. Mickey Mouse, Disney Cruise Line, Disney Vacation Club, Adventures by Disney, and all related titles and indicia are trademarks of The Walt Disney Company and its affiliates.'} 
                            </p> 
                            <p className="mb-2"> 
                                <strong>UNIVERSAL:</strong> {lang === 'es' ? 'Elementos de Universal y todos los indicios relacionados TM & © 2026 Universal Studios. Todos los derechos reservados. Harry Potter, Jurassic World, Nintendo, Mario Bros, Donkey Kong Country son marcas registradas de sus respectivos propietarios.' : 'Universal elements and all related indicia TM & © 2026 Universal Studios. All rights reserved. Harry Potter, Jurassic World, Nintendo, Mario Bros, Donkey Kong Country are trademarks of their respective owners.'} 
                            </p> 
                            <p> 
                                <strong>OTHERS:</strong> {lang === 'es' ? 'LEGO®, el logotipo de LEGO, las configuraciones de Brick and Knob, la Minifigura, LEGOLAND® son marcas registradas del Grupo LEGO. Peanuts® y Snoopy® son marcas registradas de Peanuts Worldwide LLC. Ferrari World™ es una marca registrada de Ferrari S.p.A. Las marcas registradas de Warner Bros.™ son propiedad de Warner Bros. Entertainment Inc.' : 'LEGO®, the LEGO logo, the Brick and Knob configurations, the Minifigure, LEGOLAND® are trademarks of the LEGO Group. Peanuts® and Snoopy® are registered trademarks of Peanuts Worldwide LLC. Ferrari World™ is a trademark of Ferrari S.p.A. Warner Bros.™ trademarks are property of Warner Bros. Entertainment Inc.'} 
                            </p> 
                        </div> 

                        {/* LUXURY HOTELS */} 
                        <div> 
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">
                                {lang === 'es' ? 'Hospitalidad de Ultra-Lujo' : 'Ultra-Luxury Hospitality'}
                            </h4> 
                            <p> 
                                {lang === 'es' ? 'Las siguientes marcas registradas son propiedad de sus respectivos dueños y se utilizan en este documento únicamente para identificar las propiedades específicas disponibles para reservar:' : 'The following trademarks are the property of their respective owners and are used herein solely to identify the specific properties available for booking:'}  
                                Four Seasons®, Aman®, Belmond®, Rosewood®, One&Only®, Soneva®, The Brando®, Six Senses®, Hilton® (Waldorf Astoria), Hyatt® (Park Hyatt), Relais & Châteaux®, {lang === 'es' ? 'y otros grupos hoteleros listados.' : 'and other listed hotel groups.'} 
                            </p> 
                        </div> 

                        {/* EXPEDITION & WELLNESS */} 
                        <div> 
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">
                                {lang === 'es' ? 'Socios de Expedición & Bienestar' : 'Expedition & Wellness Partners'}
                            </h4> 
                            <p> 
                                Silversea®, Ponant®, White Desert®, Lindblad Expeditions®, Quasar®, Ecoventura®, Metropolitan Touring®, Mashpi Lodge®, Awasi®, Explora®, EOLO®, Clinique La Prairie®, SHA Wellness®, Chenot®, Lanserhof®, COMO®, Ananda®, Miraval®. 
                            </p> 
                        </div> 

                        {/* MEDIA ATTRIBUTION */} 
                        <div> 
                            <h4 className="text-white font-bold mb-2 border-b border-gray-800 pb-1">
                                {lang === 'es' ? 'Créditos de Medios & Atribución' : 'Media Credits & Attribution'}
                            </h4> 
                            <p className="mb-2"> 
                                {lang === 'es' ? 'La fotografía principal del destino se obtiene de los centros de medios oficiales de los proveedores (Disney Travel Agents, Universal Partner Community, Hotel Media Kits) para su uso promocional autorizado.' : 'Primary destination photography is sourced from official supplier media hubs (Disney Travel Agents, Universal Partner Community, Hotel Media Kits) for authorized promotional use.'} 
                            </p> 
                            <p> 
                                {lang === 'es' ? 'Material de archivo y metraje de apoyo:' : 'Supplemental stock footage and imagery:'} <br/> 
                                <a href="https://www.vecteezy.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Free Stock Video by Vecteezy</a> | <a href="https://www.vecteezy.com" target="_blank" rel="noreferrer" className="text-orange-500 hover:underline">Stock Photos by Vecteezy</a> 
                            </p> 
                            <p> 
                                {lang === 'es' ? 'Juntas Gubernamentales de Turismo: Las imágenes de Visit Greenland, Visit Iceland, PromPeru y Quito Turismo se utilizan con gratitud para la promoción de destinos.' : 'Government Tourism Boards: Images from Visit Greenland, Visit Iceland, PromPeru, and Quito Turismo are used with gratitude for destination promotion.'} 
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