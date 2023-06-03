import { ElementRef, EventEmitter, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { ScannerQRCodeConfig, ScannerQRCodeDevice, ScannerQRCodeResult, ScannerQRCodeSelectedFiles } from './ngx-scanner-qrcode-single.options';
export declare class NgxScannerQrcodeSingleComponent implements OnInit, OnDestroy, AfterViewInit {
    /**
     * Element
     * playsinline required to tell iOS safari we don't want fullscreen
     */
    video: ElementRef<HTMLVideoElement>;
    canvas: ElementRef<HTMLCanvasElement>;
    resultsPanel: ElementRef<HTMLDivElement>;
    /**
     * EventEmitter
     */
    event: EventEmitter<ScannerQRCodeResult>;
    /**
     * Input
     */
    src: string | undefined;
    fps: number | undefined;
    vibrate: number | undefined;
    isBeep: boolean | undefined;
    config: ScannerQRCodeConfig;
    constraints: MediaStreamConstraints | any;
    canvasStyles: CanvasRenderingContext2D | any;
    /**
     * Export
    */
    isStart: boolean;
    isPause: boolean;
    isLoading: boolean;
    isTorch: boolean;
    data: BehaviorSubject<ScannerQRCodeResult>;
    devices: BehaviorSubject<ScannerQRCodeDevice[]>;
    deviceIndexActive: number;
    /**
     * Private
    */
    private rAF_ID;
    private dataForResize;
    private ready;
    private STATUS;
    constructor();
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * start
     * @param playDeviceCustom
     * @return AsyncSubject
     */
    start(playDeviceCustom?: Function): AsyncSubject<any>;
    /**
     * stop
     * @return AsyncSubject
     */
    stop(): AsyncSubject<any>;
    /**
     * play
     * @return AsyncSubject
     */
    play(): AsyncSubject<any>;
    /**
     * pause
     * @return AsyncSubject
     */
    pause(): AsyncSubject<any>;
    /**
     * playDevice
     * @param deviceId
     * @param as
     * @return AsyncSubject
     */
    playDevice(deviceId: string, as?: AsyncSubject<any>): AsyncSubject<any>;
    /**
     * loadImage
     * @param src
     * @return AsyncSubject
     */
    loadImage(src: string): AsyncSubject<any>;
    /**
     * torcher
     * @return AsyncSubject
     */
    torcher(): AsyncSubject<any>;
    /**
     * applyConstraints
     * @param constraints
     * @return AsyncSubject
     */
    applyConstraints(constraints: MediaTrackConstraintSet | MediaTrackConstraints | any): AsyncSubject<any>;
    /**
     * getConstraints
     * @returns
     */
    getConstraints(): MediaTrackConstraintSet | any;
    /**
     * download
     * @param fileName
     * @return AsyncSubject
     */
    download(fileName?: string): AsyncSubject<ScannerQRCodeSelectedFiles[]>;
    /**
     * window: resize
     * Draw again!
     */
    private resize;
    /**
     * Override config
     * @return void
     */
    private overrideConfig;
    /**
     * safariWebRTC
     * Fix issue on safari
     * https://webrtchacks.com/guide-to-safari-webrtc
     * @param as
     * @param playDeviceCustom
     */
    private safariWebRTC;
    /**
     * loadAllDevices
     * @param as
     * @param playDeviceCustom
     */
    private loadAllDevices;
    /**
     * drawImage
     * @param element
     * @param callback
     */
    private drawImage;
    /**
     * eventEmit
     * @param response
     */
    private eventEmit;
    /**
     * Single-thread
     * Loop Recording on Camera
     * Must be destroy request
     * Not using: requestAnimationFrame
     * @param delay
     */
    private requestAnimationFrame;
    /**
     * Status of wasm
     * @return AsyncSubject
     */
    readonly isReady: AsyncSubject<boolean>;
    ngOnDestroy(): void;
}
