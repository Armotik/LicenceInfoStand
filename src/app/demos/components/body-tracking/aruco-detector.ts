// ============================================
// Simple ArUco Detector with strict pattern matching
// Minimal OpenCV.js usage, exact dictionary matching
// ============================================

declare global {
  interface Window {
    cv: any;
  }
}

export interface ArucoMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

// Dictionnaire ArUco 4x4_50 - IDs 0-3 UNIQUEMENT
// Pattern vérifié et exact du dictionnaire officiel OpenCV
const ARUCO_DICTIONARY: { [key: number]: number[][] } = {
  0: [[1,0,0,0],[0,1,1,1],[1,1,0,0],[0,0,1,0]],
  1: [[1,0,1,1],[1,1,1,0],[0,1,0,0],[1,0,0,1]],
  2: [[0,1,0,0],[1,0,1,0],[1,1,1,1],[0,0,1,0]],
  3: [[0,1,1,1],[0,0,1,1],[1,1,1,0],[1,0,0,0]]
};

export class ArucoDetector {
  private opencvReady: boolean = false;

  constructor() {}

  setOpenCVReady(ready: boolean) {
    this.opencvReady = ready;
  }

  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.opencvReady || !window.cv) {
      return [];
    }

    const cv = window.cv;

    try {
      // 1. Conversion en niveaux de gris
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // 2. Binarisation simple (Otsu)
      const binary = new cv.Mat();
      cv.threshold(gray, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

      // 3. Détection de contours
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(binary, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

      const candidates: Array<{ x: number; y: number }[]> = [];

      // 4. Filtrer les carrés
      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const area = cv.contourArea(contour);
        const perimeter = cv.arcLength(contour, true);

        // Critères STRICTS pour réduire les faux positifs
        if (area < 1000 || area > imageData.width * imageData.height * 0.5) {
          contour.delete();
          continue;
        }

        const approx = new cv.Mat();
        cv.approxPolyDP(contour, approx, perimeter * 0.03, true);

        if (approx.rows === 4) {
          const corners: { x: number; y: number }[] = [];
          for (let j = 0; j < 4; j++) {
            corners.push({
              x: approx.data32S[j * 2],
              y: approx.data32S[j * 2 + 1]
            });
          }

          // Vérifier l'aspect ratio (doit être carré)
          const sorted = this.sortCorners(corners);
          const w = this.distance(sorted[0], sorted[1]);
          const h = this.distance(sorted[0], sorted[3]);
          const aspectRatio = Math.max(w, h) / Math.min(w, h);

          if (aspectRatio < 1.8) {
            candidates.push(corners);
          }
        }

        approx.delete();
        contour.delete();
      }

      src.delete();
      gray.delete();
      binary.delete();
      contours.delete();
      hierarchy.delete();

      console.log(`Found ${candidates.length} square candidates`);

      // 5. Décoder et matcher avec dictionnaire
      const markers: ArucoMarker[] = [];
      for (const corners of candidates) {
        const marker = this.decodeAndMatch(imageData, corners);
        if (marker) {
          markers.push(marker);
          console.log(`✅ Matched marker ID ${marker.id}`);
        }
      }

      return markers;
    } catch (err) {
      console.error('Detection error:', err);
      return [];
    }
  }

  private decodeAndMatch(
    imageData: ImageData,
    corners: Array<{ x: number; y: number }>
  ): ArucoMarker | null {
    const cv = window.cv;

    try {
      const sorted = this.sortCorners(corners);

      // Transformation de perspective
      const markerSize = 48; // 8x8 grid (border + 6x6 + border -> prend 4x4 intérieur)

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

      const M = cv.getPerspectiveTransform(srcPoints, dstPoints);

      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const warped = new cv.Mat();
      cv.warpPerspective(gray, warped, M, new cv.Size(markerSize, markerSize));

      const binary = new cv.Mat();
      cv.threshold(warped, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

      // Extraire grille 4x4 (sans bordure)
      const cellSize = markerSize / 6;
      const offset = cellSize;
      const bits: number[][] = [];

      for (let row = 0; row < 4; row++) {
        bits[row] = [];
        for (let col = 0; col < 4; col++) {
          const x = Math.floor(offset + (col + 0.5) * cellSize);
          const y = Math.floor(offset + (row + 0.5) * cellSize);
          const val = binary.ucharAt(y, x);
          bits[row][col] = val > 127 ? 1 : 0;
        }
      }

      src.delete();
      gray.delete();
      warped.delete();
      binary.delete();
      srcPoints.delete();
      dstPoints.delete();
      M.delete();

      // Essayer toutes les rotations et matcher EXACTEMENT avec dictionnaire
      for (let rotation = 0; rotation < 4; rotation++) {
        const rotated = this.rotateBits(bits, rotation);

        for (const [idStr, pattern] of Object.entries(ARUCO_DICTIONARY)) {
          if (this.exactMatch(rotated, pattern)) {
            const id = parseInt(idStr);
            const rotatedCorners = this.rotateCorners(sorted, rotation);
            return { id, corners: rotatedCorners };
          }
        }
      }

      return null;
    } catch (err) {
      console.error('Decode error:', err);
      return null;
    }
  }

  // Match EXACT - pas de tolérance
  private exactMatch(bits: number[][], pattern: number[][]): boolean {
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        if (bits[y][x] !== pattern[y][x]) {
          return false;
        }
      }
    }
    return true;
  }

  private sortCorners(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    const cx = points.reduce((sum, p) => sum + p.x, 0) / 4;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / 4;

    const sorted = points.slice().sort((a, b) => {
      const angleA = Math.atan2(a.y - cy, a.x - cx);
      const angleB = Math.atan2(b.y - cy, b.x - cx);
      return angleA - angleB;
    });

    const topLeftIdx = sorted.reduce((minIdx, p, idx) => {
      return p.x + p.y < sorted[minIdx].x + sorted[minIdx].y ? idx : minIdx;
    }, 0);

    return [...sorted.slice(topLeftIdx), ...sorted.slice(0, topLeftIdx)];
  }

  private rotateBits(bits: number[][], rotation: number): number[][] {
    let result = bits;
    for (let i = 0; i < rotation; i++) {
      const rotated: number[][] = [];
      for (let y = 0; y < 4; y++) {
        rotated[y] = [];
        for (let x = 0; x < 4; x++) {
          rotated[y][x] = result[3 - x][y];
        }
      }
      result = rotated;
    }
    return result;
  }

  private rotateCorners(corners: Array<{ x: number; y: number }>, rotation: number): Array<{ x: number; y: number }> {
    const rotated = [];
    for (let i = 0; i < 4; i++) {
      rotated[i] = corners[(i + rotation) % 4];
    }
    return rotated;
  }

  private distance(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
    return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
  }
}
