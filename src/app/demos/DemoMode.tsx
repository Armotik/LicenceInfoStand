import { motion } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import type { DemoType } from '../../types';
import clsx from 'clsx';
import { SortingVisualizer } from './components/SortingVisualizer';
import { MandelbrotVisualizer } from './components/MandelbrotVisualizer';

// ============================================
// Configuration des démos
// ============================================

interface DemoConfig {
  id: DemoType;
  title: string;
  description: string;
  competences: string[];
  ue: string;
  icon: string;
  color: string;
}

const DEMO_CONFIG: Record<DemoType, DemoConfig> = {
  'body-tracking': {
    id: 'body-tracking',
    title: 'Body Tracking',
    description: 'Détection du corps en temps réel avec MediaPipe',
    competences: ['Vision par ordinateur', 'Intelligence Artificielle', 'Traitement d\'image'],
    ue: 'Vision embarquée (L3)',
    icon: '🤖',
    color: 'text-red-400',
  },
  sorting: {
    id: 'sorting',
    title: 'Tri Visuel',
    description: 'Visualisation des algorithmes de tri',
    competences: ['Algorithmique', 'Complexité', 'Structures de données'],
    ue: 'Algorithmique & Structures (L2)',
    icon: '📊',
    color: 'text-blue-400',
  },
  pathfinding: {
    id: 'pathfinding',
    title: 'Pathfinding A*',
    description: 'Algorithme de recherche de chemin optimal',
    competences: ['Théorie des graphes', 'Heuristiques', 'Optimisation'],
    ue: 'Algorithmes de graphes (L3)',
    icon: '🗺️',
    color: 'text-green-400',
  },
  mandelbrot: {
    id: 'mandelbrot',
    title: 'Fractales Mandelbrot',
    description: 'Exploration de l\'ensemble de Mandelbrot',
    competences: ['Mathématiques', 'Calcul GPU', 'Nombres complexes'],
    ue: 'Mathématiques pour l\'informatique (L1-L2)',
    icon: '🌀',
    color: 'text-purple-400',
  },
  boids: {
    id: 'boids',
    title: 'Simulation Boids',
    description: 'Comportement d\'essaim émergent',
    competences: ['POO', 'Simulation', 'Systèmes multi-agents'],
    ue: 'POO avancée (L2)',
    icon: '🐦',
    color: 'text-yellow-400',
  },
  'game-of-life': {
    id: 'game-of-life',
    title: 'Game of Life',
    description: 'Automate cellulaire de Conway',
    competences: ['Automates', 'Programmation', 'Matrices'],
    ue: 'Introduction à la programmation (L1)',
    icon: '🧬',
    color: 'text-cyan-400',
  },
};

// ============================================
// Composant principal
// ============================================

export function DemoMode() {
  const { currentDemo, stopDemo } = useAppStore();

  if (!currentDemo) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-text-muted">Aucune démo sélectionnée</p>
      </div>
    );
  }

  const config = DEMO_CONFIG[currentDemo];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header de la démo */}
      <div className="bg-surface-light/50 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-4xl">{config.icon}</span>
          <div>
            <h1 className={clsx('text-2xl font-bold', config.color)}>
              {config.title}
            </h1>
            <p className="text-sm text-text-muted">{config.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Compétences */}
          <div className="hidden md:flex gap-2">
            {config.competences.map((comp) => (
              <span
                key={comp}
                className="px-2 py-1 bg-surface rounded text-xs text-text-muted"
              >
                {comp}
              </span>
            ))}
          </div>

          {/* Bouton fermer */}
          <button
            onClick={stopDemo}
            className="btn-secondary flex items-center gap-2"
          >
            <span>Fermer</span>
            <kbd className="kbd">Esc</kbd>
          </button>
        </div>
      </div>

      {/* Zone de la démo */}
      <div className="flex-1 overflow-hidden">
        <DemoRenderer demo={currentDemo} />
      </div>

      {/* Footer avec UE */}
      <div className="bg-surface-light/50 backdrop-blur-sm p-2 text-center">
        <p className="text-sm text-text-muted">
          Cette démo illustre les compétences enseignées en{' '}
          <span className={config.color}>{config.ue}</span>
        </p>
      </div>
    </div>
  );
}

// ============================================
// Renderer de démo
// ============================================

function DemoRenderer({ demo }: { demo: DemoType }) {
  switch (demo) {
    case 'body-tracking':
      return <BodyTrackingDemo />;
    case 'sorting':
      return <SortingDemo />;
    case 'pathfinding':
      return <PathfindingDemo />;
    case 'mandelbrot':
      return <MandelbrotDemo />;
    case 'boids':
      return <BoidsDemo />;
    case 'game-of-life':
      return <GameOfLifeDemo />;
    default:
      return <PlaceholderDemo name={demo} />;
  }
}

// ============================================
// Placeholder générique
// ============================================

function PlaceholderDemo({ name }: { name: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">🚧</div>
        <h2 className="text-3xl font-bold text-primary-light mb-2">
          Démo "{name}"
        </h2>
        <p className="text-text-muted text-lg">
          À implémenter en Phase 4
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// Placeholders individuels
// ============================================

function BodyTrackingDemo() {
  return <PlaceholderDemo name="Body Tracking" />;
}

function SortingDemo() {
  return <SortingVisualizer />;
}

function PathfindingDemo() {
  return <PlaceholderDemo name="Pathfinding A*" />;
}

function MandelbrotDemo() {
  return <MandelbrotVisualizer />;
}

function BoidsDemo() {
  return <PlaceholderDemo name="Simulation Boids" />;
}

function GameOfLifeDemo() {
  return <PlaceholderDemo name="Game of Life" />;
}

export default DemoMode;
