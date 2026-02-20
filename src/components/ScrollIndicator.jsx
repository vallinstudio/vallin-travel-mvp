import React from 'react';
import { ChevronsDown } from 'lucide-react';

const ScrollIndicator = ({ targetId }) => {
  const handleScroll = () => {
    const section = document.getElementById(targetId);
    if (section) {
      // Offset para que baje justo al inicio de las tarjetas
      const yOffset = -40; 
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={handleScroll}
      className="relative flex justify-center py-6 cursor-pointer text-gray-300 hover:text-orange-500 transition-colors animate-bounce"
    >
      <ChevronsDown size={32} strokeWidth={1.5} />
    </div>
  );
};

export default ScrollIndicator;