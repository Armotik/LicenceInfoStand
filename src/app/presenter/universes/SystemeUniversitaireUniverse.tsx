// ============================================
// SystemeUniversitaireUniverse - Univers Système Universitaire
// Architecture, Pédagogie et Comparaisons
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SectionTitle,
  TabButton,
  Badge,
  fadeInUp,
} from '../components/UIComponents';
import {
  SYSTEME_SECTIONS,
  CYCLES_LMD,
  ECTS_INFO,
  CCI_INFO,
  FORMATS_PEDAGOGIQUES,
  SMART_CODE_INFO,
  COMPARAISON_FORMATIONS,
  CMI_VS_ECOLE,
  ROI_ANALYSES,
  PARCOURSUP_CALENDRIER,
  PARCOURSUP_REPONSES,
  PARCOURSUP_STRATEGIE,
  TRANSITION_INFO,
  type SystemeSection,
} from '../../content/systemeUniversitaireData';

// ============================================
// Composant Principal
// ============================================

export function SystemeUniversitaireUniverse() {
  const [activeSection, setActiveSection] = useState<SystemeSection>('overview');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Navigation des sections */}
      <nav className="flex justify-center gap-2 p-4 bg-surface/50 backdrop-blur-sm border-b border-primary-light/10 overflow-x-auto">
        {SYSTEME_SECTIONS.map((section) => (
          <TabButton
            key={section.id}
            label={section.title}
            icon={section.icon}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            color="#9B59B6"
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
            {activeSection === 'lmd-ects' && <LMDECTSSection />}
            {activeSection === 'pedagogie' && <PedagogieSection />}
            {activeSection === 'comparaison' && <ComparaisonSection />}
            {activeSection === 'parcoursup' && <ParcoursupSection />}
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
        icon="📚"
        title="Système Universitaire Français"
        subtitle="Comprendre l'université pour mieux réussir"
        color="#9B59B6"
      />

      {/* Introduction */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={0}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <p className="text-text mb-4">
          L'enseignement supérieur français traverse une transformation structurelle et pédagogique sans précédent.
          Sous l'effet conjoint de l'harmonisation européenne (Processus de Bologne), de la révolution numérique
          et de la concurrence entre public et privé, l'université se réinvente.
        </p>
        <p className="text-text-muted text-sm">
          Ce guide vous aide à maîtriser la "grammaire interne" de l'université : architecture LMD,
          système ECTS, modalités pédagogiques et stratégies d'orientation.
        </p>
      </motion.div>

      {/* Points clés */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">🎓</div>
          <h4 className="font-bold text-purple-400 mb-2">Architecture LMD</h4>
          <p className="text-sm text-text-muted">
            Licence (3 ans), Master (2 ans), Doctorat (3 ans). Un système modulaire,
            capitalisable et transférable dans toute l'Europe.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">📊</div>
          <h4 className="font-bold text-purple-400 mb-2">Système ECTS</h4>
          <p className="text-sm text-text-muted">
            European Credit Transfer System. 60 ECTS = 1 année. 1 ECTS = 25-30h de travail total.
            Une vraie monnaie académique européenne.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">👨‍🏫</div>
          <h4 className="font-bold text-purple-400 mb-2">CM / TD / TP</h4>
          <p className="text-sm text-text-muted">
            Le triptyque pédagogique : Cours Magistral (théorie), Travaux Dirigés (exercices),
            Travaux Pratiques (mise en œuvre). Complémentaires et indispensables.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">📝</div>
          <h4 className="font-bold text-purple-400 mb-2">Contrôle Continu Intégral</h4>
          <p className="text-sm text-text-muted">
            Spécificité de La Rochelle : évaluation tout au long du semestre.
            Travail régulier obligatoire, mais évaluation plus juste.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">⚖️</div>
          <h4 className="font-bold text-purple-400 mb-2">Licence vs Bachelor vs École</h4>
          <p className="text-sm text-text-muted">
            Comprendre les différences de coût, philosophie et reconnaissance entre
            université publique, écoles privées et écoles d'ingénieurs.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={6}
          className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-purple-400/50 transition-all"
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-3">🎯</div>
          <h4 className="font-bold text-purple-400 mb-2">Parcoursup 2026</h4>
          <p className="text-sm text-text-muted">
            Calendrier, stratégie de vœux, types de réponses.
            Tout pour maximiser vos chances d'intégrer la formation de votre choix.
          </p>
        </motion.div>
      </div>

      {/* Transition Lycée-Université */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={7}
        className="bg-gradient-to-r from-red-900/30 to-orange-900/20 rounded-2xl p-6 border border-red-500/30"
      >
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <span>⚠️</span> {TRANSITION_INFO.titre}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-surface-light/50 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-400 mb-1">{TRANSITION_INFO.taux_echec_l1}</div>
            <div className="text-sm text-text-muted">Taux d'échec en L1 en France</div>
          </div>
          <div className="bg-surface-light/50 rounded-lg p-4">
            <div className="text-sm text-text mb-2">
              <span className="font-bold text-text">Cause principale :</span>
            </div>
            <div className="text-sm text-text-muted">{TRANSITION_INFO.cause}</div>
          </div>
        </div>
        <p className="text-green-400 text-sm">
          💡 La Rochelle Université met en place de nombreux dispositifs d'accompagnement pour faciliter cette transition.
        </p>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: LMD & ECTS
// ============================================

function LMDECTSSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="🎓"
        title="Architecture LMD & Système ECTS"
        subtitle="La structure de l'enseignement supérieur européen"
        color="#9B59B6"
      />

      {/* Cycles LMD */}
      <div>
        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <span>🏛️</span> Les Trois Cycles LMD
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          {CYCLES_LMD.map((cycle, index) => (
            <motion.div
              key={cycle.nom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-6 border border-purple-500/30"
            >
              <div className="text-5xl mb-4">{cycle.icon}</div>
              <h4 className="text-2xl font-bold text-purple-400 mb-2">{cycle.nom}</h4>
              <Badge text={cycle.niveau} color="#9B59B6" />
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">📅</span>
                  <span className="text-text">{cycle.duree}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400">🎓</span>
                  <span className="text-text font-bold">{cycle.ects} ECTS</span>
                </div>
              </div>
              <p className="text-sm text-text-muted mt-4">{cycle.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Système ECTS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-2xl p-8 border border-blue-500/30"
      >
        <h3 className="text-2xl font-bold text-blue-400 mb-4">
          {ECTS_INFO.titre}
        </h3>
        <p className="text-text mb-6">{ECTS_INFO.definition}</p>

        {/* Quantification */}
        <div className="bg-surface-light/50 rounded-xl p-6 mb-6">
          <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>📊</span> Quantification de la Charge de Travail
          </h4>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{ECTS_INFO.quantification.anneePleine}</div>
              <div className="text-xs text-text-muted">ECTS / an</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{ECTS_INFO.quantification.semestre}</div>
              <div className="text-xs text-text-muted">ECTS / semestre</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400 mb-1">{ECTS_INFO.quantification.licenceComplete}</div>
              <div className="text-xs text-text-muted">ECTS Licence</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-xl font-bold text-blue-400 mb-1">{ECTS_INFO.quantification.valeurCredit}</div>
              <div className="text-xs text-text-muted">/ crédit</div>
            </div>
          </div>
          <p className="text-sm text-blue-300 italic">
            {ECTS_INFO.quantification.details}
          </p>
        </div>

        {/* Exemple concret */}
        <div className="bg-purple-900/20 rounded-xl p-5 mb-6 border border-purple-500/20">
          <h4 className="font-bold text-purple-400 mb-3 flex items-center gap-2">
            <span>💡</span> Exemple Concret
          </h4>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-bold text-text">UE : </span>
              <span className="text-purple-300">{ECTS_INFO.exemple.ue}</span>
            </div>
            <div>
              <span className="font-bold text-text">Charge totale : </span>
              <span className="text-text-muted">{ECTS_INFO.exemple.chargeTotal}</span>
            </div>
            <div className="text-yellow-300 text-xs mt-3">
              ⚠️ {ECTS_INFO.exemple.implication}
            </div>
          </div>
        </div>

        {/* Mécanismes */}
        <div>
          <h4 className="font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>⚙️</span> Mécanismes de Compensation et Capitalisation
          </h4>
          <div className="space-y-3">
            {ECTS_INFO.mecanismes.map((mecanisme, idx) => (
              <div key={idx} className="bg-surface-light/30 rounded-lg p-4 flex items-start gap-3">
                <span className="text-3xl">{mecanisme.icon}</span>
                <div>
                  <h5 className="font-bold text-text mb-1">{mecanisme.nom}</h5>
                  <p className="text-sm text-text-muted">{mecanisme.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contrôle Continu Intégral */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-900/30 to-teal-900/20 rounded-2xl p-6 border border-green-500/30"
      >
        <h3 className="text-2xl font-bold text-green-400 mb-3">
          {CCI_INFO.titre}
        </h3>
        <Badge text={CCI_INFO.specificite} color="#27AE60" />
        <p className="text-text mt-4 mb-6">{CCI_INFO.principe}</p>

        <div className="grid md:grid-cols-3 gap-4">
          {CCI_INFO.implications.map((impl, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-5 border ${
                impl.type === 'positif'
                  ? 'bg-green-900/20 border-green-500/30'
                  : 'bg-yellow-900/20 border-yellow-500/30'
              }`}
            >
              <div className="text-3xl mb-3">{impl.icon}</div>
              <h5 className={`font-bold mb-2 ${
                impl.type === 'positif' ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {impl.titre}
              </h5>
              <p className="text-sm text-text-muted">{impl.description}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Pédagogie
// ============================================

function PedagogieSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="👨‍🏫"
        title="Modalités Pédagogiques"
        subtitle="Du Cours Magistral à l'enseignement hybride"
        color="#9B59B6"
      />

      {/* CM TD TP */}
      <div>
        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <span>📚</span> Le Triptyque Traditionnel : CM, TD, TP
        </h3>
        <div className="space-y-5">
          {FORMATS_PEDAGOGIQUES.map((format, index) => (
            <motion.div
              key={format.nom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-6 border border-primary-light/20"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{format.icon}</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-purple-400 mb-2">{format.nom}</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                      <span className="text-sm font-bold text-text">Format : </span>
                      <span className="text-sm text-text-muted">{format.format}</span>
                    </div>
                    <div>
                      <span className="text-sm font-bold text-text">Interactivité : </span>
                      <span className="text-sm text-text-muted">{format.interactivite}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-muted mb-3">{format.fonction}</p>
                  {format.exemple && (
                    <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-500/20">
                      <span className="text-xs font-bold text-purple-300">Exemple : </span>
                      <span className="text-xs text-text-muted">{format.exemple}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Smart Rooms */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-cyan-900/40 to-blue-900/30 rounded-2xl p-8 border-2 border-cyan-500/50"
      >
        <h3 className="text-2xl font-bold text-cyan-400 mb-4">
          {SMART_CODE_INFO.projet}
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{SMART_CODE_INFO.budget}</div>
            <div className="text-sm text-text-muted">Budget investi</div>
          </div>
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{SMART_CODE_INFO.salles}</div>
            <div className="text-sm text-text-muted">Smart Rooms</div>
          </div>
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-cyan-400 mb-1">{SMART_CODE_INFO.annee}</div>
            <div className="text-sm text-text-muted">Déploiement</div>
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-blue-950/40 rounded-xl p-5 mb-6">
          <h4 className="font-bold text-blue-300 mb-3">🔧 Technologies déployées</h4>
          <div className="flex flex-wrap gap-2">
            {SMART_CODE_INFO.technologies.map((tech) => (
              <Badge key={tech} text={tech} color="#00BCD4" />
            ))}
          </div>
        </div>

        {/* Approches */}
        <div className="space-y-4">
          <h4 className="font-bold text-cyan-300 mb-3">Approches pédagogiques innovantes</h4>
          {SMART_CODE_INFO.approches.map((approche, idx) => (
            <div key={idx} className="bg-surface-light/30 rounded-lg p-4 flex items-start gap-3">
              <span className="text-3xl">{approche.icon}</span>
              <div>
                <h5 className="font-bold text-cyan-400 mb-1">{approche.nom}</h5>
                <p className="text-sm text-text-muted">{approche.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
          <p className="text-sm text-green-300">
            💡 <span className="font-bold">Impact : </span>{SMART_CODE_INFO.impact}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Comparaison
// ============================================

function ComparaisonSection() {
  const [selectedCritere, setSelectedCritere] = useState<string | null>(null);

  return (
    <div className="space-y-10">
      <SectionTitle
        icon="⚖️"
        title="Licence vs Bachelor vs École d'Ingénieur"
        subtitle="Comparaison complète pour éclairer votre choix"
        color="#9B59B6"
      />

      {/* Tableau comparatif */}
      <div className="bg-surface-light rounded-2xl overflow-hidden border border-primary-light/20">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-purple-900/30 border-b border-purple-500/30">
                <th className="p-4 text-left font-bold text-purple-400 min-w-[180px]">Critère</th>
                <th className="p-4 text-left font-bold text-blue-400 min-w-[250px]">
                  <div className="flex items-center gap-2">
                    <span>🎓</span> Licence (Université)
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-orange-400 min-w-[250px]">
                  <div className="flex items-center gap-2">
                    <span>💼</span> Bachelor (Privé)
                  </div>
                </th>
                <th className="p-4 text-left font-bold text-green-400 min-w-[250px]">
                  <div className="flex items-center gap-2">
                    <span>🏆</span> École d'Ingénieur
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARAISON_FORMATIONS.map((row, idx) => (
                <motion.tr
                  key={row.critere}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`border-b border-primary-light/10 hover:bg-purple-900/10 transition-colors ${
                    selectedCritere === row.critere ? 'bg-purple-900/20' : ''
                  }`}
                  onClick={() => setSelectedCritere(selectedCritere === row.critere ? null : row.critere)}
                >
                  <td className="p-4 font-medium text-text">{row.critere}</td>
                  <td className="p-4 text-text-muted text-xs">{row.licence}</td>
                  <td className="p-4 text-text-muted text-xs">{row.bachelor}</td>
                  <td className="p-4 text-text-muted text-xs">{row.ecoleIngenieur}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CMI vs École d'Ingénieur */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-blue-900/20 rounded-2xl p-8 border border-purple-500/30"
      >
        <h3 className="text-2xl font-bold text-purple-400 mb-4">
          {CMI_VS_ECOLE.titre}
        </h3>
        <p className="text-text mb-6">{CMI_VS_ECOLE.description}</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Avantages CMI */}
          <div className="bg-purple-900/20 rounded-xl p-6 border border-purple-500/30">
            <h4 className="font-bold text-purple-400 mb-4 flex items-center gap-2">
              <span>🎖️</span> Avantages du CMI
            </h4>
            <div className="space-y-3">
              {CMI_VS_ECOLE.avantages_cmi.map((avantage, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-2xl">{avantage.icon}</span>
                  <div>
                    <div className="font-bold text-text text-sm">{avantage.point}</div>
                    <div className="text-xs text-text-muted">{avantage.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Avantages École */}
          <div className="bg-green-900/20 rounded-xl p-6 border border-green-500/30">
            <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
              <span>🏆</span> Avantages de l'École d'Ingénieur
            </h4>
            <div className="space-y-3">
              {CMI_VS_ECOLE.avantages_ecole.map((avantage, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <span className="text-2xl">{avantage.icon}</span>
                  <div>
                    <div className="font-bold text-text text-sm">{avantage.point}</div>
                    <div className="text-xs text-text-muted">{avantage.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-5 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <p className="text-sm text-blue-300">
            💡 <span className="font-bold">Conclusion : </span>{CMI_VS_ECOLE.conclusion}
          </p>
        </div>
      </motion.div>

      {/* ROI */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 rounded-xl p-6 border border-green-500/30"
        >
          <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
            <span>💰</span> Retour sur Investissement
          </h4>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-bold text-text">Économie : </span>
              <span className="text-green-300 text-xl">{ROI_ANALYSES.licence_vs_bachelor.economie}</span>
            </div>
            <p className="text-text-muted">{ROI_ANALYSES.licence_vs_bachelor.detail}</p>
            <div className="mt-4">
              <p className="font-bold text-text mb-2">Le Bachelor se justifie si :</p>
              <ul className="text-xs text-text-muted space-y-1">
                {ROI_ANALYSES.licence_vs_bachelor.justification_bachelor.map((just, idx) => (
                  <li key={idx}>• {just}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-xl p-6 border border-blue-500/30"
        >
          <h4 className="font-bold text-blue-400 mb-3 flex items-center gap-2">
            <span>🧠</span> Concepts vs Outils
          </h4>
          <div className="space-y-4 text-sm">
            <div className="bg-surface-light/30 rounded-lg p-4">
              <div className="font-bold text-blue-300 mb-2">Université (Licence/CMI)</div>
              <p className="text-xs text-text-muted">{ROI_ANALYSES.concepts_vs_outils.universite}</p>
            </div>
            <div className="bg-surface-light/30 rounded-lg p-4">
              <div className="font-bold text-orange-300 mb-2">École Privée (Bachelor)</div>
              <p className="text-xs text-text-muted">{ROI_ANALYSES.concepts_vs_outils.ecole_privee}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Section: Parcoursup
// ============================================

function ParcoursupSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="📝"
        title="Parcoursup 2026"
        subtitle="Calendrier, stratégie et conseils"
        color="#9B59B6"
      />

      {/* Calendrier */}
      <div>
        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <span>📅</span> Calendrier Prévisionnel 2026
        </h3>
        <div className="space-y-4">
          {PARCOURSUP_CALENDRIER.map((phase, index) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-6 border border-primary-light/20"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="text-lg font-bold text-purple-400">{phase.phase}</h4>
                <Badge text={phase.periode} icon="📅" color="#9B59B6" />
              </div>
              <ul className="text-sm text-text-muted space-y-2">
                {phase.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">▸</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Types de réponses */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-2">
          <span>📬</span> Comprendre les Types de Réponses
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {PARCOURSUP_REPONSES.map((reponse, idx) => (
            <div
              key={idx}
              className="bg-surface-light/50 rounded-lg p-4 border border-primary-light/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{reponse.icon}</span>
                <span className="font-bold text-text text-lg">{reponse.type}</span>
              </div>
              <p className="text-sm text-text-muted">{reponse.description}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stratégie */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-900/30 to-teal-900/20 rounded-2xl p-6 border border-green-500/30"
      >
        <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center gap-2">
          <span>🎯</span> {PARCOURSUP_STRATEGIE.titre}
        </h3>
        <div className="space-y-4">
          {PARCOURSUP_STRATEGIE.conseils.map((conseil, idx) => (
            <div key={idx} className="bg-surface-light/30 rounded-lg p-5 flex items-start gap-4">
              <span className="text-4xl">{conseil.icon}</span>
              <div>
                <h4 className="font-bold text-green-400 mb-2">{conseil.titre}</h4>
                <p className="text-sm text-text-muted">{conseil.description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Dispositifs d'accompagnement */}
      <div>
        <h3 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <span>🤝</span> Dispositifs d'Accompagnement à La Rochelle
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {TRANSITION_INFO.dispositifs_accompagnement.map((dispositif, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-5 border border-purple-500/30"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{dispositif.icon}</span>
                <div>
                  <h4 className="font-bold text-purple-400">{dispositif.nom}</h4>
                  <Badge text={dispositif.type} color="#9B59B6" />
                </div>
              </div>
              <p className="text-sm text-text-muted">{dispositif.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SystemeUniversitaireUniverse;
