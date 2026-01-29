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

      // Prétraitement pour améliorer la détection
      // 1. Équilibrage de l'histogramme pour gérer les variations d'éclairage
      const equalized = new cv.Mat();
      cv.equalizeHist(gray, equalized);

      // 2. Threshold ADAPTATIF pour gérer le fond et les ombres
      // ADAPTIVE_THRESH_GAUSSIAN_C gère mieux les variations d'éclairage locales
      const binary = new cv.Mat();
      cv.adaptiveThreshold(
        equalized,
        binary,
        255,
        cv.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv.THRESH_BINARY_INV,
        11, // Block size
        2   // C constant
      );

      // 3. Morphologie pour nettoyer le bruit
      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      const cleaned = new cv.Mat();
      cv.morphologyEx(binary, cleaned, cv.MORPH_CLOSE, kernel);
      cv.morphologyEx(cleaned, cleaned, cv.MORPH_OPEN, kernel);

      // Find contours (maintenant les marqueurs noirs sont des contours blancs)
      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(cleaned, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

      // Find square candidates
      // Filtrer les contours pour trouver les vrais marqueurs ArUco
      const candidates: Array<{ x: number; y: number }[]> = [];
      const imageArea = imageData.width * imageData.height;

      for (let i = 0; i < contours.size(); i++) {
        const contour = contours.get(i);
        const perimeter = cv.arcLength(contour, true);
        const area = cv.contourArea(contour);

        // Approximation polygonale
        const approx = new cv.Mat();
        cv.approxPolyDP(contour, approx, perimeter * 0.02, true);

        // Vérifications de base : 4 coins, aire raisonnable
        if (approx.rows !== 4) {
          approx.delete();
          contour.delete();
          continue;
        }

        // Filtrage par taille : ni trop petit, ni trop grand (max 50% de l'image)
        const areaRatio = area / imageArea;
        if (area < 1000 || areaRatio > 0.5) {
          console.log(`❌ Candidate ${i}: Area too small (${area}) or too large (${(areaRatio * 100).toFixed(1)}% of image)`);
          approx.delete();
          contour.delete();
          continue;
        }

        const corners: { x: number; y: number }[] = [];
        for (let j = 0; j < 4; j++) {
          corners.push({
            x: approx.data32S[j * 2],
            y: approx.data32S[j * 2 + 1]
          });
        }

        // Validation géométrique : aspect ratio proche de 1.0
        const sorted = this.sortCorners(corners);
        const width = Math.hypot(sorted[1].x - sorted[0].x, sorted[1].y - sorted[0].y);
        const height = Math.hypot(sorted[3].x - sorted[0].x, sorted[3].y - sorted[0].y);
        const aspectRatio = Math.max(width, height) / Math.min(width, height);

        if (aspectRatio > 1.5) {
          console.log(`❌ Candidate ${i}: Not square enough (aspect ratio ${aspectRatio.toFixed(2)})`);
          approx.delete();
          contour.delete();
          continue;
        }

        // Vérifier la hiérarchie : doit avoir plusieurs enfants (grille interne)
        const firstChild = hierarchy.intAt(0, i * 4 + 2);
        if (firstChild === -1) {
          console.log(`❌ Candidate ${i}: No internal structure`);
          approx.delete();
          contour.delete();
          continue;
        }

        // Compter le nombre d'enfants (un vrai marqueur ArUco a plusieurs contours internes)
        let childCount = 0;
        let childIdx = firstChild;
        while (childIdx !== -1 && childCount < 20) {
          childCount++;
          childIdx = hierarchy.intAt(0, childIdx * 4); // Next sibling
        }

        console.log(`📐 Candidate ${i}: Area=${area.toFixed(0)}, AspectRatio=${aspectRatio.toFixed(2)}, Children=${childCount}`);

        // Un marqueur ArUco doit avoir au moins 2-3 contours internes
        if (childCount >= 2) {
          candidates.push(corners);
          console.log(`🎯 Valid marker candidate at index ${i}`);
        } else {
          console.log(`❌ Rejected candidate ${i}: Not enough internal contours (${childCount})`);
        }

        approx.delete();
        contour.delete();
      }

      // Clean up
      src.delete();
      gray.delete();
      equalized.delete();
      binary.delete();
      cleaned.delete();
      kernel.delete();
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

        console.log(`🔄 Rotation ${rotation}: ID = ${id}, Bits: ${JSON.stringify(rotated)}`);

        // Dictionnaire ArUco 4x4 : 16 bits = 0-65535 possible
        // On accepte 0-1000 pour être raisonnable (inclut 4x4_50 et 4x4_100)
        if (id >= 0 && id < 1000) {
          const rotatedCorners = this.rotateCorners(sorted, rotation);
          console.log('✅ Valid marker found! ID:', id);
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

    // Au moins 2 bits de chaque couleur
    if (blackCount < 2 || whiteCount < 2) {
      console.log('⚠️ Not enough variation - rejecting');
      return false;
    }

    // Balance raisonnable (15-85%)
    if (blackRatio < 0.15 || blackRatio > 0.85) {
      console.log('⚠️ Too unbalanced - rejecting');
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
