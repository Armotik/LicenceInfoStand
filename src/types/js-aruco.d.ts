// Type definitions for js-aruco
declare module 'js-aruco' {
  export interface Corner {
    x: number;
    y: number;
  }

  export interface DetectedMarker {
    id: number;
    corners: Corner[];
  }

  export class Detector {
    constructor();
    detect(imageData: ImageData): DetectedMarker[];
  }

  export const AR: {
    Detector: typeof Detector;
  };

  export const CV: any;
  export const SVD: any;
  export const POS1: any;
  export const POS2: any;
}
