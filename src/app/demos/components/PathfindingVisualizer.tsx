// ============================================
// PathfindingVisualizer - Simulateur de Navigation GPS avec A*
// Démo pédagogique style application réelle pour les futurs bacheliers
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================
// Types
// ============================================

type CellType = 'road' | 'building' | 'park' | 'water' | 'start' | 'end' | 'path' | 'visited' | 'exploring';
type PlaceMode = 'start' | 'end';
type SimulationState = 'idle' | 'running' | 'completed' | 'no-path';

interface Cell {
  row: number;
  col: number;
  type: CellType;
  g: number;
  h: number;
  f: number;
  parent: Cell | null;
}

// ============================================
// Configuration
// ============================================

const GRID_ROWS = 30;
const GRID_COLS = 50;

// Carte prédéfinie d'une ville
const CITY_MAP = `
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBRRRRRBBBBBBBBBBBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBRRRRRBBBBBBBBBBBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBRRRRRBBBBBBBBBBBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBRRRRRBBBBBBBBBBBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBPPPPPPPPPPPPPPPPPPPPPPP
BBBBBBBBBBBRRRRRBBBBBBBBBBBPPPPPPPPPPPPPPPPPPPPPPP
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBRRRRRBBBBBBBBBBBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BBBBBBBBBBBRRRRRBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWW
BBBBBBBBBBBRRRRRBBBBBBBBBBBWWWWWWWWWWWWWWWWWWWWWW
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRBBBBBBB
BRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBRRRRRRRRRRBBBBBBB
BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB
`;

// ============================================
// Composant principal
// ============================================

export function PathfindingVisualizer() {
  // État
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [state, setState] = useState<SimulationState>('idle');
  const [placeMode, setPlaceMode] = useState<PlaceMode>('start');
  const [speed, setSpeed] = useState(30);
  const [stats, setStats] = useState({
    nodesExplored: 0,
    pathLength: 0,
    distance: 0,
    estimatedTime: 0
  });
  const [startPos, setStartPos] = useState<{ row: number; col: number } | null>(null);
  const [endPos, setEndPos] = useState<{ row: number; col: number } | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Refs
  const runningRef = useRef(false);

  // Initialiser la grille depuis la carte
  const initGrid = useCallback(() => {
    const lines = CITY_MAP.trim().split('\n');
    const newGrid: Cell[][] = [];

    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Cell[] = [];
      const line = lines[row] || '';

      for (let col = 0; col < GRID_COLS; col++) {
        const char = line[col] || 'R';
        let type: CellType = 'road';

        switch (char) {
          case 'B': type = 'building'; break;
          case 'P': type = 'park'; break;
          case 'W': type = 'water'; break;
          default: type = 'road';
        }

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
  }, []);

  // Réinitialiser
  const reset = useCallback(() => {
    setGrid(initGrid());
    setState('idle');
    setStats({ nodesExplored: 0, pathLength: 0, distance: 0, estimatedTime: 0 });
    setStartPos(null);
    setEndPos(null);
    runningRef.current = false;
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
        newCol >= 0 && newCol < GRID_COLS
      ) {
        const neighbor = grid[newRow][newCol];
        const originalType = neighbor.type === 'visited' || neighbor.type === 'exploring' || neighbor.type === 'path'
          ? 'road'
          : neighbor.type;

        if (originalType !== 'building' && originalType !== 'water') {
          neighbors.push(neighbor);
        }
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

    // Calculer distance et temps estimé
    const distance = path.length * 0.1; // 100m par case
    const estimatedTime = Math.ceil(distance / 50 * 60); // 50 km/h en minutes

    // Animer le chemin
    for (let i = 0; i < path.length; i++) {
      if (!runningRef.current) return;

      const cell = path[i];
      const newGrid = grid.map(row => row.map(c => ({ ...c })));
      if (newGrid[cell.row][cell.col].type !== 'start' && newGrid[cell.row][cell.col].type !== 'end') {
        newGrid[cell.row][cell.col].type = 'path';
      }
      setGrid(newGrid);
      setStats(prev => ({ ...prev, pathLength: i + 1, distance, estimatedTime }));
      await delay(30);
    }
  };

  // Algorithme A*
  const runAStar = async () => {
    if (!startPos || !endPos) return;

    const gridCopy = grid.map(row => row.map(cell => ({
      ...cell,
      g: Infinity,
      h: 0,
      f: Infinity,
      parent: null
    })));

    const startCell = gridCopy[startPos.row][startPos.col];
    const endCell = gridCopy[endPos.row][endPos.col];

    startCell.g = 0;
    startCell.h = heuristic(startCell, endCell);
    startCell.f = startCell.h;

    const openSet: Cell[] = [startCell];
    const closedSet = new Set<string>();
    let nodesExplored = 0;

    while (openSet.length > 0 && runningRef.current) {
      // Trouver le nœud avec le plus petit f
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      // Marquer comme visité
      const key = `${current.row},${current.col}`;
      if (closedSet.has(key)) continue;
      closedSet.add(key);

      nodesExplored++;
      setStats(prev => ({ ...prev, nodesExplored }));

      // Visualiser l'exploration
      if (current.type !== 'start' && current.type !== 'end') {
        gridCopy[current.row][current.col].type = 'exploring';
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

  // Démarrer la navigation
  const startNavigation = async () => {
    if (!startPos || !endPos) return;

    // Nettoyer la grille
    const cleanGrid = grid.map(row =>
      row.map(cell => {
        const isStart = cell.row === startPos.row && cell.col === startPos.col;
        const isEnd = cell.row === endPos.row && cell.col === endPos.col;

        let cleanType: CellType = cell.type;
        if (cell.type === 'visited' || cell.type === 'exploring' || cell.type === 'path') {
          cleanType = 'road';
        }
        if (isStart) cleanType = 'start';
        if (isEnd) cleanType = 'end';

        return {
          ...cell,
          type: cleanType,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
        };
      })
    );

    setGrid(cleanGrid);
    setStats({ nodesExplored: 0, pathLength: 0, distance: 0, estimatedTime: 0 });

    runningRef.current = true;
    setState('running');

    await runAStar();
    runningRef.current = false;
  };

  // Placer un point sur la carte
  const handleCellClick = (row: number, col: number) => {
    if (state === 'running') return;

    const cell = grid[row][col];
    if (cell.type === 'building' || cell.type === 'water') return;

    const newGrid = grid.map(r => r.map(c => ({ ...c })));

    if (placeMode === 'start') {
      // Enlever l'ancien start
      if (startPos) {
        const oldCell = newGrid[startPos.row][startPos.col];
        if (oldCell.type === 'start') oldCell.type = 'road';
      }
      newGrid[row][col].type = 'start';
      setStartPos({ row, col });
      setPlaceMode('end'); // Auto-switch au mode end
    } else {
      // Enlever l'ancien end
      if (endPos) {
        const oldCell = newGrid[endPos.row][endPos.col];
        if (oldCell.type === 'end') oldCell.type = 'road';
      }
      newGrid[row][col].type = 'end';
      setEndPos({ row, col });
    }

    setGrid(newGrid);
  };

  // Nettoyage
  useEffect(() => {
    return () => {
      runningRef.current = false;
    };
  }, []);

  // Couleurs des cellules
  const getCellColor = (type: CellType): string => {
    switch (type) {
      case 'road': return '#E8E8E8';
      case 'building': return '#95A5A6';
      case 'park': return '#2ECC71';
      case 'water': return '#3498DB';
      case 'start': return '#27AE60';
      case 'end': return '#E74C3C';
      case 'path': return '#F39C12';
      case 'visited': return '#BDC3C7';
      case 'exploring': return '#E67E22';
      default: return '#ECF0F1';
    }
  };

  const canNavigate = startPos && endPos && state !== 'running';

  return (
    <div className="w-full min-h-screen bg-surface p-6 space-y-6 overflow-y-auto">
      {/* En-tête style GPS */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🗺️ Navigateur GPS - A* Pathfinding</h1>
            <p className="text-blue-100">Simulateur de navigation intelligente utilisant l'algorithme A*</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-200 mb-1">Algorithme</div>
            <div className="text-2xl font-bold">A* (A-star)</div>
          </div>
        </div>
      </div>

      {/* Panneau de contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Instructions */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📍</span>
            Instructions
          </h3>
          <div className="space-y-2 text-sm text-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <span>1. Cliquez pour placer le <strong>départ</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span>2. Cliquez pour placer l'<strong>arrivée</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">▶️</span>
              <span>3. Lancez la navigation</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-primary-light/10">
            <div className="text-xs text-text-muted">
              Mode actuel: <span className={clsx("font-bold", placeMode === 'start' ? 'text-green-400' : 'text-red-400')}>
                {placeMode === 'start' ? '🟢 Placer départ' : '🔴 Placer arrivée'}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques de navigation */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span>
            Statistiques
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
              <div className="text-xs text-text-muted">Distance totale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.estimatedTime} min</div>
              <div className="text-xs text-text-muted">Temps estimé</div>
            </div>
          </div>
        </div>

        {/* Contrôles */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            Contrôles
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
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === 'running' ? '⏳ Calcul...' : '▶ Naviguer'}
              </button>
              <button
                onClick={reset}
                disabled={state === 'running'}
                className="px-4 py-2 rounded-lg font-bold bg-surface-lighter text-text hover:bg-surface transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message de résultat */}
      <AnimatePresence>
        {state === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-green-500/20 border border-green-500 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <div>
                <div className="font-bold text-green-400">Itinéraire calculé avec succès !</div>
                <div className="text-sm text-text-muted">
                  Distance: {stats.distance.toFixed(1)} km • Temps: ~{stats.estimatedTime} min • Nœuds explorés: {stats.nodesExplored}
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
            className="bg-red-500/20 border border-red-500 rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">❌</span>
              <div>
                <div className="font-bold text-red-400">Aucun itinéraire trouvé</div>
                <div className="text-sm text-text-muted">
                  Impossible de tracer un chemin entre ces deux points. Vérifiez qu'ils sont accessibles.
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carte de la ville */}
      <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-text flex items-center gap-2">
            <span className="text-xl">🏙️</span>
            Carte de la ville
          </h3>
          <div className="flex gap-2 text-xs">
            <button
              onClick={() => setPlaceMode('start')}
              className={clsx(
                'px-3 py-1 rounded-lg font-medium transition-all',
                placeMode === 'start' ? 'bg-green-500 text-white' : 'bg-surface text-text-muted'
              )}
            >
              🟢 Départ
            </button>
            <button
              onClick={() => setPlaceMode('end')}
              className={clsx(
                'px-3 py-1 rounded-lg font-medium transition-all',
                placeMode === 'end' ? 'bg-red-500 text-white' : 'bg-surface text-text-muted'
              )}
            >
              🔴 Arrivée
            </button>
          </div>
        </div>

        <div className="bg-gray-200 rounded-lg p-2 overflow-auto">
          <div
            className="inline-grid gap-0 shadow-lg"
            style={{
              gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            }}
          >
            {grid.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <motion.div
                  key={`${rowIdx}-${colIdx}`}
                  onClick={() => handleCellClick(rowIdx, colIdx)}
                  className="w-4 h-4 cursor-pointer transition-all hover:opacity-80 border border-gray-300/20"
                  style={{
                    backgroundColor: getCellColor(cell.type),
                  }}
                  whileHover={{ scale: 1.2, zIndex: 10 }}
                  title={
                    cell.type === 'start' ? 'Départ' :
                    cell.type === 'end' ? 'Arrivée' :
                    cell.type === 'building' ? 'Bâtiment' :
                    cell.type === 'park' ? 'Parc' :
                    cell.type === 'water' ? 'Eau' :
                    cell.type === 'path' ? 'Chemin optimal' :
                    'Route'
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Légende */}
        <div className="mt-3 pt-3 border-t border-primary-light/10">
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E8E8E8' }} />
              <span className="text-text-muted">Route</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#95A5A6' }} />
              <span className="text-text-muted">Bâtiment</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2ECC71' }} />
              <span className="text-text-muted">Parc</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#3498DB' }} />
              <span className="text-text-muted">Eau</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#E67E22' }} />
              <span className="text-text-muted">Exploration</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#BDC3C7' }} />
              <span className="text-text-muted">Exploré</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F39C12' }} />
              <span className="text-text-muted">Itinéraire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section éducative */}
      <div className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Comprendre l'algorithme A*</div>
              <div className="text-sm text-text-muted">Comment fonctionne la navigation GPS intelligente</div>
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
                      A* est l'algorithme de référence pour le pathfinding. Il combine <strong>la distance parcourue</strong>
                      {' '}avec <strong>une estimation de la distance restante</strong> pour trouver le chemin optimal.
                    </p>
                    <div className="bg-blue-500/10 border-l-4 border-blue-500 p-3 rounded">
                      <div className="font-mono text-sm text-blue-300 mb-2">f(n) = g(n) + h(n)</div>
                      <ul className="space-y-1 text-sm text-text-muted">
                        <li>• <strong>g(n)</strong> = distance réelle depuis le départ</li>
                        <li>• <strong>h(n)</strong> = estimation (heuristique) vers l'arrivée</li>
                        <li>• <strong>f(n)</strong> = coût total estimé du chemin</li>
                      </ul>
                    </div>
                    <ol className="space-y-2 text-sm text-text-muted ml-4">
                      <li>1. Commencer au point de départ avec f(n) = h(n)</li>
                      <li>2. Explorer toujours le nœud avec le plus petit f(n)</li>
                      <li>3. Pour chaque voisin, calculer son nouveau coût</li>
                      <li>4. L'heuristique guide l'exploration vers le but</li>
                      <li>5. Garantit le chemin optimal si l'heuristique est admissible</li>
                    </ol>
                  </div>
                </div>

                {/* Pourquoi A* ? */}
                <div>
                  <h3 className="font-bold text-green-400 mb-3 text-lg flex items-center gap-2">
                    <span>💡</span> Pourquoi A* est-il si utilisé ?
                  </h3>
                  <div className="bg-surface rounded-lg p-4 space-y-3">
                    <p className="text-sm text-text-muted leading-relaxed">
                      A* est <strong>le standard de l'industrie</strong> pour le pathfinding. Utilisé dans 99% des jeux vidéo,
                      applications GPS, et systèmes de robotique grâce à son <strong>équilibre parfait entre optimalité et performance</strong>.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                        <div className="font-bold text-green-400 mb-1">✅ Optimal</div>
                        <div className="text-xs text-text-muted">Trouve toujours le plus court chemin</div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <div className="font-bold text-blue-400 mb-1">⚡ Efficace</div>
                        <div className="text-xs text-text-muted">Explore moins de nœuds que Dijkstra</div>
                      </div>
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                        <div className="font-bold text-purple-400 mb-1">🎯 Intelligent</div>
                        <div className="text-xs text-text-muted">L'heuristique guide vers le but</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applications réelles */}
                <div>
                  <h3 className="font-bold text-orange-400 mb-3 text-lg flex items-center gap-2">
                    <span>🌍</span> Applications dans le monde réel
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-surface rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🗺️</span>
                        <div className="font-bold text-text">Navigation GPS</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Google Maps, Waze, Apple Plans utilisent A* pour calculer vos itinéraires en temps réel
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🎮</span>
                        <div className="font-bold text-text">Jeux vidéo</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Déplacement des PNJ, IA des ennemis, calcul de trajectoires dans tous les jeux modernes
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🤖</span>
                        <div className="font-bold text-text">Robotique</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Robots aspirateurs, drones de livraison, véhicules autonomes pour éviter les obstacles
                      </div>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">📦</span>
                        <div className="font-bold text-text">Logistique</div>
                      </div>
                      <div className="text-sm text-text-muted">
                        Optimisation des livraisons, planification d'entrepôts, routage de véhicules
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avantages et limites */}
                <div>
                  <h3 className="font-bold text-primary-light mb-3 text-lg">⚖️ Avantages et limites</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-surface rounded-lg p-4">
                      <h4 className="font-bold text-green-400 mb-3 flex items-center gap-2">
                        <span>✅</span> Avantages
                      </h4>
                      <ul className="space-y-2 text-sm text-text-muted">
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span><strong>Optimal :</strong> Garantit le plus court chemin</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span><strong>Efficace :</strong> Explore moins que Dijkstra</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span><strong>Flexible :</strong> Différentes heuristiques possibles</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">•</span>
                          <span><strong>Industriel :</strong> Standard de l'industrie</span>
                        </li>
                      </ul>
                    </div>
                    <div className="bg-surface rounded-lg p-4">
                      <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                        <span>⚠️</span> Limites
                      </h4>
                      <ul className="space-y-2 text-sm text-text-muted">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span><strong>Mémoire :</strong> Stocke tous les nœuds explorés</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span><strong>Heuristique :</strong> Dépend de sa qualité</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span><strong>Grandes cartes :</strong> Peut être lent sur énormes graphes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span><strong>Statique :</strong> Recalcul si obstacles bougent</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Lien avec la Licence */}
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-lg p-6">
                  <h3 className="font-bold text-blue-400 mb-3 text-lg flex items-center gap-2">
                    <span>🎓</span> Dans la Licence Informatique
                  </h3>
                  <div className="space-y-3 text-sm text-text-muted">
                    <p className="leading-relaxed">
                      Les algorithmes de pathfinding comme A* sont enseignés en <strong className="text-blue-300">L2-L3</strong> dans
                      les UE <strong>"Graphes & Algorithmes"</strong> et <strong>"Intelligence Artificielle"</strong>.
                    </p>
                    <p className="leading-relaxed">
                      Vous apprendrez à :
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>Implémenter A*, Dijkstra, et comprendre leurs différences</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>Concevoir des heuristiques admissibles (Manhattan, Euclidienne...)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>Analyser la complexité et optimiser les performances</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        <span>Appliquer ces algorithmes en robotique et jeux vidéo</span>
                      </li>
                    </ul>
                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <p className="text-blue-300 font-medium">
                        💼 Ces compétences sont <strong>essentielles</strong> pour travailler dans le jeu vidéo,
                        la robotique, l'IA, ou tout domaine nécessitant de l'optimisation spatiale !
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
