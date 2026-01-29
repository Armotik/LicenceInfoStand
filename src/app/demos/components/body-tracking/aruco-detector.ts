// ============================================
// ArUco Detector - Using native OpenCV.js ArUco module
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

export class ArucoDetector {
  private opencvReady: boolean = false;
  private dictionary: any = null;
  private parameters: any = null;

  constructor() {}

  setOpenCVReady(ready: boolean) {
    this.opencvReady = ready;

    if (ready && window.cv) {
      console.log('🔍 Checking for cv.aruco module...');
      console.log('cv.aruco exists:', !!window.cv.aruco);
      console.log('cv object keys:', Object.keys(window.cv).filter(k => k.includes('aruco')));

      if (window.cv.aruco) {
        try {
          // Créer le dictionnaire ArUco 4x4_50
          this.dictionary = new window.cv.aruco_Dictionary(window.cv.aruco.DICT_4X4_50);

          // Créer les paramètres de détection
          this.parameters = new window.cv.aruco_DetectorParameters();

          console.log('✅ ArUco detector initialized with DICT_4X4_50');
        } catch (err) {
          console.error('❌ Failed to initialize ArUco detector:', err);
        }
      } else {
        console.error('❌ cv.aruco module not found in OpenCV.js!');
        console.log('💡 The standard OpenCV.js build does not include ArUco module.');
      }
    }
  }

  /**
   * Detect ArUco markers using OpenCV.js native module
   */
  detect(imageData: ImageData): ArucoMarker[] {
    if (!this.opencvReady || !window.cv || !this.dictionary || !this.parameters) {
      return [];
    }

    const cv = window.cv;

    try {
      // Convertir ImageData en Mat
      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      // Conteneurs pour les résultats
      const markerCorners = new cv.MatVector();
      const markerIds = new cv.Mat();
      const rejectedCandidates = new cv.MatVector();

      // Détecter les marqueurs ArUco
      cv.aruco.detectMarkers(
        gray,
        this.dictionary,
        markerCorners,
        markerIds,
        this.parameters,
        rejectedCandidates
      );

      const numMarkers = markerIds.rows;
      console.log(`🔍 Detected ${numMarkers} ArUco markers`);

      // Convertir les résultats
      const markers: ArucoMarker[] = [];

      for (let i = 0; i < numMarkers; i++) {
        const id = markerIds.data32S[i];
        const cornersMat = markerCorners.get(i);

        // Les coins sont dans l'ordre: TL, TR, BR, BL
        const corners: Array<{ x: number; y: number }> = [];
        for (let j = 0; j < 4; j++) {
          corners.push({
            x: cornersMat.data32F[j * 2],
            y: cornersMat.data32F[j * 2 + 1]
          });
        }

        markers.push({ id, corners });
        console.log(`✅ Marker ID ${id} detected at`, corners);
      }

      // Nettoyage
      src.delete();
      gray.delete();
      markerCorners.delete();
      markerIds.delete();
      rejectedCandidates.delete();

      return markers;
    } catch (err) {
      console.error('ArUco detection error:', err);
      return [];
    }
  }
}
