import { Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { 
  useKeyboardNavigation, 
  useIdleTimeout, 
  useFullscreenSync 
} from '../../shared/hooks';
import { 
  HelpOverlay, 
  ModeIndicator, 
  NavigationHint 
} from '../../shared/components';

// ============================================
// Lazy loading des modules
// ============================================

const IdleMode = lazy(() => import('../idle/IdleMode'));
const PresenterMode = lazy(() => import('../presenter/PresenterMode'));
const DemoMode = lazy(() => import('../demos/DemoMode'));

// ============================================
// Loading fallback
// ============================================

function LoadingFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-primary-light border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-text-muted">Chargement...</p>
      </motion.div>
    </div>
  );
}

// ============================================
// Variantes d'animation pour les transitions
// ============================================

const modeVariants = {
  initial: { 
    opacity: 0, 
    scale: 0.98,
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeIn" as const,
    },
  },
};

// ============================================
// Composant Shell
// ============================================

export function Shell() {
  const { mode } = useAppStore();

  // Activer les hooks globaux
  useKeyboardNavigation();
  useIdleTimeout(60000); // 1 minute
  useFullscreenSync();

  return (
    <div className="w-full h-full overflow-hidden bg-surface">
      {/* Contenu principal avec transitions */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          variants={modeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full h-full"
        >
          <Suspense fallback={<LoadingFallback />}>
            {mode === 'idle' && <IdleMode />}
            {mode === 'presenter' && <PresenterMode />}
            {mode === 'demo' && <DemoMode />}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* UI Overlays (toujours visibles) */}
      <ModeIndicator />
      <NavigationHint />
      <HelpOverlay />
      
      {/* Debug info (optionnel) */}
      <DebugOverlay />
    </div>
  );
}

// ============================================
// Debug Overlay (dev only)
// ============================================

function DebugOverlay() {
  const { showDebug, mode, currentIdleEffect, currentUniverse, currentDemo } = useAppStore();

  if (!showDebug) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-6 right-6 z-50 bg-black/80 rounded-lg p-4 font-mono text-xs text-green-400"
    >
      <div className="space-y-1">
        <div>Mode: <span className="text-yellow-400">{mode}</span></div>
        <div>Effect: <span className="text-blue-400">{currentIdleEffect}</span></div>
        <div>Universe: <span className="text-purple-400">{currentUniverse}</span></div>
        <div>Demo: <span className="text-orange-400">{currentDemo || 'none'}</span></div>
        <div>FPS: <span className="text-cyan-400" id="fps-counter">--</span></div>
      </div>
    </motion.div>
  );
}

export default Shell;
