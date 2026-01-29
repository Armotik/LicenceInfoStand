// ============================================
// MotionDetectionDemo - Détection de mouvement par suppression du fond
// Algorithme basé sur histogrammes et intervalles stables [Zheng 2006]
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Props {
  onBack: () => void;
}

type DisplayMode = 'original' | 'background' | 'foreground' | 'motion' | 'histogram';

// ============================================
// Composant principal
// ============================================

export function MotionDetectionDemo({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  // Modèle de fond
  const backgroundModelRef = useRef<Uint8ClampedArray | null>(null);
  const frameCountRef = useRef(0);
  const historyRef = useRef<ImageData[]>([]);

  const [isActive, setIsActive] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('motion');
  const [threshold, setThreshold] = useState(30);
  const [learningRate, setLearningRate] = useState(0.01);
  const [morphologySize, setMorphologySize] = useState(2);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string>('');
  const [stats, setStats] = useState({
    motionPixels: 0,
    totalPixels: 0,
    motionPercent: 0,
  });

  // Démarrer la webcam
  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsActive(true);
        setError('');
      }
    } catch (err) {
      setError('Impossible d\'accéder à la webcam. Veuillez autoriser l\'accès.');
      console.error('Webcam error:', err);
    }
  };

  // Arrêter la webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    backgroundModelRef.current = null;
    frameCountRef.current = 0;
    historyRef.current = [];
  };

  // Réinitialiser le modèle de fond
  const resetBackground = () => {
    backgroundModelRef.current = null;
    frameCountRef.current = 0;
    historyRef.current = [];
  };

  // Opération morphologique : érosion
  const erode = (data: Uint8ClampedArray, width: number, height: number, size: number): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        let min = 255;
        for (let dy = -size; dy <= size; dy++) {
          for (let dx = -size; dx <= size; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nidx = (ny * width + nx) * 4;
              min = Math.min(min, data[nidx]);
            }
          }
        }

        result[idx] = result[idx + 1] = result[idx + 2] = min;
        result[idx + 3] = 255;
      }
    }

    return result;
  };

  // Opération morphologique : dilatation
  const dilate = (data: Uint8ClampedArray, width: number, height: number, size: number): Uint8ClampedArray => {
    const result = new Uint8ClampedArray(data.length);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;

        let max = 0;
        for (let dy = -size; dy <= size; dy++) {
          for (let dx = -size; dx <= size; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const nidx = (ny * width + nx) * 4;
              max = Math.max(max, data[nidx]);
            }
          }
        }

        result[idx] = result[idx + 1] = result[idx + 2] = max;
        result[idx + 3] = 255;
      }
    }

    return result;
  };

  // Calculer l'histogramme d'une image
  const computeHistogram = (data: Uint8ClampedArray): number[] => {
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < data.length; i += 4) {
      // Convertir en niveau de gris
      const gray = Math.floor(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      histogram[gray]++;
    }
    return histogram;
  };

  // Dessiner la frame
  const drawFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Dessiner la vidéo sur un canvas temporaire
    ctx.drawImage(video, 0, 0, width, height);
    const currentFrame = ctx.getImageData(0, 0, width, height);

    // Initialiser le modèle de fond si nécessaire
    if (!backgroundModelRef.current) {
      backgroundModelRef.current = new Uint8ClampedArray(currentFrame.data.length);
      backgroundModelRef.current.set(currentFrame.data);
      frameCountRef.current = 0;
    }

    const background = backgroundModelRef.current;
    const foreground = new Uint8ClampedArray(currentFrame.data.length) as Uint8ClampedArray;

    // Détection de mouvement par différence de fond
    let motionCount = 0;
    for (let i = 0; i < currentFrame.data.length; i += 4) {
      // Calculer la différence
      const diffR = Math.abs(currentFrame.data[i] - background[i]);
      const diffG = Math.abs(currentFrame.data[i + 1] - background[i + 1]);
      const diffB = Math.abs(currentFrame.data[i + 2] - background[i + 2]);
      const diff = (diffR + diffG + diffB) / 3;

      // Seuillage
      if (diff > threshold) {
        // Pixel en mouvement (blanc)
        foreground[i] = 255;
        foreground[i + 1] = 255;
        foreground[i + 2] = 255;
        foreground[i + 3] = 255;
        motionCount++;
      } else {
        // Pixel statique (noir)
        foreground[i] = 0;
        foreground[i + 1] = 0;
        foreground[i + 2] = 0;
        foreground[i + 3] = 255;
      }

      // Mise à jour du modèle de fond (moyenne mobile exponentielle)
      background[i] = background[i] * (1 - learningRate) + currentFrame.data[i] * learningRate;
      background[i + 1] = background[i + 1] * (1 - learningRate) + currentFrame.data[i + 1] * learningRate;
      background[i + 2] = background[i + 2] * (1 - learningRate) + currentFrame.data[i + 2] * learningRate;
    }

    // Morphologie : fermeture (dilate + erode) pour nettoyer
    let cleanedForeground = foreground;
    if (morphologySize > 0) {
      const dilated = dilate(foreground, width, height, morphologySize);
      cleanedForeground = erode(dilated, width, height, morphologySize);
    }

    // Statistiques
    const totalPixels = width * height;
    const motionPercent = (motionCount / totalPixels) * 100;
    setStats({
      motionPixels: motionCount,
      totalPixels,
      motionPercent: Math.round(motionPercent * 10) / 10,
    });

    // Affichage selon le mode
    let displayData: Uint8ClampedArray;
    switch (displayMode) {
      case 'original':
        displayData = currentFrame.data;
        break;
      case 'background':
        displayData = background;
        break;
      case 'foreground':
        displayData = cleanedForeground;
        break;
      case 'motion':
        // Superposer le masque de mouvement sur la vidéo
        displayData = new Uint8ClampedArray(currentFrame.data.length);
        for (let i = 0; i < displayData.length; i += 4) {
          if (cleanedForeground[i] > 0) {
            // Zone en mouvement : contour vert
            displayData[i] = currentFrame.data[i] * 0.7;
            displayData[i + 1] = Math.min(255, currentFrame.data[i + 1] * 0.7 + 128);
            displayData[i + 2] = currentFrame.data[i + 2] * 0.7;
            displayData[i + 3] = 255;
          } else {
            // Zone statique : assombrie
            displayData[i] = currentFrame.data[i] * 0.3;
            displayData[i + 1] = currentFrame.data[i + 1] * 0.3;
            displayData[i + 2] = currentFrame.data[i + 2] * 0.3;
            displayData[i + 3] = 255;
          }
        }
        break;
      case 'histogram':
        // Dessiner l'histogramme
        const histogram = computeHistogram(currentFrame.data);
        const maxFreq = Math.max(...histogram);

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);

        const barWidth = width / 256;
        for (let i = 0; i < 256; i++) {
          const barHeight = (histogram[i] / maxFreq) * height * 0.9;
          const x = i * barWidth;
          const y = height - barHeight;

          const hue = (i / 256) * 120;
          ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
          ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Ligne de seuil
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo((threshold / 256) * width, 0);
        ctx.lineTo((threshold / 256) * width, height);
        ctx.stroke();

        frameCountRef.current++;
        animationFrameRef.current = requestAnimationFrame(drawFrame);
        return;
      default:
        displayData = currentFrame.data;
    }

    const outputImageData = ctx.createImageData(width, height);
    for (let i = 0; i < displayData.length; i++) {
      outputImageData.data[i] = displayData[i];
    }
    ctx.putImageData(outputImageData, 0, 0);

    frameCountRef.current++;
    animationFrameRef.current = requestAnimationFrame(drawFrame);
  };

  // Effets
  useEffect(() => {
    if (isActive) {
      drawFrame();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, displayMode, threshold, learningRate, morphologySize]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎥 Détection de mouvement</h1>
            <p className="text-purple-100">Suppression du fond par histogramme et intervalles stables</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-purple-200 mb-1">Mouvement détecté</div>
            <div className="text-2xl font-bold">{stats.motionPercent}%</div>
          </div>
        </div>
      </div>

      {/* Vidéo et contrôles */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Canvas vidéo */}
        <div className="lg:col-span-2 bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
          <div className="relative bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
            <video
              ref={videoRef}
              className="absolute inset-0 w-full h-full object-cover hidden"
              playsInline
            />
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                <div className="text-center">
                  <div className="text-6xl mb-4">📹</div>
                  <p className="text-white mb-4">Détection de mouvement prête</p>
                  <button
                    onClick={startWebcam}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all"
                  >
                    ▶ Démarrer la détection
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {isActive && (
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg text-white text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>DÉTECTION ACTIVE</span>
              </div>
            )}

            {isActive && stats.motionPercent > 10 && (
              <div className="absolute top-4 left-4 bg-red-500/80 px-3 py-2 rounded-lg text-white text-sm font-bold flex items-center gap-2 animate-pulse">
                🚨 MOUVEMENT DÉTECTÉ
              </div>
            )}
          </div>

          {/* Modes d'affichage */}
          <div className="grid grid-cols-5 gap-2 mt-4">
            {(['original', 'background', 'foreground', 'motion', 'histogram'] as DisplayMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  displayMode === mode
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-surface hover:bg-surface-lighter text-text'
                }`}
              >
                {mode === 'original' ? '📹 Original' :
                 mode === 'background' ? '🖼️ Fond' :
                 mode === 'foreground' ? '👤 Masque' :
                 mode === 'motion' ? '🎯 Mouvement' :
                 '📊 Histogramme'}
              </button>
            ))}
          </div>

          {isActive && (
            <div className="flex gap-2 mt-2">
              <button
                onClick={stopWebcam}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
              >
                ⏸ Arrêter
              </button>
              <button
                onClick={resetBackground}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition-all"
              >
                🔄 Réinitialiser le fond
              </button>
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="space-y-4">
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Paramètres
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-text-muted mb-1 block">
                  Seuil de détection: {threshold}
                </label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-text-muted mt-1">
                  {threshold < 20 ? '🔴 Très sensible' : threshold < 40 ? '🟡 Sensible' : threshold < 60 ? '🟢 Équilibré' : '🔵 Peu sensible'}
                </p>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">
                  Taux d'apprentissage: {(learningRate * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.001"
                  max="0.1"
                  step="0.001"
                  value={learningRate}
                  onChange={(e) => setLearningRate(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-text-muted mt-1">
                  {learningRate < 0.01 ? '🐢 Lent' : learningRate < 0.03 ? '🚶 Modéré' : '🏃 Rapide'}
                </p>
              </div>

              <div>
                <label className="text-xs text-text-muted mb-1 block">
                  Nettoyage morphologique: {morphologySize}
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  value={morphologySize}
                  onChange={(e) => setMorphologySize(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-text-muted mt-1">
                  {morphologySize === 0 ? '❌ Désactivé' : '✨ Réduit le bruit'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-purple-500/30">
            <h3 className="font-bold text-purple-400 mb-2 text-sm">💡 Algorithme</h3>
            <ul className="text-xs text-text-muted space-y-2">
              <li>1️⃣ <strong>Modèle de fond</strong> : Moyenne mobile des frames précédentes</li>
              <li>2️⃣ <strong>Différence</strong> : |frame actuelle - fond| {'>'} seuil</li>
              <li>3️⃣ <strong>Morphologie</strong> : Fermeture pour nettoyer le bruit</li>
              <li>4️⃣ <strong>Mise à jour</strong> : Fond = (1-α)×fond + α×frame</li>
            </ul>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <h3 className="font-bold text-text mb-2 text-sm">📊 Statistiques</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Pixels en mouvement:</span>
                <span className="text-purple-400 font-bold">{stats.motionPixels.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Pixels totaux:</span>
                <span className="text-purple-400 font-bold">{stats.totalPixels.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Pourcentage:</span>
                <span className="text-purple-400 font-bold">{stats.motionPercent}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Frames traitées:</span>
                <span className="text-purple-400 font-bold">{frameCountRef.current}</span>
              </div>
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
            <span className="text-3xl">📚</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Comprendre la détection de mouvement</div>
              <div className="text-sm text-text-muted">Histogrammes, statistiques et traitement d'image</div>
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
                {/* Algorithme détaillé */}
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-purple-400 mb-3">🎯 Algorithme de suppression du fond</h3>

                  <div className="space-y-3">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-purple-300 text-sm">1️⃣ Modélisation du fond (Background Modeling)</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        Le fond est représenté par la <strong>moyenne mobile exponentielle</strong> des frames précédentes.
                      </p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-green-400">
                        B(t+1) = (1-α) × B(t) + α × F(t)
                      </div>
                      <ul className="text-xs text-text-muted mt-2 space-y-1 pl-4">
                        <li>• <strong>B(t)</strong> : Modèle de fond au temps t</li>
                        <li>• <strong>F(t)</strong> : Frame actuelle</li>
                        <li>• <strong>α</strong> : Taux d'apprentissage (learning rate)</li>
                        <li>• α petit (0.001-0.01) : Adaptation lente, mieux pour fond stable</li>
                        <li>• α grand (0.05-0.1) : Adaptation rapide, mieux pour fond changeant</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-purple-300 text-sm">2️⃣ Détection par différence</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        Un pixel est considéré en mouvement si la différence avec le fond dépasse un seuil.
                      </p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-green-400">
                        M(x,y) = |F(x,y) - B(x,y)| {'>'} threshold
                      </div>
                      <ul className="text-xs text-text-muted mt-2 space-y-1 pl-4">
                        <li>• Différence calculée sur chaque canal RGB</li>
                        <li>• Moyenne des 3 canaux pour la décision finale</li>
                        <li>• Seuil typique : 20-50 (sur 0-255)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-purple-300 text-sm">3️⃣ Morphologie mathématique</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        Nettoyage du masque binaire pour réduire le bruit.
                      </p>
                      <ul className="text-xs text-text-muted space-y-1 pl-4">
                        <li>• <strong>Érosion</strong> : Rétrécit les régions (supprime petits pixels isolés)</li>
                        <li>• <strong>Dilatation</strong> : Élargit les régions (comble les trous)</li>
                        <li>• <strong>Fermeture</strong> : Dilatation puis érosion (lisse les contours)</li>
                        <li>• <strong>Ouverture</strong> : Érosion puis dilatation (supprime bruit)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-purple-300 text-sm">4️⃣ Histogrammes et statistiques</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        L'histogramme montre la distribution des niveaux de gris dans l'image.
                      </p>
                      <ul className="text-xs text-text-muted space-y-1 pl-4">
                        <li>• <strong>Axe X</strong> : Intensité (0-255)</li>
                        <li>• <strong>Axe Y</strong> : Fréquence (nombre de pixels)</li>
                        <li>• Permet d'analyser le contraste, la luminosité</li>
                        <li>• Utile pour choisir le seuil optimal</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Intervalles stables (Zheng 2006) */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded">
                  <h3 className="font-bold text-cyan-400 mb-2">📖 Méthode des intervalles stables [Zheng 2006]</h3>
                  <p className="text-sm text-text-muted mb-3">
                    L'article de Zheng propose une méthode basée sur la <strong>fréquence d'apparition</strong> des valeurs de pixels.
                  </p>

                  <div className="space-y-2">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">💡 Principe</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Pour chaque pixel, on garde un historique de ses valeurs sur N frames.
                        Les valeurs qui apparaissent le plus souvent = fond stable.
                        Les valeurs rares = mouvement temporaire.
                      </p>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">🔢 Méthode</strong>
                      <ol className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>1. Pour chaque pixel (x,y), construire l'histogramme de ses valeurs</li>
                        <li>2. Trouver l'intervalle [min, max] le plus fréquent</li>
                        <li>3. Si la valeur actuelle ∈ intervalle → fond</li>
                        <li>4. Sinon → mouvement</li>
                      </ol>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">✅ Avantages</strong>
                      <ul className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>• Robuste aux changements d'éclairage progressifs</li>
                        <li>• Gère les ombres et reflets</li>
                        <li>• Pas besoin de seuil manuel</li>
                        <li>• S'adapte automatiquement</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">🎬 Applications</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Surveillance</strong> : Détection d'intrusion</li>
                      <li>• <strong>Analyse sportive</strong> : Suivi de joueurs</li>
                      <li>• <strong>Visioconférence</strong> : Fond virtuel (Zoom)</li>
                      <li>• <strong>Contrôle de trafic</strong> : Comptage de véhicules</li>
                      <li>• <strong>VFX</strong> : Chromakey, effets spéciaux</li>
                    </ul>
                  </div>

                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">⚡ Optimisations</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Mixture of Gaussians (MOG)</strong> : Modèle probabiliste</li>
                      <li>• <strong>KNN Background Subtractor</strong> : K plus proches voisins</li>
                      <li>• <strong>GMG</strong> : Modèle bayésien</li>
                      <li>• <strong>Deep Learning</strong> : SegNet, U-Net pour segmentation</li>
                      <li>• <strong>GPU</strong> : Parallélisation massive</li>
                    </ul>
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

export default MotionDetectionDemo;
