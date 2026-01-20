// ============================================
// PathfindingVisualizer - Algorithmes de parcours de graphes
// Visualisation pédagogique simple
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface NodeState {
  id: string;
  visited: boolean;
  current: boolean;
  path: boolean;
  distance: number;
  parent: string | null;
}

type Algorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

// ============================================
// Graphe exemple
// ============================================

const NODES: Node[] = [
  { id: 'A', x: 150, y: 200, label: 'A' },
  { id: 'B', x: 400, y: 100, label: 'B' },
  { id: 'C', x: 400, y: 300, label: 'C' },
  { id: 'D', x: 650, y: 150, label: 'D' },
  { id: 'E', x: 650, y: 350, label: 'E' },
  { id: 'F', x: 900, y: 100, label: 'F' },
  { id: 'G', x: 900, y: 300, label: 'G' },
  { id: 'H', x: 1150, y: 200, label: 'H' },
];

const EDGES: Edge[] = [
  { from: 'A', to: 'B', weight: 4 },
  { from: 'A', to: 'C', weight: 2 },
  { from: 'B', to: 'D', weight: 5 },
  { from: 'C', to: 'D', weight: 8 },
  { from: 'C', to: 'E', weight: 10 },
  { from: 'D', to: 'F', weight: 6 },
  { from: 'D', to: 'E', weight: 2 },
  { from: 'E', to: 'G', weight: 3 },
  { from: 'F', to: 'H', weight: 3 },
  { from: 'G', to: 'H', weight: 1 },
];

// ============================================
// Informations algorithmes
// ============================================

const ALGO_INFO: Record<Algorithm, { name: string; description: string; color: string }> = {
  bfs: {
    name: 'BFS (Largeur)',
    description: 'Parcours en largeur d\'abord - explore niveau par niveau',
    color: '#3B82F6',
  },
  dfs: {
    name: 'DFS (Profondeur)',
    description: 'Parcours en profondeur d\'abord - explore aussi loin que possible',
    color: '#8B5CF6',
  },
  dijkstra: {
    name: 'Dijkstra',
    description: 'Chemin le plus court avec poids - optimal pour graphes pondérés',
    color: '#10B981',
  },
  astar: {
    name: 'A*',
    description: 'Dijkstra + heuristique - plus rapide vers la cible',
    color: '#F59E0B',
  },
};

// ============================================
// Composant principal
// ============================================

export function PathfindingVisualizer() {
  const [algorithm, setAlgorithm] = useState<Algorithm>('bfs');
  const [startNode, setStartNode] = useState<string>('A');
  const [endNode, setEndNode] = useState<string>('H');
  const [isRunning, setIsRunning] = useState(false);
  const [nodeStates, setNodeStates] = useState<Map<string, NodeState>>(new Map());
  const [step, setStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [showExplanation, setShowExplanation] = useState(false);
  const [stats, setStats] = useState({
    nodesVisited: 0,
    pathLength: 0,
    totalCost: 0,
  });

  const animationRef = useRef<number | undefined>(undefined);
  const stepsRef = useRef<NodeState[][]>([]);

  // Initialiser les états des nœuds
  const initializeNodeStates = () => {
    const states = new Map<string, NodeState>();
    NODES.forEach(node => {
      states.set(node.id, {
        id: node.id,
        visited: false,
        current: false,
        path: false,
        distance: Infinity,
        parent: null,
      });
    });
    return states;
  };

  // Obtenir les voisins d'un nœud
  const getNeighbors = (nodeId: string): { id: string; weight: number }[] => {
    const neighbors: { id: string; weight: number }[] = [];
    EDGES.forEach(edge => {
      if (edge.from === nodeId) {
        neighbors.push({ id: edge.to, weight: edge.weight });
      }
      if (edge.to === nodeId) {
        neighbors.push({ id: edge.from, weight: edge.weight });
      }
    });
    return neighbors;
  };

  // Distance euclidienne (heuristique pour A*)
  const heuristic = (from: string, to: string): number => {
    const fromNode = NODES.find(n => n.id === from)!;
    const toNode = NODES.find(n => n.id === to)!;
    return Math.sqrt(Math.pow(toNode.x - fromNode.x, 2) + Math.pow(toNode.y - fromNode.y, 2)) / 100;
  };

  // BFS - Parcours en largeur
  const runBFS = () => {
    const steps: NodeState[][] = [];
    const queue: string[] = [startNode];
    const states = initializeNodeStates();
    states.get(startNode)!.distance = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentState = states.get(current)!;

      if (currentState.visited) continue;
      currentState.visited = true;
      currentState.current = true;

      // Enregistrer l'état
      steps.push(Array.from(states.values()).map(s => ({ ...s })));
      currentState.current = false;

      if (current === endNode) break;

      // Explorer les voisins
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborState = states.get(neighbor.id)!;
        if (!neighborState.visited && neighborState.parent === null) {
          neighborState.parent = current;
          neighborState.distance = currentState.distance + 1;
          queue.push(neighbor.id);
        }
      }
    }

    // Reconstruire le chemin
    reconstructPath(states, steps);
    return steps;
  };

  // DFS - Parcours en profondeur
  const runDFS = () => {
    const steps: NodeState[][] = [];
    const stack: string[] = [startNode];
    const states = initializeNodeStates();
    states.get(startNode)!.distance = 0;

    while (stack.length > 0) {
      const current = stack.pop()!;
      const currentState = states.get(current)!;

      if (currentState.visited) continue;
      currentState.visited = true;
      currentState.current = true;

      steps.push(Array.from(states.values()).map(s => ({ ...s })));
      currentState.current = false;

      if (current === endNode) break;

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors.reverse()) {
        const neighborState = states.get(neighbor.id)!;
        if (!neighborState.visited && neighborState.parent === null) {
          neighborState.parent = current;
          neighborState.distance = currentState.distance + 1;
          stack.push(neighbor.id);
        }
      }
    }

    reconstructPath(states, steps);
    return steps;
  };

  // Dijkstra - Plus court chemin
  const runDijkstra = () => {
    const steps: NodeState[][] = [];
    const unvisited = new Set(NODES.map(n => n.id));
    const states = initializeNodeStates();
    states.get(startNode)!.distance = 0;

    while (unvisited.size > 0) {
      // Trouver le nœud non visité avec la plus petite distance
      let current: string | null = null;
      let minDist = Infinity;
      for (const nodeId of unvisited) {
        const dist = states.get(nodeId)!.distance;
        if (dist < minDist) {
          minDist = dist;
          current = nodeId;
        }
      }

      if (current === null || minDist === Infinity) break;

      unvisited.delete(current);
      const currentState = states.get(current)!;
      currentState.visited = true;
      currentState.current = true;

      steps.push(Array.from(states.values()).map(s => ({ ...s })));
      currentState.current = false;

      if (current === endNode) break;

      // Mettre à jour les distances des voisins
      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborState = states.get(neighbor.id)!;
        const newDist = currentState.distance + neighbor.weight;
        if (newDist < neighborState.distance) {
          neighborState.distance = newDist;
          neighborState.parent = current;
        }
      }
    }

    reconstructPath(states, steps);
    return steps;
  };

  // A* - Dijkstra avec heuristique
  const runAStar = () => {
    const steps: NodeState[][] = [];
    const openSet = new Set([startNode]);
    const closedSet = new Set<string>();
    const states = initializeNodeStates();
    const fScores = new Map<string, number>();

    states.get(startNode)!.distance = 0;
    fScores.set(startNode, heuristic(startNode, endNode));

    while (openSet.size > 0) {
      // Trouver le nœud avec le plus petit f-score
      let current: string | null = null;
      let minF = Infinity;
      for (const nodeId of openSet) {
        const f = fScores.get(nodeId) ?? Infinity;
        if (f < minF) {
          minF = f;
          current = nodeId;
        }
      }

      if (current === null) break;

      openSet.delete(current);
      closedSet.add(current);
      const currentState = states.get(current)!;
      currentState.visited = true;
      currentState.current = true;

      steps.push(Array.from(states.values()).map(s => ({ ...s })));
      currentState.current = false;

      if (current === endNode) break;

      const neighbors = getNeighbors(current);
      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor.id)) continue;

        const tentativeG = currentState.distance + neighbor.weight;
        const neighborState = states.get(neighbor.id)!;

        if (tentativeG < neighborState.distance) {
          neighborState.parent = current;
          neighborState.distance = tentativeG;
          fScores.set(neighbor.id, tentativeG + heuristic(neighbor.id, endNode));
          openSet.add(neighbor.id);
        }
      }
    }

    reconstructPath(states, steps);
    return steps;
  };

  // Reconstruire le chemin
  const reconstructPath = (states: Map<string, NodeState>, steps: NodeState[][]) => {
    let current: string | null = endNode;
    let pathLength = 0;
    let totalCost = 0;

    while (current !== null) {
      const state: NodeState = states.get(current)!;
      state.path = true;
      pathLength++;
      totalCost = state.distance;
      current = state.parent;
    }

    steps.push(Array.from(states.values()).map(s => ({ ...s })));

    setStats({
      nodesVisited: Array.from(states.values()).filter(s => s.visited).length,
      pathLength,
      totalCost: Math.round(totalCost * 10) / 10,
    });
  };

  // Exécuter l'algorithme
  const runAlgorithm = () => {
    let steps: NodeState[][] = [];

    switch (algorithm) {
      case 'bfs':
        steps = runBFS();
        break;
      case 'dfs':
        steps = runDFS();
        break;
      case 'dijkstra':
        steps = runDijkstra();
        break;
      case 'astar':
        steps = runAStar();
        break;
    }

    stepsRef.current = steps;
    setTotalSteps(steps.length);
    setStep(0);
    setIsRunning(true);
  };

  // Animation
  useEffect(() => {
    if (!isRunning || step >= totalSteps) {
      setIsRunning(false);
      return;
    }

    animationRef.current = window.setTimeout(() => {
      const currentStates = stepsRef.current[step];
      const newStates = new Map<string, NodeState>();
      currentStates.forEach(state => {
        newStates.set(state.id, state);
      });
      setNodeStates(newStates);
      setStep(prev => prev + 1);
    }, speed);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, step, totalSteps, speed]);

  // Reset
  const handleReset = () => {
    setIsRunning(false);
    setNodeStates(initializeNodeStates());
    setStep(0);
    setTotalSteps(0);
    setStats({ nodesVisited: 0, pathLength: 0, totalCost: 0 });
  };

  const algoInfo = ALGO_INFO[algorithm];

  return (
    <div className="w-full bg-surface p-6 space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🔍 Algorithmes de parcours de graphes</h1>
            <p className="text-blue-100">Visualisation pédagogique • BFS, DFS, Dijkstra, A*</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-blue-200 mb-1">Algorithme</div>
            <div className="text-2xl font-bold">{algoInfo.name}</div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sélection algorithme */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">🎯</span> Algorithme
          </h3>
          <div className="space-y-2">
            {(Object.keys(ALGO_INFO) as Algorithm[]).map(algo => (
              <button
                key={algo}
                onClick={() => {
                  setAlgorithm(algo);
                  handleReset();
                }}
                disabled={isRunning}
                className={`w-full px-3 py-2 rounded-lg text-left transition-all disabled:opacity-50 ${
                  algorithm === algo
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-surface hover:bg-surface-lighter text-text'
                }`}
              >
                <div className="font-bold text-sm">{ALGO_INFO[algo].name}</div>
                <div className="text-xs opacity-75">{ALGO_INFO[algo].description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Points de départ/arrivée */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📍</span> Nœuds
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-text-muted mb-2 block">Nœud de départ</label>
              <select
                value={startNode}
                onChange={(e) => {
                  setStartNode(e.target.value);
                  handleReset();
                }}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded-lg bg-surface text-text disabled:opacity-50"
              >
                {NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-text-muted mb-2 block">Nœud d'arrivée</label>
              <select
                value={endNode}
                onChange={(e) => {
                  setEndNode(e.target.value);
                  handleReset();
                }}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded-lg bg-surface text-text disabled:opacity-50"
              >
                {NODES.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Contrôles et stats */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Contrôles
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={runAlgorithm}
                disabled={isRunning || startNode === endNode}
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                ▶ Lancer
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-bold bg-surface-lighter text-text hover:bg-surface transition-all"
              >
                🔄
              </button>
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Vitesse: {speed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-primary-light/10">
              <div>
                <div className="text-xl font-bold text-blue-400">{stats.nodesVisited}</div>
                <div className="text-xs text-text-muted">Visités</div>
              </div>
              <div>
                <div className="text-xl font-bold text-green-400">{stats.pathLength}</div>
                <div className="text-xs text-text-muted">Longueur</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">{stats.totalCost}</div>
                <div className="text-xs text-text-muted">Coût</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualisation du graphe */}
      <div className="bg-surface-light rounded-2xl p-4 border border-primary-light/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text flex items-center gap-2 text-lg">
            <span className="text-2xl">🕸️</span> Graphe
          </h3>
          <div className="text-xs text-text-muted">
            {isRunning ? `Étape ${step}/${totalSteps}` : 'Prêt'}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-8 shadow-inner min-h-[500px] relative">
          <svg width="1300" height="500" className="w-full">
            {/* Arêtes */}
            {EDGES.map((edge, idx) => {
              const fromNode = NODES.find(n => n.id === edge.from)!;
              const toNode = NODES.find(n => n.id === edge.to)!;

              // Vérifier si cette arête fait partie du chemin
              const fromState = nodeStates.get(edge.from);
              const toState = nodeStates.get(edge.to);
              const isInPath =
                fromState?.path &&
                toState?.path &&
                (fromState.parent === edge.to || toState.parent === edge.from);

              return (
                <g key={idx}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={isInPath ? algoInfo.color : '#444'}
                    strokeWidth={isInPath ? 4 : 2}
                    opacity={isInPath ? 1 : 0.3}
                  />
                  {/* Poids de l'arête */}
                  <text
                    x={(fromNode.x + toNode.x) / 2}
                    y={(fromNode.y + toNode.y) / 2 - 10}
                    fill="#888"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {edge.weight}
                  </text>
                </g>
              );
            })}

            {/* Nœuds */}
            {NODES.map(node => {
              const state = nodeStates.get(node.id);
              let fillColor = '#1e293b';
              let strokeColor = '#475569';

              if (node.id === startNode) {
                fillColor = '#10B981';
                strokeColor = '#059669';
              } else if (node.id === endNode) {
                fillColor = '#EF4444';
                strokeColor = '#DC2626';
              } else if (state?.path) {
                fillColor = algoInfo.color;
                strokeColor = algoInfo.color;
              } else if (state?.current) {
                fillColor = '#FBBF24';
                strokeColor = '#F59E0B';
              } else if (state?.visited) {
                fillColor = '#60A5FA';
                strokeColor = '#3B82F6';
              }

              return (
                <g key={node.id}>
                  {/* Node circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={30}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={4}
                  />
                  {/* Node label */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    fill="white"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {node.label}
                  </text>
                  {/* Distance label */}
                  {state && state.distance !== Infinity && state.distance > 0 && (
                    <text
                      x={node.x}
                      y={node.y - 45}
                      fill="#FFF"
                      fontSize="14"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {Math.round(state.distance * 10) / 10}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Légende */}
          <div className="absolute bottom-4 left-4 bg-black/50 rounded-lg p-3 flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <span className="text-white">Départ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-white">Arrivée</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-blue-400"></div>
              <span className="text-white">Visité</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
              <span className="text-white">En cours</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: algoInfo.color }}></div>
              <span className="text-white">Chemin</span>
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
              <div className="font-bold text-text text-lg">Comprendre les algorithmes de graphes</div>
              <div className="text-sm text-text-muted">Comment fonctionnent BFS, DFS, Dijkstra et A*</div>
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
                {/* BFS */}
                <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-blue-400 mb-2">🔵 BFS - Parcours en largeur</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>Principe :</strong> Explore tous les voisins directs d'un nœud avant de passer aux voisins des voisins.
                    Utilise une <strong>file (FIFO)</strong>.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>Avantage :</strong> Trouve toujours le chemin avec le moins de nœuds</li>
                    <li>• <strong>Inconvénient :</strong> Ne prend pas en compte les poids des arêtes</li>
                    <li>• <strong>Utilisation :</strong> Plus court chemin non pondéré, détection de cycles</li>
                  </ul>
                </div>

                {/* DFS */}
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded">
                  <h3 className="font-bold text-purple-400 mb-2">🟣 DFS - Parcours en profondeur</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>Principe :</strong> Explore aussi loin que possible le long de chaque branche avant de revenir.
                    Utilise une <strong>pile (LIFO)</strong>.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>Avantage :</strong> Utilise moins de mémoire que BFS</li>
                    <li>• <strong>Inconvénient :</strong> Peut ne pas trouver le chemin optimal</li>
                    <li>• <strong>Utilisation :</strong> Détection de cycles, composantes connexes, parcours d'arbres</li>
                  </ul>
                </div>

                {/* Dijkstra */}
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded">
                  <h3 className="font-bold text-green-400 mb-2">🟢 Dijkstra - Plus court chemin pondéré</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>Principe :</strong> À chaque étape, visite le nœud non visité avec la plus petite distance cumulée.
                    Utilise une <strong>file de priorité</strong>.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>Avantage :</strong> Trouve toujours le chemin optimal dans un graphe pondéré</li>
                    <li>• <strong>Inconvénient :</strong> Explore tous les nœuds, même ceux loin de la cible</li>
                    <li>• <strong>Utilisation :</strong> GPS, routage réseau, planification de trajets</li>
                  </ul>
                </div>

                {/* A* */}
                <div className="bg-orange-500/10 border-l-4 border-orange-500 p-4 rounded">
                  <h3 className="font-bold text-orange-400 mb-2">🟠 A* - Dijkstra optimisé</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>Principe :</strong> Comme Dijkstra mais utilise une <strong>heuristique</strong> (estimation de la distance restante)
                    pour prioriser les nœuds qui semblent plus proches de la cible.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>Formule :</strong> f(n) = g(n) + h(n) où g = coût réel, h = estimation</li>
                    <li>• <strong>Avantage :</strong> Plus rapide que Dijkstra, trouve quand même l'optimal</li>
                    <li>• <strong>Inconvénient :</strong> Nécessite une bonne heuristique</li>
                    <li>• <strong>Utilisation :</strong> Jeux vidéo, GPS, IA, robotique</li>
                  </ul>
                </div>

                {/* Comparaison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-cyan-500">
                    <h4 className="font-bold text-cyan-400 mb-2">📊 Complexité</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>BFS/DFS :</strong> O(V + E) - Linéaire</li>
                      <li>• <strong>Dijkstra :</strong> O((V + E) log V) - Avec file de priorité</li>
                      <li>• <strong>A* :</strong> Variable selon heuristique</li>
                    </ul>
                    <p className="text-xs text-text-muted mt-2">V = nœuds, E = arêtes</p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-400 mb-2">🎯 Quand utiliser quoi ?</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Graphe non pondéré :</strong> BFS</li>
                      <li>• <strong>Exploration complète :</strong> DFS</li>
                      <li>• <strong>Chemin optimal pondéré :</strong> Dijkstra</li>
                      <li>• <strong>Chemin rapide avec cible :</strong> A*</li>
                    </ul>
                  </div>
                </div>

                {/* Licence */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-2 border-blue-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-blue-400 mb-2">🎓 Dans la Licence Informatique</h4>
                  <p className="text-sm text-text-muted">
                    Les algorithmes de graphes sont enseignés en <strong>L2</strong> (Algorithmique avancée) et
                    approfondis en <strong>L3</strong> (Théorie des graphes, Optimisation). Vous apprendrez les
                    structures de données (files, piles, tas), l'analyse de complexité, et les applications pratiques
                    (réseaux, IA, optimisation).
                  </p>
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
