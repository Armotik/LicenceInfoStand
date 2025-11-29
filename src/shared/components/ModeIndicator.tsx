import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, IDLE_EFFECTS, UNIVERSES } from '../../stores/appStore';
import clsx from 'clsx';

// ============================================
// Labels des modes
// ============================================

const MODE_LABELS = {
  idle: 'Mode Veille',
  presenter: 'Mode Présentation',
  demo: 'Démonstration',
};

const EFFECT_LABELS: Record<string, string> = {
  matrix: 'Matrix Rain',
  boids: 'Simulation Boids',
  neural: 'Réseau Neural',
  globe: 'Globe Connecté',
};

const UNIVERSE_LABELS: Record<string, string> = {
  formation: 'Formation',
  'vie-etudiante': 'Vie Étudiante',
  'la-rochelle': 'La Rochelle',
  'systeme-universitaire': 'Système Universitaire',
  demos: 'Démonstrations',
};

const DEMO_LABELS: Record<string, string> = {
  'body-tracking': 'Body Tracking',
  sorting: 'Tri Visuel',
  pathfinding: 'Pathfinding A*',
  mandelbrot: 'Fractales',
  boids: 'Simulation Boids',
  'game-of-life': 'Game of Life',
};

// ============================================
// Composant principal
// ============================================

export function ModeIndicator() {
  const { 
    mode, 
    currentIdleEffect, 
    currentUniverse, 
    currentDemo,
    idleEffectIndex,
  } = useAppStore();

  // Sous-label selon le mode
  const getSubLabel = () => {
    switch (mode) {
      case 'idle':
        return EFFECT_LABELS[currentIdleEffect] || currentIdleEffect;
      case 'presenter':
        return UNIVERSE_LABELS[currentUniverse] || currentUniverse;
      case 'demo':
        return currentDemo ? DEMO_LABELS[currentDemo] : '';
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-6 left-6 z-40"
    >
      <div className="bg-glass rounded-xl px-4 py-3 border border-primary-light/20">
        {/* Mode principal */}
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-2 h-2 rounded-full',
            mode === 'idle' && 'bg-green-400 animate-pulse',
            mode === 'presenter' && 'bg-blue-400',
            mode === 'demo' && 'bg-orange-400 animate-pulse',
          )} />
          <span className="text-sm font-medium text-text">
            {MODE_LABELS[mode]}
          </span>
        </div>

        {/* Sous-label */}
        <AnimatePresence mode="wait">
          <motion.div
            key={getSubLabel()}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="text-xs text-text-muted mt-1 ml-5"
          >
            {getSubLabel()}
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de navigation (mode veille) */}
        {mode === 'idle' && (
          <div className="flex gap-1.5 mt-2 ml-5">
            {IDLE_EFFECTS.map((_, index) => (
              <div
                key={index}
                className={clsx(
                  'nav-dot transition-all duration-300',
                  index === idleEffectIndex && 'active'
                )}
              />
            ))}
          </div>
        )}

        {/* Indicateurs de navigation (mode présentation) */}
        {mode === 'presenter' && (
          <div className="flex gap-1.5 mt-2 ml-5">
            {UNIVERSES.map((universe) => (
              <div
                key={universe}
                className={clsx(
                  'nav-dot transition-all duration-300',
                  universe === currentUniverse && 'active'
                )}
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// Hint de navigation (coin inférieur)
// ============================================

export function NavigationHint() {
  const { mode } = useAppStore();

  const hints = {
    idle: [
      { key: '← →', label: 'Effet' },
      { key: 'Espace', label: 'Présentation' },
    ],
    presenter: [
      { key: '← →', label: 'Univers' },
      { key: '↑ ↓', label: 'Section' },
      { key: '1-6', label: 'Démo' },
    ],
    demo: [
      { key: 'Esc', label: 'Quitter' },
    ],
  };

  const currentHints = hints[mode] || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <div className="flex gap-4">
        {currentHints.map((hint) => (
          <div
            key={hint.key}
            className="flex items-center gap-2 bg-glass rounded-lg px-3 py-2 border border-primary-light/20"
          >
            <kbd className="kbd">{hint.key}</kbd>
            <span className="text-xs text-text-muted">{hint.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-2 bg-glass rounded-lg px-3 py-2 border border-primary-light/20">
          <kbd className="kbd">H</kbd>
          <span className="text-xs text-text-muted">Aide</span>
        </div>
      </div>
    </motion.div>
  );
}
