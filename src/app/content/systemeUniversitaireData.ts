// ============================================================================
// DONNÉES - SYSTÈME UNIVERSITAIRE FRANÇAIS
// Source: Rapport sur l'Enseignement Supérieur 2025-2026
// ============================================================================

// Types
export interface SystemeSectionItem {
  id: SystemeSection;
  title: string;
  icon: string;
}

export type SystemeSection = 'overview' | 'lmd-ects' | 'pedagogie' | 'comparaison' | 'parcoursup';

export interface CycleInfo {
  nom: string;
  niveau: string;
  duree: string;
  ects: number;
  description: string;
  icon: string;
}

export interface CompetenceVersusItem {
  critere: string;
  licence: string;
  bachelor: string;
  ecoleIngenieur: string;
}

export interface PedagogieFormat {
  nom: string;
  icon: string;
  format: string;
  fonction: string;
  interactivite: string;
  exemple?: string;
}

export interface PhaseParcoursup {
  phase: string;
  periode: string;
  actions: string[];
}

// ============================================================================
// SECTIONS DE NAVIGATION
// ============================================================================

export const SYSTEME_SECTIONS: SystemeSectionItem[] = [
  { id: 'overview', title: 'Vue d\'ensemble', icon: '📊' },
  { id: 'lmd-ects', title: 'LMD & ECTS', icon: '🎓' },
  { id: 'pedagogie', title: 'Pédagogie', icon: '👨‍🏫' },
  { id: 'comparaison', title: 'Comparaisons', icon: '⚖️' },
  { id: 'parcoursup', title: 'Parcoursup', icon: '📝' },
];

// ============================================================================
// ARCHITECTURE LMD
// ============================================================================

export const CYCLES_LMD: CycleInfo[] = [
  {
    nom: 'Licence',
    niveau: 'Bac+3 (Niveau 6 RNCP)',
    duree: '3 ans (L1, L2, L3)',
    ects: 180,
    description: 'Premier cycle universitaire. Acquisition d\'un socle fondamental de compétences disciplinaires et pré-professionnelles. Diplôme National garantissant une poursuite d\'études de droit en Master.',
    icon: '🎓',
  },
  {
    nom: 'Master',
    niveau: 'Bac+5 (Niveau 7 RNCP)',
    duree: '2 ans (M1, M2)',
    ects: 120,
    description: 'Cycle d\'expertise. Connexion forte avec la recherche (laboratoires L3i, MIA). Spécialisation professionnelle ou recherche.',
    icon: '🔬',
  },
  {
    nom: 'Doctorat',
    niveau: 'Bac+8 (Niveau 8 RNCP)',
    duree: '3 ans',
    ects: 180,
    description: 'Sommet de l\'architecture académique. Recherche post-Master pour devenir chercheur ou enseignant-chercheur.',
    icon: '🏆',
  },
];

// ============================================================================
// SYSTÈME ECTS
// ============================================================================

export const ECTS_INFO = {
  titre: 'European Credit Transfer and Accumulation System',
  definition: 'Le système ECTS ne mesure pas la difficulté d\'un cours, ni uniquement le nombre d\'heures de présence, mais la charge de travail globale requise par l\'étudiant pour atteindre les objectifs d\'apprentissage.',

  quantification: {
    anneePleine: 60,
    semestre: 30,
    licenceComplete: 180,
    valeurCredit: '25 à 30 heures de travail étudiant total',
    details: 'Un crédit ECTS correspond à environ 25-30h de travail total incluant cours magistraux, TD, TP, projets et travail personnel.',
  },

  exemple: {
    ue: 'Algorithmique avancée (6 ECTS)',
    chargeTotal: '150 à 180 heures sur le semestre',
    implication: 'Cette métrique révèle l\'importance du travail personnel invisible, souvent sous-estimé par les néo-bacheliers.',
  },

  mecanismes: [
    {
      nom: 'Capitalisation',
      description: 'Toute UE validée (≥10/20) est acquise définitivement. En cas de redoublement, l\'étudiant ne repasse jamais les matières validées.',
      icon: '🔒',
    },
    {
      nom: 'Compensation Intra-Semestrielle',
      description: 'Au sein d\'un semestre, les UE se compensent entre elles. Une note faible en Anglais peut être rattrapée par une note forte en Java, pondérée par les crédits ECTS.',
      icon: '⚖️',
    },
    {
      nom: 'Compensation Annuelle',
      description: 'Une compensation s\'opère généralement entre les deux semestres d\'une même année (le S1 peut compenser le S2), sous réserve de ne pas avoir de note éliminatoire.',
      icon: '📊',
    },
  ],
};

// ============================================================================
// CONTRÔLE CONTINU INTÉGRAL (CCI)
// ============================================================================

export const CCI_INFO = {
  titre: 'Contrôle Continu Intégral',
  specificite: 'Spécificité de La Rochelle Université pour la Licence Informatique',

  principe: 'L\'évaluation est disséminée tout au long du semestre. Il n\'y a pas de "semaine de partiels" bloquée à la fin janvier ou mai. L\'étudiant est évalué sur des projets, des rendus intermédiaires, des interrogations en TD et des travaux pratiques.',

  implications: [
    {
      titre: 'Régularité obligatoire',
      description: 'Ce système impose un travail constant. L\'impasse est impossible.',
      icon: '📅',
      type: 'positif',
    },
    {
      titre: 'Absence de Session 2',
      description: 'Souvent pas de session de rattrapage pour les matières en CCI. L\'évaluation terminale sanctionne l\'ensemble de la période, il n\'y a pas de "seconde chance" estivale classique.',
      icon: '⚠️',
      type: 'attention',
    },
    {
      titre: 'Justice de l\'évaluation',
      description: 'Réduit le facteur stress et le hasard lié à un sujet d\'examen unique, favorisant une évaluation plus fidèle des compétences réelles.',
      icon: '✅',
      type: 'positif',
    },
  ],
};

// ============================================================================
// MODALITÉS PÉDAGOGIQUES
// ============================================================================

export const FORMATS_PEDAGOGIQUES: PedagogieFormat[] = [
  {
    nom: 'Cours Magistral (CM)',
    icon: '🎤',
    format: 'Amphithéâtre ou grande salle (100-300 étudiants)',
    fonction: 'L\'enseignant-chercheur expose les concepts théoriques fondamentaux, l\'état de l\'art et la structure du savoir. En Informatique : complexité algorithmique, architecture de Von Neumann, modèles de bases de données.',
    interactivite: 'Limitée. Posture étudiante : écoute active et prise de notes rapide.',
    exemple: 'Explication théorique de la complexité algorithmique O(n log n)',
  },
  {
    nom: 'Travaux Dirigés (TD)',
    icon: '✍️',
    format: 'Groupes restreints (25-35 étudiants)',
    fonction: 'Mise en application des concepts du CM sur papier ou au tableau. Résolution d\'exercices, démonstrations mathématiques, analyse de code.',
    interactivite: 'Forte. Enseignant circule, corrige, répond aux questions. Présence généralement obligatoire.',
    exemple: 'Résolution d\'exercices d\'algorithmique, analyse de complexité',
  },
  {
    nom: 'Travaux Pratiques (TP)',
    icon: '💻',
    format: 'Demi-groupes (15-20 étudiants) en salles équipées',
    fonction: 'Confrontation au réel. Coder, compiler, débugger. L\'étudiant est face à la machine.',
    interactivite: 'Maximale. Support principal du contrôle continu via rendus de code ou démonstrations.',
    exemple: 'Implémentation d\'un algorithme de tri en Java, débogage en direct',
  },
];

// ============================================================================
// SMART ROOMS & ENSEIGNEMENT COMODAL
// ============================================================================

export const SMART_CODE_INFO = {
  projet: 'Smart CODE (Smart Curriculum On Demand)',
  budget: '2,5 millions d\'euros',
  salles: 25,
  annee: 'Depuis 2023',

  technologies: [
    'Caméras de tracking automatique',
    'Systèmes de prise de son avancés',
    'Mobilier modulable (chaises sur roulettes, tables en îlots)',
    'Écrans collaboratifs partagés',
  ],

  approches: [
    {
      nom: 'Synchrone Distanciel',
      description: 'Un étudiant malade, salarié ou éloigné peut suivre le cours en direct de chez lui, interagir via des outils numériques (Wooclap, Wooflash).',
      icon: '📡',
    },
    {
      nom: 'Asynchrone (Replay)',
      description: 'Les cours sont enregistrés et mis à disposition. Possibilité de revoir à volonté l\'explication complexe d\'un algorithme.',
      icon: '🎬',
    },
  ],

  impact: 'Cette flexibilité favorise l\'autonomie et permet à chacun d\'apprendre à son rythme, répondant à l\'objectif de "personnalisation des parcours".',
};

// ============================================================================
// COMPARAISON LICENCE / BACHELOR / ÉCOLES D'INGÉNIEURS
// ============================================================================

export const COMPARAISON_CRITERES = [
  'Coût',
  'Diplôme',
  'Poursuite en Master',
  'Corps enseignant',
  'Philosophie',
  'Sélection',
  'Durée',
  'Reconnaissance',
];

export const COMPARAISON_FORMATIONS: CompetenceVersusItem[] = [
  {
    critere: 'Coût de la formation',
    licence: '~170€/an + 100€ CVEC (gratuit pour boursiers)',
    bachelor: '6 000€ à 10 000€/an (20k-30k€ total)',
    ecoleIngenieur: '600€/an (publiques) ou 5 000€-15 000€/an (privées)',
  },
  {
    critere: 'Nature du diplôme',
    licence: 'Diplôme National de Licence (DNL). Grade de Licence conféré par l\'État. Reconnaissance européenne automatique.',
    bachelor: 'Souvent Titre RNCP Niveau 6. Reconnaissance académique variable selon l\'école.',
    ecoleIngenieur: 'Diplôme d\'Ingénieur (Grade Master). Label CTI pour écoles publiques. Équivalent Bac+5.',
  },
  {
    critere: 'Durée',
    licence: '3 ans (L1, L2, L3)',
    bachelor: '3 ans',
    ecoleIngenieur: '5 ans (2 ans prépa + 3 ans école) ou 3 ans (post-prépa/DUT)',
  },
  {
    critere: 'Poursuite en Master',
    licence: 'Accès de droit en Master universitaire. Passerelles possibles vers Écoles d\'Ingénieurs.',
    bachelor: 'Accès non automatique en Master universitaire public, souvent difficile. Poursuite vers Mastère (titre privé).',
    ecoleIngenieur: 'Diplôme final = Bac+5 (équivalent Master). Poursuite possible en Doctorat.',
  },
  {
    critere: 'Corps enseignant',
    licence: 'Enseignants-Chercheurs (Docteurs). Lien direct avec la recherche (L3i/MIA). Savoirs fondamentaux et durables.',
    bachelor: 'Intervenants Professionnels. Experts techniques du moment. Pédagogie pragmatique orientée "outils".',
    ecoleIngenieur: 'Enseignants-Chercheurs + Intervenants professionnels. Mix théorie/pratique.',
  },
  {
    critere: 'Philosophie',
    licence: 'Apprendre à apprendre. Focus sur les concepts (Algo, Logique) qui ne se démodent pas. Autonomie forte exigée.',
    bachelor: 'Savoir-faire immédiat. Focus sur les technos actuelles (React, AWS). "Employabilité à J+1". Encadrement type lycée.',
    ecoleIngenieur: 'Formation généraliste d\'ingénieur. Sciences fondamentales + compétences techniques + management. Polyvalence.',
  },
  {
    critere: 'Sélection',
    licence: 'Parcoursup. Dossier scolaire. Non sélectif géographiquement (sauf CMI qui est sélectif).',
    bachelor: 'Concours propre / Dossier. Souvent entretien de motivation.',
    ecoleIngenieur: 'Très sélectif. Concours (post-prépa), dossier + entretien (post-bac intégrées), ou admission parallèle.',
  },
  {
    critere: 'Reconnaissance professionnelle',
    licence: 'Reconnue pour postes techniques. Nécessite souvent Master pour postes à responsabilité.',
    bachelor: 'Très bien reconnu par entreprises pour postes opérationnels (développeur web). Peut limiter l\'évolution.',
    ecoleIngenieur: 'Reconnaissance maximale. Accès facilité aux postes d\'encadrement, R&D, international. Réseau alumni puissant.',
  },
];

// ============================================================================
// CMI vs ÉCOLE D'INGÉNIEUR
// ============================================================================

export const CMI_VS_ECOLE = {
  titre: 'CMI : L\'alternative universitaire aux Écoles d\'Ingénieurs',
  description: 'Le Cursus Master Ingénierie (CMI) est une formation sélective en 5 ans, adossée au Réseau Figure, qui concurrence directement les écoles d\'ingénieurs.',

  avantages_cmi: [
    {
      point: 'Coût très faible',
      detail: '~170€/an vs 600€-15000€/an en école',
      icon: '💰',
    },
    {
      point: 'Formation recherche forte',
      detail: 'Immersion en laboratoire (L3i, MIA) dès la Licence',
      icon: '🔬',
    },
    {
      point: 'Label Figure reconnu',
      detail: 'Équivalent au diplôme d\'ingénieur pour certains recruteurs',
      icon: '🎖️',
    },
    {
      point: 'Flexibilité universitaire',
      detail: 'Possibilité de bifurquer vers Master classique',
      icon: '🔄',
    },
  ],

  avantages_ecole: [
    {
      point: 'Réseau alumni puissant',
      detail: 'Associations d\'anciens élèves, stages facilités',
      icon: '🤝',
    },
    {
      point: 'Reconnaissance immédiate',
      detail: 'Titre d\'ingénieur largement reconnu en France et à l\'international',
      icon: '🌍',
    },
    {
      point: 'Encadrement structuré',
      detail: 'Suivi personnalisé, stages obligatoires dès la 1ère année',
      icon: '👥',
    },
    {
      point: 'Pluridisciplinarité',
      detail: 'Formation généraliste (sciences, management, langues)',
      icon: '📚',
    },
  ],

  conclusion: 'Le CMI offre une alternative crédible et économique aux écoles d\'ingénieurs, particulièrement pour les étudiants motivés par la recherche et l\'innovation. Les écoles conservent un avantage en termes de réseau et de reconnaissance "prestigieuse", mais le CMI comble cet écart grâce à son exigence académique et son label Figure.',
};

// ============================================================================
// ROI & ANALYSES
// ============================================================================

export const ROI_ANALYSES = {
  titre: 'Retour sur Investissement (ROI)',

  licence_vs_bachelor: {
    economie: '~25 000€ sur 3 ans',
    detail: 'Pour une qualité d\'enseignement souvent supérieure sur les fondamentaux grâce aux chercheurs du L3i.',
    justification_bachelor: [
      'Besoin d\'encadrement très serré ("maternage") que l\'université n\'offre pas',
      'Vise insertion professionnelle immédiate ultra-spécialisée (ex: Game Design)',
    ],
  },

  concepts_vs_outils: {
    universite: 'Enseigne la Science Informatique. Comment fonctionne un compilateur, théorie des graphes, complexité. Savoirs pérennes qui permettent l\'adaptation.',
    ecole_privee: 'Enseigne les Technologies Informatiques. Frameworks du moment. Efficace à court terme mais risque d\'obsolescence sans bases théoriques.',
  },
};

// ============================================================================
// PARCOURSUP 2026
// ============================================================================

export const PARCOURSUP_CALENDRIER: PhaseParcoursup[] = [
  {
    phase: 'Information',
    periode: 'Décembre 2025 - Janvier 2026',
    actions: [
      'Ouverture du site Parcoursup (17 décembre)',
      'Consultation des fiches formations',
      'Vérification des attendus (Spécialités Maths/NSI recommandées)',
      'Journées Portes Ouvertes (31 janvier 2026 à La Rochelle)',
    ],
  },
  {
    phase: 'Inscription & Vœux',
    periode: '19 Janvier - 12 Mars 2026',
    actions: [
      'Création du dossier',
      'Formulation des vœux (Licence Info et CMI = 2 vœux distincts)',
      'Conseil : Demander les deux pour maximiser les chances',
    ],
  },
  {
    phase: 'Confirmation',
    periode: 'Jusqu\'au 1er Avril 2026',
    actions: [
      'Date limite absolue pour finaliser le dossier',
      'Lettre de motivation (Projet de Formation Motivé)',
      'Rubrique "Activités" et bulletins',
      'Tout vœu non confirmé est supprimé',
    ],
  },
  {
    phase: 'Admission (Principale)',
    periode: '2 Juin - 11 Juillet 2026',
    actions: [
      'Réception des propositions',
      'Délais de réponse très courts (J+1 ou J+2)',
      'Être réactif !',
    ],
  },
  {
    phase: 'Phase Complémentaire',
    periode: '11 Juin - Septembre 2026',
    actions: [
      'Si aucun vœu accepté',
      'Postuler sur places vacantes',
    ],
  },
];

export const PARCOURSUP_REPONSES = [
  {
    type: 'OUI',
    description: 'Proposition d\'admission ferme',
    icon: '✅',
  },
  {
    type: 'OUI-SI',
    description: 'Admission conditionnée à un parcours adapté (L1 aménagée en 2 ans, modules de renforcement). Dispositif de réussite, pas une sanction.',
    icon: '⚠️',
  },
  {
    type: 'EN ATTENTE',
    description: 'Position sur liste d\'appel. La position évolue quotidiennement.',
    icon: '⏳',
  },
  {
    type: 'NON',
    description: 'Impossible pour Licence non sélective de secteur (si bachelier académie), mais possible pour CMI (sélectif) ou si capacité saturée.',
    icon: '❌',
  },
];

export const PARCOURSUP_STRATEGIE = {
  titre: 'Stratégie de vœux pour l\'Informatique',
  conseils: [
    {
      titre: 'Diversifier',
      description: 'Ne pas miser uniquement sur le CMI (très sélectif). Mettre la Licence classique en sécurité.',
      icon: '🎯',
    },
    {
      titre: 'Géographie',
      description: 'La priorité géographique est forte en Licence. Un étudiant de l\'Académie de Poitiers est prioritaire à La Rochelle.',
      icon: '📍',
    },
    {
      titre: 'Le Dossier',
      description: 'Pour l\'informatique, les notes de Mathématiques (et NSI si disponible) sont scrutées. Mentionner le L3i, le CMI ou l\'intérêt pour le LUDI est un vrai plus dans la lettre de motivation.',
      icon: '📝',
    },
  ],
};

// ============================================================================
// TRANSITION LYCÉE-UNIVERSITÉ
// ============================================================================

export const TRANSITION_INFO = {
  titre: 'La Transition Lycée-Université : Anticiper le Choc Culturel',
  taux_echec_l1: '~50% en France',
  cause: 'Défaut d\'adaptation au "métier d\'étudiant", pas difficulté intellectuelle',

  differences: [
    {
      aspect: 'Encadrement vs Autonomie',
      lycee: 'Présence contrôlée heure par heure, travail vérifié',
      universite: 'Liberté totale, personne ne vient chercher l\'étudiant qui sèche. Autodiscipline de fer requise.',
      icon: '🎓',
    },
    {
      aspect: 'Temps de Travail',
      lycee: 'Temps de cours majoritaire (~30-35h/semaine)',
      universite: 'Temps de cours : 20-25h/semaine. Temps de travail personnel : 20-25h/semaine minimum.',
      icon: '⏰',
    },
    {
      aspect: 'Relation aux Enseignants',
      lycee: 'Professeur proche, suivi individuel',
      universite: 'Enseignant-chercheur expert, exigeant, attend une posture d\'adulte.',
      icon: '👨‍🏫',
    },
  ],

  dispositifs_accompagnement: [
    {
      nom: 'Tutorat Étudiant',
      description: 'Étudiants de L3/Master accompagnent les L1 : méthodologie, révisions, usage de la BU.',
      type: 'Gratuit, flexible',
      icon: '🤝',
    },
    {
      nom: 'Enseignant Référent',
      description: 'Chaque L1 a un référent pour faire le point sur résultats et orientation.',
      type: 'Suivi individuel',
      icon: '👤',
    },
    {
      nom: 'Module ARP',
      description: 'Accompagnement à la Réussite de mon Projet : développement progressif de compétences pré-professionnelles. L1 (2 ECTS) : méthodologie universitaire et découverte des débouchés. L2 (1 ECTS) : marché de l\'emploi et réseau professionnel. L3 (1 ECTS) : recherche de stage, CV, entretiens.',
      type: 'Obligatoire L1, L2, L3',
      icon: '🎯',
    },
    {
      nom: 'Green Party',
      description: 'Événement incontournable de la rentrée étudiante, gratuit et 100% étudiant. Au programme : jeux ludiques, stands associations, scène étudiante, DJ, foodtrucks et bar. Événement éco-responsable labélisé (éco-cups, toilettes sèches, mobilité douce encouragée).',
      type: 'Début d\'année (septembre)',
      icon: '🎉',
    },
  ],
};
