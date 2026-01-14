// ============================================
// PathfindingVisualizer - Visualisation des algorithmes de recherche de chemin
// Démo pédagogique et impressionnante pour les futurs bacheliers
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================
// Types
// ============================================

type Algorithm = 'astar' | 'dijkstra' | 'bfs' | 'dfs';
type CellType = 'empty' | 'wall' | 'start' | 'end' | 'path' | 'visited' | 'current';
type DrawMode = 'wall' | 'start' | 'end' | 'erase';
type PathfindingState = 'idle' | 'running' | 'paused' | 'completed' | 'no-path';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  g: number; // Coût depuis le départ
  h: number; // Heuristique vers l'arrivée
  f: number; // g + h
  parent: Cell | null;
}

interface AlgorithmInfo {
  name: string;
  description: string;
  color: string;
  complexity: {
    time: string;
    space: string;
  };
  howItWorks: string[];
  whyUseIt: string;
  realWorldUses: string[];
  pros: string[];
  cons: string[];
}

// ============================================
// Configuration des algorithmes
// ============================================

const ALGORITHMS: Record<Algorithm, AlgorithmInfo> = {
  astar: {
    name: 'A* (A-star)',
    description: 'L\'algorithme optimal qui combine distance parcourue et estimation. Utilise une heuristique intelligente.',
    color: '#E74C3C',
    complexity: {
      time: 'O(b^d) optimisé par heuristique',
      space: 'O(b^d)',
    },
    howItWorks: [
      '1. Maintenir deux listes : OPEN (à explorer) et CLOSED (déjà visités)',
      '2. Pour chaque nœud, calculer f(n) = g(n) + h(n)',
      '   • g(n) = distance réelle depuis le départ',
      '   • h(n) = estimation (heuristique) vers l\'arrivée',
      '3. Toujours explorer le nœud avec le plus petit f(n)',
      '4. L\'heuristique guide vers la solution optimale',
    ],
    whyUseIt: 'L\'ALGORITHME DE RÉFÉRENCE pour le pathfinding ! Optimal et efficace grâce à son heuristique. Utilisé dans 99% des jeux vidéo, GPS, robots...',
    realWorldUses: [
      'Jeux vidéo (déplacement IA ennemis, pathfinding joueur)',
      'GPS et applications de navigation (Google Maps, Waze)',
      'Robotique (planification de trajectoire)',
      'Logistique (optimisation de livraisons)',
    ],
    pros: [
      'Optimal (trouve le chemin le plus court)',
      'Efficace (heuristique réduit l\'exploration)',
      'Flexible (différentes heuristiques possibles)',
    ],
    cons: [
      'Nécessite une bonne heuristique',
      'Plus complexe à implémenter que Dijkstra',
      'Sensible à la qualité de l\'heuristique',
    ],
  },
  dijkstra: {
    name: 'Dijkstra',
    description: 'Explore uniformément dans toutes les directions. Garanti le chemin optimal sans heuristique.',
    color: '#3498DB',
    complexity: {
      time: 'O((V + E) log V) avec heap',
      space: 'O(V)',
    },
    howItWorks: [
      '1. Initialiser tous les nœuds avec distance infinie',
      '2. Distance du départ = 0',
      '3. Répéter : prendre le nœud non visité le plus proche',
      '4. Mettre à jour les distances de ses voisins',
      '5. L\'algorithme est "aveugle" (pas d\'heuristique)',
    ],
    whyUseIt: 'Garanti le chemin optimal sans heuristique. Plus simple que A*. Parfait quand on ne peut pas estimer la distance restante ou quand les coûts varient.',
    realWorldUses: [
      'Réseaux (protocoles de routage OSPF)',
      'Systèmes de transport (planification de trajets)',
      'Graphes pondérés (coûts variables)',
      'Base pour comprendre A* et autres',
    ],
    pros: [
      'Optimal (toujours le plus court chemin)',
      'Simple à comprendre et implémenter',
      'Fonctionne avec graphes pondérés',
    ],
    cons: [
      'Lent (explore beaucoup de nœuds inutiles)',
      'Pas d\'orientation vers le but',
      'Moins efficace que A* en pratique',
    ],
  },
  bfs: {
    name: 'BFS (Breadth-First Search)',
    description: 'Explore couche par couche, niveau par niveau. Optimal pour graphes non pondérés.',
    color: '#9B59B6',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    howItWorks: [
      '1. Utiliser une file (FIFO - First In First Out)',
      '2. Commencer par le nœud de départ',
      '3. Explorer tous les voisins du niveau actuel',
      '4. Puis passer au niveau suivant',
      '5. L\'exploration forme des "vagues" concentriques',
    ],
    whyUseIt: 'Simple et efficace pour graphes non pondérés (tous les chemins ont le même coût). Garanti le chemin avec le moins d\'étapes.',
    realWorldUses: [
      'Réseaux sociaux (amis à N degrés de séparation)',
      'Recherche sur le web (crawlers)',
      'Résolution de puzzles (Rubik\'s cube)',
      'Analyse de graphes (plus court chemin non pondéré)',
    ],
    pros: [
      'Optimal pour graphes non pondérés',
      'Très simple à implémenter',
      'Exploration systématique par niveaux',
    ],
    cons: [
      'Non optimal si arêtes pondérées',
      'Explore beaucoup de nœuds inutiles',
      'Utilise beaucoup de mémoire',
    ],
  },
  dfs: {
    name: 'DFS (Depth-First Search)',
    description: 'Explore en profondeur d\'abord, allant au bout d\'un chemin avant de revenir.',
    color: '#27AE60',
    complexity: {
      time: 'O(V + E)',
      space: 'O(V)',
    },
    howItWorks: [
      '1. Utiliser une pile (LIFO - Last In First Out)',
      '2. Partir du départ et aller le plus loin possible',
      '3. Si on atteint une impasse, revenir en arrière',
      '4. Explorer les autres branches',
      '5. L\'exploration forme des chemins profonds',
    ],
    whyUseIt: 'Utile pour explorer toutes les possibilités, détection de cycles, parcours de graphe. PAS optimal pour le pathfinding mais pédagogiquement intéressant.',
    realWorldUses: [
      'Résolution de labyrinthes',
      'Détection de cycles dans un graphe',
      'Topological sorting',
      'Exploration exhaustive (puzzles, backtracking)',
    ],
    pros: [
      'Très peu de mémoire (récursif)',
      'Simple à implémenter',
      'Rapide pour trouver UN chemin (pas le meilleur)',
    ],
    cons: [
      'PAS optimal (ne trouve pas le plus court)',
      'Peut explorer des chemins très longs inutilement',
      'Pas adapté au pathfinding en pratique',
    ],
  },
};

// ============================================
// Constantes
// ============================================

const GRID_ROWS = 25;
const GRID_COLS = 40;
const DEFAULT_START = { row: 12, col: 5 };
const DEFAULT_END = { row: 12, col: 34 };

// ============================================
// Composant principal
// ============================================

export function PathfindingVisualizer() {
  // État
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [state, setState] = useState<PathfindingState>('idle');
  const [drawMode, setDrawMode] = useState<DrawMode>('wall');
  const [isDrawing, setIsDrawing] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [stats, setStats] = useState({ visited: 0, pathLength: 0 });
  const [startPos, setStartPos] = useState(DEFAULT_START);
  const [endPos, setEndPos] = useState(DEFAULT_END);
  const [showExplanation, setShowExplanation] = useState(false);

  // Refs
  const runningRef = useRef(false);
  const pausedRef = useRef(false);

  // Initialiser la grille
  const initGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        let type: CellType = 'empty';
        if (row === startPos.row && col === startPos.col) type = 'start';
        else if (row === endPos.row && col === endPos.col) type = 'end';

        currentRow.push({
          row,
          col,
          type,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
        });
      }
      newGrid.push(currentRow);
    }
    return newGrid;
  }, [startPos, endPos]);

  // Réinitialiser
  const reset = useCallback(() => {
    setGrid(initGrid());
    setState('idle');
    setStats({ visited: 0, pathLength: 0 });
    runningRef.current = false;
    pausedRef.current = false;
  }, [initGrid]);

  useEffect(() => {
    reset();
  }, [reset]);

  // Fonction de délai
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Heuristique (distance de Manhattan)
  const heuristic = (cell: Cell, end: Cell): number => {
    return Math.abs(cell.row - end.row) + Math.abs(cell.col - end.col);
  };

  // Obtenir les voisins
  const getNeighbors = (cell: Cell, grid: Cell[][]): Cell[] => {
    const neighbors: Cell[] = [];
    const { row, col } = cell;

    // Haut, Bas, Gauche, Droite
    const directions = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
    ];

    for (const [dr, dc] of directions) {
      const newRow = row + dr;
      const newCol = col + dc;

      if (
        newRow >= 0 && newRow < GRID_ROWS &&
        newCol >= 0 && newCol < GRID_COLS &&
        grid[newRow][newCol].type !== 'wall'
      ) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  };

  // Reconstruire le chemin
  const reconstructPath = async (endCell: Cell, grid: Cell[][]) => {
    const path: Cell[] = [];
    let current: Cell | null = endCell;

    while (current && current.parent) {
      path.unshift(current);
      current = current.parent;
    }

    // Animer le chemin
    for (const cell of path) {
      if (!runningRef.current) return;

      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      if (newGrid[cell.row][cell.col].type !== 'start' && newGrid[cell.row][cell.col].type !== 'end') {
        newGrid[cell.row][cell.col].type = 'path';
      }
      setGrid(newGrid);
      await delay(20);
    }

    setStats(prev => ({ ...prev, pathLength: path.length }));
  };

  // A* Algorithm
  const runAStar = async () => {
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const startCell = gridCopy[startPos.row][startPos.col];
    const endCell = gridCopy[endPos.row][endPos.col];

    startCell.g = 0;
    startCell.h = heuristic(startCell, endCell);
    startCell.f = startCell.h;

    const openSet: Cell[] = [startCell];
    const closedSet = new Set<string>();
    let visitedCount = 0;

    while (openSet.length > 0 && runningRef.current) {
      while (pausedRef.current && runningRef.current) {
        await delay(100);
      }

      // Trouver le nœud avec le plus petit f
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      // Marquer comme visité
      const key = `${current.row},${current.col}`;
      if (closedSet.has(key)) continue;
      closedSet.add(key);

      visitedCount++;
      setStats(prev => ({ ...prev, visited: visitedCount }));

      // Visualiser
      if (current.type !== 'start' && current.type !== 'end') {
        gridCopy[current.row][current.col].type = 'current';
        setGrid(gridCopy.map(row => row.map(c => ({ ...c }))));
        await delay(101 - speed);
        gridCopy[current.row][current.col].type = 'visited';
      }

      // But atteint
      if (current.row === endPos.row && current.col === endPos.col) {
        await reconstructPath(current, gridCopy);
        setState('completed');
        return;
      }

      // Explorer les voisins
      const neighbors = getNeighbors(current, gridCopy);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeG = current.g + 1;

        if (tentativeG < neighbor.g) {
          neighbor.parent = current;
          neighbor.g = tentativeG;
          neighbor.h = heuristic(neighbor, endCell);
          neighbor.f = neighbor.g + neighbor.h;

          if (!openSet.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
            openSet.push(neighbor);
          }
        }
      }
    }

    setState('no-path');
  };

  // Dijkstra Algorithm
  const runDijkstra = async () => {
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const startCell = gridCopy[startPos.row][startPos.col];

    startCell.g = 0;
    startCell.f = 0;

    const unvisited: Cell[] = [startCell];
    const visited = new Set<string>();
    let visitedCount = 0;

    while (unvisited.length > 0 && runningRef.current) {
      while (pausedRef.current && runningRef.current) {
        await delay(100);
      }

      unvisited.sort((a, b) => a.g - b.g);
      const current = unvisited.shift()!;

      const key = `${current.row},${current.col}`;
      if (visited.has(key)) continue;
      visited.add(key);

      visitedCount++;
      setStats(prev => ({ ...prev, visited: visitedCount }));

      if (current.type !== 'start' && current.type !== 'end') {
        gridCopy[current.row][current.col].type = 'current';
        setGrid(gridCopy.map(row => row.map(c => ({ ...c }))));
        await delay(101 - speed);
        gridCopy[current.row][current.col].type = 'visited';
      }

      if (current.row === endPos.row && current.col === endPos.col) {
        await reconstructPath(current, gridCopy);
        setState('completed');
        return;
      }

      const neighbors = getNeighbors(current, gridCopy);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (visited.has(neighborKey)) continue;

        const newDistance = current.g + 1;
        if (newDistance < neighbor.g) {
          neighbor.g = newDistance;
          neighbor.parent = current;
          if (!unvisited.find(n => n.row === neighbor.row && n.col === neighbor.col)) {
            unvisited.push(neighbor);
          }
        }
      }
    }

    setState('no-path');
  };

  // BFS Algorithm
  const runBFS = async () => {
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const startCell = gridCopy[startPos.row][startPos.col];

    const queue: Cell[] = [startCell];
    const visited = new Set<string>();
    visited.add(`${startCell.row},${startCell.col}`);
    let visitedCount = 0;

    while (queue.length > 0 && runningRef.current) {
      while (pausedRef.current && runningRef.current) {
        await delay(100);
      }

      const current = queue.shift()!;
      visitedCount++;
      setStats(prev => ({ ...prev, visited: visitedCount }));

      if (current.type !== 'start' && current.type !== 'end') {
        gridCopy[current.row][current.col].type = 'current';
        setGrid(gridCopy.map(row => row.map(c => ({ ...c }))));
        await delay(101 - speed);
        gridCopy[current.row][current.col].type = 'visited';
      }

      if (current.row === endPos.row && current.col === endPos.col) {
        await reconstructPath(current, gridCopy);
        setState('completed');
        return;
      }

      const neighbors = getNeighbors(current, gridCopy);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(key)) {
          visited.add(key);
          neighbor.parent = current;
          queue.push(neighbor);
        }
      }
    }

    setState('no-path');
  };

  // DFS Algorithm
  const runDFS = async () => {
    const gridCopy = grid.map(row => row.map(cell => ({ ...cell })));
    const startCell = gridCopy[startPos.row][startPos.col];

    const stack: Cell[] = [startCell];
    const visited = new Set<string>();
    let visitedCount = 0;

    while (stack.length > 0 && runningRef.current) {
      while (pausedRef.current && runningRef.current) {
        await delay(100);
      }

      const current = stack.pop()!;
      const key = `${current.row},${current.col}`;

      if (visited.has(key)) continue;
      visited.add(key);

      visitedCount++;
      setStats(prev => ({ ...prev, visited: visitedCount }));

      if (current.type !== 'start' && current.type !== 'end') {
        gridCopy[current.row][current.col].type = 'current';
        setGrid(gridCopy.map(row => row.map(c => ({ ...c }))));
        await delay(101 - speed);
        gridCopy[current.row][current.col].type = 'visited';
      }

      if (current.row === endPos.row && current.col === endPos.col) {
        await reconstructPath(current, gridCopy);
        setState('completed');
        return;
      }

      const neighbors = getNeighbors(current, gridCopy);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(neighborKey)) {
          neighbor.parent = current;
          stack.push(neighbor);
        }
      }
    }

    setState('no-path');
  };

  // Démarrer la visualisation
  const startVisualization = async () => {
    if (state === 'paused') {
      pausedRef.current = false;
      setState('running');
      return;
    }

    // Nettoyer la grille
    const cleanGrid = grid.map(row =>
      row.map(cell => ({
        ...cell,
        type: (cell.type === 'wall' || cell.type === 'start' || cell.type === 'end'
          ? cell.type
          : 'empty') as CellType,
        g: Infinity,
        h: 0,
        f: Infinity,
        parent: null,
      }))
    );
    setGrid(cleanGrid);
    setStats({ visited: 0, pathLength: 0 });

    runningRef.current = true;
    pausedRef.current = false;
    setState('running');

    switch (algorithm) {
      case 'astar':
        await runAStar();
        break;
      case 'dijkstra':
        await runDijkstra();
        break;
      case 'bfs':
        await runBFS();
        break;
      case 'dfs':
        await runDFS();
        break;
    }

    runningRef.current = false;
  };

  // Gestion du dessin
  const handleMouseDown = (row: number, col: number) => {
    if (state !== 'idle') return;
    setIsDrawing(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (!isDrawing || state !== 'idle') return;
    handleCellClick(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleCellClick = (row: number, col: number) => {
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    const cell = newGrid[row][col];

    if (drawMode === 'start') {
      // Enlever l'ancien start
      const oldStart = newGrid[startPos.row][startPos.col];
      if (oldStart.type === 'start') oldStart.type = 'empty';
      cell.type = 'start';
      setStartPos({ row, col });
    } else if (drawMode === 'end') {
      // Enlever l'ancien end
      const oldEnd = newGrid[endPos.row][endPos.col];
      if (oldEnd.type === 'end') oldEnd.type = 'empty';
      cell.type = 'end';
      setEndPos({ row, col });
    } else if (drawMode === 'wall') {
      if (cell.type !== 'start' && cell.type !== 'end') {
        cell.type = 'wall';
      }
    } else if (drawMode === 'erase') {
      if (cell.type !== 'start' && cell.type !== 'end') {
        cell.type = 'empty';
      }
    }

    setGrid(newGrid);
  };

  // Générer un labyrinthe
  const generateMaze = () => {
    if (state !== 'idle') return;

    const newGrid = initGrid();

    // Algorithme simple : murs aléatoires
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const cell = newGrid[row][col];
        if (cell.type === 'empty' && Math.random() < 0.3) {
          cell.type = 'wall';
        }
      }
    }

    setGrid(newGrid);
  };

  // Nettoyer
  useEffect(() => {
    return () => {
      runningRef.current = false;
      pausedRef.current = false;
    };
  }, []);

  const algoInfo = ALGORITHMS[algorithm];

  // Couleurs des cellules
  const getCellColor = (type: CellType): string => {
    switch (type) {
      case 'start': return '#2ECC71';
      case 'end': return '#E74C3C';
      case 'wall': return '#34495E';
      case 'path': return '#F39C12';
      case 'visited': return algoInfo.color + '40';
      case 'current': return algoInfo.color;
      default: return '#ECF0F1';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-surface p-6 gap-4">
      {/* Contrôles supérieurs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Sélection algorithme */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Algorithme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ALGORITHMS) as Algorithm[]).map((algo) => (
              <button
                key={algo}
                onClick={() => {
                  if (state === 'idle') {
                    setAlgorithm(algo);
                  }
                }}
                disabled={state !== 'idle'}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  algorithm === algo
                    ? 'text-white shadow-lg'
                    : 'bg-surface text-text-muted hover:bg-surface-lighter',
                  state !== 'idle' && 'opacity-50 cursor-not-allowed'
                )}
                style={algorithm === algo ? { backgroundColor: ALGORITHMS[algo].color } : {}}
              >
                {ALGORITHMS[algo].name}
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Statistiques
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold" style={{ color: algoInfo.color }}>
                {stats.visited}
              </div>
              <div className="text-xs text-text-muted">Nœuds visités</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: algoInfo.color }}>
                {stats.pathLength}
              </div>
              <div className="text-xs text-text-muted">Longueur chemin</div>
            </div>
          </div>
        </div>

        {/* Complexité */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Complexité
          </label>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Temps:</span>
              <code className="text-yellow-400 font-mono text-xs">{algoInfo.complexity.time}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Espace:</span>
              <code className="text-blue-400 font-mono text-xs">{algoInfo.complexity.space}</code>
            </div>
          </div>
        </div>

        {/* Mode de dessin */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Mode de dessin
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(['wall', 'erase', 'start', 'end'] as DrawMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDrawMode(mode)}
                disabled={state !== 'idle'}
                className={clsx(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  drawMode === mode
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-muted hover:bg-surface-lighter',
                  state !== 'idle' && 'opacity-50 cursor-not-allowed'
                )}
              >
                {mode === 'wall' && '🧱 Mur'}
                {mode === 'erase' && '🧹 Effacer'}
                {mode === 'start' && '🟢 Départ'}
                {mode === 'end' && '🔴 Arrivée'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div
        className="rounded-xl p-4 border-l-4"
        style={{
          backgroundColor: `${algoInfo.color}15`,
          borderColor: algoInfo.color
        }}
      >
        <p className="text-sm text-text">
          <span className="font-bold" style={{ color: algoInfo.color }}>
            {algoInfo.name}
          </span>
          {' : '}
          {algoInfo.description}
        </p>
      </div>

      {/* Section explicative */}
      <div className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧭</span>
            <span className="font-bold text-text">Comprendre l'algorithme</span>
          </div>
          <motion.span
            animate={{ rotate: showExplanation ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted"
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
              <div className="px-4 pb-4 space-y-4 border-t border-primary-light/10">
                {/* Comment ça marche */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2 mt-4">
                    🔍 Comment ça marche ?
                  </h3>
                  <ol className="space-y-1 text-sm text-text-muted">
                    {algoInfo.howItWorks.map((step, idx) => (
                      <li key={idx} className="ml-4">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pourquoi l'utiliser */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2">
                    💡 Pourquoi utiliser cet algorithme ?
                  </h3>
                  <p className="text-sm text-text-muted">
                    {algoInfo.whyUseIt}
                  </p>
                </div>

                {/* Avantages et Inconvénients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-green-400 mb-2">
                      ✅ Avantages
                    </h3>
                    <ul className="space-y-1 text-sm text-text-muted">
                      {algoInfo.pros.map((pro, idx) => (
                        <li key={idx} className="ml-4">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 mb-2">
                      ❌ Inconvénients
                    </h3>
                    <ul className="space-y-1 text-sm text-text-muted">
                      {algoInfo.cons.map((con, idx) => (
                        <li key={idx} className="ml-4">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Applications réelles */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2">
                    🌍 Applications dans le monde réel
                  </h3>
                  <ul className="space-y-1 text-sm text-text-muted">
                    {algoInfo.realWorldUses.map((use, idx) => (
                      <li key={idx} className="ml-4">• {use}</li>
                    ))}
                  </ul>
                </div>

                {/* Lien avec la Licence */}
                <div
                  className="rounded-lg p-3 border-l-4"
                  style={{
                    backgroundColor: `${algoInfo.color}10`,
                    borderColor: algoInfo.color
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: algoInfo.color }}>
                    🎓 Dans la Licence Informatique
                  </h3>
                  <p className="text-sm text-text-muted">
                    Les algorithmes de pathfinding sont enseignés en <strong>L2-L3</strong> dans les UE
                    "Graphes & Algorithmes" et "Intelligence Artificielle". Vous apprendrez à implémenter
                    A*, Dijkstra, et comprendre les heuristiques. Ces algorithmes sont au cœur de la robotique,
                    des jeux vidéo, et de l'IA moderne. Essentiels pour travailler dans ces domaines !
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Grille */}
      <div
        className="flex-1 bg-surface-light rounded-xl p-4 border border-primary-light/20 flex items-center justify-center overflow-auto"
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="inline-grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            userSelect: 'none',
          }}
        >
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <motion.div
                key={`${rowIdx}-${colIdx}`}
                onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                className="w-5 h-5 border border-surface/30 cursor-pointer transition-colors duration-100"
                style={{
                  backgroundColor: getCellColor(cell.type),
                }}
                whileHover={state === 'idle' ? { scale: 1.1 } : {}}
              >
                {cell.type === 'start' && <div className="w-full h-full flex items-center justify-center text-xs">🟢</div>}
                {cell.type === 'end' && <div className="w-full h-full flex items-center justify-center text-xs">🎯</div>}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Contrôles inférieurs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Vitesse */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-2 block">
            Vitesse: {speed}%
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

        {/* Actions grille */}
        <div className="flex gap-2">
          <button
            onClick={generateMaze}
            disabled={state !== 'idle'}
            className="flex-1 px-6 py-3 rounded-xl font-bold bg-purple-500 text-white hover:bg-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🎲 Labyrinthe
          </button>
          <button
            onClick={reset}
            disabled={state === 'running'}
            className="flex-1 px-6 py-3 rounded-xl font-bold bg-surface-lighter text-text hover:bg-surface-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 Reset
          </button>
        </div>

        {/* Boutons de contrôle */}
        <div className="flex gap-2">
          {state === 'idle' || state === 'completed' || state === 'no-path' ? (
            <button
              onClick={startVisualization}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ backgroundColor: algoInfo.color }}
            >
              ▶ {state === 'no-path' ? 'Réessayer' : 'Démarrer'}
            </button>
          ) : state === 'running' ? (
            <>
              <button
                onClick={() => {
                  pausedRef.current = true;
                  setState('paused');
                }}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-yellow-500 text-white hover:bg-yellow-600 transition-all"
              >
                ⏸ Pause
              </button>
              <button
                onClick={() => {
                  runningRef.current = false;
                  pausedRef.current = false;
                  setState('idle');
                }}
                className="px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                ⏹ Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startVisualization}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all"
                style={{ backgroundColor: algoInfo.color }}
              >
                ▶ Reprendre
              </button>
              <button
                onClick={() => {
                  runningRef.current = false;
                  pausedRef.current = false;
                  setState('idle');
                }}
                className="px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                ⏹ Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Message état */}
      {state === 'no-path' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-center"
        >
          <p className="text-red-400 font-bold">
            ❌ Aucun chemin trouvé ! Essayez de supprimer des murs.
          </p>
        </motion.div>
      )}

      {/* Légende */}
      <div className="bg-surface-light rounded-xl p-3 border border-primary-light/20">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-text-muted">Départ</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-text-muted">Arrivée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-gray-700" />
            <span className="text-text-muted">Mur</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: algoInfo.color }} />
            <span className="text-text-muted">En cours</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: algoInfo.color + '40' }} />
            <span className="text-text-muted">Visité</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-text-muted">Chemin</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PathfindingVisualizer;
