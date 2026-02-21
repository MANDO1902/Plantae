import { useState, useEffect } from 'react';
import { PlantaeCinematicLogo } from './components/Plantae/PlantaeCinematicLogo';
import { Dashboard } from './components/Dashboard';
import { Scanner } from './components/Scanner';
import { PlantDetail } from './components/PlantDetail';
import { identifyPlant } from './services/plantService';
import type { PlantData } from './services/plantService';
import { storageService } from './services/storageService';
import type { HistoryItem } from './services/storageService';
import { HistoryView } from './components/History';
import { GardenView } from './components/Garden';
import { SearchView } from './components/Search';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showGarden, setShowGarden] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [noPlantFound, setNoPlantFound] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [garden, setGarden] = useState<PlantData[]>([]);
  const [identifiedPlant, setIdentifiedPlant] = useState<PlantData | null>(null);

  useEffect(() => {
    setHistory(storageService.getHistory());
    setGarden(storageService.getGarden());
  }, []);

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

  const handleCapture = async (imageData: string) => {
    try {
      const result = await identifyPlant(imageData);
      setShowScanner(false);
      if (result === null) {
        setNoPlantFound(true);
        setTimeout(() => setNoPlantFound(false), 3000);
      } else {
        const updatedHistory = storageService.addToHistory(result);
        setHistory(updatedHistory);
        setIdentifiedPlant(result);
      }
    } catch (err) {
      console.error("Identification failed:", err);
      setShowScanner(false);
    }
  };

  useEffect(() => {
    // The logo animation timing:
    // write: 2.5s starting at 0.5s = 3.0s
    // fillIn: 2s starting at 1.0s = 3.0s
    // dropTail: 2.8s starting at 2.7s = 5.5s
    // fadeOut: 1s starting at 5.2s = 6.2s
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: 'white', overflow: 'hidden', position: 'relative' }}>
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            exit={{ y: '-100%', transition: { duration: 1, ease: [0.45, 0, 0.55, 1] } }}
            style={{ position: 'absolute', inset: 0, zIndex: 50, background: 'white' }}
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
            />

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
                />
              )}

              {showSearch && (
                <SearchView
                  onClose={() => setShowSearch(false)}
                  onSelect={(item) => {
                    setIdentifiedPlant(item);
                    setShowSearch(false);
                  }}
                />
              )}
            </AnimatePresence>

            {/* No Plant Found Toast */}
            <AnimatePresence>
              {noPlantFound && (
                <motion.div
                  key="no-plant-toast"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  style={{
                    position: 'fixed', bottom: '100px', left: '20px', right: '20px',
                    background: '#333', color: 'white', padding: '14px 20px',
                    borderRadius: '16px', textAlign: 'center', zIndex: 999,
                    fontSize: '15px', fontWeight: '600',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
                  }}
                >
                  🌿 No plant detected — try a clearer photo!
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
