import { createMachine, assign } from 'xstate';
import type { ModeContext, AppMode } from '../types';

// ============================================
// Configuration
// ============================================

const IDLE_TIMEOUT_MS = 60000; // 1 minute

// ============================================
// Context initial
// ============================================

const initialContext: ModeContext = {
  previousMode: null,
  currentDemo: null,
  lastInteraction: Date.now(),
};

// ============================================
// Machine à états
// ============================================

export const modeMachine = createMachine({
  id: 'appMode',
  initial: 'idle',
  context: initialContext,
  
  states: {
    // ----------------------------------------
    // Mode Veille - "The Attractor"
    // ----------------------------------------
    idle: {
      entry: ['clearDemo', 'recordInteraction'],
      on: {
        TOGGLE_MODE: {
          target: 'presenter',
          actions: ['setPreviousMode'],
        },
        GO_PRESENTER: {
          target: 'presenter',
          actions: ['setPreviousMode'],
        },
        START_DEMO: {
          target: 'demo',
          actions: ['setDemo', 'setPreviousMode'],
        },
        USER_INTERACTION: {
          actions: ['recordInteraction'],
        },
      },
    },

    // ----------------------------------------
    // Mode Présentation - "The Explorer"
    // ----------------------------------------
    presenter: {
      entry: ['recordInteraction'],
      on: {
        TOGGLE_MODE: {
          target: 'idle',
          actions: ['setPreviousMode'],
        },
        GO_IDLE: {
          target: 'idle',
          actions: ['setPreviousMode'],
        },
        START_DEMO: {
          target: 'demo',
          actions: ['setDemo', 'setPreviousMode'],
        },
        IDLE_TIMEOUT: {
          target: 'idle',
          actions: ['setPreviousMode'],
        },
        USER_INTERACTION: {
          actions: ['recordInteraction'],
        },
      },
      after: {
        [IDLE_TIMEOUT_MS]: {
          target: 'idle',
          actions: ['setPreviousMode'],
        },
      },
    },

    // ----------------------------------------
    // Mode Démo - Interactive
    // ----------------------------------------
    demo: {
      entry: ['recordInteraction'],
      on: {
        STOP_DEMO: [
          {
            target: 'presenter',
            guard: 'wasPreviouslyPresenter',
            actions: ['clearDemo'],
          },
          {
            target: 'idle',
            actions: ['clearDemo'],
          },
        ],
        GO_IDLE: {
          target: 'idle',
          actions: ['clearDemo', 'setPreviousMode'],
        },
        IDLE_TIMEOUT: {
          target: 'idle',
          actions: ['clearDemo', 'setPreviousMode'],
        },
        USER_INTERACTION: {
          actions: ['recordInteraction'],
        },
      },
      after: {
        [IDLE_TIMEOUT_MS * 2]: { // Double timeout pour les démos
          target: 'idle',
          actions: ['clearDemo', 'setPreviousMode'],
        },
      },
    },
  },
}, {
  actions: {
    setPreviousMode: assign({
      previousMode: ({ context }) => {
        // Get current state from machine
        return context.previousMode;
      },
    }),
    
    setDemo: assign({
      currentDemo: ({ event }) => {
        if (event.type === 'START_DEMO') {
          return event.demo;
        }
        return null;
      },
    }),
    
    clearDemo: assign({
      currentDemo: null,
    }),
    
    recordInteraction: assign({
      lastInteraction: () => Date.now(),
    }),
  },
  
  guards: {
    wasPreviouslyPresenter: ({ context }) => {
      return context.previousMode === 'presenter';
    },
  },
});

// ============================================
// Types pour le composant
// ============================================

export type ModeState = 'idle' | 'presenter' | 'demo';

export const getModeFromState = (stateValue: string): AppMode => {
  if (stateValue === 'idle') return 'idle';
  if (stateValue === 'presenter') return 'presenter';
  if (stateValue === 'demo') return 'demo';
  return 'idle';
};
