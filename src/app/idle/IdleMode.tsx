import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { useCanvas } from '../../shared/hooks';
import type { CanvasContext, AnimationState, IdleEffect } from '../../types';

// ============================================
// Composant GlitchText - Effet glitch sur une lettre aléatoire
// ============================================

function GlitchText({ text }: { text: string }) {
  const [glitchIndex, setGlitchIndex] = useState<number>(-1);
  const [glitchChar, setGlitchChar] = useState<string>('');
  const [isGlitching, setIsGlitching] = useState(false);
  const textRef = useRef<HTMLHeadingElement>(null);
  const [charPositions, setCharPositions] = useState<{ left: number; width: number }[]>([]);

  // Calculer les positions des caractères
  useEffect(() => {
    if (textRef.current) {
      const spans = textRef.current.querySelectorAll('.char-span');
      const positions: { left: number; width: number }[] = [];
      spans.forEach((span) => {
        const rect = span.getBoundingClientRect();
        const parentRect = textRef.current!.getBoundingClientRect();
        positions.push({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      });
      setCharPositions(positions);
    }
  }, [text]);

  useEffect(() => {
    let timeoutId: number;
    let glitchTimeoutId: number;

    const scheduleNextGlitch = () => {
      // Temps aléatoire entre 2 et 8 secondes
      const delay = 2000 + Math.random() * 6000;

      timeoutId = window.setTimeout(() => {
        // Choisir une lettre aléatoire (exclure les espaces)
        const letters = text.split('').map((char, idx) => ({ char, idx })).filter(({ char }) => char !== ' ');
        if (letters.length > 0) {
          const randomLetter = letters[Math.floor(Math.random() * letters.length)];
          setGlitchIndex(randomLetter.idx);
          setGlitchChar(randomLetter.char);
          setIsGlitching(true);

          // Le glitch dure 3000ms
          glitchTimeoutId = window.setTimeout(() => {
            setIsGlitching(false);
            setGlitchIndex(-1);
            setGlitchChar('');
            scheduleNextGlitch();
          }, 3000);
        } else {
          scheduleNextGlitch();
        }
      }, delay);
    };

    scheduleNextGlitch();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (glitchTimeoutId) clearTimeout(glitchTimeoutId);
    };
  }, [text]);

  return (
    <div className="relative">
      {/* Texte principal avec gradient animé (CSS pour perfs) */}
      <h1
        ref={textRef}
        className="text-6xl md:text-8xl font-display font-bold mb-4 gradient-text-idle"
        style={{
          background: 'linear-gradient(90deg, #ffffff, #5DADE2, #2980B9, #5DADE2, #ffffff)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: 'gradient-shift 6s linear infinite',
        }}
      >
        {text.split('').map((char, index) => (
          <span key={index} className="char-span">
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>

      {/* Effet glitch avec CSS au lieu de Framer Motion */}
      {isGlitching && glitchIndex >= 0 && charPositions[glitchIndex] && (
        <div
          className="absolute top-0 pointer-events-none"
          style={{
            left: charPositions[glitchIndex].left,
          }}
        >
          <span
            className="absolute top-0 left-0 text-6xl md:text-8xl font-display font-bold glitch-char"
            style={{
              color: '#00ffff',
              mixBlendMode: 'screen',
              animation: 'glitch-shake 0.3s linear 3',
            }}
          >
            {glitchChar}
          </span>
        </div>
      )}

      <style>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes glitch-shake {
          0%, 100% { transform: translateX(0); opacity: 1; }
          20% { transform: translateX(-4px); opacity: 0.7; }
          40% { transform: translateX(4px); opacity: 1; }
          60% { transform: translateX(-3px); opacity: 0.7; }
          80% { transform: translateX(3px); opacity: 1; }
        }
        @keyframes pulse-opacity {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ============================================
// Composant principal IdleMode
// ============================================

const IDLE_EFFECT_SWITCH_INTERVAL = 60000; // 1 minute en millisecondes

export function IdleMode() {
    const { currentIdleEffect, showIdleTitle, nextIdleEffect } = useAppStore();

    // Auto-switch d'effet toutes les minutes
    useEffect(() => {
        const intervalId = setInterval(() => {
            nextIdleEffect();
        }, IDLE_EFFECT_SWITCH_INTERVAL);

        return () => clearInterval(intervalId);
    }, [nextIdleEffect]);

    return (
        <div className="relative w-full h-full idle-mode">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdleEffect}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    <EffectRenderer effect={currentIdleEffect} />
                </motion.div>
            </AnimatePresence>

            <AnimatePresence>
                {showIdleTitle && (
                    <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="relative text-center px-16 py-12"
                        >
                            <div className="absolute inset-0 bg-surface/40 backdrop-blur-md rounded-2xl border border-primary-light/20 shadow-2xl" />
                            <div className="relative z-10">
                                <div className="relative inline-block">
                                    <GlitchText text="Licence Informatique" />
                                </div>
                                <p
                                    className="text-2xl md:text-3xl text-primary-light font-light"
                                    style={{ animation: 'pulse-opacity 3s ease-in-out infinite' }}
                                >
                                    La Rochelle Université
                                </p>
                            </div>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            transition={{ delay: 1.5 }}
                            className="absolute bottom-20 text-text-muted text-lg"
                        >
                            Appuyez sur <span className="text-primary-light font-semibold">Espace</span> pour explorer
                        </motion.p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function EffectRenderer({ effect }: { effect: IdleEffect }) {
    switch (effect) {
        case 'matrix': return <MatrixRainEffect />;
        case 'boids': return <BoidsEffect />;
        case 'neural': return <NeuralNetworkEffect />;
        default: return <MatrixRainEffect />;
    }
}

// ============================================
// Effet Matrix Rain
// ============================================

interface MatrixColumn {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  opacity: number;
}

function MatrixRainEffect() {
  const columnsRef = { current: [] as MatrixColumn[] };
  const charSetRef = { current: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]' };

  const initColumns = useCallback((width: number, height: number) => {
    const fontSize = 16;
    const columns = Math.floor(width / fontSize);
    
    columnsRef.current = Array.from({ length: columns }, (_, i) => ({
      x: i * fontSize,
      y: Math.random() * height,
      speed: 2 + Math.random() * 4,
      chars: Array.from({ length: Math.floor(height / fontSize) }, () => 
        charSetRef.current[Math.floor(Math.random() * charSetRef.current.length)]
      ),
      opacity: 0.3 + Math.random() * 0.7,
    }));
  }, []);

  const onSetup = useCallback((canvas: CanvasContext) => {
    initColumns(canvas.width, canvas.height);
  }, [initColumns]);

  const onDraw = useCallback((canvas: CanvasContext, _state: AnimationState) => {
    const { ctx, width, height } = canvas;
    const fontSize = 16;

    // Fond semi-transparent pour l'effet de traînée
    ctx.fillStyle = 'rgba(10, 22, 40, 0.1)';
    ctx.fillRect(0, 0, width, height);

    // Dessiner les colonnes
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    columnsRef.current.forEach((col) => {
      // Utiliser une couleur simple au lieu de gradient (plus rapide)
      ctx.fillStyle = `rgba(0, 255, 180, ${col.opacity * 0.6})`;

      // Dessiner moins de caractères par colonne (12 au lieu de 20)
      for (let i = 0; i < 12; i++) {
        const charY = col.y - i * fontSize;
        if (charY > 0 && charY < height) {
          const charIndex = Math.floor((col.y / fontSize + i) % col.chars.length);
          ctx.globalAlpha = Math.max(0, 1 - i / 12) * col.opacity;
          ctx.fillText(col.chars[charIndex], col.x, charY);
        }
      }

      // Caractère de tête plus lumineux sans glow (glow est coûteux)
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(col.chars[Math.floor(col.y / fontSize) % col.chars.length], col.x, col.y);

      // Mouvement
      col.y += col.speed;
      if (col.y > height + fontSize * 12) {
        col.y = 0;
        col.speed = 2 + Math.random() * 4;
        // Changer quelques caractères
        col.chars = col.chars.map(() =>
          Math.random() > 0.7
            ? charSetRef.current[Math.floor(Math.random() * charSetRef.current.length)]
            : col.chars[Math.floor(Math.random() * col.chars.length)]
        );
      }
    });

    ctx.globalAlpha = 1;
  }, []);

  const { canvasRef } = useCanvas({ onDraw, onSetup, fps: 24 });

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// ============================================
// Effet Boids - Simulation d'essaim
// ============================================

interface Boid {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
}

interface TargetShape {
  points: { x: number; y: number }[];
  label?: string;
}

type BoidsPhase = 'gathering' | 'dispersing' | 'forming';

function BoidsEffect() {
  const boidsRef = { current: [] as Boid[] };
  const targetShapeRef = { current: null as TargetShape | null };
  const shapeTimerRef = { current: 0 };
  const phaseRef = { current: 'gathering' as BoidsPhase };
  const phaseTimerRef = { current: 0 };
  const centerPointRef = { current: { x: 0, y: 0 } };

  const BOID_COUNT = 70; // Réduit de 150 à 70 pour meilleures perfs
  const MAX_SPEED = 2.5;
  const MAX_FORCE = 0.05;
  const PERCEPTION_RADIUS = 50;
  const SEPARATION_RADIUS = 25;
  const TARGET_ATTRACTION = 0.008;
  const TARGET_RADIUS = 5;
  const GATHERING_DURATION = 120; // frames pour se rassembler
  const DISPERSING_DURATION = 60; // frames pour se disperser
  const FORMING_DURATION = 300; // frames pour dessiner la forme

  // Créer des formes cibles
  const createStarShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const outerRadius = Math.min(width, height) * 0.25;
    const innerRadius = outerRadius * 0.4;
    const spikes = 5;

    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i * Math.PI) / spikes;
      const radius = i % 2 === 0 ? outerRadius : innerRadius;

      // Créer plusieurs points par segment
      for (let j = 0; j < 8; j++) {
        const t = j / 8;
        const nextAngle = ((i + 1) * Math.PI) / spikes;
        const nextRadius = (i + 1) % 2 === 0 ? outerRadius : innerRadius;

        const currentX = centerX + Math.cos(angle) * radius;
        const currentY = centerY + Math.sin(angle) * radius;
        const nextX = centerX + Math.cos(nextAngle) * nextRadius;
        const nextY = centerY + Math.sin(nextAngle) * nextRadius;

        points.push({
          x: currentX + (nextX - currentX) * t,
          y: currentY + (nextY - currentY) * t,
        });
      }
    }

    return { points, label: '⭐ Étoile' };
  }, []);

  const createHeartShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const scale = Math.min(width, height) * 0.015;

    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const x = 16 * Math.pow(Math.sin(t), 3);
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

      points.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
      });
    }

    return { points, label: '❤️ Cœur' };
  }, []);

  const createInfinityShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const scale = Math.min(width, height) * 0.12;

    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const x = Math.cos(t) / (1 + Math.pow(Math.sin(t), 2));
      const y = Math.sin(t) * Math.cos(t) / (1 + Math.pow(Math.sin(t), 2));

      points.push({
        x: centerX + x * scale * 2,
        y: centerY + y * scale * 2,
      });
    }

    return { points, label: '∞ Infini' };
  }, []);

  const createDNAHelixShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const heightSpan = Math.min(width, height) * 0.5;
    const radius = 80;

    for (let i = 0; i < 100; i++) {
      const t = (i / 100) * Math.PI * 4;
      const y = centerY - heightSpan / 2 + (i / 100) * heightSpan;

      // Première hélice
      points.push({
        x: centerX + Math.cos(t) * radius,
        y: y,
      });

      // Deuxième hélice (opposée)
      points.push({
        x: centerX + Math.cos(t + Math.PI) * radius,
        y: y,
      });
    }

    return { points, label: '🧬 ADN' };
  }, []);

  const createSineWaveShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const waveWidth = Math.min(width, height) * 0.6;
    const amplitude = 100;
    const frequency = 3;

    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * frequency * Math.PI * 2;
      const x = centerX - waveWidth / 2 + (i / 200) * waveWidth;
      const y = centerY + Math.sin(t) * amplitude;

      points.push({ x, y });
    }

    return { points, label: '〰️ Onde' };
  }, []);

  const createHexagonShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const radius = Math.min(width, height) * 0.25;

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
      const nextAngle = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;

      // Créer des points le long de chaque côté
      for (let j = 0; j < 15; j++) {
        const t = j / 15;
        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(nextAngle) * radius;
        const y2 = centerY + Math.sin(nextAngle) * radius;

        points.push({
          x: x1 + (x2 - x1) * t,
          y: y1 + (y2 - y1) * t,
        });
      }
    }

    return { points, label: '⬡ Hexagone' };
  }, []);

  const createSpiralShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < 200; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const radius = (i / 200) * Math.min(width, height) * 0.35;
      points.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      });
    }

    return { points, label: '🌀 Spirale' };
  }, []);

  const createDoubleCirclesShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const radius1 = Math.min(width, height) * 0.18;
    const radius2 = Math.min(width, height) * 0.28;

    // Premier cercle (intérieur)
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * radius1,
        y: centerY + Math.sin(angle) * radius1,
      });
    }

    // Deuxième cercle (extérieur)
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * radius2,
        y: centerY + Math.sin(angle) * radius2,
      });
    }

    return { points, label: '◎ Cercles' };
  }, []);

  const createLissajousShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const scale = Math.min(width, height) * 0.2;
    const a = 3;
    const b = 4;

    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 2;
      const x = Math.sin(a * t);
      const y = Math.sin(b * t);

      points.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
      });
    }

    return { points, label: '∿ Lissajous' };
  }, []);

  const createAtomShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const radius = Math.min(width, height) * 0.25;

    // Noyau central
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      points.push({
        x: centerX + Math.cos(angle) * 15,
        y: centerY + Math.sin(angle) * 15,
      });
    }

    // Trois orbites électroniques
    for (let orbit = 0; orbit < 3; orbit++) {
      const orbitAngle = (orbit / 3) * Math.PI * 2;

      for (let i = 0; i < 30; i++) {
        const t = (i / 30) * Math.PI * 2;
        const x = Math.cos(t) * radius;
        const y = Math.sin(t) * radius * 0.3;

        // Rotation de l'orbite
        const rotatedX = x * Math.cos(orbitAngle) - y * Math.sin(orbitAngle);
        const rotatedY = x * Math.sin(orbitAngle) + y * Math.cos(orbitAngle);

        points.push({
          x: centerX + rotatedX,
          y: centerY + rotatedY,
        });
      }
    }

    return { points };
  }, []);

  const createButterflyShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const scale = Math.min(width, height) * 0.15;

    // Ailes du papillon (forme en 8 avec des courbes)
    for (let i = 0; i < 200; i++) {
      const t = (i / 200) * Math.PI * 2;

      // Équation paramétrique pour un papillon
      const r = Math.sin(t) * (Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) - Math.pow(Math.sin(t / 12), 5));
      const x = Math.sin(t) * r;
      const y = Math.cos(t) * r;

      points.push({
        x: centerX + x * scale,
        y: centerY + y * scale,
      });
    }

    // Corps central
    for (let i = 0; i < 20; i++) {
      points.push({
        x: centerX,
        y: centerY - 50 + i * 5,
      });
    }

    return { points };
  }, []);

  const createSnowflakeShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const radius = Math.min(width, height) * 0.25;
    const branches = 6;

    // 6 branches du flocon avec des ramifications
    for (let branch = 0; branch < branches; branch++) {
      const angle = (branch / branches) * Math.PI * 2;

      // Branche principale
      for (let i = 0; i < 30; i++) {
        const t = i / 30;
        const r = t * radius;
        points.push({
          x: centerX + Math.cos(angle) * r,
          y: centerY + Math.sin(angle) * r,
        });

        // Ramifications à 60° et -60°
        if (i > 5 && i % 5 === 0) {
          for (let j = 0; j < 8; j++) {
            const subR = r - j * (r / 20);
            const subAngle1 = angle + Math.PI / 6;
            const subAngle2 = angle - Math.PI / 6;

            points.push({
              x: centerX + Math.cos(subAngle1) * subR,
              y: centerY + Math.sin(subAngle1) * subR,
            });
            points.push({
              x: centerX + Math.cos(subAngle2) * subR,
              y: centerY + Math.sin(subAngle2) * subR,
            });
          }
        }
      }
    }

    return { points };
  }, []);

  const createGalaxyShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const arms = 3; // 3 bras spiraux

    // Noyau central dense
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      const r = Math.random() * 20;
      points.push({
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
      });
    }

    // Bras spiraux de la galaxie
    for (let arm = 0; arm < arms; arm++) {
      const armAngleOffset = (arm / arms) * Math.PI * 2;

      for (let i = 0; i < 70; i++) {
        const t = i / 70;
        const angle = armAngleOffset + t * Math.PI * 4;
        const radius = t * Math.min(width, height) * 0.35;

        // Épaisseur du bras avec dispersion
        for (let j = 0; j < 3; j++) {
          const spread = (Math.random() - 0.5) * 30;
          points.push({
            x: centerX + Math.cos(angle) * radius + Math.cos(angle + Math.PI / 2) * spread,
            y: centerY + Math.sin(angle) * radius + Math.sin(angle + Math.PI / 2) * spread,
          });
        }
      }
    }

    return { points };
  }, []);

  const createDiamondShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const size = Math.min(width, height) * 0.25;

    // Partie supérieure du diamant (pointe vers le haut)
    const topY = centerY - size * 0.7;
    const midY = centerY - size * 0.2;
    const bottomY = centerY + size * 0.8;

    // Facettes supérieures (4 triangles)
    const topPoints = [
      { x: centerX, y: topY },
      { x: centerX - size * 0.5, y: midY },
      { x: centerX - size * 0.25, y: midY },
      { x: centerX + size * 0.25, y: midY },
      { x: centerX + size * 0.5, y: midY },
    ];

    // Tracer les arêtes supérieures
    for (let i = 0; i < topPoints.length - 1; i++) {
      const p1 = topPoints[i];
      const p2 = topPoints[i + 1];
      for (let t = 0; t < 15; t++) {
        const ratio = t / 15;
        points.push({
          x: p1.x + (p2.x - p1.x) * ratio,
          y: p1.y + (p2.y - p1.y) * ratio,
        });
      }
    }

    // Contour du milieu (carré)
    const midPoints = [
      { x: centerX - size * 0.5, y: midY },
      { x: centerX + size * 0.5, y: midY },
      { x: centerX + size * 0.5, y: midY },
      { x: centerX - size * 0.5, y: midY },
    ];

    for (let i = 0; i < midPoints.length - 1; i++) {
      const p1 = midPoints[i];
      const p2 = midPoints[i + 1];
      for (let t = 0; t < 10; t++) {
        const ratio = t / 10;
        points.push({
          x: p1.x + (p2.x - p1.x) * ratio,
          y: p1.y + (p2.y - p1.y) * ratio,
        });
      }
    }

    // Facettes inférieures (convergeant vers la pointe)
    const bottomPoints = [
      { x: centerX - size * 0.5, y: midY },
      { x: centerX, y: bottomY },
      { x: centerX + size * 0.5, y: midY },
    ];

    for (let i = 0; i < bottomPoints.length - 1; i++) {
      const p1 = bottomPoints[i];
      const p2 = bottomPoints[i + 1];
      for (let t = 0; t < 20; t++) {
        const ratio = t / 20;
        points.push({
          x: p1.x + (p2.x - p1.x) * ratio,
          y: p1.y + (p2.y - p1.y) * ratio,
        });
      }
    }

    // Lignes verticales internes pour plus de détails
    for (let i = 0; i < 20; i++) {
      const ratio = i / 20;
      points.push({
        x: centerX - size * 0.25,
        y: midY + (bottomY - midY) * ratio,
      });
      points.push({
        x: centerX + size * 0.25,
        y: midY + (bottomY - midY) * ratio,
      });
    }

    return { points };
  }, []);

  const createDoubleWaveShape = useCallback((width: number, height: number): TargetShape => {
    const centerX = width / 2;
    const centerY = height / 2;
    const points: { x: number; y: number }[] = [];
    const waveWidth = Math.min(width, height) * 0.7;
    const amplitude1 = 80;
    const amplitude2 = 60;
    const frequency = 2.5;

    // Première vague (en haut)
    for (let i = 0; i < 150; i++) {
      const t = (i / 150) * frequency * Math.PI * 2;
      const x = centerX - waveWidth / 2 + (i / 150) * waveWidth;
      const y = centerY - 50 + Math.sin(t) * amplitude1;
      points.push({ x, y });
    }

    // Deuxième vague (en bas, décalée)
    for (let i = 0; i < 150; i++) {
      const t = (i / 150) * frequency * Math.PI * 2 + Math.PI / 3;
      const x = centerX - waveWidth / 2 + (i / 150) * waveWidth;
      const y = centerY + 50 + Math.sin(t) * amplitude2;
      points.push({ x, y });
    }

    // Lignes verticales connectant les deux vagues
    for (let i = 0; i < 150; i += 15) {
      const t1 = (i / 150) * frequency * Math.PI * 2;
      const t2 = (i / 150) * frequency * Math.PI * 2 + Math.PI / 3;
      const x = centerX - waveWidth / 2 + (i / 150) * waveWidth;
      const y1 = centerY - 50 + Math.sin(t1) * amplitude1;
      const y2 = centerY + 50 + Math.sin(t2) * amplitude2;

      for (let j = 0; j < 10; j++) {
        const ratio = j / 10;
        points.push({
          x: x,
          y: y1 + (y2 - y1) * ratio,
        });
      }
    }

    return { points };
  }, []);

  const getRandomShape = useCallback((width: number, height: number): TargetShape => {
    const shapes = [
      () => createStarShape(width, height),
      () => createHeartShape(width, height),
      () => createInfinityShape(width, height),
      () => createDNAHelixShape(width, height),
      () => createSineWaveShape(width, height),
      () => createHexagonShape(width, height),
      () => createSpiralShape(width, height),
      () => createDoubleCirclesShape(width, height),
      () => createLissajousShape(width, height),
      () => createAtomShape(width, height),
      () => createButterflyShape(width, height),
      () => createSnowflakeShape(width, height),
      () => createGalaxyShape(width, height),
      () => createDiamondShape(width, height),
      () => createDoubleWaveShape(width, height),
    ];
    return shapes[Math.floor(Math.random() * shapes.length)]();
  }, [createStarShape, createHeartShape, createInfinityShape, createDNAHelixShape,
      createSineWaveShape, createHexagonShape, createSpiralShape, createDoubleCirclesShape,
      createLissajousShape, createAtomShape, createButterflyShape, createSnowflakeShape,
      createGalaxyShape, createDiamondShape, createDoubleWaveShape]);

  const initBoids = useCallback((width: number, height: number) => {
    boidsRef.current = Array.from({ length: BOID_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      angle: Math.random() * Math.PI * 2,
    }));
    centerPointRef.current = { x: width / 2, y: height / 2 };
    targetShapeRef.current = getRandomShape(width, height);
    shapeTimerRef.current = 0;
    phaseRef.current = 'gathering';
    phaseTimerRef.current = 0;
  }, [getRandomShape]);


  const align = (boid: Boid, boids: Boid[]): { x: number; y: number } => {
    let steering = { x: 0, y: 0 };
    let total = 0;

    for (const other of boids) {
      const dist = Math.hypot(boid.x - other.x, boid.y - other.y);
      if (other !== boid && dist < PERCEPTION_RADIUS) {
        steering.x += other.vx;
        steering.y += other.vy;
        total++;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      const mag = Math.hypot(steering.x, steering.y);
      if (mag > 0) {
        steering.x = (steering.x / mag) * MAX_SPEED - boid.vx;
        steering.y = (steering.y / mag) * MAX_SPEED - boid.vy;
      }
    }

    return steering;
  };

  const cohesion = (boid: Boid, boids: Boid[]): { x: number; y: number } => {
    let steering = { x: 0, y: 0 };
    let total = 0;

    for (const other of boids) {
      const dist = Math.hypot(boid.x - other.x, boid.y - other.y);
      if (other !== boid && dist < PERCEPTION_RADIUS) {
        steering.x += other.x;
        steering.y += other.y;
        total++;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      steering.x -= boid.x;
      steering.y -= boid.y;
      const mag = Math.hypot(steering.x, steering.y);
      if (mag > 0) {
        steering.x = (steering.x / mag) * MAX_SPEED - boid.vx;
        steering.y = (steering.y / mag) * MAX_SPEED - boid.vy;
      }
    }

    return steering;
  };

  const separation = (boid: Boid, boids: Boid[]): { x: number; y: number } => {
    let steering = { x: 0, y: 0 };
    let total = 0;

    for (const other of boids) {
      const dist = Math.hypot(boid.x - other.x, boid.y - other.y);
      if (other !== boid && dist < SEPARATION_RADIUS && dist > 0) {
        const diff = {
          x: boid.x - other.x,
          y: boid.y - other.y,
        };
        diff.x /= dist * dist;
        diff.y /= dist * dist;
        steering.x += diff.x;
        steering.y += diff.y;
        total++;
      }
    }

    if (total > 0) {
      steering.x /= total;
      steering.y /= total;
      const mag = Math.hypot(steering.x, steering.y);
      if (mag > 0) {
        steering.x = (steering.x / mag) * MAX_SPEED - boid.vx;
        steering.y = (steering.y / mag) * MAX_SPEED - boid.vy;
      }
    }

    return steering;
  };

  const seekTarget = (boid: Boid, target: { x: number; y: number }): { x: number; y: number } => {
    const desired = {
      x: target.x - boid.x,
      y: target.y - boid.y,
    };
    const dist = Math.hypot(desired.x, desired.y);

    if (dist < TARGET_RADIUS) {
      return { x: 0, y: 0 };
    }

    if (dist > 0) {
      desired.x = (desired.x / dist) * MAX_SPEED;
      desired.y = (desired.y / dist) * MAX_SPEED;
    }

    return {
      x: desired.x - boid.vx,
      y: desired.y - boid.vy,
    };
  };

  const onSetup = useCallback((canvas: CanvasContext) => {
    initBoids(canvas.width, canvas.height);
  }, [initBoids]);

  const onDraw = useCallback((canvas: CanvasContext) => {
    const { ctx, width, height } = canvas;

    // Fond
    ctx.fillStyle = 'rgba(10, 22, 40, 0.15)';
    ctx.fillRect(0, 0, width, height);

    // Gestion des phases
    phaseTimerRef.current++;

    // Transitions de phases
    if (phaseRef.current === 'gathering' && phaseTimerRef.current > GATHERING_DURATION) {
      phaseRef.current = 'dispersing';
      phaseTimerRef.current = 0;
    } else if (phaseRef.current === 'dispersing' && phaseTimerRef.current > DISPERSING_DURATION) {
      phaseRef.current = 'forming';
      phaseTimerRef.current = 0;
    } else if (phaseRef.current === 'forming' && phaseTimerRef.current > FORMING_DURATION) {
      phaseRef.current = 'gathering';
      phaseTimerRef.current = 0;
      targetShapeRef.current = getRandomShape(width, height);
      centerPointRef.current = { x: width / 2, y: height / 2 };
    }

    // Mettre à jour et dessiner les boids
    boidsRef.current.forEach((boid, index) => {
      // Forces de comportement
      const alignForce = align(boid, boidsRef.current);
      const cohesionForce = cohesion(boid, boidsRef.current);
      const separationForce = separation(boid, boidsRef.current);

      let targetForce = { x: 0, y: 0 };

      if (phaseRef.current === 'gathering') {
        // Phase 1 : Rassemblement au centre
        targetForce = seekTarget(boid, centerPointRef.current);
        targetForce.x *= 0.02; // Force d'attraction vers le centre
        targetForce.y *= 0.02;

        // Réduire la séparation pour permettre un rassemblement serré
        boid.vx += alignForce.x * MAX_FORCE * 1.5;
        boid.vy += alignForce.y * MAX_FORCE * 1.5;
        boid.vx += cohesionForce.x * MAX_FORCE * 2;
        boid.vy += cohesionForce.y * MAX_FORCE * 2;
        boid.vx += separationForce.x * MAX_FORCE * 0.5;
        boid.vy += separationForce.y * MAX_FORCE * 0.5;
        boid.vx += targetForce.x;
        boid.vy += targetForce.y;

      } else if (phaseRef.current === 'dispersing') {
        // Phase 2 : Dispersion vers les positions cibles
        if (targetShapeRef.current && targetShapeRef.current.points.length > 0) {
          const targetIndex = index % targetShapeRef.current.points.length;
          const target = targetShapeRef.current.points[targetIndex];
          targetForce = seekTarget(boid, target);

          // Augmenter progressivement la force vers la cible
          const t = phaseTimerRef.current / DISPERSING_DURATION;
          targetForce.x *= TARGET_ATTRACTION * (1 + t * 3);
          targetForce.y *= TARGET_ATTRACTION * (1 + t * 3);
        }

        // Réduire la cohésion pour permettre la dispersion
        boid.vx += alignForce.x * MAX_FORCE * 0.8;
        boid.vy += alignForce.y * MAX_FORCE * 0.8;
        boid.vx += cohesionForce.x * MAX_FORCE * 0.3;
        boid.vy += cohesionForce.y * MAX_FORCE * 0.3;
        boid.vx += separationForce.x * MAX_FORCE * 1.2;
        boid.vy += separationForce.y * MAX_FORCE * 1.2;
        boid.vx += targetForce.x;
        boid.vy += targetForce.y;

      } else if (phaseRef.current === 'forming') {
        // Phase 3 : Formation et maintien de la forme
        if (targetShapeRef.current && targetShapeRef.current.points.length > 0) {
          const targetIndex = index % targetShapeRef.current.points.length;
          const target = targetShapeRef.current.points[targetIndex];
          targetForce = seekTarget(boid, target);
          targetForce.x *= TARGET_ATTRACTION * 1.5;
          targetForce.y *= TARGET_ATTRACTION * 1.5;
        }

        // Équilibre entre formation et comportement de groupe
        boid.vx += alignForce.x * MAX_FORCE;
        boid.vy += alignForce.y * MAX_FORCE;
        boid.vx += cohesionForce.x * MAX_FORCE * 0.5;
        boid.vy += cohesionForce.y * MAX_FORCE * 0.5;
        boid.vx += separationForce.x * MAX_FORCE * 1.5;
        boid.vy += separationForce.y * MAX_FORCE * 1.5;
        boid.vx += targetForce.x;
        boid.vy += targetForce.y;
      }

      // Limiter la vitesse
      const speed = Math.hypot(boid.vx, boid.vy);
      if (speed > MAX_SPEED) {
        boid.vx = (boid.vx / speed) * MAX_SPEED;
        boid.vy = (boid.vy / speed) * MAX_SPEED;
      }

      // Mettre à jour la position
      boid.x += boid.vx;
      boid.y += boid.vy;
      boid.angle = Math.atan2(boid.vy, boid.vx);

      // Wrap around
      if (boid.x < 0) boid.x = width;
      if (boid.x > width) boid.x = 0;
      if (boid.y < 0) boid.y = height;
      if (boid.y > height) boid.y = 0;

      // Dessiner le boid - version simplifiée sans glow/gradient
      ctx.save();
      ctx.translate(boid.x, boid.y);
      ctx.rotate(boid.angle);

      // Triangle simple avec couleur unie (plus rapide)
      ctx.fillStyle = 'rgba(0, 220, 255, 0.8)';
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-5, 5);
      ctx.lineTo(-5, -5);
      ctx.closePath();
      ctx.fill();

      // Contour simple
      ctx.strokeStyle = 'rgba(150, 240, 255, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    });
  }, [getRandomShape]);

  const { canvasRef } = useCanvas({ onDraw, onSetup, fps: 24 });

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// ============================================
// Effet Neural Network - Réseau de neurones animé
// ============================================

interface Neuron {
  x: number;
  y: number;
  layer: number;
  activation: number;
  targetActivation: number;
  radius: number;
  connections: number[];
  isExcitatory: boolean; // true = excitateur (bleu), false = inhibiteur (rouge/orange)
}

interface Signal {
  fromIndex: number;
  toIndex: number;
  progress: number;
  strength: number;
  speed: number;
  isExcitatory: boolean; // Pour la couleur du signal
}

function NeuralNetworkEffect() {
  const neuronsRef = { current: [] as Neuron[] };
  const signalsRef = { current: [] as Signal[] };
  const frameCountRef = { current: 0 };

  // Architecture réduite pour meilleures performances
  const LAYERS = [6, 10, 14, 14, 10, 6]; // Architecture réduite
  const LAYER_SPACING_RATIO = 0.14; // Augmenté pour compenser moins de couches
  const NEURON_MIN_RADIUS = 3;
  const NEURON_MAX_RADIUS = 5;
  const CONNECTION_CHANCE = 0.5; // Moins de connexions pour meilleures perfs
  const SIGNAL_FREQUENCY = 5; // Moins de signaux
  const ACTIVATION_SPEED = 0.08;
  const PROPAGATION_CHANCE = 0.5; // Moins de propagation
  const MAX_SIGNALS = 40; // Réduit pour meilleures perfs

  const initNetwork = useCallback((width: number, height: number) => {
    neuronsRef.current = [];
    signalsRef.current = [];

    const layerSpacing = width * LAYER_SPACING_RATIO;
    const startX = (width - (LAYERS.length - 1) * layerSpacing) / 2;

    let neuronIndex = 0;

    // Créer les neurones couche par couche
    LAYERS.forEach((neuronCount, layerIndex) => {
      const layerX = startX + layerIndex * layerSpacing;
      const startY = 80; // Commencer en dessous du titre
      const spacing = (height - startY - 40) / (neuronCount + 1);

      for (let i = 0; i < neuronCount; i++) {
        const y = startY + (i + 1) * spacing;
        const radius = NEURON_MIN_RADIUS + Math.random() * (NEURON_MAX_RADIUS - NEURON_MIN_RADIUS);

        neuronsRef.current.push({
          x: layerX,
          y,
          layer: layerIndex,
          activation: Math.random() * 0.3,
          targetActivation: Math.random(),
          radius,
          connections: [],
          isExcitatory: Math.random() > 0.3, // 70% excitateurs (bleu), 30% inhibiteurs (rouge/orange)
        });
      }

      // Créer les connexions vers la couche suivante
      if (layerIndex < LAYERS.length - 1) {
        const currentLayerStart = neuronIndex;
        const currentLayerEnd = currentLayerStart + neuronCount;
        const nextLayerStart = currentLayerEnd;
        const nextLayerSize = LAYERS[layerIndex + 1];

        for (let i = currentLayerStart; i < currentLayerEnd; i++) {
          for (let j = 0; j < nextLayerSize; j++) {
            if (Math.random() < CONNECTION_CHANCE) {
              neuronsRef.current[i].connections.push(nextLayerStart + j);
            }
          }
        }
      }

      neuronIndex += neuronCount;
    });
  }, []);

  const createSignal = useCallback(() => {
    if (neuronsRef.current.length === 0) return;
    if (signalsRef.current.length >= MAX_SIGNALS) return; // Limiter le nombre de signaux

    // Trouver un neurone de la première couche avec des connexions
    const firstLayerNeurons = neuronsRef.current.filter(n => n.layer === 0 && n.connections.length > 0);
    if (firstLayerNeurons.length === 0) return;

    // Créer des signaux depuis 1-3 neurones d'entrée pour un pattern plus réaliste
    const numSources = Math.min(1 + Math.floor(Math.random() * 3), firstLayerNeurons.length);

    for (let s = 0; s < numSources; s++) {
      const sourceNeuron = firstLayerNeurons[Math.floor(Math.random() * firstLayerNeurons.length)];
      const sourceIndex = neuronsRef.current.indexOf(sourceNeuron);

      if (sourceNeuron.connections.length > 0) {
        // Créer 2-4 signaux par neurone source (connexions denses)
        const numSignals = Math.min(2 + Math.floor(Math.random() * 3), sourceNeuron.connections.length);
        const shuffledConnections = [...sourceNeuron.connections].sort(() => Math.random() - 0.5);

        for (let i = 0; i < numSignals; i++) {
          const targetIndex = shuffledConnections[i];

          signalsRef.current.push({
            fromIndex: sourceIndex,
            toIndex: targetIndex,
            progress: 0,
            strength: 0.7 + Math.random() * 0.3,
            speed: 0.015 + Math.random() * 0.02,
            isExcitatory: sourceNeuron.isExcitatory,
          });
        }

        // Activer le neurone source
        neuronsRef.current[sourceIndex].targetActivation = 1;
      }
    }
  }, []);


  const onSetup = useCallback((canvas: CanvasContext) => {
    initNetwork(canvas.width, canvas.height);
  }, [initNetwork]);

  const onDraw = useCallback((canvas: CanvasContext) => {
    const { ctx, width, height } = canvas;
    frameCountRef.current++;

    // Fond semi-transparent pour l'effet de traînée
    ctx.fillStyle = 'rgba(10, 22, 40, 0.08)';
    ctx.fillRect(0, 0, width, height);

    // Créer de nouveaux signaux périodiquement
    if (frameCountRef.current % SIGNAL_FREQUENCY === 0) {
      createSignal();
    }

    // Dessiner les connexions (rendu amélioré pour DNN)
    ctx.lineWidth = 0.8;

    neuronsRef.current.forEach((neuron) => {
      neuron.connections.forEach(targetIndex => {
        const target = neuronsRef.current[targetIndex];
        if (target) {
          // Couleur simple selon le type de connexion
          const avgActivation = (neuron.activation + target.activation) / 2;
          const opacity = 0.1 + avgActivation * 0.2;

          if (neuron.isExcitatory) {
            ctx.strokeStyle = `rgba(0, 200, 255, ${opacity})`;
          } else {
            ctx.strokeStyle = `rgba(255, 80, 150, ${opacity})`;
          }

          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
    });

    // Mettre à jour et dessiner les signaux - version simplifiée
    const newSignals: Signal[] = [];

    signalsRef.current = signalsRef.current.filter(signal => {
      signal.progress += signal.speed;

      if (signal.progress <= 1) {
        const from = neuronsRef.current[signal.fromIndex];
        const to = neuronsRef.current[signal.toIndex];

        if (from && to) {
          const x = from.x + (to.x - from.x) * signal.progress;
          const y = from.y + (to.y - from.y) * signal.progress;

          // Dessiner le signal simple sans gradient ni glow (plus rapide)
          if (signal.isExcitatory) {
            ctx.fillStyle = `rgba(0, 220, 255, ${signal.strength})`;
          } else {
            ctx.fillStyle = `rgba(255, 80, 180, ${signal.strength})`;
          }

          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        }

        return true;
      } else {
        // Signal a atteint sa destination, propager
        const targetNeuron = neuronsRef.current[signal.toIndex];
        if (targetNeuron) {
          targetNeuron.targetActivation = signal.strength;

          // Propager vers la couche suivante si on n'a pas trop de signaux
          const totalSignals = signalsRef.current.length + newSignals.length;
          if (targetNeuron.connections.length > 0 &&
              Math.random() < PROPAGATION_CHANCE &&
              totalSignals < MAX_SIGNALS) {
            // Créer 2-4 signaux pour une propagation dense typique d'un DNN
            const numSignals = Math.min(
              2 + Math.floor(Math.random() * 3),
              targetNeuron.connections.length
            );
            const shuffledConnections = [...targetNeuron.connections].sort(() => Math.random() - 0.5);

            for (let i = 0; i < numSignals; i++) {
              const nextTargetIndex = shuffledConnections[i];

              newSignals.push({
                fromIndex: signal.toIndex,
                toIndex: nextTargetIndex,
                progress: 0,
                strength: signal.strength * (0.8 + Math.random() * 0.2),
                speed: 0.015 + Math.random() * 0.02,
                isExcitatory: targetNeuron.isExcitatory,
              });
            }
          }
        }
        return false;
      }
    });

    // Ajouter les nouveaux signaux
    signalsRef.current.push(...newSignals);

    // Mettre à jour et dessiner les neurones - version simplifiée
    neuronsRef.current.forEach((neuron) => {
      // Smooth activation transition
      if (Math.abs(neuron.activation - neuron.targetActivation) > 0.01) {
        neuron.activation += (neuron.targetActivation - neuron.activation) * ACTIVATION_SPEED;
      } else {
        neuron.activation = neuron.targetActivation;
      }

      // Décroissance progressive de l'activation
      if (neuron.targetActivation > 0.1) {
        neuron.targetActivation *= 0.98;
      } else {
        neuron.targetActivation = Math.max(0, neuron.targetActivation - 0.01);
      }

      // Dessiner simplement sans glow ni gradient (plus rapide)
      const baseColor = neuron.isExcitatory ? '0, 200, 255' : '255, 80, 180';
      const opacity = neuron.activation > 0.7 ? 0.9 : (0.3 + neuron.activation * 0.4);

      ctx.fillStyle = `rgba(${baseColor}, ${opacity})`;
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      ctx.fill();

      // Contour simple
      if (neuron.activation > 0.3) {
        ctx.strokeStyle = neuron.isExcitatory
          ? `rgba(100, 240, 255, ${opacity})`
          : `rgba(255, 150, 220, ${opacity})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    // Afficher les labels des couches en bas - version simplifiée
    const layerSpacing = width * LAYER_SPACING_RATIO;
    const startX = (width - (LAYERS.length - 1) * layerSpacing) / 2;
    const labels = ['Input', 'L1', 'L2', 'L3', 'L4', 'Output'];

    // Effacer complètement la zone des labels
    ctx.fillStyle = 'rgb(10, 22, 40)';
    ctx.fillRect(0, height - 45, width, 45);

    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(100, 220, 255, 0.7)';

    labels.forEach((label, index) => {
      const x = startX + index * layerSpacing;
      ctx.fillText(label, x, height - 20);
    });
  }, [createSignal]);

  const { canvasRef } = useCanvas({ onDraw, onSetup, fps: 24 });

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

export default IdleMode;

