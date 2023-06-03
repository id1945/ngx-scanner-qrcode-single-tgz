import { AsyncSubject } from "rxjs";
import { ScannerQRCodeConfig, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from "./ngx-scanner-qrcode-single.options";
/**
 * PROP_EXISTS
 * @param obj
 * @param path
 * @returns
 */
export declare const PROP_EXISTS: (obj: any, path: string) => boolean;
/**
 * OVERRIDES
 * @param variableKey
 * @param config
 * @param defaultConfig
 * @returns
 */
export declare const OVERRIDES: (variableKey: string, config: any, defaultConfig: any) => any;
/**
 * Rxjs complete
 * @param as
 * @param data
 * @param error
 */
export declare const AS_COMPLETE: (as: AsyncSubject<any>, data: any, error?: any) => void;
/**
 * CAMERA_BEEP
 * @param isPlay
 * @returns
 */
export declare const PLAY_AUDIO: (isPlay?: boolean) => void;
/**
 * DRAW_RESULT_APPEND_CHILD
 * @param code
 * @param oriCanvas
 * @param elTarget
 * @param canvasStyles
 */
export declare const DRAW_RESULT_APPEND_CHILD: (code: ScannerQRCodeResult, oriCanvas: HTMLCanvasElement, elTarget: HTMLCanvasElement | HTMLDivElement, canvasStyles: CanvasRenderingContext2D) => void;
/**
 * DRAW_RESULT_ON_CANVAS
 * @param code
 * @param cvs
 * @param canvasStyles
 */
export declare const DRAW_RESULT_ON_CANVAS: (code: ScannerQRCodeResult, cvs: HTMLCanvasElement, canvasStyles?: CanvasRenderingContext2D) => void;
/**
 * READ_AS_DATA_URL
 * @param file
 * @param config
 * @return Promise
 */
export declare const READ_AS_DATA_URL: (file: File, configs: ScannerQRCodeConfig) => Promise<ScannerQRCodeSelectedFiles>;
/**
 * Convert canvas to blob
 * canvas.toBlob((blob) => { .. }, 'image/jpeg', 0.95); // JPEG at 95% quality
 * @param canvas
 * @param type
 * @return Promise
 */
export declare const CANVAS_TO_BLOB: (canvas: HTMLCanvasElement, type?: string) => Promise<any>;
/**
 * Convert blob to file
 * @param theBlob
 * @param fileName
 * @return File
 */
export declare const BLOB_TO_FILE: (theBlob: any, fileName: string) => File;
/**
 * FILES_TO_SCAN
 * @param files
 * @param configs
 * @param as
 * @returns
 */
export declare const FILES_TO_SCAN: (files: File[], configs: ScannerQRCodeConfig, as?: AsyncSubject<ScannerQRCodeSelectedFiles[]>) => AsyncSubject<ScannerQRCodeSelectedFiles[]>;
/**
 * FILL_TEXT_MULTI_LINE
 * @param ctx
 * @param text
 * @param x
 * @param y
 */
export declare const FILL_TEXT_MULTI_LINE: (ctx: CanvasRenderingContext2D, text: string, x: number, y: number) => void;
/**
 * COMPRESS_IMAGE
 * @param files
 * @param type
 * @param quality
 * @returns
 */
export declare const COMPRESS_IMAGE: (files: File[], quality: number, type: string) => Promise<FileList>;
/**
 * REMOVE_CANVAS
 * @param element
 */
export declare const REMOVE_CANVAS: (element: HTMLElement) => void;
/**
 * VIBRATE
 * Bật rung trên mobile
 * @param time
 */
export declare const VIBRATE: (time?: number) => void;
/**
 * IS_MOBILE
 * @returns
 */
export declare const IS_MOBILE: () => boolean;
