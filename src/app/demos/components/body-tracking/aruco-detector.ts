// ============================================
// Custom ArUco Detector for 4x4 markers
// Lightweight implementation without external dependencies
// ============================================

export interface ArucoMarker {
  id: number;
  corners: Array<{ x: number; y: number }>;
}

export class ArucoDetector {
  constructor() {
    // Detector is stateless, no initialization needed
  }

  /**
   * Detect ArUco markers in an ImageData
   */
  detect(imageData: ImageData): ArucoMarker[] {
    // Downscale for faster processing (320x240 instead of 640x480)
    const scale = 0.5;
    const scaledWidth = Math.floor(imageData.width * scale);
    const scaledHeight = Math.floor(imageData.height * scale);
    const scaledImage = this.downscale(imageData, scaledWidth, scaledHeight);

    // Convert to grayscale
    const gray = this.toGrayscale(scaledImage);

    // Simple global threshold (much faster than adaptive)
    const binary = this.simpleThreshold(gray, 127);

    // Find contours
    const contours = this.findContours(binary, scaledWidth, scaledHeight);

    // Find marker candidates (squares) - limit to top 10 largest
    const candidates = this.findSquareCandidates(contours, scaledWidth, scaledHeight).slice(0, 10);

    // Scale candidates back to original resolution
    const scaledCandidates = candidates.map((candidate) =>
      candidate.map((point) => ({
        x: point.x / scale,
        y: point.y / scale,
      }))
    );

    // Decode each candidate
    const markers: ArucoMarker[] = [];
    for (const candidate of scaledCandidates) {
      const marker = this.decodeMarker(
        this.toGrayscale(imageData),
        candidate,
        imageData.width,
        imageData.height
      );
      if (marker) {
        markers.push(marker);
      }
    }

    return markers;
  }

  /**
   * Downscale image for faster processing
   */
  private downscale(imageData: ImageData, newWidth: number, newHeight: number): ImageData {
    const scaled = new ImageData(newWidth, newHeight);
    const scaleX = imageData.width / newWidth;
    const scaleY = imageData.height / newHeight;

    for (let y = 0; y < newHeight; y++) {
      for (let x = 0; x < newWidth; x++) {
        const srcX = Math.floor(x * scaleX);
        const srcY = Math.floor(y * scaleY);
        const srcIdx = (srcY * imageData.width + srcX) * 4;
        const dstIdx = (y * newWidth + x) * 4;

        scaled.data[dstIdx] = imageData.data[srcIdx];
        scaled.data[dstIdx + 1] = imageData.data[srcIdx + 1];
        scaled.data[dstIdx + 2] = imageData.data[srcIdx + 2];
        scaled.data[dstIdx + 3] = 255;
      }
    }

    return scaled;
  }

  /**
   * Simple global threshold (much faster than adaptive)
   */
  private simpleThreshold(gray: Uint8ClampedArray, threshold: number): Uint8ClampedArray {
    const binary = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      binary[i] = gray[i] > threshold ? 255 : 0;
    }
    return binary;
  }

  /**
   * Convert ImageData to grayscale
   */
  private toGrayscale(imageData: ImageData): Uint8ClampedArray {
    const gray = new Uint8ClampedArray(imageData.width * imageData.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      // Grayscale = 0.299*R + 0.587*G + 0.114*B
      gray[i / 4] =
        imageData.data[i] * 0.299 +
        imageData.data[i + 1] * 0.587 +
        imageData.data[i + 2] * 0.114;
    }
    return gray;
  }


  /**
   * Find contours in binary image (simple implementation)
   */
  private findContours(
    binary: Uint8ClampedArray,
    width: number,
    height: number
  ): Array<Array<{ x: number; y: number }>> {
    const contours: Array<Array<{ x: number; y: number }>> = [];
    const visited = new Uint8ClampedArray(width * height);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (binary[idx] === 255 && !visited[idx]) {
          const contour = this.traceContour(binary, visited, x, y, width, height);
          if (contour.length > 20) {
            // Minimum contour size
            contours.push(contour);
          }
        }
      }
    }

    return contours;
  }

  /**
   * Trace a contour starting from a point
   */
  private traceContour(
    binary: Uint8ClampedArray,
    visited: Uint8ClampedArray,
    startX: number,
    startY: number,
    width: number,
    height: number
  ): Array<{ x: number; y: number }> {
    const contour: Array<{ x: number; y: number }> = [];
    const stack: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];

    while (stack.length > 0) {
      const p = stack.pop()!;
      const idx = p.y * width + p.x;

      if (visited[idx] || binary[idx] !== 255) continue;

      visited[idx] = 1;
      contour.push(p);

      // 8-connectivity
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const nx = p.x + dx;
          const ny = p.y + dy;
          if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
            stack.push({ x: nx, y: ny });
          }
        }
      }
    }

    return contour;
  }

  /**
   * Find square candidates from contours
   */
  private findSquareCandidates(
    contours: Array<Array<{ x: number; y: number }>>,
    width: number,
    height: number
  ): Array<Array<{ x: number; y: number }>> {
    const candidates: Array<Array<{ x: number; y: number }>> = [];
    const minSize = Math.min(width, height) * 0.05; // 5% of image size

    for (const contour of contours) {
      // Approximate contour to polygon
      const poly = this.approxPolyDP(contour, contour.length * 0.05);

      // Check if it's a quadrilateral with reasonable size
      if (poly.length === 4) {
        const perimeter = this.perimeter(poly);
        if (perimeter > minSize * 4) {
          // Sort corners in order: TL, TR, BR, BL
          const sorted = this.sortCorners(poly);
          candidates.push(sorted);
        }
      }
    }

    return candidates;
  }

  /**
   * Approximate polygon using Douglas-Peucker algorithm
   */
  private approxPolyDP(
    points: Array<{ x: number; y: number }>,
    epsilon: number
  ): Array<{ x: number; y: number }> {
    if (points.length < 3) return points;

    // Find point with maximum distance from line
    let maxDist = 0;
    let index = 0;
    const start = points[0];
    const end = points[points.length - 1];

    for (let i = 1; i < points.length - 1; i++) {
      const dist = this.pointToLineDistance(points[i], start, end);
      if (dist > maxDist) {
        maxDist = dist;
        index = i;
      }
    }

    // If max distance is greater than epsilon, recursively simplify
    if (maxDist > epsilon) {
      const left = this.approxPolyDP(points.slice(0, index + 1), epsilon);
      const right = this.approxPolyDP(points.slice(index), epsilon);
      return [...left.slice(0, -1), ...right];
    } else {
      return [start, end];
    }
  }

  /**
   * Calculate point-to-line distance
   */
  private pointToLineDistance(
    point: { x: number; y: number },
    lineStart: { x: number; y: number },
    lineEnd: { x: number; y: number }
  ): number {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const num = Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x);
    const den = Math.sqrt(dx * dx + dy * dy);
    return num / den;
  }

  /**
   * Calculate perimeter of polygon
   */
  private perimeter(points: Array<{ x: number; y: number }>): number {
    let sum = 0;
    for (let i = 0; i < points.length; i++) {
      const p1 = points[i];
      const p2 = points[(i + 1) % points.length];
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      sum += Math.sqrt(dx * dx + dy * dy);
    }
    return sum;
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
   * Decode marker from grayscale image
   * Supports both bordered and borderless ArUco markers
   */
  private decodeMarker(
    gray: Uint8ClampedArray,
    corners: Array<{ x: number; y: number }>,
    width: number,
    height: number
  ): ArucoMarker | null {
    // Extract and warp marker region to normalized grid
    // For borderless markers (like from chev.me/arucogen/), use 4x4 directly
    const markerSize = 4; // Direct 4x4 grid without border
    const cellSize = 10;
    const warpedSize = markerSize * cellSize;

    // Create perspective transform
    const warped = this.warpPerspective(gray, corners, width, height, warpedSize);

    // Apply threshold to warped image
    const thresholded = this.thresholdImage(warped);

    console.log('Decoding marker candidate...');

    // Extract 4x4 bit matrix (reading entire warped region)
    const bits: number[][] = [];
    for (let y = 0; y < 4; y++) {
      bits[y] = [];
      for (let x = 0; x < 4; x++) {
        // Sample from center of each cell
        const cellX = (x + 0.5) * cellSize;
        const cellY = (y + 0.5) * cellSize;
        const idx = Math.floor(cellY) * warpedSize + Math.floor(cellX);
        bits[y][x] = thresholded[idx] > 127 ? 1 : 0;
      }
    }

    // Validate bit pattern quality
    if (!this.isValidBitPattern(bits)) {
      return null;
    }

    // Try all 4 rotations and find valid one
    for (let rotation = 0; rotation < 4; rotation++) {
      const rotated = this.rotateBits(bits, rotation);
      const id = this.bitsToId(rotated);

      // Only accept IDs in reasonable range for real markers
      // Most ArUco generators use IDs 0-1023 for 4x4
      if (id >= 0 && id < 1024) {
        const rotatedCorners = this.rotateCorners(corners, rotation);
        return { id, corners: rotatedCorners };
      }
    }

    return null;
  }

  /**
   * Validate that bit pattern looks like a real ArUco marker
   * Reject patterns that are too uniform or too random
   */
  private isValidBitPattern(bits: number[][]): boolean {
    // Count black and white bits
    let blackCount = 0;
    let whiteCount = 0;

    for (let y = 0; y < bits.length; y++) {
      for (let x = 0; x < bits[y].length; x++) {
        if (bits[y][x] === 1) {
          whiteCount++;
        } else {
          blackCount++;
        }
      }
    }

    const total = blackCount + whiteCount;

    // Reject if too uniform (all black or all white)
    if (blackCount < 2 || whiteCount < 2) {
      return false;
    }

    // Reject if too unbalanced (need some pattern variety)
    const blackRatio = blackCount / total;
    if (blackRatio < 0.2 || blackRatio > 0.8) {
      return false;
    }

    return true;
  }

  /**
   * Threshold image using Otsu's method
   */
  private thresholdImage(gray: Uint8ClampedArray): Uint8ClampedArray {
    // Calculate histogram
    const histogram = new Array(256).fill(0);
    for (let i = 0; i < gray.length; i++) {
      histogram[gray[i]]++;
    }

    // Calculate threshold using Otsu's method
    const total = gray.length;
    let sum = 0;
    for (let i = 0; i < 256; i++) {
      sum += i * histogram[i];
    }

    let sumB = 0;
    let wB = 0;
    let wF = 0;
    let maxVariance = 0;
    let threshold = 0;

    for (let i = 0; i < 256; i++) {
      wB += histogram[i];
      if (wB === 0) continue;

      wF = total - wB;
      if (wF === 0) break;

      sumB += i * histogram[i];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = i;
      }
    }

    // Apply threshold
    const binary = new Uint8ClampedArray(gray.length);
    for (let i = 0; i < gray.length; i++) {
      binary[i] = gray[i] > threshold ? 255 : 0;
    }

    return binary;
  }

  /**
   * Warp perspective to get normalized marker view
   */
  private warpPerspective(
    gray: Uint8ClampedArray,
    corners: Array<{ x: number; y: number }>,
    srcWidth: number,
    srcHeight: number,
    dstSize: number
  ): Uint8ClampedArray {
    const warped = new Uint8ClampedArray(dstSize * dstSize);

    // Simple bilinear interpolation
    for (let y = 0; y < dstSize; y++) {
      for (let x = 0; x < dstSize; x++) {
        const u = x / dstSize;
        const v = y / dstSize;

        // Bilinear interpolation on corners
        const srcX =
          corners[0].x * (1 - u) * (1 - v) +
          corners[1].x * u * (1 - v) +
          corners[2].x * u * v +
          corners[3].x * (1 - u) * v;

        const srcY =
          corners[0].y * (1 - u) * (1 - v) +
          corners[1].y * u * (1 - v) +
          corners[2].y * u * v +
          corners[3].y * (1 - u) * v;

        const sx = Math.floor(srcX);
        const sy = Math.floor(srcY);

        if (sx >= 0 && sx < srcWidth && sy >= 0 && sy < srcHeight) {
          warped[y * dstSize + x] = gray[sy * srcWidth + sx];
        }
      }
    }

    return warped;
  }

  /**
   * Check if border is black (all zeros)
   * Note: Disabled for borderless markers from chev.me/arucogen/
   */
  // private checkBorder(warped: Uint8ClampedArray, markerSize: number, cellSize: number): boolean {
  //   const warpedSize = markerSize * cellSize;
  //   let blackCount = 0;
  //   let totalCount = 0;

  //   // Check top and bottom borders
  //   for (let x = 0; x < warpedSize; x++) {
  //     totalCount += 2;
  //     if (warped[x] < 127) blackCount++;
  //     if (warped[(markerSize - 1) * cellSize * warpedSize + x] < 127) blackCount++;
  //   }

  //   // Check left and right borders
  //   for (let y = 0; y < warpedSize; y++) {
  //     totalCount += 2;
  //     if (warped[y * warpedSize] < 127) blackCount++;
  //     if (warped[y * warpedSize + (markerSize - 1) * cellSize] < 127) blackCount++;
  //   }

  //   // At least 80% should be black
  //   return blackCount / totalCount > 0.8;
  // }

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
  private rotateCorners(corners: Array<{ x: number; y: number }>, rotation: number): Array<{ x: number; y: number }> {
    const rotated = [];
    for (let i = 0; i < 4; i++) {
      rotated[i] = corners[(i + rotation) % 4];
    }
    return rotated;
  }
}
