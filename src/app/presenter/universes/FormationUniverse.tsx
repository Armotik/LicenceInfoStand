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
  POURSUITES,
  METIERS,
  FORMATION_SECTIONS,
  RESPONSABLE,
  type FormationSection,
  type YearProgram,
  type SemesterProgram,
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
        {year.competences.slice(0, 3).map((comp) => (
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
            key={year.year}
            onClick={() => onYearChange(year.year)}
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
                  color={yearData.color}
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
                {yearData.competences.map((comp, idx) => (
                  <CompetenceChip key={comp.name} {...comp} index={idx} />
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
// Section: CMI & Recherche
// ============================================

function CMISection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🔬"
        title="CMI & Recherche"
        subtitle="Formation d'excellence et immersion en laboratoire"
        color="#9B59B6"
      />

      {/* CMI Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-900/30 to-purple-600/10 rounded-2xl p-8 border border-purple-500/30"
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Infos CMI */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-xl bg-purple-500 flex items-center justify-center">
                <span className="text-3xl">🎖️</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-400">{CMI_INFO.title}</h3>
                <p className="text-purple-300/70">{CMI_INFO.subtitle}</p>
              </div>
            </div>
            <p className="text-text-muted mb-6">{CMI_INFO.description}</p>

            {/* Stats CMI */}
            <div className="grid grid-cols-4 gap-3 mb-6">
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

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-2">
              {CMI_INFO.highlights.map((highlight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 + 0.3 }}
                  className="flex items-center gap-2 text-sm text-text"
                >
                  <span className="text-purple-400">▸</span>
                  {highlight}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Laboratoires */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Laboratoire L3i */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-surface-light rounded-2xl p-6 border border-primary-light/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">🔬</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary-light mb-1">
                {CMI_INFO.laboratory.name}
              </h3>
              <p className="text-text-muted text-xs mb-3">
                {CMI_INFO.laboratory.fullName}
              </p>

              {/* Stats labo */}
              <div className="flex gap-4 mb-3">
                <div>
                  <div className="text-2xl font-bold text-secondary-light">
                    {CMI_INFO.laboratory.members}+
                  </div>
                  <div className="text-xs text-text-muted">Membres</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary-light">
                    {CMI_INFO.laboratory.researchers}
                  </div>
                  <div className="text-xs text-text-muted">Chercheurs</div>
                </div>
              </div>

              <p className="text-text-muted text-xs mb-3">
                {CMI_INFO.laboratory.description}
              </p>

              {/* Axes de recherche */}
              <div className="flex flex-wrap gap-1">
                {CMI_INFO.laboratory.axes.map((axe, idx) => (
                  <Badge key={idx} text={axe} color="#5DADE2" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Laboratoire MIA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-light rounded-2xl p-6 border border-primary-light/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
              <span className="text-3xl">📐</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-400 mb-1">
                {CMI_INFO.secondLab.name}
              </h3>
              <p className="text-text-muted text-xs mb-3">
                {CMI_INFO.secondLab.fullName}
              </p>
              <p className="text-text-muted text-sm">
                {CMI_INFO.secondLab.description}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
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
          <PoursuiteCard key={poursuite.title} {...poursuite} index={index} />
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
          <MetierCard key={metier.title} {...metier} index={index} />
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
