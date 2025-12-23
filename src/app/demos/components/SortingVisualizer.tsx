// ============================================
// SortingVisualizer - Visualisation des algorithmes de tri
// Démo pédagogique et impressionnante pour les futurs bacheliers
// ============================================

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

// ============================================
// Types
// ============================================

type SortAlgorithm = 'bubble' | 'quick' | 'merge' | 'insertion' | 'heap';
type SortingState = 'idle' | 'sorting' | 'paused' | 'completed';

interface ArrayBar {
  value: number;
  state: 'normal' | 'comparing' | 'swapping' | 'sorted' | 'pivot';
}

interface AlgorithmInfo {
  name: string;
  complexity: {
    best: string;
    average: string;
    worst: string;
  };
  description: string;
  color: string;
  howItWorks: string[];
  whyUseIt: string;
  realWorldUses: string[];
  pros: string[];
  cons: string[];
}

// ============================================
// Configuration des algorithmes
// ============================================

const ALGORITHMS: Record<SortAlgorithm, AlgorithmInfo> = {
  bubble: {
    name: 'Tri à bulles (Bubble Sort)',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    description: 'Compare et échange les éléments adjacents. Simple mais inefficace pour de grandes listes.',
    color: '#3498DB',
    howItWorks: [
      '1. Comparer chaque paire d\'éléments adjacents',
      '2. Échanger si dans le mauvais ordre',
      '3. Répéter jusqu\'à ce que le tableau soit trié',
      '4. À chaque passage, le plus grand élément "remonte" à la fin',
    ],
    whyUseIt: 'Algorithme simple à comprendre, idéal pour l\'apprentissage. Détecte si un tableau est déjà trié (O(n)). Rarement utilisé en production à cause de sa lenteur.',
    realWorldUses: [
      'Enseignement et démonstration des concepts de tri',
      'Tri de très petits tableaux (< 10 éléments)',
      'Vérification rapide si un tableau est presque trié',
    ],
    pros: [
      'Très simple à implémenter et comprendre',
      'Tri en place (pas de mémoire supplémentaire)',
      'Stable (conserve l\'ordre des éléments égaux)',
    ],
    cons: [
      'Extrêmement lent sur grandes listes (O(n²))',
      'Beaucoup de comparaisons et d\'échanges inutiles',
      'Jamais utilisé en production',
    ],
  },
  quick: {
    name: 'Tri rapide (Quick Sort)',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    description: 'Divise le tableau autour d\'un pivot. Très efficace en pratique, utilisé dans les bibliothèques standards.',
    color: '#E74C3C',
    howItWorks: [
      '1. Choisir un élément comme pivot (ici : dernier élément)',
      '2. Partitionner : éléments < pivot à gauche, > pivot à droite',
      '3. Placer le pivot à sa position finale',
      '4. Appliquer récursivement sur les sous-tableaux',
    ],
    whyUseIt: 'LE tri le plus utilisé en pratique ! Très rapide en moyenne (O(n log n)) avec faible overhead. C\'est le tri par défaut de JavaScript, Python, Java...',
    realWorldUses: [
      'sort() dans JavaScript, Java, Python',
      'Bases de données pour trier les résultats',
      'Systèmes d\'exploitation pour ordonnancer les tâches',
      'Traitement de grandes quantités de données',
    ],
    pros: [
      'Très rapide en pratique (meilleur cas constant)',
      'Tri en place (peu de mémoire)',
      'Bon pour parallélisation (GPU)',
    ],
    cons: [
      'Pire cas O(n²) si mauvais pivot',
      'Pas stable par défaut',
      'Récursif → risque de stack overflow',
    ],
  },
  merge: {
    name: 'Tri fusion (Merge Sort)',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    description: 'Divise récursivement puis fusionne. Complexité garantie, enseigné en L2.',
    color: '#9B59B6',
    howItWorks: [
      '1. Diviser le tableau en deux moitiés',
      '2. Trier récursivement chaque moitié',
      '3. Fusionner les deux moitiés triées',
      '4. La fusion compare les têtes et prend le plus petit',
    ],
    whyUseIt: 'Garantie de performance O(n log n) même dans le pire cas. Stable et prédictible. Parfait quand la stabilité et la complexité garantie sont critiques.',
    realWorldUses: [
      'Tri de fichiers très volumineux (tri externe)',
      'Tri de listes chaînées',
      'Systèmes temps réel (performance prédictible)',
      'Fusion de plusieurs sources de données triées',
    ],
    pros: [
      'Complexité GARANTIE O(n log n) (même pire cas)',
      'Stable (conserve l\'ordre)',
      'Excellente parallélisation',
    ],
    cons: [
      'Nécessite O(n) mémoire supplémentaire',
      'Plus lent que Quick Sort en pratique',
      'Overhead de la récursion',
    ],
  },
  insertion: {
    name: 'Tri par insertion (Insertion Sort)',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    description: 'Insère chaque élément à sa place dans la partie triée. Efficace sur petits tableaux.',
    color: '#27AE60',
    howItWorks: [
      '1. Commencer avec le premier élément (déjà "trié")',
      '2. Prendre l\'élément suivant',
      '3. L\'insérer à sa place dans la partie triée',
      '4. Répéter jusqu\'à la fin',
    ],
    whyUseIt: 'Excellent pour petits tableaux ou tableaux presque triés. Très rapide si données déjà ordonnées (O(n)). Utilisé en combinaison avec Quick Sort.',
    realWorldUses: [
      'Tri de petits tableaux (< 20 éléments)',
      'Optimisation de Quick/Merge Sort (sous-tableaux)',
      'Tri incrémental (données qui arrivent une par une)',
      'Jeux de cartes (tri en temps réel)',
    ],
    pros: [
      'Simple et intuitif',
      'Très rapide sur petits tableaux',
      'Excellent sur données presque triées',
      'Stable et en place',
    ],
    cons: [
      'Lent sur grandes listes (O(n²))',
      'Beaucoup de déplacements d\'éléments',
    ],
  },
  heap: {
    name: 'Tri par tas (Heap Sort)',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    description: 'Utilise une structure de tas binaire. Complexité garantie sans espace supplémentaire.',
    color: '#F39C12',
    howItWorks: [
      '1. Construire un tas max (arbre binaire où parent > enfants)',
      '2. Échanger la racine (max) avec le dernier élément',
      '3. Réduire la taille du tas et ré-organiser',
      '4. Répéter jusqu\'à ce que le tas soit vide',
    ],
    whyUseIt: 'Combine les avantages de Quick (en place) et Merge (O(n log n) garanti). Parfait quand mémoire limitée et performance garantie nécessaire.',
    realWorldUses: [
      'Systèmes embarqués (mémoire limitée)',
      'Files de priorité (ordonnancement OS)',
      'Algorithme de Dijkstra (plus court chemin)',
      'Top K éléments d\'un flux de données',
    ],
    pros: [
      'Complexité GARANTIE O(n log n)',
      'Tri en place (pas de mémoire extra)',
      'Pas de récursion profonde',
    ],
    cons: [
      'Plus lent que Quick Sort en pratique',
      'Pas stable',
      'Mauvaise localité de cache (accès mémoire dispersés)',
    ],
  },
};

// ============================================
// Composant principal
// ============================================

export function SortingVisualizer() {
  // État
  const [algorithm, setAlgorithm] = useState<SortAlgorithm>('quick');
  const [arraySize, setArraySize] = useState(50);
  const [speed, setSpeed] = useState(50);
  const [array, setArray] = useState<number[]>([]);
  const [bars, setBars] = useState<ArrayBar[]>([]);
  const [state, setState] = useState<SortingState>('idle');
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [showExplanation, setShowExplanation] = useState(false);

  // Refs
  const sortingRef = useRef(false);
  const pausedRef = useRef(false);

  // Générer un nouveau tableau aléatoire
  const generateArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setBars(newArray.map(value => ({ value, state: 'normal' })));
    setState('idle');
    setStats({ comparisons: 0, swaps: 0 });
  }, [arraySize]);

  // Initialisation
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  // Fonction de délai
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Mettre à jour l'état des barres
  const updateBars = async (
    arr: number[],
    comparing: number[] = [],
    swapping: number[] = [],
    sorted: number[] = [],
    pivot?: number
  ) => {
    if (!sortingRef.current) return;

    const newBars = arr.map((value, idx) => {
      let state: ArrayBar['state'] = 'normal';
      if (sorted.includes(idx)) state = 'sorted';
      else if (pivot === idx) state = 'pivot';
      else if (swapping.includes(idx)) state = 'swapping';
      else if (comparing.includes(idx)) state = 'comparing';
      return { value, state };
    });

    setBars(newBars);
    await delay(101 - speed);
  };

  // ============================================
  // Algorithmes de tri
  // ============================================

  // Bubble Sort
  const bubbleSort = async (arr: number[]) => {
    const n = arr.length;
    const sorted: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      if (!sortingRef.current) return;

      for (let j = 0; j < n - i - 1; j++) {
        if (!sortingRef.current) return;

        // Attendre si en pause
        while (pausedRef.current && sortingRef.current) {
          await delay(100);
        }

        setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
        await updateBars(arr, [j, j + 1], [], sorted);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
          await updateBars(arr, [], [j, j + 1], sorted);
        }
      }
      sorted.push(n - i - 1);
    }
    sorted.push(0);
    await updateBars(arr, [], [], sorted);
  };

  // Quick Sort
  const quickSort = async (arr: number[], low = 0, high = arr.length - 1, sorted: number[] = []) => {
    if (low < high && sortingRef.current) {
      const pi = await partition(arr, low, high, sorted);
      if (pi !== -1) {
        await quickSort(arr, low, pi - 1, sorted);
        await quickSort(arr, pi + 1, high, sorted);
      }
    }
    return sorted;
  };

  const partition = async (arr: number[], low: number, high: number, sorted: number[]) => {
    if (!sortingRef.current) return -1;

    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (!sortingRef.current) return -1;

      while (pausedRef.current && sortingRef.current) {
        await delay(100);
      }

      setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
      await updateBars(arr, [j], [], sorted, high);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
        await updateBars(arr, [], [i, j], sorted, high);
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
    await updateBars(arr, [], [i + 1, high], sorted);
    sorted.push(i + 1);

    return i + 1;
  };

  // Merge Sort
  const mergeSort = async (arr: number[], left = 0, right = arr.length - 1, sorted: number[] = []) => {
    if (left < right && sortingRef.current) {
      const mid = Math.floor((left + right) / 2);
      await mergeSort(arr, left, mid, sorted);
      await mergeSort(arr, mid + 1, right, sorted);
      await merge(arr, left, mid, right, sorted);
    }
    if (left === 0 && right === arr.length - 1) {
      const allSorted = Array.from({ length: arr.length }, (_, i) => i);
      await updateBars(arr, [], [], allSorted);
    }
    return sorted;
  };

  const merge = async (arr: number[], left: number, mid: number, right: number, sorted: number[]) => {
    if (!sortingRef.current) return;

    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length && sortingRef.current) {
      while (pausedRef.current && sortingRef.current) {
        await delay(100);
      }

      setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
      await updateBars(arr, [left + i, mid + 1 + j], [], sorted);

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      await updateBars(arr, [], [k], sorted);
      k++;
    }

    while (i < leftArr.length && sortingRef.current) {
      arr[k] = leftArr[i];
      await updateBars(arr, [], [k], sorted);
      i++;
      k++;
    }

    while (j < rightArr.length && sortingRef.current) {
      arr[k] = rightArr[j];
      await updateBars(arr, [], [k], sorted);
      j++;
      k++;
    }
  };

  // Insertion Sort
  const insertionSort = async (arr: number[]) => {
    const sorted: number[] = [0];

    for (let i = 1; i < arr.length; i++) {
      if (!sortingRef.current) return;

      const key = arr[i];
      let j = i - 1;

      await updateBars(arr, [i], [], sorted);

      while (j >= 0 && sortingRef.current) {
        while (pausedRef.current && sortingRef.current) {
          await delay(100);
        }

        setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
        await updateBars(arr, [j, j + 1], [], sorted);

        if (arr[j] > key) {
          arr[j + 1] = arr[j];
          setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
          await updateBars(arr, [], [j, j + 1], sorted);
          j--;
        } else {
          break;
        }
      }

      arr[j + 1] = key;
      sorted.push(i);
      await updateBars(arr, [], [], sorted);
    }

    await updateBars(arr, [], [], Array.from({ length: arr.length }, (_, i) => i));
  };

  // Heap Sort
  const heapSort = async (arr: number[]) => {
    const n = arr.length;

    // Build heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(arr, n, i, []);
    }

    // Extract elements from heap
    const sorted: number[] = [];
    for (let i = n - 1; i > 0; i--) {
      if (!sortingRef.current) return;

      [arr[0], arr[i]] = [arr[i], arr[0]];
      setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
      sorted.unshift(i);
      await updateBars(arr, [], [0, i], sorted);

      await heapify(arr, i, 0, sorted);
    }

    sorted.unshift(0);
    await updateBars(arr, [], [], sorted);
  };

  const heapify = async (arr: number[], n: number, i: number, sorted: number[]) => {
    if (!sortingRef.current) return;

    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      while (pausedRef.current && sortingRef.current) {
        await delay(100);
      }
      setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
      await updateBars(arr, [left, largest], [], sorted);
      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      while (pausedRef.current && sortingRef.current) {
        await delay(100);
      }
      setStats(prev => ({ ...prev, comparisons: prev.comparisons + 1 }));
      await updateBars(arr, [right, largest], [], sorted);
      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setStats(prev => ({ ...prev, swaps: prev.swaps + 1 }));
      await updateBars(arr, [], [i, largest], sorted);
      await heapify(arr, n, largest, sorted);
    }
  };

  // Lancer le tri
  const startSorting = async () => {
    if (state === 'paused') {
      pausedRef.current = false;
      setState('sorting');
      return;
    }

    sortingRef.current = true;
    pausedRef.current = false;
    setState('sorting');
    setStats({ comparisons: 0, swaps: 0 });

    const arrCopy = [...array];

    try {
      switch (algorithm) {
        case 'bubble':
          await bubbleSort(arrCopy);
          break;
        case 'quick':
          await quickSort(arrCopy);
          break;
        case 'merge':
          await mergeSort(arrCopy);
          break;
        case 'insertion':
          await insertionSort(arrCopy);
          break;
        case 'heap':
          await heapSort(arrCopy);
          break;
      }

      if (sortingRef.current) {
        setState('completed');
      }
    } catch (error) {
      console.error('Erreur lors du tri:', error);
    }

    sortingRef.current = false;
  };

  // Pause
  const pauseSorting = () => {
    pausedRef.current = true;
    setState('paused');
  };

  // Stop
  const stopSorting = () => {
    sortingRef.current = false;
    pausedRef.current = false;
    setState('idle');
    generateArray();
  };

  // Nettoyer lors du démontage
  useEffect(() => {
    return () => {
      sortingRef.current = false;
      pausedRef.current = false;
    };
  }, []);

  const algoInfo = ALGORITHMS[algorithm];

  return (
    <div className="w-full h-full flex flex-col bg-surface p-6 gap-6">
      {/* Contrôles supérieurs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sélection algorithme */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Algorithme
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(ALGORITHMS) as SortAlgorithm[]).map((algo) => (
              <button
                key={algo}
                onClick={() => {
                  if (state === 'idle' || state === 'completed') {
                    setAlgorithm(algo);
                    generateArray();
                  }
                }}
                disabled={state === 'sorting' || state === 'paused'}
                className={clsx(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  algorithm === algo
                    ? 'text-white shadow-lg'
                    : 'bg-surface text-text-muted hover:bg-surface-lighter',
                  (state === 'sorting' || state === 'paused') && 'opacity-50 cursor-not-allowed'
                )}
                style={algorithm === algo ? { backgroundColor: ALGORITHMS[algo].color } : {}}
              >
                {ALGORITHMS[algo].name.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Statistiques
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold" style={{ color: algoInfo.color }}>
                {stats.comparisons}
              </div>
              <div className="text-xs text-text-muted">Comparaisons</div>
            </div>
            <div>
              <div className="text-3xl font-bold" style={{ color: algoInfo.color }}>
                {stats.swaps}
              </div>
              <div className="text-xs text-text-muted">Échanges</div>
            </div>
          </div>
        </div>

        {/* Complexité */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-3 block">
            Complexité temporelle
          </label>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Meilleur cas:</span>
              <code className="text-green-400 font-mono">{algoInfo.complexity.best}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Cas moyen:</span>
              <code className="text-yellow-400 font-mono">{algoInfo.complexity.average}</code>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Pire cas:</span>
              <code className="text-red-400 font-mono">{algoInfo.complexity.worst}</code>
            </div>
          </div>
        </div>
      </div>

      {/* Description de l'algorithme */}
      <div
        className="rounded-xl p-4 border-l-4"
        style={{
          backgroundColor: `${algoInfo.color}15`,
          borderColor: algoInfo.color
        }}
      >
        <p className="text-sm text-text">
          <span className="font-bold" style={{ color: algoInfo.color }}>
            {algoInfo.name}
          </span>
          {' : '}
          {algoInfo.description}
        </p>
      </div>

      {/* Section explicative */}
      <div className="bg-surface-light rounded-xl border border-primary-light/20 overflow-hidden">
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-surface transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧮</span>
            <span className="font-bold text-text">Comprendre l'algorithme</span>
          </div>
          <motion.span
            animate={{ rotate: showExplanation ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-text-muted"
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
              <div className="px-4 pb-4 space-y-4 border-t border-primary-light/10">
                {/* Comment ça marche */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2 mt-4">
                    🔍 Comment ça marche ?
                  </h3>
                  <ol className="space-y-1 text-sm text-text-muted">
                    {algoInfo.howItWorks.map((step, idx) => (
                      <li key={idx} className="ml-4">
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pourquoi l'utiliser */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2">
                    💡 Pourquoi utiliser cet algorithme ?
                  </h3>
                  <p className="text-sm text-text-muted">
                    {algoInfo.whyUseIt}
                  </p>
                </div>

                {/* Avantages et Inconvénients */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-bold text-green-400 mb-2">
                      ✅ Avantages
                    </h3>
                    <ul className="space-y-1 text-sm text-text-muted">
                      {algoInfo.pros.map((pro, idx) => (
                        <li key={idx} className="ml-4">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-400 mb-2">
                      ❌ Inconvénients
                    </h3>
                    <ul className="space-y-1 text-sm text-text-muted">
                      {algoInfo.cons.map((con, idx) => (
                        <li key={idx} className="ml-4">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Applications réelles */}
                <div>
                  <h3 className="font-bold text-primary-light mb-2">
                    🌍 Applications dans le monde réel
                  </h3>
                  <ul className="space-y-1 text-sm text-text-muted">
                    {algoInfo.realWorldUses.map((use, idx) => (
                      <li key={idx} className="ml-4">• {use}</li>
                    ))}
                  </ul>
                </div>

                {/* Lien avec la Licence */}
                <div
                  className="rounded-lg p-3 border-l-4"
                  style={{
                    backgroundColor: `${algoInfo.color}10`,
                    borderColor: algoInfo.color
                  }}
                >
                  <h3 className="font-bold mb-2" style={{ color: algoInfo.color }}>
                    🎓 Dans la Licence Informatique
                  </h3>
                  <p className="text-sm text-text-muted">
                    Les algorithmes de tri sont enseignés en <strong>L2</strong> dans l'UE "Algorithmique & Structures de données".
                    Vous apprendrez à analyser leur complexité avec la notation Big O, à comprendre quand utiliser
                    chaque algorithme, et à les implémenter en C et Java. Ces concepts sont essentiels pour
                    devenir un bon développeur et réussir les entretiens techniques !
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Visualisation */}
      <div className="flex-1 bg-surface-light rounded-xl p-4 border border-primary-light/20 flex items-end justify-center gap-0.5 overflow-hidden">
        <AnimatePresence mode="sync">
          {bars.map((bar, idx) => {
            const barColor =
              bar.state === 'sorted' ? '#27AE60' :
              bar.state === 'comparing' ? '#F39C12' :
              bar.state === 'swapping' ? '#E74C3C' :
              bar.state === 'pivot' ? '#9B59B6' :
              algoInfo.color;

            return (
              <motion.div
                key={idx}
                layout
                initial={{ height: 0 }}
                animate={{
                  height: `${(bar.value / 100) * 100}%`,
                }}
                style={{
                  width: `${Math.max(100 / arraySize - 1, 2)}%`,
                  backgroundColor: barColor,
                  boxShadow: bar.state !== 'normal' ? `0 0 10px ${barColor}` : 'none',
                }}
                className="rounded-t transition-all duration-100"
              />
            );
          })}
        </AnimatePresence>
      </div>

      {/* Contrôles inférieurs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Taille du tableau */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-2 block">
            Taille du tableau: {arraySize}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={arraySize}
            onChange={(e) => {
              if (state === 'idle' || state === 'completed') {
                setArraySize(Number(e.target.value));
              }
            }}
            disabled={state === 'sorting' || state === 'paused'}
            className="w-full"
          />
        </div>

        {/* Vitesse */}
        <div className="bg-surface-light rounded-xl p-4 border border-primary-light/20">
          <label className="text-sm font-bold text-text mb-2 block">
            Vitesse: {speed}%
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex gap-2">
          {state === 'idle' || state === 'completed' ? (
            <>
              <button
                onClick={startSorting}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
                style={{ backgroundColor: algoInfo.color }}
              >
                ▶ Démarrer
              </button>
              <button
                onClick={generateArray}
                className="px-6 py-3 rounded-xl font-bold bg-surface-lighter text-text hover:bg-surface-light transition-all"
              >
                🔄 Nouveau
              </button>
            </>
          ) : state === 'sorting' ? (
            <>
              <button
                onClick={pauseSorting}
                className="flex-1 px-6 py-3 rounded-xl font-bold bg-yellow-500 text-white hover:bg-yellow-600 transition-all"
              >
                ⏸ Pause
              </button>
              <button
                onClick={stopSorting}
                className="px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                ⏹ Stop
              </button>
            </>
          ) : (
            <>
              <button
                onClick={startSorting}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-white transition-all"
                style={{ backgroundColor: algoInfo.color }}
              >
                ▶ Reprendre
              </button>
              <button
                onClick={stopSorting}
                className="px-6 py-3 rounded-xl font-bold bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                ⏹ Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-surface-light rounded-xl p-3 border border-primary-light/20">
        <div className="flex flex-wrap justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: algoInfo.color }} />
            <span className="text-text-muted">Non trié</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-yellow-500" />
            <span className="text-text-muted">Comparaison</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500" />
            <span className="text-text-muted">Échange</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500" />
            <span className="text-text-muted">Pivot</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500" />
            <span className="text-text-muted">Trié</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SortingVisualizer;
