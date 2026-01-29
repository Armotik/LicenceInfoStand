// ============================================
// Simple ArUco Detector - Version simplifiée
// Détection basique de marqueurs ArUco 4x4
// ============================================

// Déclaration globale pour OpenCV
declare global {
  interface Window {
    cv: any;
  }
}

export interface ArucoMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

// Dictionnaire ArUco 4x4_50 (IDs 0-49)
const ARUCO_4X4_50: { [key: number]: number[][] } = {
  0: [[1,0,0,0],[0,1,1,1],[1,1,0,0],[0,0,1,0]],
  1: [[1,0,1,1],[1,1,1,0],[0,1,0,0],[1,0,0,1]],
  2: [[0,1,0,0],[1,0,1,0],[1,1,1,1],[0,0,1,0]],
  3: [[0,1,1,1],[0,0,1,1],[1,1,1,0],[1,0,0,0]],
};

export class ArucoDetector {
  private opencvReady: boolean = false;

  constructor() {}

  setOpenCVReady(ready: boolean) {
    this.opencvReady = ready;
  }

  /**
   * Detect ArUco markers in an ImageData
   */
  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.opencvReady || !window.cv) {
      return [];
    }

    const cv = window.cv;

    try {
      // Convertir en niveaux de gris
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Threshold simple inversé (marqueurs noirs sur fond blanc)
      const binary = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

      // Trouver les contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(binary, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

      const candidates: Array<{ x: number; y: number }[]> = [];

      // Filtrer pour trouver les carrés
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimeter = cv.arcLength(contour, true);

        // Approximation polygonale
        const approx = new cv.Mat();
        cv.approxPolyDP(contour, approx, perimeter * 0.03, true);

        // Doit avoir exactement 4 coins
        if (approx.rows === 4) {
          const area = cv.contourArea(contour);

          // Taille minimum pour éviter le bruit
          if (area > 400) {
            const corners: { x: number; y: number }[] = [];
            for (let j = 0; j < 4; j++) {
              corners.push({
                x: approx.data32S[j * 2],
                y: approx.data32S[j * 2 + 1]
              });
            }
            candidates.push(corners);
          }
        }

        approx.delete();
        contour.delete();
      }

      // Nettoyage
      src.delete();
      gray.delete();
      binary.delete();
      contours.delete();
      hierarchy.delete();

      console.log(`🔍 Found ${candidates.length} square candidates`);

      // Décoder chaque candidat
      const markers: ArucoMarker[] = [];
      for (const corners of candidates) {
        const marker = this.decodeMarker(imageData, corners);
        if (marker) {
          markers.push(marker);
          console.log(`✅ Marker detected: ID ${marker.id}`);
        }
      }

      return markers;
    } catch (err) {
      console.error('Detection error:', err);
      return [];
    }
  }

  /**
   * Décoder un marqueur candidat
   */
  private decodeMarker(
    imageData: ImageData,
    corners: Array<{ x: number; y: number }>
  ): ArucoMarker | null {
    const cv = window.cv;

    try {
      // Trier les coins (TL, TR, BR, BL)
      const sorted = this.sortCorners(corners);

      // Taille de l'image transformée
      const markerSize = 50;

      // Points source et destination
      const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        sorted[0].x, sorted[0].y,
        sorted[1].x, sorted[1].y,
        sorted[2].x, sorted[2].y,
        sorted[3].x, sorted[3].y
      ]);

      const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        markerSize, 0,
        markerSize, markerSize,
        0, markerSize
      ]);

      // Transformation de perspective
      const M = cv.getPerspectiveTransform(srcPoints, dstPoints);

      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const warped = new cv.Mat();
      cv.warpPerspective(gray, warped, M, new cv.Size(markerSize, markerSize));

      // Threshold sur l'image transformée (inversé : noir → blanc)
      const binary = new cv.Mat();
      cv.threshold(warped, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

      // Extraire les bits de la grille 4x4 (en ignorant les bordures)
      const bits: number[][] = [];
      const cellSize = markerSize / 6; // Marqueur = 6x6 (bordure + 4x4 intérieur)
      const offset = cellSize; // Sauter la bordure

      for (let row = 0; row < 4; row++) {
        bits[row] = [];
        for (let col = 0; col < 4; col++) {
          // Centre de chaque cellule
          const x = Math.floor(offset + (col + 0.5) * cellSize);
          const y = Math.floor(offset + (row + 0.5) * cellSize);

          // Lire la valeur (avec THRESH_BINARY_INV: 255 = noir original, 0 = blanc original)
          const val = binary.ucharAt(y, x);
          bits[row][col] = val > 128 ? 1 : 0; // 1 = noir, 0 = blanc
        }
      }

      // Nettoyage
      src.delete();
      gray.delete();
      warped.delete();
      binary.delete();
      srcPoints.delete();
      dstPoints.delete();
      M.delete();

      console.log(`🔍 Extracted bits:`, bits);

      // Essayer de matcher avec le dictionnaire
      for (let rotation = 0; rotation < 4; rotation++) {
        const rotated = this.rotateBits(bits, rotation);

        // Chercher dans le dictionnaire
        for (const [id, pattern] of Object.entries(ARUCO_4X4_50)) {
          if (this.matchPattern(rotated, pattern)) {
            console.log(`✅ Matched ID ${id} at rotation ${rotation}`);
            const rotatedCorners = this.rotateCorners(sorted, rotation);
            return { id: parseInt(id), corners: rotatedCorners };
          }
        }
      }

      console.log('❌ No match in dictionary');
      return null;
    } catch (err) {
      console.error('Decode error:', err);
      return null;
    }
  }

  /**
   * Vérifier si deux patterns correspondent
   */
  private matchPattern(bits: number[][], pattern: number[][]): boolean {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (bits[y][x] !== pattern[y][x]) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Trier les coins dans l'ordre TL, TR, BR, BL
   */
  private sortCorners(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    // Centre
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Trier par angle
    const sorted = points.slice().sort((a, b) => {
      const angleA = Math.atan2(a.y - cy, a.x - cx);
      const angleB = Math.atan2(b.y - cy, b.x - cx);
      return angleA - angleB;
    });

    // Trouver le coin supérieur gauche
    const topLeftIdx = sorted.reduce((minIdx, p, idx) => {
      return p.x + p.y < sorted[minIdx].x + sorted[minIdx].y ? idx : minIdx;
    }, 0);

    return [...sorted.slice(topLeftIdx), ...sorted.slice(0, topLeftIdx)];
  }

  /**
   * Rotation de la grille de bits
   */
  private rotateBits(bits: number[][], rotation: number): number[][] {
    let result = bits;
    for (let i = 0; i < rotation; i++) {
      const rotated: number[][] = [];
      const n = result.length;
      for (let y = 0; y < n; y++) {
        rotated[y] = [];
        for (let x = 0; x < n; x++) {
          rotated[y][x] = result[n - 1 - x][y];
        }
      }
      result = rotated;
    }
    return result;
  }

  /**
   * Rotation des coins
   */
  private rotateCorners(
    corners: Array<{ x: number; y: number }>,
    rotation: number
  ): Array<{ x: number; y: number }> {
    const rotated = [];
    for (let i = 0; i < 4; i++) {
      rotated[i] = corners[(i + rotation) % 4];
    }
    return rotated;
  }
}
