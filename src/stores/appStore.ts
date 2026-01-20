import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  AppState, 
  AppActions, 
  AppMode, 
  IdleEffect, 
  ThemeUniverse, 
  DemoType 
} from '../types';

// ============================================
// Configuration
// ============================================

const IDLE_EFFECTS: IdleEffect[] = ['matrix', 'boids', 'neural'];
const UNIVERSES: ThemeUniverse[] = [
  'formation',
  'vie-etudiante', 
  'la-rochelle',
  'systeme-universitaire',
  'demos'
];

const IDLE_TIMEOUT_MS = 60000; // 1 minute d'inactivité → retour mode veille

// ============================================
// État initial
// ============================================

const initialState: AppState = {
  // Mode
  mode: 'idle',
  previousMode: null,
  
  // Idle
  currentIdleEffect: 'matrix',
  idleEffectIndex: 0, // Index de 'matrix' dans IDLE_EFFECTS

  // Presenter
  currentUniverse: 'formation',
  currentSectionIndex: 0,
  
  // Demo
  currentDemo: null,
  isDemoActive: false,
  
  // UI
  isFullscreen: false,
  showHelp: false,
  showDebug: false,
  showIdleTitle: true,

  // Interaction
  lastInteraction: Date.now(),
  idleTimeoutMs: IDLE_TIMEOUT_MS,
};

// ============================================
// Store
// ============================================

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    // ----------------------------------------
    // Mode Management
    // ----------------------------------------
    
    setMode: (mode: AppMode) => {
      const currentMode = get().mode;
      if (mode === currentMode) return;
      
      set({
        mode,
        previousMode: currentMode,
        lastInteraction: Date.now(),
        // Reset section index when changing mode
        currentSectionIndex: 0,
      });
    },

    toggleMode: () => {
      const { mode } = get();
      const newMode: AppMode = mode === 'idle' ? 'presenter' : 'idle';
      get().setMode(newMode);
    },

    returnToIdle: () => {
      set({
        mode: 'idle',
        previousMode: get().mode,
        isDemoActive: false,
        currentDemo: null,
        lastInteraction: Date.now(),
      });
    },

    // ----------------------------------------
    // Idle Mode
    // ----------------------------------------
    
    setIdleEffect: (effect: IdleEffect) => {
      const index = IDLE_EFFECTS.indexOf(effect);
      set({
        currentIdleEffect: effect,
        idleEffectIndex: index >= 0 ? index : 0,
        lastInteraction: Date.now(),
      });
    },

    nextIdleEffect: () => {
      const { idleEffectIndex } = get();
      const newIndex = (idleEffectIndex + 1) % IDLE_EFFECTS.length;
      set({
        idleEffectIndex: newIndex,
        currentIdleEffect: IDLE_EFFECTS[newIndex],
        lastInteraction: Date.now(),
      });
    },

    previousIdleEffect: () => {
      const { idleEffectIndex } = get();
      const newIndex = (idleEffectIndex - 1 + IDLE_EFFECTS.length) % IDLE_EFFECTS.length;
      set({
        idleEffectIndex: newIndex,
        currentIdleEffect: IDLE_EFFECTS[newIndex],
        lastInteraction: Date.now(),
      });
    },

    // ----------------------------------------
    // Presenter Mode
    // ----------------------------------------
    
    setUniverse: (universe: ThemeUniverse) => {
      set({
        currentUniverse: universe,
        currentSectionIndex: 0,
        lastInteraction: Date.now(),
      });
    },

    nextUniverse: () => {
      const { currentUniverse } = get();
      const currentIndex = UNIVERSES.indexOf(currentUniverse);
      const newIndex = (currentIndex + 1) % UNIVERSES.length;
      set({
        currentUniverse: UNIVERSES[newIndex],
        currentSectionIndex: 0,
        lastInteraction: Date.now(),
      });
    },

    previousUniverse: () => {
      const { currentUniverse } = get();
      const currentIndex = UNIVERSES.indexOf(currentUniverse);
      const newIndex = (currentIndex - 1 + UNIVERSES.length) % UNIVERSES.length;
      set({
        currentUniverse: UNIVERSES[newIndex],
        currentSectionIndex: 0,
        lastInteraction: Date.now(),
      });
    },

    setSection: (index: number) => {
      set({
        currentSectionIndex: Math.max(0, index),
        lastInteraction: Date.now(),
      });
    },

    nextSection: () => {
      set((state) => ({
        currentSectionIndex: state.currentSectionIndex + 1,
        lastInteraction: Date.now(),
      }));
    },

    previousSection: () => {
      set((state) => ({
        currentSectionIndex: Math.max(0, state.currentSectionIndex - 1),
        lastInteraction: Date.now(),
      }));
    },

    // ----------------------------------------
    // Demo Mode
    // ----------------------------------------
    
    startDemo: (demo: DemoType) => {
      set({
        mode: 'demo',
        previousMode: get().mode,
        currentDemo: demo,
        isDemoActive: true,
        showIdleTitle: false, // Masquer le HUD automatiquement
        lastInteraction: Date.now(),
      });
    },

    stopDemo: () => {
      const { previousMode } = get();
      set({
        mode: previousMode || 'presenter',
        currentDemo: null,
        isDemoActive: false,
        lastInteraction: Date.now(),
      });
    },

    // ----------------------------------------
    // UI Controls
    // ----------------------------------------
    
    toggleFullscreen: () => {
      const { isFullscreen } = get();
      
      if (!isFullscreen) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      
      set({ 
        isFullscreen: !isFullscreen,
        lastInteraction: Date.now(),
      });
    },

    toggleHelp: () => {
      set((state) => ({ 
        showHelp: !state.showHelp,
        lastInteraction: Date.now(),
      }));
    },

    toggleDebug: () => {
      set((state) => ({ 
        showDebug: !state.showDebug,
        lastInteraction: Date.now(),
      }));
    },

    toggleIdleTitle: () => {
      set((state) => ({
        showIdleTitle: !state.showIdleTitle,
        lastInteraction: Date.now(),
      }));
    },

    // ----------------------------------------
    // Interaction Tracking
    // ----------------------------------------
    
    recordInteraction: () => {
      set({ lastInteraction: Date.now() });
    },
  }))
);

// ============================================
// Selectors
// ============================================

export const selectMode = (state: AppState) => state.mode;
export const selectIsIdle = (state: AppState) => state.mode === 'idle';
export const selectIsPresenter = (state: AppState) => state.mode === 'presenter';
export const selectIsDemo = (state: AppState) => state.mode === 'demo';
export const selectCurrentEffect = (state: AppState) => state.currentIdleEffect;
export const selectCurrentUniverse = (state: AppState) => state.currentUniverse;
export const selectCurrentDemo = (state: AppState) => state.currentDemo;

// ============================================
// Exports
// ============================================

export { IDLE_EFFECTS, UNIVERSES, IDLE_TIMEOUT_MS };
