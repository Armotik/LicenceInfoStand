// ============================================
// BoidsVisualizer - Simulation de comportement d'essaim (Flocking)
// Algorithme Boids de Craig Reynolds (1986)
// ============================================

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Vector2D {
  x: number;
  y: number;
}

interface Boid {
  id: number;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
}

interface SimulationParams {
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  perceptionRadius: number;
  maxSpeed: number;
  maxForce: number;
}

// ============================================
// Utilitaires vectoriels
// ============================================

const vector = {
  add: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x + b.x, y: a.y + b.y }),
  subtract: (a: Vector2D, b: Vector2D): Vector2D => ({ x: a.x - b.x, y: a.y - b.y }),
  multiply: (v: Vector2D, scalar: number): Vector2D => ({ x: v.x * scalar, y: v.y * scalar }),
  divide: (v: Vector2D, scalar: number): Vector2D => ({ x: v.x / scalar, y: v.y / scalar }),
  magnitude: (v: Vector2D): number => Math.sqrt(v.x * v.x + v.y * v.y),
  normalize: (v: Vector2D): Vector2D => {
    const mag = vector.magnitude(v);
    return mag === 0 ? { x: 0, y: 0 } : vector.divide(v, mag);
  },
  limit: (v: Vector2D, max: number): Vector2D => {
    const mag = vector.magnitude(v);
    if (mag > max) {
      return vector.multiply(vector.normalize(v), max);
    }
    return v;
  },
  setMagnitude: (v: Vector2D, mag: number): Vector2D => {
    return vector.multiply(vector.normalize(v), mag);
  },
  distance: (a: Vector2D, b: Vector2D): number => {
    return vector.magnitude(vector.subtract(a, b));
  },
};

// ============================================
// Composant principal
// ============================================

export function BoidsVisualizer() {
  const [isRunning, setIsRunning] = useState(false);
  const [boidCount, setBoidCount] = useState(100);
  const [params, setParams] = useState<SimulationParams>({
    separationWeight: 1.5,
    alignmentWeight: 1.0,
    cohesionWeight: 1.0,
    perceptionRadius: 50,
    maxSpeed: 4,
    maxForce: 0.3,
  });
  const [showExplanation, setShowExplanation] = useState(false);
  const [stats, setStats] = useState({
    fps: 0,
    avgSpeed: 0,
    avgNeighbors: 0,
  });
  const [showVectors, setShowVectors] = useState(false);
  const [colorMode, setColorMode] = useState<'velocity' | 'neighbors' | 'solid'>('velocity');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boidsRef = useRef<Boid[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const fpsCounterRef = useRef<{ frames: number; lastTime: number }>({ frames: 0, lastTime: 0 });

  const CANVAS_WIDTH = 1200;
  const CANVAS_HEIGHT = 600;

  // Initialiser les boids
  const initializeBoids = (count: number) => {
    const boids: Boid[] = [];
    for (let i = 0; i < count; i++) {
      boids.push({
        id: i,
        position: {
          x: Math.random() * CANVAS_WIDTH,
          y: Math.random() * CANVAS_HEIGHT,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        acceleration: { x: 0, y: 0 },
      });
    }
    boidsRef.current = boids;
  };

  // Règle 1: Séparation - éviter les collisions
  const separation = (boid: Boid, boids: Boid[]): Vector2D => {
    const steer: Vector2D = { x: 0, y: 0 };
    let count = 0;

    for (const other of boids) {
      const d = vector.distance(boid.position, other.position);
      if (other.id !== boid.id && d > 0 && d < params.perceptionRadius * 0.5) {
        const diff = vector.subtract(boid.position, other.position);
        const normalized = vector.normalize(diff);
        const weighted = vector.divide(normalized, d); // Plus proche = plus fort
        steer.x += weighted.x;
        steer.y += weighted.y;
        count++;
      }
    }

    if (count > 0) {
      const avg = vector.divide(steer, count);
      if (vector.magnitude(avg) > 0) {
        const desired = vector.setMagnitude(avg, params.maxSpeed);
        const steering = vector.subtract(desired, boid.velocity);
        return vector.limit(steering, params.maxForce);
      }
    }

    return { x: 0, y: 0 };
  };

  // Règle 2: Alignement - s'aligner avec les voisins
  const alignment = (boid: Boid, boids: Boid[]): Vector2D => {
    const avgVel: Vector2D = { x: 0, y: 0 };
    let count = 0;

    for (const other of boids) {
      const d = vector.distance(boid.position, other.position);
      if (other.id !== boid.id && d > 0 && d < params.perceptionRadius) {
        avgVel.x += other.velocity.x;
        avgVel.y += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      const avg = vector.divide(avgVel, count);
      const desired = vector.setMagnitude(avg, params.maxSpeed);
      const steering = vector.subtract(desired, boid.velocity);
      return vector.limit(steering, params.maxForce);
    }

    return { x: 0, y: 0 };
  };

  // Règle 3: Cohésion - se rapprocher du centre de masse
  const cohesion = (boid: Boid, boids: Boid[]): Vector2D => {
    const centerOfMass: Vector2D = { x: 0, y: 0 };
    let count = 0;

    for (const other of boids) {
      const d = vector.distance(boid.position, other.position);
      if (other.id !== boid.id && d > 0 && d < params.perceptionRadius) {
        centerOfMass.x += other.position.x;
        centerOfMass.y += other.position.y;
        count++;
      }
    }

    if (count > 0) {
      const avg = vector.divide(centerOfMass, count);
      const desired = vector.subtract(avg, boid.position);
      const normalized = vector.setMagnitude(desired, params.maxSpeed);
      const steering = vector.subtract(normalized, boid.velocity);
      return vector.limit(steering, params.maxForce);
    }

    return { x: 0, y: 0 };
  };

  // Éviter les bords avec wrapping
  const edges = (boid: Boid) => {
    if (boid.position.x > CANVAS_WIDTH) boid.position.x = 0;
    if (boid.position.x < 0) boid.position.x = CANVAS_WIDTH;
    if (boid.position.y > CANVAS_HEIGHT) boid.position.y = 0;
    if (boid.position.y < 0) boid.position.y = CANVAS_HEIGHT;
  };

  // Mettre à jour un boid
  const updateBoid = (boid: Boid, boids: Boid[]) => {
    // Calculer les forces
    const sep = separation(boid, boids);
    const ali = alignment(boid, boids);
    const coh = cohesion(boid, boids);

    // Appliquer les poids
    boid.acceleration = {
      x: sep.x * params.separationWeight + ali.x * params.alignmentWeight + coh.x * params.cohesionWeight,
      y: sep.y * params.separationWeight + ali.y * params.alignmentWeight + coh.y * params.cohesionWeight,
    };

    // Mettre à jour la vélocité et la position
    boid.velocity = vector.add(boid.velocity, boid.acceleration);
    boid.velocity = vector.limit(boid.velocity, params.maxSpeed);
    boid.position = vector.add(boid.position, boid.velocity);

    // Reset acceleration
    boid.acceleration = { x: 0, y: 0 };

    // Gérer les bords
    edges(boid);
  };

  // Dessiner un boid
  const drawBoid = (ctx: CanvasRenderingContext2D, boid: Boid, neighborCount: number) => {
    const angle = Math.atan2(boid.velocity.y, boid.velocity.x);
    const speed = vector.magnitude(boid.velocity);

    ctx.save();
    ctx.translate(boid.position.x, boid.position.y);
    ctx.rotate(angle);

    // Couleur basée sur le mode
    let color: string;
    if (colorMode === 'velocity') {
      const hue = (speed / params.maxSpeed) * 120; // Rouge (lent) -> Vert (rapide)
      color = `hsl(${hue}, 80%, 60%)`;
    } else if (colorMode === 'neighbors') {
      const hue = Math.min(neighborCount * 10, 240); // Bleu selon nombre de voisins
      color = `hsl(${hue}, 70%, 60%)`;
    } else {
      color = '#4A90E2';
    }

    // Dessiner le triangle
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(-6, 4);
    ctx.lineTo(-6, -4);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dessiner les vecteurs de force si activé
    if (showVectors) {
      // Vecteur vélocité (vert)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(boid.velocity.x * 5, boid.velocity.y * 5);
      ctx.strokeStyle = 'rgba(0, 255, 0, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();
  };

  // Boucle d'animation
  const animate = (time: number) => {
    if (!isRunning) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Calculer FPS
    lastTimeRef.current = time;
    fpsCounterRef.current.frames++;
    if (time - fpsCounterRef.current.lastTime > 1000) {
      const fps = Math.round((fpsCounterRef.current.frames * 1000) / (time - fpsCounterRef.current.lastTime));
      fpsCounterRef.current.frames = 0;
      fpsCounterRef.current.lastTime = time;

      // Calculer stats
      let totalSpeed = 0;
      let totalNeighbors = 0;
      const boids = boidsRef.current;

      for (const boid of boids) {
        totalSpeed += vector.magnitude(boid.velocity);
        let neighbors = 0;
        for (const other of boids) {
          if (other.id !== boid.id && vector.distance(boid.position, other.position) < params.perceptionRadius) {
            neighbors++;
          }
        }
        totalNeighbors += neighbors;
      }

      setStats({
        fps,
        avgSpeed: totalSpeed / boids.length,
        avgNeighbors: Math.round(totalNeighbors / boids.length),
      });
    }

    // Effacer le canvas
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Dessiner une grille subtile
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < CANVAS_WIDTH; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y < CANVAS_HEIGHT; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    // Mettre à jour et dessiner tous les boids
    const boids = boidsRef.current;
    for (const boid of boids) {
      updateBoid(boid, boids);
    }

    // Compter les voisins pour chaque boid (pour la coloration)
    for (const boid of boids) {
      let neighborCount = 0;
      for (const other of boids) {
        if (other.id !== boid.id && vector.distance(boid.position, other.position) < params.perceptionRadius) {
          neighborCount++;
        }
      }
      drawBoid(ctx, boid, neighborCount);
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Démarrer/arrêter la simulation
  useEffect(() => {
    if (isRunning) {
      lastTimeRef.current = performance.now();
      fpsCounterRef.current = { frames: 0, lastTime: performance.now() };
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, params, showVectors, colorMode]);

  // Initialiser au montage
  useEffect(() => {
    initializeBoids(boidCount);
    // Dessiner l'état initial
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (const boid of boidsRef.current) {
        drawBoid(ctx, boid, 0);
      }
    }
  }, []);

  const handleReset = () => {
    setIsRunning(false);
    initializeBoids(boidCount);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      for (const boid of boidsRef.current) {
        drawBoid(ctx, boid, 0);
      }
    }
  };

  const handleBoidCountChange = (count: number) => {
    setBoidCount(count);
    initializeBoids(count);
  };

  return (
    <div className="w-full bg-surface p-6 space-y-6">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🦅 Simulation Boids - Comportement d'essaim</h1>
            <p className="text-purple-100">Intelligence collective émergente • Algorithme de Craig Reynolds (1986)</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-purple-200 mb-1">Boids actifs</div>
            <div className="text-2xl font-bold">{boidCount}</div>
          </div>
        </div>
      </div>

      {/* Panneau de contrôle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Paramètres de base */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">⚙️</span> Paramètres de base
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Nombre de boids: {boidCount}
              </label>
              <input
                type="range"
                min="10"
                max="300"
                value={boidCount}
                onChange={(e) => handleBoidCountChange(Number(e.target.value))}
                className="w-full"
                disabled={isRunning}
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Rayon de perception: {params.perceptionRadius}px
              </label>
              <input
                type="range"
                min="20"
                max="150"
                value={params.perceptionRadius}
                onChange={(e) => setParams({ ...params, perceptionRadius: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                Vitesse max: {params.maxSpeed.toFixed(1)}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={params.maxSpeed}
                onChange={(e) => setParams({ ...params, maxSpeed: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Poids des règles */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">🎚️</span> Poids des règles
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                🔴 Séparation: {params.separationWeight.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={params.separationWeight}
                onChange={(e) => setParams({ ...params, separationWeight: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                🟢 Alignement: {params.alignmentWeight.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={params.alignmentWeight}
                onChange={(e) => setParams({ ...params, alignmentWeight: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-text-muted mb-1 block">
                🔵 Cohésion: {params.cohesionWeight.toFixed(1)}
              </label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={params.cohesionWeight}
                onChange={(e) => setParams({ ...params, cohesionWeight: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Contrôles et stats */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <h3 className="font-bold text-text mb-3 flex items-center gap-2">
            <span className="text-xl">📊</span> Contrôles & Stats
          </h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-xl font-bold text-green-400">{stats.fps}</div>
                <div className="text-xs text-text-muted">FPS</div>
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">{stats.avgSpeed.toFixed(1)}</div>
                <div className="text-xs text-text-muted">Vitesse moy.</div>
              </div>
              <div>
                <div className="text-xl font-bold text-purple-400">{stats.avgNeighbors}</div>
                <div className="text-xs text-text-muted">Voisins moy.</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="flex-1 px-4 py-2 rounded-lg font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all shadow-lg"
              >
                {isRunning ? '⏸ Pause' : '▶ Démarrer'}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg font-bold bg-surface-lighter text-text hover:bg-surface transition-all"
              >
                🔄
              </button>
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded"
                />
                Afficher vecteurs vélocité
              </label>
              <div>
                <label className="text-xs text-text-muted mb-1 block">Mode de couleur:</label>
                <select
                  value={colorMode}
                  onChange={(e) => setColorMode(e.target.value as any)}
                  className="w-full px-2 py-1 rounded bg-surface text-text text-sm"
                >
                  <option value="velocity">Vitesse</option>
                  <option value="neighbors">Nombre de voisins</option>
                  <option value="solid">Uni</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Canvas de simulation */}
      <div className="bg-surface-light rounded-2xl p-4 border border-primary-light/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text flex items-center gap-2 text-lg">
            <span className="text-2xl">🌌</span> Espace de simulation
          </h3>
          <div className="text-xs text-text-muted">
            Cliquez sur "Démarrer" pour lancer la simulation
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto"
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
              <div className="font-bold text-text text-lg">Comprendre l'algorithme Boids</div>
              <div className="text-sm text-text-muted">Intelligence collective et comportements émergents</div>
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
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-purple-400 mb-2">🎯 Les 3 règles fondamentales</h3>
                  <div className="space-y-3 text-sm text-text-muted">
                    <div>
                      <strong className="text-red-400">1. Séparation :</strong> Chaque boid évite de se rapprocher trop près de ses voisins pour éviter les collisions. Plus un voisin est proche, plus la force de répulsion est forte.
                    </div>
                    <div>
                      <strong className="text-green-400">2. Alignement :</strong> Chaque boid ajuste sa direction pour correspondre à la direction moyenne de ses voisins proches, créant un mouvement synchronisé.
                    </div>
                    <div>
                      <strong className="text-blue-400">3. Cohésion :</strong> Chaque boid se dirige vers le centre de masse (position moyenne) de ses voisins, maintenant le groupe ensemble.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🧮 Mathématiques vectorielles</h4>
                    <p className="text-sm text-text-muted">
                      Chaque règle génère un vecteur force. Ces forces sont combinées (avec des poids ajustables)
                      pour calculer l'accélération du boid. La position est mise à jour via :
                      <code className="block mt-1 bg-surface-lighter p-1 rounded text-xs">
                        velocity += acceleration<br/>
                        position += velocity
                      </code>
                    </p>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">✨ Émergence complexe</h4>
                    <p className="text-sm text-text-muted">
                      Bien que chaque boid suive des règles simples et locales (il ne voit que ses voisins proches),
                      le groupe entier exhibe un comportement complexe et coordonné, similaire aux oiseaux ou poissons réels.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-blue-500">
                    <h4 className="font-bold text-blue-400 mb-2">🌍 Applications réelles</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• Animation 3D et effets visuels (films, jeux vidéo)</li>
                      <li>• Simulation de foules et mouvements de masse</li>
                      <li>• Robotique en essaim (drones, robots autonomes)</li>
                      <li>• Études comportementales en biologie</li>
                      <li>• Optimisation de trafic et flux piétonniers</li>
                    </ul>
                  </div>
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-pink-500">
                    <h4 className="font-bold text-pink-400 mb-2">🔬 Expérimentez !</h4>
                    <p className="text-sm text-text-muted">
                      Essayez de mettre la <strong>séparation à 0</strong> : les boids se superposent.
                      Mettez l'<strong>alignement à 0</strong> : désordre total.
                      Mettez la <strong>cohésion à 0</strong> : le groupe se disperse.
                      L'équilibre des trois crée la magie !
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-purple-400 mb-2">🎓 Dans la Licence Informatique</h4>
                  <p className="text-sm text-text-muted">
                    Les algorithmes de simulation multi-agents comme Boids sont enseignés en <strong>L3</strong> dans les cours
                    d'Intelligence Artificielle, Modélisation & Simulation, et Systèmes Multi-Agents. Vous apprendrez
                    les systèmes complexes, l'émergence, et comment programmer des comportements collectifs intelligents.
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

export default BoidsVisualizer;
