// ============================================
// MandelbrotVisualizer - Exploration de l'ensemble de Mandelbrot
// Démo pédagogique et impressionnante pour les futurs bacheliers
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================
// Types
// ============================================

type ColorPalette = 'classic' | 'fire' | 'ocean' | 'psychedelic' | 'grayscale';
type RenderQuality = 'low' | 'medium' | 'high' | 'ultra';

interface ViewPort {
  centerX: number;
  centerY: number;
  zoom: number;
}

interface ColorScheme {
  name: string;
  description: string;
  getColor: (iteration: number, maxIterations: number) => string;
}

// ============================================
// Palettes de couleurs
// ============================================

const COLOR_PALETTES: Record<ColorPalette, ColorScheme> = {
  classic: {
    name: 'Classique',
    description: 'Dégradé bleu-blanc traditionnel',
    getColor: (iter, max) => {
      if (iter === max) return '#000000';
      const t = iter / max;
      const r = Math.floor(9 * (1 - t) * t * t * t * 255);
      const g = Math.floor(15 * (1 - t) * (1 - t) * t * t * 255);
      const b = Math.floor(8.5 * (1 - t) * (1 - t) * (1 - t) * t * 255);
      return `rgb(${r},${g},${b})`;
    },
  },
  fire: {
    name: 'Feu',
    description: 'Dégradé rouge-orange-jaune',
    getColor: (iter, max) => {
      if (iter === max) return '#000000';
      const t = iter / max;
      const r = Math.floor(255 * Math.sqrt(t));
      const g = Math.floor(255 * t * t);
      const b = Math.floor(255 * t * t * t * t);
      return `rgb(${r},${g},${b})`;
    },
  },
  ocean: {
    name: 'Océan',
    description: 'Dégradé bleu-cyan-vert',
    getColor: (iter, max) => {
      if (iter === max) return '#000000';
      const t = iter / max;
      const r = Math.floor(50 * t);
      const g = Math.floor(150 + 105 * Math.sin(t * Math.PI));
      const b = Math.floor(200 + 55 * Math.cos(t * Math.PI));
      return `rgb(${r},${g},${b})`;
    },
  },
  psychedelic: {
    name: 'Psychédélique',
    description: 'Arc-en-ciel vibrant',
    getColor: (iter, max) => {
      if (iter === max) return '#000000';
      const t = (iter / max) * 6;
      const r = Math.floor(255 * Math.sin(t * Math.PI) ** 2);
      const g = Math.floor(255 * Math.sin((t + 2) * Math.PI) ** 2);
      const b = Math.floor(255 * Math.sin((t + 4) * Math.PI) ** 2);
      return `rgb(${r},${g},${b})`;
    },
  },
  grayscale: {
    name: 'Niveaux de gris',
    description: 'Noir et blanc simple',
    getColor: (iter, max) => {
      if (iter === max) return '#000000';
      const gray = Math.floor((iter / max) * 255);
      return `rgb(${gray},${gray},${gray})`;
    },
  },
};

const QUALITY_SETTINGS: Record<RenderQuality, number> = {
  low: 1,
  medium: 2,
  high: 3,
  ultra: 4,
};

// ============================================
// Composant principal
// ============================================

export function MandelbrotVisualizer() {
  // Canvas ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);

  // Paramètres
  const [maxIterations, setMaxIterations] = useState(100);
  const [colorPalette, setColorPalette] = useState<ColorPalette>('fire');
  const [quality, setQuality] = useState<RenderQuality>('medium');
  const [showExplanation, setShowExplanation] = useState(false);

  // Viewport
  const [viewport, setViewport] = useState<ViewPort>({
    centerX: -0.5,
    centerY: 0,
    zoom: 1,
  });

  // Points d'intérêt prédéfinis
  const interestingPoints = [
    { name: 'Vue complète', centerX: -0.5, centerY: 0, zoom: 1 },
    { name: 'Spirale', centerX: -0.743643887037151, centerY: 0.13182590420533, zoom: 100000 },
    { name: 'Vallée des hippocampes', centerX: -0.749, centerY: 0.1, zoom: 10000 },
    { name: 'Mini Mandelbrot', centerX: -0.16, centerY: 1.0405, zoom: 10000 },
    { name: 'Dendrites', centerX: -0.1592, centerY: -1.0317, zoom: 10000 },
  ];

  // Calculer Mandelbrot pour un point
  const mandelbrot = useCallback((x: number, y: number, maxIter: number): number => {
    let zx = 0;
    let zy = 0;
    let iteration = 0;

    while (zx * zx + zy * zy < 4 && iteration < maxIter) {
      const xtemp = zx * zx - zy * zy + x;
      zy = 2 * zx * zy + y;
      zx = xtemp;
      iteration++;
    }

    return iteration;
  }, []);

  // Render Mandelbrot
  const renderMandelbrot = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsRendering(true);

    const width = canvas.width;
    const height = canvas.height;
    const imageData = ctx.createImageData(width, height);
    const pixelDensity = QUALITY_SETTINGS[quality];

    // Calculer les limites
    const aspectRatio = width / height;
    const range = 4 / viewport.zoom;
    const xMin = viewport.centerX - (range * aspectRatio) / 2;
    const xMax = viewport.centerX + (range * aspectRatio) / 2;
    const yMin = viewport.centerY - range / 2;
    const yMax = viewport.centerY + range / 2;

    const palette = COLOR_PALETTES[colorPalette];

    // Render avec requestAnimationFrame pour ne pas bloquer l'UI
    let currentY = 0;

    const renderChunk = () => {
      const chunkSize = 10;
      const endY = Math.min(currentY + chunkSize, height);

      for (let py = currentY; py < endY; py += pixelDensity) {
        for (let px = 0; px < width; px += pixelDensity) {
          const x = xMin + (px / width) * (xMax - xMin);
          const y = yMin + (py / height) * (yMax - yMin);

          const iteration = mandelbrot(x, y, maxIterations);
          const color = palette.getColor(iteration, maxIterations);

          // Parse RGB
          const match = color.match(/\d+/g);
          if (match) {
            const [r, g, b] = match.map(Number);

            // Remplir le bloc de pixels
            for (let dy = 0; dy < pixelDensity && py + dy < height; dy++) {
              for (let dx = 0; dx < pixelDensity && px + dx < width; dx++) {
                const index = ((py + dy) * width + (px + dx)) * 4;
                imageData.data[index] = r;
                imageData.data[index + 1] = g;
                imageData.data[index + 2] = b;
                imageData.data[index + 3] = 255;
              }
            }
          }
        }
      }

      currentY = endY;

      if (currentY < height) {
        requestAnimationFrame(renderChunk);
      } else {
        ctx.putImageData(imageData, 0, 0);
        setIsRendering(false);
      }
    };

    renderChunk();
  }, [viewport, maxIterations, colorPalette, quality, mandelbrot]);

  // Effet pour re-render quand les paramètres changent
  useEffect(() => {
    renderMandelbrot();
  }, [renderMandelbrot]);

  // Gérer le zoom avec la molette
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convertir en coordonnées Mandelbrot
    const aspectRatio = canvas.width / canvas.height;
    const range = 4 / viewport.zoom;
    const xMin = viewport.centerX - (range * aspectRatio) / 2;
    const yMin = viewport.centerY - range / 2;

    const x = xMin + (mouseX / canvas.width) * (range * aspectRatio);
    const y = yMin + (mouseY / canvas.height) * range;

    // Zoomer
    const zoomFactor = e.deltaY > 0 ? 0.8 : 1.25;
    const newZoom = viewport.zoom * zoomFactor;

    // Ajuster le centre pour zoomer sur la souris
    setViewport({
      centerX: x,
      centerY: y,
      zoom: newZoom,
    });
  };

  // Gérer le clic pour zoomer
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convertir en coordonnées Mandelbrot
    const aspectRatio = canvas.width / canvas.height;
    const range = 4 / viewport.zoom;
    const xMin = viewport.centerX - (range * aspectRatio) / 2;
    const yMin = viewport.centerY - range / 2;

    const x = xMin + (mouseX / canvas.width) * (range * aspectRatio);
    const y = yMin + (mouseY / canvas.height) * range;

    setViewport({
      centerX: x,
      centerY: y,
      zoom: viewport.zoom * 2,
    });
  };

  return (
    <div className="w-full h-full flex gap-4 bg-surface p-6">
      {/* Canvas principal */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Canvas */}
        <div className="flex-1 relative bg-black rounded-xl overflow-hidden border border-primary-light/20">
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="w-full h-full cursor-crosshair"
            onClick={handleClick}
            onWheel={handleWheel}
          />
          {isRendering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="flex items-center gap-3 bg-surface-light px-6 py-3 rounded-xl">
                <div className="animate-spin w-5 h-5 border-2 border-primary-light border-t-transparent rounded-full" />
                <span className="text-primary-light font-medium">Calcul en cours...</span>
              </div>
            </div>
          )}

          {/* Info zoom */}
          <div className="absolute top-4 left-4 bg-black/70 px-4 py-2 rounded-lg text-xs font-mono text-white">
            <div>Zoom: ×{viewport.zoom.toExponential(2)}</div>
            <div>Centre: ({viewport.centerX.toFixed(6)}, {viewport.centerY.toFixed(6)})</div>
            <div>Itérations max: {maxIterations}</div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded-lg text-xs text-white">
            💡 Clic pour zoomer • Molette pour zoom précis
          </div>
        </div>

        {/* Contrôles principaux */}
        <div className="grid grid-cols-3 gap-4">
          {/* Itérations */}
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <label className="text-sm font-bold text-text mb-2 block">
              Itérations max: {maxIterations}
            </label>
            <input
              type="range"
              min="20"
              max="500"
              value={maxIterations}
              onChange={(e) => setMaxIterations(Number(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-text-muted mt-2">
              Plus d'itérations = plus de détails (mais plus lent)
            </p>
          </div>

          {/* Qualité */}
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <label className="text-sm font-bold text-text mb-2 block">Qualité</label>
            <div className="grid grid-cols-4 gap-1">
              {(['low', 'medium', 'high', 'ultra'] as RenderQuality[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuality(q)}
                  className={clsx(
                    'px-2 py-1 rounded text-xs font-medium transition-all',
                    quality === q
                      ? 'bg-purple-500 text-white'
                      : 'bg-surface text-text-muted hover:bg-surface-lighter'
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Palette */}
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <label className="text-sm font-bold text-text mb-2 block">Palette</label>
            <select
              value={colorPalette}
              onChange={(e) => setColorPalette(e.target.value as ColorPalette)}
              className="w-full bg-surface text-text rounded px-3 py-2 text-sm"
            >
              {(Object.keys(COLOR_PALETTES) as ColorPalette[]).map((palette) => (
                <option key={palette} value={palette}>
                  {COLOR_PALETTES[palette].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Panneau latéral */}
      <div className="w-80 flex flex-col gap-4">
        {/* Points d'intérêt */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <h3 className="text-sm font-bold text-text mb-3 flex items-center gap-2">
            <span>📍</span> Points d'intérêt
          </h3>
          <div className="space-y-2">
            {interestingPoints.map((point, idx) => (
              <button
                key={idx}
                onClick={() => setViewport(point)}
                className="w-full text-left px-3 py-2 rounded-lg bg-surface hover:bg-surface-lighter transition-all text-sm"
              >
                <div className="font-medium text-text">{point.name}</div>
                <div className="text-xs text-text-muted">
                  Zoom ×{point.zoom.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={() => setViewport({ centerX: -0.5, centerY: 0, zoom: 1 })}
            className="w-full mt-3 px-4 py-2 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition-all"
          >
            🔄 Réinitialiser
          </button>
        </div>

        {/* Explication */}
        <div className="flex-1 bg-gradient-to-br from-purple-900/30 to-pink-900/20 rounded-xl p-4 border border-purple-500/30 overflow-y-auto">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="w-full flex items-center justify-between mb-3 text-purple-400 font-bold"
          >
            <span className="flex items-center gap-2">
              <span>🧮</span> Comprendre l'algorithme
            </span>
            <span>{showExplanation ? '▼' : '▶'}</span>
          </button>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-4 text-sm overflow-hidden"
              >
                {/* Comment ça marche */}
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">💡 Comment ça marche ?</h4>
                  <p className="text-text-muted text-xs leading-relaxed mb-2">
                    L'ensemble de Mandelbrot est défini par la formule : <code className="bg-black/30 px-1 py-0.5 rounded">z(n+1) = z(n)² + c</code>
                  </p>
                  <ol className="space-y-1 text-xs text-text-muted pl-4">
                    <li>1. Pour chaque pixel, on associe un nombre complexe c</li>
                    <li>2. On part de z = 0 et on itère la formule</li>
                    <li>3. Si |z| reste {"<"} 2 après max itérations → dans l'ensemble (noir)</li>
                    <li>4. Sinon, on colore selon le nombre d'itérations avant divergence</li>
                  </ol>
                </div>

                {/* Pourquoi c'est important */}
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">🎯 Pourquoi c'est important ?</h4>
                  <ul className="space-y-1 text-xs text-text-muted pl-4">
                    <li>• <strong>Auto-similarité</strong> : Zoomer révèle des motifs infinis</li>
                    <li>• <strong>Complexité émergente</strong> : Formule simple → beauté infinie</li>
                    <li>• <strong>Nombres complexes</strong> : Application concrète des maths</li>
                    <li>• <strong>Calcul parallèle</strong> : Chaque pixel est indépendant (GPU)</li>
                  </ul>
                </div>

                {/* Applications réelles */}
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">🔬 Applications réelles</h4>
                  <ul className="space-y-1 text-xs text-text-muted pl-4">
                    <li>• <strong>Compression d'images</strong> : Fractales pour encoder des textures</li>
                    <li>• <strong>Antennes fractales</strong> : Télécommunications</li>
                    <li>• <strong>Modélisation naturelle</strong> : Côtes, nuages, montagnes</li>
                    <li>• <strong>Cryptographie</strong> : Génération de nombres pseudo-aléatoires</li>
                  </ul>
                </div>

                {/* Lien avec la Licence */}
                <div className="bg-purple-500/20 rounded-lg p-3 border border-purple-500/30">
                  <h4 className="font-bold text-purple-300 mb-2 text-xs">🎓 Dans la Licence</h4>
                  <p className="text-xs text-text-muted leading-relaxed">
                    <strong>L1 :</strong> Nombres complexes, suites et convergence
                    <br />
                    <strong>L2 :</strong> Optimisation, calcul parallèle, structures de données
                    <br />
                    <strong>L3 :</strong> Calcul GPU, rendu graphique, traitement d'image
                  </p>
                </div>

                {/* Complexité */}
                <div>
                  <h4 className="font-bold text-purple-300 mb-2">⚡ Complexité</h4>
                  <div className="bg-black/30 rounded p-2 text-xs font-mono">
                    <div className="text-yellow-400">Temps : O(width × height × maxIter)</div>
                    <div className="text-green-400 mt-1">Espace : O(width × height)</div>
                  </div>
                  <p className="text-xs text-text-muted mt-2">
                    Chaque pixel nécessite jusqu'à <code>maxIter</code> calculs.
                    Parallélisable sur GPU pour gain ×100 !
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MandelbrotVisualizer;
