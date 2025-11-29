# LicenceInfoStand

Application de présentation interactive pour promouvoir la **Licence Informatique de La Rochelle Université** lors des JPO, salons étudiants et forums d'orientation.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Tailwind](https://img.shields.io/badge/Tailwind-3-38B2AC)

## 🎯 Fonctionnalités

### Mode Veille ("The Attractor")
- **Matrix Rain Effect** - Cascade de caractères style Matrix ✅
- **Simulation Boids** - Comportement d'essaim émergent (à venir)
- **Réseau Neural** - Visualisation animée (à venir)
- **Globe 3D** - Réseau EU-CONEXUS (à venir)

### Mode Présentation ("The Explorer")
Navigation par **univers thématiques** :
- 🎓 **Formation** - Programme L1-L2-L3, CMI, compétences
- 🏠 **Vie Étudiante** - CROUS, logement, santé, associations
- 🌊 **La Rochelle** - Cadre de vie, climat, transports
- 📚 **Système Universitaire** - ECTS, CM/TD/TP, évaluation
- 🚀 **Démonstrations** - Accès aux démos interactives

### Mode Démo
Démonstrations techniques illustrant les compétences enseignées :
- 🤖 **Body Tracking** - Vision par ordinateur avec MediaPipe
- 📊 **Tri Visuel** - Algorithmes de tri animés
- 🗺️ **Pathfinding A*** - Recherche de chemin optimal
- 🌀 **Fractales Mandelbrot** - Exploration mathématique
- 🐦 **Simulation Boids** - POO et comportement émergent
- 🧬 **Game of Life** - Automate cellulaire de Conway

## 🚀 Installation

```bash
# Cloner ou extraire le projet
cd licence-info-stand

# Installer les dépendances
npm install

# Lancer en développement
npm run dev

# Build production
npm run build

# Preview du build
npm run preview
```

## ⌨️ Raccourcis clavier

### Navigation globale
| Touche | Action |
|--------|--------|
| `Espace` | Basculer veille ↔ présentation |
| `Escape` | Retour mode veille / Fermer |
| `F` | Plein écran |
| `H` | Afficher aide |

### Mode Veille
| Touche | Action |
|--------|--------|
| `← →` | Changer d'effet visuel |

### Mode Présentation
| Touche | Action |
|--------|--------|
| `← →` | Changer d'univers |
| `↑ ↓` | Naviguer dans les sections |
| `1-6` | Lancer une démo directement |

## 📁 Structure du projet

```
src/
├── app/
│   ├── shell/       # Orchestration principale
│   ├── idle/        # Mode veille (animations)
│   ├── presenter/   # Mode présentation (contenu)
│   ├── demos/       # Démonstrations techniques
│   ├── content/     # Données statiques
│   └── camera/      # Service webcam
├── shared/
│   ├── components/  # Composants réutilisables
│   ├── hooks/       # Hooks personnalisés
│   └── utils/       # Utilitaires
├── stores/          # Zustand stores
├── machines/        # XState machines
├── types/           # Types TypeScript
└── styles/          # CSS global
```

## 🛠️ Stack technique

- **Framework** : React 18 + TypeScript + Vite
- **Styling** : Tailwind CSS 3
- **Animations** : Framer Motion + Canvas API
- **State** : Zustand + XState
- **Vision** : MediaPipe (à venir)

## 📋 Phases de développement

- [x] **Phase 1** - Fondations (architecture, navigation, thème)
- [ ] **Phase 2** - Mode Veille (effets visuels complets)
- [ ] **Phase 3** - Mode Présentation (contenu détaillé)
- [ ] **Phase 4** - Démonstrations (6 démos interactives)
- [ ] **Phase 5** - Intégration & Polish
- [ ] **Phase 6** - Tests terrain

## 🖥️ Utilisation sur vidéoprojecteur

L'application est optimisée pour une résolution 1080p. Pour une meilleure expérience :

1. Lancez l'application en mode plein écran (`F`)
2. Le mode veille attire automatiquement l'attention
3. Appuyez sur `Espace` pour passer en mode présentation
4. Naviguez avec les flèches ou lancez une démo avec `1-6`
5. Appuyez sur `H` pour afficher l'aide si nécessaire

## 👤 Auteur

Projet développé dans le cadre de la promotion de la Licence Informatique de La Rochelle Université.

Master 1 SMART Computing - Université de Nantes

---

*Licence Informatique - La Rochelle Université*
