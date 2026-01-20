// ============================================
// PathfindingVisualizer - Simulateur GPS avec Réseau Routier Réaliste
// Carte 5km x 5km avec routes variées, virages, et poids différents
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Point {
  x: number;
  y: number;
  id: string;
}

interface Road {
  id: string;
  name: string;
  points: Point[];
  type: 'highway' | 'main' | 'secondary' | 'local';
  speedLimit: number; // km/h
}

interface Intersection {
  id: string;
  point: Point;
  connectedRoads: string[];
}

interface Building {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name: string;
  type: 'university' | 'residential' | 'commercial' | 'park' | 'public';
}

interface PathNode extends Point {
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
  roadType?: string;
}

type SimulationState = 'idle' | 'calculating' | 'navigating' | 'completed' | 'no-path';

// ============================================
// Données de la carte - Quartier 5km x 5km
// ============================================

const MAP_SIZE = 2000; // 2000px = 5km (1px = 2.5m)
const SCALE = 0.0025; // 1px = 2.5m

// Routes du quartier avec virages et intersections variées
// IMPORTANT: Les routes partagent des points communs pour créer des intersections
const ROADS: Road[] = [
  // Autoroute périphérique (130 km/h)
  {
    id: 'r1',
    name: 'Périphérique Ouest',
    points: [
      { x: 100, y: 100, id: 'p1' },
      { x: 200, y: 400, id: 'p2' },      // Connecté à r3
      { x: 150, y: 800, id: 'p3' },
      { x: 180, y: 1000, id: 'p4' },     // Connecté à r4
      { x: 200, y: 1600, id: 'p5' },     // Connecté à r5
      { x: 220, y: 1900, id: 'p6' },
    ],
    type: 'highway',
    speedLimit: 130,
  },
  {
    id: 'r2',
    name: 'Périphérique Est',
    points: [
      { x: 1800, y: 150, id: 'p7' },
      { x: 1800, y: 500, id: 'p8' },     // Connecté à r3
      { x: 1800, y: 980, id: 'p9' },     // Connecté à r4
      { x: 1870, y: 1300, id: 'p10' },
      { x: 1800, y: 1640, id: 'p11' },   // Connecté à r5
      { x: 1900, y: 1950, id: 'p12' },
    ],
    type: 'highway',
    speedLimit: 130,
  },

  // Routes principales (50 km/h)
  {
    id: 'r3',
    name: 'Avenue de l\'Université',
    points: [
      { x: 200, y: 400, id: 'p13' },     // Connecté à r1
      { x: 500, y: 380, id: 'p14' },     // Connecté à r6
      { x: 1000, y: 400, id: 'p15' },    // Connecté à r7
      { x: 1300, y: 420, id: 'p16' },
      { x: 1500, y: 450, id: 'p17' },    // Connecté à r8
      { x: 1800, y: 500, id: 'p18' },    // Connecté à r2
    ],
    type: 'main',
    speedLimit: 50,
  },
  {
    id: 'r4',
    name: 'Boulevard des Sciences',
    points: [
      { x: 180, y: 1000, id: 'p19' },    // Connecté à r1
      { x: 400, y: 980, id: 'p20' },
      { x: 700, y: 1000, id: 'p21' },    // Connecté à r10
      { x: 1000, y: 1020, id: 'p22' },   // Connecté à r7
      { x: 1400, y: 1000, id: 'p23' },
      { x: 1800, y: 980, id: 'p24' },    // Connecté à r2
    ],
    type: 'main',
    speedLimit: 50,
  },
  {
    id: 'r5',
    name: 'Avenue Jean Jaurès',
    points: [
      { x: 200, y: 1600, id: 'p25' },    // Connecté à r1
      { x: 600, y: 1580, id: 'p26' },
      { x: 1000, y: 1600, id: 'p27' },   // Connecté à r7
      { x: 1400, y: 1620, id: 'p28' },
      { x: 1800, y: 1640, id: 'p29' },   // Connecté à r2
    ],
    type: 'main',
    speedLimit: 50,
  },

  // Routes verticales principales
  {
    id: 'r6',
    name: 'Rue Victor Hugo',
    points: [
      { x: 500, y: 200, id: 'p30' },
      { x: 500, y: 380, id: 'p31' },     // Connecté à r3
      { x: 520, y: 700, id: 'p32' },     // Connecté à r9
      { x: 500, y: 1000, id: 'p33' },
      { x: 480, y: 1400, id: 'p34' },
      { x: 500, y: 1800, id: 'p35' },
    ],
    type: 'main',
    speedLimit: 50,
  },
  {
    id: 'r7',
    name: 'Rue de la République',
    points: [
      { x: 1000, y: 150, id: 'p36' },
      { x: 1000, y: 400, id: 'p37' },    // Connecté à r3
      { x: 1020, y: 700, id: 'p38' },    // Connecté à r11
      { x: 1000, y: 1020, id: 'p39' },   // Connecté à r4
      { x: 980, y: 1400, id: 'p40' },
      { x: 1000, y: 1600, id: 'p41' },   // Connecté à r5
    ],
    type: 'main',
    speedLimit: 50,
  },
  {
    id: 'r8',
    name: 'Avenue Gambetta',
    points: [
      { x: 1500, y: 200, id: 'p42' },
      { x: 1500, y: 450, id: 'p43' },    // Connecté à r3
      { x: 1480, y: 800, id: 'p44' },
      { x: 1500, y: 1100, id: 'p45' },
      { x: 1520, y: 1500, id: 'p46' },
      { x: 1500, y: 1900, id: 'p47' },
    ],
    type: 'main',
    speedLimit: 50,
  },

  // Routes secondaires avec virages (30 km/h)
  {
    id: 'r9',
    name: 'Rue de la Paix',
    points: [
      { x: 300, y: 600, id: 'p48' },
      { x: 400, y: 650, id: 'p49' },
      { x: 520, y: 700, id: 'p50' },     // Connecté à r6
      { x: 700, y: 700, id: 'p51' },     // Connecté à r10
    ],
    type: 'secondary',
    speedLimit: 30,
  },
  {
    id: 'r10',
    name: 'Rue du Commerce',
    points: [
      { x: 700, y: 700, id: 'p52' },     // Connecté à r9
      { x: 700, y: 850, id: 'p53' },
      { x: 700, y: 1000, id: 'p54' },    // Connecté à r4
      { x: 850, y: 1050, id: 'p55' },
    ],
    type: 'secondary',
    speedLimit: 30,
  },
  {
    id: 'r11',
    name: 'Rue des Écoles',
    points: [
      { x: 1020, y: 700, id: 'p56' },    // Connecté à r7
      { x: 1100, y: 750, id: 'p57' },
      { x: 1200, y: 800, id: 'p58' },
      { x: 1300, y: 900, id: 'p59' },
    ],
    type: 'secondary',
    speedLimit: 30,
  },
  {
    id: 'r12',
    name: 'Rue de l\'Innovation',
    points: [
      { x: 600, y: 1200, id: 'p60' },
      { x: 700, y: 1250, id: 'p61' },
      { x: 800, y: 1300, id: 'p62' },
      { x: 900, y: 1350, id: 'p63' },
      { x: 1000, y: 1400, id: 'p64' },   // Ajout: point de connexion
    ],
    type: 'secondary',
    speedLimit: 30,
  },

  // Petites rues locales (20 km/h)
  {
    id: 'r13',
    name: 'Impasse des Lilas',
    points: [
      { x: 650, y: 500, id: 'p65' },
      { x: 700, y: 550, id: 'p66' },
      { x: 700, y: 700, id: 'p67' },     // Connecté à r9/r10
    ],
    type: 'local',
    speedLimit: 20,
  },
  {
    id: 'r14',
    name: 'Allée du Parc',
    points: [
      { x: 1150, y: 1200, id: 'p68' },
      { x: 1200, y: 1250, id: 'p69' },
      { x: 1250, y: 1300, id: 'p70' },
    ],
    type: 'local',
    speedLimit: 20,
  },
];

// Bâtiments et zones d'intérêt
const BUILDINGS: Building[] = [
  // Zone universitaire
  { id: 'b1', x: 400, y: 250, width: 200, height: 120, name: 'Université - Bâtiment A', type: 'university' },
  { id: 'b2', x: 620, y: 250, width: 180, height: 120, name: 'Campus Informatique', type: 'university' },
  { id: 'b3', x: 850, y: 250, width: 140, height: 120, name: 'Bibliothèque', type: 'university' },

  // Zone commerciale
  { id: 'b4', x: 600, y: 850, width: 150, height: 130, name: 'Centre Commercial', type: 'commercial' },
  { id: 'b5', x: 780, y: 850, width: 120, height: 130, name: 'Cinéma', type: 'commercial' },

  // Zone résidentielle
  { id: 'b6', x: 300, y: 750, width: 80, height: 80, name: 'Résidence A', type: 'residential' },
  { id: 'b7', x: 300, y: 850, width: 80, height: 80, name: 'Résidence B', type: 'residential' },
  { id: 'b8', x: 1150, y: 750, width: 100, height: 100, name: 'Résidence C', type: 'residential' },

  // Zone publique
  { id: 'b9', x: 250, y: 1100, width: 120, height: 100, name: 'Mairie', type: 'public' },
  { id: 'b10', x: 1100, y: 1100, width: 140, height: 100, name: 'Hôpital', type: 'public' },

  // Parcs
  { id: 'b11', x: 1200, y: 1350, width: 200, height: 200, name: 'Parc Municipal', type: 'park' },
  { id: 'b12', x: 600, y: 1400, width: 150, height: 150, name: 'Jardin Public', type: 'park' },

  // Zone résidentielle Sud
  { id: 'b13', x: 350, y: 1700, width: 90, height: 90, name: 'Résidence D', type: 'residential' },
  { id: 'b14', x: 470, y: 1700, width: 90, height: 90, name: 'Résidence E', type: 'residential' },
  { id: 'b15', x: 1600, y: 1500, width: 100, height: 100, name: 'Résidence F', type: 'residential' },
];

// Générer les intersections à partir des routes
const generateIntersections = (): Intersection[] => {
  const intersections: Intersection[] = [];
  const points = new Map<string, { point: Point; roads: string[] }>();

  // Collecter tous les points de toutes les routes
  ROADS.forEach(road => {
    road.points.forEach(point => {
      const key = `${Math.round(point.x)},${Math.round(point.y)}`;
      if (!points.has(key)) {
        points.set(key, { point, roads: [road.id] });
      } else {
        const existing = points.get(key)!;
        if (!existing.roads.includes(road.id)) {
          existing.roads.push(road.id);
        }
      }
    });
  });

  // Convertir en intersections
  let id = 0;
  points.forEach(({ point, roads }) => {
    intersections.push({
      id: `i${id++}`,
      point,
      connectedRoads: roads,
    });
  });

  return intersections;
};

// ============================================
// Composant principal
// ============================================

export function PathfindingVisualizer() {
  const [state, setState] = useState<SimulationState>('idle');
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [placeMode, setPlaceMode] = useState<'start' | 'end'>('start');
  const [path, setPath] = useState<Point[]>([]);
  const [exploredNodes, setExploredNodes] = useState<Point[]>([]);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [stats, setStats] = useState({
    nodesExplored: 0,
    pathLength: 0,
    distance: 0,
    estimatedTime: 0
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: MAP_SIZE, height: MAP_SIZE });
  const [zoom, setZoom] = useState(1);

  const intersections = useRef(generateIntersections());
  const runningRef = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Distance euclidienne
  const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Convertir distance pixels en km
  const distanceInKm = (pixels: number): number => {
    return pixels * SCALE;
  };

  // Trouver la route entre deux points
  const findRoadBetween = (p1: Point, p2: Point): Road | null => {
    for (const road of ROADS) {
      const idx1 = road.points.findIndex(p => p.id === p1.id);
      const idx2 = road.points.findIndex(p => p.id === p2.id);
      if (idx1 !== -1 && idx2 !== -1 && Math.abs(idx1 - idx2) === 1) {
        return road;
      }
    }
    return null;
  };

  // Calculer le temps de trajet entre deux points (en minutes)
  const travelTime = (p1: Point, p2: Point): number => {
    const dist = distanceInKm(distance(p1, p2));
    const road = findRoadBetween(p1, p2);
    const speed = road ? road.speedLimit : 30; // vitesse par défaut
    return (dist / speed) * 60; // convertir en minutes
  };

  // Obtenir les voisins d'un point (points connectés par des routes)
  const getNeighbors = (point: Point): Point[] => {
    const neighbors: Point[] = [];

    // Trouver toutes les routes contenant ce point
    ROADS.forEach(road => {
      const idx = road.points.findIndex(p => p.id === point.id);
      if (idx !== -1) {
        // Ajouter le point précédent
        if (idx > 0) {
          neighbors.push(road.points[idx - 1]);
        }
        // Ajouter le point suivant
        if (idx < road.points.length - 1) {
          neighbors.push(road.points[idx + 1]);
        }
      }
    });

    return neighbors;
  };

  // Heuristique (distance euclidienne)
  const heuristic = (p1: Point, p2: Point): number => {
    return distance(p1, p2);
  };

  // Algorithme A* avec poids des routes
  const runAStar = async (start: Point, end: Point) => {
    const startNode: PathNode = {
      ...start,
      g: 0,
      h: heuristic(start, end),
      f: 0,
      parent: null
    };
    startNode.f = startNode.g + startNode.h;

    const openSet: PathNode[] = [startNode];
    const closedSet = new Set<string>();
    const explored: Point[] = [];

    while (openSet.length > 0 && runningRef.current) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      const key = current.id;
      if (closedSet.has(key)) continue;
      closedSet.add(key);

      explored.push({ x: current.x, y: current.y, id: current.id });
      setExploredNodes([...explored]);
      await new Promise(resolve => setTimeout(resolve, 101 - speed));

      if (current.id === end.id) {
        // Reconstruire le chemin
        const finalPath: Point[] = [];
        let node: PathNode | null = current;
        while (node) {
          finalPath.unshift({ x: node.x, y: node.y, id: node.id });
          node = node.parent;
        }

        // Calculer distance et temps réels
        let totalDistance = 0;
        let totalTime = 0;
        for (let i = 1; i < finalPath.length; i++) {
          const dist = distance(finalPath[i - 1], finalPath[i]);
          totalDistance += dist;
          totalTime += travelTime(finalPath[i - 1], finalPath[i]);
        }

        setPath(finalPath);
        setStats({
          nodesExplored: explored.length,
          pathLength: finalPath.length,
          distance: distanceInKm(totalDistance),
          estimatedTime: Math.ceil(totalTime)
        });
        setState('navigating');
        return;
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = neighbor.id;
        if (closedSet.has(neighborKey)) continue;

        // g(n) = temps de trajet réel (coût)
        const tentativeG = current.g + travelTime(current, neighbor);

        let neighborNode = openSet.find(n => n.id === neighbor.id);
        if (!neighborNode) {
          neighborNode = {
            ...neighbor,
            g: tentativeG,
            h: heuristic(neighbor, end),
            f: 0,
            parent: current
          };
          neighborNode.f = neighborNode.g + neighborNode.h;
          openSet.push(neighborNode);
        } else if (tentativeG < neighborNode.g) {
          neighborNode.g = tentativeG;
          neighborNode.f = neighborNode.g + neighborNode.h;
          neighborNode.parent = current;
        }
      }
    }

    setState('no-path');
  };

  // Démarrer la navigation
  const startNavigation = async () => {
    if (!startPoint || !endPoint) return;

    setState('calculating');
    setPath([]);
    setExploredNodes([]);
    setCurrentPosition(0);
    runningRef.current = true;

    await runAStar(startPoint, endPoint);
    runningRef.current = false;
  };

  // Animer le véhicule
  useEffect(() => {
    if (state === 'navigating' && path.length > 0) {
      const interval = setInterval(() => {
        setCurrentPosition(prev => {
          if (prev >= path.length - 1) {
            setState('completed');
            return prev;
          }
          return prev + 1;
        });
      }, 300);

      return () => clearInterval(interval);
    }
  }, [state, path.length]);

  // Placer un marqueur sur une intersection
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (state !== 'idle') return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();

    // Coordonnées dans le viewBox
    const x = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.width;
    const y = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.height;

    // Trouver l'intersection la plus proche
    const closest = intersections.current.reduce((best, inter) => {
      const dist = distance({ x, y, id: '' }, inter.point);
      return dist < best.dist ? { point: inter.point, dist } : best;
    }, { point: intersections.current[0].point, dist: Infinity });

    // Seuil adaptatif basé sur le zoom
    const threshold = 80 / zoom;
    if (closest.dist > threshold) return;

    if (placeMode === 'start') {
      setStartPoint(closest.point);
      setPlaceMode('end');
    } else {
      setEndPoint(closest.point);
    }
  };

  // Gestion du zoom avec la molette
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.min(Math.max(zoom * delta, 0.5), 4);

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const mouseX = viewBox.x + ((e.clientX - rect.left) / rect.width) * viewBox.width;
    const mouseY = viewBox.y + ((e.clientY - rect.top) / rect.height) * viewBox.height;

    const newWidth = MAP_SIZE / newZoom;
    const newHeight = MAP_SIZE / newZoom;

    const newX = mouseX - (mouseX - viewBox.x) * (newWidth / viewBox.width);
    const newY = mouseY - (mouseY - viewBox.y) * (newHeight / viewBox.height);

    setZoom(newZoom);
    setViewBox({
      x: Math.max(0, Math.min(newX, MAP_SIZE - newWidth)),
      y: Math.max(0, Math.min(newY, MAP_SIZE - newHeight)),
      width: newWidth,
      height: newHeight,
    });
  };

  // Zoom in/out avec boutons
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.3, 4);
    const newWidth = MAP_SIZE / newZoom;
    const newHeight = MAP_SIZE / newZoom;

    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;

    setZoom(newZoom);
    setViewBox({
      x: Math.max(0, Math.min(centerX - newWidth / 2, MAP_SIZE - newWidth)),
      y: Math.max(0, Math.min(centerY - newHeight / 2, MAP_SIZE - newHeight)),
      width: newWidth,
      height: newHeight,
    });
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.3, 0.5);
    const newWidth = MAP_SIZE / newZoom;
    const newHeight = MAP_SIZE / newZoom;

    const centerX = viewBox.x + viewBox.width / 2;
    const centerY = viewBox.y + viewBox.height / 2;

    setZoom(newZoom);
    setViewBox({
      x: Math.max(0, Math.min(centerX - newWidth / 2, MAP_SIZE - newWidth)),
      y: Math.max(0, Math.min(centerY - newHeight / 2, MAP_SIZE - newHeight)),
      width: newWidth,
      height: newHeight,
    });
  };

  const handleResetZoom = () => {
    setZoom(1);
    setViewBox({ x: 0, y: 0, width: MAP_SIZE, height: MAP_SIZE });
  };

  // Reset
  const reset = () => {
    setState('idle');
    setPath([]);
    setExploredNodes([]);
    setCurrentPosition(0);
    setStartPoint(null);
    setEndPoint(null);
    setPlaceMode('start');
    setStats({ nodesExplored: 0, pathLength: 0, distance: 0, estimatedTime: 0 });
    runningRef.current = false;
  };

  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  const canNavigate = startPoint && endPoint && state === 'idle';

  // Couleurs des types de routes
  const getRoadColor = (type: Road['type']): { stroke: string; width: number } => {
    switch (type) {
      case 'highway':
        return { stroke: '#FF6B35', width: 16 };
      case 'main':
        return { stroke: '#FFA500', width: 12 };
      case 'secondary':
        return { stroke: '#FFD700', width: 8 };
      case 'local':
        return { stroke: '#F4E285', width: 5 };
    }
  };

  const getBuildingColor = (type: Building['type']): string => {
    switch (type) {
      case 'university':
        return '#6495ED';
      case 'residential':
        return '#D3D3D3';
      case 'commercial':
        return '#DDA15E';
      case 'park':
        return '#90EE90';
      case 'public':
        return '#B19CD9';
    }
  };

  return (
    <div className="w-full bg-surface p-6 space-y-6">
      {/* En-tête GPS */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🗺️ Simulateur GPS - Quartier 5km²</h1>
            <p className="text-blue-100">Navigation intelligente avec A* • Routes pondérées • Virages réalistes</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-blue-200 mb-1">Algorithme</div>
            <div className="text-2xl font-bold">A*</div>
          </div>
        </div>
      </div>

      {/* Panneau de contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Instructions */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📍</span> Instructions
          </h3>
          <div className="space-y-2 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span>1. Cliquez sur une <strong>intersection</strong> pour le départ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">B</div>
              <span>2. Cliquez sur une intersection pour l'arrivée</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <span>3. Lancez la navigation</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-light/10">
            <div className="text-xs font-medium text-text">
              Mode: <span className={placeMode === 'start' ? 'text-green-400' : 'text-red-400'}>
                {placeMode === 'start' ? '📍 Placer point A' : '🎯 Placer point B'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span> Statistiques
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-2xl font-bold text-blue-400">{stats.nodesExplored}</div>
              <div className="text-xs text-text-muted">Intersections analysées</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.pathLength}</div>
              <div className="text-xs text-text-muted">Points du trajet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.distance.toFixed(2)} km</div>
              <div className="text-xs text-text-muted">Distance réelle</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.estimatedTime} min</div>
              <div className="text-xs text-text-muted">Temps estimé</div>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Contrôles
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Vitesse de calcul: {speed}%
              </label>
              <input
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={startNavigation}
                disabled={!canNavigate}
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {state === 'calculating' ? '⏳ Calcul...' : state === 'navigating' ? '🚗 Navigation...' : '▶ Naviguer'}
              </button>
              <button
                onClick={reset}
                disabled={state === 'calculating'}
                className="px-4 py-2 rounded-lg font-bold bg-surface-lighter text-text hover:bg-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <AnimatePresence>
        {state === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">✅</span>
              <div>
                <div className="font-bold text-green-400 text-lg">Destination atteinte !</div>
                <div className="text-sm text-text-muted">
                  {stats.distance.toFixed(2)} km parcourus • {stats.estimatedTime} min • {stats.nodesExplored} intersections analysées
                </div>
              </div>
            </div>
          </motion.div>
        )}
        {state === 'no-path' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/20 border-2 border-red-500 rounded-xl p-4 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">❌</span>
              <div>
                <div className="font-bold text-red-400 text-lg">Itinéraire impossible</div>
                <div className="text-sm text-text-muted">
                  Aucun chemin trouvé entre ces deux points.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carte GPS */}
      <div className="bg-surface-light rounded-2xl p-4 border border-primary-light/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text flex items-center gap-2 text-lg">
            <span className="text-2xl">🏙️</span> Carte Interactive - Quartier 5km²
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setPlaceMode('start')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                placeMode === 'start' ? 'bg-green-500 text-white shadow-lg' : 'bg-surface text-text-muted'
              }`}
            >
              📍 Point A
            </button>
            <button
              onClick={() => setPlaceMode('end')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all text-sm ${
                placeMode === 'end' ? 'bg-red-500 text-white shadow-lg' : 'bg-surface text-text-muted'
              }`}
            >
              🎯 Point B
            </button>
            <div className="border-l border-primary-light/20 mx-1" />
            <button
              onClick={handleZoomIn}
              className="px-3 py-1.5 rounded-lg font-medium bg-surface text-text hover:bg-surface-lighter transition-all text-sm"
              title="Zoom avant"
            >
              🔍+
            </button>
            <button
              onClick={handleZoomOut}
              className="px-3 py-1.5 rounded-lg font-medium bg-surface text-text hover:bg-surface-lighter transition-all text-sm"
              title="Zoom arrière"
            >
              🔍-
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1.5 rounded-lg font-medium bg-surface text-text hover:bg-surface-lighter transition-all text-sm"
              title="Réinitialiser le zoom"
            >
              ⊙
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-inner overflow-hidden">
          <svg
            ref={svgRef}
            width="100%"
            height="600"
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
            className="w-full cursor-crosshair bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg"
            onClick={handleMapClick}
            onWheel={handleWheel}
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Bâtiments */}
            {BUILDINGS.map(building => (
              <g key={building.id}>
                <rect
                  x={building.x}
                  y={building.y}
                  width={building.width}
                  height={building.height}
                  fill={getBuildingColor(building.type)}
                  stroke="#555"
                  strokeWidth="2"
                  rx="4"
                  opacity={0.7}
                />
                <text
                  x={building.x + building.width / 2}
                  y={building.y + building.height / 2}
                  fill="#222"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {building.name}
                </text>
              </g>
            ))}

            {/* Routes */}
            {ROADS.map(road => {
              const { stroke, width } = getRoadColor(road.type);
              const pathData = road.points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

              return (
                <g key={road.id}>
                  {/* Bordure de route */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={width + 4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.9}
                  />
                  {/* Centre de route */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="white"
                    strokeWidth={width}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={road.type === 'highway' ? '20,10' : road.type === 'secondary' ? '10,5' : undefined}
                  />
                  {/* Nom de route (pour routes principales) */}
                  {road.type !== 'local' && (
                    <text
                      x={road.points[Math.floor(road.points.length / 2)].x}
                      y={road.points[Math.floor(road.points.length / 2)].y - 10}
                      fill="#444"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {road.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Nœuds explorés */}
            {exploredNodes.map((node, idx) => (
              <circle
                key={`explored-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={6}
                fill="#00BFFF"
                opacity={0.3 + (idx / exploredNodes.length) * 0.5}
              />
            ))}

            {/* Chemin trouvé */}
            {path.length > 1 && (
              <path
                d={path.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')}
                fill="none"
                stroke="#4169E1"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.8}
              />
            )}

            {/* Véhicule en mouvement */}
            {state === 'navigating' && path[currentPosition] && (
              <g>
                <circle
                  cx={path[currentPosition].x}
                  cy={path[currentPosition].y}
                  r={15}
                  fill="#4169E1"
                />
                <text
                  x={path[currentPosition].x}
                  y={path[currentPosition].y}
                  fill="white"
                  fontSize="20"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  🚗
                </text>
              </g>
            )}

            {/* Marqueur départ */}
            {startPoint && (
              <g>
                <circle cx={startPoint.x} cy={startPoint.y} r={25} fill="#10B981" opacity={0.2} />
                <circle cx={startPoint.x} cy={startPoint.y} r={20} fill="#10B981" />
                <text
                  x={startPoint.x}
                  y={startPoint.y + 2}
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  A
                </text>
              </g>
            )}

            {/* Marqueur arrivée */}
            {endPoint && (
              <g>
                <circle cx={endPoint.x} cy={endPoint.y} r={25} fill="#EF4444" opacity={0.2} />
                <circle cx={endPoint.x} cy={endPoint.y} r={20} fill="#EF4444" />
                <text
                  x={endPoint.x}
                  y={endPoint.y + 2}
                  fill="white"
                  fontSize="18"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  B
                </text>
              </g>
            )}

            {/* Intersections (petits cercles cliquables) */}
            {state === 'idle' && intersections.current.map(inter => (
              <circle
                key={inter.id}
                cx={inter.point.x}
                cy={inter.point.y}
                r={5}
                fill="#666"
                opacity={0.5}
                className="hover:opacity-100 transition-opacity cursor-pointer"
              />
            ))}
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-4 pt-4 border-t border-primary-light/10">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-orange-600 rounded" />
              <span className="text-text-muted">Autoroute (130 km/h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-3 bg-orange-500 rounded" />
              <span className="text-text-muted">Route principale (50 km/h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-yellow-400 rounded" />
              <span className="text-text-muted">Route secondaire (30 km/h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-3 bg-yellow-200 rounded" />
              <span className="text-text-muted">Rue locale (20 km/h)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-text-muted">Exploration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-blue-600 rounded" />
              <span className="text-text-muted">Itinéraire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section éducative (condensée) */}
      <div className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden shadow-lg">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Comprendre l'algorithme A*</div>
              <div className="text-sm text-text-muted">Avec pondération des routes et optimisation du temps de trajet</div>
            </div>
          </div>
          <motion.span
            animate={{ rotate: showExplanation ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted text-2xl"
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-4 border-t border-primary-light/10">
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-blue-400 mb-2">🎯 Pondération des routes</h3>
                  <p className="text-sm text-text-muted leading-relaxed">
                    Dans cette simulation, A* utilise le <strong>temps de trajet réel</strong> comme coût.
                    Une autoroute à 130 km/h est plus rapide qu'une petite rue à 20 km/h, même si elle est plus longue !
                  </p>
                  <div className="mt-3 space-y-1 text-sm text-text-muted">
                    <div>• <strong>g(n)</strong> = temps de trajet réel depuis le départ (en minutes)</div>
                    <div>• <strong>h(n)</strong> = estimation du temps restant (heuristique)</div>
                    <div>• <strong>Vitesse = distance × limite de vitesse</strong> pour chaque segment</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">✅ Optimisation intelligente</h4>
                    <p className="text-sm text-text-muted">
                      A* peut choisir un trajet plus long sur autoroute plutôt qu'un trajet court sur petites rues,
                      car le temps de trajet est optimisé.
                    </p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🌍 Utilisé partout</h4>
                    <p className="text-sm text-text-muted">
                      Google Maps, Waze utilisent exactement ce principe : routes pondérées par vitesse + trafic en temps réel.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PathfindingVisualizer;
