// ============================================
// VieEtudianteUniverse - Univers Vie Étudiante complet
// La Rochelle Université
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StatCard,
  SectionTitle,
  TabButton,
  Badge,
  staggerContainer,
  fadeInUp,
} from '../components/UIComponents';
import {
  VIE_ETUDIANTE_STATS,
  ATOUTS_ROCHELLE,
  RESIDENCES_CROUS,
  AUTRES_LOGEMENTS,
  AIDES_LOGEMENT,
  RESTAURANTS_UNIVERSITAIRES,
  TARIFS_RESTAURATION,
  SERVICES_RESTAURATION,
  ACTIVITES_SPORTIVES,
  EVENEMENTS_SPORTIFS,
  SUAPSE_INFO,
  ESPACE_CULTURE_INFO,
  EQUIPEMENTS_CULTURELS,
  ATELIERS_ARTISTIQUES,
  EVENEMENTS_CULTURELS,
  SUPER_PASS_INFO,
  BDE_PAR_COMPOSANTE,
  ASSOCIATIONS_THEMATIQUES,
  ENGAGEMENT_INFO,
  SERVICES_SANTE,
  SERVICE_SOCIAL_INFO,
  HANDICAP_INFO,
  BUDGET_MENSUEL,
  AIDES_FINANCIERES,
  VIE_ETUDIANTE_SECTIONS,
  type VieEtudianteSection,
} from '../../content/vieEtudianteData';

// ============================================
// Composant Principal
// ============================================

export function VieEtudianteUniverse() {
  const [activeSection, setActiveSection] = useState<VieEtudianteSection>('overview');

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Navigation des sections */}
      <nav className="flex justify-center gap-2 p-4 bg-surface/50 backdrop-blur-sm border-b border-primary-light/10 overflow-x-auto">
        {VIE_ETUDIANTE_SECTIONS.map((section) => (
          <TabButton
            key={section.id}
            label={section.title}
            icon={section.icon}
            isActive={activeSection === section.id}
            onClick={() => setActiveSection(section.id)}
            color="#27AE60"
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
            {activeSection === 'logement' && <LogementSection />}
            {activeSection === 'restauration' && <RestaurationSection />}
            {activeSection === 'sport' && <SportSection />}
            {activeSection === 'culture' && <CultureSection />}
            {activeSection === 'associations' && <AssociationsSection />}
            {activeSection === 'services' && <ServicesSection />}
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
        icon="🏠"
        title="Vie Étudiante à La Rochelle"
        subtitle="Top 3 des villes étudiantes de taille moyenne en France"
        color="#27AE60"
      />

      {/* Stats grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {VIE_ETUDIANTE_STATS.map((stat, index) => (
          <StatCard key={stat.label} {...stat} index={index} />
        ))}
      </motion.div>

      {/* Atouts de La Rochelle */}
      <div>
        <h3 className="text-2xl font-bold text-primary-light mb-6 flex items-center gap-2">
          <span>✨</span> Pourquoi La Rochelle ?
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ATOUTS_ROCHELLE.map((atout, index) => (
            <motion.div
              key={atout.titre}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              custom={index}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-green-400/50 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{atout.icon}</div>
              <h4 className="font-bold text-text mb-2">{atout.titre}</h4>
              <p className="text-sm text-text-muted">{atout.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Budget mensuel */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        custom={6}
        className="bg-gradient-to-r from-green-900/30 to-emerald-900/20 rounded-2xl p-6 border border-green-500/30"
      >
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>💰</span> Budget mensuel estimé
        </h3>
        <div className="grid md:grid-cols-6 gap-4 mb-4">
          <div className="text-center p-3 bg-surface-light/50 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Logement</div>
            <div className="text-lg font-bold text-green-400">
              {BUDGET_MENSUEL.logement.min}-{BUDGET_MENSUEL.logement.max}€
            </div>
          </div>
          <div className="text-center p-3 bg-surface-light/50 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Alimentation</div>
            <div className="text-lg font-bold text-green-400">
              {BUDGET_MENSUEL.alimentation.min}-{BUDGET_MENSUEL.alimentation.max}€
            </div>
          </div>
          <div className="text-center p-3 bg-surface-light/50 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Transports</div>
            <div className="text-lg font-bold text-green-400">
              {BUDGET_MENSUEL.transports.min}-{BUDGET_MENSUEL.transports.max}€
            </div>
          </div>
          <div className="text-center p-3 bg-surface-light/50 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Téléphone/Net</div>
            <div className="text-lg font-bold text-green-400">
              {BUDGET_MENSUEL.telephoneInternet.min}-{BUDGET_MENSUEL.telephoneInternet.max}€
            </div>
          </div>
          <div className="text-center p-3 bg-surface-light/50 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Loisirs</div>
            <div className="text-lg font-bold text-green-400">
              {BUDGET_MENSUEL.loisirs.min}-{BUDGET_MENSUEL.loisirs.max}€
            </div>
          </div>
          <div className="text-center p-3 bg-green-500/20 rounded-lg">
            <div className="text-sm text-text-muted mb-1">Total</div>
            <div className="text-xl font-bold text-green-400">
              {BUDGET_MENSUEL.total.estimation}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Logement
// ============================================

function LogementSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🏘️"
        title="Logement étudiant"
        subtitle="Résidences CROUS, logements privés et aides"
        color="#27AE60"
      />

      {/* Résidences CROUS */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏢</span> Résidences CROUS
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {RESIDENCES_CROUS.map((residence, index) => (
            <motion.div
              key={residence.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-text mb-1">{residence.name}</h4>
                  <Badge text={residence.type} color="#27AE60" />
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-400">{residence.tarif}</div>
                  {residence.capacite && (
                    <div className="text-xs text-text-muted">{residence.capacite} places</div>
                  )}
                </div>
              </div>
              {residence.description && (
                <p className="text-sm text-text-muted">{residence.description}</p>
              )}
            </motion.div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <p className="text-sm text-text">
            <span className="font-bold">Contact CROUS :</span> 15 rue François de Vaux de Foletier, 17026 La Rochelle
            <br />
            <span className="font-bold">Tél :</span> 05 46 28 21 30
          </p>
        </div>
      </div>

      {/* Autres logements */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏠</span> Autres solutions
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {AUTRES_LOGEMENTS.map((logement, index) => (
            <motion.div
              key={logement.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-3xl mb-3">{logement.icon}</div>
              <h4 className="font-bold text-text mb-2">{logement.name}</h4>
              <p className="text-sm text-text-muted mb-2">{logement.description}</p>
              {logement.tarif && (
                <div className="text-green-400 font-bold">{logement.tarif}</div>
              )}
              {logement.details && (
                <ul className="text-xs text-text-muted mt-2 space-y-1">
                  {logement.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Aides au logement */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>💰</span> Aides au logement
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {AIDES_LOGEMENT.map((aide, index) => (
            <motion.div
              key={aide.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-5 border border-green-500/30"
            >
              <div className="text-3xl mb-3">{aide.icon}</div>
              <h4 className="font-bold text-green-400 mb-2">{aide.name}</h4>
              <p className="text-sm text-text-muted mb-3">{aide.description}</p>
              {aide.details && (
                <ul className="text-xs text-text-muted space-y-1">
                  {aide.details.map((detail, idx) => (
                    <li key={idx}>✓ {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section: Restauration
// ============================================

function RestaurationSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🍽️"
        title="Restauration universitaire"
        subtitle="4 restaurants CROUS, tarifs étudiants"
        color="#27AE60"
      />

      {/* Tarifs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-orange-900/30 to-red-900/20 rounded-2xl p-6 border border-orange-500/30"
      >
        <h3 className="text-xl font-bold text-orange-400 mb-6 text-center">
          Tarifs 2024-2025
        </h3>
        <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-400 mb-2">1€</div>
            <div className="text-text-muted">Boursiers / Précaires</div>
            <div className="text-sm text-green-400/70 mt-1">Repas complet</div>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold text-orange-400 mb-2">3,30€</div>
            <div className="text-text-muted">Non-boursiers</div>
            <div className="text-sm text-orange-400/70 mt-1">Repas complet</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {TARIFS_RESTAURATION.premium.boursiers} / {TARIFS_RESTAURATION.premium.nonBoursiers}
            </div>
            <div className="text-text-muted">Formule premium</div>
            <div className="text-sm text-blue-400/70 mt-1">Cafétérias</div>
          </div>
        </div>
      </motion.div>

      {/* Restaurants universitaires */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏪</span> Nos 4 restaurants universitaires
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {RESTAURANTS_UNIVERSITAIRES.map((resto, index) => (
            <motion.div
              key={resto.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <h4 className="font-bold text-text mb-2 flex items-center gap-2">
                <span className="text-2xl">🍴</span>
                {resto.name}
              </h4>
              <div className="text-sm text-text-muted space-y-1">
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{resto.localisation}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{resto.horaires}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Services complémentaires */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>⚡</span> Services complémentaires
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {SERVICES_RESTAURATION.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h4 className="font-bold text-text mb-2">{service.name}</h4>
              <p className="text-sm text-text-muted mb-2">{service.description}</p>
              {service.details && (
                <ul className="text-xs text-text-muted space-y-1">
                  {service.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section: Sport
// ============================================

function SportSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="⚽"
        title="Sport - SUAPSE"
        subtitle="+40 activités sportives pour tous les niveaux"
        color="#27AE60"
      />

      {/* Info SUAPSE */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/30"
      >
        <h3 className="text-2xl font-bold text-blue-400 mb-4">
          SUAPSE - Service Universitaire des Activités Physiques Sportives et d'Expression
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-text">
          <div>
            <span className="text-blue-400">📍 Localisation :</span> {SUAPSE_INFO.localisation}
          </div>
          <div>
            <span className="text-blue-400">📞 Contact :</span> {SUAPSE_INFO.contact}
          </div>
          <div>
            <span className="text-blue-400">🎯 Activités :</span> {SUAPSE_INFO.activites} disciplines
          </div>
          <div>
            <span className="text-blue-400">🏆 Compétitions :</span> {SUAPSE_INFO.competitions}
          </div>
        </div>
      </motion.div>

      {/* Activités sportives */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏃</span> Nos activités sportives
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ACTIVITES_SPORTIVES.map((categorie, index) => (
            <motion.div
              key={categorie.categorie}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{categorie.icon}</span>
                <h4 className="font-bold text-text">{categorie.categorie}</h4>
              </div>
              <div className="flex flex-wrap gap-1">
                {categorie.activites.map((activite) => (
                  <Badge key={activite} text={activite} color="#27AE60" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Événements sportifs */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏆</span> Événements sportifs annuels
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENEMENTS_SPORTIFS.map((event, index) => (
            <motion.div
              key={event.nom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-orange-900/20 to-red-900/10 rounded-xl p-5 border border-orange-500/30"
            >
              <h4 className="font-bold text-orange-400 mb-2">{event.nom}</h4>
              <p className="text-sm text-text-muted mb-2">{event.description}</p>
              {event.periode && (
                <Badge text={event.periode} icon="📅" color="#F39C12" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section: Culture
// ============================================

function CultureSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🎭"
        title="Culture - Maison de l'Étudiant"
        subtitle="+20 ateliers artistiques gratuits et Super Pass' Étudiant"
        color="#27AE60"
      />

      {/* Info Espace Culture */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <h3 className="text-2xl font-bold text-purple-400 mb-4">
          L'Espace Culture - Réseau {ESPACE_CULTURE_INFO.reseau}
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-text">
          <div>
            <span className="text-purple-400">📍 Localisation :</span> {ESPACE_CULTURE_INFO.localisation}
          </div>
          <div>
            <span className="text-purple-400">📞 Contact :</span> {ESPACE_CULTURE_INFO.contact}
          </div>
          <div>
            <span className="text-purple-400">✉️ Email :</span> {ESPACE_CULTURE_INFO.email}
          </div>
        </div>
      </motion.div>

      {/* Équipements */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏢</span> Équipements
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EQUIPEMENTS_CULTURELS.map((equipement, index) => (
            <motion.div
              key={equipement.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-3xl mb-3">{equipement.icon}</div>
              <h4 className="font-bold text-text mb-2">{equipement.name}</h4>
              <p className="text-sm text-text-muted mb-2">{equipement.description}</p>
              {equipement.details && (
                <ul className="text-xs text-text-muted space-y-1">
                  {equipement.details.map((detail, idx) => (
                    <li key={idx}>• {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Ateliers artistiques */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🎨</span> Ateliers artistiques gratuits (~20 ateliers)
        </h3>
        <div className="bg-surface-light rounded-xl p-6 border border-primary-light/20">
          <div className="flex flex-wrap gap-2">
            {ATELIERS_ARTISTIQUES.map((atelier) => (
              <Badge key={atelier} text={atelier} color="#9B59B6" />
            ))}
          </div>
          <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-purple-900/20 rounded-lg">
              <div className="font-bold text-purple-400 mb-1">MAXI</div>
              <div className="text-text-muted">Pratique intensive, création collective</div>
            </div>
            <div className="p-3 bg-blue-900/20 rounded-lg">
              <div className="font-bold text-blue-400 mb-1">MÉDI</div>
              <div className="text-text-muted">Sessions courtes, initiation</div>
            </div>
            <div className="p-3 bg-green-900/20 rounded-lg">
              <div className="font-bold text-green-400 mb-1">MINI</div>
              <div className="text-text-muted">Stages ponctuels de 2-3h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Super Pass' Étudiant */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/30"
      >
        <div className="flex items-start gap-4">
          <div className="text-6xl">🎟️</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-yellow-400 mb-2">
              Super Pass' Étudiant - GRATUIT
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-bold text-text mb-2">Avantages :</h4>
                <ul className="text-sm text-text-muted space-y-1">
                  {SUPER_PASS_INFO.avantages.map((avantage, idx) => (
                    <li key={idx}>✓ {avantage}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-text mb-2">Bénéficiaires :</h4>
                <ul className="text-sm text-text-muted space-y-1">
                  {SUPER_PASS_INFO.beneficiaires.map((beneficiaire, idx) => (
                    <li key={idx}>• {beneficiaire}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-sm text-yellow-400/70">
              📍 Retrait : {SUPER_PASS_INFO.retrait}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Événements culturels */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🎪</span> Événements culturels majeurs
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EVENEMENTS_CULTURELS.map((event, index) => (
            <motion.div
              key={event.nom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <h4 className="font-bold text-purple-400 mb-2">{event.nom}</h4>
              <p className="text-sm text-text-muted mb-2">{event.description}</p>
              {event.periode && (
                <Badge text={event.periode} icon="📅" color="#9B59B6" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Section: Associations
// ============================================

function AssociationsSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🤝"
        title="Associations étudiantes"
        subtitle="BDE, clubs thématiques et engagement valorisé"
        color="#27AE60"
      />

      {/* BDE par composante */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🎉</span> BDE par composante
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {BDE_PAR_COMPOSANTE.map((bde, index) => (
            <motion.div
              key={bde.nom}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20 hover:border-green-400/50 transition-all"
              whileHover={{ y: -5 }}
            >
              <div className="text-4xl mb-3">{bde.icon}</div>
              <h4 className="font-bold text-text mb-2">{bde.nom}</h4>
              <p className="text-sm text-text-muted">{bde.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Associations thématiques */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🎯</span> Associations thématiques
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSOCIATIONS_THEMATIQUES.map((asso, index) => (
            <motion.div
              key={asso.nom}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-3xl">{asso.icon}</span>
                <div>
                  <h4 className="font-bold text-text mb-1">{asso.nom}</h4>
                  <Badge text={asso.type} color="#3498DB" />
                </div>
              </div>
              <p className="text-sm text-text-muted">{asso.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Valorisation engagement */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-green-900/30 to-teal-900/20 rounded-2xl p-6 border border-green-500/30"
      >
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏆</span> Valorisation de l'engagement
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-text mb-2">{ENGAGEMENT_INFO.fdsie.nom}</h4>
            <p className="text-sm text-text-muted mb-1">{ENGAGEMENT_INFO.fdsie.description}</p>
            <Badge text={ENGAGEMENT_INFO.fdsie.frequence} icon="📅" color="#27AE60" />
          </div>
          <div>
            <h4 className="font-bold text-text mb-2">{ENGAGEMENT_INFO.bonus.nom}</h4>
            <p className="text-sm text-text-muted">{ENGAGEMENT_INFO.bonus.description}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ============================================
// Section: Services (Santé, Social, Finances)
// ============================================

function ServicesSection() {
  return (
    <div className="space-y-8">
      <SectionTitle
        icon="🏥"
        title="Services & Accompagnement"
        subtitle="Santé, social, handicap et aides financières"
        color="#27AE60"
      />

      {/* Santé */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>🏥</span> Service de Santé Universitaire (SSU)
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SERVICES_SANTE.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-surface-light rounded-xl p-5 border border-primary-light/20"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h4 className="font-bold text-text mb-2">{service.name}</h4>
              <p className="text-sm text-text-muted mb-2">{service.description}</p>
              {service.details && (
                <ul className="text-xs text-text-muted space-y-1">
                  {service.details.map((detail, idx) => (
                    <li key={idx}>✓ {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Service Social */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-900/30 to-cyan-900/20 rounded-2xl p-6 border border-blue-500/30"
      >
        <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <span>💼</span> Service Social
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-text mb-3">
              <span className="font-bold">📍 Localisation :</span> {SERVICE_SOCIAL_INFO.localisation}
              <br />
              <span className="font-bold">📞 Accès :</span> {SERVICE_SOCIAL_INFO.contact}
            </p>
          </div>
          <div>
            <h4 className="font-bold text-text mb-2">Services proposés :</h4>
            <ul className="text-sm text-text-muted space-y-1">
              {SERVICE_SOCIAL_INFO.services.map((service, idx) => (
                <li key={idx}>• {service}</li>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Handicap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-900/30 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30"
      >
        <h3 className="text-xl font-bold text-purple-400 mb-4 flex items-center gap-2">
          <span>♿</span> {HANDICAP_INFO.nom}
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {HANDICAP_INFO.services.map((service, idx) => (
            <div key={idx} className="p-3 bg-surface-light/50 rounded-lg text-sm text-text-muted">
              ✓ {service}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Aides financières */}
      <div>
        <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
          <span>💰</span> Aides financières
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {AIDES_FINANCIERES.map((aide, index) => (
            <motion.div
              key={aide.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gradient-to-br from-green-900/20 to-emerald-900/10 rounded-xl p-5 border border-green-500/30"
            >
              <div className="text-3xl mb-3">{aide.icon}</div>
              <h4 className="font-bold text-green-400 mb-2">{aide.name}</h4>
              <p className="text-sm text-text-muted mb-3">{aide.description}</p>
              {aide.details && (
                <ul className="text-xs text-text-muted space-y-1">
                  {aide.details.map((detail, idx) => (
                    <li key={idx}>✓ {detail}</li>
                  ))}
                </ul>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VieEtudianteUniverse;
