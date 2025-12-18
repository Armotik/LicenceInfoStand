// ============================================================================
// DONNÉES OFFICIELLES - VIE ÉTUDIANTE À LA ROCHELLE UNIVERSITÉ
// Source: Rapport Vie Étudiante La Rochelle
// ============================================================================

// Types pour la structure des données
export interface VieEtudianteStat {
    label: string;
    value: string | number;
    icon: string;
}

export interface ServiceInfo {
    name: string;
    icon: string;
    description: string;
    details?: string[];
    tarif?: string;
    contact?: string;
    horaires?: string;
}

export interface Residence {
    name: string;
    type: string;
    capacite?: string;
    tarif: string;
    description?: string;
}

export interface Restaurant {
    name: string;
    localisation: string;
    horaires: string;
    tarif?: string;
}

export interface ActiviteSportive {
    categorie: string;
    activites: string[];
    icon: string;
}

export interface EvenementSportif {
    nom: string;
    description: string;
    periode?: string;
}

export interface AtelierCulturel {
    nom: string;
    type: 'MAXI' | 'MÉDI' | 'MINI';
    description: string;
}

export interface Association {
    nom: string;
    type: string;
    description: string;
    icon: string;
}

export type VieEtudianteSection =
    | 'overview'
    | 'logement'
    | 'restauration'
    | 'sport'
    | 'culture'
    | 'associations'
    | 'services';

export interface VieEtudianteSectionItem {
    id: VieEtudianteSection;
    title: string;
    icon: string;
}

// ============================================================================
// STATISTIQUES GÉNÉRALES
// ============================================================================
export const VIE_ETUDIANTE_STATS: VieEtudianteStat[] = [
    { label: 'Étudiants', value: '14 000', icon: '👥' },
    { label: 'Classement villes', value: 'Top 3', icon: '🏆' },
    { label: 'Recommandation', value: '95%', icon: '⭐' },
    { label: 'Cadre de vie', value: '2ème', icon: '🌟' },
    { label: 'Pistes cyclables', value: '100+ km', icon: '🚴' },
    { label: 'Activités sport', value: '40+', icon: '⚽' },
];

// ============================================================================
// ATOUTS DE LA ROCHELLE
// ============================================================================
export const ATOUTS_ROCHELLE = [
    { icon: '🌊', titre: 'Campus en bord de mer', description: 'Situé entre océan et centre historique' },
    { icon: '🚴', titre: 'Ville à taille humaine', description: 'Tout accessible à pied ou vélo' },
    { icon: '🌱', titre: 'Pionnière écologique', description: 'Laboratoire de l\'écologie urbaine' },
    { icon: '🏰', titre: 'Patrimoine exceptionnel', description: 'Vieux-Port, tours médiévales, Fort Boyard' },
    { icon: '🎭', titre: 'Événements culturels', description: 'Francofolies, festivals, vie nocturne' },
    { icon: '☀️', titre: 'Climat océanique doux', description: 'Airs de vacances toute l\'année' },
];

// ============================================================================
// LOGEMENT
// ============================================================================
export const RESIDENCES_CROUS: Residence[] = [
    {
        name: 'Cité Antinéa',
        type: 'Chambres',
        capacite: '252',
        tarif: '200-300€/mois',
        description: '9-12m², meublées, cuisine collective'
    },
    {
        name: 'Résidence Aziyadé',
        type: 'Studios',
        tarif: '250-350€/mois',
        description: 'Studios privés avec kitchenette'
    },
    {
        name: 'Résidence Ville en Bois',
        type: 'Studios',
        tarif: '250-350€/mois',
        description: 'Studios meublés et équipés'
    },
    {
        name: 'Résidence Jean Jouzel',
        type: 'Studios',
        tarif: '250-350€/mois',
        description: 'Résidence récente et moderne'
    },
];

export const AUTRES_LOGEMENTS: ServiceInfo[] = [
    {
        name: 'ARHPEJ',
        icon: '🏠',
        description: 'Plus de 600 logements au cœur du campus et près du Vieux-Port',
        tarif: '350-500€/mois'
    },
    {
        name: 'CLLAJ',
        icon: '🏘️',
        description: 'Comité Local pour le Logement Autonome des Jeunes',
        details: ['Accompagnement personnalisé', 'Aide à la recherche', 'Conseils']
    },
    {
        name: 'Studapart',
        icon: '💻',
        description: 'Partenaire officiel de l\'Université pour les logements privés',
        details: ['Studios', 'Colocations', 'Appartements']
    },
];

export const AIDES_LOGEMENT: ServiceInfo[] = [
    {
        name: 'APL',
        icon: '💰',
        description: 'Aide Personnalisée au Logement (CAF)',
        details: ['Selon ressources', 'Versée directement ou au propriétaire']
    },
    {
        name: 'Visale',
        icon: '🛡️',
        description: 'Garantie locative gratuite pour les moins de 30 ans',
        details: ['Remplace la caution parentale', 'Sans condition de ressources']
    },
    {
        name: 'DSE',
        icon: '📝',
        description: 'Dossier Social Étudiant',
        details: ['À remplir dès le 20 janvier', 'Pour bourses et logement CROUS']
    },
];

// ============================================================================
// RESTAURATION
// ============================================================================
export const RESTAURANTS_UNIVERSITAIRES: Restaurant[] = [
    {
        name: 'RU Vespucci',
        localisation: 'Rue du Loup Marin (près LLASH et MDE)',
        horaires: 'Lun-Ven 11h30-14h'
    },
    {
        name: 'RU République',
        localisation: '90 bd de la République (près Droit/IAE)',
        horaires: 'Lun-Ven 11h30-14h'
    },
    {
        name: 'Brasserie Antinéa',
        localisation: 'Résidence Antinéa',
        horaires: 'Lun-Ven 11h30-14h'
    },
    {
        name: 'So What',
        localisation: '15 rue Vaux de Foletier (près IUT)',
        horaires: 'Lun-Ven 11h30-14h'
    },
];

export const TARIFS_RESTAURATION = {
    boursiers: '1€',
    nonBoursiers: '3,30€',
    premium: {
        boursiers: '2,80€',
        nonBoursiers: '5,10€'
    }
};

export const SERVICES_RESTAURATION: ServiceInfo[] = [
    {
        name: 'Click&Crous',
        icon: '📱',
        description: 'Commande de plateaux repas pour le soir',
        details: ['Commande en ligne', 'Retrait en RU']
    },
    {
        name: 'Carte IZLY',
        icon: '💳',
        description: 'Carte de paiement rechargeable',
        details: ['Rechargeable via app ou en ligne', 'Acceptée dans tous les RU']
    },
    {
        name: 'Options alimentaires',
        icon: '🥗',
        description: 'Choix variés et adaptés',
        details: ['Bio', 'Végétarien', 'Sans gluten', 'Commerce équitable']
    },
];

// ============================================================================
// SPORT - SUAPSE
// ============================================================================
export const ACTIVITES_SPORTIVES: ActiviteSportive[] = [
    {
        categorie: 'Sports collectifs',
        icon: '⚽',
        activites: ['Basket', 'Football', 'Handball', 'Rugby', 'Volley', 'Ultimate']
    },
    {
        categorie: 'Sports de raquettes',
        icon: '🏸',
        activites: ['Badminton', 'Tennis', 'Tennis de table', 'Squash', 'Padel']
    },
    {
        categorie: 'Sports du littoral',
        icon: '⛵',
        activites: ['Voile', 'Surf', 'Aviron de mer', 'Kite surf', 'Pirogue']
    },
    {
        categorie: 'Sports d\'opposition',
        icon: '🥋',
        activites: ['Boxe française', 'Judo', 'Karaté', 'Taekwondo', 'Kendo']
    },
    {
        categorie: 'Sports individuels',
        icon: '🏃',
        activites: ['Athlétisme', 'Escalade', 'Natation', 'Tir à l\'arc']
    },
    {
        categorie: 'Activités d\'entretien',
        icon: '💪',
        activites: ['Musculation', 'Fitness', 'Course à pied']
    },
    {
        categorie: 'Activités d\'expression',
        icon: '💃',
        activites: ['Danse moderne', 'Hip-hop', 'Danse contemporaine', 'Danse tahitienne']
    },
];

export const EVENEMENTS_SPORTIFS: EvenementSportif[] = [
    {
        nom: 'Green Day',
        description: 'Grand tournoi de sports collectifs à la rentrée',
        periode: 'Septembre'
    },
    {
        nom: 'Mille Sabords',
        description: 'Raid urbain aquatique aux Minimes',
        periode: 'Printemps'
    },
    {
        nom: 'Croisière de fin d\'année',
        description: 'Navigation dans les pertuis rochelais',
        periode: 'Juin'
    },
    {
        nom: 'Les Nuits',
        description: 'Nuit du volley, hand, badminton, basket, 3 raquettes',
        periode: 'Toute l\'année'
    },
    {
        nom: 'IUT Beach Tour',
        description: 'Tournoi Beach Volley sur l\'Île de Ré',
        periode: 'Été'
    },
    {
        nom: 'Challenge nautique',
        description: 'Compétitions de voile',
        periode: 'Printemps/Été'
    },
];

export const SUAPSE_INFO = {
    localisation: 'Gymnase universitaire de Bongraine, Avenue de la Rotonde, 17440 Aytré',
    contact: '05 46 45 18 94',
    activites: '40+',
    tarif: 'Adhésion annuelle SUAPSE',
    validation: 'Bonification possible dans le cursus (EC libre)',
    competitions: 'Coupe de France des IUT, championnats universitaires'
};

// ============================================================================
// CULTURE - MAISON DE L'ÉTUDIANT
// ============================================================================
export const ESPACE_CULTURE_INFO = {
    localisation: 'Quartier BU/FLASH, 3 passage Jacqueline de Romilly',
    contact: '05 16 49 67 76',
    email: 'culture@univ-lr.fr',
    reseau: 'Art+Université+Culture'
};

export const EQUIPEMENTS_CULTURELS: ServiceInfo[] = [
    {
        name: 'Salle de spectacles',
        icon: '🎭',
        description: '500 places debout / 196 assises',
        details: ['Spectacles étudiants', 'Concerts', 'Théâtre']
    },
    {
        name: 'Open-space associations',
        icon: '🤝',
        description: 'Espace de travail collaboratif',
        details: ['Réunions', 'Projets collectifs']
    },
    {
        name: 'Laboratoire photo',
        icon: '📷',
        description: 'Développement argentique',
        details: ['Matériel professionnel', 'Encadrement']
    },
    {
        name: 'Salle de musique',
        icon: '🎵',
        description: 'Sur réservation',
        details: ['Répétitions', 'Enregistrement']
    },
    {
        name: 'Espace exposition',
        icon: '🖼️',
        description: 'Expositions temporaires',
        details: ['Artistes étudiants', 'Invités']
    },
    {
        name: 'Bar/salon',
        icon: '☕',
        description: 'Lieu de convivialité',
        details: ['Rencontres', 'Détente']
    },
];

export const ATELIERS_ARTISTIQUES = [
    'Théâtre', 'Écriture de plateau', 'Photographie argentique',
    'Chant', 'Chorale électro-pop', 'Dessin', 'Arts numériques',
    'Danse', 'Vidéo/documentaire', 'Astronomie'
];

export const EVENEMENTS_CULTURELS: EvenementSportif[] = [
    {
        nom: 'Festival "Les Étudiants à l\'Affiche"',
        description: '+25 ans d\'existence, restitutions des ateliers',
        periode: 'Printemps'
    },
    {
        nom: 'Ma Thèse en 180 secondes',
        description: 'Concours de vulgarisation scientifique',
        periode: 'Mars'
    },
    {
        nom: 'Fête de la Science',
        description: 'Thématique annuelle (ex: Intelligence(s))',
        periode: 'Octobre'
    },
    {
        nom: 'Festival "Ici en Corée"',
        description: 'Célébration de la culture coréenne',
        periode: 'Variable'
    },
    {
        nom: 'Ciné-Club étudiant',
        description: 'Projections régulières',
        periode: 'Toute l\'année'
    },
    {
        nom: 'Rencontres LUDI',
        description: 'Science et société',
        periode: 'Variable'
    },
];

export const SUPER_PASS_INFO = {
    tarif: 'GRATUIT',
    beneficiaires: [
        'La Rochelle Université',
        'EIGSI',
        'Excelia',
        'CESI',
        'IFSI La Rochelle'
    ],
    avantages: [
        '+300 spectacles, concerts, expositions',
        'Tarifs exceptionnels (+20 lieux partenaires)',
        'La Coursive (Scène Nationale) incluse',
        'Cinémas, musées, festivals'
    ],
    retrait: 'Maison de l\'Étudiant (avec carte étudiant)'
};

// ============================================================================
// ASSOCIATIONS ÉTUDIANTES
// ============================================================================
export const BDE_PAR_COMPOSANTE: Association[] = [
    {
        nom: 'BDE Informatique IUT',
        type: 'BDE',
        description: 'Bureau des étudiants du département Informatique',
        icon: '💻'
    },
    {
        nom: 'BDE Sciences',
        type: 'BDE',
        description: 'Maison des Sciences de l\'Ingénieur',
        icon: '🔬'
    },
    {
        nom: 'BDE Droit',
        type: 'BDE',
        description: 'Faculté de Droit et Sciences Politiques',
        icon: '⚖️'
    },
    {
        nom: 'BDE IAE',
        type: 'BDE',
        description: 'Institut d\'Administration des Entreprises',
        icon: '💼'
    },
    {
        nom: 'BEER',
        type: 'BDE',
        description: 'Bureau de l\'Ensemble des Étudiants Rochelais',
        icon: '🎉'
    },
];

export const ASSOCIATIONS_THEMATIQUES: Association[] = [
    {
        nom: 'AGIR',
        type: 'Technique',
        description: 'Association du Génie Informatique Rochelais',
        icon: '⚙️'
    },
    {
        nom: 'Uni\'Vert',
        type: 'Écologie',
        description: 'Développement durable et sensibilisation environnement',
        icon: '🌱'
    },
    {
        nom: 'Efficience',
        type: 'Représentation',
        description: 'Représentation étudiante et politique universitaire',
        icon: '🗳️'
    },
    {
        nom: 'La Voix Étudiante',
        type: 'Représentation',
        description: 'Organisation étudiante locale',
        icon: '📢'
    },
    {
        nom: 'AROBAS',
        type: 'Technique',
        description: 'Association Robotique IUT',
        icon: '🤖'
    },
];

export const ENGAGEMENT_INFO = {
    fdsie: {
        nom: 'FDSIE',
        description: 'Fonds de Soutien aux Initiatives Étudiantes',
        frequence: '3 commissions par an'
    },
    bonus: {
        nom: 'Bonus Engagement Étudiant',
        description: 'Valorisation de l\'engagement dans le cursus'
    }
};

// ============================================================================
// SANTÉ ET SERVICES
// ============================================================================
export const SERVICES_SANTE: ServiceInfo[] = [
    {
        name: 'Consultations médicales',
        icon: '🏥',
        description: 'Médecin généraliste',
        details: ['Gratuit', 'Sur rendez-vous', 'Confidentiel']
    },
    {
        name: 'Suivi gynécologique',
        icon: '👩‍⚕️',
        description: 'Contraception et suivi',
        details: ['Gratuit', 'Confidentiel']
    },
    {
        name: 'Acupuncture',
        icon: '💆',
        description: 'Stress, sommeil, addictions',
        details: ['Gratuit', 'Sur rendez-vous']
    },
    {
        name: 'Vaccinations',
        icon: '💉',
        description: 'Tous types de vaccins',
        details: ['Gratuit ou remboursé']
    },
    {
        name: 'Accompagnement',
        icon: '🤝',
        description: 'Addictologie et prévention',
        details: ['Gratuit', 'Confidentiel', 'Personnalisé']
    },
];

export const SERVICE_SOCIAL_INFO = {
    localisation: '44 avenue Albert Einstein',
    services: [
        'Information sur financements et aides',
        'Montage dossiers d\'aide financière',
        'Accompagnement difficultés personnelles',
        'Orientation vers structures adaptées',
        'Gestion ruptures familiales'
    ],
    contact: 'Sur rendez-vous'
};

export const HANDICAP_INFO = {
    nom: 'Relais Handicap',
    services: [
        'Accompagnement personnalisé',
        'Aménagements spécifiques des études',
        'Politique volontariste d\'inclusion',
        'Label d\'exemplarité visé'
    ]
};

// ============================================================================
// COÛT DE LA VIE
// ============================================================================
export const BUDGET_MENSUEL = {
    logement: { min: 400, max: 550 },
    alimentation: { min: 200, max: 250 },
    transports: { min: 30, max: 50 },
    telephoneInternet: { min: 30, max: 50 },
    loisirs: { min: 50, max: 100 },
    total: { estimation: '~800€/mois' }
};

export const AIDES_FINANCIERES: ServiceInfo[] = [
    {
        name: 'Bourse CROUS',
        icon: '🎓',
        description: 'Jusqu\'à ~600€/mois (échelon max)',
        details: ['Selon ressources familiales', '7 échelons', 'DSE obligatoire']
    },
    {
        name: 'APL',
        icon: '🏠',
        description: 'Variable selon situation',
        details: ['Aide au logement', 'CAF']
    },
    {
        name: 'Aide au mérite',
        icon: '🏆',
        description: 'Complément de bourse',
        details: ['Mention TB au bac', 'Complément mensuel']
    },
    {
        name: 'Aide mobilité internationale',
        icon: '✈️',
        description: 'Pour séjours à l\'étranger',
        details: ['Erasmus+', 'Bourses régionales']
    },
    {
        name: 'Prêt étudiant garanti État',
        icon: '🏦',
        description: 'Sans caution parentale (-28 ans)',
        details: ['Jusqu\'à 20 000€', 'Taux préférentiel']
    },
];

// ============================================================================
// SECTIONS DE NAVIGATION
// ============================================================================
export const VIE_ETUDIANTE_SECTIONS: VieEtudianteSectionItem[] = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: '🏠' },
    { id: 'logement', title: 'Logement', icon: '🏘️' },
    { id: 'restauration', title: 'Restauration', icon: '🍽️' },
    { id: 'sport', title: 'Sport', icon: '⚽' },
    { id: 'culture', title: 'Culture', icon: '🎭' },
    { id: 'associations', title: 'Associations', icon: '🤝' },
    { id: 'services', title: 'Services', icon: '🏥' },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function getTotalActivitesSport(): number {
    return ACTIVITES_SPORTIVES.reduce((acc, cat) => acc + cat.activites.length, 0);
}

export function getTotalAssociations(): number {
    return BDE_PAR_COMPOSANTE.length + ASSOCIATIONS_THEMATIQUES.length;
}
