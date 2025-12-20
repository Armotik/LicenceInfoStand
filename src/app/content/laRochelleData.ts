// ============================================================================
// DONNÉES OFFICIELLES - LA ROCHELLE VILLE ET TERRITOIRE
// Source: Rapport Attractivité Territoriale La Rochelle
// ============================================================================

// ============================================================================
// PATRIMOINE HISTORIQUE
// ============================================================================
export const TOURS_HISTORIQUES = [
    {
        nom: 'Tour Saint-Nicolas',
        periode: '1345-1376',
        description: 'Donjon urbain symbolisant la puissance de la ville face à l\'océan. Murs d\'épaisseur colossale pour protéger le port',
        icon: '🏰'
    },
    {
        nom: 'Tour de la Chaîne',
        description: 'Abritait le mécanisme de levage de la chaîne fermant le port. Soufflée par une explosion pendant la Fronde, restaurée aux XXe-XXIe siècles',
        surnom: 'La tour qui a perdu son toit',
        icon: '⛓️'
    },
    {
        nom: 'Tour de la Lanterne',
        description: 'Phare pour la navigation et prison. Mémorial des Quatre Sergents de La Rochelle (1822), martyrs de la liberté d\'opinion',
        icon: '🗼'
    }
];

export const HISTOIRE_ROCHELLE = {
    grandSiege: {
        annees: '1627-1628',
        contexte: 'Siège orchestré par Richelieu et Louis XIII contre la ville protestante',
        prouesse: 'Digue de 1500 mètres construite pour bloquer l\'accès à la mer',
        impact: 'Population décimée (28 000 → 5 000 habitants), mais culture de résistance et d\'adaptation ancrée',
        heritage: 'Capacité à survivre aux crises et à pivoter économiquement'
    },
    innovations: [
        {
            annee: '1447',
            titre: 'Adduction d\'eau potable',
            description: 'Source de Lafond (2 km) - Financement innovant par taxation des exportations de vin',
            icon: '💧'
        },
        {
            annee: '1909',
            titre: 'Précurseur de la télévision',
            description: 'Georges Rignoux : première transmission d\'images animées à distance',
            icon: '📺'
        }
    ]
};

// ============================================================================
// ÉCOSYSTÈME NUMÉRIQUE
// ============================================================================
export const ECOSYSTEME_NUMERIQUE = {
    label: 'French Tech Atlantic Valley',
    technopole: 'La Rochelle Technopole',
    startups: [
        {
            nom: 'A2D (Acquire to Decide)',
            secteur: 'Deep Tech / Industrie 4.0',
            tech: 'IA, Computer Vision, Lidar, Réseaux de Neurones',
            description: 'Analyse automatique de données (satellites, drones) pour détecter anomalies sur infrastructures critiques'
        },
        {
            nom: 'HUVY',
            secteur: 'e-Santé / MedTech',
            tech: 'Intelligence Artificielle, Traitement d\'image',
            description: 'Dépistage des cancers cutanés via smartphone pour professionnels de santé'
        },
        {
            nom: '17informatique',
            secteur: 'Green IT / Économie Circulaire',
            tech: 'Hardware, Durabilité, Maintenance',
            description: 'Réparation et prolongation de vie du matériel informatique pour réduire empreinte carbone'
        },
        {
            nom: 'HUBYUP',
            secteur: 'SaaS / Gestion d\'Entreprise',
            tech: 'Web, CRM, Bases de Données',
            description: 'Logiciel CRM pour pilotage de réseaux de franchises'
        },
        {
            nom: 'Mon Assistant',
            secteur: 'Legaltech',
            tech: 'IA, Blockchain, Web App',
            description: 'Optimisation des processus pour avocats en droit de la famille'
        }
    ],
    recrutement: [
        'Factoriel : cabinet spécialisé IT, Data et IA',
        'Seyos : recrutement informatique sur mesure',
        'Profils recherchés : développeurs, experts Cloud, Data Scientists, CTO'
    ],
    evenement: {
        nom: 'Sunny Side of the Doc',
        dates: '23-26 juin 2025',
        lieu: 'Espace Encan',
        description: 'Marché mondial du documentaire : 2 000 professionnels de 70 pays. Technologies VR/AR, formats immersifs',
        participants: '2000+ professionnels, 70 pays'
    }
};

// ============================================================================
// LA ROCHELLE TERRITOIRE ZÉRO CARBONE (LRTZC)
// ============================================================================
export const LRTZC_INFO = {
    nom: 'La Rochelle Territoire Zéro Carbone',
    objectif: 'Neutralité carbone d\'ici 2040',
    budget: '82 millions €',
    agregateurCarbone: {
        description: 'Outil informatique de monitoring et certification',
        fonctions: [
            'Monitoring temps réel des émissions de GES',
            'Certification et vente de 150 000 tonnes éq. CO2 de crédits carbone locaux',
            'Pilotage de 70 000+ projets de réduction d\'émissions'
        ],
        technologies: ['Big Data', 'Blockchain', 'Data Visualization']
    },
    mobilite: {
        objectif: 'Réduction de 30% des émissions GES',
        solutions: ['Mobilité autonome', 'Plateformes de covoiturage intelligent', 'IoT', 'Optimisation de flux']
    },
    carboneBleu: {
        projet: 'Réhabilitation des marais de Tasdon',
        description: 'Reliés à la mer pour maximiser captation CO2 par phytoplancton',
        tech: 'Capteurs environnementaux, modèles prédictifs'
    }
};

// ============================================================================
// MOBILITÉ YÉLO
// ============================================================================
export const MOBILITE_YELO = {
    nom: 'Yélo',
    description: 'Réseau de transport intégré - Un seul abonnement pour tous les modes',
    modes: [
        {
            type: 'Bus et TER',
            description: 'Couverture dense de l\'agglomération et liens ferroviaires',
            icon: '🚌'
        },
        {
            type: 'Bus de Mer et Passeur',
            description: 'Navettes maritimes électro-solaires reliant Vieux-Port au quartier universitaire des Minimes',
            specificite: 'Aller en cours en bateau !',
            icon: '⛴️'
        },
        {
            type: 'Vélos en libre-service',
            description: 'Vélos jaunes omniprésents dans la ville',
            icon: '🚲'
        }
    ],
    tarifs: {
        titre: 'Tarification sociale avantageuse',
        age: 'Moins de 26 ans',
        fourchette: '70€ - 175€ par an',
        critere: 'Selon quotient familial',
        inclus: 'Accès illimité à tous les modes de transport'
    },
    distances: {
        vieuxPortMinimes: '4,2 km',
        temps: {
            bus: '10-15 minutes',
            velo: '20 minutes (pistes cyclables sécurisées)',
            busMer: 'Trajet agréable'
        }
    }
};

// ============================================================================
// FESTIVALS ET ÉVÉNEMENTS
// ============================================================================
export const FESTIVALS_ROCHELLE = [
    {
        nom: 'Les Francofolies',
        dates: '10-14 juillet 2025',
        description: 'Rendez-vous majeur de la scène musicale francophone',
        artistes2025: ['IAM', 'Jean-Paul Rouve', 'Clara Luciani'],
        icon: '🎵'
    },
    {
        nom: 'Festival La Rochelle Cinéma - FEMA',
        dates: '27 juin - 5 juillet 2025',
        description: 'Festival cinéphile sans compétition, découverte d\'œuvres rares',
        icon: '🎬'
    }
];

// ============================================================================
// QUARTIERS ÉTUDIANTS
// ============================================================================
export const QUARTIERS_ROCHELLE = [
    {
        nom: 'Les Minimes',
        caracteristiques: ['Quartier du campus', 'Moderne', 'Proche de la mer et du port de plaisance'],
        logements: 'Forte concentration de résidences étudiantes (Les Estudines, UXCO)',
        icon: '🏫'
    },
    {
        nom: 'Saint-Nicolas',
        caracteristiques: ['Quartier bohème et festif', 'Maisons de 1750 avec principes bioclimatiques'],
        lieux: ['La Guignette (bar à vin historique)', 'Mary Lili'],
        ambiance: 'Épicentre de la vie étudiante alternative',
        icon: '🎨'
    },
    {
        nom: 'Tasdon',
        caracteristiques: ['Résidentiel et nature', 'Proche des marais réhabilités'],
        ambiance: 'Calme et proximité avec le campus',
        icon: '🌳'
    }
];

// ============================================================================
// SECTIONS DE NAVIGATION
// ============================================================================
export type LaRochelleSection =
    | 'overview'
    | 'patrimoine'
    | 'numerique'
    | 'environnement'
    | 'vie-locale';

export interface LaRochelleSectionItem {
    id: LaRochelleSection;
    title: string;
    icon: string;
}

export const LA_ROCHELLE_SECTIONS: LaRochelleSectionItem[] = [
    { id: 'overview', title: 'Vue d\'ensemble', icon: '🌊' },
    { id: 'patrimoine', title: 'Patrimoine', icon: '🏰' },
    { id: 'numerique', title: 'Numérique', icon: '💻' },
    { id: 'environnement', title: 'Environnement', icon: '🌍' },
    { id: 'vie-locale', title: 'Vie Locale', icon: '🎭' },
];
