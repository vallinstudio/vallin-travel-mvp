import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import VaultPage from './pages/VaultPage';
import DisneyPage from './pages/DisneyPage';
import HoneymoonPage from './pages/HoneymoonPage';
import ExpeditionPage from './pages/ExpeditionPage';
import WellnessPage from './pages/WellnessPage';
import TermsPage from './pages/TermsPage'; 

// NUEVO IMPORT (Asegúrate de haber creado este archivo en src/pages/)
import SmartMouseEngine from './pages/SmartMouseEngine';

function App() {
  return (
    <Router>
      <Routes>

        {/* === RUTAS ESTÁNDAR (Con el Layout de vaLLin.traveL) === */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="vault" element={<VaultPage />} />
          <Route path="disney" element={<DisneyPage />} />
          <Route path="honeymoon" element={<HoneymoonPage />} />
          <Route path="expedition" element={<ExpeditionPage />} />
          <Route path="wellness" element={<WellnessPage />} />
          <Route path="terms" element={<TermsPage />} />
        </Route>

        {/* === RUTA PRODUCTO AUTÓNOMO (Sin MainLayout) === */}
        {/* Esta ruta carga el motor "Smart Mouse" en pantalla completa */}
        <Route path="/smart-mouse" element={<SmartMouseEngine />} />

      </Routes>
    </Router>
  );
}

export default App;