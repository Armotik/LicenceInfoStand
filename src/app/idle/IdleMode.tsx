import { useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { feature } from 'topojson-client';
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
                                <motion.p
                                    className="text-2xl md:text-3xl text-primary-light font-light"
                                    animate={{ opacity: [0.7, 1, 0.7] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    La Rochelle Université
                                </motion.p>
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
        case 'globe': return <GlobeEffect />;
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

  const BOID_COUNT = 150;
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

/// ============================================
// Globe Effect Placeholder
// ============================================

// ============================================
// CONFIGURATION
// ============================================

// Pays principal (France) - affiché en rouge
const MAIN_COUNTRY = 'FRA';

// Codes ISO des pays partenaires EU-CONEXUS - affichés en bleu
const PARTNER_COUNTRIES = ['ESP', 'ITA', 'ROU', 'LTU', 'GRC', 'HRV', 'FIN', 'CYP'];

// Autres pays européens à afficher en fond - affichés en gris foncé
// Note: Seuls les pays dans ces 3 listes seront affichés sur le globe
const EUROPEAN_COUNTRIES = [
    // Europe de l'Ouest
    'DEU', 'GBR', 'PRT', 'NLD', 'BEL', 'AUT', 'CHE', 'IRL', 'LUX', 'MCO', 'AND',
    // Europe du Nord
    'NOR', 'SWE', 'DNK', 'ISL',
    // Europe de l'Est
    'POL', 'CZE', 'SVK', 'HUN', 'UKR', 'BLR', 'MDA', 'LVA', 'EST',
    // Balkans
    'SRB', 'BIH', 'ALB', 'MKD', 'MNE', 'SVN', 'BGR', 'XKX', // XKX = Kosovo
    // Autres
    'TUR', 'RUS', 'GEO', 'ARM', 'AZE', 'MLT'
];

// Coordonnées des universités EU-CONEXUS
const UNIVERSITIES = [
    { name: 'La Rochelle Université', lat: 46.16, lon: -1.15, country: 'FRA' },
    { name: 'Universidad Católica de Valencia', lat: 39.47, lon: -0.38, country: 'ESP' },
    { name: 'Università del Salento', lat: 40.35, lon: 18.17, country: 'ITA' },
    { name: 'Technical University Bucharest', lat: 44.44, lon: 26.05, country: 'ROU' },
    { name: 'Klaipėda University', lat: 55.71, lon: 21.13, country: 'LTU' },
    { name: 'Agricultural University of Athens', lat: 37.98, lon: 23.73, country: 'GRC' },
    { name: 'University of Zadar', lat: 44.12, lon: 15.23, country: 'HRV' },
    { name: 'XAMK', lat: 60.87, lon: 26.70, country: 'FIN' },
    { name: 'Frederick University', lat: 35.17, lon: 33.36, country: 'CYP' },
];

const LA_ROCHELLE_INDEX = 0;
const GLOBE_RADIUS = 1.2;

// Couleurs
const COLORS = {
    france: {
        fill: new THREE.Color('#E74C3C'),
        fillOpacity: 0.5,
        border: new THREE.Color('#E74C3C'),
        borderOpacity: 1.0,
    },
    partner: {
        fill: new THREE.Color('#5DADE2'),
        fillOpacity: 0.4,
        border: new THREE.Color('#5DADE2'),
        borderOpacity: 0.9,
    },
    background: {
        fill: new THREE.Color('#1A2942'),
        fillOpacity: 0.2,
        border: new THREE.Color('#2C3E50'),
        borderOpacity: 0.3,
    },
    university: {
        laRochelle: new THREE.Color('#E74C3C'),
        partner: new THREE.Color('#5DADE2'),
    },
    dataPacket: {
        outgoing: new THREE.Color('#E74C3C'),
        incoming: new THREE.Color('#5DADE2'),
    }
};

// ============================================
// INTERFACES
// ============================================

interface DataPacket {
    id: number;
    fromIndex: number;
    toIndex: number;
    progress: number;
    speed: number;
    curve: THREE.CubicBezierCurve3;
    mesh: THREE.Mesh;
    isOutgoing: boolean;
}

interface UniversityPoint {
    position: THREE.Vector3;
    mesh: THREE.Mesh;
    glow: THREE.Mesh;
    ring?: THREE.Mesh;
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createCountryGeometry(coordinates: any[], radius: number): THREE.BufferGeometry {
    const positions: number[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const processCoordinates = (coords: any[]) => {
        for (let i = 0; i < coords.length - 1; i++) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [lon1, lat1] = coords[i] as any[];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const [lon2, lat2] = coords[i + 1] as any[];

            const v1 = latLonToVector3(lat1, lon1, radius);
            const v2 = latLonToVector3(lat2, lon2, radius);

            positions.push(v1.x, v1.y, v1.z);
            positions.push(v2.x, v2.y, v2.z);
        }
    };

    if (coordinates.length > 0) {
        if (Array.isArray(coordinates[0][0][0])) {
            // MultiPolygon
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates.forEach((polygon: any[]) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                polygon.forEach((ring: any[]) => {
                    processCoordinates(ring);
                });
            });
        } else if (Array.isArray(coordinates[0][0])) {
            // Polygon
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            coordinates.forEach((ring: any[]) => {
                processCoordinates(ring);
            });
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
}

function createArcCurve(from: THREE.Vector3, to: THREE.Vector3, radius: number): THREE.CubicBezierCurve3 {
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(radius * 1.4); // Arc s'élève au-dessus du globe

    const control1 = new THREE.Vector3().lerpVectors(from, mid, 0.33);
    const control2 = new THREE.Vector3().lerpVectors(mid, to, 0.67);

    return new THREE.CubicBezierCurve3(from, control1, control2, to);
}

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function GlobeEffect() {
    const containerRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const globeGroupRef = useRef<THREE.Group | null>(null);
    const universityPointsRef = useRef<UniversityPoint[]>([]);
    const dataPacketsRef = useRef<DataPacket[]>([]);
    const animationFrameRef = useRef<number>(0);
    const packetIdCounterRef = useRef<number>(0);

    useEffect(() => {
        if (!containerRef.current) return;

        // IMPORTANT: Vider le conteneur au cas où il y aurait déjà un canvas
        // (peut arriver avec React StrictMode qui démonte/remonte)
        while (containerRef.current.firstChild) {
            containerRef.current.removeChild(containerRef.current.firstChild);
        }

        // Stocker la référence du conteneur pour le cleanup
        const container = containerRef.current;

        // ============================================
        // 1. SETUP THREE.JS
        // ============================================
        const scene = new THREE.Scene();
        scene.background = new THREE.Color('#0A1628');
        sceneRef.current = scene;

        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;

        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        // Position de la caméra optimisée pour zoomer sur La Rochelle
        camera.position.set(0, 0, 2); // Zoom: z réduit pour mieux centrer sur La Rochelle
        camera.lookAt(0, 0, 0); // Point de visée au centre pour centrer sur La Rochelle
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lumières
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // ============================================
        // 2. CRÉER LE GLOBE
        // ============================================
        const globeGroup = new THREE.Group();
        globeGroupRef.current = globeGroup;

        // Globe wireframe (très subtil)
        const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x1A2942,
            wireframe: true,
            transparent: true,
            opacity: 0.1,
        });
        const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
        globeGroup.add(sphereMesh);

        // Orientation du globe pour centrer sur La Rochelle (lat: 46.16°, lon: -1.15°)
        const laRochelleLat = 46.16;
        const laRochelleLon = -1.15;
        const laRochellePos = latLonToVector3(laRochelleLat, laRochelleLon, GLOBE_RADIUS);

        // Calculer l'angle de rotation nécessaire
        const targetVector = new THREE.Vector3(0, 0, 1); // Axe Z
        const rotationAxis = new THREE.Vector3().crossVectors(laRochellePos, targetVector).normalize();
        const rotationAngle = Math.acos(laRochellePos.normalize().dot(targetVector));

        // Appliquer la rotation au groupe du globe
        globeGroup.rotateOnAxis(rotationAxis, rotationAngle);



        scene.add(globeGroup);

        // ============================================
        // 3. CHARGER ET AFFICHER LES PAYS
        // ============================================
        const loadCountries = async () => {
            try {
                // Charger le fichier TopoJSON
                const response = await fetch('/data/ne_50m_admin_0_countries_lakes.json');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const topoData = await response.json();

                // Vérifier que le fichier TopoJSON a la structure attendue
                if (!topoData || !topoData.objects) {
                    console.error('Format TopoJSON invalide: objects manquant', topoData);
                    throw new Error('Format TopoJSON invalide: la propriété objects est manquante');
                }

                // Trouver la clé correcte dans objects
                const objectKey = topoData.objects.ne_50m_admin_0_countries_lakes
                    ? 'ne_50m_admin_0_countries_lakes'
                    : Object.keys(topoData.objects)[0];

                if (!objectKey || !topoData.objects[objectKey]) {
                    console.error('Aucun objet pays trouvé dans le TopoJSON', topoData.objects);
                    throw new Error('Aucun objet pays trouvé dans le fichier TopoJSON');
                }


                // Convertir en GeoJSON
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const countriesFeature = feature(topoData, topoData.objects[objectKey]) as any;

                // S'assurer que nous avons un tableau de features
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const features: any[] = countriesFeature.type === 'FeatureCollection'
                    ? countriesFeature.features
                    : [countriesFeature];

                const displayedCountries = { france: 0, partners: 0, background: 0, skipped: 0 };


                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                features.forEach((country: any) => {
                    const countryCode = country.properties.ISO_A3 || country.properties.ADM0_A3;

                    if (!countryCode) {
                        displayedCountries.skipped++;
                        return;
                    }

                    let style: 'france' | 'partner' | 'background' | null = null;

                    if (countryCode === MAIN_COUNTRY) {
                        style = 'france';
                        displayedCountries.france++;
                    } else if (PARTNER_COUNTRIES.includes(countryCode)) {
                        style = 'partner';
                        displayedCountries.partners++;
                    } else if (EUROPEAN_COUNTRIES.includes(countryCode)) {
                        style = 'background';
                        displayedCountries.background++;
                    } else {
                        displayedCountries.skipped++;
                    }

                    if (style) {
                        createCountryMesh(country, style, globeGroup);
                    }
                });


                // ============================================
                // 4. AJOUTER LES POINTS DES UNIVERSITÉS
                // ============================================
                UNIVERSITIES.forEach((uni, index) => {
                    const position = latLonToVector3(uni.lat, uni.lon, GLOBE_RADIUS);
                    const isLaRochelle = index === LA_ROCHELLE_INDEX;

                    // Point principal
                    const radius = isLaRochelle ? 0.04 : 0.025;
                    const geometry = new THREE.SphereGeometry(radius, 16, 16);
                    const material = new THREE.MeshBasicMaterial({
                        color: isLaRochelle ? COLORS.university.laRochelle : COLORS.university.partner,
                    });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.copy(position);
                    globeGroup.add(mesh);

                    // Glow
                    const glowGeometry = new THREE.SphereGeometry(radius * 2, 16, 16);
                    const glowMaterial = new THREE.MeshBasicMaterial({
                        color: isLaRochelle ? COLORS.university.laRochelle : COLORS.university.partner,
                        transparent: true,
                        opacity: isLaRochelle ? 0.4 : 0.3,
                    });
                    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
                    glow.position.copy(position);
                    globeGroup.add(glow);

                    const universityPoint: UniversityPoint = { position, mesh, glow };

                    // Anneau pour La Rochelle
                    if (isLaRochelle) {
                        const ringGeometry = new THREE.RingGeometry(radius * 1.5, radius * 2, 32);
                        const ringMaterial = new THREE.MeshBasicMaterial({
                            color: COLORS.university.laRochelle,
                            transparent: true,
                            opacity: 0.6,
                            side: THREE.DoubleSide,
                        });
                        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                        ring.position.copy(position);
                        ring.lookAt(0, 0, 0);
                        globeGroup.add(ring);
                        universityPoint.ring = ring;
                    }

                    universityPointsRef.current.push(universityPoint);
                });

                // ============================================
                // 5. CRÉER LES ARCS DE CONNEXION
                // ============================================
                const laRochellePos = universityPointsRef.current[LA_ROCHELLE_INDEX].position;

                universityPointsRef.current.forEach((uni, index) => {
                    if (index === LA_ROCHELLE_INDEX) return;

                    const curve = createArcCurve(laRochellePos, uni.position, GLOBE_RADIUS);
                    const points = curve.getPoints(50);
                    const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);

                    const arcMaterial = new THREE.LineBasicMaterial({
                        color: 0x5DADE2,
                        transparent: true,
                        opacity: 0.3,
                    });

                    const arcLine = new THREE.Line(arcGeometry, arcMaterial);
                    globeGroup.add(arcLine);
                });

            } catch (error) {
                console.error('Erreur lors du chargement des pays:', error);
            }
        };

        loadCountries();

        // ============================================
        // 6. FONCTION DE CRÉATION DE PARTICULES
        // ============================================
        const createDataPacket = (fromIndex: number, toIndex: number, isOutgoing: boolean) => {
            // Vérifier que les points existent
            if (!universityPointsRef.current[fromIndex] || !universityPointsRef.current[toIndex]) {
                return;
            }

            const from = universityPointsRef.current[fromIndex].position;
            const to = universityPointsRef.current[toIndex].position;
            const curve = createArcCurve(from, to, GLOBE_RADIUS);

            const geometry = new THREE.SphereGeometry(0.015, 8, 8);
            const material = new THREE.MeshBasicMaterial({
                color: isOutgoing ? COLORS.dataPacket.outgoing : COLORS.dataPacket.incoming,
            });
            const mesh = new THREE.Mesh(geometry, material);
            globeGroup.add(mesh);

            const packet: DataPacket = {
                id: packetIdCounterRef.current++,
                fromIndex,
                toIndex,
                progress: 0,
                speed: 0.005 + Math.random() * 0.005,
                curve,
                mesh,
                isOutgoing,
            };

            dataPacketsRef.current.push(packet);
        };

        // ============================================
        // 7. ANIMATION LOOP
        // ============================================
        let lastPacketTime = 0;
        const PACKET_INTERVAL = 800; // Créer un nouveau paquet toutes les 800ms

        const animate = (time: number) => {
            animationFrameRef.current = requestAnimationFrame(animate);


            // Créer de nouveaux paquets de données seulement si les points des universités sont initialisés
            if (universityPointsRef.current.length === UNIVERSITIES.length && time - lastPacketTime > PACKET_INTERVAL) {
                lastPacketTime = time;

                // Créer un paquet sortant (La Rochelle → université)
                const targetIndex = 1 + Math.floor(Math.random() * (UNIVERSITIES.length - 1));
                createDataPacket(LA_ROCHELLE_INDEX, targetIndex, true);

                // Créer un paquet entrant (université → La Rochelle)
                const sourceIndex = 1 + Math.floor(Math.random() * (UNIVERSITIES.length - 1));
                createDataPacket(sourceIndex, LA_ROCHELLE_INDEX, false);
            }

            // Animer les particules
            dataPacketsRef.current = dataPacketsRef.current.filter((packet) => {
                packet.progress += packet.speed;

                if (packet.progress <= 1) {
                    const point = packet.curve.getPoint(packet.progress);
                    packet.mesh.position.copy(point);
                    return true;
                } else {
                    // Paquet arrivé à destination
                    globeGroup.remove(packet.mesh);
                    packet.mesh.geometry.dispose();
                    (packet.mesh.material as THREE.Material).dispose();
                    return false;
                }
            });

            // Animation des points d'universités (pulse)
            const pulseValue = Math.sin(time * 0.002) * 0.15 + 0.85;
            universityPointsRef.current.forEach((uni, index) => {
                if (index === LA_ROCHELLE_INDEX) {
                    uni.mesh.scale.setScalar(pulseValue);
                    uni.glow.scale.setScalar(pulseValue);
                    if (uni.ring) {
                        uni.ring.scale.setScalar(pulseValue);
                    }
                } else {
                    const smallPulse = Math.sin(time * 0.003 + index) * 0.1 + 0.9;
                    uni.mesh.scale.setScalar(smallPulse);
                    uni.glow.scale.setScalar(smallPulse);
                }
            });

            // Rotation désactivée - le globe reste fixe centré sur La Rochelle
            // globeGroup.rotation.y += 0.0002;

            renderer.render(scene, camera);
        };

        animate(0);

        // ============================================
        // 8. GESTION DU RESIZE
        // ============================================
        const handleResize = () => {
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // ============================================
        // 9. CLEANUP
        // ============================================
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameRef.current);

            // Nettoyer les paquets de données
            dataPacketsRef.current.forEach((packet) => {
                if (globeGroup) {
                    globeGroup.remove(packet.mesh);
                }
                packet.mesh.geometry.dispose();
                (packet.mesh.material as THREE.Material).dispose();
            });

            // Nettoyer le renderer et retirer le canvas
            if (renderer && container && renderer.domElement.parentElement === container) {
                renderer.dispose();
                container.removeChild(renderer.domElement);
            }

            // Réinitialiser les refs
            universityPointsRef.current = [];
            dataPacketsRef.current = [];
        };
    }, []);

    return <div ref={containerRef} className="w-full h-full" />;
}

// ============================================
// FONCTION HELPER POUR CRÉER LES PAYS
// ============================================

function createCountryMesh(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    country: any,
    style: 'france' | 'partner' | 'background',
    group: THREE.Group
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const coordinates = country.geometry.coordinates as any[];
    const styleConfig = COLORS[style];

    // Créer les lignes (contours)
    const geometry = createCountryGeometry(coordinates, GLOBE_RADIUS);

    const material = new THREE.LineBasicMaterial({
        color: styleConfig.border,
        transparent: true,
        opacity: style === 'france' ? 1.0 : style === 'partner' ? 0.9 : 0.5, // Augmenter l'opacité
        // linewidth n'est PAS supporté dans WebGL!
    });

    const lines = new THREE.LineSegments(geometry, material);
    group.add(lines);


    // Animation pulse pour les pays partenaires
    if (style === 'france' || style === 'partner') {
        lines.userData.pulseSpeed = Math.random() * 0.001 + 0.001;
        lines.userData.baseOpacity = styleConfig.borderOpacity;
    }
}

export default IdleMode;