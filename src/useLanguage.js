import { useState, useEffect } from 'react';

export const useLanguage = () => {
  // 1. Detecta si hay un idioma guardado, si no, lee el del celular/navegador
  const [lang, setLang] = useState(() => {
    const savedLang = localStorage.getItem('vallin_lang');
    if (savedLang) return savedLang;
    return navigator.language.includes('es') ? 'es' : 'en';
  });

  // 2. Función para cambiar de idioma y avisarle a todo el sitio
  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('vallin_lang', newLang);
    window.dispatchEvent(new Event('languageChange')); // Avisa a las demás páginas
  };

  // 3. Escucha si otra página cambió el idioma para sincronizarse
  useEffect(() => {
    const handleLangChange = () => {
      setLang(localStorage.getItem('vallin_lang') || 'en');
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  return { lang, changeLanguage };
};