// ============================================
// FormationUniverse - Univers Formation complet
// Licence Informatique - La Rochelle Université
// Données officielles : https://formations.univ-larochelle.fr/licence-informatique
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StatCard,
  SectionTitle,
  TabButton,
  CompetenceChip,
  MetierCard,
  PoursuiteCard,
  ProgressBar,
  Badge,
  staggerContainer,
  fadeInUp,
} from '../components/UIComponents';
import {
  FORMATION_STATS,
  PROGRAM_BY_YEAR,
  CMI_INFO,
  LABORATOIRE_L3I,
  LABORATOIRE_MIA,
  INSTITUT_LUDI,
  EU_CONEXUS,
  POURSUITES,
  METIERS,
  FORMATION_SECTIONS,
  RESPONSABLE,
  type FormationSection,
  type YearProgram,
  type UEBlock,
  type UEModule,
} from '../../content/formationData';

// ============================================
// Composant Principal
// ============================================

export function FormationUniverse() {
  const [activeSection, setActiveSection] = useState<FormationSection>('overview');
  const [selectedYear, setSelectedYear] = useState<'L1' | 'L2' | 'L3'>('L1');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Navigation des sections */}
      <nav className="flex justify-center gap-2 p-4 bg-surface/50 backdrop-blur-sm border-b border-primary-light/10">
        {FORMATION_SECTIONS.map((section) => (
          <TabButton
            key={section.id}
            label={section.title}
            icon={section.icon}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            color="#3498DB"
          />
        ))}
      </nav>

      {/* Contenu de la section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="p-6 md:p-8 max-w-7xl mx-auto"
          >
            {activeSection === 'overview' && <OverviewSection />}
            {activeSection === 'programme' && (
              <ProgrammeSection
                selectedYear={selectedYear}
                onYearChange={(year) => {
                  setSelectedYear(year);
                  setSelectedSemester(year === 'L1' ? 1 : year === 'L2' ? 3 : 5);
                }}
                selectedSemester={selectedSemester}
                onSemesterChange={setSelectedSemester}
              />
            )}
            {activeSection === 'cmi' && <CMISection />}
            {activeSection === 'poursuites' && <PoursuitesSection />}
            {activeSection === 'metiers' && <MetiersSection />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================
// Section: Vue d'ensemble
// ============================================

function OverviewSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="🎓"
        title="Licence Informatique"
        subtitle="3 ans pour devenir un professionnel du numérique"
        color="#3498DB"
      />

      {/* Stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {FORMATION_STATS.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Présentation rapide des 3 années */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {PROGRAM_BY_YEAR.map((year, index) => (
          <YearOverviewCard key={year.year} year={year} index={index} />
        ))}
      </div>

      {/* Mot du responsable */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={3}
        className="bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl p-6 border border-primary-light/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-light/30 flex items-center justify-center text-3xl flex-shrink-0">
            👨‍🏫
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-light mb-1">
              Mot du responsable — {RESPONSABLE.name}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed italic">
              "{RESPONSABLE.message.split('\n')[0]}"
            </p>
          </div>
        </div>
      </motion.div>

      {/* Points forts */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={4}
        className="bg-surface-light rounded-2xl p-6 border border-primary-light/20"
      >
        <h3 className="text-xl font-bold text-primary-light mb-4 flex items-center gap-2">
          <span>✨</span> Points forts de la formation
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {[
            '🎯 Formation généraliste ouvrant de nombreuses portes',
            '💼 Stage obligatoire au S6 (40% en labo L3i)',
            '🔬 Accès privilégié aux laboratoires L3i et MIA',
            '🌍 Réseau EU-CONEXUS (9 universités européennes)',
            '📱 Enseignements actualisés (IoT, Mobile, Sécurité)',
            '🌱 Projets transversaux développement durable',
          ].map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + 0.5 }}
              className="flex items-center gap-2 text-text"
            >
              <span>{point}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Carte aperçu d'une année
// ============================================

function YearOverviewCard({ year, index }: { year: YearProgram; index: number }) {
  const totalModules = year.semesters.reduce(
    (acc, sem) => acc + sem.ues.reduce((a, ue) => a + ue.modules.length, 0),
    0
  );

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="bg-surface-light rounded-2xl p-6 border-2 transition-all duration-300 hover:shadow-xl"
      style={{ borderColor: `${year.color}40` }}
      whileHover={{ y: -10, borderColor: year.color }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
          style={{ backgroundColor: year.color }}
        >
          {year.year}
        </div>
        <div>
          <h3 className="font-bold text-lg text-text">{year.title}</h3>
          <p className="text-sm text-text-muted">{year.subtitle}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-text-muted mb-4 line-clamp-3">
        {year.description}
      </p>

      {/* Compétences clés */}
      <div className="flex flex-wrap gap-2">
        {year.competences?.slice(0, 3).map((comp) => (
          <Badge key={comp.name} text={comp.name} icon={comp.icon} color={year.color} />
        ))}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-primary-light/10 flex justify-between items-center">
        <span className="text-xs text-text-muted">{totalModules} modules • 2 semestres</span>
        <span className="font-bold text-primary-light">60 ECTS</span>
      </div>
    </motion.div>
  );
}

// ============================================
// Section: Programme détaillé L1-L2-L3
// ============================================

function ProgrammeSection({
  selectedYear,
  onYearChange,
  selectedSemester,
  onSemesterChange,
}: {
  selectedYear: 'L1' | 'L2' | 'L3';
  onYearChange: (year: 'L1' | 'L2' | 'L3') => void;
  selectedSemester: number;
  onSemesterChange: (sem: number) => void;
}) {
  const yearData = PROGRAM_BY_YEAR.find((y) => y.year === selectedYear)!;
  const semesterData = yearData.semesters.find((s) => s.semester === selectedSemester);

  return (
    <div className="space-y-6">
      <SectionTitle
        icon="📚"
        title="Programme détaillé"
        subtitle="Découvrez le contenu de chaque semestre"
        color={yearData.color}
      />

      {/* Sélecteur d'année */}
      <div className="flex justify-center gap-4">
        {PROGRAM_BY_YEAR.map((year) => (
          <motion.button
            key={String(year.year)}
            onClick={() => onYearChange(year.year as 'L1' | 'L2' | 'L3')}
            className={`px-6 py-3 rounded-xl font-bold text-lg transition-all duration-300 ${
              selectedYear === year.year
                ? 'text-white shadow-lg scale-110'
                : 'bg-surface-light text-text-muted hover:bg-surface-lighter'
            }`}
            style={
              selectedYear === year.year
                ? { backgroundColor: year.color }
                : {}
            }
            whileHover={{ scale: selectedYear === year.year ? 1.1 : 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {year.year}
          </motion.button>
        ))}
      </div>

      {/* Sélecteur de semestre */}
      <div className="flex justify-center gap-2">
        {yearData.semesters.map((sem) => (
          <motion.button
            key={sem.semester}
            onClick={() => onSemesterChange(sem.semester)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedSemester === sem.semester
                ? 'bg-primary-light text-white'
                : 'bg-surface-lighter text-text-muted hover:bg-surface-light'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            S{sem.semester}
          </motion.button>
        ))}
      </div>

      {/* Contenu du semestre */}
      <AnimatePresence mode="wait">
        {semesterData && (
          <motion.div
            key={selectedSemester}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Header semestre */}
            <div
              className="rounded-2xl p-4 border-l-4"
              style={{
                backgroundColor: `${yearData.color}10`,
                borderColor: yearData.color,
              }}
            >
              <h3 className="text-xl font-bold" style={{ color: yearData.color }}>
                {semesterData.title} — {yearData.title}
              </h3>
              <p className="text-text-muted text-sm">{yearData.subtitle}</p>
            </div>

            {/* UE Blocks */}
            <div className="space-y-6">
              {semesterData.ues.map((ueBlock, blockIdx) => (
                <UEBlockCard
                  key={ueBlock.blockName}
                  ueBlock={ueBlock}
                  color={yearData.color || '#3498DB'}
                  index={blockIdx}
                />
              ))}
            </div>

            {/* Compétences acquises */}
            <div className="bg-surface-light rounded-xl p-5 border border-primary-light/20">
              <h4 className="font-bold text-primary-light mb-3 flex items-center gap-2">
                <span>💪</span> Compétences acquises en {yearData.year}
              </h4>
              <div className="flex flex-wrap gap-2">
                {yearData.competences?.map((comp, idx) => (
                  <CompetenceChip key={comp.name} {...comp} description={comp.description || ''} index={idx} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Carte de bloc d'UE
// ============================================

function UEBlockCard({ ueBlock, color, index }: { ueBlock: UEBlock; color: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden"
    >
      {/* Header du bloc */}
      <div
        className="px-4 py-3 border-b border-primary-light/10"
        style={{ backgroundColor: `${color}15` }}
      >
        <h4 className="font-bold text-text">{ueBlock.blockName}</h4>
      </div>

      {/* Modules */}
      <div className="p-4 space-y-3">
        {ueBlock.modules.map((module, idx) => (
          <ModuleRow key={module.code} module={module} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

// ============================================
// Ligne de module/UE
// ============================================

function ModuleRow({ module, index }: { module: UEModule; index: number }) {
  const isRequired = module.type === 'obligatoire';

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-3 rounded-lg border transition-all duration-300 ${
        isRequired
          ? 'bg-surface border-primary-light/20 hover:border-primary-light/40'
          : 'bg-surface/50 border-text-muted/10 hover:border-text-muted/30'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-mono text-primary-light bg-primary-light/10 px-2 py-0.5 rounded">
              {module.code}
            </span>
            {!isRequired && (
              <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">
                optionnel
              </span>
            )}
            {module.hours && (
              <span className="text-xs text-text-muted">
                {module.hours}
              </span>
            )}
          </div>
          <h5 className="font-medium text-text text-sm">{module.name}</h5>
          {module.description && (
            <p className="text-xs text-text-muted mt-1">{module.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 text-primary-light flex-shrink-0">
          <span className="text-lg font-bold">{module.ects}</span>
          <span className="text-xs">ECTS</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Section: CMI & Recherche - Écosystème complet
// ============================================

type CMISubSection = 'ludi' | 'l3i' | 'mia' | 'cmi' | 'euconexus';

const CMI_SUB_SECTIONS = [
  { id: 'ludi' as CMISubSection, title: 'Institut LUDI', icon: '🌊' },
  { id: 'l3i' as CMISubSection, title: 'Laboratoire L3i', icon: '🔬' },
  { id: 'mia' as CMISubSection, title: 'Laboratoire MIA', icon: '📐' },
  { id: 'cmi' as CMISubSection, title: 'CMI', icon: '🎖️' },
  { id: 'euconexus' as CMISubSection, title: 'EU-CONEXUS', icon: '🌍' },
];

function CMISection() {
  const [activeSubSection, setActiveSubSection] = useState<CMISubSection>('ludi');

  return (
    <div className="space-y-6">
      <SectionTitle
        icon="🔬"
        title="Écosystème Recherche-Formation"
        subtitle="Une formation adossée à une recherche de pointe"
        color="#9B59B6"
      />

      {/* Navigation sous-sections */}
      <div className="flex flex-wrap justify-center gap-2 p-3 bg-surface/50 backdrop-blur-sm rounded-xl border border-purple-500/20">
        {CMI_SUB_SECTIONS.map((section) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveSubSection(section.id)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeSubSection === section.id
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-surface-lighter text-text-muted hover:bg-surface-light hover:text-text'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>{section.icon}</span>
            <span>{section.title}</span>
          </motion.button>
        ))}
      </div>

      {/* Contenu dynamique */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeSubSection === 'ludi' && <LUDISubSection />}
          {activeSubSection === 'l3i' && <L3iSubSection />}
          {activeSubSection === 'mia' && <MIASubSection />}
          {activeSubSection === 'cmi' && <CMISubSection />}
          {activeSubSection === 'euconexus' && <EUConexusSubSection />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Sous-section: Institut LUDI
// ============================================

function LUDISubSection() {
  return (
    <div className="space-y-6">
      {/* Header LUDI */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 rounded-2xl p-6 border border-cyan-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🌊</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-cyan-400">{INSTITUT_LUDI.nom}</h3>
            <p className="text-cyan-300/70 text-sm mt-1">{INSTITUT_LUDI.description}</p>
          </div>
        </div>
      </motion.div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-primary-light mb-3 flex items-center gap-2">
          <span>🎯</span> Vision Stratégique
        </h4>
        <p className="text-text-muted text-sm leading-relaxed">{INSTITUT_LUDI.vision}</p>
      </motion.div>

      {/* Genèse */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-cyan-400 mb-3 flex items-center gap-2">
          <span>📜</span> {INSTITUT_LUDI.genese.titre}
        </h4>
        <div className="space-y-3 text-sm text-text-muted">
          <p><strong className="text-text">Contexte :</strong> {INSTITUT_LUDI.genese.contexte}</p>
          <p><strong className="text-text">Approche :</strong> {INSTITUT_LUDI.genese.approche}</p>
          <p><strong className="text-text">Impact :</strong> {INSTITUT_LUDI.genese.impact}</p>
        </div>
      </motion.div>

      {/* Continuum Formation-Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-5 border border-purple-500/20"
      >
        <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
          <span>🔄</span> {INSTITUT_LUDI.continuum.titre}
        </h4>
        <p className="text-text-muted text-sm mb-4">{INSTITUT_LUDI.continuum.philosophie}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {INSTITUT_LUDI.continuum.manifestations.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + 0.4 }}
              className="flex items-start gap-2 text-sm text-text bg-surface/50 p-3 rounded-lg"
            >
              <span className="text-purple-400 flex-shrink-0">▸</span>
              <span>{item}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Points forts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-text mb-4 flex items-center gap-2">
          <span>✨</span> Points Forts
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INSTITUT_LUDI.pointsForts.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.5 }}
              className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-primary-light/10"
            >
              <span className="text-2xl">{point.icon}</span>
              <span className="text-sm text-text">{point.texte}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Sous-section: Laboratoire L3i
// ============================================

function L3iSubSection() {
  return (
    <div className="space-y-6">
      {/* Header L3i */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/30"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">🔬</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-blue-400">{LABORATOIRE_L3I.nom}</h3>
            <p className="text-blue-300/70">{LABORATOIRE_L3I.nomComplet}</p>
            <p className="text-text-muted text-sm mt-1">{LABORATOIRE_L3I.statut} • Fondé en {LABORATOIRE_L3I.fondation}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{LABORATOIRE_L3I.effectif.total}+</div>
              <div className="text-xs text-text-muted">Membres</div>
            </div>
            <div className="text-center p-3 bg-blue-500/10 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{LABORATOIRE_L3I.effectif.permanents}</div>
              <div className="text-xs text-text-muted">Permanents</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Identité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-primary-light mb-3 flex items-center gap-2">
          <span>🏛️</span> Identité et Structure
        </h4>
        <div className="space-y-2 text-sm text-text-muted">
          <p>{LABORATOIRE_L3I.identite.historique}</p>
          <p><strong className="text-text">Structure :</strong> {LABORATOIRE_L3I.identite.structure}</p>
          <p><strong className="text-text">Gouvernance :</strong> {LABORATOIRE_L3I.identite.gouvernance}</p>
        </div>
      </motion.div>

      {/* Axes de recherche */}
      <div className="space-y-4">
        <h4 className="font-bold text-xl text-text flex items-center gap-2">
          <span>🎯</span> Axes Stratégiques de Recherche
        </h4>
        {LABORATOIRE_L3I.axes.map((axe, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 + 0.2 }}
            className="bg-surface-light rounded-xl p-5 border border-blue-500/20"
          >
            <h5 className="font-bold text-blue-400 mb-2">{axe.nom}</h5>
            {'expertise' in axe && <p className="text-sm text-text-muted mb-3">{axe.expertise}</p>}
            {'enjeu' in axe && <p className="text-sm text-text mb-3"><strong>Enjeu :</strong> {axe.enjeu}</p>}
            
            {/* Projets */}
            {axe.projets && axe.projets.length > 0 && (
              <div className="space-y-3 mt-4">
                <h6 className="text-sm font-semibold text-text">Projets phares :</h6>
                {axe.projets.map((projet, pIdx) => (
                  <div key={pIdx} className="bg-surface/50 rounded-lg p-3 border border-primary-light/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded">{projet.nom}</span>
                      {'periode' in projet && <span className="text-xs text-text-muted">{projet.periode}</span>}
                    </div>
                    <p className="text-sm text-text-muted">{'description' in projet ? projet.description : 'objectif' in projet ? projet.objectif : ''}</p>
                    {'technologies' in projet && projet.technologies && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {projet.technologies.map((tech: string, tIdx: number) => (
                          <span key={tIdx} className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-xs rounded">{tech}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Réalisations pour Humanités Numériques */}
            {'realisations' in axe && axe.realisations && (
              <div className="mt-3">
                <h6 className="text-sm font-semibold text-text mb-2">Réalisations :</h6>
                <div className="grid md:grid-cols-2 gap-2">
                  {axe.realisations.map((real: string, rIdx: number) => (
                    <div key={rIdx} className="flex items-center gap-2 text-sm text-text-muted">
                      <span className="text-blue-400">•</span>
                      <span>{real}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Symbiose avec la Licence */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl p-5 border border-blue-500/20"
      >
        <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
          <span>🔗</span> {LABORATOIRE_L3I.integration.titre}
        </h4>
        <p className="text-text-muted text-sm mb-4">{LABORATOIRE_L3I.integration.principe}</p>
        <div className="grid md:grid-cols-2 gap-3">
          {LABORATOIRE_L3I.integration.exemples.map((ex, idx) => (
            <div key={idx} className="bg-surface/50 p-3 rounded-lg">
              <div className="font-medium text-text text-sm">{ex.module}</div>
              <div className="text-xs text-text-muted mt-1">{ex.lien}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-cyan-400 mt-4 italic">💡 {LABORATOIRE_L3I.integration.veille}</p>
      </motion.div>
    </div>
  );
}

// ============================================
// Sous-section: Laboratoire MIA
// ============================================

function MIASubSection() {
  return (
    <div className="space-y-6">
      {/* Header MIA */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-900/30 to-teal-900/20 rounded-2xl p-6 border border-green-500/30"
      >
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
            <span className="text-4xl">📐</span>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-green-400">{LABORATOIRE_MIA.nom}</h3>
            <p className="text-green-300/70">{LABORATOIRE_MIA.nomComplet}</p>
            <p className="text-text-muted text-sm mt-1">{LABORATOIRE_MIA.statut}</p>
          </div>
        </div>
      </motion.div>

      {/* Identité */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
          <span>🧠</span> L'Alliance des Mathématiques et du Numérique
        </h4>
        <div className="space-y-3 text-sm text-text-muted">
          <p>{LABORATOIRE_MIA.identite.approche}</p>
          <p><strong className="text-text">Pluridisciplinarité :</strong> {LABORATOIRE_MIA.identite.pluridisciplinarite}</p>
          <p><strong className="text-text">Conviction :</strong> {LABORATOIRE_MIA.identite.conviction}</p>
          <p className="italic text-green-400/70">{LABORATOIRE_MIA.identite.environnement}</p>
        </div>
      </motion.div>

      {/* Chercheurs clés */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-text mb-3 flex items-center gap-2">
          <span>👨‍🔬</span> Chercheurs Clés
        </h4>
        <div className="grid md:grid-cols-3 gap-3">
          {LABORATOIRE_MIA.chercheurs.map((chercheur, idx) => (
            <div key={idx} className="bg-surface p-3 rounded-lg border border-green-500/10">
              <div className="font-medium text-text">{chercheur.nom}</div>
              <div className="text-xs text-text-muted">{chercheur.specialite}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Axes de recherche */}
      <div className="space-y-4">
        <h4 className="font-bold text-xl text-text flex items-center gap-2">
          <span>🎯</span> Domaines d'Expertise
        </h4>
        {LABORATOIRE_MIA.axes.map((axe, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 + 0.3 }}
            className="bg-surface-light rounded-xl p-5 border border-green-500/20"
          >
            <h5 className="font-bold text-green-400 mb-2">{axe.domaine}</h5>
            <p className="text-sm text-text-muted mb-3">{axe.approche || axe.role}</p>
            
            {/* Innovations */}
            {'innovations' in axe && axe.innovations && (
              <div className="space-y-3">
                {axe.innovations.map((innov, iIdx) => (
                  <div key={iIdx} className="bg-surface/50 rounded-lg p-3 border border-primary-light/10">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-bold rounded">{innov.nom}</span>
                      {'these' in innov && <span className="text-xs text-text-muted">Thèse: {innov.these}</span>}
                    </div>
                    <p className="text-sm text-text-muted">{innov.description || innov.innovation}</p>
                    {'applications' in innov && innov.applications && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {innov.applications.map((app: string, aIdx: number) => (
                          <span key={aIdx} className="px-2 py-0.5 bg-teal-500/10 text-teal-400 text-xs rounded">{app}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Travaux */}
            {'travaux' in axe && axe.travaux && (
              <div className="space-y-3 mt-3">
                {axe.travaux.map((travail, tIdx) => (
                  <div key={tIdx} className="bg-surface/50 rounded-lg p-3 border border-primary-light/10">
                    <div className="font-medium text-text text-sm mb-1">{travail.sujet}</div>
                    <p className="text-xs text-text-muted">{travail.importance || travail.contexte}</p>
                    {'statut' in travail && <p className="text-xs text-green-400 mt-1">⭐ {travail.statut}</p>}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Valeur ajoutée */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-green-900/20 to-teal-900/20 rounded-xl p-5 border border-green-500/20"
      >
        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
          <span>💎</span> {LABORATOIRE_MIA.valeurAjoutee.titre}
        </h4>
        <div className="space-y-2 text-sm text-text-muted">
          <p>{LABORATOIRE_MIA.valeurAjoutee.justification}</p>
          <p className="text-text">{LABORATOIRE_MIA.valeurAjoutee.comprehension}</p>
          <p>{LABORATOIRE_MIA.valeurAjoutee.concepts}</p>
          <p className="text-green-400 font-medium mt-3">🎯 {LABORATOIRE_MIA.valeurAjoutee.marche}</p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Sous-section: CMI
// ============================================

function CMISubSection() {
  return (
    <div className="space-y-6">
      {/* Header CMI */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🎖️</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-purple-400">{CMI_INFO.title}</h3>
              <p className="text-purple-300/70">{CMI_INFO.subtitle}</p>
              <p className="text-text-muted text-sm mt-2">{CMI_INFO.description}</p>
            </div>
          </div>
        </div>

        {/* Stats CMI */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {CMI_INFO.stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="text-center p-3 bg-purple-500/10 rounded-lg"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-purple-400">{stat.value}</div>
              <div className="text-xs text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Formation Sélective */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
          <span>📋</span> {CMI_INFO.exigence.titre}
        </h4>
        <p className="text-text-muted text-sm mb-4">{CMI_INFO.exigence.volume}</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h5 className="font-medium text-text mb-2">Composantes supplémentaires :</h5>
            <ul className="space-y-1">
              {CMI_INFO.exigence.composantes.map((comp, idx) => (
                <li key={idx} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-purple-400">▸</span>
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="font-medium text-text mb-2">Diplômes obtenus :</h5>
            <ul className="space-y-1">
              {CMI_INFO.exigence.diplomes.map((dipl, idx) => (
                <li key={idx} className="text-sm text-text-muted flex items-start gap-2">
                  <span className="text-purple-400">✓</span>
                  <span>{dipl}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Immersion Recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-xl p-5 border border-purple-500/20"
      >
        <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
          <span>🔬</span> {CMI_INFO.immersionRecherche.titre}
        </h4>
        <p className="text-text-muted text-sm mb-4">{CMI_INFO.immersionRecherche.philosophie}</p>
        <p className="text-purple-300 text-sm italic mb-4">"{CMI_INFO.immersionRecherche.statut}"</p>
        <div className="space-y-3">
          {CMI_INFO.immersionRecherche.dispositifs.map((disp, idx) => (
            <div key={idx} className="bg-surface/50 p-4 rounded-lg border border-primary-light/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded">{disp.niveau}</span>
                <span className="font-medium text-text">{disp.activite}</span>
              </div>
              <p className="text-sm text-text-muted">{disp.description || disp.immersion || disp.nature}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Innovation Pédagogique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
          <span>💡</span> {CMI_INFO.innovation.titre}
        </h4>
        <p className="text-text-muted text-sm mb-3">
          Réseau <strong className="text-text">{CMI_INFO.innovation.reseau}</strong> — {CMI_INFO.innovation.mutualisation}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {CMI_INFO.innovation.partenaires.map((univ, idx) => (
            <span key={idx} className="px-3 py-1 bg-purple-500/10 text-purple-300 text-sm rounded-full">{univ}</span>
          ))}
        </div>
        <h5 className="font-medium text-text mb-2">Exemples de projets étudiants :</h5>
        <div className="space-y-2">
          {CMI_INFO.innovation.exemples.map((ex, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-text-muted">
              <span className="text-purple-400">🌱</span>
              <span>{ex}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Conditions d'obtention */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-text mb-3 flex items-center gap-2">
          <span>🎓</span> Conditions d'obtention du Label CMI
        </h4>
        <div className="grid md:grid-cols-2 gap-2">
          {CMI_INFO.conditionsObtention.map((cond, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-text-muted">
              <span className="text-purple-400">✓</span>
              <span>{cond}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Highlights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-5 border border-purple-500/20"
      >
        <h4 className="font-bold text-text mb-4 flex items-center gap-2">
          <span>✨</span> Points Forts du CMI
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
          {CMI_INFO.highlights.map((highlight, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 + 0.6 }}
              className="flex items-center gap-2 text-sm text-text bg-surface/50 p-2 rounded-lg"
            >
              <span className="text-purple-400">▸</span>
              {highlight}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Sous-section: EU-CONEXUS
// ============================================

function EUConexusSubSection() {
  return (
    <div className="space-y-6">
      {/* Header EU-CONEXUS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/30 to-blue-900/20 rounded-2xl p-6 border border-indigo-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl">🌍</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-indigo-400">{EU_CONEXUS.nom}</h3>
            <p className="text-indigo-300/70 text-sm">{EU_CONEXUS.nomComplet}</p>
            <p className="text-text-muted text-sm mt-1">{EU_CONEXUS.role}</p>
          </div>
        </div>
      </motion.div>

      {/* Vision */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
          <span>🎯</span> {EU_CONEXUS.vision.titre}
        </h4>
        <div className="space-y-2 text-sm text-text-muted">
          <p>{EU_CONEXUS.vision.campus}</p>
          <p className="text-text">{EU_CONEXUS.vision.portee}</p>
          <p>{EU_CONEXUS.vision.recherche}</p>
        </div>
      </motion.div>

      {/* Universités partenaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
      >
        <h4 className="font-bold text-text mb-4 flex items-center gap-2">
          <span>🏛️</span> Universités Partenaires
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {EU_CONEXUS.universites.map((univ, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
              className="bg-surface p-3 rounded-lg border border-indigo-500/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🇪🇺</span>
                <span className="font-medium text-text text-sm">{univ.nom}</span>
              </div>
              <div className="text-xs text-text-muted">{univ.pays}</div>
              {'specialite' in univ && <div className="text-xs text-indigo-400 mt-1">{univ.specialite}</div>}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Opportunités */}
      <div className="space-y-4">
        <h4 className="font-bold text-xl text-text flex items-center gap-2">
          <span>🚀</span> Opportunités de Formation et Mobilité
        </h4>
        {EU_CONEXUS.opportunites.map((opp, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 + 0.4 }}
            className="bg-surface-light rounded-xl p-5 border border-indigo-500/20"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{'icon' in opp ? opp.icon : '📚'}</span>
              <h5 className="font-bold text-indigo-400">{opp.type}</h5>
            </div>
            <p className="text-sm text-text-muted mb-3">{opp.description}</p>
            
            {'exemples' in opp && opp.exemples && (
              <div className="space-y-2">
                {opp.exemples.map((ex, eIdx) => (
                  <div key={eIdx} className="bg-surface/50 p-3 rounded-lg">
                    <div className="font-medium text-text text-sm">{ex.nom}</div>
                    <div className="text-xs text-text-muted">{ex.possibilite}</div>
                  </div>
                ))}
              </div>
            )}
            
            {'domaines' in opp && opp.domaines && (
              <div className="flex flex-wrap gap-2 mt-2">
                {opp.domaines.map((dom: string, dIdx: number) => (
                  <span key={dIdx} className="px-2 py-1 bg-indigo-500/10 text-indigo-300 text-xs rounded">{dom}</span>
                ))}
              </div>
            )}
            
            {'valeur' in opp && <p className="text-sm text-indigo-400 mt-3">✨ {opp.valeur}</p>}
            {'importance' in opp && <p className="text-sm text-text-muted italic mt-2">{opp.importance}</p>}
            {'benefice' in opp && <p className="text-sm text-indigo-400 mt-2">🎯 {opp.benefice}</p>}
          </motion.div>
        ))}
      </div>

      {/* Bénéfice pour la formation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gradient-to-r from-indigo-900/20 to-blue-900/20 rounded-xl p-5 border border-indigo-500/20"
      >
        <h4 className="font-bold text-indigo-400 mb-3 flex items-center gap-2">
          <span>💎</span> {EU_CONEXUS.beneficeFormation.titre}
        </h4>
        <p className="text-text-muted text-sm mb-4">{EU_CONEXUS.beneficeFormation.description}</p>
        <div className="grid md:grid-cols-2 gap-2">
          {EU_CONEXUS.beneficeFormation.points.map((point, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-text">
              <span className="text-indigo-400">✓</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Poursuites d'études
// ============================================

function PoursuitesSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🚀"
        title="Poursuites d'études"
        subtitle="Que faire après la Licence ?"
        color="#27AE60"
      />

      {/* Graphique de répartition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-surface-light rounded-2xl p-6 border border-primary-light/20"
      >
        <h4 className="font-bold text-text mb-4">Répartition des diplômés</h4>
        <div className="space-y-3">
          {POURSUITES.map((p, idx) => (
            <ProgressBar
              key={p.title}
              value={p.percentage || 0}
              label={`${p.icon} ${p.title}`}
              color={idx === 0 ? '#3498DB' : idx === 1 ? '#9B59B6' : '#27AE60'}
            />
          ))}
        </div>
      </motion.div>

      {/* Cards poursuites */}
      <div className="grid md:grid-cols-3 gap-6">
        {POURSUITES.map((poursuite, index) => (
          <PoursuiteCard key={poursuite.title} {...poursuite} type={poursuite.type} index={index} />
        ))}
      </div>

      {/* Masters disponibles */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/20"
      >
        <h4 className="font-bold text-xl text-primary-light mb-4 flex items-center gap-2">
          <span>🎓</span> Masters accessibles
        </h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Architecte Logiciel', icon: '🏗️' },
            { name: 'Ingénierie des Données', icon: '📊' },
            { name: 'Cybersécurité', icon: '🔒' },
            { name: 'Intelligence Artificielle', icon: '🤖' },
            { name: 'Réseaux & Systèmes', icon: '🌐' },
            { name: 'Développement Mobile', icon: '📱' },
          ].map((master, idx) => (
            <motion.div
              key={master.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 + 0.5 }}
              className="flex items-center gap-2 p-3 bg-surface-light/50 rounded-lg"
            >
              <span className="text-2xl">{master.icon}</span>
              <span className="text-sm text-text">{master.name}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Métiers et salaires
// ============================================

function MetiersSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="💼"
        title="Métiers & Salaires"
        subtitle="Les débouchés professionnels de la Licence Informatique"
        color="#F39C12"
      />

      {/* Stat salaire médian */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 rounded-2xl p-6 border border-green-500/30 text-center"
      >
        <p className="text-text-muted mb-2">Salaire médian 1 an après la Licence</p>
        <motion.div
          className="text-5xl font-bold text-green-400"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          1 790 €
        </motion.div>
        <p className="text-green-400/70">net / mois</p>
      </motion.div>

      {/* Grid métiers */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {METIERS.map((metier, index) => (
          <MetierCard key={metier.title} {...metier} salaire={metier.salaire} index={index} />
        ))}
      </div>

      {/* Note */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-sm text-text-muted"
      >
        💡 Les salaires indiqués sont des fourchettes pour des profils juniors (0-3 ans d'expérience) en France.
        <br />
        Ils évoluent significativement avec l'expérience et la spécialisation.
      </motion.p>
    </div>
  );
}

export default FormationUniverse;
