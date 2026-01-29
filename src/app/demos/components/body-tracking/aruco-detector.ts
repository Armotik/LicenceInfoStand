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
      console.log('❌ Detector not initialized');
      return [];
    }

    try {
      console.log(`🔍 Running js-aruco detection on ${imageData.width}x${imageData.height} image`);

      // js-aruco détecte directement depuis ImageData
      const markers = this.detector.detect(imageData);

      console.log(`📊 js-aruco raw result:`, markers);
      console.log(`🔍 js-aruco detected ${markers ? markers.length : 0} markers`);

      if (!markers || markers.length === 0) {
        console.log('⚠️ No markers detected by js-aruco');
        return [];
      }

      // Convertir au format attendu
      const result: ArucoMarker[] = markers.map((marker: any) => {
        console.log('🎯 Processing marker:', marker);

        // js-aruco retourne les coins dans l'ordre: TL, TR, BR, BL
        const corners = marker.corners.map((corner: any) => ({
          x: corner.x,
          y: corner.y
        }));

        console.log(`✅ Marker ID ${marker.id} detected with corners:`, corners);

        return {
          id: marker.id,
          corners
        };
      });

      return result;
    } catch (err) {
      console.error('❌ js-aruco detection error:', err);
      console.error('Error stack:', (err as Error).stack);
      return [];
    }
  }
}
