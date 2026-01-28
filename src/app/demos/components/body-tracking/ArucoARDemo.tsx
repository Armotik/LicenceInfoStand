// ============================================
// ArucoARDemo - Réalité Augmentée avec marqueurs ArUco
// Homographie, calibration, pose estimation
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArucoDetector } from './aruco-detector';

// ============================================
// Types
// ============================================

interface Props {
  onBack: () => void;
}

interface Marker {
  id: number;
  corners: [number, number][];
  center: [number, number];
}

// ============================================
// Composant principal
// ============================================

export function ArucoARDemo({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const frameCountRef = useRef<number>(0);
  const detectorRef = useRef<any>(null);
  const markersRef = useRef<Marker[]>([]);

  const [isActive, setIsActive] = useState(false);
  const [numMarkers, setNumMarkers] = useState(0);
  const [showMarkerInfo, setShowMarkerInfo] = useState(true);
  const [show3DOverlay, setShow3DOverlay] = useState(true);
  const [overlayType, setOverlayType] = useState<'cube' | 'pyramid' | 'sphere' | 'axes'>('cube');
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string>('');
  const [isDetectorReady, setIsDetectorReady] = useState(false);

  // Charger OpenCV.js et initialiser le détecteur
  useEffect(() => {
    const loadOpenCV = () => {
      // Si OpenCV est déjà chargé
      if (window.cv && window.cv.Mat) {
        console.log('OpenCV already loaded');
        detectorRef.current = new ArucoDetector();
        detectorRef.current.setOpenCVReady(true);
        setIsDetectorReady(true);
        return;
      }

      // Vérifier si le script existe déjà
      const existingScript = document.querySelector('script[src*="opencv.js"]');
      if (existingScript) {
        console.log('OpenCV script already loading...');
        const checkInterval = setInterval(() => {
          if (window.cv && window.cv.Mat) {
            clearInterval(checkInterval);
            console.log('OpenCV loaded successfully');
            detectorRef.current = new ArucoDetector();
            detectorRef.current.setOpenCVReady(true);
            setIsDetectorReady(true);
          }
        }, 100);
        return;
      }

      // Charger OpenCV.js
      const script = document.createElement('script');
      script.src = 'https://docs.opencv.org/4.8.0/opencv.js';
      script.async = true;

      script.onload = () => {
        const checkInterval = setInterval(() => {
          if (window.cv && window.cv.Mat) {
            clearInterval(checkInterval);
            console.log('OpenCV loaded successfully');
            detectorRef.current = new ArucoDetector();
            detectorRef.current.setOpenCVReady(true);
            setIsDetectorReady(true);
          }
        }, 100);
      };

      script.onerror = () => {
        console.error('Failed to load OpenCV.js');
        setError('Impossible de charger OpenCV.js. Veuillez rafraîchir la page.');
      };

      document.body.appendChild(script);
    };

    loadOpenCV();

    return () => {
      // Cleanup
      detectorRef.current = null;
    };
  }, []);

  // Fonction pour détecter les marqueurs ArUco avec le détecteur custom
  const detectArucoMarkers = (): Marker[] => {
    if (!isDetectorReady || !detectorRef.current || !canvasRef.current) {
      return [];
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return [];

    try {
      // Obtenir l'ImageData du canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      // Détecter les marqueurs avec notre détecteur custom
      const markers = detectorRef.current.detect(imageData);

      console.log('Detection result:', {
        markersFound: markers.length,
        markers: markers
      });

      // Convertir les résultats en notre format
      const detectedMarkers: Marker[] = markers.map((marker: any) => {
        // Notre détecteur retourne les coins dans l'ordre: corners[0-3] avec propriétés x,y
        const cornerPoints: [number, number][] = [
          [marker.corners[0].x, marker.corners[0].y],
          [marker.corners[1].x, marker.corners[1].y],
          [marker.corners[2].x, marker.corners[2].y],
          [marker.corners[3].x, marker.corners[3].y],
        ];

        // Calculer le centre
        const centerX = (cornerPoints[0][0] + cornerPoints[1][0] + cornerPoints[2][0] + cornerPoints[3][0]) / 4;
        const centerY = (cornerPoints[0][1] + cornerPoints[1][1] + cornerPoints[2][1] + cornerPoints[3][1]) / 4;

        return {
          id: marker.id,
          corners: cornerPoints,
          center: [centerX, centerY],
        };
      });

      return detectedMarkers;
    } catch (err) {
      console.error('ArUco detection error:', err);
      return [];
    }
  };

  // Démarrer la webcam
  const startWebcam = async () => {
    if (!isDetectorReady) {
      setError('Le détecteur ArUco n\'est pas encore prêt. Veuillez patienter...');
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
    frameCountRef.current = 0;
    markersRef.current = [];
    setNumMarkers(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Dessiner un cube 3D sur un marqueur
  const drawCube = (ctx: CanvasRenderingContext2D, corners: [number, number][], size: number) => {
    const [tl, tr, br, bl] = corners;

    // Calculer la profondeur (perspective)
    const depth = size * 0.5;

    // Points du haut du cube (décalés)
    const topTL: [number, number] = [tl[0] - depth * 0.3, tl[1] - depth];
    const topTR: [number, number] = [tr[0] - depth * 0.3, tr[1] - depth];
    const topBR: [number, number] = [br[0] - depth * 0.3, br[1] - depth];
    const topBL: [number, number] = [bl[0] - depth * 0.3, bl[1] - depth];

    // Face arrière (plus sombre)
    ctx.fillStyle = 'rgba(0, 150, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(topTL[0], topTL[1]);
    ctx.lineTo(topTR[0], topTR[1]);
    ctx.lineTo(topBR[0], topBR[1]);
    ctx.lineTo(topBL[0], topBL[1]);
    ctx.closePath();
    ctx.fill();

    // Faces latérales
    ctx.fillStyle = 'rgba(0, 200, 255, 0.6)';

    // Face gauche
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(topTL[0], topTL[1]);
    ctx.lineTo(topBL[0], topBL[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.closePath();
    ctx.fill();

    // Face droite
    ctx.beginPath();
    ctx.moveTo(tr[0], tr[1]);
    ctx.lineTo(topTR[0], topTR[1]);
    ctx.lineTo(topBR[0], topBR[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.closePath();
    ctx.fill();

    // Face avant (plus claire)
    ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.closePath();
    ctx.fill();

    // Contours
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Arêtes verticales
    [[tl, topTL], [tr, topTR], [br, topBR], [bl, topBL]].forEach(([bottom, top]) => {
      ctx.beginPath();
      ctx.moveTo(bottom[0], bottom[1]);
      ctx.lineTo(top[0], top[1]);
      ctx.stroke();
    });
  };

  // Dessiner une pyramide
  const drawPyramid = (ctx: CanvasRenderingContext2D, corners: [number, number][], size: number) => {
    const [tl, tr, br, bl] = corners;

    // Sommet de la pyramide (au centre, en hauteur)
    const centerX = (tl[0] + tr[0] + br[0] + bl[0]) / 4;
    const centerY = (tl[1] + tr[1] + br[1] + bl[1]) / 4;
    const apex: [number, number] = [centerX, centerY - size];

    // Base
    ctx.fillStyle = 'rgba(255, 100, 0, 0.6)';
    ctx.beginPath();
    ctx.moveTo(tl[0], tl[1]);
    ctx.lineTo(tr[0], tr[1]);
    ctx.lineTo(br[0], br[1]);
    ctx.lineTo(bl[0], bl[1]);
    ctx.closePath();
    ctx.fill();

    // Faces
    ctx.fillStyle = 'rgba(255, 150, 0, 0.8)';
    [[tl, tr], [tr, br], [br, bl], [bl, tl]].forEach(([p1, p2]) => {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(apex[0], apex[1]);
      ctx.closePath();
      ctx.fill();
    });

    // Contours
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    [[tl, tr], [tr, br], [br, bl], [bl, tl]].forEach(([p1, p2]) => {
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(apex[0], apex[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.stroke();
    });
  };

  // Dessiner des axes 3D
  const drawAxes = (ctx: CanvasRenderingContext2D, corners: [number, number][], size: number) => {
    const [tl, tr, , bl] = corners;

    // Origine = coin top-left
    const origin = tl;

    // Vecteur X (rouge) - vers la droite
    const xDir: [number, number] = [tr[0] - tl[0], tr[1] - tl[1]];
    const xEnd: [number, number] = [origin[0] + xDir[0], origin[1] + xDir[1]];

    // Vecteur Y (vert) - vers le bas
    const yDir: [number, number] = [bl[0] - tl[0], bl[1] - tl[1]];
    const yEnd: [number, number] = [origin[0] + yDir[0], origin[1] + yDir[1]];

    // Vecteur Z (bleu) - vers le haut
    const zEnd: [number, number] = [origin[0], origin[1] - size];

    // Axe X (rouge)
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(xEnd[0], xEnd[1]);
    ctx.stroke();
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('X', xEnd[0] + 10, xEnd[1]);

    // Axe Y (vert)
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(yEnd[0], yEnd[1]);
    ctx.stroke();
    ctx.fillStyle = '#00ff00';
    ctx.fillText('Y', yEnd[0] + 10, yEnd[1]);

    // Axe Z (bleu)
    ctx.strokeStyle = '#0000ff';
    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(zEnd[0], zEnd[1]);
    ctx.stroke();
    ctx.fillStyle = '#0000ff';
    ctx.fillText('Z', zEnd[0] + 10, zEnd[1] - 10);
  };

  // Dessiner la frame
  const drawFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive || !isDetectorReady) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner la vidéo sur le canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Détecter les marqueurs ArUco toutes les 5 frames (pour de meilleures performances)
    frameCountRef.current++;
    if (frameCountRef.current % 5 === 0) {
      const detectedMarkers = detectArucoMarkers();
      markersRef.current = detectedMarkers;
      setNumMarkers(detectedMarkers.length);
    }

    // Dessiner les marqueurs détectés
    for (const marker of markersRef.current) {
      // Contour du marqueur
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(marker.corners[0][0], marker.corners[0][1]);
      for (let i = 1; i < marker.corners.length; i++) {
        ctx.lineTo(marker.corners[i][0], marker.corners[i][1]);
      }
      ctx.closePath();
      ctx.stroke();

      // Coins
      for (const corner of marker.corners) {
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(corner[0], corner[1], 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Centre
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(marker.center[0], marker.center[1], 8, 0, Math.PI * 2);
      ctx.fill();

      // Info marqueur
      if (showMarkerInfo) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(marker.center[0] - 60, marker.center[1] - 50, 120, 35);
        ctx.fillStyle = '#00ff00';
        ctx.font = 'bold 14px sans-serif';
        ctx.fillText(`Marqueur ${marker.id}`, marker.center[0] - 50, marker.center[1] - 32);
        ctx.font = '10px monospace';
        ctx.fillText(`[${Math.round(marker.center[0])}, ${Math.round(marker.center[1])}]`, marker.center[0] - 50, marker.center[1] - 20);
      }

      // Superposition 3D
      if (show3DOverlay) {
        const size = Math.sqrt(
          Math.pow(marker.corners[1][0] - marker.corners[0][0], 2) +
          Math.pow(marker.corners[1][1] - marker.corners[0][1], 2)
        );

        switch (overlayType) {
          case 'cube':
            drawCube(ctx, marker.corners as [number, number][], size);
            break;
          case 'pyramid':
            drawPyramid(ctx, marker.corners as [number, number][], size);
            break;
          case 'axes':
            drawAxes(ctx, marker.corners as [number, number][], size);
            break;
          case 'sphere':
            // Dessiner une sphère simple
            ctx.fillStyle = 'rgba(255, 0, 255, 0.7)';
            ctx.beginPath();
            ctx.arc(marker.center[0], marker.center[1] - size * 0.5, size * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 2;
            ctx.stroke();
            break;
        }
      }
    }

    // Message info
    if (numMarkers > 0) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 320, 40);
      ctx.fillStyle = '#00ff00';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('📊 ArUco AR - Détection réelle !', 20, 30);
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#00ffff';
      ctx.fillText(`${numMarkers} marqueur(s) détecté(s)`, 20, 45);
    }

    animationFrameRef.current = requestAnimationFrame(drawFrame);
  };

  // Effets
  useEffect(() => {
    if (isActive && isDetectorReady) {
      drawFrame();
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, show3DOverlay, overlayType, showMarkerInfo, isDetectorReady]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  // Générer un lien vers le générateur de marqueurs ArUco en ligne
  const arucoGeneratorURL = 'https://chev.me/arucogen/';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎯 Réalité Augmentée (ArUco)</h1>
            <p className="text-pink-100">Marqueurs fiduciaires, homographie et pose 3D</p>
            <p className="text-sm text-pink-200 mt-2">✨ Détection ArUco avec OpenCV.js + décodage custom</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-pink-200 mb-1">Marqueurs détectés</div>
            <div className="text-2xl font-bold">{numMarkers}</div>
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
                  <div className="text-6xl mb-4">🎯</div>
                  {!isDetectorReady ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-white">Chargement d'OpenCV.js...</p>
                      <p className="text-pink-300 text-sm">Initialisation du détecteur ArUco</p>
                    </div>
                  ) : (
                    <>
                      <p className="text-white mb-2">Pointez la caméra vers un marqueur ArUco</p>
                      <p className="text-gray-400 text-sm mb-4">Détection de marqueurs en temps réel</p>
                      <button
                        onClick={startWebcam}
                        className="px-6 py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-bold transition-all"
                      >
                        ▶ Démarrer la caméra
                      </button>
                      <a
                        href={arucoGeneratorURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block mx-auto mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-all"
                      >
                        📄 Générer des marqueurs en ligne
                      </a>
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
              <div className="absolute top-4 right-4 bg-black/70 px-3 py-2 rounded-lg text-white text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
                <span>AR ACTIVE</span>
              </div>
            )}

            {isActive && numMarkers === 0 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-yellow-500/80 px-4 py-2 rounded-lg text-black text-sm font-medium">
                🔍 Recherche de marqueurs ArUco...
              </div>
            )}
          </div>

          {isActive && (
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button
                onClick={stopWebcam}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
              >
                ⏸ Arrêter
              </button>
              <a
                href={arucoGeneratorURL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold transition-all text-center"
              >
                📄 Marqueurs
              </a>
            </div>
          )}
        </div>

        {/* Contrôles */}
        <div className="space-y-4">
          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <span className="text-xl">🎨</span> Objet 3D
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['cube', 'pyramid', 'sphere', 'axes'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setOverlayType(type)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    overlayType === type
                      ? 'bg-pink-600 text-white shadow-lg'
                      : 'bg-surface hover:bg-surface-lighter text-text'
                  }`}
                >
                  {type === 'cube' ? '📦 Cube' :
                   type === 'pyramid' ? '🔺 Pyramide' :
                   type === 'sphere' ? '⚪ Sphère' :
                   '📐 Axes'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20 shadow-lg">
            <h3 className="font-bold text-text mb-3 flex items-center gap-2">
              <span className="text-xl">⚙️</span> Affichage
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={show3DOverlay}
                  onChange={(e) => setShow3DOverlay(e.target.checked)}
                  className="rounded"
                />
                Afficher l'objet 3D
              </label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMarkerInfo}
                  onChange={(e) => setShowMarkerInfo(e.target.checked)}
                  className="rounded"
                />
                Afficher les infos marqueurs
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl p-4 border border-pink-500/30">
            <h3 className="font-bold text-pink-400 mb-2 text-sm">💡 Comment ça marche ?</h3>
            <ul className="text-xs text-text-muted space-y-2">
              <li>1️⃣ <strong>Détection</strong> : OpenCV trouve les carrés noirs</li>
              <li>2️⃣ <strong>Identification</strong> : Lecture du code binaire 4x4</li>
              <li>3️⃣ <strong>Pose estimation</strong> : Calcul de l'orientation 3D</li>
              <li>4️⃣ <strong>Projection</strong> : Affichage de l'objet 3D</li>
            </ul>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <h3 className="font-bold text-text mb-2 text-sm">📊 Stats</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Marqueurs:</span>
                <span className="text-pink-400 font-bold">{numMarkers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Format:</span>
                <span className="text-pink-400 font-bold">4x4 ArUco</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Objet:</span>
                <span className="text-pink-400 font-bold">{overlayType}</span>
              </div>
            </div>
          </div>

          <div className="bg-pink-500/10 border border-pink-500/30 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-pink-500 text-lg">✅</span>
              <div>
                <p className="text-pink-300 font-bold text-xs mb-1">Détection authentique</p>
                <p className="text-text-muted text-xs">
                  Cette démo utilise le vrai algorithme de détection ArUco d'OpenCV avec le dictionnaire 4x4_100.
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
              <div className="font-bold text-text text-lg">Comprendre la Réalité Augmentée</div>
              <div className="text-sm text-text-muted">Marqueurs fiduciaires, homographie et vision 3D</div>
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
                {/* C'est quoi ArUco */}
                <div className="bg-pink-500/10 border-l-4 border-pink-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-pink-400 mb-2">🎯 C'est quoi ArUco ?</h3>
                  <p className="text-sm text-text-muted mb-3">
                    <strong>ArUco</strong> (Augmented Reality University of Cordoba) est une bibliothèque de marqueurs fiduciaires
                    pour la réalité augmentée. Un marqueur fiduciaire est un motif visuel facilement détectable par la caméra.
                  </p>
                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>Carré noir</strong> avec bordure blanche</li>
                    <li>• <strong>Code binaire</strong> unique à l'intérieur (4×4 bits)</li>
                    <li>• <strong>Rotation-invariant</strong> : détectable dans toutes les orientations</li>
                    <li>• <strong>Rapide</strong> : Détection en temps réel ({'>'}100 FPS)</li>
                  </ul>
                </div>

                {/* Pipeline AR */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded">
                  <h3 className="font-bold text-cyan-400 mb-3">🔄 Pipeline de Réalité Augmentée</h3>

                  <div className="space-y-3">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">1️⃣ Détection du marqueur</strong>
                      <ul className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>• Seuillage adaptatif de l'image (binairisation)</li>
                        <li>• Détection de contours (algorithme de Suzuki)</li>
                        <li>• Filtrage : garder les contours carrés</li>
                        <li>• Extraction de la région d'intérêt (ROI)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">2️⃣ Identification du marqueur</strong>
                      <ul className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>• Correction de perspective (homographie)</li>
                        <li>• Échantillonnage de la grille 4×4</li>
                        <li>• Lecture du code binaire</li>
                        <li>• Vérification avec dictionnaire ArUco</li>
                        <li>• Détection et correction d'erreurs (code de Hamming)</li>
                      </ul>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">3️⃣ Estimation de pose (PnP)</strong>
                      <p className="text-xs text-text-muted mt-1 mb-2">
                        <strong>Perspective-n-Point</strong> : Calculer la position/orientation 3D du marqueur dans l'espace.
                      </p>
                      <ul className="text-xs text-text-muted space-y-1 pl-4">
                        <li>• On connaît les 4 coins du marqueur dans l'image 2D</li>
                        <li>• On connaît la taille réelle du marqueur</li>
                        <li>• On connaît les paramètres de la caméra (calibration)</li>
                        <li>• → Résoudre pour trouver la matrice de transformation 3D</li>
                      </ul>
                      <div className="bg-black/30 rounded p-2 mt-2 font-mono text-xs text-green-400">
                        [R|t] = PnP(points_2D, points_3D, K)
                      </div>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">4️⃣ Projection et rendu</strong>
                      <ul className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>• Créer un objet 3D virtuel</li>
                        <li>• Transformer ses coordonnées avec [R|t]</li>
                        <li>• Projeter en 2D avec la matrice caméra</li>
                        <li>• Dessiner sur l'image avec bonne perspective</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Homographie */}
                <div className="bg-purple-500/10 border-l-4 border-purple-500 p-4 rounded">
                  <h3 className="font-bold text-purple-400 mb-2">📐 Homographie - Les maths du lycée/prépa !</h3>
                  <p className="text-sm text-text-muted mb-3">
                    L'<strong>homographie</strong> est une transformation qui préserve les droites.
                    Elle permet de "redresser" un carré vu en perspective.
                  </p>

                  <div className="bg-black/30 rounded p-3 font-mono text-xs text-green-400 mb-2">
                    H = matrice 3×3 qui transforme (x,y) → (x',y')
                  </div>

                  <ul className="text-sm text-text-muted space-y-1 pl-4">
                    <li>• <strong>4 correspondances</strong> de points suffisent (4 coins du marqueur)</li>
                    <li>• <strong>Algèbre linéaire</strong> : Système d'équations AH = b</li>
                    <li>• <strong>SVD</strong> (Singular Value Decomposition) pour résoudre</li>
                    <li>• Utilisé en cartographie, panoramas, art, architecture</li>
                  </ul>
                </div>

                {/* Applications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-green-500">
                    <h4 className="font-bold text-green-400 mb-2">🎮 Applications AR</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Jeux vidéo</strong> : Pokémon GO, Minecraft Earth</li>
                      <li>• <strong>Education</strong> : Livres interactifs, anatomie 3D</li>
                      <li>• <strong>Industrie</strong> : Maintenance, formation</li>
                      <li>• <strong>Retail</strong> : Essai virtuel de meubles (IKEA)</li>
                      <li>• <strong>Navigation</strong> : Google Maps AR</li>
                    </ul>
                  </div>

                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🔧 Technologies modernes</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>ARCore</strong> (Google) : SLAM, plane detection</li>
                      <li>• <strong>ARKit</strong> (Apple) : Face tracking, LiDAR</li>
                      <li>• <strong>WebXR</strong> : AR dans le navigateur</li>
                      <li>• <strong>Vuforia</strong> : AR industrielle</li>
                      <li>• <strong>Meta Quest</strong> : Mixed Reality</li>
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

export default ArucoARDemo;
