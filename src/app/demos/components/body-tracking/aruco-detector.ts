// ============================================
// Custom ArUco Detector for 4x4 markers
// Uses OpenCV.js for perspective transform, custom bit decoding
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

export class ArucoDetector {
  private opencvReady: boolean = false;

  constructor() {
    // OpenCV will be loaded externally
  }

  setOpenCVReady(ready: boolean) {
    this.opencvReady = ready;
  }

  /**
   * Detect ArUco markers in an ImageData
   */
  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.opencvReady || !window.cv) {
      console.log('OpenCV not ready yet');
      return [];
    }

    const cv = window.cv;

    try {
      // Create cv.Mat from ImageData
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Threshold INVERSÉ pour détecter les marqueurs NOIRS
      // Les marqueurs noirs deviennent blancs dans l'image binaire
      const binary = new cv.Mat();
      cv.threshold(gray, binary, 127, 255, cv.THRESH_BINARY_INV);

      // Find contours (maintenant les marqueurs noirs sont des contours blancs)
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(binary, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

      // Find square candidates
      // Avec hiérarchie : ne garder que les contours qui ont au moins 1 enfant
      // (vrais marqueurs ArUco = carré noir avec motif à l'intérieur)
      const candidates: Array<{ x: number; y: number }[]> = [];

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimeter = cv.arcLength(contour, true);
        const area = cv.contourArea(contour);

        // Approximation polygonale
        const approx = new cv.Mat();
        cv.approxPolyDP(contour, approx, perimeter * 0.02, true);

        // Check if it's a quadrilateral with reasonable size
        // ET si le contour a au moins un enfant (structure interne)
        const hasChild = hierarchy.intAt(0, i * 4 + 2) !== -1; // [Next, Previous, First_Child, Parent]

        if (approx.rows === 4 && perimeter > 120 && hasChild) {
          const corners: { x: number; y: number }[] = [];
          for (let j = 0; j < 4; j++) {
            corners.push({
              x: approx.data32S[j * 2],
              y: approx.data32S[j * 2 + 1]
            });
          }

          // Validation supplémentaire : vérifier l'aspect ratio (doit être proche de 1.0)
          const sorted = this.sortCorners(corners);
          const width = Math.hypot(sorted[1].x - sorted[0].x, sorted[1].y - sorted[0].y);
          const height = Math.hypot(sorted[3].x - sorted[0].x, sorted[3].y - sorted[0].y);
          const aspectRatio = Math.max(width, height) / Math.min(width, height);

          // Validation de convexité : aire vs périmètre
          const circularityRatio = (4 * Math.PI * area) / (perimeter * perimeter);

          console.log(`📐 Candidate ${i}: Perimeter=${perimeter.toFixed(0)}, AspectRatio=${aspectRatio.toFixed(2)}, Circularity=${circularityRatio.toFixed(2)}`);

          // Filtres stricts : aspect ratio proche de 1.0 (carré) et forme raisonnablement régulière
          if (aspectRatio < 2.0 && circularityRatio > 0.3) {
            candidates.push(corners);
            console.log(`🎯 Valid marker candidate at index ${i}`);
          } else {
            console.log(`❌ Rejected candidate ${i}: AspectRatio or Circularity out of range`);
          }
        }

        approx.delete();
        contour.delete();
      }

      // Clean up
      src.delete();
      gray.delete();
      binary.delete();
      contours.delete();
      hierarchy.delete();

      console.log(`Found ${candidates.length} square candidates`);

      // Decode each candidate
      const markers: ArucoMarker[] = [];
      for (const corners of candidates.slice(0, 10)) {
        const marker = this.decodeMarkerOpenCV(imageData, corners);
        if (marker) {
          markers.push(marker);
        }
      }

      return markers;
    } catch (err) {
      console.error('Detection error:', err);
      return [];
    }
  }

  /**
   * Decode marker using OpenCV for perspective transform
   */
  private decodeMarkerOpenCV(
    imageData: ImageData,
    corners: Array<{ x: number; y: number }>
  ): ArucoMarker | null {
    const cv = window.cv;

    try {
      // Sort corners (TL, TR, BR, BL)
      const sorted = this.sortCorners(corners);

      // Source points (marker corners)
      const srcPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        sorted[0].x, sorted[0].y,
        sorted[1].x, sorted[1].y,
        sorted[2].x, sorted[2].y,
        sorted[3].x, sorted[3].y
      ]);

      // Destination points (40x40 normalized square)
      const size = 40;
      const dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        size, 0,
        size, size,
        0, size
      ]);

      // Get perspective transform matrix
      const M = cv.getPerspectiveTransform(srcPoints, dstPoints);

      // Warp perspective
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const warped = new cv.Mat();
      cv.warpPerspective(gray, warped, M, new cv.Size(size, size));

      // Threshold warped image (INVERSÉ car on détecte les marqueurs noirs)
      const binary = new cv.Mat();
      cv.threshold(warped, binary, 0, 255, cv.THRESH_BINARY_INV | cv.THRESH_OTSU);

      // Extract 4x4 bit matrix
      const cellSize = size / 4;
      const bits: number[][] = [];

      for (let y = 0; y < 4; y++) {
        bits[y] = [];
        for (let x = 0; x < 4; x++) {
          // Sample center of cell
          const cx = Math.floor((x + 0.5) * cellSize);
          const cy = Math.floor((y + 0.5) * cellSize);
          const val = binary.ucharAt(cy, cx);
          bits[y][x] = val > 127 ? 1 : 0;
        }
      }

      // Clean up
      src.delete();
      gray.delete();
      warped.delete();
      binary.delete();
      srcPoints.delete();
      dstPoints.delete();
      M.delete();

      console.log('🔍 Extracted bits:', bits);

      // Validate and decode
      const isValid = this.isValidBitPattern(bits);
      console.log('📋 Pattern validation:', isValid);

      if (!isValid) {
        console.log('❌ Pattern rejected (too uniform or unbalanced)');
        return null;
      }

      // Try all rotations
      for (let rotation = 0; rotation < 4; rotation++) {
        const rotated = this.rotateBits(bits, rotation);
        const id = this.bitsToId(rotated);

        console.log(`🔄 Rotation ${rotation}: ID = ${id}`);

        // Dictionnaire ArUco 4x4_100 : IDs valides 0-99
        // On se concentre sur 0-3 pour les tests
        if (id >= 0 && id < 100) {
          const rotatedCorners = this.rotateCorners(sorted, rotation);
          console.log('✅ Valid marker found! ID:', id, 'Bits:', bits);
          return { id, corners: rotatedCorners };
        }
      }

      console.log('❌ No valid ID found in any rotation');
      return null;
    } catch (err) {
      console.error('Decode error:', err);
      return null;
    }
  }

  /**
   * Sort corners in order: TL, TR, BR, BL
   */
  private sortCorners(points: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
    // Find center
    const cx = points.reduce((sum, p) => sum + p.x, 0) / points.length;
    const cy = points.reduce((sum, p) => sum + p.y, 0) / points.length;

    // Sort by angle from center
    const sorted = points.slice().sort((a, b) => {
      const angleA = Math.atan2(a.y - cy, a.x - cx);
      const angleB = Math.atan2(b.y - cy, b.x - cx);
      return angleA - angleB;
    });

    // Rotate so top-left is first
    const topLeftIdx = sorted.reduce((minIdx, p, idx) => {
      return p.x + p.y < sorted[minIdx].x + sorted[minIdx].y ? idx : minIdx;
    }, 0);

    return [...sorted.slice(topLeftIdx), ...sorted.slice(0, topLeftIdx)];
  }

  /**
   * Validate that bit pattern looks like a real ArUco marker
   * Critères plus stricts pour réduire les faux positifs
   * Note: With THRESH_BINARY_INV, 1=noir (black areas), 0=blanc (white areas)
   */
  private isValidBitPattern(bits: number[][]): boolean {
    let blackCount = 0; // bits = 1
    let whiteCount = 0; // bits = 0

    for (let y = 0; y < bits.length; y++) {
      for (let x = 0; x < bits[y].length; x++) {
        if (bits[y][x] === 1) {
          blackCount++; // Noir dans image originale
        } else {
          whiteCount++; // Blanc dans image originale
        }
      }
    }

    const total = blackCount + whiteCount;
    const blackRatio = blackCount / total;

    console.log(`📊 Bit counts - Black: ${blackCount}, White: ${whiteCount}, Ratio: ${blackRatio.toFixed(2)}`);

    // Au moins 3 bits de chaque couleur (plus strict)
    if (blackCount < 3 || whiteCount < 3) {
      console.log('⚠️ Not enough variation - rejecting');
      return false;
    }

    // Balance raisonnable (20-80% au lieu de 10-90%)
    if (blackRatio < 0.2 || blackRatio > 0.8) {
      console.log('⚠️ Too unbalanced - rejecting');
      return false;
    }

    // Vérifier qu'il n'y a pas de pattern trop uniforme (toutes les lignes/colonnes pareilles)
    let sameRowCount = 0;
    let sameColCount = 0;

    // Check rows
    for (let y = 0; y < bits.length - 1; y++) {
      if (JSON.stringify(bits[y]) === JSON.stringify(bits[y + 1])) {
        sameRowCount++;
      }
    }

    // Check columns
    for (let x = 0; x < bits[0].length - 1; x++) {
      const col1 = bits.map(row => row[x]);
      const col2 = bits.map(row => row[x + 1]);
      if (JSON.stringify(col1) === JSON.stringify(col2)) {
        sameColCount++;
      }
    }

    if (sameRowCount > 2 || sameColCount > 2) {
      console.log('⚠️ Too uniform (repeated rows/cols) - rejecting');
      return false;
    }

    return true;
  }

  /**
   * Rotate bit matrix
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
   * Convert bit matrix to ID
   */
  private bitsToId(bits: number[][]): number {
    let id = 0;
    for (let y = 0; y < bits.length; y++) {
      for (let x = 0; x < bits[y].length; x++) {
        id = (id << 1) | bits[y][x];
      }
    }
    return id;
  }

  /**
   * Rotate corners array
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
