// ============================================
// LaRochelleUniverse - Univers La Rochelle
// Ville d'Innovation et de Culture
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
  TOURS_HISTORIQUES,
  HISTOIRE_ROCHELLE,
  ECOSYSTEME_NUMERIQUE,
  LRTZC_INFO,
  MOBILITE_YELO,
  FESTIVALS_ROCHELLE,
  QUARTIERS_ROCHELLE,
  LA_ROCHELLE_SECTIONS,
  type LaRochelleSection,
} from '../../content/laRochelleData';

// ============================================
// Composant Principal
// ============================================

export function LaRochelleUniverse() {
  const [activeSection, setActiveSection] = useState<LaRochelleSection>('overview');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Navigation des sections */}
      <nav className="flex justify-center gap-2 p-4 bg-surface/50 backdrop-blur-sm border-b border-primary-light/10 overflow-x-auto">
        {LA_ROCHELLE_SECTIONS.map((section) => (
          <TabButton
            key={section.id}
            label={section.title}
            icon={section.icon}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            color="#00BCD4"
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
            {activeSection === 'patrimoine' && <PatrimoineSection />}
            {activeSection === 'numerique' && <NumeriqueSection />}
            {activeSection === 'environnement' && <EnvironnementSection />}
            {activeSection === 'vie-locale' && <VieLocaleSection />}
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
        icon="🌊"
        title="La Rochelle - Ville d'Innovation et de Culture"
        subtitle="Laboratoire vivant pour les technologies numériques et la transition écologique"
        color="#00BCD4"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="bg-gradient-to-br from-blue-900/30 to-cyan-900/20 rounded-2xl p-6 border border-cyan-500/30"
        >
          <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-2">
            <span>🏰</span> Patrimoine Historique
          </h3>
          <p className="text-text-muted mb-4">
            Trois tours médiévales emblématiques gardent le Vieux-Port. La ville a résisté au Grand Siège de 1627-1628,
            forgeant une culture de résilience et d'innovation.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge text="1447 : Adduction d'eau" icon="💧" color="#3498DB" />
            <Badge text="1909 : Télévision" icon="📺" color="#9B59B6" />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
        >
          <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
            <span>💻</span> French Tech Atlantic Valley
          </h3>
          <p className="text-text-muted mb-4">
            Écosystème numérique dynamique avec 5 startups innovantes : Deep Tech, e-Santé, Green IT, SaaS et Legaltech.
            Marché mondial du documentaire Sunny Side of the Doc.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge text="5 startups" icon="🚀" color="#E91E63" />
            <Badge text="2000+ professionnels" icon="👥" color="#27AE60" />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="bg-gradient-to-br from-green-900/30 to-teal-900/20 rounded-2xl p-6 border border-green-500/30"
        >
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>🌍</span> Territoire Zéro Carbone
          </h3>
          <p className="text-text-muted mb-4">
            82M€ investis pour atteindre la neutralité carbone d'ici 2040. Technologies Big Data, Blockchain et IoT
            pour piloter 70 000+ projets de réduction d'émissions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge text="82M€ budget" icon="💰" color="#27AE60" />
            <Badge text="2040 : Objectif" icon="🎯" color="#00BCD4" />
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="bg-gradient-to-br from-orange-900/30 to-yellow-900/20 rounded-2xl p-6 border border-orange-500/30"
        >
          <h3 className="text-xl font-bold text-orange-400 mb-4 flex items-center gap-2">
            <span>🚲</span> Mobilité Yélo
          </h3>
          <p className="text-text-muted mb-4">
            Réseau de transport intégré unique : bus, TER, bus de mer électro-solaire et vélos en libre-service.
            Un seul abonnement pour tout !
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge text="70€ - 175€/an" icon="💳" color="#F39C12" />
            <Badge text="Bus de mer" icon="⛴️" color="#00BCD4" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ============================================
// Section: Patrimoine
// ============================================

function PatrimoineSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="🏰"
        title="Patrimoine Historique"
        subtitle="Une histoire de résilience et d'innovation"
        color="#00BCD4"
      />

      {/* Tours Historiques */}
      <div>
        <h3 className="text-2xl font-bold text-primary-light mb-6 flex items-center gap-2">
          <span>🏰</span> Les Trois Tours
        </h3>
        <div className="grid md:grid-cols-3 gap-5">
          {TOURS_HISTORIQUES.map((tour, index) => (
            <motion.div
              key={tour.nom}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-4xl mb-3">{tour.icon}</div>
              <h4 className="font-bold text-text mb-2">{tour.nom}</h4>
              {tour.periode && <Badge text={tour.periode} color="#8B4513" />}
              <p className="text-sm text-text-muted mt-2">{tour.description}</p>
              {tour.surnom && (
                <p className="text-xs text-primary-light mt-2 italic">"{tour.surnom}"</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grand Siège */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-900/30 to-orange-900/20 rounded-2xl p-6 border border-red-500/30"
      >
        <h4 className="text-xl font-bold text-red-400 mb-3">
          Le Grand Siège ({HISTOIRE_ROCHELLE.grandSiege.annees})
        </h4>
        <p className="text-text-muted mb-3">{HISTOIRE_ROCHELLE.grandSiege.contexte}</p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-bold text-red-300">Prouesse militaire :</span>
            <p className="text-text-muted">{HISTOIRE_ROCHELLE.grandSiege.prouesse}</p>
          </div>
          <div>
            <span className="font-bold text-red-300">Impact :</span>
            <p className="text-text-muted">{HISTOIRE_ROCHELLE.grandSiege.impact}</p>
          </div>
        </div>
        <p className="text-green-300 mt-3 font-medium">
          💡 {HISTOIRE_ROCHELLE.grandSiege.heritage}
        </p>
      </motion.div>

      {/* Innovations historiques */}
      <div>
        <h3 className="text-2xl font-bold text-primary-light mb-6 flex items-center gap-2">
          <span>💡</span> Innovations Historiques
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {HISTOIRE_ROCHELLE.innovations.map((innovation, idx) => (
            <motion.div
              key={innovation.annee}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-surface-light rounded-xl p-4 border border-primary-light/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{innovation.icon}</span>
                <div>
                  <Badge text={innovation.annee} color="#3498DB" />
                  <h5 className="font-bold text-text mt-1">{innovation.titre}</h5>
                </div>
              </div>
              <p className="text-sm text-text-muted">{innovation.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section: Numérique
// ============================================

function NumeriqueSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="💻"
        title="Écosystème Numérique"
        subtitle="French Tech Atlantic Valley - Innovation et entrepreneuriat"
        color="#00BCD4"
      />

      {/* Startups */}
      <div>
        <h3 className="text-2xl font-bold text-primary-light mb-6 flex items-center gap-2">
          <span>🚀</span> Startups Innovantes
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECOSYSTEME_NUMERIQUE.startups.map((startup, index) => (
            <motion.div
              key={startup.nom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-blue-900/20 to-purple-900/10 rounded-xl p-5 border border-blue-500/30"
            >
              <h4 className="font-bold text-blue-400 mb-2">{startup.nom}</h4>
              <Badge text={startup.secteur} color="#3498DB" />
              <p className="text-xs text-text-muted mt-2 mb-2">{startup.tech}</p>
              <p className="text-sm text-text-muted">{startup.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recrutement */}
      <div className="bg-green-900/20 rounded-xl p-5 border border-green-500/30">
        <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
          <span>🎯</span> Marché de l'emploi IT
        </h4>
        <ul className="text-sm text-text-muted space-y-2">
          {ECOSYSTEME_NUMERIQUE.recrutement.map((info, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-green-400 mt-0.5">▸</span>
              <span>{info}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sunny Side of the Doc */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <h4 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
          <span>🎬</span> {ECOSYSTEME_NUMERIQUE.evenement.nom}
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Badge text={ECOSYSTEME_NUMERIQUE.evenement.dates} icon="📅" color="#9B59B6" />
            <p className="text-sm text-text mt-2">📍 {ECOSYSTEME_NUMERIQUE.evenement.lieu}</p>
          </div>
          <div>
            <Badge text={ECOSYSTEME_NUMERIQUE.evenement.participants} icon="👥" color="#27AE60" />
          </div>
        </div>
        <p className="text-sm text-text-muted mt-3">{ECOSYSTEME_NUMERIQUE.evenement.description}</p>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Environnement
// ============================================

function EnvironnementSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="🌍"
        title="Territoire Zéro Carbone"
        subtitle="La Rochelle, pionnière de la transition écologique"
        color="#00BCD4"
      />

      {/* LRTZC */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-green-900/40 to-teal-900/30 rounded-2xl p-8 border-2 border-green-500/50"
      >
        <h3 className="text-2xl font-bold text-green-400 mb-4">
          {LRTZC_INFO.nom}
        </h3>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-1">{LRTZC_INFO.budget}</div>
            <div className="text-sm text-text-muted">Budget</div>
          </div>
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-1">2040</div>
            <div className="text-sm text-text-muted">{LRTZC_INFO.objectif}</div>
          </div>
          <div className="text-center p-4 bg-surface-light/30 rounded-lg">
            <div className="text-3xl font-bold text-green-400 mb-1">70k+</div>
            <div className="text-sm text-text-muted">Projets pilotés</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/30">
            <h4 className="font-bold text-blue-400 mb-2 flex items-center gap-2">
              <span>💻</span> Agrégateur Carbone Territorial
            </h4>
            <p className="text-sm text-text-muted mb-3">{LRTZC_INFO.agregateurCarbone.description}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {LRTZC_INFO.agregateurCarbone.technologies.map((tech) => (
                <Badge key={tech} text={tech} icon="🔧" color="#3498DB" />
              ))}
            </div>
            <ul className="text-xs text-text-muted space-y-1">
              {LRTZC_INFO.agregateurCarbone.fonctions.map((fonction, idx) => (
                <li key={idx}>• {fonction}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/30">
              <h4 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                <span>🚗</span> {LRTZC_INFO.mobilite.objectif}
              </h4>
              <div className="flex flex-wrap gap-2">
                {LRTZC_INFO.mobilite.solutions.map((solution) => (
                  <Badge key={solution} text={solution} color="#9B59B6" />
                ))}
              </div>
            </div>

            <div className="bg-cyan-900/20 rounded-lg p-4 border border-cyan-500/30">
              <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                <span>🌊</span> {LRTZC_INFO.carboneBleu.projet}
              </h4>
              <p className="text-xs text-text-muted mb-2">{LRTZC_INFO.carboneBleu.description}</p>
              <Badge text={LRTZC_INFO.carboneBleu.tech} icon="🔬" color="#00BCD4" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Vie Locale
// ============================================

function VieLocaleSection() {
  return (
    <div className="space-y-10">
      <SectionTitle
        icon="🎭"
        title="Vie Locale"
        subtitle="Culture, mobilité et quartiers"
        color="#00BCD4"
      />

      {/* Mobilité Yélo */}
      <div>
        <h3 className="text-2xl font-bold text-primary-light mb-6 flex items-center gap-2">
          <span>🚌</span> Mobilité Yélo - Connectivité Sans Couture
        </h3>
        <p className="text-text-muted mb-4">{MOBILITE_YELO.description}</p>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {MOBILITE_YELO.modes.map((mode, index) => (
            <motion.div
              key={mode.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-3xl mb-3">{mode.icon}</div>
              <h4 className="font-bold text-text mb-2">{mode.type}</h4>
              <p className="text-sm text-text-muted">{mode.description}</p>
              {mode.specificite && (
                <p className="text-green-400 font-medium text-sm mt-2">✨ {mode.specificite}</p>
              )}
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/20 rounded-xl p-5 border border-orange-500/30">
            <h4 className="font-bold text-orange-400 mb-3">{MOBILITE_YELO.tarifs.titre}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-text-muted">{MOBILITE_YELO.tarifs.age}</span>
                <span className="font-bold text-orange-400">{MOBILITE_YELO.tarifs.fourchette}</span>
              </div>
              <p className="text-xs text-text-muted">{MOBILITE_YELO.tarifs.critere}</p>
              <p className="text-green-300 text-xs mt-2">✓ {MOBILITE_YELO.tarifs.inclus}</p>
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-5 border border-primary-light/20">
            <h4 className="font-bold text-text mb-3">📍 Distances Campus</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-primary-light font-bold">Vieux-Port ↔ Minimes :</span>{' '}
                {MOBILITE_YELO.distances.vieuxPortMinimes}
              </div>
              <div className="text-xs text-text-muted space-y-1 mt-2">
                <div>🚌 Bus : {MOBILITE_YELO.distances.temps.bus}</div>
                <div>🚲 Vélo : {MOBILITE_YELO.distances.temps.velo}</div>
                <div>⛴️ Bus de mer : {MOBILITE_YELO.distances.temps.busMer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Festivals et Quartiers */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Festivals */}
        <div>
          <h3 className="text-xl font-bold text-primary-light mb-4 flex items-center gap-2">
            <span>🎵</span> Festivals Majeurs
          </h3>
          {FESTIVALS_ROCHELLE.map((festival, index) => (
            <motion.div
              key={festival.nom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 rounded-xl p-5 border border-purple-500/30 mb-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{festival.icon}</span>
                <div>
                  <h4 className="font-bold text-purple-400">{festival.nom}</h4>
                  <Badge text={festival.dates} icon="📅" color="#9B59B6" />
                </div>
              </div>
              <p className="text-sm text-text-muted mb-2">{festival.description}</p>
              {festival.artistes2025 && (
                <div className="flex flex-wrap gap-2">
                  {festival.artistes2025.map((artiste) => (
                    <Badge key={artiste} text={artiste} color="#E91E63" />
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quartiers */}
        <div>
          <h3 className="text-xl font-bold text-primary-light mb-4 flex items-center gap-2">
            <span>🏘️</span> Quartiers Étudiants
          </h3>
          {QUARTIERS_ROCHELLE.map((quartier, index) => (
            <motion.div
              key={quartier.nom}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20 mb-4"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{quartier.icon}</span>
                <h4 className="font-bold text-text">{quartier.nom}</h4>
              </div>
              <ul className="text-sm text-text-muted space-y-1 mb-2">
                {quartier.caracteristiques.map((carac, idx) => (
                  <li key={idx}>• {carac}</li>
                ))}
              </ul>
              {quartier.logements && (
                <p className="text-xs text-green-400 mt-2">🏠 {quartier.logements}</p>
              )}
              {quartier.lieux && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {quartier.lieux.map((lieu) => (
                    <Badge key={lieu} text={lieu} color="#E91E63" />
                  ))}
                </div>
              )}
              <p className="text-xs text-primary-light italic mt-2">{quartier.ambiance}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LaRochelleUniverse;
