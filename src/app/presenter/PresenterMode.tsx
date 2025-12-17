// ============================================
// PresenterMode - Mode Présentation avec les 5 univers
// ============================================

import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, UNIVERSES } from '../../stores/appStore';
import { FormationUniverse } from './universes/FormationUniverse';
import type { ThemeUniverse } from '../../types';
import clsx from 'clsx';

// ============================================
// Configuration des univers
// ============================================

interface UniverseConfig {
  id: ThemeUniverse;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
}

const UNIVERSE_CONFIG: Record<ThemeUniverse, UniverseConfig> = {
  formation: {
    id: 'formation',
    title: 'Formation',
    subtitle: 'Programme L1-L2-L3, CMI, compétences',
    icon: '🎓',
    color: '#3498DB',
  },
  'vie-etudiante': {
    id: 'vie-etudiante',
    title: 'Vie Étudiante',
    subtitle: 'CROUS, logement, santé, associations',
    icon: '🏠',
    color: '#27AE60',
  },
  'la-rochelle': {
    id: 'la-rochelle',
    title: 'La Rochelle',
    subtitle: 'Cadre de vie, climat, transports',
    icon: '🌊',
    color: '#00BCD4',
  },
  'systeme-universitaire': {
    id: 'systeme-universitaire',
    title: 'Système Universitaire',
    subtitle: 'ECTS, CM/TD/TP, évaluation',
    icon: '📚',
    color: '#9B59B6',
  },
  demos: {
    id: 'demos',
    title: 'Démonstrations',
    subtitle: 'Voir l\'informatique en action',
    icon: '🚀',
    color: '#E74C3C',
  },
};

// ============================================
// Composant Principal
// ============================================

export function PresenterMode() {
  const { currentUniverse, setUniverse } = useAppStore();
  const config = UNIVERSE_CONFIG[currentUniverse];

  return (
    <div className="w-full h-full flex flex-col bg-surface">
      {/* Navigation par onglets en haut */}
      <nav className="flex justify-center gap-2 p-4 bg-surface-light/50 backdrop-blur-sm border-b border-primary-light/10">
        {UNIVERSES.map((universe) => {
          const uConfig = UNIVERSE_CONFIG[universe];
          const isActive = universe === currentUniverse;

          return (
            <motion.button
              key={universe}
              onClick={() => setUniverse(universe)}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-all duration-300',
                'flex items-center gap-2',
                isActive
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-surface-light/50 text-text-muted hover:bg-surface-light hover:text-text'
              )}
              style={isActive ? { backgroundColor: uConfig.color } : {}}
              whileHover={{ scale: isActive ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="text-xl">{uConfig.icon}</span>
              <span className="hidden md:inline">{uConfig.title}</span>
            </motion.button>
          );
        })}
      </nav>

      {/* Contenu de l'univers */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUniverse}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <UniverseRenderer universe={currentUniverse} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// Renderer d'univers
// ============================================

function UniverseRenderer({ universe }: { universe: ThemeUniverse }) {
  switch (universe) {
    case 'formation':
      return <FormationUniverse />;
    case 'vie-etudiante':
      return <VieEtudiantePlaceholder />;
    case 'la-rochelle':
      return <LaRochellePlaceholder />;
    case 'systeme-universitaire':
      return <SystemeUniversitairePlaceholder />;
    case 'demos':
      return <DemosUniverse />;
    default:
      return <FormationUniverse />;
  }
}

// ============================================
// Placeholders pour les autres univers
// ============================================

function VieEtudiantePlaceholder() {
  return (
    <PlaceholderUniverse
      icon="🏠"
      title="Vie Étudiante"
      color="#27AE60"
      items={[
        { icon: '🍽️', title: 'Restauration CROUS', desc: 'Repas à 3,30€ (1€ boursiers)' },
        { icon: '🏠', title: 'Logement', desc: 'Résidences 150-350€/mois' },
        { icon: '🏥', title: 'Santé', desc: 'Consultations gratuites' },
        { icon: '🎉', title: 'Associations', desc: 'BDE, clubs, événements' },
      ]}
    />
  );
}

function LaRochellePlaceholder() {
  return (
    <PlaceholderUniverse
      icon="🌊"
      title="La Rochelle"
      color="#00BCD4"
      items={[
        { icon: '☀️', title: '2100h de soleil/an', desc: '1ère ville non-méditerranéenne' },
        { icon: '🚌', title: 'Transports 100€/an', desc: 'Les moins chers de France' },
        { icon: '🏠', title: 'Loyer ~570€', desc: 'vs 905€ à Paris' },
        { icon: '🎭', title: 'Culture', desc: 'Francofolies, Pass Culture gratuit' },
      ]}
    />
  );
}

function SystemeUniversitairePlaceholder() {
  return (
    <PlaceholderUniverse
      icon="📚"
      title="Système Universitaire"
      color="#9B59B6"
      items={[
        { icon: '📊', title: 'ECTS', desc: '30 crédits/semestre, 180 pour la Licence' },
        { icon: '👨‍🏫', title: 'CM', desc: 'Cours Magistral en amphi' },
        { icon: '👥', title: 'TD', desc: 'Travaux Dirigés (20-30 étudiants)' },
        { icon: '💻', title: 'TP', desc: 'Travaux Pratiques (10-15 étudiants)' },
      ]}
    />
  );
}

function DemosUniverse() {
  const { startDemo } = useAppStore();

  const demos = [
    { id: 'body-tracking', title: 'Body Tracking', icon: '🤖', desc: 'IA & Vision', key: '1' },
    { id: 'sorting', title: 'Tri Visuel', icon: '📊', desc: 'Algorithmique', key: '2' },
    { id: 'pathfinding', title: 'Pathfinding A*', icon: '🗺️', desc: 'Graphes', key: '3' },
    { id: 'mandelbrot', title: 'Fractales', icon: '🌀', desc: 'Maths & GPU', key: '4' },
    { id: 'boids', title: 'Boids', icon: '🐦', desc: 'POO & Émergence', key: '5' },
    { id: 'game-of-life', title: 'Game of Life', icon: '🧬', desc: 'Automates', key: '6' },
  ];

  return (
    <div className="w-full h-full p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-6xl block mb-4">🚀</span>
          <h2 className="text-4xl font-display font-bold text-orange-400 mb-2">
            Démonstrations
          </h2>
          <p className="text-xl text-text-muted">
            Voir l'informatique en action
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {demos.map((demo, index) => (
            <motion.button
              key={demo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => startDemo(demo.id as never)}
              className="bg-surface-light rounded-xl p-6 border border-primary-light/20 text-left group hover:border-orange-400/50 transition-all"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl">{demo.icon}</span>
                <kbd className="px-2 py-1 bg-surface rounded text-xs font-mono text-text-muted border border-primary-light/20">
                  {demo.key}
                </kbd>
              </div>
              <h3 className="text-xl font-bold text-orange-400 group-hover:text-orange-300 mb-1">
                {demo.title}
              </h3>
              <p className="text-text-muted text-sm">{demo.desc}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Placeholder générique
// ============================================

interface PlaceholderItem {
  icon: string;
  title: string;
  desc: string;
}

function PlaceholderUniverse({
  icon,
  title,
  color,
  items,
}: {
  icon: string;
  title: string;
  color: string;
  items: PlaceholderItem[];
}) {
  return (
    <div className="w-full h-full p-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <motion.span
            className="text-6xl block mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon}
          </motion.span>
          <h2 className="text-4xl font-display font-bold mb-2" style={{ color }}>
            {title}
          </h2>
          <p className="text-text-muted">
            Contenu détaillé à venir (Phase 3)
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-6 border border-primary-light/20 flex items-start gap-4"
            >
              <span className="text-4xl">{item.icon}</span>
              <div>
                <h3 className="text-xl font-bold mb-1" style={{ color }}>
                  {item.title}
                </h3>
                <p className="text-text-muted">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PresenterMode;
