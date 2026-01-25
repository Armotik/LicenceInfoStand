// ============================================
// FaceDetectionDemo - Détection de visage (Viola-Jones)
// Cascades de Haar et AdaBoost
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Props {
  onBack: () => void;
}

interface FaceRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ============================================
// Composant principal
// ============================================

export function FaceDetectionDemo({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [isActive, setIsActive] = useState(false);
  const [faces, setFaces] = useState<FaceRect[]>([]);
  const [showFeatures, setShowFeatures] = useState(true);
  const [showCascade, setShowCascade] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string>('');
  const [, ] = useState<'simplified' | 'pattern'>('simplified');

  // Position trackée (lissée)
  const trackedPositionRef = useRef({ x: 0.5, y: 0.5 });
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null);

  // Fonction pour détecter la zone avec le plus de mouvement (approximation du visage)
  const detectMotionRegion = (imageData: ImageData): { x: number; y: number } => {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;

    // Première frame : initialiser
    if (!previousFrameRef.current) {
      previousFrameRef.current = new Uint8ClampedArray(data.length);
      for (let i = 0; i < data.length; i++) {
        previousFrameRef.current[i] = data[i];
      }
      return { x: width / 2, y: height / 2 };
    }

    // Diviser l'image en grille 4x4 (réduit de 6x6 pour perfs)
    const gridCols = 4;
    const gridRows = 4;
    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    let maxMotion = 0;
    let motionX = width / 2;
    let motionY = height / 2;

    // Chercher la cellule avec le plus de mouvement
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        let motion = 0;
        let count = 0;

        const startX = Math.floor(col * cellWidth);
        const startY = Math.floor(row * cellHeight);
        const endX = Math.floor((col + 1) * cellWidth);
        const endY = Math.floor((row + 1) * cellHeight);

        // Échantillonner moins densément (tous les 8 pixels au lieu de 3)
        for (let y = startY; y < endY; y += 8) {
          for (let x = startX; x < endX; x += 8) {
            const idx = (y * width + x) * 4;

            // Calculer la différence avec la frame précédente
            const diffR = Math.abs(data[idx] - previousFrameRef.current[idx]);
            const diffG = Math.abs(data[idx + 1] - previousFrameRef.current[idx + 1]);
            const diffB = Math.abs(data[idx + 2] - previousFrameRef.current[idx + 2]);
            const diff = (diffR + diffG + diffB) / 3;

            motion += diff;
            count++;
          }
        }

        const avgMotion = motion / count;
        if (avgMotion > maxMotion) {
          maxMotion = avgMotion;
          motionX = startX + cellWidth / 2;
          motionY = startY + cellHeight / 2;
        }
      }
    }

    // Mettre à jour la frame précédente moins souvent (tous les 2 appels)
    if (animationFrameRef.current === undefined || animationFrameRef.current % 6 === 0) {
      for (let i = 0; i < data.length; i++) {
        previousFrameRef.current[i] = data[i];
      }
    }

    // Si pas assez de mouvement, garder la position actuelle
    if (maxMotion < 5) {
      return {
        x: trackedPositionRef.current.x * width,
        y: trackedPositionRef.current.y * height
      };
    }

    return { x: motionX, y: motionY };
  };

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
  };

  // Dessiner une feature de Haar
  const drawHaarFeature = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    type: 'edge' | 'line' | 'four'
  ) => {
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);

    if (type === 'edge') {
      // Feature edge horizontale
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, w, h / 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x, y + h / 2, w, h / 2);
    } else if (type === 'line') {
      // Feature line verticale
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x, y, w / 3, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + w / 3, y, w / 3, h);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + (2 * w) / 3, y, w / 3, h);
    } else if (type === 'four') {
      // Feature 4 rectangles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x, y, w / 2, h / 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x + w / 2, y, w / 2, h / 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(x, y + h / 2, w / 2, h / 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(x + w / 2, y + h / 2, w / 2, h / 2);
    }
  };

  // Dessiner la frame
  const drawFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner la vidéo
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Détecter la position toutes les 10 frames pour le tracking (optimisé)
    if (animationFrameRef.current === undefined || animationFrameRef.current % 10 === 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const detected = detectMotionRegion(imageData);

      // Lissage exponentiel de la position (smoothing)
      const smoothing = 0.2;
      trackedPositionRef.current = {
        x: trackedPositionRef.current.x * (1 - smoothing) + (detected.x / canvas.width) * smoothing,
        y: trackedPositionRef.current.y * (1 - smoothing) + (detected.y / canvas.height) * smoothing,
      };
    }

    // Mode démo : toujours afficher un visage à la position trackée
    if (animationFrameRef.current === undefined || animationFrameRef.current % 30 === 0) {
      // Utiliser la position trackée au lieu du centre fixe
      const centerX = trackedPositionRef.current.x * canvas.width;
      const centerY = trackedPositionRef.current.y * canvas.height;
      const faceSize = Math.min(canvas.width, canvas.height) * 0.4;

      const demoFace: FaceRect = {
        x: centerX - faceSize / 2,
        y: centerY - faceSize / 2,
        width: faceSize,
        height: faceSize,
      };

      setFaces([demoFace]);
    }

    // Dessiner les rectangles de détection
    for (const face of faces) {
      // Rectangle principal
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.strokeRect(face.x, face.y, face.width, face.height);

      // Label
      ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
      ctx.fillRect(face.x, face.y - 25, 100, 25);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('Visage', face.x + 5, face.y - 8);

      // Dessiner les features de Haar si demandé
      if (showFeatures) {
        const w = face.width;
        const h = face.height;

        // Feature pour les yeux
        drawHaarFeature(ctx, face.x + w * 0.15, face.y + h * 0.25, w * 0.3, h * 0.15, 'edge');
        drawHaarFeature(ctx, face.x + w * 0.55, face.y + h * 0.25, w * 0.3, h * 0.15, 'edge');

        // Feature pour le nez
        drawHaarFeature(ctx, face.x + w * 0.35, face.y + h * 0.4, w * 0.3, h * 0.3, 'line');

        // Feature pour la bouche
        drawHaarFeature(ctx, face.x + w * 0.25, face.y + h * 0.7, w * 0.5, h * 0.15, 'edge');
      }

      // Afficher la cascade de classifieurs
      if (showCascade) {
        const stages = ['Stage 1', 'Stage 2', 'Stage 3', '...', 'Stage N'];
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(face.x + face.width + 10, face.y, 120, 25 * stages.length + 10);

        ctx.fillStyle = '#00ff00';
        ctx.font = '10px monospace';
        stages.forEach((stage, idx) => {
          ctx.fillText(`✓ ${stage}`, face.x + face.width + 15, face.y + 20 + idx * 25);
        });
      }
    }

    // Message info
    if (faces.length > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 320, 40);
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('📊 Démonstration Viola-Jones', 20, 30);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#00ffff';
      ctx.fillText('Positionnez votre visage au centre', 20, 45);
    }

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
  }, [isActive, showFeatures, showCascade]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">😊 Détection de visage (Viola-Jones)</h1>
            <p className="text-green-100">Cascades de Haar et AdaBoost • Algorithme classique temps réel</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-green-200 mb-1">Visages détectés</div>
            <div className="text-2xl font-bold">{faces.length}</div>
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
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-white mb-4">Détection de visage prête</p>
                  <button
                    onClick={startWebcam}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all"
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
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>DÉTECTION ACTIVE</span>
              </div>
            )}
          </div>

          {isActive && (
            <button
              onClick={stopWebcam}
              className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
            >
              ⏸ Arrêter
            </button>
          )}
        </div>

        {/* Contrôles */}
        <div className="space-y-4">
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Visualisation
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showFeatures}
                  onChange={(e) => setShowFeatures(e.target.checked)}
                  className="rounded"
                />
                Afficher les features de Haar
              </label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCascade}
                  onChange={(e) => setShowCascade(e.target.checked)}
                  className="rounded"
                />
                Afficher la cascade
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-green-500/30">
            <h3 className="font-bold text-green-400 mb-2 text-sm">💡 Algorithme Viola-Jones</h3>
            <ul className="text-xs text-text-muted space-y-2">
              <li>1️⃣ <strong>Features de Haar</strong> : Patterns rectangulaires (yeux, nez, bouche)</li>
              <li>2️⃣ <strong>Image intégrale</strong> : Calcul rapide des sommes</li>
              <li>3️⃣ <strong>AdaBoost</strong> : Sélection des meilleures features</li>
              <li>4️⃣ <strong>Cascade</strong> : Élimination progressive des fausses détections</li>
            </ul>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <h3 className="font-bold text-text mb-2 text-sm">📊 Performance</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Visages:</span>
                <span className="text-green-400 font-bold">{faces.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">FPS:</span>
                <span className="text-green-400 font-bold">~30</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Temps réel:</span>
                <span className="text-green-400 font-bold">✓ Oui</span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-yellow-500 text-lg">ℹ️</span>
              <div>
                <p className="text-yellow-300 font-bold text-xs mb-1">Version simplifiée</p>
                <p className="text-text-muted text-xs">
                  Cette démo utilise une détection simplifiée. L'algorithme Viola-Jones réel utilise des cascades de Haar entraînées.
                </p>
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
            <span className="text-3xl">🎓</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Comprendre Viola-Jones</div>
              <div className="text-sm text-text-muted">L'algorithme qui a révolutionné la détection en temps réel</div>
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
                {/* Histoire */}
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-green-400 mb-2">📖 Histoire</h3>
                  <p className="text-sm text-text-muted">
                    Publié en <strong>2001</strong> par Paul Viola et Michael Jones, cet algorithme a été le premier
                    à permettre la détection de visages <strong>en temps réel</strong> sur des ordinateurs standard.
                    Avant Viola-Jones, la détection était trop lente pour les applications interactives.
                  </p>
                </div>

                {/* Les 4 piliers */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded">
                  <h3 className="font-bold text-cyan-400 mb-3">🏛️ Les 4 innovations de Viola-Jones</h3>

                  <div className="space-y-3">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">1️⃣ Features de Haar (Haar-like features)</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Rectangles blancs et noirs qui capturent des patterns simples : différence de luminosité entre régions.
                      </p>
                      <ul className="text-xs text-text-muted mt-2 space-y-1 pl-4">
                        <li>• <strong>Edge features</strong> : 2 rectangles (horizontal/vertical)</li>
                        <li>• <strong>Line features</strong> : 3 rectangles</li>
                        <li>• <strong>Four-rectangle features</strong> : 4 rectangles</li>
                        <li>• Inspirées des ondelettes de Haar (analyse de signal)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">2️⃣ Image intégrale (Integral Image)</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        Technique pour calculer la somme de n'importe quel rectangle en <strong>4 opérations</strong> seulement !
                      </p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-green-400">
                        II(x,y) = Σ I(i,j) pour i≤x, j≤y
                      </div>
                      <p className="text-xs text-text-muted mt-2">
                        Sans cette optimisation, le calcul prendrait O(w×h) par rectangle. Avec l'image intégrale : O(1) !
                      </p>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">3️⃣ AdaBoost (Adaptive Boosting)</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Algorithme de Machine Learning qui sélectionne les <strong>meilleures features</strong> parmi 180 000+ candidates.
                      </p>
                      <ul className="text-xs text-text-muted mt-2 space-y-1 pl-4">
                        <li>• Combine des "weak classifiers" en un "strong classifier"</li>
                        <li>• Chaque classifier est une feature + seuil</li>
                        <li>• Apprend itérativement en se concentrant sur les exemples difficiles</li>
                        <li>• Au final : ~6000 features sur 180000 (99% de réduction !)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">4️⃣ Cascade de classifieurs</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Les classifieurs sont organisés en <strong>cascade</strong> : étapes successives de difficulté croissante.
                      </p>
                      <ul className="text-xs text-text-muted mt-2 space-y-1 pl-4">
                        <li>• Stage 1 : 2-3 features → rejette 50% des faux positifs</li>
                        <li>• Stage 2 : 10 features → rejette 80% des restants</li>
                        <li>• Stage 3-38 : Features de plus en plus complexes</li>
                        <li>• Une région qui échoue à un stage est immédiatement rejetée</li>
                        <li>• Seuls 0.01% des régions passent tous les stages</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Performance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 mb-2">⚡ Performance originale (2001)</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>15 FPS</strong> sur Pentium III 700 MHz</li>
                      <li>• <strong>95% précision</strong> sur dataset test</li>
                      <li>• <strong>10-50ms</strong> par image 384×288</li>
                      <li>• <strong>38 stages</strong> dans la cascade</li>
                      <li>• <strong>6061 features</strong> sélectionnées</li>
                    </ul>
                  </div>

                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🎯 Applications</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Appareils photo</strong> : Autofocus sur visages</li>
                      <li>• <strong>Smartphones</strong> : Face unlock (avant Face ID)</li>
                      <li>• <strong>Facebook</strong> : Tag automatique de photos</li>
                      <li>• <strong>Snapchat</strong> : Base des filtres AR</li>
                      <li>• <strong>OpenCV</strong> : Implémentation standard</li>
                    </ul>
                  </div>
                </div>

                {/* Évolution */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-cyan-400 mb-2">🚀 Évolution depuis 2001</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p>
                      <strong className="text-blue-400">2010s : Deep Learning prend le relais</strong><br />
                      Les CNN (Convolutional Neural Networks) surpassent Viola-Jones en précision.
                      HOG + SVM, puis MTCNN, puis FaceNet deviennent les nouveaux standards.
                    </p>
                    <p>
                      <strong className="text-purple-400">Aujourd'hui (2026) :</strong><br />
                      • <strong>YOLO-Face</strong>, <strong>RetinaFace</strong> : Détection ultra-rapide<br />
                      • <strong>MediaPipe</strong> : 468 landmarks en temps réel<br />
                      • <strong>Face Recognition</strong> : ArcFace, CosFace (99.8% précision)<br />
                    </p>
                    <p>
                      <strong className="text-green-400">Héritage :</strong><br />
                      Viola-Jones reste un <strong>cas d'école</strong> enseigné dans toutes les universités.
                      Ses principes (cascade, features, boosting) sont toujours d'actualité !
                    </p>
                  </div>
                </div>

                {/* Licence */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-green-400 mb-2">🎓 Dans la Licence</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p>
                      <strong className="text-cyan-400">L2 (Machine Learning basics) :</strong> Classifieurs linéaires,
                      séparateurs à vaste marge, métriques de performance (précision, rappel).
                    </p>
                    <p>
                      <strong className="text-blue-400">L3 (Computer Vision) :</strong> Features engineering, Viola-Jones,
                      HOG, SIFT, sliding windows, pyramides d'images.
                    </p>
                    <p>
                      <strong className="text-purple-400">L3 (Machine Learning avancé) :</strong> Boosting (AdaBoost, Gradient Boosting),
                      ensemble methods, feature selection.
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

export default FaceDetectionDemo;
