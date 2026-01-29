// ============================================
// ArUco Detector using js-aruco library
// Simple and reliable ArUco marker detection
// ============================================

import { AR } from 'js-aruco';

export interface ArucoMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

export class ArucoDetector {
  private detector: any;

  constructor() {
    // Créer le détecteur js-aruco
    this.detector = new AR.Detector();
    console.log('✅ js-aruco detector initialized');
  }

  setOpenCVReady(_ready: boolean) {
    // Not needed for js-aruco, but keeping for compatibility
  }

  /**
   * Detect ArUco markers using js-aruco
   */
  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.detector) {
      return [];
    }

    try {
      // js-aruco détecte directement depuis ImageData
      const markers = this.detector.detect(imageData);

      console.log(`🔍 js-aruco detected ${markers.length} markers`);

      // Convertir au format attendu
      const result: ArucoMarker[] = markers.map((marker: any) => {
        // js-aruco retourne les coins dans l'ordre: TL, TR, BR, BL
        const corners = marker.corners.map((corner: any) => ({
          x: corner.x,
          y: corner.y
        }));

        console.log(`✅ Marker ID ${marker.id} detected`);

        return {
          id: marker.id,
          corners
        };
      });

      return result;
    } catch (err) {
      console.error('js-aruco detection error:', err);
      return [];
    }
  }
}
