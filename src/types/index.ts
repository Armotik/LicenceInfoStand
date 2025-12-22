// ============================================
// Types globaux - LicenceInfoStand
// ============================================

// Modes de l'application
export type AppMode = 'idle' | 'presenter' | 'demo';

// Univers thématiques du mode présentation
export type ThemeUniverse = 
  | 'formation'
  | 'vie-etudiante'
  | 'la-rochelle'
  | 'systeme-universitaire'
  | 'demos';

// Effets visuels du mode veille
export type IdleEffect = 
  | 'matrix'
  | 'boids'
  | 'neural';

// Démonstrations disponibles
export type DemoType = 
  | 'body-tracking'
  | 'sorting'
  | 'pathfinding'
  | 'mandelbrot'
  | 'boids'
  | 'game-of-life';

// ============================================
// État de l'application
// ============================================

export interface AppState {
  // Mode actuel
  mode: AppMode;
  previousMode: AppMode | null;
  
  // Mode veille
  currentIdleEffect: IdleEffect;
  idleEffectIndex: number;
  
  // Mode présentation
  currentUniverse: ThemeUniverse;
  currentSectionIndex: number;
  
  // Mode démo
  currentDemo: DemoType | null;
  isDemoActive: boolean;
  
  // UI
  isFullscreen: boolean;
  showHelp: boolean;
  showDebug: boolean;
  showIdleTitle: boolean;

  // Idle timeout
  lastInteraction: number;
  idleTimeoutMs: number;
}

// ============================================
// Actions du store
// ============================================

export interface AppActions {
  // Mode management
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
  returnToIdle: () => void;
  
  // Idle mode
  setIdleEffect: (effect: IdleEffect) => void;
  nextIdleEffect: () => void;
  previousIdleEffect: () => void;
  
  // Presenter mode
  setUniverse: (universe: ThemeUniverse) => void;
  nextUniverse: () => void;
  previousUniverse: () => void;
  setSection: (index: number) => void;
  nextSection: () => void;
  previousSection: () => void;
  
  // Demo mode
  startDemo: (demo: DemoType) => void;
  stopDemo: () => void;
  
  // UI
  toggleFullscreen: () => void;
  toggleHelp: () => void;
  toggleDebug: () => void;
  toggleIdleTitle: () => void;

  // Interaction tracking
  recordInteraction: () => void;
}

// ============================================
// Contenu
// ============================================

export interface ContentSection {
  id: string;
  title: string;
  subtitle?: string;
  content: string | React.ReactNode;
  image?: string;
  stats?: StatItem[];
  links?: ContentLink[];
}

export interface StatItem {
  label: string;
  value: string | number;
  icon?: string;
  color?: string;
}

export interface ContentLink {
  label: string;
  url: string;
  external?: boolean;
}

export interface UniverseContent {
  id: ThemeUniverse;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  sections: ContentSection[];
}

// ============================================
// Démos
// ============================================

export interface DemoConfig {
  id: DemoType;
  title: string;
  description: string;
  competences: string[];
  ue: string;
  icon: string;
  requiresCamera: boolean;
  shortcut: string;
}

// ============================================
// Événements clavier
// ============================================

export interface KeyboardShortcut {
  key: string;
  description: string;
  action: () => void;
  modes?: AppMode[];
}

// ============================================
// Canvas / Animation
// ============================================

export interface CanvasContext {
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  dpr: number;
}

export interface AnimationState {
  frameCount: number;
  deltaTime: number;
  elapsedTime: number;
  fps: number;
}

// ============================================
// Machine à états (XState)
// ============================================

export type ModeEvent = 
  | { type: 'TOGGLE_MODE' }
  | { type: 'GO_IDLE' }
  | { type: 'GO_PRESENTER' }
  | { type: 'START_DEMO'; demo: DemoType }
  | { type: 'STOP_DEMO' }
  | { type: 'IDLE_TIMEOUT' }
  | { type: 'USER_INTERACTION' };

export interface ModeContext {
  previousMode: AppMode | null;
  currentDemo: DemoType | null;
  lastInteraction: number;
}
