// ============================================
// YoloObjectDetectionDemo - Détection d'objets YOLO
// Neural Network pour détection en temps réel
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

// ============================================
// Types
// ============================================

interface Props {
  onBack: () => void;
}

interface Detection {
  bbox: [number, number, number, number]; // [x, y, width, height]
  class: string;
  score: number;
}

// Couleurs pour les différentes classes d'objets
const CLASS_COLORS: Record<string, string> = {
  person: '#00ff00',
  car: '#ff0000',
  bicycle: '#0000ff',
  motorcycle: '#ff00ff',
  airplane: '#00ffff',
  bus: '#ffff00',
  train: '#ff8800',
  truck: '#8800ff',
  boat: '#ff0088',
  'traffic light': '#88ff00',
  'fire hydrant': '#0088ff',
  'stop sign': '#ff8888',
  'parking meter': '#88ff88',
  bench: '#8888ff',
  bird: '#ffff88',
  cat: '#ff88ff',
  dog: '#88ffff',
  horse: '#ff4444',
  sheep: '#44ff44',
  cow: '#4444ff',
  elephant: '#ff44ff',
  bear: '#44ffff',
  zebra: '#ffff44',
  giraffe: '#ff4488',
  backpack: '#44ff88',
  umbrella: '#4488ff',
  handbag: '#88ff44',
  tie: '#8844ff',
  suitcase: '#ff8844',
  frisbee: '#44ff44',
  skis: '#ff4444',
  snowboard: '#4444ff',
  'sports ball': '#ff44ff',
  kite: '#44ffff',
  'baseball bat': '#ffff44',
  'baseball glove': '#ff4488',
  skateboard: '#44ff88',
  surfboard: '#4488ff',
  'tennis racket': '#88ff44',
  bottle: '#8844ff',
  'wine glass': '#ff8844',
  cup: '#88ffff',
  fork: '#ffff88',
  knife: '#ff88ff',
  spoon: '#88ff88',
  bowl: '#8888ff',
  banana: '#ffcc00',
  apple: '#ff0000',
  sandwich: '#ff8844',
  orange: '#ff8800',
  broccoli: '#00ff00',
  carrot: '#ff8800',
  'hot dog': '#ff4444',
  pizza: '#ffcc00',
  donut: '#ff88ff',
  cake: '#ffaaff',
  chair: '#8888ff',
  couch: '#4444ff',
  'potted plant': '#00ff00',
  bed: '#4488ff',
  'dining table': '#88ffff',
  toilet: '#ffffff',
  tv: '#000088',
  laptop: '#0088ff',
  mouse: '#888888',
  remote: '#444444',
  keyboard: '#666666',
  'cell phone': '#0088ff',
  microwave: '#88ffff',
  oven: '#ff8888',
  toaster: '#ffff88',
  sink: '#ffffff',
  refrigerator: '#88ffff',
  book: '#ff8844',
  clock: '#ffff00',
  vase: '#ff44ff',
  scissors: '#888888',
  'teddy bear': '#ff8844',
  'hair drier': '#ff88ff',
  toothbrush: '#00ffff',
};

const DEFAULT_COLOR = '#00ff00';

// ============================================
// Composant principal
// ============================================

export function YoloObjectDetectionDemo({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const modelRef = useRef<cocoSsd.ObjectDetection | null>(null);

  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState<Detection[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isModelReady, setIsModelReady] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string>('');
  const [fps, setFps] = useState(0);
  const fpsRef = useRef<number[]>([]);
  const lastTimeRef = useRef<number>(Date.now());

  // Charger le modèle COCO-SSD
  useEffect(() => {
    const loadModel = async () => {
      try {
        console.log('Loading COCO-SSD model...');
        const model = await cocoSsd.load({
          base: 'mobilenet_v2', // Plus rapide que lite_mobilenet_v2
        });
        modelRef.current = model;
        console.log('COCO-SSD model loaded successfully');
        setIsModelReady(true);
        setIsModelLoading(false);
      } catch (err) {
        console.error('Failed to load COCO-SSD model:', err);
        setError('Impossible de charger le modèle YOLO. Veuillez rafraîchir la page.');
        setIsModelLoading(false);
      }
    };

    loadModel();

    return () => {
      // Cleanup model
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  // Démarrer la webcam
  const startWebcam = async () => {
    if (!isModelReady) {
      setError('Le modèle n\'est pas encore chargé. Veuillez patienter...');
      return;
    }

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
    setDetections([]);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Fonction pour détecter les objets
  const detectObjects = async (): Promise<Detection[]> => {
    if (!isModelReady || !modelRef.current || !videoRef.current || !canvasRef.current) {
      return [];
    }

    const video = videoRef.current;

    // Vérifier que la vidéo a des dimensions valides
    if (!video.videoWidth || !video.videoHeight || video.videoWidth === 0 || video.videoHeight === 0) {
      return [];
    }

    try {
      // Détecter les objets avec COCO-SSD
      const predictions = await modelRef.current.detect(video);

      // Convertir les prédictions au format Detection
      const detections: Detection[] = predictions.map(prediction => ({
        bbox: prediction.bbox as [number, number, number, number],
        class: prediction.class,
        score: prediction.score,
      }));

      return detections;
    } catch (err) {
      console.error('Object detection error:', err);
      return [];
    }
  };

  // Dessiner la frame
  const drawFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive || !isModelReady) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calculer FPS
    const now = Date.now();
    const delta = now - lastTimeRef.current;
    lastTimeRef.current = now;
    fpsRef.current.push(1000 / delta);
    if (fpsRef.current.length > 30) {
      fpsRef.current.shift();
    }
    const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
    setFps(Math.round(avgFps));

    // Dessiner la vidéo sur le canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Détecter les objets
    const detectedObjects = await detectObjects();
    setDetections(detectedObjects);

    // Dessiner les bounding boxes et labels
    for (const detection of detectedObjects) {
      const [x, y, width, height] = detection.bbox;
      const color = CLASS_COLORS[detection.class] || DEFAULT_COLOR;

      // Bounding box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Label avec confiance
      if (showLabels) {
        const label = showConfidence
          ? `${detection.class} ${Math.round(detection.score * 100)}%`
          : detection.class;

        ctx.font = 'bold 14px sans-serif';
        const textWidth = ctx.measureText(label).width;

        // Fond du label
        ctx.fillStyle = color;
        ctx.fillRect(x, y - 25, textWidth + 10, 25);

        // Texte du label
        ctx.fillStyle = '#000';
        ctx.fillText(label, x + 5, y - 8);
      }
    }

    animationFrameRef.current = requestAnimationFrame(drawFrame);
  };

  // Effets
  useEffect(() => {
    if (isActive && isModelReady) {
      drawFrame();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, showLabels, showConfidence, isModelReady]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Compter les objets détectés par classe
  const objectCounts: Record<string, number> = {};
  detections.forEach(det => {
    objectCounts[det.class] = (objectCounts[det.class] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-6 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🤖 YOLO - Détection d'objets</h1>
            <p className="text-red-100">Deep Learning • Neural Networks • Temps réel</p>
            <p className="text-sm text-red-200 mt-2">✨ Propulsé par TensorFlow.js + COCO-SSD (MobileNet V2)</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-red-200 mb-1">Objets détectés</div>
            <div className="text-2xl font-bold">{detections.length}</div>
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
                  <div className="text-6xl mb-4">🤖</div>
                  {isModelLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white">Chargement du modèle YOLO...</p>
                      <p className="text-red-300 text-sm">Téléchargement du réseau de neurones (~13 MB)</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-white mb-4">Détection YOLO prête</p>
                      <button
                        onClick={startWebcam}
                        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
                      >
                        ▶ Démarrer la détection
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {error && (
              <div className="absolute top-4 left-4 right-4 bg-red-500/90 text-white px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {isActive && (
              <div className="absolute top-4 right-4 space-y-2">
                <div className="bg-black/70 px-3 py-2 rounded-lg text-white text-xs flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>DÉTECTION ACTIVE</span>
                </div>
                <div className="bg-black/70 px-3 py-2 rounded-lg text-white text-xs">
                  <span>{fps} FPS</span>
                </div>
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

        {/* Contrôles et statistiques */}
        <div className="space-y-4">
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                Afficher les labels
              </label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showConfidence}
                  onChange={(e) => setShowConfidence(e.target.checked)}
                  className="rounded"
                />
                Afficher la confiance (%)
              </label>
            </div>
          </div>

          {/* Objets détectés */}
          {isActive && detections.length > 0 && (
            <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg max-h-64 overflow-y-auto">
              <h3 className="font-bold text-text mb-3 flex items-center gap-2">
                <span className="text-xl">📋</span> Objets détectés
              </h3>
              <div className="space-y-2">
                {Object.entries(objectCounts)
                  .sort((a, b) => b[1] - a[1])
                  .map(([className, count]) => (
                    <div
                      key={className}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded"
                          style={{ backgroundColor: CLASS_COLORS[className] || DEFAULT_COLOR }}
                        ></div>
                        <span className="text-text">{className}</span>
                      </div>
                      <span className="text-text-muted font-bold">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl p-4 border border-red-500/30">
            <h3 className="font-bold text-red-400 mb-2 text-sm">💡 YOLO (You Only Look Once)</h3>
            <ul className="text-xs text-text-muted space-y-2">
              <li>1️⃣ <strong>Single-pass</strong> : Une seule passe dans le réseau</li>
              <li>2️⃣ <strong>Grid division</strong> : Image divisée en grille NxN</li>
              <li>3️⃣ <strong>Bounding boxes</strong> : Prédiction directe des boîtes</li>
              <li>4️⃣ <strong>Classes</strong> : 80 objets du dataset COCO</li>
            </ul>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <h3 className="font-bold text-text mb-2 text-sm">📊 Performance</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Objets:</span>
                <span className="text-red-400 font-bold">{detections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">FPS:</span>
                <span className="text-red-400 font-bold">{fps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Modèle:</span>
                <span className="text-red-400 font-bold">MobileNet V2</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Classes:</span>
                <span className="text-red-400 font-bold">80 (COCO)</span>
              </div>
            </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-red-500 text-lg">⚡</span>
              <div>
                <p className="text-red-300 font-bold text-xs mb-1">Deep Learning en action</p>
                <p className="text-text-muted text-xs">
                  Cette démo utilise un vrai réseau de neurones convolutionnel (CNN) entraîné sur le
                  dataset COCO avec 80 classes d'objets.
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
              <div className="font-bold text-text text-lg">Comprendre YOLO et le Deep Learning</div>
              <div className="text-sm text-text-muted">De la Computer Vision classique aux réseaux de neurones</div>
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
                <div className="bg-red-500/10 border-l-4 border-red-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-red-400 mb-2">📖 Histoire de YOLO</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>YOLO (You Only Look Once)</strong> a été introduit en <strong>2016</strong> par Joseph Redmon.
                    C'était révolutionnaire car il traitait la détection d'objets comme un <strong>problème de régression</strong>
                    plutôt que de classification, permettant des prédictions en temps réel.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>YOLOv1 (2016)</strong> : 45 FPS, première version temps réel</li>
                    <li>• <strong>YOLOv2 (2017)</strong> : Meilleure précision avec Batch Normalization</li>
                    <li>• <strong>YOLOv3 (2018)</strong> : Multi-scale predictions</li>
                    <li>• <strong>YOLOv4-v5 (2020)</strong> : Optimisations majeures</li>
                    <li>• <strong>YOLOv8 (2023)</strong> : Version actuelle, état de l'art</li>
                  </ul>
                </div>

                {/* Architecture */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded">
                  <h3 className="font-bold text-cyan-400 mb-3">🏗️ Comment fonctionne YOLO ?</h3>

                  <div className="space-y-3">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">1️⃣ Division en grille</strong>
                      <p className="text-xs text-text-muted mt-1">
                        L'image est divisée en grille (ex: 13x13). Chaque cellule est responsable de détecter
                        les objets dont le centre tombe dans cette cellule.
                      </p>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">2️⃣ Bounding Box Prediction</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        Chaque cellule prédit plusieurs bounding boxes (B) et leur confiance.
                      </p>
                      <div className="bg-black/30 rounded p-2 font-mono text-xs text-green-400">
                        Prédiction = (x, y, w, h, confidence, class_probs)
                      </div>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">3️⃣ Backbone CNN</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Un réseau convolutionnel (Darknet, ResNet, MobileNet...) extrait les features de l'image.
                        Dans cette démo, on utilise <strong>MobileNet V2</strong> optimisé pour le web.
                      </p>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">4️⃣ Non-Maximum Suppression (NMS)</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Élimine les détections redondantes en ne gardant que la box avec la meilleure confiance
                        pour chaque objet (IoU threshold).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dataset COCO */}
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded">
                  <h3 className="font-bold text-purple-400 mb-2">📚 Dataset COCO</h3>
                  <p className="text-sm text-text-muted mb-2">
                    <strong>COCO (Common Objects in Context)</strong> est le dataset de référence pour la détection d'objets.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>330K images</strong> annotées</li>
                    <li>• <strong>80 classes</strong> d'objets du quotidien</li>
                    <li>• <strong>1.5M instances</strong> d'objets</li>
                    <li>• <strong>5 captions</strong> par image en moyenne</li>
                    <li>• Utilisé pour l'entraînement de la plupart des modèles modernes</li>
                  </ul>
                </div>

                {/* Évolution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">⚡ YOLO vs autres approches</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>R-CNN</strong> : Lent, plusieurs passes (~2 FPS)</li>
                      <li>• <strong>Fast R-CNN</strong> : Plus rapide (~5 FPS)</li>
                      <li>• <strong>Faster R-CNN</strong> : Temps réel (~7 FPS)</li>
                      <li>• <strong>YOLO</strong> : Ultra rapide (45-150 FPS)</li>
                      <li>• <strong>SSD</strong> : Concurrent de YOLO</li>
                    </ul>
                  </div>

                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">🎯 Applications</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Voitures autonomes</strong> : Détection piétons, voitures</li>
                      <li>• <strong>Surveillance</strong> : Détection d'intrusions</li>
                      <li>• <strong>Retail</strong> : Comptage de produits en rayon</li>
                      <li>• <strong>Sport</strong> : Analyse de matchs, tracking joueurs</li>
                      <li>• <strong>Santé</strong> : Détection de tumeurs sur radiographies</li>
                    </ul>
                  </div>
                </div>

                {/* Métriques */}
                <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-blue-400 mb-2">📊 Métriques d'évaluation</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <div>
                      <strong className="text-cyan-400">IoU (Intersection over Union)</strong>
                      <p className="text-xs mt-1">
                        Mesure le chevauchement entre la box prédite et la box réelle. IoU {'>'} 0.5 = bonne détection.
                      </p>
                    </div>
                    <div>
                      <strong className="text-cyan-400">mAP (mean Average Precision)</strong>
                      <p className="text-xs mt-1">
                        Métrique principale combinant précision et rappel sur toutes les classes.
                        mAP@0.5 = précision moyenne avec IoU {'>'} 0.5
                      </p>
                    </div>
                    <div>
                      <strong className="text-cyan-400">FPS (Frames Per Second)</strong>
                      <p className="text-xs mt-1">
                        Vitesse de traitement. YOLOv8 atteint 150+ FPS sur GPU moderne !
                      </p>
                    </div>
                  </div>
                </div>

                {/* Implémentation web */}
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-green-400 mb-2">🌐 YOLO dans le navigateur</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p>
                      Cette démo utilise <strong>COCO-SSD</strong>, une version optimisée de SSD avec MobileNet V2.
                      C'est plus léger que YOLO complet mais utilise les mêmes principes.
                    </p>
                    <p>
                      <strong className="text-cyan-400">Technologies utilisées :</strong><br />
                      • <strong>TensorFlow.js</strong> : Deep Learning dans le navigateur<br />
                      • <strong>WebGL</strong> : Accélération GPU pour les calculs<br />
                      • <strong>COCO-SSD</strong> : Modèle pré-entraîné (~13 MB)<br />
                      • <strong>MobileNet V2</strong> : Backbone CNN optimisé mobile
                    </p>
                  </div>
                </div>

                {/* Licence */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-purple-400 mb-2">🎓 Dans le cursus universitaire</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p>
                      <strong className="text-cyan-400">L3 (Introduction au ML) :</strong> Réseaux de neurones basiques,
                      rétropropagation, fonction de perte, optimisation (SGD, Adam).
                    </p>
                    <p>
                      <strong className="text-blue-400">M1 (Deep Learning) :</strong> CNN, architectures classiques
                      (AlexNet, VGG, ResNet), transfer learning, data augmentation.
                    </p>
                    <p>
                      <strong className="text-purple-400">M2 (Computer Vision avancée) :</strong> Object Detection
                      (YOLO, R-CNN family), segmentation (U-Net, Mask R-CNN), tracking, 3D vision.
                    </p>
                    <p>
                      <strong className="text-green-400">💼 Débouchés :</strong> Computer Vision Engineer (55-90k€),
                      ML Engineer (60-100k€), Research Scientist en IA.
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

export default YoloObjectDetectionDemo;
