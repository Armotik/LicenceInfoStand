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
    logo?: string;
    contact?: {
        email?: string;
        instagram?: string;
    };
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
    { icon: '🔬', titre: 'LUDI - Innovation urbaine', description: 'Laboratoire du Littoral Urbain, Durable et Intelligent' },
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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

export const TARIFS_SPORT = {
    voile: {
        annuel: '95€',
        boursier: '50€',
        semestriel: '50€',
        description: 'Cotisation annuelle pour la pratique de la voile'
    },
    musculation: {
        annuel: '55€',
        boursier: '40€',
        description: 'Cotisation annuelle - Serviette fournie et obligatoire'
    },
    passportInfo: {
        titre: 'Pass\'Sport',
        montant: '70€',
        description: 'Le Pass\'Sport est une aide financière de 70 € par jeune éligible pour couvrir tout ou partie des frais d\'inscription dans un club, association sportive ou salle de sport partenaire. Il prend la forme d\'une réduction immédiate lors de l\'inscription.',
        objectif: 'Cette aide du ministère chargé des Sports s\'adresse aux enfants et aux jeunes qui rencontrent des obstacles à la pratique sportive – qu\'ils soient d\'ordre financier, social ou liés à un handicap. L\'objectif : leur permettre d\'accéder durablement à une activité physique encadrée, au sein d\'un environnement structurant, éducatif et sécurisé.'
    }
};

// ============================================================================
// CULTURE - MAISON DE L'ÉTUDIANT
// ============================================================================
export const ESPACE_CULTURE_INFO = {
    localisation: 'Maison de l\'Étudiant (MDE) - Site FLLASH, 3 passage Jacqueline de Romilly',
    contact: '05 16 49 67 76',
    email: 'culture@univ-lr.fr',
    reseau: 'Art+Université+Culture',
    role: 'Cœur battant de la vie associative',
    accompagnement: [
        'Conseil et structuration de projets',
        'Aide à la rédaction de demandes de subvention',
        'Respect des cadres légaux (sécurité, droits d\'auteur)',
        'Domiciliation d\'associations',
        'Studios de répétition musicale (créneaux étendus, soirs et samedis)'
    ]
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
        description: 'LE rendez-vous culturel étudiant de l\'année - 25ème édition - Point d\'orgue de la saison culturelle',
        periode: 'Printemps (Fin mars - Début avril)',
        icon: '🎭',
        details: [
            'Restitutions publiques de TOUS les ateliers artistiques de l\'année',
            'Spectacles de théâtre, danse, concerts, expositions photos',
            'Projets autonomes lauréats du FSDIE',
            'Scène ouverte pour tous les artistes étudiants',
            'Programmation dense à la Maison de l\'Étudiant et dans les lieux culturels partenaires de la ville',
            'Gratuit et ouvert à tous (étudiants, personnels, grand public)',
            'Plus de 200 artistes étudiants sur scène',
            'Brise la tour d\'ivoire universitaire : permet aux citadins de découvrir la vitalité artistique du campus'
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        ]
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
        nom: 'BDE Droit',
        type: 'BDE',
        description: 'Depuis plusieurs années, le Bureau des Étudiants de Droit tente de rendre la vie étudiante plus agréable pour que nos étudiants aient un bagage de joyeux souvenirs de leurs années universitaires. Nous tentons également de mettre en relation nos étudiants afin qu\'ils apprennent à se connaitre, qu\'ils échangent sur leur parcours, leurs difficultés et leurs impressions sur le monde universitaire à travers les évènements que nous organisons. Les activités de notre BDE tournent autour de l\'organisation de divers évènements comme les soirées, les afterworks ou encore le Gala. Nous mettons également en place un système de parrainage avec les étudiants de première année pour qu\'il ne soit pas perdu, et puisse avoir quelqu\'un vers qui se tourner en cas de difficulté. Le BDE fait également des prêts d\'ouvrage juridique comme des codes ou encore des manuels. Chaque année, le BDE organise également la vente de sweats brodés, tote-bag et autres goodies. Pour finir, il vend également chaque année sa carte d\'adhésion pour avoir les meilleurs tarifs préférentiels chez ses partenaires, mais également les bracelets, les sweats et la place de Gala à prix réduit.',
        icon: '⚖️',
        logo: '/assets/{images,icons}/associations/Logo-BDEdroit-300x300.jpg',
        contact: {
            email: 'bde.facultededroit.larochelle@gmail.com',
            instagram: 'bdedroitlr'
        }
    },
    {
        nom: 'BDE FLLASH Back',
        type: 'BDE',
        description: 'Hello ! Nous sommes le BDE FLLASH Back ! Si tu es en langues, histoire, géographie ou encore lettres c\'est vers nous que tu dois te tourner ! Nous sommes une fine équipe sympathique dont le but et de rendre ton année fun, sympa et surtout à petit prix. Notamment grâce à nos soirées et à nos partenariats un peu partout dans la ville. Nous somme aussi là le plus et le mieux possible si tu as besoin d\'un soutien et d\'une oreille, car notre but est de t\'aider à passer une super année ! Alors fais parti de l\'aventure cette année !',
        icon: '📚',
        logo: '/assets/{images,icons}/associations/logo-fllash-back.png.avif',
        contact: {
            email: 'fllashbackbde@gmail.com',
            instagram: 'bdefllashback'
        }
    },
    {
        nom: 'L\'Abulle',
        type: 'BDE',
        description: 'L\'Abulle c\'est un groupe d\'amis qui se sont rencontrés en première année de BUT génie biologique et qui ont décidé de reprendre le flambeau du Bureau Des Étudiants. L\'équipe est composée de personnes qui ont un seul mot d\'ordre : rigoler toute la journée. Ce sont des étudiants très sociables, drôles et bien intentionnés : le combo parfait pour passer des superbes années. Nous sommes un BDE qui est reliés autour de l\'amitié, la bonne humeur et l\'entraide dans le but de faire passer aux étudiants leurs meilleures années étudiantes possible ! L\'Abulle fait de son mieux pour permettre aux promotions d\'avoir une véritable cohésion entres elles afin de créer une famille. Nous sommes disponibles à tout moment pour accompagner chaque étudiant, si tu as des questions sur n\'importe quel sujet.',
        icon: '🧬',
        logo: '/assets/{images,icons}/associations/Logo-BDE-IUT.png.avif',
        contact: {
            email: 'labullegb@gmail.com',
            instagram: 'l.abulle'
        }
    },
    {
        nom: 'BDE IAE La Rochelle',
        type: 'BDE',
        description: 'Le Bureau des Étudiants de l\'IAE La Rochelle est une association étudiante dynamique. Notre objectif principal est de promouvoir le bien-être des étudiants de notre université en leur offrant un large éventail d\'activités et d\'opportunités. C\'est aussi une association étudiante engagée qui se soucie du bien-être des étudiants, de l\'environnement et de la promotion du respect mutuel.',
        icon: '💼',
        logo: '/assets/{images,icons}/associations/logo-BDE-IAE.jpg.avif',
        contact: {
            email: 'bde.gestion@gmail.com',
            instagram: 'bdeiaelr'
        }
    },
    {
        nom: 'BDE Informatique',
        type: 'BDE',
        description: 'Nous sommes le Bureau des Étudiants (BDE) informatique de l\'IUT de La Rochelle. Dans notre local les étudiants peuvent venir se reposer et se restaurer. Nous proposons snacks et boissons à des prix très abordables afin de financer nos projets telles que des soirées ou des après-midis organisés à destination des étudiants. Si vous avez des questions, n\'hésitez pas à nous contacter sur notre compte Instagram.',
        icon: '💻',
        logo: '/assets/{images,icons}/associations/LogoBDE-Info.png.avif',
        contact: {
            email: 'bde.infolr@gmail.com',
            instagram: 'bde.info.lr'
        }
    },
    {
        nom: 'BDE TC',
        type: 'BDE',
        description: 'Bureau des étudiant·es Techniques de commercialisation IUT.',
        icon: '🛒',
        contact: {
            email: 'bde.tc.larochelle@gmail.com',
            instagram: 'bdetclr'
        }
    },
    {
        nom: 'BDE Génie Civil',
        type: 'BDE',
        description: 'Bureau des étudiant·es Génie Civil.',
        icon: '🏗️',
        logo: '/assets/{images,icons}/associations/BDE-genie-civil.jpg.avif',
        contact: {
            email: 'bde.gccd.lr@gmail.com',
            instagram: 'bdegccd.lr'
        }
    },
    {
        nom: 'BDE Sciences',
        type: 'BDE',
        description: 'Le Bureau des Étudiants de Sciences, situé à la Maison des sciences de l\'ingénieur, est l\'endroit idéal pour s\'impliquer dans la vie universitaire. Le bureau organise régulièrement des soirées et des divers événements, offrant aux étudiants une ambiance conviviale et dynamique. En plus de ces activités, le bureau propose des services pratiques tels que la reprographie, pour imprimer tout vos documents. Pour les petites faims, un espace snacking est également disponible pour se restaurer rapidement entre les cours. De plus, les étudiant·es peuvent consulter et emprunter des annales pour se préparer aux examens. Rejoignez le BDE pour vivre une expérience étudiante riche et diversifiée au cœur du pôle sciences.',
        icon: '🔬',
        logo: '/assets/{images,icons}/associations/bde_sciences.png.webp',
        contact: {
            email: 'bde.sciences.larochelle@gmail.com',
            instagram: 'bdescienceslr'
        }
    },
];

export const ASSOCIATIONS_THEMATIQUES: Association[] = [
    {
        nom: 'A vous de jouer',
        type: 'Loisirs',
        description: 'A vous de jouer est une association qui désire rassembler les étudiants autour des jeux de société. Notre souhait est de partager des moments conviviaux, découvrir de nouvelles mécaniques et évidemment de s\'amuser ! Débutants comme experts, tout le monde est le bienvenu !',
        icon: '🎲',
        logo: '/assets/{images,icons}/associations/Logo-AVDJ.png.avif',
        contact: {
            email: 'avousdejouer.lr17@gmail.com',
            instagram: 'avousdejouerlr'
        }
    },
    {
        nom: 'Les Blairoudeurs',
        type: 'Nature',
        description: 'Un blairoudeur, c\'est quelqu\'un qui aime la nature, qui veut en apprendre plus sur cette dernière, ou juste se promener pour s\'émerveiller. Un blairoudeur, c\'est quelqu\'un qui s\'ouvre au monde qui l\'entoure, qui plante des arbres, qui écoute les oiseaux, qui regarde sous ses pieds et haut dans le ciel. Un blairoudeur, c\'est quelqu\'un qui aime partager des moments de joie, d\'enchantement, et de convivialité ! Tu es un blairoudeur ? Rejoins-nous vite !',
        icon: '🦡',
        logo: '/assets/{images,icons}/associations/Logo-Blairoudeurs-298x300.png',
        contact: {
            email: 'larochelle@blairoudeurs.fr',
            instagram: 'blairoudeurs.larochelle'
        }
    },
    {
        nom: 'Bouée Bleue Productions',
        type: 'Cinéma',
        description: 'Bouée Bleue Productions est une association étudiante de cinéma qui accompagne les étudiants dans la création de projet audiovisuel (court-métrage, clip,…) et qui crée des rencontres entre professionnels du domaine et les étudiants à travers des projections, festivals et ateliers. Nous produisons nos propres films, avec des équipes mêlant amateurs et professionnels, jeunes et professionnels.',
        icon: '🎬',
        logo: '/assets/{images,icons}/associations/Bouee-bleue.png.avif',
        contact: {
            email: 'boueebleue.production@gmail.com',
            instagram: 'boueebleueproduction'
        }
    },
    {
        nom: 'Eloquentia La Rochelle',
        type: 'Expression orale',
        description: 'Eloquentia La Rochelle est une association d\'expression orale qui promeut la prise de parole en public dans sa diversité auprès des jeunes de La Rochelle âgés de 18 à 30 ans. Des ateliers de masterclass sont organisés sur divers sujets, de la plaidoirie au slam, en passant par de l\'improvisation, la gestion de la voix et même la rédaction de discours. Eloquentia La Rochelle, c\'est aussi un concours au terme duquel est élu le meilleur orateur de la Charente maritime qui représentera l\'association au concours international d\'Eloquentia.',
        icon: '🎤',
        logo: '/assets/{images,icons}/associations/Phlogo-eloquentia-LA-ROCHELLE.png',
        contact: {
            email: 'eloquentialarochelle@gmail.com',
            instagram: 'eloquentia.larochelle'
        }
    },
    {
        nom: 'EMU La Rochelle',
        type: 'Musique',
        description: 'Tu aimes jouer de la musique et t\'amuser ?! Alors n\'attends pas, contacte nous et rejoins nous ! Nous déciderons du jour et du créneau en fonction des disponibilités de chacun·e. Les répétitions auront lieu à la Maison de l\'étudiant entre 12h-14h ou 17h-19h !',
        icon: '🎵',
        logo: '/assets/{images,icons}/associations/logo-the-peas1.png.avif',
        contact: {
            email: 'contact.emulr@gmail.com',
            instagram: 'thepeas.emulr'
        }
    },
    {
        nom: 'ESN La Rochelle',
        type: 'International',
        description: 'Erasmus Student Network La Rochelle, section rochelaise du réseau ESN International. Envie de te faire des amis venant du monde entier ? Envie d\'organiser des évènements ? Envie d\'être porte-parole de la mobilité internationale ? Nos deux missions : Accueillir et Intégrer les étudiants internationaux sur La Rochelle, et Sensibiliser à la Mobilité Internationale.',
        icon: '🌍',
        logo: '/assets/{images,icons}/associations/Logo-ESN-La-Rochelle-300x167.png',
        contact: {
            email: 'contact@esnlarochelle.org',
            instagram: 'esnlarochelle'
        }
    },
    {
        nom: 'La Sauce Culturelle',
        type: 'Culture',
        description: 'Portée par les étudiants des masters culture. Montage de festivals, expositions, programmation artistique en lien avec l\'Espace Culture. Acteur majeur de la vie culturelle du campus',
        icon: '🎭',
        logo: '/assets/{images,icons}/associations/Logo-La-sauce-culturelle-300x300.png'
    },
    {
        nom: 'Uni\'vert',
        type: 'Écologie',
        description: 'Uni\'vert est une association étudiante qui a pour objectif de montrer que la transition écologique et sociale est POSSIBLE pour tous ! Elle s\'adresse aux étudiants et personnels de l\'université en leur proposant diverses activités : ciné débat, ateliers DIY, cleanwalks et bien plus… Mais elle travaille aussi avec l\'Université pour participer à sa transition : intégration de groupes de travail, porteuse de la signature de la COP 2 étudiante… En bref Univert c\'est le champ (bio bien sûr !) des possibles.',
        icon: '🌱',
        logo: '/assets/{images,icons}/associations/logo-univert.jpg.avif',
        contact: {
            email: 'univert.lr@gmail.com',
            instagram: 'univert_17'
        }
    },
    {
        nom: 'AFEV',
        type: 'Solidarité',
        description: 'Association de la Fondation Étudiante pour la Ville. Mentorat éducatif dans les quartiers, Kolocations à Projets Solidaires (KAPS). Engagement citoyen fortement valorisé',
        icon: '🤝'
    },
    {
        nom: 'Géocéan',
        type: 'Géographie',
        description: 'Géocéan, c\'est l\'association des géographes de La Rochelle Université ! Autour de multiples événements organisés au cours de l\'année, tels que des cafés-géo, quiz, sorties et autres, son but est de rassembler et de rendre accessible la Géographie à tous. Que vous soyez géographes ou non, nous serons ravis de vous accueillir !',
        icon: '🌍',
        logo: '/assets/{images,icons}/associations/Logo-Geocean-e1692872052754-300x300.png',
        contact: {
            email: 'asso.geocean@gmail.com',
            instagram: 'geoceanlr'
        }
    },
    {
        nom: 'La Rochelle Beach Club',
        type: 'Sport',
        description: 'Vous êtes passionné·e de beach-volley ou simplement à la recherche d\'une activité fun en plein air ? Rejoignez notre club à la plage des Minimes ! Que vous soyez débutant·e, amateur ou compétiteur, nous vous proposons un accès à des sessions de loisirs ou des entraînements de compétition, le tout à des prix très abordables ! N\'hésitez pas à nous contacter pour toutes demandes d\'informations !',
        icon: '🏐',
        logo: '/assets/{images,icons}/associations/logo-LRBC.png.avif',
        contact: {
            email: 'contact@larochelle-beachclub.fr',
            instagram: 'lrbc.volley'
        }
    },
    {
        nom: 'Legio XX Valeria Victrix',
        type: 'Histoire',
        description: 'Nous sommes une association de reconstitution, de (re)médiation historique et d\'archéologie expérimentale avec pour objet central l\'armée romaine des Ier et IIe siècles après J.-C. « L\'Histoire est une science vivante »',
        icon: '⚔️',
        logo: '/assets/{images,icons}/associations/Logo-Legio-XX-Valeria-300x261.png',
        contact: {
            email: 'comm.legxx@gmail.com',
            instagram: 'legioxxvaleriavictrix'
        }
    },
    {
        nom: 'LemonSea',
        type: 'Environnement',
        description: 'LemonSea est une association de sensibilisation aux impacts du changement climatique sur les milieux marins à travers l\'un de ses effets méconnu : l\'acidification des océans. Grâce à des expériences et des supports pédagogiques adaptées à tout le monde, nous allons au contact des enfants et des adultes pour leur donner des clés de compréhension et d\'actions. Tous et toutes, faisons un Zeste pour l\'océan !',
        icon: '🍋',
        logo: '/assets/{images,icons}/associations/Logo-Lemonsea-300x300.png',
        contact: {
            email: 'webmaster.lemonsea@gmail.com',
            instagram: 'lemonseatron'
        }
    },
    {
        nom: 'Les Ruchelaises',
        type: 'Apiculture',
        description: 'Les Ruchelaises est une association étudiante de découverte de l\'apiculture et de sensibilisation à la biodiversité, notamment aux pollinisateurs. Nous sommes l\'une des rares associations à créer un produit de A à Z sur le campus universitaire, en proposant un miel conçu dans Les Minimes. Nous possédons plusieurs ruches sur le campus et travaillons avec une apicultrice. Nous développons des activités complémentaires, comme la fabrication de bee-wraps, un emballage écologique et économique à base de cire d\'abeille.',
        icon: '🐝',
        logo: '/assets/{images,icons}/associations/logo-les-ruchelaises-300x200.jpeg',
        contact: {
            email: 'lesruchelaises.lru@gmail.com',
            instagram: 'les_ruchelaises'
        }
    },
    {
        nom: 'NESSA',
        type: 'Entraide',
        description: 'L\'association « NESSA » est le créateur et le gestionnaire de la plateforme numérique « NESSA » dédiée aux annales étudiantes. Elle a pour finalité de mettre à la disposition des étudiants des annales d\'examen, des fiches de travaux dirigés, des fiches de révision et des corrigés.',
        icon: '📚',
        logo: '/assets/{images,icons}/associations/logo-Nessa.png.webp',
        contact: {
            email: 'nessa.annalesetudiantes@gmail.com',
            instagram: 'nessa.ae.lr'
        }
    },
    {
        nom: 'Projet Primrose',
        type: 'Solidarité',
        description: 'Le projet Primrose a été créé en 2019 par des étudiants du CMI. Son but est de mettre à disposition des protections hygiéniques gratuites et de qualité pour les étudiant.e.s de La Rochelle. Ces protections hygiéniques sont faites avec du coton bio, saines pour la santé et l\'environnement. Nous avons actuellement 4 distributeurs situés à la LLASH, en Orbigny, à l\'IAE et au SUAPSE. Nous recherchons de nouvelles personnes intéressées par l\'idée de s\'engager pour la cause de la précarité menstruelle.',
        icon: '🌸',
        logo: '/assets/{images,icons}/associations/Logo-PrimRose.png.avif',
        contact: {
            email: 'projet.primrose@gmail.com',
            instagram: 'primrose_lr'
        }
    },
    {
        nom: 'Slack en L\'R',
        type: 'Sport',
        description: 'Slack en L\'R est une association sportive visant à partager la pratique de la slackline (funambulisme sur sangle) à La Rochelle. Ce sport et les activités associées développent l\'équilibre, l\'écoute de la respiration et le partage. N\'hésitez pas à nous contacter pour venir essayer.',
        icon: '🤸',
        logo: '/assets/{images,icons}/associations/Logo_lack_en_LR.jpeg.avif',
        contact: {
            email: 'slackenlair@gmail.com',
            instagram: 'Slack En L\'air'
        }
    },
    {
        nom: 'Société Rochelaise du Droit',
        type: 'Droit',
        description: 'Née en 2019 sous l\'impulsion de doctorant·es rochelais, la Société Rochelaise du Droit est une association loi 1901 reconnue d\'intérêt général depuis 2022. Composée d\'étudiants, d\'enseignants, de praticiens du Droit et ouverte à toutes les personnes intéressées par la défense de la res publica, la SRD se veut un réseau des juristes rochelais au service du Droit et des citoyens.',
        icon: '⚖️',
        logo: '/assets/{images,icons}/associations/logo-association-juridique-la-rochelle-societe-rochelaise-droit.png.avif',
        contact: {
            email: 'bureau@srdroit.fr',
            instagram: 'srdroit'
        }
    },
    {
        nom: 'Média Étudiant Rochelais',
        type: 'Média',
        description: 'Le Média Étudiant Rochelais est une association étudiante née de la volonté d\'accompagner les étudiants vivant à La Rochelle dans leur parcours universitaire. Il a pour vocation de rassembler, en un seul lieu, les informations essentielles concernant la vie locale susceptibles d\'intéresser les étudiants. Il diffusera à la fois des informations à caractère festif, celles liées aux initiatives étudiantes et tous les bons plans, afin de refléter la diversité de la vie étudiante rochelaise.',
        icon: '📰',
        logo: '/assets/{images,icons}/associations/Logo-association-MER.png.webp',
        contact: {
            email: 'mediaetudiantrochelais@gmail.com',
            instagram: 'media_etudiant_rochelais'
        }
    },
];

// ============================================================================
// ASSOCIATIONS DE FORMATION
// ============================================================================
export const ASSOCIATIONS_FORMATION: Association[] = [
    {
        nom: 'ADocs',
        type: 'Doctorants',
        description: 'L\'ADocs est l\'association des doctorant·es et jeunes chercheurs et chercheuses de La Rochelle Université. Depuis 25 ans, l\'association favorise les rencontres et échanges entre doctorants et jeunes chercheurs de différentes disciplines autour de projets culturels, festifs, d\'animations et de vulgarisation.',
        icon: '🎓',
        logo: '/assets/{images,icons}/associations/Logo-Adocs-300x136.png',
        contact: {
            email: 'Adocs@univ-lr.fr',
            instagram: 'adocsulr'
        }
    },
    {
        nom: 'Biotech The New Hop',
        type: 'Biotechnologies',
        description: 'Biotechthenewhop est une association fondée par des masters en biotechnologies. Si vous êtes étudiant·e en master biotechnologies parcours Biochimie ou Génie biotechnologique et management en agro-industries, nous serons ravis de vous compter parmi nous.',
        icon: '🧬',
        logo: '/assets/{images,icons}/associations/logo-biotechthenewhop.jpg.avif',
        contact: {
            email: 'biotech-tnh@outlook.fr',
            instagram: 'biotech_thenewhop'
        }
    },
    {
        nom: 'La Sauce Culturelle',
        type: 'Culture & Patrimoine',
        description: 'La Sauce Culturelle est une association portée par les étudiant·es des Masters Histoire (parcours DPEC, MEPAT et Histoire) et E-Tourisme (parcours E-Tourisme et ingénierie culturelle des patrimoines). Tout au long de l\'année, l\'association porte les projets culturels des étudiants et participe à la vie associative et culturelle de La Rochelle Université.',
        icon: '🎭',
        logo: '/assets/{images,icons}/associations/Logo-La-sauce-culturelle-300x300.png',
        contact: {
            email: 'lassos.culturelle@gmail.com',
            instagram: 'lasauceculturelle'
        }
    },
    {
        nom: 'MEEF LR',
        type: 'Enseignement',
        description: 'Association ouverte à tous les étudiants de Master MEEF 1er degré. Elle a pour but de développer l\'échange entre les étudiants et de créer du lien entre les deux années. Maison Étudiante Éducative et Festive.',
        icon: '👩‍🏫',
        logo: '/assets/{images,icons}/associations/logo-meef.png.avif',
        contact: {
            email: 'assomeeflr@gmail.com',
            instagram: 'meef_lr'
        }
    },
];

// ============================================================================
// SYNDICATS ET REPRÉSENTATION ÉTUDIANTE
// ============================================================================
export const SYNDICATS_REPRESENTATION: Association[] = [
    {
        nom: 'Efficience',
        type: 'Syndicat étudiant & Association de représentation',
        description: 'Nous sommes Efficience, une association apartisane et locale créée par des étudiants pour les étudiants ! Notre but : représenter et défendre les étudiants via différentes actions : siéger en conseils, clean walks, restructuration des cours… Si tu souhaites t\'investir dans la politique universitaire, Efficience est faite pour toi, rejoins-nous !',
        icon: '🗳️',
        logo: '/assets/{images,icons}/associations/logo-efficience.jpg.avif',
        contact: {
            email: 'efficiencelarochelle@gmail.com',
            instagram: 'efficience_lr'
        }
    },
    {
        nom: 'La Voix Étudiante',
        type: 'Syndicat étudiant & Association de représentation',
        description: 'La Voix Étudiante est une organisation étudiante de La Rochelle Université. Notre mission ? Représenter les étudiants dans les conseils de l\'université, défendre leurs intérêts, porter leurs projets et faire bouger les lignes. Parce qu\'une université vivante se construit avec et pour ses étudiants, nous sommes là pour faire entendre votre voix !',
        icon: '📢',
        logo: '/assets/{images,icons}/associations/la_voix_etudiante.jpg.webp',
        contact: {
            email: 'lavoixetudiante.lr@gmail.com',
            instagram: 'lavoixetudiante.lr'
        }
    },
    {
        nom: 'Uni & Indépendants',
        type: 'Syndicat étudiant',
        description: 'Syndicat étudiant engagé pour la défense des droits et intérêts des étudiants de La Rochelle Université.',
        icon: '✊',
        contact: {
            instagram: 'uni.la.rochelle'
        }
    },
];

export const ENGAGEMENT_INFO = {
    fdsie: {
        nom: 'FSDIE - Fonds de Solidarité et de Développement des Initiatives Étudiantes',
        description: 'Commission mixte Université + CROUS. Financement de projets culturels, humanitaires, scientifiques, environnementaux et sportifs',
        frequence: '4 à 5 commissions par an (novembre, janvier, février, mai)',
        criteres: [
            'Intérêt général pour la communauté étudiante',
            'Transversalité entre filières',
            'Projets culturels, humanitaires, scientifiques, environnementaux, sportifs',
            'Consultation obligatoire d\'un référent Vie Associative en amont',
            'Dossier à déposer 7 jours avant la commission + soutenance orale'
        ]
    },
    b2e: {
        nom: 'B2E - Bonus Engagement Étudiant',
        description: 'Validation des compétences acquises lors d\'activités bénévoles : crédits ECTS ou bonification de la moyenne',
        activitesEligibles: [
            'Mandats électifs (conseils centraux, conseils de composante)',
            'Fonctions de bureau dans une association agréée (Président, Trésorier, Secrétaire)',
            'Engagement en tant que mentor (AFEV)',
            'Accompagnement d\'étudiants en situation de handicap'
        ],
        contact: 'b2e@univ-lr.fr'
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
