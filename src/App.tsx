import { useState, useEffect } from 'react';
import { PlantaeCinematicLogo } from './components/Plantae/PlantaeCinematicLogo';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { PlantDetail } from './components/PlantDetail';
import type { PlantData } from './services/plantService';
import { storageService } from './services/storageService';
import type { HistoryItem } from './services/storageService';
import { HistoryView } from './components/History';
import { GardenView } from './components/Garden';
import { SearchView } from './components/Search';
import { ProfileView } from './components/Profile';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [noPlantFound, setNoPlantFound] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [garden, setGarden] = useState<PlantData[]>([]);
  const [identifiedPlant, setIdentifiedPlant] = useState<PlantData | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('plantae_darkmode') === 'true'; } catch { return false; }
  });

  useEffect(() => {
    setHistory(storageService.getHistory());
    setGarden(storageService.getGarden());
  }, []);

  // Apply dark mode to body and root
  useEffect(() => {
    document.body.style.background = darkMode ? '#0a120a' : 'white';
    document.body.style.color = darkMode ? '#e0f0e0' : '#1A4D2E';
    try { localStorage.setItem('plantae_darkmode', String(darkMode)); } catch { }
  }, [darkMode]);

  const handleToggleDarkMode = () => setDarkMode(d => !d);

  const handleSaveToGarden = (plant: PlantData) => {
    const isSaved = garden.find(p => p.id === plant.id);
    if (isSaved) {
      const updated = storageService.removeFromGarden(plant.id);
      setGarden(updated);
    } else {
      const updated = storageService.addToGarden(plant);
      setGarden(updated);
    }
  };

  const handleCapture = (result: PlantData | { error: string } | null) => {
    setShowScanner(false);

    if (!result) {
      setNoPlantFound(true);
      setErrorState('TECHNICAL_ERROR');
      setTimeout(() => setNoPlantFound(false), 3500);
      return;
    }

    if ('error' in result) {
      setNoPlantFound(true);
      setErrorState(result.error);
      setTimeout(() => setNoPlantFound(false), 3500);
      return;
    }

    // Success
    const updatedHistory = storageService.addToHistory(result);
    setHistory(updatedHistory);
    setIdentifiedPlant(result);
    setErrorState(null);
  };

  const [errorState, setErrorState] = useState<string | null>(null);

  const getToastMessage = () => {
    switch (errorState) {
      case 'QUOTA_EXCEEDED': return '⏳ Gemini quota exceeded. Please wait 60 seconds and try again.';
      case 'API_KEY_MISSING': return '🔑 API Key missing. Please check your .env.local file.';
      case 'NO_PLANT_DETECTED': return '🌿 No plant detected — make sure the plant is clearly visible!';
      case 'TECHNICAL_ERROR': return '❌ API Error. Check your internet connection or API key permissions.';
      default: return '⚠️ Unknown error occurred. Check browser console for [Gemini Debug] logs.';
    }
  };

  const handleClearHistory = () => {
    const updated = storageService.clearHistory();
    setHistory(updated);
  };

  const handleClearGarden = () => {
    const updated = storageService.clearGarden();
    setGarden(updated);
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 6500);
    return () => clearTimeout(timer);
  }, []);

  const appBg = darkMode ? '#0a120a' : 'white';

  return (
    <div style={{ width: '100%', height: '100%', background: appBg, overflow: 'hidden', position: 'relative', transition: 'background 0.3s' }}>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            exit={{ y: '-100%', transition: { duration: 1, ease: [0.45, 0, 0.55, 1] } }}
            style={{ position: 'absolute', inset: 0, zIndex: 50, background: appBg }}
          >
            <PlantaeCinematicLogo />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: '20%' }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ width: '100%', height: '100%', position: 'relative' }}
          >
            <Dashboard
              onScan={() => setShowScanner(true)}
              onHistory={() => setShowHistory(true)}
              onGarden={() => setShowGarden(true)}
              onSearch={() => setShowSearch(true)}
              onProfile={() => setShowProfile(true)}
              darkMode={darkMode}
            />
            {/* Debug Version Tag */}
            <div style={{ position: 'fixed', bottom: 5, right: 10, fontSize: '9px', opacity: 0.3, color: darkMode ? 'white' : 'black', pointerEvents: 'none' }}>v1.0.9-debug</div>

            <AnimatePresence>
              {showScanner && (
                <Scanner
                  onClose={() => setShowScanner(false)}
                  onCapture={handleCapture}
                />
              )}

              {identifiedPlant && (
                <PlantDetail
                  plant={identifiedPlant}
                  onClose={() => setIdentifiedPlant(null)}
                  onSave={handleSaveToGarden}
                  isInGarden={!!garden.find(p => p.id === identifiedPlant.id)}
                  darkMode={darkMode}
                />
              )}

              {showHistory && (
                <HistoryView
                  history={history}
                  onClose={() => setShowHistory(false)}
                  onSelect={(item) => {
                    setIdentifiedPlant(item);
                    setShowHistory(false);
                  }}
                  darkMode={darkMode}
                />
              )}

              {showGarden && (
                <GardenView
                  garden={garden}
                  onClose={() => setShowGarden(false)}
                  onSelect={(item) => {
                    setIdentifiedPlant(item);
                    setShowGarden(false);
                  }}
                  darkMode={darkMode}
                />
              )}

              {showSearch && (
                <SearchView
                  onClose={() => setShowSearch(false)}
                  onSelect={(item) => {
                    setIdentifiedPlant(item);
                    setShowSearch(false);
                  }}
                  darkMode={darkMode}
                />
              )}

              {showProfile && (
                <ProfileView
                  onClose={() => setShowProfile(false)}
                  gardenCount={garden.length}
                  historyCount={history.length}
                  onClearHistory={handleClearHistory}
                  onClearGarden={handleClearGarden}
                  darkMode={darkMode}
                  onToggleDarkMode={handleToggleDarkMode}
                />
              )}
            </AnimatePresence>

            {/* No Plant Found Toast */}
            <AnimatePresence>
              {noPlantFound && (
                <motion.div
                  key="error-toast"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  style={{
                    position: 'fixed', bottom: '100px', left: '20px', right: '20px',
                    background: errorState === 'QUOTA_EXCEEDED' ? '#FFD700' : (errorState === 'NO_PLANT_DETECTED' ? '#333' : '#FF5252'),
                    color: errorState === 'QUOTA_EXCEEDED' ? '#5D4037' : 'white',
                    padding: '16px 24px',
                    borderRadius: '20px', textAlign: 'center', zIndex: 9999,
                    fontSize: '15px', fontWeight: '700',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
                    border: errorState === 'QUOTA_EXCEEDED' ? '2px solid #FFA000' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {getToastMessage()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
