// ============================================
// ArUco Detector using js-aruco library
// Simple and reliable ArUco marker detection
// Includes contrast enhancement for phone screens
// ============================================

import { AR } from 'js-aruco';

export interface ArucoMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

export class ArucoDetector {
  private detector: any;

  constructor() {
    this.detector = new AR.Detector();
    console.log('js-aruco detector initialized');
  }

  setOpenCVReady(_ready: boolean) {
    // Not needed for js-aruco, but keeping for compatibility
  }

  /**
   * Enhance contrast of ImageData to improve detection on phone screens.
   * Phone screens often have lower contrast, glare, and color temperature
   * variations that make marker detection harder.
   */
  private enhanceContrast(imageData: ImageData): ImageData {
    const data = imageData.data;
    const len = data.length;

    // Find min/max luminance for histogram stretching
    let min = 255, max = 0;
    for (let i = 0; i < len; i += 4) {
      // Approximate luminance from RGB
      const lum = (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
      if (lum < min) min = lum;
      if (lum > max) max = lum;
    }

    // Only stretch if there's a reasonable range to work with
    const range = max - min;
    if (range < 30) return imageData;

    const scale = 255 / range;

    // Apply histogram stretching
    for (let i = 0; i < len; i += 4) {
      data[i]     = Math.min(255, Math.max(0, (data[i] - min) * scale));     // R
      data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - min) * scale)); // G
      data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - min) * scale)); // B
      // Alpha unchanged
    }

    return imageData;
  }

  /**
   * Detect ArUco markers using js-aruco
   */
  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.detector) {
      return [];
    }

    try {
      // Enhance contrast for better detection on phone screens
      const enhanced = this.enhanceContrast(imageData);

      const markers = this.detector.detect(enhanced);

      if (!markers || markers.length === 0) {
        return [];
      }

      const result: ArucoMarker[] = markers.map((marker: any) => {
        const corners = marker.corners.map((corner: any) => ({
          x: corner.x,
          y: corner.y
        }));

        return {
          id: marker.id,
          corners
        };
      });

      return result;
    } catch (err) {
      console.error('ArUco detection error:', err);
      return [];
    }
  }
}
