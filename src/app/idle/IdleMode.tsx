import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../stores/appStore';
import { useCanvas } from '../../shared/hooks';
import type { CanvasContext, AnimationState, IdleEffect } from '../../types';

// ============================================
// Composant principal IdleMode
// ============================================

export function IdleMode() {
  const { currentIdleEffect } = useAppStore();

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
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-display font-bold text-white mb-4 text-glow-strong">
            Licence Informatique
          </h1>
          <p className="text-2xl md:text-3xl text-primary-light font-light">
            La Rochelle Université
          </p>
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
      </div>
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
// Placeholder pour Boids Effect
// ============================================

function BoidsEffect() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <p className="text-text-muted text-2xl">Simulation Boids - À implémenter (Phase 2)</p>
    </div>
  );
}

// ============================================
// Placeholder pour Neural Network Effect
// ============================================

function NeuralNetworkEffect() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <p className="text-text-muted text-2xl">Réseau Neural - À implémenter (Phase 2)</p>
    </div>
  );
}

// ============================================
// Placeholder pour Globe Effect
// ============================================

function GlobeEffect() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-surface">
      <p className="text-text-muted text-2xl">Globe 3D - À implémenter (Phase 2)</p>
    </div>
  );
}

export default IdleMode;
