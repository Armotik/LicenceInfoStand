import { useEffect, useCallback } from 'react';
import { useAppStore } from '../../stores/appStore';
import type { DemoType } from '../../types';

// ============================================
// Mapping des touches vers les démos
// ============================================

const DEMO_SHORTCUTS: Record<string, DemoType> = {
  '1': 'body-tracking',
  '2': 'sorting',
  '3': 'pathfinding',
  '4': 'mandelbrot',
  '5': 'boids',
  '6': 'game-of-life',
};

// ============================================
// Hook principal
// ============================================

export function useKeyboardNavigation() {
  const {
    mode,
    toggleMode,
    returnToIdle,
    nextIdleEffect,
    previousIdleEffect,
    nextUniverse,
    previousUniverse,
    nextSection,
    previousSection,
    startDemo,
    stopDemo,
    toggleFullscreen,
    toggleHelp,
    toggleDebug,
    recordInteraction,
  } = useAppStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Toujours enregistrer l'interaction
    recordInteraction();
    
    // Ignorer si on est dans un input
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    const { key, code } = event;

    // ========================================
    // Raccourcis globaux (tous les modes)
    // ========================================
    
    // Espace : basculer mode veille ↔ présentation
    if (code === 'Space') {
      event.preventDefault();
      if (mode === 'demo') {
        stopDemo();
      } else {
        toggleMode();
      }
      return;
    }

    // Escape : retour mode veille / fermer démo
    if (key === 'Escape') {
      event.preventDefault();
      if (mode === 'demo') {
        stopDemo();
      } else {
        returnToIdle();
      }
      return;
    }

    // F : plein écran
    if (key.toLowerCase() === 'f') {
      event.preventDefault();
      toggleFullscreen();
      return;
    }

    // H : aide
    if (key.toLowerCase() === 'h') {
      event.preventDefault();
      toggleHelp();
      return;
    }

    // D : debug (dev only)
    if (key.toLowerCase() === 'd' && event.ctrlKey) {
      event.preventDefault();
      toggleDebug();
      return;
    }

    // ========================================
    // Raccourcis mode veille
    // ========================================
    
    if (mode === 'idle') {
      // Flèches gauche/droite : changer effet
      if (key === 'ArrowRight') {
        event.preventDefault();
        nextIdleEffect();
        return;
      }
      if (key === 'ArrowLeft') {
        event.preventDefault();
        previousIdleEffect();
        return;
      }
    }

    // ========================================
    // Raccourcis mode présentation
    // ========================================
    
    if (mode === 'presenter') {
      // Flèches gauche/droite : changer univers
      if (key === 'ArrowRight') {
        event.preventDefault();
        nextUniverse();
        return;
      }
      if (key === 'ArrowLeft') {
        event.preventDefault();
        previousUniverse();
        return;
      }
      
      // Flèches haut/bas : naviguer dans les sections
      if (key === 'ArrowDown') {
        event.preventDefault();
        nextSection();
        return;
      }
      if (key === 'ArrowUp') {
        event.preventDefault();
        previousSection();
        return;
      }

      // Touches numériques : lancer démo directe
      if (DEMO_SHORTCUTS[key]) {
        event.preventDefault();
        startDemo(DEMO_SHORTCUTS[key]);
        return;
      }
    }

    // ========================================
    // Raccourcis mode démo
    // ========================================
    
    if (mode === 'demo') {
      // Les démos peuvent avoir leurs propres raccourcis
      // gérés dans leurs composants respectifs
    }

  }, [
    mode,
    toggleMode,
    returnToIdle,
    nextIdleEffect,
    previousIdleEffect,
    nextUniverse,
    previousUniverse,
    nextSection,
    previousSection,
    startDemo,
    stopDemo,
    toggleFullscreen,
    toggleHelp,
    toggleDebug,
    recordInteraction,
  ]);

  // Attacher l'écouteur
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}

// ============================================
// Hook pour détecter l'inactivité
// ============================================

export function useIdleTimeout(timeoutMs: number = 60000) {
  const { mode, returnToIdle, recordInteraction } = useAppStore();

  useEffect(() => {
    // Ne pas activer le timeout en mode veille
    if (mode === 'idle') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        returnToIdle();
      }, timeoutMs);
    };

    // Événements qui reset le timeout
    const events = ['mousemove', 'mousedown', 'touchstart', 'keydown'];
    
    const handleActivity = () => {
      recordInteraction();
      resetTimeout();
    };

    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Démarrer le premier timeout
    resetTimeout();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [mode, timeoutMs, returnToIdle, recordInteraction]);
}

// ============================================
// Hook pour fullscreen sync
// ============================================

export function useFullscreenSync() {
  const { isFullscreen } = useAppStore();

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      if (isCurrentlyFullscreen !== isFullscreen) {
        useAppStore.setState({ isFullscreen: isCurrentlyFullscreen });
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isFullscreen]);
}
