import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, UNIVERSES } from '../../stores/appStore';
import type { ThemeUniverse } from '../../types';
import clsx from 'clsx';

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faGraduationCap,
    faHome,
    faWater,
    faBook,
    faRocket,
    faUsers,
    faCheckCircle,
    faMoneyBill,
    faChartLine
} from '@fortawesome/free-solid-svg-icons';

// ============================================
// Configuration des univers
// ============================================

interface UniverseConfig {
  id: ThemeUniverse;
  title: string;
  subtitle: string;
  icon: IconDefinition;
  color: string;
  gradient: string;
}

const UNIVERSE_CONFIG: Record<ThemeUniverse, UniverseConfig> = {
  formation: {
    id: 'formation',
    title: 'Formation',
    subtitle: 'Programme L1-L2-L3, CMI, compétences',
    icon: faGraduationCap,
    color: 'text-blue-400',
    gradient: 'from-blue-600/20 to-blue-900/20',
  },
  'vie-etudiante': {
    id: 'vie-etudiante',
    title: 'Vie Étudiante',
    subtitle: 'CROUS, logement, santé, associations',
    icon: faHome,
    color: 'text-green-400',
    gradient: 'from-green-600/20 to-green-900/20',
  },
  'la-rochelle': {
    id: 'la-rochelle',
    title: 'La Rochelle',
    subtitle: 'Cadre de vie, climat, transports',
    icon: faWater,
    color: 'text-cyan-400',
    gradient: 'from-cyan-600/20 to-cyan-900/20',
  },
  'systeme-universitaire': {
    id: 'systeme-universitaire',
    title: 'Système Universitaire',
    subtitle: 'ECTS, CM/TD/TP, évaluation',
    icon: faBook,
    color: 'text-purple-400',
    gradient: 'from-purple-600/20 to-purple-900/20',
  },
  demos: {
    id: 'demos',
    title: 'Démonstrations',
    subtitle: 'Voir l\'informatique en action',
    icon: faRocket,
    color: 'text-orange-400',
    gradient: 'from-orange-600/20 to-orange-900/20',
  },
};

// ============================================
// Composant principal
// ============================================

export function PresenterMode() {
  const { currentUniverse, setUniverse } = useAppStore();
  const config = UNIVERSE_CONFIG[currentUniverse];

  return (
    <div className={clsx(
      'w-full h-full flex flex-col',
      `bg-gradient-to-br ${config.gradient}`
    )}>
      {/* Navigation par onglets en haut */}
      <nav className="flex justify-center gap-2 p-4 bg-surface/50 backdrop-blur-sm">
        {UNIVERSES.map((universe) => {
          const uConfig = UNIVERSE_CONFIG[universe];
          const isActive = universe === currentUniverse;
          
          return (
            <button
              key={universe}
              onClick={() => setUniverse(universe)}
              className={clsx(
                'px-4 py-2 rounded-lg font-medium transition-all duration-300',
                'flex items-center gap-2',
                isActive 
                  ? 'bg-primary-light text-white shadow-lg scale-105' 
                  : 'bg-surface-light/50 text-text-muted hover:bg-surface-light hover:text-text'
              )}
            >
                <FontAwesomeIcon icon={uConfig.icon} />
              <span className="hidden md:inline">{uConfig.title}</span>
            </button>
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
            className="w-full h-full p-8"
          >
            <UniverseContent config={config} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// Contenu d'un univers
// ============================================

function UniverseContent({ config }: { config: UniverseConfig }) {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="text-6xl mb-4"
        >
            <FontAwesomeIcon icon={config.icon} className={config.color} />
        </motion.div>
        <h1 className={clsx('text-5xl font-display font-bold mb-2', config.color)}>
          {config.title}
        </h1>
        <p className="text-xl text-text-muted">
          {config.subtitle}
        </p>
      </div>

      {/* Contenu spécifique à l'univers */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <UniverseSpecificContent universe={config.id} />
      </div>
    </div>
  );
}

// ============================================
// Contenu spécifique par univers (placeholders)
// ============================================

function UniverseSpecificContent({ universe }: { universe: ThemeUniverse }) {
  switch (universe) {
    case 'formation':
      return <FormationContent />;
    case 'vie-etudiante':
      return <VieEtudianteContent />;
    case 'la-rochelle':
      return <LaRochelleContent />;
    case 'systeme-universitaire':
      return <SystemeUniversitaireContent />;
    case 'demos':
      return <DemosContent />;
    default:
      return null;
  }
}

// ============================================
// Placeholder Formation
// ============================================

function FormationContent() {
  const stats = [
    { label: 'Places', value: '125', icon: faUsers },
    { label: 'Taux d\'accès', value: '100%', icon: faCheckCircle },
    { label: 'Frais/an', value: '178€', icon: faMoneyBill },
    { label: 'Poursuite études', value: '77%', icon: faChartLine },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card text-center"
          >
            <div className="text-4xl mb-2 text-primary-light">
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="text-3xl font-bold text-primary-light">{stat.value}</div>
            <div className="text-sm text-text-muted">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Programme */}
      <div className="grid md:grid-cols-3 gap-6">
        {['L1', 'L2', 'L3'].map((year, index) => (
          <motion.div
            key={year}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-hover"
          >
            <h3 className="text-2xl font-bold text-primary-light mb-4">{year}</h3>
            <p className="text-text-muted">
              {year === 'L1' && 'Fondamentaux, programmation, algorithmique de base'}
              {year === 'L2' && 'BDD, réseaux, POO avancée, structures de données'}
              {year === 'L3' && 'IA, sécurité, IoT, développement mobile, stage'}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-text-muted mt-8">
        Contenu détaillé à implémenter en Phase 3
      </p>
    </div>
  );
}

// ============================================
// Placeholder Vie Étudiante
// ============================================

function VieEtudianteContent() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[
        { title: 'Logement', icon: '🏠', desc: 'Résidences CROUS : 150-350€/mois' },
        { title: 'Restauration', icon: '🍽️', desc: 'Repas CROUS : 3,30€ (1€ boursiers)' },
        { title: 'Santé', icon: '🏥', desc: 'Consultations gratuites, psychologues' },
        { title: 'Associations', icon: '🎉', desc: 'BDE, AGIR, clubs techniques' },
      ].map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="card-hover flex items-start gap-4"
        >
          <div className="text-4xl">{item.icon}</div>
          <div>
            <h3 className="text-xl font-bold text-green-400">{item.title}</h3>
            <p className="text-text-muted">{item.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================
// Placeholder La Rochelle
// ============================================

function LaRochelleContent() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-6xl mb-4">🌊☀️🚲</p>
        <h3 className="text-3xl font-bold text-cyan-400 mb-2">
          2ème ville étudiante moyenne de France
        </h3>
        <p className="text-xl text-text-muted">
          2100+ heures de soleil/an • 95% de recommandation
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: 'Transport/an', value: '100€', compare: 'vs 350€ Paris' },
          { label: 'Loyer studio', value: '~570€', compare: 'vs 905€ Paris' },
          { label: 'Pistes cyclables', value: '100km+', compare: 'Ville plate' },
        ].map((item) => (
          <div key={item.label} className="card text-center">
            <div className="text-3xl font-bold text-cyan-400">{item.value}</div>
            <div className="text-text">{item.label}</div>
            <div className="text-sm text-text-muted">{item.compare}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Placeholder Système Universitaire
// ============================================

function SystemeUniversitaireContent() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="text-xl font-bold text-purple-400 mb-2">CM</h3>
          <p className="text-sm text-text-muted">Cours Magistral</p>
          <p className="text-text mt-2">Amphi, 100-200 étudiants, prise de notes</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-purple-400 mb-2">TD</h3>
          <p className="text-sm text-text-muted">Travaux Dirigés</p>
          <p className="text-text mt-2">20-30 étudiants, exercices, obligatoire</p>
        </div>
        <div className="card">
          <h3 className="text-xl font-bold text-purple-400 mb-2">TP</h3>
          <p className="text-sm text-text-muted">Travaux Pratiques</p>
          <p className="text-text mt-2">10-15 étudiants, pratique machine, obligatoire</p>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-bold text-purple-400 mb-4">ECTS - Crédits Européens</h3>
        <div className="flex justify-around text-center">
          <div>
            <div className="text-4xl font-bold text-primary-light">30</div>
            <div className="text-text-muted">par semestre</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-light">60</div>
            <div className="text-text-muted">par année</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-light">180</div>
            <div className="text-text-muted">pour la Licence</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// Placeholder Démos
// ============================================

function DemosContent() {
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
    <div className="grid md:grid-cols-3 gap-6">
      {demos.map((demo, index) => (
        <motion.button
          key={demo.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          onClick={() => startDemo(demo.id as any)}
          className="card-hover text-left group"
        >
          <div className="flex items-start justify-between">
            <div className="text-5xl mb-4">{demo.icon}</div>
            <kbd className="kbd">{demo.key}</kbd>
          </div>
          <h3 className="text-xl font-bold text-orange-400 group-hover:text-orange-300">
            {demo.title}
          </h3>
          <p className="text-text-muted">{demo.desc}</p>
        </motion.button>
      ))}
    </div>
  );
}

export default PresenterMode;
