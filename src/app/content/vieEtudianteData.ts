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
    details?: string[];
    participants?: string;
    icon?: string;
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
    { label: 'Étudiants total', value: '15 000', icon: '👥' },
    { label: 'À l\'université', value: '8 000', icon: '🎓' },
    { label: 'Classement villes', value: 'Top 3', icon: '🏆' },
    { label: 'Ensoleillement', value: '2250h/an', icon: '☀️' },
    { label: 'Équipements sportifs', value: '300+', icon: '🏟️' },
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
        name: 'Résidence Antinéa',
        type: 'Chambres et Studios',
        tarif: '150-450€/mois',
        description: 'Quartier des Minimes, proche IUT et UFR Droit. WiFi, gardien, équipements PMR'
    },
    {
        name: 'Résidence République',
        type: 'Chambres et Studios',
        tarif: '150-450€/mois',
        description: 'Quartier historique étudiant, accès direct au RU République, bien desservie par bus Yélo'
    },
    {
        name: 'Résidence Coureilles',
        type: 'Studios',
        tarif: '300-450€/mois',
        description: 'Rue de Coureilles, à proximité de l\'UFR Droit et Gestion et de l\'IUT'
    },
    {
        name: 'Résidence Aziyadé',
        type: 'Studios T1',
        tarif: '300-450€/mois',
        description: 'T1 meublés équipés de kitchenette et sanitaires individuels (19-26m²)'
    },
    {
        name: 'Résidence Ville en Bois',
        type: 'Studios',
        tarif: '300-450€/mois',
        description: 'Avenue des Amériques, logements meublés, salle de travail, salle TV, laverie'
    },
    {
        name: 'Résidence Jean Jouzel',
        type: 'Studios',
        tarif: '300-450€/mois',
        description: 'Rue de Coureilles, logements récents et modernes'
    },
];

export const AUTRES_LOGEMENTS: ServiceInfo[] = [
    {
        name: 'ARHPEJ',
        icon: '🏠',
        description: 'Plus de 650 logements au cœur du campus, près du centre-ville et du Vieux-Port. Nouvelle résidence Hélios (132 logements, septembre 2025)',
        tarif: 'Studios 281€, T1 Bis 377€, T2 438€',
        details: [
            'Résidence Parc de la Francophonie (Alcyon, Calypso)',
            'Résidence Amérigo Vespucci (180 logements, domotique)',
            'Résidence Le Platin (front de mer)',
            'Résidence Lavoisier (quartier calme, balcons)',
            'Résidence Hélios (132 logements neufs, normes HQE)',
            'Services : Internet fibre, veilleur de nuit, laverie (3,50€)'
        ],
        contact: 'accueil@arhpej.fr - 05 46 45 95 00'
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
        horaires: 'Lun-Ven 11h30-14h',
        tarif: 'Self et vente à emporter'
    },
    {
        name: 'RU République',
        localisation: '90 bd de la République (près Droit/IAE)',
        horaires: 'Lun-Ven 11h30-14h',
        tarif: 'Self et vente à emporter'
    },
    {
        name: 'Brasserie Antinéa',
        localisation: '15 rue François de Vaux de Foletier (près IUT)',
        horaires: 'Lun-Ven 11h30-13h45',
        tarif: 'Self'
    },
    {
        name: 'So What',
        localisation: '15 rue François de Vaux de Foletier (même bâtiment qu\'Antinéa)',
        horaires: 'Lun-Ven 9h-15h30',
        tarif: 'Restauration rapide diversifiée : grillades, salades, pâtes, pizzas, sandwichs, hamburgers'
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
        description: 'Grand tournoi de sports collectifs pour accueillir les nouveaux étudiants',
        periode: 'Septembre',
        icon: '🌱',
        details: [
            'Tournois multi-sports : football, basket, volley, handball',
            'Journée d\'intégration et de convivialité',
            'Ouvert à tous les niveaux, débutants bienvenus',
            'Remise de prix et goodies'
        ],
        participants: '200+ étudiants'
    },
    {
        nom: 'Mille Sabords',
        description: 'Raid urbain aquatique unique aux Minimes - Épreuve emblématique rochelaise',
        periode: 'Printemps',
        icon: '🏴‍☠️',
        details: [
            'Parcours d\'obstacles urbains et nautiques',
            'Épreuves en équipe dans le port des Minimes',
            'Combinaison course à pied, kayak, et défis aquatiques',
            'Ambiance festive garantie, costumes de pirates encouragés',
            'Plus de 30 ans d\'histoire'
        ],
        participants: '150+ équipes'
    },
    {
        nom: 'Croisière de fin d\'année',
        description: 'Navigation exceptionnelle dans les pertuis rochelais - Activité unique en France métropolitaine',
        periode: 'Juin',
        icon: '⛵',
        details: [
            'Sortie en voilier dans l\'océan Atlantique',
            'Découverte de Fort Boyard et des îles (Ré, Aix)',
            'Encadrement par des moniteurs diplômés',
            'Accessible aux débutants, initiation à la voile',
            'Moment privilégié de cohésion entre étudiants',
            'Apéritif en mer et pique-nique'
        ],
        participants: '100+ étudiants par session'
    },
    {
        nom: 'Les Nuits',
        description: 'Tournois nocturnes spectaculaires dans une ambiance électrique',
        periode: 'Toute l\'année',
        icon: '🌙',
        details: [
            'Nuit du Volley, du Hand, du Badminton, du Basket',
            'Tournois en continu de 18h à minuit',
            'Éclairage spécial, musique, ambiance festive',
            'Mix étudiants/personnels/anciens',
            'Buvette et restauration sur place'
        ],
        participants: '80-120 par nuit'
    },
    {
        nom: 'IUT Beach Tour',
        description: 'Tournoi Beach Volley sur les plages de l\'Île de Ré',
        periode: 'Mai-Juin',
        icon: '🏖️',
        details: [
            'Compétition inter-IUT sur sable',
            'Cadre exceptionnel face à l\'océan',
            'Tournoi par équipes mixtes',
            'Journée complète : compétition + détente plage',
            'Transport organisé depuis le campus'
        ],
        participants: '30+ équipes'
    },
    {
        nom: 'Challenge nautique',
        description: 'Compétitions de voile régulières - Profitez de l\'océan toute l\'année',
        periode: 'Printemps/Été',
        icon: '🏆',
        details: [
            'Régates inter-universitaires',
            'Formation continue en école de voile partenaire',
            'Championnats universitaires de voile',
            'Possibilité de passer des certifications (permis mer)',
            'Matériel fourni : dériveurs, catamarans'
        ],
        participants: 'Variable'
    },
];

export const SPORTS_MER_SPECIFICITY = {
    titre: '🌊 La Rochelle : Destination sportive nautique d\'exception',
    description: 'La Rochelle est l\'une des rares universités françaises à proposer une gamme complète de sports du littoral intégrés au cursus universitaire. Situé à quelques minutes de la plage des Minimes et du plus grand port de plaisance de la côte atlantique.',
    climat: {
        titre: 'Un climat idéal pour le sport',
        description: 'Plus de 2 250 heures de soleil par an - Le meilleur ensoleillement du littoral atlantique',
        details: ['Climat quasi-méditerranéen', 'Hivers doux (4 jours de neige/an)', 'Pratique extérieure toute l\'année']
    },
    avantages: [
        'Campus à quelques minutes de la plage des Minimes',
        'Plus grand port de plaisance de la côte atlantique',
        'Partenariats : Centre Nautique des Minimes, École de Voile Rochelaise',
        'Centre Nautique d\'Angoulins (bassin intérieur débutants)',
        'Matériel nautique fourni (voiliers, kayaks, planches)',
        'Moniteurs diplômés d\'État',
        'Conditions météo exceptionnelles (2250h de soleil/an)',
        'Terrain de jeu unique : Fort Boyard, Île de Ré, Pertuis d\'Antioche',
        'Ville labellisée "Ville Active et Sportive"',
        '300 sites et équipements sportifs dans la ville'
    ],
    activites: [
        'Voile (dériveur, catamaran, habitable)',
        'Surf',
        'Planche à voile',
        'Aviron de mer',
        'Kitesurf',
        'Pirogue polynésienne',
        'Plongée sous-marine'
    ],
    validationCursus: 'Ces activités peuvent être validées en bonification dans le diplôme !'
};

export const SUAPSE_INFO = {
    localisation: 'Halle Universitaire de Bongraine, Avenue de la Rotonde, 17440 Aytré',
    contact: '05 46 45 18 94',
    site: 'mon-espace-suapse.univ-lr.fr',
    activites: '40+',
    tarif: 'Carte SUAPSE via application CARTUM',
    validation: 'Deux modes : Bonification (compte pour le diplôme) ou Loisir (pratique personnelle)',
    competitions: 'Coupe de France des IUT, Championnat de France, Challenge régional Poitou-Charentes',
    sportHautNiveau: '50 sportifs de haut niveau accueillis chaque année',
    infrastructures: {
        surfaceTotale: '1 900 m²',
        salleMultisports: '1 104 m² (basket, hand, volley, badminton, tennis)',
        musculation: '180 m², 18 postes cardio-training',
        danse: 'Salle en parquet',
        squash: '2 courts en parquet',
        vestiaires: '3 vestiaires avec douches',
        labelHQE: 'Démarche Haute Qualité Environnementale'
    },
    formations: ['BNSSA', 'PSC 1', 'PSE 1 et PSE 2', 'Recyclage secourisme']
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
        description: 'LE rendez-vous culturel étudiant de l\'année - Plus de 25 ans de tradition',
        periode: 'Printemps (Mai-Juin)',
        icon: '🎭',
        details: [
            'Restitutions publiques de TOUS les ateliers artistiques de l\'année',
            'Spectacles de théâtre, danse, concerts, expositions photos',
            'Scène ouverte pour tous les artistes étudiants',
            'Plusieurs soirées de programmation sur 2-3 semaines',
            'Gratuit et ouvert à tous (étudiants, personnels, grand public)',
            'Plus de 200 artistes étudiants sur scène',
            'Moment fort de cohésion et de fierté pour la communauté étudiante'
        ],
        participants: '1000+ spectateurs'
    },
    {
        nom: 'Ma Thèse en 180 secondes (MT180)',
        description: 'Concours national de vulgarisation scientifique - Épreuve d\'éloquence',
        periode: 'Mars-Avril',
        icon: '🎤',
        details: [
            'Doctorants présentent leur recherche en 3 minutes chrono',
            'Finale locale puis régionale, possibilité d\'aller en finale nationale',
            'Une seule diapositive autorisée, langage accessible au grand public',
            'Jury mixte : scientifiques + grand public',
            'Développe des compétences en communication scientifique',
            'Événement festif et pédagogique',
            'Retransmis en live'
        ],
        participants: '15-20 candidats'
    },
    {
        nom: 'Fête de la Science',
        description: 'Événement national avec thématique annuelle - Science pour tous',
        periode: 'Octobre',
        icon: '🔬',
        details: [
            'Village des sciences sur le campus',
            'Ateliers interactifs, expériences ludiques, conférences',
            'Thématique changeante (Intelligence(s), Climat, Biodiversité...)',
            'Collaboration laboratoires L3i et MIA',
            'Ouvert aux scolaires et au grand public',
            'Les étudiants peuvent animer des stands',
            'Découverte des métiers de la recherche'
        ],
        participants: '2000+ visiteurs'
    },
    {
        nom: 'Festival "Ici en Corée"',
        description: 'Immersion totale dans la culture coréenne moderne et traditionnelle',
        periode: 'Variable (Automne)',
        icon: '🇰🇷',
        details: [
            'Projections de films coréens en VOST',
            'Ateliers K-pop, calligraphie, cuisine coréenne',
            'Conférences sur la société coréenne contemporaine',
            'Stands gastronomiques (bibimbap, kimchi, tteokbokki)',
            'Démonstrations d\'arts martiaux (Taekwondo)',
            'Concert K-pop par des étudiants',
            'Liens avec les partenariats universitaires en Corée du Sud'
        ],
        participants: '500+ personnes'
    },
    {
        nom: 'Ciné-Club étudiant',
        description: 'Projections mensuelles suivies de débats cinéphiles',
        periode: 'Toute l\'année',
        icon: '🎬',
        details: [
            'Séances régulières à la Maison de l\'Étudiant (salle 500 places)',
            'Programmation éclectique : classiques, films d\'auteur, documentaires',
            'Débats animés après projection',
            'Tarif préférentiel ou gratuit pour les étudiants',
            'Parfois en présence de réalisateurs ou acteurs',
            'Thématiques mensuelles (cinéma coréen, SF, écologie...)'
        ],
        participants: '50-150 par séance'
    },
    {
        nom: 'Rencontres LUDI',
        description: 'Science et société : conférences-débats sur les enjeux contemporains',
        periode: 'Variable (4-5 par an)',
        icon: '💬',
        details: [
            'Format interactif : conférence courte + débat long',
            'Thématiques variées : IA, climat, santé, numérique responsable',
            'Intervenants experts (chercheurs, professionnels, associations)',
            'Échanges entre sciences "dures" et sciences humaines',
            'Ouvert à tous, gratuit',
            'Buffet convivial après la rencontre'
        ],
        participants: '80-120 par rencontre'
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
// SANTÉ MENTALE ET ACCOMPAGNEMENT
// ============================================================================
export const SANTE_MENTALE_INFO = {
    titre: '🧠 Santé mentale : Un enjeu majeur de la réussite universitaire',
    contexteLicence: {
        titre: 'La transition vers l\'autonomie : un défi pour tous',
        description: 'La licence est une période de changements profonds qui peut s\'avérer difficile. L\'autonomie nouvellement acquise, si elle est libératrice, peut aussi être source de stress et d\'anxiété.',
        defis: [
            {
                titre: 'Gestion de l\'autonomie',
                description: 'Organisation du travail, gestion du temps, motivation personnelle',
                icon: '📚'
            },
            {
                titre: 'Éloignement familial',
                description: 'Première expérience loin de chez soi, solitude, nostalgie',
                icon: '🏠'
            },
            {
                titre: 'Pression académique',
                description: 'Volume de travail, examens, peur de l\'échec, doutes sur l\'orientation',
                icon: '⚡'
            },
            {
                titre: 'Précarité financière',
                description: 'Budget serré, job étudiant, difficultés à se loger ou se nourrir',
                icon: '💰'
            },
            {
                titre: 'Isolement social',
                description: 'Difficulté à créer de nouveaux liens, sentiment de ne pas appartenir',
                icon: '😔'
            }
        ]
    },
    chiffres: [
        { label: 'Des étudiants', value: '1/3', description: 'déclarent souffrir de solitude' },
        { label: 'Des étudiants', value: '20%', description: 'présentent des symptômes dépressifs' },
        { label: 'Des étudiants', value: '60%', description: 'se sentent stressés régulièrement' },
    ],
    message: 'Demander de l\'aide n\'est PAS un signe de faiblesse, mais une preuve de courage et de maturité. Les services sont là POUR vous, utilisez-les sans hésitation.'
};

export const ACCOMPAGNEMENT_PSY: ServiceInfo[] = [
    {
        name: 'Consultations psychologiques',
        icon: '🧠',
        description: 'Psychologues cliniciens disponibles sur le campus',
        details: [
            'Consultations GRATUITES et CONFIDENTIELLES',
            '3 à 6 séances selon les besoins',
            'Écoute bienveillante et sans jugement',
            'Accompagnement pour stress, anxiété, dépression',
            'Aide à la gestion des émotions',
            'Prise de rendez-vous rapide (sous 1 semaine)'
        ],
        contact: '05 46 45 82 48',
        horaires: 'Lun-Ven 9h-17h'
    },
    {
        name: 'Plateforme Nightline',
        icon: '🌙',
        description: 'Service d\'écoute nocturne par et pour les étudiants',
        details: [
            'Disponible en soirée et la nuit',
            'Écoute par des étudiants formés',
            'Anonyme et confidentiel',
            'Pour parler de tout : études, relations, mal-être',
            'Pas de conseil, juste une oreille attentive'
        ],
        contact: 'nightline.fr'
    },
    {
        name: 'Groupes de parole',
        icon: '💬',
        description: 'Ateliers collectifs thématiques',
        details: [
            'Gestion du stress et de l\'anxiété',
            'Confiance en soi',
            'Procrastination et motivation',
            'Sommeil et équilibre de vie',
            'Animés par des psychologues',
            'Gratuit, sur inscription'
        ],
        horaires: 'Sessions mensuelles'
    },
    {
        name: 'Numéros d\'urgence',
        icon: '🆘',
        description: 'En cas de détresse immédiate',
        details: [
            'Fil Santé Jeunes : 0 800 235 236 (gratuit, anonyme, 7j/7)',
            'SOS Amitié : 09 72 39 40 50 (24h/24, 7j/7)',
            '3114 : Numéro national de prévention du suicide (gratuit, 24h/24)',
            'SAMU : 15 (urgence vitale)'
        ]
    },
    {
        name: 'Accompagnement à la réussite',
        icon: '🎯',
        description: 'Aide méthodologique et pédagogique',
        details: [
            'Ateliers "Apprendre à apprendre"',
            'Gestion du temps et organisation',
            'Préparation aux examens',
            'Techniques de mémorisation',
            'Lutte contre la procrastination',
            'Tutorat par des étudiants de L3/Master'
        ]
    }
];

export const PREVENTION_INFO = {
    titre: 'Actions de prévention',
    actions: [
        {
            nom: 'Semaine de la Santé Mentale',
            description: 'Événement annuel de sensibilisation et d\'information',
            periode: 'Mars',
            activites: ['Conférences', 'Ateliers bien-être', 'Stands associatifs', 'Sophrologie', 'Yoga gratuit']
        },
        {
            nom: 'Permanences bien-être',
            description: 'Ateliers réguliers sur le campus',
            activites: ['Méditation pleine conscience', 'Relaxation', 'Sophrologie', 'Gestion du stress']
        }
    ],
    conseils: [
        'N\'attendez pas d\'être au bout du rouleau pour consulter',
        'Parlez-en à vos proches, vos amis, votre famille',
        'Maintenez un équilibre vie étudiante / vie personnelle',
        'Pratiquez une activité sportive régulière (SUAPSE gratuit)',
        'Gardez un rythme de sommeil régulier',
        'Ne vous isolez pas : associations, BDE, activités culturelles'
    ]
};

// ============================================================================
// SANTÉ PHYSIQUE ET SERVICES
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
