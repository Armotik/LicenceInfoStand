// ============================================
// FacialLandmarksDemo - Détection de points du visage + Delaunay
// Lien avec les maths du lycée : géométrie, triangles
// ============================================

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// Types
// ============================================

interface Point {
  x: number;
  y: number;
}

interface Triangle {
  a: Point;
  b: Point;
  c: Point;
}

interface Props {
  onBack: () => void;
}

// ============================================
// Algorithme de Delaunay (Bowyer-Watson simplifié)
// ============================================

function circumcircle(a: Point, b: Point, c: Point): { center: Point; radius: number } {
  const ax = a.x;
  const ay = a.y;
  const bx = b.x;
  const by = b.y;
  const cx = c.x;
  const cy = c.y;

  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
  if (Math.abs(d) < 1e-10) {
    return { center: { x: 0, y: 0 }, radius: Infinity };
  }

  const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
  const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;

  const center = { x: ux, y: uy };
  const radius = Math.sqrt((ax - ux) ** 2 + (ay - uy) ** 2);

  return { center, radius };
}

function delaunayTriangulation(points: Point[]): Triangle[] {
  if (points.length < 3) return [];

  // Super-triangle englobant tous les points
  const minX = Math.min(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxX = Math.max(...points.map(p => p.x));
  const maxY = Math.max(...points.map(p => p.y));

  const dx = maxX - minX;
  const dy = maxY - minY;
  const deltaMax = Math.max(dx, dy);
  const midX = (minX + maxX) / 2;
  const midY = (minY + maxY) / 2;

  const p1 = { x: midX - 20 * deltaMax, y: midY - deltaMax };
  const p2 = { x: midX, y: midY + 20 * deltaMax };
  const p3 = { x: midX + 20 * deltaMax, y: midY - deltaMax };

  let triangles: Triangle[] = [{ a: p1, b: p2, c: p3 }];

  // Ajouter chaque point
  for (const point of points) {
    const badTriangles: Triangle[] = [];

    // Trouver les triangles invalides
    for (const triangle of triangles) {
      const { center, radius } = circumcircle(triangle.a, triangle.b, triangle.c);
      const dist = Math.sqrt((point.x - center.x) ** 2 + (point.y - center.y) ** 2);
      if (dist < radius) {
        badTriangles.push(triangle);
      }
    }

    // Trouver les arêtes du polygone
    const polygon: [Point, Point][] = [];
    for (const triangle of badTriangles) {
      const edges: [Point, Point][] = [
        [triangle.a, triangle.b],
        [triangle.b, triangle.c],
        [triangle.c, triangle.a],
      ];

      for (const edge of edges) {
        let shared = false;
        for (const other of badTriangles) {
          if (other === triangle) continue;
          const otherEdges: [Point, Point][] = [
            [other.a, other.b],
            [other.b, other.c],
            [other.c, other.a],
          ];
          for (const otherEdge of otherEdges) {
            if (
              (edge[0] === otherEdge[0] && edge[1] === otherEdge[1]) ||
              (edge[0] === otherEdge[1] && edge[1] === otherEdge[0])
            ) {
              shared = true;
              break;
            }
          }
          if (shared) break;
        }
        if (!shared) {
          polygon.push(edge);
        }
      }
    }

    // Retirer les mauvais triangles
    triangles = triangles.filter(t => !badTriangles.includes(t));

    // Créer de nouveaux triangles
    for (const edge of polygon) {
      triangles.push({ a: edge[0], b: edge[1], c: point });
    }
  }

  // Retirer les triangles qui partagent un sommet avec le super-triangle
  triangles = triangles.filter(
    t =>
      t.a !== p1 && t.a !== p2 && t.a !== p3 &&
      t.b !== p1 && t.b !== p2 && t.b !== p3 &&
      t.c !== p1 && t.c !== p2 && t.c !== p3
  );

  return triangles;
}

// ============================================
// Composant principal
// ============================================

export function FacialLandmarksDemo({ onBack }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const [isActive, setIsActive] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showTriangulation, setShowTriangulation] = useState(true);
  const [showCircumcircles, setShowCircumcircles] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [error, setError] = useState<string>('');

  // Points de landmarks simplifiés (simulés pour la démo)
  const faceLandmarks: Point[] = [
    // Contour du visage (17 points)
    { x: 0.1, y: 0.3 }, { x: 0.12, y: 0.4 }, { x: 0.13, y: 0.5 }, { x: 0.15, y: 0.6 },
    { x: 0.2, y: 0.7 }, { x: 0.3, y: 0.78 }, { x: 0.4, y: 0.82 }, { x: 0.5, y: 0.85 },
    { x: 0.6, y: 0.82 }, { x: 0.7, y: 0.78 }, { x: 0.8, y: 0.7 }, { x: 0.85, y: 0.6 },
    { x: 0.87, y: 0.5 }, { x: 0.88, y: 0.4 }, { x: 0.9, y: 0.3 },
    // Sourcils (10 points)
    { x: 0.25, y: 0.35 }, { x: 0.3, y: 0.33 }, { x: 0.35, y: 0.32 }, { x: 0.4, y: 0.33 }, { x: 0.43, y: 0.35 },
    { x: 0.57, y: 0.35 }, { x: 0.6, y: 0.33 }, { x: 0.65, y: 0.32 }, { x: 0.7, y: 0.33 }, { x: 0.75, y: 0.35 },
    // Yeux (12 points)
    { x: 0.3, y: 0.42 }, { x: 0.35, y: 0.41 }, { x: 0.4, y: 0.42 }, { x: 0.35, y: 0.44 },
    { x: 0.6, y: 0.42 }, { x: 0.65, y: 0.41 }, { x: 0.7, y: 0.42 }, { x: 0.65, y: 0.44 },
    // Nez (9 points)
    { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.48 }, { x: 0.5, y: 0.56 },
    { x: 0.43, y: 0.58 }, { x: 0.47, y: 0.59 }, { x: 0.5, y: 0.6 }, { x: 0.53, y: 0.59 }, { x: 0.57, y: 0.58 },
    // Bouche (20 points)
    { x: 0.35, y: 0.68 }, { x: 0.38, y: 0.67 }, { x: 0.42, y: 0.66 }, { x: 0.46, y: 0.66 }, { x: 0.5, y: 0.67 },
    { x: 0.54, y: 0.66 }, { x: 0.58, y: 0.66 }, { x: 0.62, y: 0.67 }, { x: 0.65, y: 0.68 },
    { x: 0.62, y: 0.7 }, { x: 0.58, y: 0.71 }, { x: 0.54, y: 0.72 }, { x: 0.5, y: 0.72 },
    { x: 0.46, y: 0.72 }, { x: 0.42, y: 0.71 }, { x: 0.38, y: 0.7 },
  ];

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

  // Dessiner la frame
  const drawFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !isActive) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dessiner la vidéo
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir les landmarks en coordonnées canvas
    const points = faceLandmarks.map(p => ({
      x: p.x * canvas.width,
      y: p.y * canvas.height,
    }));

    // Triangulation de Delaunay
    let triangles: Triangle[] = [];
    if (showTriangulation) {
      triangles = delaunayTriangulation(points);
    }

    // Dessiner la triangulation
    if (showTriangulation && triangles.length > 0) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      for (const triangle of triangles) {
        ctx.beginPath();
        ctx.moveTo(triangle.a.x, triangle.a.y);
        ctx.lineTo(triangle.b.x, triangle.b.y);
        ctx.lineTo(triangle.c.x, triangle.c.y);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Dessiner les cercles circonscrits
    if (showCircumcircles && triangles.length > 0) {
      ctx.strokeStyle = 'rgba(255, 0, 255, 0.3)';
      ctx.lineWidth = 1;
      for (const triangle of triangles) {
        const { center, radius } = circumcircle(triangle.a, triangle.b, triangle.c);
        if (radius < 1000) {
          ctx.beginPath();
          ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // Dessiner les landmarks
    if (showLandmarks) {
      for (const point of points) {
        ctx.fillStyle = '#00ff00';
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Halo
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.stroke();
      }
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
  }, [isActive, showLandmarks, showTriangulation, showCircumcircles]);

  useEffect(() => {
    return () => {
      stopWebcam();
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
        <button
          onClick={onBack}
          className="mb-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-all flex items-center gap-2"
        >
          ← Retour
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">👤 Facial Landmarks + Triangulation de Delaunay</h1>
            <p className="text-cyan-100">Géométrie du lycée appliquée à la Computer Vision</p>
          </div>
          <div className="text-right bg-white/10 rounded-xl px-4 py-2">
            <div className="text-xs text-cyan-200 mb-1">Points détectés</div>
            <div className="text-2xl font-bold">{faceLandmarks.length}</div>
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
                  <div className="text-6xl mb-4">📷</div>
                  <p className="text-white mb-4">La webcam n'est pas active</p>
                  <button
                    onClick={startWebcam}
                    className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-bold transition-all"
                  >
                    ▶ Démarrer la webcam
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
                <span>EN DIRECT</span>
              </div>
            )}
          </div>

          {isActive && (
            <button
              onClick={stopWebcam}
              className="w-full mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition-all"
            >
              ⏸ Arrêter la webcam
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
                  checked={showLandmarks}
                  onChange={(e) => setShowLandmarks(e.target.checked)}
                  className="rounded"
                />
                Afficher les points (landmarks)
              </label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTriangulation}
                  onChange={(e) => setShowTriangulation(e.target.checked)}
                  className="rounded"
                />
                Afficher la triangulation
              </label>
              <label className="flex items-center gap-2 text-sm text-text cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCircumcircles}
                  onChange={(e) => setShowCircumcircles(e.target.checked)}
                  className="rounded"
                />
                Afficher les cercles circonscrits
              </label>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-4 border border-cyan-500/30">
            <h3 className="font-bold text-cyan-400 mb-2 text-sm">💡 Comment ça marche ?</h3>
            <ul className="text-xs text-text-muted space-y-2">
              <li>1️⃣ Détection de <strong>{faceLandmarks.length} points</strong> sur le visage</li>
              <li>2️⃣ <strong>Triangulation de Delaunay</strong> : divise le visage en triangles optimaux</li>
              <li>3️⃣ Chaque triangle a un <strong>cercle circonscrit</strong> qui ne contient aucun autre point</li>
              <li>4️⃣ Utilisé pour le <strong>maillage 3D</strong>, l'animation faciale, et les filtres AR</li>
            </ul>
          </div>

          <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
            <h3 className="font-bold text-text mb-2 text-sm">📊 Statistiques</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-muted">Points détectés:</span>
                <span className="text-cyan-400 font-bold">{faceLandmarks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Triangles:</span>
                <span className="text-cyan-400 font-bold">{showTriangulation ? `~${faceLandmarks.length * 2}` : '0'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Résolution:</span>
                <span className="text-cyan-400 font-bold">640×480</span>
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
            <span className="text-3xl">📐</span>
            <div className="text-left">
              <div className="font-bold text-text text-lg">Les maths du lycée en action !</div>
              <div className="text-sm text-text-muted">Triangulation de Delaunay expliquée</div>
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
                {/* Lien avec le lycée */}
                <div className="bg-green-500/10 border-l-4 border-green-500 p-4 rounded mt-4">
                  <h3 className="font-bold text-green-400 mb-3">🎓 Les maths du lycée qu'on utilise ici</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div>
                        <strong className="text-green-300">📍 Géométrie du plan (Seconde)</strong>
                        <ul className="text-text-muted pl-4 mt-1 space-y-1">
                          <li>• Coordonnées de points</li>
                          <li>• Distance entre deux points</li>
                          <li>• Milieu d'un segment</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-green-300">△ Triangles (Seconde/Première)</strong>
                        <ul className="text-text-muted pl-4 mt-1 space-y-1">
                          <li>• Propriétés des triangles</li>
                          <li>• Cercle circonscrit</li>
                          <li>• Théorème de Pythagore</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <strong className="text-green-300">⭕ Cercles (Première)</strong>
                        <ul className="text-text-muted pl-4 mt-1 space-y-1">
                          <li>• Équation d'un cercle</li>
                          <li>• Centre et rayon</li>
                          <li>• Point à l'intérieur d'un cercle</li>
                        </ul>
                      </div>
                      <div>
                        <strong className="text-green-300">🔢 Algorithmes (NSI)</strong>
                        <ul className="text-text-muted pl-4 mt-1 space-y-1">
                          <li>• Boucles et itérations</li>
                          <li>• Structures de données</li>
                          <li>• Complexité algorithmique</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Algorithme de Delaunay */}
                <div className="bg-cyan-500/10 border-l-4 border-cyan-500 p-4 rounded">
                  <h3 className="font-bold text-cyan-400 mb-2">🎯 Triangulation de Delaunay - Comment ça marche ?</h3>
                  <p className="text-sm text-text-muted mb-3">
                    La triangulation de Delaunay est une méthode pour diviser un ensemble de points en triangles de manière optimale.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">🔷 Propriété principale</strong>
                      <p className="text-xs text-text-muted mt-1">
                        Pour chaque triangle, son <strong>cercle circonscrit</strong> (le cercle qui passe par ses 3 sommets)
                        ne contient <strong>aucun autre point</strong> de l'ensemble. C'est la condition de Delaunay !
                      </p>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">🔄 Algorithme (Bowyer-Watson)</strong>
                      <ol className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>1. Créer un grand triangle qui englobe tous les points</li>
                        <li>2. Pour chaque nouveau point:
                          <ul className="pl-4 mt-1">
                            <li>• Trouver tous les triangles dont le cercle circonscrit contient ce point</li>
                            <li>• Supprimer ces triangles "invalides"</li>
                            <li>• Reconnecter les arêtes avec le nouveau point</li>
                          </ul>
                        </li>
                        <li>3. Supprimer le triangle initial</li>
                      </ol>
                    </div>

                    <div className="bg-surface/50 rounded p-3">
                      <strong className="text-cyan-300 text-sm">✨ Pourquoi c'est optimal ?</strong>
                      <ul className="text-xs text-text-muted mt-1 space-y-1 pl-4">
                        <li>• <strong>Maximise l'angle minimum</strong> : Évite les triangles "aplatis"</li>
                        <li>• <strong>Unique</strong> : Pour un ensemble de points, il n'y a qu'une seule triangulation de Delaunay</li>
                        <li>• <strong>Efficace</strong> : Complexité O(n log n)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Applications */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="bg-surface rounded-lg p-4 border-l-4 border-purple-500">
                    <h4 className="font-bold text-purple-400 mb-2">🎭 Applications en Computer Vision</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Filtres Snapchat/Instagram</strong> : Maquillage virtuel</li>
                      <li>• <strong>Animation faciale</strong> : Cinéma, jeux vidéo</li>
                      <li>• <strong>Morphing</strong> : Transformation de visages</li>
                      <li>• <strong>Reconnaissance</strong> : Authentification biométrique</li>
                      <li>• <strong>Analyse d'émotions</strong> : IA émotionnelle</li>
                    </ul>
                  </div>

                  <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                    <h4 className="font-bold text-orange-400 mb-2">🌍 Autres domaines</h4>
                    <ul className="text-sm text-text-muted space-y-1">
                      <li>• <strong>Cartographie</strong> : Modèles de terrain (TIN)</li>
                      <li>• <strong>Météo</strong> : Interpolation de données</li>
                      <li>• <strong>Simulation physique</strong> : Maillages FEM</li>
                      <li>• <strong>Jeux vidéo</strong> : Génération de terrain</li>
                      <li>• <strong>Robotique</strong> : Navigation et SLAM</li>
                    </ul>
                  </div>
                </div>

                {/* Code simplifié */}
                <div className="bg-surface/50 rounded-xl p-4 border border-cyan-500/30">
                  <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2">
                    <span>💻</span> Algorithme simplifié (pseudo-code)
                  </h4>
                  <pre className="text-xs text-text-muted font-mono bg-black/30 p-3 rounded overflow-x-auto">
{`function triangulationDelaunay(points):
    triangles = [super_triangle]  // Triangle englobant

    for each point in points:
        mauvais_triangles = []

        for each triangle in triangles:
            if point_dans_cercle_circonscrit(point, triangle):
                mauvais_triangles.add(triangle)

        // Trouver les arêtes du polygone
        aretes = trouver_aretes_polygone(mauvais_triangles)

        // Retirer les mauvais triangles
        triangles.remove(mauvais_triangles)

        // Créer de nouveaux triangles
        for each arete in aretes:
            triangles.add(Triangle(arete.a, arete.b, point))

    return triangles`}
                  </pre>
                </div>

                {/* Licence */}
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl p-4">
                  <h4 className="font-bold text-cyan-400 mb-2">🎓 Parcours en Licence</h4>
                  <div className="space-y-2 text-sm text-text-muted">
                    <p>
                      <strong className="text-blue-400">L1 (Mathématiques) :</strong> Géométrie analytique, algèbre linéaire,
                      calcul matriciel - les bases pour comprendre les transformations géométriques.
                    </p>
                    <p>
                      <strong className="text-purple-400">L2 (Algorithmique) :</strong> Structures de données avancées,
                      algorithmes géométriques (Delaunay, Voronoi), analyse de complexité.
                    </p>
                    <p>
                      <strong className="text-pink-400">L3 (Computer Vision) :</strong> Détection de points d'intérêt,
                      reconstruction 3D, maillages, traitement d'image temps réel.
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

export default FacialLandmarksDemo;
