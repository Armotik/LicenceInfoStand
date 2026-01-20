// ============================================
// GameOfLifeVisualizer - Automate cellulaire de Conway
// Jeu de la vie (1970)
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

type Grid = boolean[][];

interface Pattern {
  name: string;
  description: string;
  cells: [number, number][];
  icon: string;
}

// ============================================
// Patterns prédéfinis
// ============================================

const PATTERNS: Pattern[] = [
  {
    name: 'Glider',
    description: 'Se déplace en diagonale',
    icon: '✈️',
    cells: [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  {
    name: 'Blinker',
    description: 'Oscille entre 2 états',
    icon: '━',
    cells: [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: 'Toad',
    description: 'Oscillateur période 2',
    icon: '〰',
    cells: [
      [1, 1],
      [2, 1],
      [3, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ],
  },
  {
    name: 'Beacon',
    description: 'Oscillateur stable',
    icon: '◈',
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [3, 2],
      [2, 3],
      [3, 3],
    ],
  },
  {
    name: 'Glider Gun',
    description: 'Génère des gliders',
    icon: '🔫',
    cells: [
      // Left square
      [0, 4],
      [0, 5],
      [1, 4],
      [1, 5],
      // Left part
      [10, 4],
      [10, 5],
      [10, 6],
      [11, 3],
      [11, 7],
      [12, 2],
      [12, 8],
      [13, 2],
      [13, 8],
      [14, 5],
      [15, 3],
      [15, 7],
      [16, 4],
      [16, 5],
      [16, 6],
      [17, 5],
      // Right part
      [20, 2],
      [20, 3],
      [20, 4],
      [21, 2],
      [21, 3],
      [21, 4],
      [22, 1],
      [22, 5],
      [24, 0],
      [24, 1],
      [24, 5],
      [24, 6],
      // Right square
      [34, 2],
      [34, 3],
      [35, 2],
      [35, 3],
    ],
  },
  {
    name: 'Pulsar',
    description: 'Grand oscillateur',
    icon: '✦',
    cells: [
      // Top
      [2, 0],
      [3, 0],
      [4, 0],
      [8, 0],
      [9, 0],
      [10, 0],
      // Upper middle
      [0, 2],
      [5, 2],
      [7, 2],
      [12, 2],
      [0, 3],
      [5, 3],
      [7, 3],
      [12, 3],
      [0, 4],
      [5, 4],
      [7, 4],
      [12, 4],
      // Center
      [2, 5],
      [3, 5],
      [4, 5],
      [8, 5],
      [9, 5],
      [10, 5],
      [2, 7],
      [3, 7],
      [4, 7],
      [8, 7],
      [9, 7],
      [10, 7],
      // Lower middle
      [0, 8],
      [5, 8],
      [7, 8],
      [12, 8],
      [0, 9],
      [5, 9],
      [7, 9],
      [12, 9],
      [0, 10],
      [5, 10],
      [7, 10],
      [12, 10],
      // Bottom
      [2, 12],
      [3, 12],
      [4, 12],
      [8, 12],
      [9, 12],
      [10, 12],
    ],
  },
];

// ============================================
// Composant principal
// ============================================

export function GameOfLifeVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);
  const [speed, setSpeed] = useState(100); // ms entre frames
  const [cellSize, setCellSize] = useState(8);
  const [showGrid, setShowGrid] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawValue, setDrawValue] = useState(true); // true = dessiner, false = effacer

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<Grid>([]);
  const animationIntervalRef = useRef<number | undefined>(undefined);

  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 600;
  const cols = Math.floor(CANVAS_WIDTH / cellSize);
  const rows = Math.floor(CANVAS_HEIGHT / cellSize);

  // Créer une grille vide
  const createEmptyGrid = (): Grid => {
    return Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));
  };

  // Créer une grille aléatoire
  const createRandomGrid = (): Grid => {
    return Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => Math.random() > 0.7)
      );
  };

  // Compter les voisins vivants
  const countNeighbors = (grid: Grid, x: number, y: number): number => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;

        const newX = x + i;
        const newY = y + j;

        // Vérifier les limites
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
          if (grid[newX][newY]) {
            count++;
          }
        }
      }
    }
    return count;
  };

  // Calculer la prochaine génération
  const nextGeneration = () => {
    const currentGrid = gridRef.current;
    const newGrid = createEmptyGrid();

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const neighbors = countNeighbors(currentGrid, i, j);
        const isAlive = currentGrid[i][j];

        // Règles de Conway
        if (isAlive && (neighbors === 2 || neighbors === 3)) {
          // Survie
          newGrid[i][j] = true;
        } else if (!isAlive && neighbors === 3) {
          // Naissance
          newGrid[i][j] = true;
        } else {
          // Mort
          newGrid[i][j] = false;
        }
      }
    }

    gridRef.current = newGrid;
    setGeneration((prev) => prev + 1);

    // Compter la population
    let count = 0;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (newGrid[i][j]) count++;
      }
    }
    setPopulation(count);

    drawGrid();
  };

  // Dessiner la grille
  const drawGrid = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Fond
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grille
    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, CANVAS_HEIGHT);
        ctx.stroke();
      }

      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(CANVAS_WIDTH, i * cellSize);
        ctx.stroke();
      }
    }

    // Cellules vivantes
    const grid = gridRef.current;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j]) {
          // Gradient basé sur les voisins
          const neighbors = countNeighbors(grid, i, j);
          const hue = 120 + neighbors * 20; // Vert -> Cyan
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

          ctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2);

          // Effet de glow
          ctx.shadowColor = `hsl(${hue}, 70%, 60%)`;
          ctx.shadowBlur = 4;
          ctx.fillRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2);
          ctx.shadowBlur = 0;
        }
      }
    }
  };

  // Dessiner/Effacer une cellule
  const toggleCell = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Scale from displayed size to native canvas size
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      gridRef.current[row][col] = drawValue;
      drawGrid();
      updatePopulation();
    }
  };

  // Gérer le début du dessin
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    // Scale from displayed size to native canvas size
    const scaleX = CANVAS_WIDTH / rect.width;
    const scaleY = CANVAS_HEIGHT / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);

    if (row >= 0 && row < rows && col >= 0 && col < cols) {
      // Déterminer si on dessine ou efface basé sur la cellule cliquée
      setDrawValue(!gridRef.current[row][col]);
      setIsDrawing(true);
      toggleCell(e);
    }
  };

  // Gérer le dessin en mouvement
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isRunning) return;
    toggleCell(e);
  };

  // Arrêter le dessin
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // Arrêter le dessin si la souris sort du canvas
  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  // Placer un pattern
  const placePattern = (pattern: Pattern) => {
    setIsRunning(false);
    const grid = createEmptyGrid();

    // Centrer le pattern
    const offsetX = Math.floor(rows / 2) - 5;
    const offsetY = Math.floor(cols / 2) - 5;

    for (const [x, y] of pattern.cells) {
      const newX = offsetX + x;
      const newY = offsetY + y;
      if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
        grid[newX][newY] = true;
      }
    }

    gridRef.current = grid;
    setGeneration(0);
    drawGrid();
    updatePopulation();
  };

  // Réinitialiser
  const handleClear = () => {
    setIsRunning(false);
    gridRef.current = createEmptyGrid();
    setGeneration(0);
    setPopulation(0);
    drawGrid();
  };

  // Remplir aléatoirement
  const handleRandom = () => {
    setIsRunning(false);
    gridRef.current = createRandomGrid();
    setGeneration(0);
    drawGrid();
    updatePopulation();
  };

  // Mettre à jour la population
  const updatePopulation = () => {
    let count = 0;
    const grid = gridRef.current;
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (grid[i][j]) count++;
      }
    }
    setPopulation(count);
  };

  // Boucle d'animation
  useEffect(() => {
    if (isRunning) {
      animationIntervalRef.current = window.setInterval(() => {
        nextGeneration();
      }, speed);
    } else {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    }

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, [isRunning, speed]);

  // Initialiser
  useEffect(() => {
    gridRef.current = createEmptyGrid();
    drawGrid();
  }, [cellSize]);

  // Avancer d'une génération manuellement
  const stepForward = () => {
    if (!isRunning) {
      nextGeneration();
    }
  };

  return (
    <div className="w-full bg-surface p-6 space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🧬 Game of Life - Automate cellulaire</h1>
            <p className="text-cyan-100">Jeu de la vie de John Conway (1970) • Émergence et complexité</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-cyan-200 mb-1">Génération</div>
            <div className="text-2xl font-bold">{generation}</div>
          </div>
        </div>
      </div>

      {/* Panneau de contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Contrôles de base */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Contrôles
          </h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-cyan-600 hover:bg-cyan-700 transition-all shadow-lg"
              >
                {isRunning ? '⏸ Pause' : '▶ Démarrer'}
              </button>
              <button
                onClick={stepForward}
                disabled={isRunning}
                className="px-4 py-2 rounded-lg font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all disabled:opacity-50"
                title="Avancer d'une génération"
              >
                ⏭
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-lg font-bold bg-surface-lighter text-text hover:bg-surface transition-all"
              >
                🗑️
              </button>
            </div>
            <button
              onClick={handleRandom}
              disabled={isRunning}
              className="w-full px-4 py-2 rounded-lg font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50"
            >
              🎲 Remplir aléatoirement
            </button>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Vitesse: {speed}ms
              </label>
              <input
                type="range"
                min="50"
                max="500"
                step="50"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Taille cellule: {cellSize}px
              </label>
              <input
                type="range"
                min="4"
                max="16"
                step="2"
                value={cellSize}
                onChange={(e) => setCellSize(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded"
              />
              Afficher la grille
            </label>
          </div>
        </div>

        {/* Patterns */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">🎨</span> Patterns classiques
          </h3>
          <div className="space-y-2">
            {PATTERNS.map((pattern) => (
              <button
                key={pattern.name}
                onClick={() => placePattern(pattern)}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded-lg bg-surface hover:bg-surface-lighter transition-all text-left disabled:opacity-50 flex items-center gap-2"
              >
                <span className="text-2xl">{pattern.icon}</span>
                <div className="flex-1">
                  <div className="text-sm font-bold text-text">{pattern.name}</div>
                  <div className="text-xs text-text-muted">{pattern.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span> Statistiques
          </h3>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-cyan-400">{generation}</div>
              <div className="text-sm text-text-muted">Génération actuelle</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{population}</div>
              <div className="text-sm text-text-muted">Cellules vivantes</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">
                {cols} × {rows}
              </div>
              <div className="text-sm text-text-muted">Taille de la grille</div>
            </div>
            <div className="pt-3 border-t border-primary-light/10">
              <div className="text-xs text-text-muted">
                {isRunning ? '🟢 Simulation en cours' : '⏸️ En pause'}
              </div>
              <div className="text-xs text-text-muted mt-1">
                Cliquez sur la grille pour activer/désactiver des cellules
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div className="bg-surface-light rounded-2xl p-4 border border-primary-light/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text flex items-center gap-2 text-lg">
            <span className="text-2xl">🌌</span> Grille de simulation
          </h3>
          <div className="text-xs text-text-muted">
            {isRunning ? 'Simulation active' : 'Cliquez pour dessiner des cellules'}
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="w-full h-auto cursor-crosshair"
          />
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
              <div className="font-bold text-text text-lg">Comprendre le Game of Life</div>
              <div className="text-sm text-text-muted">Automates cellulaires et émergence</div>
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
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-cyan-400 mb-2">📐 Les 4 règles de Conway</h3>
                  <div className="space-y-2 text-sm text-text-muted">
                    <div>
                      <strong className="text-red-400">1. Sous-population :</strong> Une cellule vivante avec moins de 2 voisins vivants meurt (solitude).
                    </div>
                    <div>
                      <strong className="text-green-400">2. Survie :</strong> Une cellule vivante avec 2 ou 3 voisins vivants survit à la génération suivante.
                    </div>
                    <div>
                      <strong className="text-yellow-400">3. Sur-population :</strong> Une cellule vivante avec plus de 3 voisins vivants meurt (surpeuplement).
                    </div>
                    <div>
                      <strong className="text-blue-400">4. Reproduction :</strong> Une cellule morte avec exactement 3 voisins vivants devient vivante (naissance).
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 mb-2">🔄 Types de patterns</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Stables :</strong> Ne changent jamais (bloc 2×2)</li>
                      <li>• <strong>Oscillateurs :</strong> Reviennent à leur état initial (blinker, pulsar)</li>
                      <li>• <strong>Vaisseaux :</strong> Se déplacent dans l'espace (glider)</li>
                      <li>• <strong>Générateurs :</strong> Créent d'autres patterns (Glider Gun)</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🎯 Turing-complet</h4>
                    <p className="text-sm text-text-muted">
                      Le Game of Life est <strong>Turing-complet</strong> ! On peut y construire des portes logiques,
                      des circuits, et théoriquement n'importe quel calcul. Des gens ont créé des ordinateurs
                      fonctionnels dans Game of Life !
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">🌍 Applications réelles</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• Modélisation de populations biologiques</li>
                      <li>• Simulation de cristaux et matériaux</li>
                      <li>• Cryptographie et génération de nombres aléatoires</li>
                      <li>• Compression de données</li>
                      <li>• Art génératif et musique algorithmique</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-400 mb-2">🔬 Philosophie</h4>
                    <p className="text-sm text-text-muted">
                      Le Game of Life montre comment la <strong>complexité émerge de la simplicité</strong>.
                      Avec seulement 4 règles simples, on obtient un univers imprévisible avec des structures
                      étonnantes. C'est une métaphore puissante de l'émergence dans la nature.
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

export default GameOfLifeVisualizer;
