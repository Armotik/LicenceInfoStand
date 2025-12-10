// ============================================================================
// DONNÉES OFFICIELLES - LICENCE INFORMATIQUE LA ROCHELLE UNIVERSITÉ
// Source: https://formations.univ-larochelle.fr/licence-informatique
// ============================================================================

// Types pour la structure des données
export interface UEModule {
    code: string;
    name: string;
    ects: number;
    type: 'obligatoire' | 'optionnel';
    hours?: string;
    description?: string;
    objectives?: string[];
    content?: string[];
    skills?: string[];
}

export interface UEBlock {
    blockName: string;
    modules: UEModule[];
    isChoice?: boolean;
    choiceWith?: string;
}

export interface SemesterProgram {
    semester: number;
    title: string;
    ues: UEBlock[];
    totalECTS: number;
}

export interface YearProgram {
    year: number;
    title: string;
    semesters: SemesterProgram[];
}

// ============================================================================
// STATISTIQUES DE LA FORMATION
// ============================================================================
export const FORMATION_STATS = {
    places: 125,
    candidatures: 856,
    tauxSelection: '14.6%',
    fraisInscription: '178€/an',
    duree: '3 ans (6 semestres)',
    ects: 180,
    poursuitesMaster: '77%',
    insertionPro: '92%',
    salaireMoyen: '1790€ net/mois (premier emploi)',
};

// ============================================================================
// PROGRAMME DÉTAILLÉ PAR ANNÉE
// ============================================================================
export const PROGRAM_BY_YEAR: YearProgram[] = [
    // ==================== L1 ====================
    {
        year: 1,
        title: 'Première année - Fondamentaux',
        semesters: [
            // ---------- SEMESTRE 1 ----------
            {
                semester: 1,
                title: 'Semestre 1 - Découverte et bases',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'UE Découvertes',
                        modules: [
                            {
                                code: '101-1-32',
                                name: 'Découverte Informatique',
                                ects: 2,
                                type: 'optionnel',
                                hours: '16h30 CM',
                                description: 'Introduction au monde de l\'informatique moderne',
                                objectives: [
                                    'Connaître les étapes historiques de l\'informatique',
                                    'Maîtriser les éléments constituant un ordinateur',
                                    'Comprendre le fonctionnement du web',
                                    'Appréhender les processus de numérisation d\'images',
                                    'Avoir une vue d\'ensemble de la cryptographie'
                                ],
                                content: [
                                    'Histoire de l\'informatique : ENIAC → smartphones',
                                    'Architecture matérielle : CPU, RAM, stockage',
                                    'Fonctionnement du web : HTTP, DNS, serveurs',
                                    'Traitement d\'images numériques',
                                    'Introduction à la cryptographie'
                                ]
                            },
                            {
                                code: '101-1-33',
                                name: 'Découverte Mathématiques',
                                ects: 2,
                                type: 'optionnel',
                                hours: '16h30 CM',
                                description: 'Applications des mathématiques en informatique',
                                objectives: [
                                    'Modéliser mathématiquement des problèmes concrets',
                                    'Utiliser des outils mathématiques simples',
                                    'Comprendre les limitations des modèles'
                                ],
                                content: [
                                    'Suites numériques (économie, finance)',
                                    'Équations différentielles (population, planètes)',
                                    'Arithmétique : PGCD, PPCM, nombres premiers',
                                    'Cryptographie : César, RSA simplifié'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Unité fondamentale',
                        modules: [
                            {
                                code: '101-1-15',
                                name: 'Introduction à la programmation',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '7h30 CM + 18h TP',
                                description: 'Premiers pas en programmation avec Python',
                                objectives: [
                                    'Maîtriser variables et types de données',
                                    'Utiliser les structures de contrôle (if, for, while)',
                                    'Définir et appeler des fonctions',
                                    'Manipuler listes et tableaux',
                                    'Utiliser un IDE et déboguer'
                                ],
                                content: [
                                    'Variables : int, float, str, bool',
                                    'Structures conditionnelles et boucles',
                                    'Fonctions et paramètres',
                                    'Listes et opérations associées',
                                    'Lecture/écriture de fichiers',
                                    'Documentation et commentaires'
                                ]
                            },
                            {
                                code: '101-1-16',
                                name: 'Introduction aux systèmes informatiques',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 13h30 TP + 3h TA',
                                description: 'Découverte des systèmes et bases de données',
                                objectives: [
                                    'Naviguer dans une arborescence de fichiers',
                                    'Comprendre l\'architecture client/serveur',
                                    'Découvrir le stockage en base de données'
                                ],
                                content: [
                                    'Système de fichiers et arborescence',
                                    'Architecture client/serveur',
                                    'Introduction aux bases de données',
                                    'Projet intégrateur'
                                ]
                            },
                            {
                                code: '101-1-17',
                                name: 'Mathématiques 1 - Analyse',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 16h30 TD',
                                description: 'Fonctions et dérivation',
                                objectives: [
                                    'Résoudre équations et inéquations',
                                    'Manipuler les fonctions usuelles',
                                    'Calculer des dérivées',
                                    'Étudier des fonctions'
                                ],
                                content: [
                                    'Fonctions polynomiales, exponentielles, logarithmes',
                                    'Dérivation et fonctions composées',
                                    'Étude de fonction : monotonie, limites',
                                    'Asymptotes et tangentes'
                                ]
                            },
                            {
                                code: '101-1-18',
                                name: 'Mathématiques 2 - Logique',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 16h30 TD',
                                description: 'Logique et raisonnement mathématique',
                                objectives: [
                                    'Utiliser les symboles mathématiques',
                                    'Manier connecteurs et quantificateurs',
                                    'Maîtriser les techniques de preuves',
                                    'Appliquer la combinatoire'
                                ],
                                content: [
                                    'Calcul propositionnel : ∧, ∨, ¬, ⇒, ⇔',
                                    'Quantificateurs : ∀, ∃',
                                    'Preuves : récurrence, absurde',
                                    'Combinatoire : Cnk, arrangements'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Unités transversales',
                        modules: [
                            {
                                code: '101-1-02',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            },
                            {
                                code: '101-1-01',
                                name: 'Informatique d\'usage',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '15h TP',
                                description: 'Maîtrise des outils bureautiques'
                            },
                            {
                                code: '101-1-03',
                                name: 'Accompagnement à la réussite 1',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '3h CM + 6h TD + 3h TA'
                            }
                        ]
                    }
                ]
            },
            // ---------- SEMESTRE 2 ----------
            {
                semester: 2,
                title: 'Semestre 2 - Spécialisation informatique',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'Administrer - Novice',
                        modules: [
                            {
                                code: '160-2-21',
                                name: 'Architecture des ordinateurs - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 9h TD + 7h TP',
                                description: 'Architecture matérielle et codage de l\'information',
                                objectives: [
                                    'Comprendre l\'architecture de Von Neumann',
                                    'Connaître les modes de codage',
                                    'Comprendre les limites des représentations',
                                    'Connaître les principes du calcul binaire'
                                ],
                                content: [
                                    'Architecture de Von Neumann',
                                    'Binaire, hexadécimal',
                                    'Complément à 2, IEEE 754',
                                    'Portes logiques, UAL'
                                ]
                            },
                            {
                                code: '160-2-22',
                                name: 'Systèmes d\'exploitation - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 17h TP',
                                description: 'Initiation à Linux et scripting shell',
                                objectives: [
                                    'Manipuler les commandes Linux',
                                    'Gérer les permissions fichiers',
                                    'Utiliser redirections et pipes',
                                    'Programmer des scripts shell'
                                ],
                                content: [
                                    'Commandes : ls, cd, cp, mv, rm, grep',
                                    'Permissions : chmod, chown',
                                    'Redirections : >, >>, <, |',
                                    'Scripts Bash : variables, boucles, conditions'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Développer - Novice',
                        modules: [
                            {
                                code: '160-2-11',
                                name: 'Introduction à la POO',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 12h TP',
                                description: 'Programmation orientée objet avec Java',
                                objectives: [
                                    'Comprendre classes et instances',
                                    'Maîtriser l\'encapsulation',
                                    'Utiliser les premières structures de données'
                                ],
                                content: [
                                    'Classes, objets, instances',
                                    'Attributs et méthodes',
                                    'Encapsulation : public, private',
                                    'Constructeurs et surcharge',
                                    'ArrayList et Javadoc'
                                ]
                            },
                            {
                                code: '160-2-12',
                                name: 'Programmation web - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 24h TP',
                                description: 'HTML/CSS/JavaScript',
                                objectives: [
                                    'Coder des pages HTML/CSS',
                                    'Créer des programmes JavaScript',
                                    'Comprendre client/serveur',
                                    'Utiliser AJAX'
                                ],
                                content: [
                                    'HTML5 : balises sémantiques',
                                    'CSS3 : flexbox, responsive',
                                    'JavaScript : DOM, événements',
                                    'JSON et AJAX'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Modéliser - Novice',
                        modules: [
                            {
                                code: '160-2-31',
                                name: 'Algorithmique des tableaux',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 13h30 TP',
                                description: 'Algorithmes fondamentaux sur tableaux',
                                objectives: [
                                    'Distinguer algorithme et programme',
                                    'Implémenter des algorithmes de tri',
                                    'Comprendre la complexité'
                                ],
                                content: [
                                    'Parcours séquentiel et dichotomique',
                                    'Tri : bulles, sélection, insertion',
                                    'Traces d\'exécution',
                                    'Introduction à la complexité O(n)'
                                ]
                            },
                            {
                                code: '160-2-32',
                                name: 'Analyse de données - bases',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 12h TP',
                                description: 'Algèbre linéaire pour l\'informatique',
                                content: [
                                    'Espaces vectoriels, dimension',
                                    'Produit scalaire, orthogonalité',
                                    'Moindres carrés',
                                    'Python/NumPy'
                                ]
                            },
                            {
                                code: '160-2-33',
                                name: 'Génie logiciel - bases',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '9h CM + 4h30 TD + 9h TP',
                                description: 'Introduction au génie logiciel et UML',
                                content: [
                                    'Cahier des charges',
                                    'Diagramme de cas d\'utilisation',
                                    'Diagramme de classes',
                                    'Tests unitaires (JUnit)'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Informaticien citoyen 1',
                        modules: [
                            {
                                code: '160-2-41',
                                name: 'Démarche scientifique',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '4h30 CM + 1h30 TD',
                                content: [
                                    'K. Popper : observation, modélisation',
                                    'Critique des biais',
                                    'Tests et validation'
                                ]
                            },
                            {
                                code: '160-2-42',
                                name: 'Enjeux du numérique responsable',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '6h CM + 1h30 TD',
                                content: [
                                    'Cycle de vie des équipements',
                                    'Consommation énergétique',
                                    'Pollution et déchets'
                                ]
                            },
                            {
                                code: '160-2-43',
                                name: 'Projets développement durable',
                                ects: 4,
                                type: 'obligatoire',
                                hours: '4h30 CM + 1h30 TD + 18h TP'
                            }
                        ]
                    },
                    {
                        blockName: 'Transversal',
                        modules: [
                            {
                                code: '160-2-02',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            },
                            {
                                code: '160-2-01',
                                name: 'Informatique d\'usage',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '9h TP',
                                description: 'Certification PIX'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ==================== L2 ====================
    {
        year: 2,
        title: 'Deuxième année - Approfondissement',
        semesters: [
            // ---------- SEMESTRE 3 ----------
            {
                semester: 3,
                title: 'Semestre 3 - Consolidation',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'Administrer - Intermédiaire 1',
                        modules: [
                            {
                                code: '160-3-21',
                                name: 'Bases de données - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 15h TP',
                                description: 'Modèle relationnel et SQL',
                                objectives: [
                                    'Comprendre le modèle relationnel',
                                    'Maîtriser SQL',
                                    'Concevoir une base de données'
                                ],
                                content: [
                                    'Tables, clés primaires/étrangères',
                                    'SQL : SELECT, INSERT, UPDATE, DELETE',
                                    'Jointures et sous-requêtes',
                                    'GROUP BY et agrégations',
                                    'PostgreSQL'
                                ]
                            },
                            {
                                code: '160-3-22',
                                name: 'Réseaux - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '6h CM + 4h30 TD + 12h TP',
                                description: 'Introduction aux réseaux TCP/IP',
                                objectives: [
                                    'Comprendre le modèle OSI/TCP-IP',
                                    'Configurer un réseau local',
                                    'Analyser le trafic réseau'
                                ],
                                content: [
                                    'Modèle OSI et TCP/IP',
                                    'Adressage IP, sous-réseaux',
                                    'Ethernet, ARP, ICMP',
                                    'DHCP, DNS',
                                    'Wireshark'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Développer - Intermédiaire 1',
                        modules: [
                            {
                                code: '160-3-11',
                                name: 'Programmation impérative - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 3h TD + 15h TP',
                                description: 'Langage C et gestion mémoire',
                                objectives: [
                                    'Maîtriser la syntaxe C',
                                    'Comprendre les pointeurs',
                                    'Gérer la mémoire dynamique'
                                ],
                                content: [
                                    'Types, opérateurs, structures',
                                    'Pointeurs et arithmétique',
                                    'malloc, free, realloc',
                                    'Tableaux et chaînes',
                                    'Structures et typedef',
                                    'Makefile'
                                ]
                            },
                            {
                                code: '160-3-12',
                                name: 'Programmation web - intermédiaire',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '6h CM + 24h TP',
                                description: 'PHP et APIs REST',
                                objectives: [
                                    'Maîtriser PHP procédural et objet',
                                    'Développer des APIs REST',
                                    'Sécuriser les applications'
                                ],
                                content: [
                                    'PHP : syntaxe, fonctions, POO',
                                    'PDO et connexion BDD',
                                    'APIs REST : routes, JSON',
                                    'fetch API, async/await',
                                    'Sécurité : SQL injection, XSS'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Modéliser - Intermédiaire 1',
                        modules: [
                            {
                                code: '160-3-31',
                                name: 'Analyse de données - outils',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 12h TP',
                                description: 'Probabilités et statistiques',
                                content: [
                                    'Variables aléatoires',
                                    'Lois : normale, binomiale',
                                    'Tests d\'hypothèses',
                                    'Régression linéaire',
                                    'Python : NumPy, SciPy'
                                ]
                            },
                            {
                                code: '160-3-32',
                                name: 'Structures de données - novice',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 12h TP',
                                description: 'Listes, piles, files, arbres',
                                objectives: [
                                    'Implémenter les structures fondamentales',
                                    'Analyser la complexité'
                                ],
                                content: [
                                    'Listes chaînées : simple, double',
                                    'Piles et files',
                                    'Arbres binaires',
                                    'Parcours : préfixe, infixe, postfixe',
                                    'ABR (Arbre Binaire de Recherche)'
                                ]
                            },
                            {
                                code: '160-3-33',
                                name: 'Génie logiciel - intermédiaire',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '6h CM + 6h TD + 12h TP',
                                description: 'Diagrammes UML avancés',
                                content: [
                                    'Diagramme de séquences',
                                    'Diagramme états-transitions',
                                    'Diagramme d\'activités',
                                    'Introduction aux patterns'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Informaticien citoyen 2',
                        modules: [
                            {
                                code: '160-3-41',
                                name: 'Épistémologie',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '4h30 CM + 1h30 TD',
                                description: 'Philosophie des sciences',
                                content: [
                                    'Platon, Descartes, Kant, Popper',
                                    'La chambre chinoise de Searle',
                                    'Biais des systèmes de recommandation'
                                ]
                            },
                            {
                                code: '160-3-42',
                                name: 'Numérique responsable - intermédiaire',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '6h CM + 1h30 TD',
                                content: [
                                    'Analyse du Cycle de Vie (ACV)',
                                    'Empreinte carbone du numérique'
                                ]
                            },
                            {
                                code: '160-3-43',
                                name: 'Projets développement durable',
                                ects: 4,
                                type: 'obligatoire',
                                hours: '1h30 CM + 18h TP'
                            }
                        ]
                    },
                    {
                        blockName: 'Transversal',
                        modules: [
                            {
                                code: '160-3-01',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            },
                            {
                                code: '160-3-02',
                                name: 'Accompagnement à la réussite 2',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '1h30 CM + 4h30 TD + 3h TA'
                            }
                        ]
                    }
                ]
            },
            // ---------- SEMESTRE 4 ----------
            {
                semester: 4,
                title: 'Semestre 4 - Spécialisation',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'Administrer - Intermédiaire 2',
                        modules: [
                            {
                                code: '160-4-21',
                                name: 'Réseaux - intermédiaire',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 7h30 TD + 12h TP',
                                description: 'Programmation socket et protocoles',
                                objectives: [
                                    'Approfondir les couches OSI',
                                    'Programmer avec les sockets',
                                    'Configurer des services réseau'
                                ],
                                content: [
                                    'Couche physique et liaison',
                                    'TCP et UDP en détail',
                                    'Programmation socket C',
                                    'HTTP, FTP, SMTP',
                                    'Configuration serveurs'
                                ]
                            },
                            {
                                code: '160-4-22',
                                name: 'Systèmes d\'exploitation - avancé',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 4h30 TD + 18h TP',
                                description: 'Processus, threads, synchronisation',
                                objectives: [
                                    'Maîtriser fork, exec, wait',
                                    'Utiliser les threads POSIX',
                                    'Synchroniser avec mutex et sémaphores'
                                ],
                                content: [
                                    'fork(), exec(), wait()',
                                    'Threads POSIX : pthread',
                                    'Pipes, files de messages, mémoire partagée',
                                    'Sémaphores, mutex',
                                    'Producteur-consommateur',
                                    'Signaux Unix'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Développer - Intermédiaire 2',
                        modules: [
                            {
                                code: '160-4-11',
                                name: 'Programmation impérative - avancé',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 3h TD + 15h TP',
                                description: 'C avancé et outils de développement',
                                content: [
                                    'Pointeurs de fonctions',
                                    'Généricité avec void*',
                                    'Préprocesseur avancé',
                                    'Valgrind, GDB, profiling'
                                ]
                            },
                            {
                                code: '160-4-12',
                                name: 'POO - avancé',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '7h30 CM + 7h30 TD + 15h TP',
                                description: 'Héritage, polymorphisme, design patterns',
                                objectives: [
                                    'Maîtriser l\'héritage',
                                    'Utiliser le polymorphisme',
                                    'Appliquer les design patterns'
                                ],
                                content: [
                                    'Héritage et interfaces',
                                    'Polymorphisme, liaison dynamique',
                                    'Classes abstraites',
                                    'Patterns : Singleton, Factory, Observer',
                                    'Principes SOLID'
                                ]
                            }
                        ]
                    },
                    // ========== BLOC À CHOIX S4 ==========
                    {
                        blockName: 'Informaticien citoyen et numérique responsable 3',
                        isChoice: true,
                        choiceWith: 'Web responsable',
                        modules: [
                            {
                                code: '160-4-41',
                                name: 'Étude de cas : contrôle et modélisation',
                                ects: 2,
                                type: 'optionnel',
                                hours: '4h30 CM + 4h30 TD + 12h TP',
                                description: 'Modélisation de systèmes pour le développement durable',
                                objectives: [
                                    'Modéliser le fonctionnement d\'un système',
                                    'Contrôler et simuler des processus',
                                    'Appliquer l\'informatique au développement durable'
                                ],
                                content: [
                                    'Modélisation de systèmes dynamiques',
                                    'Simulation et contrôle',
                                    'Applications environnementales',
                                    'Outils de calcul scientifique'
                                ]
                            },
                            {
                                code: '160-4-42',
                                name: 'Projets développement durable',
                                ects: 4,
                                type: 'optionnel',
                                hours: '1h30 CM + 12h TP',
                                description: 'Projets en lien avec les laboratoires L3i/MIA',
                                content: [
                                    'Projets interdisciplinaires',
                                    'Collaboration avec laboratoires',
                                    'Thématique développement durable'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Web responsable',
                        isChoice: true,
                        choiceWith: 'Informaticien citoyen et numérique responsable 3',
                        modules: [
                            {
                                code: '160-4-51',
                                name: 'Éco-conception web',
                                ects: 2,
                                type: 'optionnel',
                                hours: '4h30 TD + 9h TP',
                                description: 'Conception responsable de services numériques',
                                objectives: [
                                    'Réduire l\'impact environnemental du web',
                                    'Coupler éco-conception, UX et accessibilité',
                                    'Respecter le RGPD'
                                ],
                                content: [
                                    'Principes d\'éco-conception',
                                    'Optimisation des performances',
                                    'Accessibilité numérique (WCAG)',
                                    'RGPD et vie privée',
                                    'Outils de mesure (EcoIndex, Lighthouse)',
                                    'Bonnes pratiques Green IT'
                                ]
                            },
                            {
                                code: '160-4-52',
                                name: 'Programmation web - avancé',
                                ects: 4,
                                type: 'optionnel',
                                hours: '9h CM + 27h TP',
                                description: 'Frameworks web modernes',
                                objectives: [
                                    'Maîtriser un framework backend',
                                    'Maîtriser un framework frontend',
                                    'Développer des applications complètes'
                                ],
                                content: [
                                    'Backend : Symfony ou Laravel',
                                    'ORM : Doctrine, Eloquent',
                                    'Frontend : Vue.js ou React',
                                    'Composants et gestion d\'état',
                                    'Routage SPA',
                                    'Build et déploiement'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Modéliser - Intermédiaire 2',
                        modules: [
                            {
                                code: '160-4-31',
                                name: 'Génie logiciel - qualité et gestion',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 7h30 TD + 15h TP',
                                description: 'Qualité logicielle et méthodologies agiles',
                                content: [
                                    'Métriques : complexité cyclomatique',
                                    'Tests : unitaires, intégration',
                                    'CI/CD : Jenkins, GitLab CI',
                                    'Scrum, Kanban',
                                    'Git avancé'
                                ]
                            },
                            {
                                code: '160-4-32',
                                name: 'Analyse de données - utilisateur',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '12h TD + 12h TP + 3h TA',
                                description: 'Analyse et visualisation',
                                content: [
                                    'Exploration de données',
                                    'Visualisation : matplotlib, seaborn',
                                    'Introduction au machine learning'
                                ]
                            },
                            {
                                code: '160-4-33',
                                name: 'Structures de données - intermédiaire',
                                ects: 4,
                                type: 'obligatoire',
                                hours: '9h CM + 12h TD + 12h TP',
                                description: 'Structures avancées',
                                content: [
                                    'Tables de hachage',
                                    'Tas et files de priorité',
                                    'Arbres AVL',
                                    'Introduction aux graphes'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Transversal',
                        modules: [
                            {
                                code: '160-4-01',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            }
                        ]
                    }
                ]
            }
        ]
    },

    // ==================== L3 ====================
    {
        year: 3,
        title: 'Troisième année - Professionnalisation',
        semesters: [
            // ---------- SEMESTRE 5 ----------
            {
                semester: 5,
                title: 'Semestre 5 - Expertise',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'Administrer - Compétent 1',
                        modules: [
                            {
                                code: '160-5-21',
                                name: 'Architecture des ordinateurs - avancé',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 7h30 TD + 9h TP',
                                description: 'Architectures parallèles et performances',
                                objectives: [
                                    'Comprendre le pipeline et la prédiction',
                                    'Maîtriser le parallélisme',
                                    'Comprendre la hiérarchie mémoire'
                                ],
                                content: [
                                    'Pipeline et prédiction de branchement',
                                    'Architectures superscalaires',
                                    'SIMD, multi-cœurs',
                                    'Caches et cohérence',
                                    'Introduction aux GPU'
                                ]
                            },
                            {
                                code: '160-5-22',
                                name: 'Sécurité - bases',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '7h30 CM + 4h30 TD + 12h TP',
                                description: 'Sécurité des réseaux et systèmes',
                                objectives: [
                                    'Analyser les menaces réseau',
                                    'Mettre en œuvre des protections',
                                    'Comprendre la cryptographie'
                                ],
                                content: [
                                    'Menaces et vulnérabilités',
                                    'Firewall et règles iptables',
                                    'VPN et tunneling',
                                    'Cryptographie : AES, RSA',
                                    'PKI et certificats X.509',
                                    'IDS/IPS'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Développer - Compétent 1',
                        modules: [
                            {
                                code: '160-5-11',
                                name: 'Programmation événementielle',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 15h TP',
                                description: 'IHM et interfaces graphiques',
                                objectives: [
                                    'Maîtriser les paradigmes MVC/MVVM',
                                    'Programmer en événementiel',
                                    'Créer des interfaces ergonomiques'
                                ],
                                content: [
                                    'MVC, MVP, MVVM',
                                    'Boucle d\'événements',
                                    'JavaFX et FXML',
                                    'Ergonomie logicielle'
                                ]
                            },
                            {
                                code: '160-5-12',
                                name: 'SGBD - fonctions avancées',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '7h30 CM + 3h TD + 12h TP',
                                description: 'Optimisation et transactions',
                                objectives: [
                                    'Comprendre le stockage interne',
                                    'Optimiser les requêtes',
                                    'Gérer les transactions'
                                ],
                                content: [
                                    'Indexation : B-trees, hash',
                                    'EXPLAIN et optimisation',
                                    'PL/pgSQL : fonctions, triggers',
                                    'Transactions ACID',
                                    'Concurrence et verrous'
                                ]
                            }
                        ]
                    },
                    // ========== BLOC À CHOIX S5 ==========
                    {
                        blockName: 'Développement pour plateformes connectées 1',
                        isChoice: true,
                        choiceWith: 'Objets intelligents et autonomes 1',
                        modules: [
                            {
                                code: '160-5-41',
                                name: 'Développement IoT et efficacité énergétique',
                                ects: 6,
                                type: 'optionnel',
                                hours: '10h30 CM + 12h TD + 27h TP',
                                description: 'Programmation embarquée et objets connectés',
                                objectives: [
                                    'Développer en C sur microcontrôleurs',
                                    'Gérer les GPIO et interruptions',
                                    'Optimiser la consommation énergétique',
                                    'Intégrer des capteurs IoT'
                                ],
                                content: [
                                    'Microcontrôleurs : ESP32, STM32, Arduino',
                                    'GPIO et interruptions',
                                    'Deep sleep et gestion énergie',
                                    'Protocoles IoT : MQTT, CoAP',
                                    'Serveur HTTP embarqué',
                                    'Interfaces I2C et SPI',
                                    'Capteurs : température, humidité, GPS',
                                    'LoRa et réseaux bas débit'
                                ],
                                skills: ['AMITEP-Développer-Maîtrise']
                            }
                        ]
                    },
                    {
                        blockName: 'Objets intelligents et autonomes 1',
                        isChoice: true,
                        choiceWith: 'Développement pour plateformes connectées 1',
                        modules: [
                            {
                                code: '160-5-51',
                                name: 'Traitement du signal pour objets intelligents',
                                ects: 6,
                                type: 'optionnel',
                                hours: '12h CM + 12h TD + 24h TP',
                                description: 'Traitement du signal et deep learning embarqué',
                                objectives: [
                                    'Comprendre la chaîne d\'acquisition',
                                    'Maîtriser l\'analyse spectrale (FFT)',
                                    'Implémenter des filtres numériques',
                                    'Utiliser les CNN pour le signal'
                                ],
                                content: [
                                    'Chaîne : capteur → CAN → traitement',
                                    'Échantillonnage et Shannon',
                                    'Transformée de Fourier (FFT)',
                                    'Filtres FIR et IIR',
                                    'Convolution et corrélation',
                                    'Réseaux convolutionnels (CNN)',
                                    'Edge computing et Jetson',
                                    'Applications : IMU, Lidar, drones'
                                ],
                                skills: ['AMITEP-Développer-Avancé']
                            }
                        ]
                    },
                    {
                        blockName: 'Modéliser - Compétent 1',
                        modules: [
                            {
                                code: '160-5-31',
                                name: 'Structures de données - avancé',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 15h TP',
                                description: 'Arbres équilibrés et structures avancées',
                                content: [
                                    'Tables de hachage avancées',
                                    'Arbres AVL : rotations',
                                    'Arbres rouge-noir',
                                    'B-arbres et B+',
                                    'Tas binomiaux',
                                    'Analyse amortie'
                                ]
                            },
                            {
                                code: '160-5-32',
                                name: 'Analyse de données - développeur',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 9h TD + 9h TP + 4h30 TA',
                                description: 'Machine learning',
                                content: [
                                    'Préparation des données',
                                    'k-NN, arbres de décision, SVM',
                                    'Validation croisée',
                                    'PCA',
                                    'Clustering'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Transversal',
                        modules: [
                            {
                                code: '160-5-01',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            },
                            {
                                code: '160-5-02',
                                name: 'Accompagnement à la réussite 3',
                                ects: 1,
                                type: 'obligatoire',
                                hours: '6h TD + 3h TA',
                                description: 'Préparation insertion professionnelle'
                            },
                            {
                                code: '160-5-03',
                                name: 'Projet',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '12h TP',
                                description: 'Projet tuteuré en équipe'
                            }
                        ]
                    }
                ]
            },
            // ---------- SEMESTRE 6 ----------
            {
                semester: 6,
                title: 'Semestre 6 - Professionnalisation',
                totalECTS: 30,
                ues: [
                    {
                        blockName: 'Administrer - Compétent 2',
                        modules: [
                            {
                                code: '160-6-21',
                                name: 'Systèmes répartis',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '6h CM + 3h TD + 12h TP',
                                description: 'Cloud et systèmes distribués',
                                objectives: [
                                    'Comprendre les architectures cloud',
                                    'Utiliser Docker',
                                    'Découvrir Kubernetes'
                                ],
                                content: [
                                    'Cloud : IaaS, PaaS, SaaS',
                                    'CORBA et RMI',
                                    'Web services REST/SOAP',
                                    'Docker : images, conteneurs',
                                    'Introduction Kubernetes'
                                ]
                            },
                            {
                                code: '160-6-22',
                                name: 'Sécurité - avancé',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '6h CM + 4h30 TD + 12h TP',
                                description: 'Sécurité logicielle et virologie',
                                objectives: [
                                    'Comprendre les failles logicielles',
                                    'Connaître les mécanismes des virus',
                                    'Développer une attitude sécurité'
                                ],
                                content: [
                                    'Reverse engineering',
                                    'Buffer overflow',
                                    'Exploits et CVE',
                                    'Mécanismes des virus',
                                    'Antivirus et détection',
                                    'TP : programmation d\'un virus (éducatif)'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Développer - Compétent 2',
                        modules: [
                            {
                                code: '160-6-11',
                                name: 'Programmation fonctionnelle',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '4h30 CM + 4h30 TD + 9h TP',
                                description: 'Paradigme fonctionnel avec Scala',
                                objectives: [
                                    'Comprendre l\'immutabilité',
                                    'Utiliser les fonctions pures',
                                    'Appliquer les monades'
                                ],
                                content: [
                                    'Fonctions first-class',
                                    'Lambda et closures',
                                    'Immutabilité',
                                    'Pattern matching',
                                    'Foncteurs et monades',
                                    'Scala'
                                ]
                            },
                            {
                                code: '160-6-12',
                                name: 'Modélisation de BDD',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 3h TD + 12h TP',
                                description: 'Conception et NoSQL',
                                objectives: [
                                    'Modéliser en entités-relations',
                                    'Normaliser (1NF → BCNF)',
                                    'Utiliser NoSQL'
                                ],
                                content: [
                                    'Modèle entités-relations',
                                    'Dépendances fonctionnelles',
                                    'Formes normales',
                                    'MongoDB (documents)',
                                    'Neo4j (graphes)',
                                    'Bases réparties'
                                ]
                            }
                        ]
                    },
                    // ========== BLOC À CHOIX S6 (suite S5) ==========
                    {
                        blockName: 'Développement pour plateformes connectées 2',
                        isChoice: true,
                        choiceWith: 'Objets intelligents et autonomes 2',
                        modules: [
                            {
                                code: '160-6-41',
                                name: 'Développement sur smartphones',
                                ects: 6,
                                type: 'optionnel',
                                hours: '12h CM + 12h TD + 22h30 TP',
                                description: 'Développement mobile natif et hybride',
                                objectives: [
                                    'Maîtriser un environnement mobile',
                                    'Comprendre les contraintes mobiles',
                                    'Développer en équipe agile'
                                ],
                                content: [
                                    'Natif vs hybride',
                                    'Android : Kotlin, MVVM',
                                    'iOS : Swift, SwiftUI',
                                    'Cross-platform : Flutter ou React Native',
                                    'APIs et SDKs',
                                    'Contraintes : batterie, réseau',
                                    'Publication sur stores',
                                    'Projet en équipe (5 personnes)'
                                ],
                                skills: ['AMITEP-Développer-Maîtrise']
                            }
                        ]
                    },
                    {
                        blockName: 'Objets intelligents et autonomes 2',
                        isChoice: true,
                        choiceWith: 'Développement pour plateformes connectées 2',
                        modules: [
                            {
                                code: '160-6-51',
                                name: 'Vision embarquée et IA',
                                ects: 6,
                                type: 'optionnel',
                                hours: '13h30 CM + 31h30 TP',
                                description: 'Computer vision et deep learning embarqué',
                                objectives: [
                                    'Maîtriser le traitement d\'images',
                                    'Utiliser les CNN pour la vision',
                                    'Déployer sur matériel embarqué'
                                ],
                                content: [
                                    'Filtrage et segmentation',
                                    'Détection de contours',
                                    'Descripteurs : SIFT, HOG',
                                    'OpenCV',
                                    'CNN pour la vision',
                                    'YOLO, SSD',
                                    'Réalité augmentée',
                                    'Caméras intelligentes',
                                    'Edge AI : Jetson Nano, Coral TPU'
                                ],
                                skills: ['AMITEP-Développer-Maîtrise', 'AMITEP-Modéliser']
                            }
                        ]
                    },
                    {
                        blockName: 'Modéliser - Compétent 2',
                        modules: [
                            {
                                code: '160-6-31',
                                name: 'Compilation',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '9h CM + 6h TD + 12h TP',
                                description: 'Théorie des langages et compilateurs',
                                objectives: [
                                    'Comprendre l\'analyse lexicale',
                                    'Maîtriser l\'analyse syntaxique',
                                    'Construire un compilateur'
                                ],
                                content: [
                                    'Automates finis, regex',
                                    'Analyse lexicale : Flex',
                                    'Grammaires hors-contexte',
                                    'Analyse LL et LR',
                                    'Bison',
                                    'Construction d\'un compilateur'
                                ]
                            },
                            {
                                code: '160-6-32',
                                name: 'Algorithmes de graphes et complexité',
                                ects: 3,
                                type: 'obligatoire',
                                hours: '10h30 CM + 10h30 TD + 4h30 TP',
                                description: 'Théorie des graphes et NP-complétude',
                                objectives: [
                                    'Maîtriser les algorithmes de graphes',
                                    'Analyser la complexité',
                                    'Connaître les classes P et NP'
                                ],
                                content: [
                                    'BFS, DFS',
                                    'Dijkstra, Bellman-Ford',
                                    'Prim, Kruskal',
                                    'Ford-Fulkerson',
                                    'Complexité : O, Ω, Θ',
                                    'P, NP, NP-complet',
                                    'Méta-heuristiques : recuit simulé, génétiques'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Stage',
                        modules: [
                            {
                                code: '160-6-02-STAG',
                                name: 'Stage en entreprise ou laboratoire',
                                ects: 7,
                                type: 'obligatoire',
                                description: 'Stage de fin de licence (min. 6 semaines)',
                                content: [
                                    'Durée : 6 semaines minimum',
                                    '40% des stages au laboratoire L3i',
                                    'Possibilité à l\'international',
                                    'Soutenance et rapport'
                                ]
                            }
                        ]
                    },
                    {
                        blockName: 'Transversal',
                        modules: [
                            {
                                code: '160-6-01',
                                name: 'LV1 Anglais',
                                ects: 2,
                                type: 'obligatoire',
                                hours: '18h TD'
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

// ============================================================================
// INFORMATIONS CMI
// ============================================================================
export const CMI_INFO = {
    places: 20,
    candidatures: 245,
    duree: '5 ans (Licence + Master)',
    label: 'FIGURE',
    plusValue: '+20% enseignements',
    highlights: [
        'Stages dès la L1',
        'Immersion laboratoire L3i',
        'Mobilité internationale obligatoire',
        'Double compétence scientifique/managériale'
    ]
};

// ============================================================================
// LABORATOIRES
// ============================================================================
export const LABORATOIRES = {
    l3i: {
        name: 'L3i - Informatique, Image et Interaction',
        membres: 100,
        chercheurs: 38,
        axes: [
            'IA et apprentissage',
            'Image et contenus numériques',
            'Supervision du littoral',
            'Humanités numériques'
        ]
    },
    mia: {
        name: 'MIA - Mathématiques, Image et Applications',
        axes: ['Analyse numérique', 'Optimisation', 'Modélisation']
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function getSemester(n: number): SemesterProgram | undefined {
    for (const y of PROGRAM_BY_YEAR) {
        for (const s of y.semesters) {
            if (s.semester === n) return s;
        }
    }
    return undefined;
}

export function getChoiceBlocks(semesterNumber: number): { block1: UEBlock; block2: UEBlock }[] {
    const semester = getSemester(semesterNumber);
    if (!semester) return [];

    const choices: { block1: UEBlock; block2: UEBlock }[] = [];
    const processed = new Set<string>();

    for (const block of semester.ues) {
        if (block.isChoice && block.choiceWith && !processed.has(block.blockName)) {
            const block2 = semester.ues.find(b => b.blockName === block.choiceWith);
            if (block2) {
                choices.push({ block1: block, block2 });
                processed.add(block.blockName);
                processed.add(block.choiceWith);
            }
        }
    }
    return choices;
}