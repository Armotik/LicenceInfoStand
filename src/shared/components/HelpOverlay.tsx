import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';

// ============================================
// Données des raccourcis
// ============================================

interface ShortcutGroup {
  title: string;
  shortcuts: { key: string; description: string }[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Navigation globale',
    shortcuts: [
      { key: 'Espace', description: 'Basculer veille ↔ présentation' },
      { key: 'Escape', description: 'Retour mode veille / Fermer' },
      { key: 'F', description: 'Plein écran' },
      { key: 'H', description: 'Afficher/masquer cette aide' },
    ],
  },
  {
    title: 'Mode Veille',
    shortcuts: [
      { key: '← →', description: 'Changer d\'effet visuel' },
      { key: 'I', description: 'Afficher/masquer titre & hints' },
    ],
  },
  {
    title: 'Mode Présentation',
    shortcuts: [
      { key: '← →', description: 'Changer d\'univers' },
      { key: '↑ ↓', description: 'Naviguer dans les sections' },
      { key: '1-6', description: 'Lancer une démo directement' },
    ],
  },
  {
    title: 'Démos directes',
    shortcuts: [
      { key: '1', description: 'Body Tracking (IA)' },
      { key: '2', description: 'Tri visuel (Algo)' },
      { key: '3', description: 'Pathfinding A* (Graphes)' },
      { key: '4', description: 'Fractales (Maths)' },
      { key: '5', description: 'Boids (POO)' },
      { key: '6', description: 'Game of Life' },
    ],
  },
];

// ============================================
// Composant
// ============================================

export function HelpOverlay() {
  const { showHelp, toggleHelp } = useAppStore();

  return (
    <AnimatePresence>
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={toggleHelp}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-surface/90 backdrop-blur-sm" />

          {/* Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, delay: 0.1 }}
            className="relative z-10 bg-surface-light rounded-2xl p-8 max-w-4xl w-full mx-4 border border-primary-light/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-display font-bold text-primary-light">
                Raccourcis clavier
              </h2>
              <button
                onClick={toggleHelp}
                className="p-2 rounded-lg bg-surface hover:bg-surface-lighter transition-colors"
              >
                <svg className="w-6 h-6 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Grid of shortcuts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {SHORTCUT_GROUPS.map((group) => (
                <div key={group.title} className="space-y-3">
                  <h3 className="text-lg font-semibold text-secondary-light">
                    {group.title}
                  </h3>
                  <div className="space-y-2">
                    {group.shortcuts.map((shortcut) => (
                      <div
                        key={shortcut.key}
                        className="flex items-center gap-3 text-sm"
                      >
                        <kbd className="kbd min-w-[60px] text-center">
                          {shortcut.key}
                        </kbd>
                        <span className="text-text-muted">
                          {shortcut.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer hint */}
            <div className="mt-8 pt-4 border-t border-primary-light/20 text-center">
              <p className="text-text-muted text-sm">
                Appuyez sur <kbd className="kbd mx-1">H</kbd> ou cliquez n'importe où pour fermer
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
