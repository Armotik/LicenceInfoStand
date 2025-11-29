import { useRef, useEffect, useCallback, useState } from 'react';
import type { CanvasContext, AnimationState } from '../../types';

// ============================================
// Hook useCanvas - Gestion du Canvas 2D
// ============================================

interface UseCanvasOptions {
  onDraw: (ctx: CanvasContext, state: AnimationState) => void;
  onSetup?: (ctx: CanvasContext) => void;
  onCleanup?: () => void;
  fps?: number; // Si défini, limite le framerate
  autoStart?: boolean;
}

export function useCanvas(options: UseCanvasOptions) {
  const {
    onDraw,
    onSetup,
    onCleanup,
    fps,
    autoStart = true,
  } = options;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const isRunningRef = useRef(false);
  const startTimeRef = useRef(0);
  const lastFrameTimeRef = useRef(0);
  const frameCountRef = useRef(0);
  const fpsRef = useRef(60);

  // Calculer l'intervalle minimum entre frames si fps est limité
  const frameIntervalMs = fps ? 1000 / fps : 0;

  // Setup du canvas avec DPR
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Device Pixel Ratio pour netteté
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Taille physique
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale pour le DPR
    ctx.scale(dpr, dpr);

    const canvasContext: CanvasContext = {
      ctx,
      width: rect.width,
      height: rect.height,
      dpr,
    };

    onSetup?.(canvasContext);

    return canvasContext;
  }, [onSetup]);

  // Boucle d'animation
  const animate = useCallback((timestamp: number) => {
    if (!isRunningRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Gestion du timing
    if (startTimeRef.current === 0) {
      startTimeRef.current = timestamp;
      lastFrameTimeRef.current = timestamp;
    }

    const deltaTime = timestamp - lastFrameTimeRef.current;

    // Limiter le FPS si nécessaire
    if (frameIntervalMs && deltaTime < frameIntervalMs) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    // Calculer le FPS réel
    if (deltaTime > 0) {
      fpsRef.current = Math.round(1000 / deltaTime);
    }

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    const canvasContext: CanvasContext = {
      ctx,
      width: rect.width,
      height: rect.height,
      dpr,
    };

    const animationState: AnimationState = {
      frameCount: frameCountRef.current,
      deltaTime,
      elapsedTime: timestamp - startTimeRef.current,
      fps: fpsRef.current,
    };

    // Appeler le callback de dessin
    onDraw(canvasContext, animationState);

    // Mettre à jour les compteurs
    frameCountRef.current++;
    lastFrameTimeRef.current = timestamp;

    // Continuer l'animation
    animationRef.current = requestAnimationFrame(animate);
  }, [onDraw, frameIntervalMs]);

  // Démarrer l'animation
  const start = useCallback(() => {
    if (isRunningRef.current) return;
    
    isRunningRef.current = true;
    startTimeRef.current = 0;
    frameCountRef.current = 0;
    
    animationRef.current = requestAnimationFrame(animate);
  }, [animate]);

  // Arrêter l'animation
  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, []);

  // Gestion du resize
  useEffect(() => {
    const handleResize = () => {
      setupCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [setupCanvas]);

  // Setup initial et démarrage
  useEffect(() => {
    setupCanvas();
    
    if (autoStart) {
      start();
    }

    return () => {
      stop();
      onCleanup?.();
    };
  }, [setupCanvas, start, stop, autoStart, onCleanup]);

  return {
    canvasRef,
    start,
    stop,
    isRunning: isRunningRef.current,
  };
}

// ============================================
// Hook useAnimationFrame - Plus simple
// ============================================

export function useAnimationFrame(callback: (deltaTime: number) => void) {
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [callback]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);
}

// ============================================
// Hook useWindowSize - Taille de la fenêtre
// ============================================

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
}

// ============================================
// Hook useMouse - Position de la souris
// ============================================

export function useMouse() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isInside, setIsInside] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsInside(true);
    };

    const handleMouseLeave = () => {
      setIsInside(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ...position, isInside };
}
