import { QRCode } from 'jsqr';
import { Chunks as _Chunks } from 'jsqr/dist/decoder/decodeData';
import { Point as _Point } from 'jsqr/dist/locator';
export interface ScannerQRCodeConfig {
    src?: string;
    fps?: number;
    vibrate?: number /** support mobile */;
    isBeep?: boolean;
    constraints?: MediaStreamConstraints;
    canvasStyles?: CanvasRenderingContext2D;
}
export interface ScannerQRCodeSelectedFiles {
    url: string;
    name: string;
    file: File;
    data?: ScannerQRCodeResult;
    canvas?: HTMLCanvasElement;
}
export interface ScannerQRCodeDevice {
    kind: string;
    label: string;
    groupId: string;
    deviceId: string;
}
export interface Chunks extends _Chunks {
}
export interface Point extends _Point {
}
export interface ScannerQRCodeResult extends QRCode {
    binaryData: number[];
    data: string;
    chunks: Chunks;
    version: number;
    location: {
        topRightCorner: Point;
        topLeftCorner: Point;
        bottomRightCorner: Point;
        bottomLeftCorner: Point;
        topRightFinderPattern: Point;
        topLeftFinderPattern: Point;
        bottomLeftFinderPattern: Point;
        bottomRightAlignmentPattern?: Point | undefined;
    };
}
