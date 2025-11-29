import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useAppStore } from '../../stores/appStore';
import { useCanvas } from '../../shared/hooks';
import type { CanvasContext, AnimationState, IdleEffect } from '../../types';

// ============================================
// Composant GlitchText - Effet glitch sur une lettre aléatoire
// ============================================

function GlitchText({ text }: { text: string }) {
  const [glitchIndex, setGlitchIndex] = useState<number>(-1);
  const [isGlitching, setIsGlitching] = useState(false);

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
          setIsGlitching(true);

          // Le glitch dure 6000ms (6 secondes)
          glitchTimeoutId = window.setTimeout(() => {
            setIsGlitching(false);
            setGlitchIndex(-1);
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
    <motion.h1
      className="text-6xl md:text-8xl font-display font-bold mb-4 relative"
      style={{
        background: 'linear-gradient(90deg, #ffffff, #5DADE2, #2980B9, #5DADE2, #ffffff)',
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{
        backgroundPosition: ['0% 50%', '200% 50%'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="relative"
          style={{
            display: char === ' ' ? 'inline' : 'inline-block',
          }}
        >
          {char === ' ' ? '\u00A0' : char}

          {/* Effet glitch sur la lettre active */}
          {isGlitching && glitchIndex === index && char !== ' ' && (
            <>
              {/* Clone rouge - plus visible */}
              <motion.span
                key={`glitch-red-${index}-${glitchIndex}`}
                className="absolute top-0 left-0 pointer-events-none text-6xl md:text-8xl font-display font-bold"
                style={{
                  color: '#ff0066',
                  mixBlendMode: 'screen',
                  WebkitTextFillColor: '#ff0066',
                  filter: 'drop-shadow(0 0 15px #ff0066) drop-shadow(0 0 25px #ff0066)',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  x: [-6, 6, -5, 5, -6, 4, -5, 3, -4, 2, -3, 0],
                  y: [0, -2, 2, -1, 1, -2, 1, -1, 2, -1, 1, 0],
                  opacity: [1, 0.8, 1, 0.7, 1, 0.8, 1, 0.7, 1, 0.8, 1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 11,
                  ease: "linear",
                }}
              >
                {char}
              </motion.span>

              {/* Clone cyan - plus visible */}
              <motion.span
                key={`glitch-cyan-${index}-${glitchIndex}`}
                className="absolute top-0 left-0 pointer-events-none text-6xl md:text-8xl font-display font-bold"
                style={{
                  color: '#00ffff',
                  mixBlendMode: 'screen',
                  WebkitTextFillColor: '#00ffff',
                  filter: 'drop-shadow(0 0 15px #00ffff) drop-shadow(0 0 25px #00ffff)',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  x: [6, -6, 5, -5, 6, -4, 5, -3, 4, -2, 3, 0],
                  y: [0, 2, -2, 1, -1, 2, -1, 1, -2, 1, -1, 0],
                  opacity: [1, 0.8, 1, 0.7, 1, 0.8, 1, 0.7, 1, 0.8, 1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 11,
                  ease: "linear",
                  delay: 0.05,
                }}
              >
                {char}
              </motion.span>

              {/* Clone jaune/vert pour un effet RGB complet - NOUVEAU */}
              <motion.span
                key={`glitch-yellow-${index}-${glitchIndex}`}
                className="absolute top-0 left-0 pointer-events-none text-6xl md:text-8xl font-display font-bold"
                style={{
                  color: '#ffff00',
                  mixBlendMode: 'screen',
                  WebkitTextFillColor: '#ffff00',
                  filter: 'drop-shadow(0 0 12px #ffff00) drop-shadow(0 0 20px #ffff00)',
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  x: [0, 4, -4, 3, -3, 4, -3, 2, -2, 3, -1, 0],
                  y: [3, -3, 2, -2, 1, -1, 2, -2, 1, -1, 1, 0],
                  opacity: [0.9, 0.7, 1, 0.6, 0.9, 0.7, 1, 0.6, 0.9, 0.7, 1, 0.9],
                }}
                transition={{
                  duration: 0.5,
                  repeat: 11,
                  ease: "linear",
                  delay: 0.025,
                }}
              >
                {char}
              </motion.span>
            </>
          )}
        </span>
      ))}
    </motion.h1>
  );
}

// ============================================
// Composant principal IdleMode
// ============================================

export function IdleMode() {
  const { currentIdleEffect, showIdleTitle } = useAppStore();

  return (
    <div className="relative w-full h-full idle-mode">
      {/* Canvas d'effet */}
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

      {/* Overlay avec logo et titre */}
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
              {/* Cadre avec fond semi-transparent (statique) */}
              <div className="absolute inset-0 bg-surface/40 backdrop-blur-md rounded-2xl border border-primary-light/20 shadow-2xl" />

              {/* Contenu du titre avec animations */}
              <div className="relative z-10">
                {/* Titre principal avec gradient animé */}
                <div className="relative inline-block">
                  <GlitchText text="Licence Informatique" />
                </div>

                {/* Sous-titre */}
                <motion.p
                  className="text-2xl md:text-3xl text-primary-light font-light"
                  animate={{
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  La Rochelle Université
                </motion.p>
              </div>
            </motion.div>

            {/* Hint en bas */}
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


// ============================================
// Renderer d'effet
// ============================================

function EffectRenderer({ effect }: { effect: IdleEffect }) {
  switch (effect) {
    case 'matrix':
      return <MatrixRainEffect />;
    case 'boids':
      return <BoidsEffect />;
    case 'neural':
      return <NeuralNetworkEffect />;
    case 'globe':
      return <GlobeEffect />;
    default:
      return <MatrixRainEffect />;
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
    ctx.fillStyle = 'rgba(10, 22, 40, 0.05)';
    ctx.fillRect(0, 0, width, height);

    // Dessiner les colonnes
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    columnsRef.current.forEach((col) => {
      // Couleur dégradée du haut vers le bas
      const gradient = ctx.createLinearGradient(col.x, col.y - fontSize * 20, col.x, col.y);
      gradient.addColorStop(0, 'rgba(41, 128, 185, 0)');
      gradient.addColorStop(0.8, `rgba(41, 128, 185, ${col.opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(93, 173, 226, ${col.opacity})`);

      ctx.fillStyle = gradient;

      // Dessiner les caractères de la colonne
      for (let i = 0; i < 20; i++) {
        const charY = col.y - i * fontSize;
        if (charY > 0 && charY < height) {
          const charIndex = Math.floor((col.y / fontSize + i) % col.chars.length);
          ctx.globalAlpha = Math.max(0, 1 - i / 20) * col.opacity;
          ctx.fillText(col.chars[charIndex], col.x, charY);
        }
      }

      // Caractère de tête plus lumineux
      ctx.globalAlpha = 1;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(col.chars[Math.floor(col.y / fontSize) % col.chars.length], col.x, col.y);

      // Mouvement
      col.y += col.speed;
      if (col.y > height + fontSize * 20) {
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

  const { canvasRef } = useCanvas({ onDraw, onSetup });

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

  const BOID_COUNT = 300;
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

      // Dessiner le boid
      ctx.save();
      ctx.translate(boid.x, boid.y);
      ctx.rotate(boid.angle);

      // Triangle avec dégradé
      const gradient = ctx.createLinearGradient(-8, 0, 8, 0);
      gradient.addColorStop(0, 'rgba(41, 128, 185, 0.3)');
      gradient.addColorStop(1, 'rgba(93, 173, 226, 0.9)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(8, 0);
      ctx.lineTo(-4, 4);
      ctx.lineTo(-4, -4);
      ctx.closePath();
      ctx.fill();

      // Contour lumineux
      ctx.strokeStyle = 'rgba(93, 173, 226, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.restore();
    });
  }, [getRandomShape]);

  const { canvasRef } = useCanvas({ onDraw, onSetup });

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

  // Architecture d'un DNN réaliste avec plus de couches
  const LAYERS = [8, 16, 24, 32, 32, 24, 16, 8]; // Architecture profonde typique d'un DNN
  const LAYER_SPACING_RATIO = 0.105; // Augmenté pour utiliser plus de largeur d'écran
  const NEURON_MIN_RADIUS = 3;
  const NEURON_MAX_RADIUS = 6;
  const CONNECTION_CHANCE = 0.7; // Plus de connexions comme dans un vrai DNN
  const SIGNAL_FREQUENCY = 3; // Légèrement plus de signaux
  const ACTIVATION_SPEED = 0.08;
  const PROPAGATION_CHANCE = 0.7; // Plus de propagation
  const MAX_SIGNALS = 80; // Augmenté pour une meilleure visualisation

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
          // Calculer l'opacité basée sur l'activation des neurones
          const avgActivation = (neuron.activation + target.activation) / 2;
          const baseOpacity = 0.08; // Opacité de base pour voir toutes les connexions
          const activeOpacity = avgActivation * 0.25; // Augmentation lors de l'activation

          // Utiliser des couleurs différentes selon le type de connexion
          if (neuron.isExcitatory) {
            // Bleu pour les connexions excitatrices
            ctx.strokeStyle = `rgba(41, 128, 185, ${baseOpacity + activeOpacity})`;
          } else {
            // Rouge/Orange pour les connexions inhibitrices
            ctx.strokeStyle = `rgba(231, 76, 60, ${baseOpacity + activeOpacity})`;
          }

          ctx.beginPath();
          ctx.moveTo(neuron.x, neuron.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      });
    });

    // Mettre à jour et dessiner les signaux
    ctx.shadowBlur = 10;
    const newSignals: Signal[] = [];

    signalsRef.current = signalsRef.current.filter(signal => {
      signal.progress += signal.speed;

      if (signal.progress <= 1) {
        const from = neuronsRef.current[signal.fromIndex];
        const to = neuronsRef.current[signal.toIndex];

        if (from && to) {
          const x = from.x + (to.x - from.x) * signal.progress;
          const y = from.y + (to.y - from.y) * signal.progress;

          // Dessiner le signal avec couleur selon le type
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 6);
          if (signal.isExcitatory) {
            // Bleu pour les signaux excitateurs
            gradient.addColorStop(0, `rgba(93, 173, 226, ${signal.strength})`);
            gradient.addColorStop(0.5, `rgba(41, 128, 185, ${signal.strength * 0.5})`);
            gradient.addColorStop(1, 'rgba(41, 128, 185, 0)');
            ctx.shadowColor = 'rgba(93, 173, 226, 0.8)';
          } else {
            // Rouge/Orange pour les signaux inhibiteurs
            gradient.addColorStop(0, `rgba(231, 76, 60, ${signal.strength})`);
            gradient.addColorStop(0.5, `rgba(192, 57, 43, ${signal.strength * 0.5})`);
            gradient.addColorStop(1, 'rgba(192, 57, 43, 0)');
            ctx.shadowColor = 'rgba(231, 76, 60, 0.8)';
          }

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 5, 0, Math.PI * 2);
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

    ctx.shadowBlur = 0;

    // Mettre à jour et dessiner les neurones
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

      // Dessiner seulement si visible
      if (neuron.activation < 0.05) {
        // Neurone inactif - rendu simplifié
        ctx.fillStyle = 'rgba(93, 173, 226, 0.2)';
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
        ctx.fill();
        return;
      }

      // Cercle extérieur (glow) - seulement si activation significative
      if (neuron.activation > 0.3) {
        const glowGradient = ctx.createRadialGradient(
          neuron.x, neuron.y, 0,
          neuron.x, neuron.y, neuron.radius * 1.8
        );
        glowGradient.addColorStop(0, `rgba(93, 173, 226, ${neuron.activation * 0.4})`);
        glowGradient.addColorStop(1, 'rgba(41, 128, 185, 0)');

        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(neuron.x, neuron.y, neuron.radius * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cercle principal
      if (neuron.activation > 0.7) {
        // Neurone très actif
        ctx.fillStyle = `rgba(255, 255, 255, ${neuron.activation * 0.9})`;
      } else {
        // Neurone modérément actif
        ctx.fillStyle = `rgba(93, 173, 226, ${0.3 + neuron.activation * 0.6})`;
      }

      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, neuron.radius, 0, Math.PI * 2);
      ctx.fill();

      // Contour
      ctx.strokeStyle = `rgba(93, 173, 226, ${0.4 + neuron.activation * 0.4})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Afficher les labels des couches en bas
    ctx.fillStyle = 'rgba(93, 173, 226, 0.3)';
    ctx.font = '12px "Inter", sans-serif';
    ctx.textAlign = 'center';

    const layerSpacing = width * LAYER_SPACING_RATIO;
    const startX = (width - (LAYERS.length - 1) * layerSpacing) / 2;
    const labels = ['Input', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'Output'];

    labels.forEach((label, index) => {
      const x = startX + index * layerSpacing;
      ctx.fillText(label, x, height - 20);
    });
  }, [createSignal]);

  const { canvasRef } = useCanvas({ onDraw, onSetup });

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}

// ============================================
// Placeholder pour Globe Effect
// ============================================

// Données des universités EU-CONEXUS
const EU_CONEXUS_UNIVERSITIES = [
    { name: 'La Rochelle Université', city: 'La Rochelle', country: 'France', lat: 46.1591, lon: -1.1520, isMain: true },
    { name: 'Universidad Católica de Valencia', city: 'Valence', country: 'Espagne', lat: 39.4699, lon: -0.3763, isMain: false },
    { name: 'Università del Salento', city: 'Lecce', country: 'Italie', lat: 40.3516, lon: 18.1750, isMain: false },
    { name: 'Technical University of Civil Engineering', city: 'Bucarest', country: 'Roumanie', lat: 44.4268, lon: 26.1025, isMain: false },
    { name: 'Klaipėda University', city: 'Klaipėda', country: 'Lituanie', lat: 55.7033, lon: 21.1443, isMain: false },
    { name: 'Agricultural University of Athens', city: 'Athènes', country: 'Grèce', lat: 37.9838, lon: 23.7275, isMain: false },
    { name: 'University of Zadar', city: 'Zadar', country: 'Croatie', lat: 44.1194, lon: 15.2314, isMain: false },
    { name: 'XAMK', city: 'Kotka', country: 'Finlande', lat: 60.4664, lon: 26.9458, isMain: false },
    { name: 'Frederick University', city: 'Nicosie', country: 'Chypre', lat: 35.1856, lon: 33.3823, isMain: false },
];

// ============================================
// Données géographiques des 9 pays EU-CONEXUS
// ============================================
// Format GeoJSON : [longitude, latitude] avec support multi-polygones
// Les coordonnées sont les vraies frontières simplifiées des pays
const EU_CONEXUS_COUNTRIES: Record<string, { coordinates: number[][][]; isMain: boolean }> = {
    // FRANCE (pays principal - mis en évidence en orange)
    FRA: {
        isMain: true,
        coordinates: [[
            [2.51, 51.15], [2.66, 50.80], [3.12, 50.78], [3.59, 50.49], [3.68, 50.31],
            [4.05, 50.29], [4.15, 49.97], [4.44, 49.94], [4.83, 50.17], [4.87, 49.79],
            [5.47, 49.50], [5.84, 49.54], [6.34, 49.46], [6.73, 49.17], [7.19, 49.12],
            [7.42, 48.87], [7.90, 48.67], [8.23, 48.97], [7.70, 47.54], [7.02, 47.32],
            [6.24, 46.86], [6.04, 46.43], [6.80, 46.14], [6.76, 45.78], [7.04, 45.93],
            [6.75, 45.14], [7.10, 44.85], [6.63, 44.13], [7.38, 43.76], [7.85, 43.77],
            [7.53, 43.78], [6.94, 43.50], [6.19, 43.07], [5.24, 43.42], [4.81, 43.40],
            [3.94, 43.54], [3.40, 43.27], [3.17, 42.43], [1.79, 42.50], [0.70, 42.80],
            [-0.05, 42.69], [-1.57, 43.08], [-1.77, 43.36], [-1.41, 43.27], [-1.38, 44.02],
            [-1.07, 44.30], [-1.15, 44.66], [-1.25, 44.64], [-1.02, 45.35], [-0.55, 45.93],
            [-1.19, 45.83], [-1.09, 46.01], [-1.26, 46.26], [-2.00, 46.61], [-2.20, 47.06],
            [-2.96, 47.29], [-4.11, 47.35], [-4.49, 47.95], [-2.79, 48.56], [-1.95, 48.65],
            [-1.62, 48.38], [-1.93, 48.73], [-1.38, 48.65], [-1.57, 49.20], [-1.19, 49.36],
            [-0.98, 49.35], [0.20, 49.45], [0.19, 49.70], [1.26, 49.99], [1.59, 49.96],
            [1.87, 50.11], [2.51, 51.15]
        ]]
    },

    // ESPAGNE
    ESP: {
        isMain: false,
        coordinates: [[
            [-9.03, 41.88], [-8.98, 42.59], [-9.29, 43.02], [-7.98, 43.75], [-7.59, 43.73],
            [-6.22, 43.57], [-5.69, 43.59], [-4.53, 43.40], [-3.58, 43.52], [-1.77, 43.36],
            [-1.57, 43.08], [-0.05, 42.69], [0.70, 42.80], [1.79, 42.50], [3.17, 42.43],
            [3.32, 42.33], [3.04, 41.79], [2.09, 41.29], [0.81, 41.01], [0.72, 40.68],
            [0.11, 40.12], [-0.33, 39.49], [0.11, 38.74], [-0.53, 38.33], [-0.65, 37.64],
            [-1.44, 37.44], [-1.74, 37.46], [-2.11, 36.71], [-4.37, 36.71], [-4.99, 36.32],
            [-5.38, 35.95], [-5.87, 36.03], [-6.24, 36.37], [-6.93, 37.19], [-7.41, 37.18],
            [-7.50, 37.53], [-6.95, 38.19], [-7.03, 38.88], [-7.17, 38.89], [-7.34, 39.47],
            [-7.04, 39.67], [-7.02, 40.18], [-6.86, 40.33], [-6.85, 41.11], [-6.21, 41.57],
            [-6.54, 41.69], [-7.45, 41.86], [-8.02, 41.79], [-8.27, 42.14], [-8.67, 42.13],
            [-9.03, 41.88]
        ]]
    },

    // ITALIE (mainland + Sicile + Sardaigne)
    ITA: {
        isMain: false,
        coordinates: [
            // Péninsule principale
            [
                [6.63, 45.12], [7.04, 45.93], [6.76, 46.16], [6.80, 46.43], [7.10, 46.50],
                [8.43, 46.46], [8.47, 46.03], [9.02, 46.03], [9.30, 46.56], [9.93, 46.32],
                [10.44, 46.89], [11.15, 46.93], [11.16, 46.70], [12.15, 47.08], [12.27, 46.84],
                [13.81, 46.51], [13.70, 45.60], [13.94, 45.59], [13.14, 45.74], [12.33, 45.38],
                [12.59, 44.09], [13.63, 43.73], [14.24, 42.43], [15.19, 41.92], [15.97, 41.94],
                [16.02, 41.44], [17.25, 40.40], [18.53, 40.10], [18.49, 39.35], [17.99, 38.77],
                [16.57, 38.71], [16.01, 37.96], [15.76, 37.91], [15.65, 38.00], [15.70, 38.21],
                [15.90, 38.76], [16.11, 38.96], [15.69, 40.03], [14.87, 40.60], [14.46, 40.63],
                [13.85, 41.12], [12.63, 41.47], [11.28, 42.36], [11.15, 42.41], [10.51, 42.93],
                [10.02, 44.01], [9.09, 44.07], [8.73, 44.38], [8.01, 43.69], [7.53, 43.78],
                [7.04, 44.85], [6.63, 45.12]
            ],
            // Sicile
            [
                [15.09, 36.62], [15.28, 37.13], [15.10, 37.52], [15.65, 38.00], [15.56, 38.30],
                [14.51, 38.04], [13.70, 37.54], [12.43, 37.80], [12.57, 38.08], [13.36, 38.18],
                [13.35, 37.94], [12.84, 37.57], [12.44, 37.80], [12.57, 37.58], [13.33, 37.35],
                [15.09, 36.62]
            ],
            // Sardaigne
            [
                [9.63, 41.21], [9.81, 40.50], [9.67, 39.18], [9.02, 39.24], [8.41, 38.97],
                [8.39, 39.28], [8.19, 40.50], [8.78, 40.91], [9.21, 41.27], [9.63, 41.21]
            ]
        ]
    },

    // ROUMANIE
    ROU: {
        isMain: false,
        coordinates: [[
            [22.71, 47.88], [23.14, 48.10], [24.40, 47.98], [24.87, 47.74], [25.21, 47.89],
            [26.62, 48.22], [27.23, 47.83], [27.77, 47.23], [28.95, 46.29], [29.00, 45.60],
            [29.68, 45.26], [29.63, 44.84], [28.89, 44.91], [28.56, 43.71], [27.09, 44.11],
            [25.50, 43.67], [24.03, 43.74], [22.94, 43.82], [22.37, 44.01], [22.50, 44.47],
            [22.15, 44.48], [21.56, 44.77], [21.48, 45.18], [20.87, 45.42], [20.26, 46.13],
            [21.02, 46.32], [21.63, 46.99], [22.10, 47.67], [22.71, 47.88]
        ]]
    },

    // LITUANIE
    LTU: {
        isMain: false,
        coordinates: [[
            [21.05, 56.03], [21.09, 55.89], [22.83, 55.41], [22.84, 54.90], [22.77, 54.36],
            [23.80, 53.94], [24.58, 53.98], [25.86, 54.17], [26.49, 55.62], [26.59, 55.17],
            [25.77, 54.85], [25.54, 54.32], [24.45, 53.91], [23.49, 53.95], [23.37, 54.20],
            [22.77, 54.36], [22.83, 54.90], [22.84, 55.41], [21.09, 55.89], [21.05, 56.03]
        ]]
    },

    // GRÈCE (mainland + quelques îles principales)
    GRC: {
        isMain: false,
        coordinates: [
            // Continent
            [
                [20.00, 39.71], [19.98, 39.69], [20.19, 39.34], [20.77, 38.77], [21.11, 38.38],
                [21.35, 37.92], [21.82, 36.84], [22.76, 36.79], [22.72, 37.54], [23.19, 37.95],
                [23.71, 37.95], [24.02, 38.22], [24.04, 38.39], [23.65, 38.35], [23.25, 38.61],
                [22.84, 38.60], [23.01, 39.10], [22.38, 39.34], [22.92, 40.59], [22.95, 41.09],
                [24.06, 41.53], [25.29, 41.24], [26.04, 40.62], [26.29, 40.94], [26.60, 41.34],
                [26.12, 41.83], [24.93, 41.58], [23.88, 41.46], [23.35, 42.03], [22.95, 41.34],
                [22.88, 41.99], [22.38, 42.32], [21.92, 42.30], [21.06, 40.85], [20.98, 40.86],
                [20.72, 40.28], [20.15, 39.62], [20.00, 39.71]
            ],
            // Crète
            [
                [23.51, 35.28], [24.02, 35.09], [25.77, 35.04], [26.29, 35.30], [26.17, 35.00],
                [24.72, 34.92], [23.51, 35.28]
            ]
        ]
    },

    // CROATIE
    HRV: {
        isMain: false,
        coordinates: [[
            [13.66, 45.46], [14.57, 45.66], [14.92, 45.08], [15.33, 45.03], [15.28, 44.23],
            [16.02, 44.04], [16.50, 44.18], [17.07, 43.55], [17.63, 42.90], [17.67, 42.92],
            [18.45, 42.57], [18.52, 42.41], [17.87, 42.75], [17.00, 43.30], [16.92, 43.64],
            [17.30, 43.45], [17.00, 43.55], [16.85, 43.74], [16.30, 44.08], [15.96, 43.50],
            [15.75, 43.93], [15.17, 44.24], [14.85, 44.12], [14.51, 45.03], [14.24, 45.15],
            [13.95, 44.82], [13.66, 45.46]
        ]]
    },

    // FINLANDE
    FIN: {
        isMain: false,
        coordinates: [[
            [20.65, 60.04], [21.07, 59.04], [22.87, 59.85], [23.67, 59.99], [24.74, 59.81],
            [25.66, 60.11], [26.46, 60.42], [27.80, 60.54], [29.14, 61.17], [28.07, 63.55],
            [27.43, 64.44], [26.00, 64.92], [24.93, 65.07], [24.16, 65.81], [21.25, 65.03],
            [21.37, 64.41], [21.67, 63.58], [22.18, 63.42], [21.21, 62.03], [21.54, 61.70],
            [20.65, 60.04]
        ]]
    },

    // CHYPRE
    CYP: {
        isMain: false,
        coordinates: [[
            [32.26, 35.10], [33.16, 35.17], [34.00, 35.06], [34.57, 35.67], [34.64, 35.18],
            [34.05, 34.98], [32.94, 34.57], [32.49, 34.70], [32.26, 35.10]
        ]]
    }
};

// Conversion lat/lon vers coordonnées 3D sur une sphère
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Créer les contours d'un pays (supporte multi-polygones)
function createCountryOutline(
    coordinates: number[][][],
    radius: number,
    color: number,
    opacity: number,
    isMain: boolean
): THREE.Group {
    const group = new THREE.Group();

    // Chaque élément de coordinates est un polygone (un pays peut avoir plusieurs polygones pour les îles)
    coordinates.forEach((polygon) => {
        const points: THREE.Vector3[] = [];

        // Convertir chaque point [lon, lat] en position 3D sur la sphère
        polygon.forEach(([lon, lat]) => {
            points.push(latLonToVector3(lat, lon, radius));
        });

        // Fermer le polygone en ajoutant le premier point à la fin si ce n'est pas déjà fait
        if (points.length > 0) {
            const first = points[0];
            const last = points[points.length - 1];
            if (first.distanceTo(last) > 0.001) {
                points.push(first.clone());
            }
        }

        // Créer la géométrie de ligne
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        // Ligne principale (contour net)
        const mainMaterial = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            linewidth: 2,
        });
        const mainLine = new THREE.LineLoop(geometry, mainMaterial);
        group.add(mainLine);

        // Couche de glow 1 (proche, assez opaque)
        const glow1Material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity * 0.7,
            linewidth: 4,
        });
        const glow1Line = new THREE.LineLoop(geometry.clone(), glow1Material);
        group.add(glow1Line);

        // Couche de glow 2 (plus large, plus diffuse)
        const glow2Material = new THREE.LineBasicMaterial({
            color: color,
            transparent: true,
            opacity: opacity * 0.4,
            linewidth: 6,
        });
        const glow2Line = new THREE.LineLoop(geometry.clone(), glow2Material);
        group.add(glow2Line);

        // Couche de glow 3 (très large, très diffuse) - surtout pour les pays non-principaux
        if (!isMain) {
            const glow3Material = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: opacity * 0.3,
                linewidth: 8,
            });
            const glow3Line = new THREE.LineLoop(geometry.clone(), glow3Material);
            group.add(glow3Line);
        }

        // Créer un remplissage semi-transparent pour mieux voir la forme
        if (points.length >= 3) {
            const vertices: number[] = [];
            const indices: number[] = [];

            // Ajouter tous les points comme vertices
            points.forEach((point) => {
                vertices.push(point.x, point.y, point.z);
            });

            // Triangulation simple en éventail depuis le premier point
            for (let i = 1; i < points.length - 2; i++) {
                indices.push(0, i, i + 1);
            }

            const fillGeometry = new THREE.BufferGeometry();
            fillGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            fillGeometry.setIndex(indices);
            fillGeometry.computeVertexNormals();

            // Opacité du remplissage
            const fillOpacity = isMain ? 0.25 : 0.15;
            const fillMaterial = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: fillOpacity,
                side: THREE.DoubleSide,
            });

            const fillMesh = new THREE.Mesh(fillGeometry, fillMaterial);
            group.add(fillMesh);
        }
    });

    return group;
}

// Créer un arc courbe entre deux points sur le globe
function createArc(start: THREE.Vector3, end: THREE.Vector3, globeRadius: number): THREE.CubicBezierCurve3 {
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const midLength = mid.length();

    // Élever le point de contrôle au-dessus de la surface
    const arcHeight = start.distanceTo(end) * 0.4;
    mid.normalize().multiplyScalar(midLength + arcHeight);

    // Points de contrôle pour une courbe plus lisse
    const control1 = new THREE.Vector3().lerpVectors(start, mid, 0.33);
    control1.normalize().multiplyScalar(globeRadius + arcHeight * 0.5);

    const control2 = new THREE.Vector3().lerpVectors(mid, end, 0.33);
    control2.normalize().multiplyScalar(globeRadius + arcHeight * 0.5);

    return new THREE.CubicBezierCurve3(start, control1, control2, end);
}

// ============================================
// Globe 3D avec contours des pays EU-CONEXUS
// ============================================
// Ce composant affiche un globe 3D interactif avec Three.js qui visualise
// le réseau EU-CONEXUS des 9 universités européennes côtières.
//
// Fonctionnalités :
// - Globe wireframe avec grille de méridiens et parallèles
// - Contours géographiques des 9 pays partenaires (GeoJSON simplifié)
// - Remplissage coloré des pays avec transparence
// - Points lumineux pour chaque université
// - Arcs de connexion depuis La Rochelle vers les autres universités
// - Particules animées le long des arcs
// - Étoiles en arrière-plan
// - Atmosphère lumineuse autour du globe
//
// La France est mise en évidence avec une couleur orange et une opacité plus forte.
// Les coordonnées géographiques sont projetées sur une sphère de rayon 1.2.
// ============================================

function GlobeEffect() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const globeGroupRef = useRef<THREE.Group | null>(null);
    const animationIdRef = useRef<number>(0);
    const particlesRef = useRef<THREE.Points | null>(null);
    const arcParticlesRef = useRef<{ mesh: THREE.Mesh; curve: THREE.CubicBezierCurve3; progress: number; speed: number }[]>([]);
    const timeRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // ========================================
        // Setup Scene, Camera, Renderer
        // ========================================
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Caméra avec zoom sur l'Europe
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        camera.position.z = 2; // Zoom important (était à 4, maintenant à 2.2)
        camera.position.y = 0.5;
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x0A1628, 1);
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // ========================================
        // Globe Group (pour rotation)
        // ========================================
        const globeGroup = new THREE.Group();

        // Centrage sur l'Europe centrale (autour de 10°E, 50°N)
        // Pour avoir une vue optimale des 9 pays EU-CONEXUS
        const europeCenterLon = 10.0; // Centre de l'Europe (entre France et Roumanie)

        // Rotation pour centrer l'Europe face à la caméra
        globeGroup.rotation.y = (90 - (europeCenterLon + 180)) * (Math.PI / 180);

        // Inclinaison pour bien voir l'Europe (légèrement plus inclinée)
        globeGroup.rotation.x = 0.3; // Angle optimisé pour l'Europe

        scene.add(globeGroup);
        globeGroupRef.current = globeGroup;

        const GLOBE_RADIUS = 1.2;

        // ========================================
        // Globe Wireframe
        // ========================================
        // Sphère principale (wireframe)
        const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 32);
        const globeMaterial = new THREE.MeshBasicMaterial({
            color: 0x1A2942,
            wireframe: true,
            transparent: true,
            opacity: 0.15,
        });
        const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
        globeGroup.add(globeMesh);

        // Grille de latitude/longitude plus visible
        const gridMaterial = new THREE.LineBasicMaterial({
            color: 0x2980B9,
            transparent: true,
            opacity: 0.3,
        });

        // Méridiens (longitude)
        for (let i = 0; i < 12; i++) {
            const curve = new THREE.EllipseCurve(0, 0, GLOBE_RADIUS, GLOBE_RADIUS, 0, Math.PI * 2, false, 0);
            const points = curve.getPoints(64);
            const geometry = new THREE.BufferGeometry().setFromPoints(
                points.map(p => new THREE.Vector3(p.x, p.y, 0))
            );
            const line = new THREE.Line(geometry, gridMaterial);
            line.rotation.y = (i / 12) * Math.PI;
            globeGroup.add(line);
        }

        // Parallèles (latitude)
        for (let i = 1; i < 6; i++) {
            const lat = (i / 6) * Math.PI - Math.PI / 2;
            const radius = Math.cos(lat) * GLOBE_RADIUS;
            const y = Math.sin(lat) * GLOBE_RADIUS;

            const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
            const points = curve.getPoints(64);
            const geometry = new THREE.BufferGeometry().setFromPoints(
                points.map(p => new THREE.Vector3(p.x, y, p.y))
            );
            const line = new THREE.Line(geometry, gridMaterial);
            globeGroup.add(line);
        }

        // ========================================
        // Contours des pays EU-CONEXUS (vraies frontières)
        // ========================================

        // Légèrement au-dessus du globe pour éviter le z-fighting
        const COUNTRY_RADIUS = GLOBE_RADIUS + 0.003;

        // Rendu des 9 pays avec leurs vraies frontières géographiques
        Object.values(EU_CONEXUS_COUNTRIES).forEach((data) => {
            const color = data.isMain ? 0xE74C3C : 0xF39C12; // Orange vif pour la France, orange clair pour les autres (meilleur contraste)
            const opacity = data.isMain ? 1.0 : 0.95; // Opacité très élevée pour bien voir tous les pays

            const countryOutline = createCountryOutline(
                data.coordinates,
                COUNTRY_RADIUS,
                color,
                opacity,
                data.isMain
            );

            globeGroup.add(countryOutline);
        });

        // ========================================
        // Atmosphère (glow)
        // ========================================
        const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 32, 32);
        const atmosphereMaterial = new THREE.ShaderMaterial({
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.16, 0.5, 0.72, 1.0) * intensity * 0.5;
        }
      `,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide,
            transparent: true,
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        globeGroup.add(atmosphere);

        // ========================================
        // Points des universités
        // ========================================
        const laRochellePosition = latLonToVector3(
            EU_CONEXUS_UNIVERSITIES[0].lat,
            EU_CONEXUS_UNIVERSITIES[0].lon,
            GLOBE_RADIUS
        );

        EU_CONEXUS_UNIVERSITIES.forEach((uni) => {
            const position = latLonToVector3(uni.lat, uni.lon, GLOBE_RADIUS);

            // Taille et couleur selon si c'est La Rochelle ou non
            const pointSize = uni.isMain ? 0.06 : 0.04;
            const pointColor = uni.isMain ? 0xE74C3C : 0x5DADE2;

            // Sphère principale
            const pointGeometry = new THREE.SphereGeometry(pointSize, 16, 16);
            const pointMaterial = new THREE.MeshBasicMaterial({
                color: pointColor,
                transparent: true,
                opacity: 0.9,
            });
            const point = new THREE.Mesh(pointGeometry, pointMaterial);
            point.position.copy(position);
            globeGroup.add(point);

            // Glow autour du point
            const glowGeometry = new THREE.SphereGeometry(pointSize * 2.5, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: pointColor,
                transparent: true,
                opacity: 0.3,
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            glow.position.copy(position);
            globeGroup.add(glow);

            // Ring pour La Rochelle (plus visible)
            if (uni.isMain) {
                const ringGeometry = new THREE.RingGeometry(0.08, 0.12, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: 0xE74C3C,
                    transparent: true,
                    opacity: 0.8,
                    side: THREE.DoubleSide,
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(position);
                ring.lookAt(0, 0, 0);
                globeGroup.add(ring);
            }
        });

        // ========================================
        // Arcs de connexion
        // ========================================
        const arcMaterial = new THREE.LineBasicMaterial({
            color: 0x5DADE2,
            transparent: true,
            opacity: 0.6,
        });

        // Créer des arcs depuis La Rochelle vers chaque autre université
        EU_CONEXUS_UNIVERSITIES.slice(1).forEach((uni) => {
            const endPosition = latLonToVector3(uni.lat, uni.lon, GLOBE_RADIUS);
            const arc = createArc(laRochellePosition, endPosition, GLOBE_RADIUS);

            const arcPoints = arc.getPoints(50);
            const arcGeometry = new THREE.BufferGeometry().setFromPoints(arcPoints);
            const arcLine = new THREE.Line(arcGeometry, arcMaterial);
            globeGroup.add(arcLine);

            // Particule animée le long de l'arc
            const particleGeometry = new THREE.SphereGeometry(0.02, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: 0x5DADE2,
                transparent: true,
                opacity: 1,
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            globeGroup.add(particle);

            arcParticlesRef.current.push({
                mesh: particle,
                curve: arc,
                progress: Math.random(), // Décalage aléatoire
                speed: 0.003 + Math.random() * 0.002,
            });
        });

        // ========================================
        // Particules de fond (étoiles)
        // ========================================
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 500;
        const starsPositions = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 3 + Math.random() * 3;

            starsPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            starsPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            starsPositions[i * 3 + 2] = radius * Math.cos(phi);
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPositions, 3));

        const starsMaterial = new THREE.PointsMaterial({
            color: 0x5DADE2,
            size: 0.015,
            transparent: true,
            opacity: 0.6,
        });

        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);
        particlesRef.current = stars;

        // ========================================
        // Animation Loop
        // ========================================
        const animate = () => {
            animationIdRef.current = requestAnimationFrame(animate);
            timeRef.current += 0.016;

            // Rotation du globe - DÉSACTIVÉE POUR DEBUG
            // if (globeGroupRef.current) {
            //     globeGroupRef.current.rotation.y += 0.002;
            // }

            // Animation des particules sur les arcs
            arcParticlesRef.current.forEach((arcParticle) => {
                arcParticle.progress += arcParticle.speed;
                if (arcParticle.progress > 1) {
                    arcParticle.progress = 0;
                }

                const point = arcParticle.curve.getPoint(arcParticle.progress);
                arcParticle.mesh.position.copy(point);

                // Pulse d'opacité
                const mat = arcParticle.mesh.material as THREE.MeshBasicMaterial;
                mat.opacity = 0.5 + Math.sin(arcParticle.progress * Math.PI) * 0.5;
            });

            // Animation des étoiles
            if (particlesRef.current) {
                particlesRef.current.rotation.y += 0.0002;
                particlesRef.current.rotation.x += 0.0001;
            }

            // Rendu
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };

        animate();

        // ========================================
        // Resize Handler
        // ========================================
        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

            const newWidth = containerRef.current.clientWidth;
            const newHeight = containerRef.current.clientHeight;

            cameraRef.current.aspect = newWidth / newHeight;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(newWidth, newHeight);
        };

        window.addEventListener('resize', handleResize);

        // ========================================
        // Cleanup
        // ========================================
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationIdRef.current);

            // Dispose all geometries and materials
            scene.traverse((object) => {
                if (object instanceof THREE.Mesh) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
                if (object instanceof THREE.Line) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
                if (object instanceof THREE.Points) {
                    object.geometry.dispose();
                    if (Array.isArray(object.material)) {
                        object.material.forEach(m => m.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });

            renderer.dispose();

            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }

            arcParticlesRef.current = [];
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
            style={{ background: 'linear-gradient(to bottom, #0A1628, #152A45)' }}
        >
            {/* Label EU-CONEXUS */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center pointer-events-none">
                <p className="text-primary-light text-lg font-medium opacity-70">
                    Réseau EU-CONEXUS
                </p>
                <p className="text-text-muted text-sm opacity-50">
                    9 universités européennes côtières
                </p>
            </div>

            {/* Légende des pays */}
            <div className="absolute top-8 right-8 bg-surface/60 backdrop-blur-md rounded-lg px-4 py-3 pointer-events-none">
                <h3 className="text-primary-light text-sm font-semibold mb-2 opacity-80">
                    Réseau EU-CONEXUS
                </h3>
                <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#E74C3C', boxShadow: '0 0 8px #E74C3C' }}></div>
                        <span className="text-text-muted opacity-70">France (La Rochelle)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F39C12', boxShadow: '0 0 6px #F39C12' }}></div>
                        <span className="text-text-muted opacity-70">8 autres pays partenaires</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IdleMode;
