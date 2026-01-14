// ============================================
// PathfindingVisualizer - Simulateur GPS Réaliste avec A*
// Interface visuelle comme Google Maps avec routes, marqueurs et navigation
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

interface Street {
  id: string;
  name: string;
  points: Point[];
  type: 'main' | 'secondary';
}

interface Building {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  name?: string;
}

interface PathNode extends Point {
  g: number;
  h: number;
  f: number;
  parent: PathNode | null;
}

type SimulationState = 'idle' | 'calculating' | 'navigating' | 'completed' | 'no-path';

// ============================================
// Données de la carte - Ville stylisée
// ============================================

const MAP_WIDTH = 800;
const MAP_HEIGHT = 600;

const STREETS: Street[] = [
  // Routes principales (horizontal)
  { id: 's1', name: 'Avenue de l\'Université', points: [{ x: 0, y: 150, id: 'p1' }, { x: 800, y: 150, id: 'p2' }], type: 'main' },
  { id: 's2', name: 'Boulevard des Sciences', points: [{ x: 0, y: 300, id: 'p3' }, { x: 800, y: 300, id: 'p4' }], type: 'main' },
  { id: 's3', name: 'Rue de l\'Innovation', points: [{ x: 0, y: 450, id: 'p5' }, { x: 800, y: 450, id: 'p6' }], type: 'secondary' },

  // Routes principales (vertical)
  { id: 's4', name: 'Rue Victor Hugo', points: [{ x: 200, y: 0, id: 'p7' }, { x: 200, y: 600, id: 'p8' }], type: 'main' },
  { id: 's5', name: 'Avenue Jean Jaurès', points: [{ x: 400, y: 0, id: 'p9' }, { x: 400, y: 600, id: 'p10' }], type: 'main' },
  { id: 's6', name: 'Rue de la Paix', points: [{ x: 600, y: 0, id: 'p11' }, { x: 600, y: 600, id: 'p12' }], type: 'secondary' },
];

const BUILDINGS: Building[] = [
  { id: 'b1', x: 50, y: 50, width: 100, height: 80, name: 'Mairie' },
  { id: 'b2', x: 250, y: 50, width: 120, height: 80, name: 'Bibliothèque' },
  { id: 'b3', x: 450, y: 50, width: 100, height: 80, name: 'Musée' },
  { id: 'b4', x: 650, y: 50, width: 120, height: 80, name: 'Théâtre' },

  { id: 'b5', x: 50, y: 180, width: 120, height: 100, name: 'Université' },
  { id: 'b6', x: 450, y: 180, width: 120, height: 100, name: 'Campus Info' },
  { id: 'b7', x: 650, y: 180, width: 100, height: 100, name: 'Gymnase' },

  { id: 'b8', x: 50, y: 330, width: 100, height: 100, name: 'Hôpital' },
  { id: 'b9', x: 250, y: 330, width: 120, height: 100, name: 'Centre Commercial' },
  { id: 'b10', x: 650, y: 330, width: 100, height: 100, name: 'Parc' },

  { id: 'b11', x: 50, y: 480, width: 120, height: 100, name: 'Gare' },
  { id: 'b12', x: 450, y: 480, width: 100, height: 100, name: 'Stade' },
];

// Générer les points de navigation sur les intersections
const generateNavigationPoints = (): Point[] => {
  const points: Point[] = [];
  const yPositions = [150, 300, 450];
  const xPositions = [200, 400, 600];

  let id = 0;
  for (const y of yPositions) {
    for (const x of xPositions) {
      points.push({ x, y, id: `n${id++}` });
    }
  }

  // Ajouter points de bord
  const edges = [
    { x: 50, y: 150 }, { x: 750, y: 150 },
    { x: 50, y: 300 }, { x: 750, y: 300 },
    { x: 50, y: 450 }, { x: 750, y: 450 },
    { x: 200, y: 50 }, { x: 400, y: 50 }, { x: 600, y: 50 },
    { x: 200, y: 550 }, { x: 400, y: 550 }, { x: 600, y: 550 },
  ];

  edges.forEach((pt, i) => points.push({ ...pt, id: `e${i}` }));

  return points;
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

  const navigationPoints = useRef(generateNavigationPoints());
  const runningRef = useRef(false);

  // Fonction de distance
  const distance = (p1: Point, p2: Point): number => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  // Vérifier si un point est dans un bâtiment
  const isInBuilding = (point: Point): boolean => {
    return BUILDINGS.some(b =>
      point.x >= b.x && point.x <= b.x + b.width &&
      point.y >= b.y && point.y <= b.y + b.height
    );
  };

  // Obtenir les voisins d'un point
  const getNeighbors = (point: Point): Point[] => {
    const maxDistance = 250; // Distance maximale pour être connecté
    return navigationPoints.current.filter(p => {
      if (p.id === point.id) return false;
      const dist = distance(p, point);
      if (dist > maxDistance) return false;

      // Vérifier qu'il n'y a pas de bâtiment entre les deux points
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const checkPoint = {
          x: point.x + (p.x - point.x) * t,
          y: point.y + (p.y - point.y) * t,
          id: 'check'
        };
        if (isInBuilding(checkPoint)) return false;
      }

      return true;
    });
  };

  // Heuristique
  const heuristic = (p1: Point, p2: Point): number => {
    return distance(p1, p2);
  };

  // Algorithme A*
  const runAStar = async (start: Point, end: Point) => {
    const startNode: PathNode = { ...start, g: 0, h: heuristic(start, end), f: 0, parent: null };
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

      if (distance(current, end) < 20) {
        // Reconstruire le chemin
        const finalPath: Point[] = [];
        let node: PathNode | null = current;
        while (node) {
          finalPath.unshift({ x: node.x, y: node.y, id: node.id });
          node = node.parent;
        }

        const totalDistance = finalPath.reduce((sum, point, i) => {
          if (i === 0) return 0;
          return sum + distance(finalPath[i - 1], point);
        }, 0);

        setPath(finalPath);
        setStats({
          nodesExplored: explored.length,
          pathLength: finalPath.length,
          distance: totalDistance / 100, // Convertir en km
          estimatedTime: Math.ceil(totalDistance / 833) // 50 km/h en minutes
        });
        setState('navigating');
        return;
      }

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = neighbor.id;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = current.g + distance(current, neighbor);

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

  // Animer le véhicule sur le chemin
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
      }, 500);

      return () => clearInterval(interval);
    }
  }, [state, path.length]);

  // Placer un marqueur
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (state !== 'idle') return;

    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Trouver le point le plus proche
    const closest = navigationPoints.current.reduce((best, point) => {
      const dist = distance({ x, y, id: '' }, point);
      return dist < best.dist ? { point, dist } : best;
    }, { point: navigationPoints.current[0], dist: Infinity });

    if (closest.dist > 50) return; // Trop loin

    if (placeMode === 'start') {
      setStartPoint(closest.point);
      setPlaceMode('end');
    } else {
      setEndPoint(closest.point);
    }
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

  return (
    <div className="w-full bg-surface p-6 space-y-6">
      {/* En-tête GPS */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🗺️ Navigation GPS Intelligente</h1>
            <p className="text-blue-100">Pathfinding A* - Comme Google Maps en temps réel</p>
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
              <span>1. Cliquez sur une intersection pour le <strong>départ</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">B</div>
              <span>2. Cliquez sur une intersection pour l'<strong>arrivée</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚗</span>
              <span>3. Lancez la navigation</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-light/10">
            <div className="text-xs font-medium text-text">
              Mode: <span className={placeMode === 'start' ? 'text-green-400' : 'text-red-400'}>
                {placeMode === 'start' ? '📍 Placer point A' : '📍 Placer point B'}
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
              <div className="text-xs text-text-muted">Nœuds explorés</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-400">{stats.pathLength}</div>
              <div className="text-xs text-text-muted">Points du trajet</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{stats.distance.toFixed(1)} km</div>
              <div className="text-xs text-text-muted">Distance</div>
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
                  {stats.distance.toFixed(1)} km parcourus • {stats.estimatedTime} min • {stats.nodesExplored} intersections analysées
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
                  Aucun chemin trouvé entre ces deux points. Essayez d'autres emplacements.
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
            <span className="text-2xl">🏙️</span> Carte Interactive
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
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 shadow-inner">
          <svg
            width={MAP_WIDTH}
            height={MAP_HEIGHT}
            className="w-full h-auto cursor-crosshair bg-gradient-to-br from-green-50 to-blue-50 rounded-lg shadow-lg"
            onClick={handleMapClick}
          >
            {/* Routes */}
            {STREETS.map(street => (
              <g key={street.id}>
                <line
                  x1={street.points[0].x}
                  y1={street.points[0].y}
                  x2={street.points[1].x}
                  y2={street.points[1].y}
                  stroke={street.type === 'main' ? '#FFA500' : '#FFD700'}
                  strokeWidth={street.type === 'main' ? 12 : 8}
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <line
                  x1={street.points[0].x}
                  y1={street.points[0].y}
                  x2={street.points[1].x}
                  y2={street.points[1].y}
                  stroke="white"
                  strokeWidth={street.type === 'main' ? 8 : 5}
                  strokeLinecap="round"
                  strokeDasharray={street.type === 'secondary' ? '10,5' : undefined}
                />
                {/* Nom de rue */}
                {street.type === 'main' && (
                  <text
                    x={(street.points[0].x + street.points[1].x) / 2}
                    y={(street.points[0].y + street.points[1].y) / 2 + (street.points[0].y === street.points[1].y ? -15 : 0)}
                    fill="#444"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                    transform={street.points[0].y !== street.points[1].y ?
                      `rotate(-90, ${(street.points[0].x + street.points[1].x) / 2}, ${(street.points[0].y + street.points[1].y) / 2})` :
                      undefined}
                  >
                    {street.name}
                  </text>
                )}
              </g>
            ))}

            {/* Bâtiments */}
            {BUILDINGS.map(building => (
              <g key={building.id}>
                <rect
                  x={building.x}
                  y={building.y}
                  width={building.width}
                  height={building.height}
                  fill={building.name?.includes('Parc') ? '#90EE90' : building.name?.includes('Université') || building.name?.includes('Campus') ? '#6495ED' : '#B0C4DE'}
                  stroke="#555"
                  strokeWidth="2"
                  rx="4"
                  opacity={0.8}
                />
                {building.name && (
                  <text
                    x={building.x + building.width / 2}
                    y={building.y + building.height / 2}
                    fill="#333"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {building.name}
                  </text>
                )}
              </g>
            ))}

            {/* Nœuds explorés */}
            {exploredNodes.map((node, idx) => (
              <circle
                key={`explored-${node.id}`}
                cx={node.x}
                cy={node.y}
                r={4}
                fill="#00BFFF"
                opacity={0.3 + (idx / exploredNodes.length) * 0.5}
              />
            ))}

            {/* Chemin trouvé */}
            {path.length > 1 && (
              <polyline
                points={path.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#4169E1"
                strokeWidth="6"
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
                  r={12}
                  fill="#4169E1"
                />
                <text
                  x={path[currentPosition].x}
                  y={path[currentPosition].y}
                  fill="white"
                  fontSize="16"
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
                <circle cx={startPoint.x} cy={startPoint.y} r={20} fill="#10B981" opacity={0.2} />
                <circle cx={startPoint.x} cy={startPoint.y} r={16} fill="#10B981" />
                <text
                  x={startPoint.x}
                  y={startPoint.y + 1}
                  fill="white"
                  fontSize="16"
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
                <circle cx={endPoint.x} cy={endPoint.y} r={20} fill="#EF4444" opacity={0.2} />
                <circle cx={endPoint.x} cy={endPoint.y} r={16} fill="#EF4444" />
                <text
                  x={endPoint.x}
                  y={endPoint.y + 1}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  B
                </text>
              </g>
            )}

            {/* Points de navigation (petits cercles) */}
            {state === 'idle' && navigationPoints.current.map(point => (
              <circle
                key={point.id}
                cx={point.x}
                cy={point.y}
                r={3}
                fill="#999"
                opacity={0.4}
                className="hover:opacity-100 transition-opacity"
              />
            ))}
          </svg>
        </div>

        {/* Légende */}
        <div className="mt-4 pt-4 border-t border-primary-light/10">
          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-orange-500 rounded" />
              <span className="text-text-muted">Route principale</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-3 bg-yellow-400 rounded" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #FFD700 0, #FFD700 5px, transparent 5px, transparent 10px)' }} />
              <span className="text-text-muted">Route secondaire</span>
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

      {/* Section éducative */}
      <div className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden shadow-lg">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Comprendre l'algorithme A*</div>
              <div className="text-sm text-text-muted">Le secret derrière Google Maps et la navigation GPS</div>
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
              <div className="px-6 pb-6 space-y-6 border-t border-primary-light/10">
                {/* Comment ça marche */}
                <div>
                  <h3 className="font-bold text-blue-400 mb-3 mt-6 text-lg flex items-center gap-2">
                    <span>🔍</span> Comment fonctionne A* ?
                  </h3>
                  <div className="bg-surface rounded-lg p-4 space-y-3">
                    <p className="text-sm text-text-muted leading-relaxed">
                      A* combine <strong>distance parcourue</strong> + <strong>estimation intelligente</strong> pour trouver le chemin optimal.
                    </p>
                    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded">
                      <div className="font-mono text-lg text-blue-300 mb-3">f(n) = g(n) + h(n)</div>
                      <ul className="space-y-2 text-sm text-text-muted">
                        <li>• <strong>g(n)</strong> = distance réelle depuis le départ (GPS mesure les km)</li>
                        <li>• <strong>h(n)</strong> = estimation vers l'arrivée (heuristique)</li>
                        <li>• <strong>f(n)</strong> = coût total estimé (guide l'exploration)</li>
                      </ul>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      À chaque intersection, A* choisit le chemin avec le plus petit <code className="text-blue-300">f(n)</code>.
                      C'est exactement ce que fait Google Maps en temps réel !
                    </p>
                  </div>
                </div>

                {/* Applications */}
                <div>
                  <h3 className="font-bold text-green-400 mb-3 text-lg flex items-center gap-2">
                    <span>🌍</span> Utilisé partout dans le monde réel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-surface rounded-lg p-4 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🗺️</span>
                        <div className="font-bold text-text">Google Maps / Waze</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Calcul d'itinéraires en temps réel avec trafic
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎮</span>
                        <div className="font-bold text-text">Jeux vidéo</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        IA des PNJ, pathfinding des ennemis
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🤖</span>
                        <div className="font-bold text-text">Robotique</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Drones, robots aspirateurs, véhicules autonomes
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📦</span>
                        <div className="font-bold text-text">Logistique</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Amazon, UPS - optimisation des livraisons
                      </div>
                    </div>
                  </div>
                </div>

                {/* Dans la Licence */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-xl p-6">
                  <h3 className="font-bold text-blue-400 mb-3 text-lg flex items-center gap-2">
                    <span>🎓</span> Dans la Licence Informatique
                  </h3>
                  <div className="space-y-3 text-sm text-text-muted leading-relaxed">
                    <p>
                      Enseigné en <strong className="text-blue-300">L2-L3</strong> dans les cours
                      <strong> "Graphes & Algorithmes"</strong> et <strong>"Intelligence Artificielle"</strong>.
                    </p>
                    <div className="bg-surface/50 rounded-lg p-4 space-y-2">
                      <p className="font-bold text-text">Ce que vous apprendrez :</p>
                      <ul className="space-y-2 ml-4">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">→</span>
                          <span>Implémenter A*, Dijkstra, BFS, DFS</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">→</span>
                          <span>Concevoir des heuristiques admissibles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">→</span>
                          <span>Optimiser les performances en temps réel</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-400">→</span>
                          <span>Appliquer dans des projets de robotique/jeux</span>
                        </li>
                      </ul>
                    </div>
                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <p className="text-blue-300 font-medium text-base">
                        💼 Compétence <strong>essentielle</strong> pour travailler chez Google, dans le jeu vidéo,
                        la robotique, ou l'IA ! Maîtriser A* = maîtriser l'optimisation spatiale.
                      </p>
                    </div>
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
