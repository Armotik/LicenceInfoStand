// ============================================
// BodyTrackingVisualizer - Suite complète de Computer Vision
// Le projet le plus avancé : Computer Vision et IA
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FacialLandmarksDemo } from './body-tracking/FacialLandmarksDemo';
import { MotionDetectionDemo } from './body-tracking/MotionDetectionDemo';
import { FaceDetectionDemo } from './body-tracking/FaceDetectionDemo';
import { ArucoARDemo } from './body-tracking/ArucoARDemo';
import { YoloObjectDetectionDemo } from './body-tracking/YoloObjectDetectionDemo';

// ============================================
// Types
// ============================================

type DemoMode = 'overview' | 'facial-landmarks' | 'motion-detection' | 'face-detection' | 'aruco-ar' | 'yolo';

interface DemoInfo {
  id: DemoMode;
  name: string;
  description: string;
  icon: string;
  difficulty: 'L1' | 'L2' | 'L3' | 'Master';
  topics: string[];
  available: boolean;
}

// ============================================
// Configuration des démos
// ============================================

const DEMOS: DemoInfo[] = [
  {
    id: 'facial-landmarks',
    name: 'Facial Landmarks + Delaunay',
    description: 'Détection de 68 points du visage avec triangulation de Delaunay',
    icon: '👤',
    difficulty: 'L2',
    topics: ['Géométrie', 'Triangulation', 'Computer Vision'],
    available: true,
  },
  {
    id: 'motion-detection',
    name: 'Détection de mouvement',
    description: 'Suppression du fond par histogramme et intervalles stables',
    icon: '🎥',
    difficulty: 'L2',
    topics: ['Histogrammes', 'Statistiques', 'Traitement d\'image'],
    available: true,
  },
  {
    id: 'face-detection',
    name: 'Détection de visage (Viola-Jones)',
    description: 'Algorithme classique de détection temps réel',
    icon: '😊',
    difficulty: 'L3',
    topics: ['Cascades Haar', 'Apprentissage', 'AdaBoost'],
    available: true,
  },
  {
    id: 'aruco-ar',
    name: 'Réalité Augmentée (ArUco)',
    description: 'Marqueurs fiduciaires pour AR',
    icon: '🎯',
    difficulty: 'L3',
    topics: ['Réalité Augmentée', 'Homographie', 'Calibration'],
    available: true,
  },
  {
    id: 'yolo',
    name: 'YOLO - Détection d\'objets',
    description: 'Neural network pour détection en temps réel',
    icon: '🤖',
    difficulty: 'Master',
    topics: ['Deep Learning', 'CNN', 'Detection'],
    available: true,
  },
];

// ============================================
// Composant principal
// ============================================

export function BodyTrackingVisualizer() {
  const [currentDemo, setCurrentDemo] = useState<DemoMode>('overview');
  const [showExplanation, setShowExplanation] = useState(false);

  const renderDemo = () => {
    switch (currentDemo) {
      case 'facial-landmarks':
        return <FacialLandmarksDemo onBack={() => setCurrentDemo('overview')} />;
      case 'motion-detection':
        return <MotionDetectionDemo onBack={() => setCurrentDemo('overview')} />;
      case 'face-detection':
        return <FaceDetectionDemo onBack={() => setCurrentDemo('overview')} />;
      case 'aruco-ar':
        return <ArucoARDemo onBack={() => setCurrentDemo('overview')} />;
      case 'yolo':
        return <YoloObjectDetectionDemo onBack={() => setCurrentDemo('overview')} />;
      case 'overview':
      default:
        return (
          <div className="space-y-6">
            {/* En-tête */}
            <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-2xl p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">🎥 Computer Vision & Body Tracking</h1>
                  <p className="text-purple-100">Vision par ordinateur et Intelligence Artificielle</p>
                </div>
                <div className="text-right bg-white/10 rounded-xl px-4 py-2">
                  <div className="text-xs text-purple-200 mb-1">Projets</div>
                  <div className="text-2xl font-bold">{DEMOS.filter(d => d.available).length}/{DEMOS.length}</div>
                </div>
              </div>
            </div>

            {/* Grille des démos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEMOS.map((demo) => (
                <motion.button
                  key={demo.id}
                  onClick={() => demo.available && setCurrentDemo(demo.id)}
                  disabled={!demo.available}
                  whileHover={demo.available ? { scale: 1.02 } : {}}
                  whileTap={demo.available ? { scale: 0.98 } : {}}
                  className={`relative bg-surface-light rounded-xl p-6 border-2 text-left transition-all ${
                    demo.available
                      ? 'border-primary-light/20 hover:border-primary-light/50 cursor-pointer shadow-lg hover:shadow-xl'
                      : 'border-gray-700 opacity-50 cursor-not-allowed'
                  }`}
                >
                  {/* Badge niveau */}
                  <div className={`absolute top-4 right-4 px-2 py-1 rounded-lg text-xs font-bold ${
                    demo.difficulty === 'L1' ? 'bg-green-500/20 text-green-400' :
                    demo.difficulty === 'L2' ? 'bg-blue-500/20 text-blue-400' :
                    demo.difficulty === 'L3' ? 'bg-purple-500/20 text-purple-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {demo.difficulty}
                  </div>

                  {/* Icône */}
                  <div className="text-5xl mb-4">{demo.icon}</div>

                  {/* Nom */}
                  <h3 className="text-xl font-bold text-text mb-2">{demo.name}</h3>

                  {/* Description */}
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{demo.description}</p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2">
                    {demo.topics.slice(0, 3).map((topic, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-surface rounded text-xs text-text-muted"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Overlay "Bientôt" */}
                  {!demo.available && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <span className="text-white font-bold text-lg">🔒 Bientôt disponible</span>
                    </div>
                  )}
                </motion.button>
              ))}
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
                    <div className="font-bold text-text text-lg">Comprendre la Computer Vision</div>
                    <div className="text-sm text-text-muted">Du lycée jusqu'au Master en IA</div>
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
                      {/* Progression académique */}
                      <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-l-4 border-purple-500 p-4 rounded mt-4">
                        <h3 className="font-bold text-purple-400 mb-3">📚 Parcours académique en Computer Vision</h3>

                        <div className="space-y-3">
                          {/* Lycée */}
                          <div className="bg-surface/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-green-400 font-bold">🎓 Lycée</span>
                              <span className="text-xs text-text-muted">Les bases</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1 pl-4">
                              <li>• <strong>Triangulation de Delaunay</strong> : Géométrie du plan, triangles</li>
                              <li>• <strong>Statistiques</strong> : Moyennes, fréquences, histogrammes</li>
                              <li>• <strong>Vecteurs</strong> : Distance euclidienne, produit scalaire</li>
                              <li>• <strong>Matrices 2D</strong> : Transformations géométriques</li>
                            </ul>
                          </div>

                          {/* L1-L2 */}
                          <div className="bg-surface/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-blue-400 font-bold">🎓 L1-L2</span>
                              <span className="text-xs text-text-muted">Fondations informatiques</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1 pl-4">
                              <li>• <strong>Traitement d'image</strong> : Convolution, filtres, morphologie</li>
                              <li>• <strong>Algorithmes géométriques</strong> : Delaunay, Voronoi, enveloppe convexe</li>
                              <li>• <strong>Probabilités</strong> : Distributions, modèles statistiques</li>
                              <li>• <strong>Structures de données</strong> : KD-trees, quadtrees</li>
                            </ul>
                          </div>

                          {/* L3 */}
                          <div className="bg-surface/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-purple-400 font-bold">🎓 L3</span>
                              <span className="text-xs text-text-muted">Computer Vision</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1 pl-4">
                              <li>• <strong>Détection de features</strong> : Harris corners, SIFT, SURF</li>
                              <li>• <strong>Cascades de Haar</strong> : Viola-Jones, AdaBoost</li>
                              <li>• <strong>Géométrie 3D</strong> : Homographie, calibration caméra</li>
                              <li>• <strong>Machine Learning</strong> : SVM, Random Forests</li>
                            </ul>
                          </div>

                          {/* Master */}
                          <div className="bg-surface/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-red-400 font-bold">🎓 Master IA</span>
                              <span className="text-xs text-text-muted">Deep Learning</span>
                            </div>
                            <ul className="text-sm text-text-muted space-y-1 pl-4">
                              <li>• <strong>CNN</strong> : Réseaux convolutionnels (VGG, ResNet)</li>
                              <li>• <strong>Object Detection</strong> : YOLO, Faster R-CNN, SSD</li>
                              <li>• <strong>Segmentation</strong> : U-Net, Mask R-CNN</li>
                              <li>• <strong>GANs</strong> : Génération d'images, style transfer</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Applications réelles */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-surface rounded-lg p-4 border-l-4 border-cyan-500">
                          <h4 className="font-bold text-cyan-400 mb-2">🌍 Applications industrielles</h4>
                          <ul className="text-sm text-text-muted space-y-1">
                            <li>• <strong>Reconnaissance faciale</strong> : Sécurité, smartphone</li>
                            <li>• <strong>Voitures autonomes</strong> : Tesla, Waymo</li>
                            <li>• <strong>Médical</strong> : Diagnostic cancer, analyse radiologie</li>
                            <li>• <strong>Retail</strong> : Amazon Go, détection de produits</li>
                            <li>• <strong>AR/VR</strong> : Snapchat filters, Meta Quest</li>
                          </ul>
                        </div>

                        <div className="bg-surface rounded-lg p-4 border-l-4 border-orange-500">
                          <h4 className="font-bold text-orange-400 mb-2">💼 Débouchés professionnels</h4>
                          <ul className="text-sm text-text-muted space-y-1">
                            <li>• <strong>Computer Vision Engineer</strong> : 45-70k€</li>
                            <li>• <strong>ML Engineer</strong> : 50-80k€</li>
                            <li>• <strong>Research Scientist</strong> : 60-100k€</li>
                            <li>• <strong>Robotics Engineer</strong> : 45-75k€</li>
                            <li>• <strong>Data Scientist</strong> : 40-70k€</li>
                          </ul>
                        </div>
                      </div>

                      {/* Outils et frameworks */}
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl p-4">
                        <h4 className="font-bold text-cyan-400 mb-3">🛠️ Outils modernes (2026)</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                          <div className="bg-surface/50 rounded p-2">
                            <div className="font-bold text-purple-400 mb-1">Libraries</div>
                            <div className="text-text-muted">OpenCV, MediaPipe, Dlib</div>
                          </div>
                          <div className="bg-surface/50 rounded p-2">
                            <div className="font-bold text-blue-400 mb-1">Deep Learning</div>
                            <div className="text-text-muted">PyTorch, TensorFlow, ONNX</div>
                          </div>
                          <div className="bg-surface/50 rounded p-2">
                            <div className="font-bold text-green-400 mb-1">Modèles</div>
                            <div className="text-text-muted">YOLO v8, SAM, CLIP</div>
                          </div>
                          <div className="bg-surface/50 rounded p-2">
                            <div className="font-bold text-orange-400 mb-1">Cloud</div>
                            <div className="text-text-muted">AWS Rekognition, Azure CV</div>
                          </div>
                        </div>
                      </div>

                      {/* Conseil */}
                      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-xl p-4">
                        <h4 className="font-bold text-green-400 mb-2">💡 Conseil pour réussir</h4>
                        <p className="text-sm text-text-muted leading-relaxed">
                          La <strong>Computer Vision</strong> combine mathématiques, algorithmique et intelligence artificielle.
                          Les maths du lycée (géométrie, statistiques) sont la <strong>fondation</strong> de tout !
                          En Licence, vous apprendrez le traitement d'image et les algorithmes classiques.
                          En Master, le Deep Learning prend le relais avec des résultats impressionnants.
                          C'est un domaine en <strong>pleine explosion</strong> avec d'excellents salaires et des problèmes fascinants à résoudre.
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
  };

  return (
    <div className="w-full bg-surface p-6">
      {renderDemo()}
    </div>
  );
}

export default BodyTrackingVisualizer;
