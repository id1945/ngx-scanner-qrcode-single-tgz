/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { Component, EventEmitter, ViewChild, ViewEncapsulation } from '@angular/core';
import jsQR from "jsqr";
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { CONFIG_DEFAULT, MEDIA_STREAM_DEFAULT } from './ngx-scanner-qrcode-single.default';
import { AS_COMPLETE, BLOB_TO_FILE, CANVAS_TO_BLOB, DRAW_RESULT_APPEND_CHILD, FILES_TO_SCAN, OVERRIDES, PLAY_AUDIO, PROP_EXISTS, REMOVE_CANVAS, VIBRATE } from './ngx-scanner-qrcode-single.helper';
export class NgxScannerQrcodeSingleComponent {
    constructor() {
        /**
         * EventEmitter
         */
        this.event = new EventEmitter();
        /**
         * Input
         */
        this.src = CONFIG_DEFAULT.src;
        this.fps = CONFIG_DEFAULT.fps;
        this.vibrate = CONFIG_DEFAULT.vibrate;
        this.isBeep = CONFIG_DEFAULT.isBeep;
        this.config = CONFIG_DEFAULT;
        this.constraints = CONFIG_DEFAULT.constraints;
        this.canvasStyles = CONFIG_DEFAULT.canvasStyles;
        /**
         * Export
         */
        this.isStart = false;
        this.isPause = false;
        this.isLoading = false;
        this.isTorch = false;
        this.data = new BehaviorSubject(null);
        this.devices = new BehaviorSubject([]);
        this.deviceIndexActive = 0;
        this.ready = new AsyncSubject();
        this.STATUS = {
            startON: () => this.isStart = true,
            pauseON: () => this.isPause = true,
            loadingON: () => this.isLoading = true,
            startOFF: () => this.isStart = false,
            pauseOFF: () => this.isPause = false,
            loadingOFF: () => this.isLoading = false,
            torchOFF: () => this.isTorch = false,
        };
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.overrideConfig();
        if (this.src) {
            this.loadImage(this.src);
        }
        this.resize();
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        setTimeout(() => AS_COMPLETE(this.ready, true), 1000);
    }
    /**
     * start
     * @param {?=} playDeviceCustom
     * @return {?} AsyncSubject
     */
    start(playDeviceCustom) {
        /** @type {?} */
        const as = new AsyncSubject();
        if (this.isStart) {
            // Reject
            AS_COMPLETE(as, false);
        }
        else {
            // fix safari
            this.safariWebRTC(as, playDeviceCustom);
        }
        return as;
    }
    /**
     * stop
     * @return {?} AsyncSubject
     */
    stop() {
        this.STATUS.pauseOFF();
        this.STATUS.startOFF();
        this.STATUS.torchOFF();
        this.STATUS.loadingOFF();
        /** @type {?} */
        const as = new AsyncSubject();
        try {
            clearInterval(this.rAF_ID);
            (/** @type {?} */ (this.video.nativeElement.srcObject)).getTracks().forEach((track) => {
                track.stop();
                AS_COMPLETE(as, true);
            });
            REMOVE_CANVAS(this.resultsPanel.nativeElement);
        }
        catch (error) {
            AS_COMPLETE(as, false, /** @type {?} */ (error));
        }
        return as;
    }
    /**
     * play
     * @return {?} AsyncSubject
     */
    play() {
        /** @type {?} */
        const as = new AsyncSubject();
        if (this.isPause) {
            this.video.nativeElement.play();
            this.STATUS.pauseOFF();
            this.requestAnimationFrame(90);
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * pause
     * @return {?} AsyncSubject
     */
    pause() {
        /** @type {?} */
        const as = new AsyncSubject();
        if (this.isStart) {
            clearInterval(this.rAF_ID);
            this.video.nativeElement.pause();
            this.STATUS.pauseON();
            AS_COMPLETE(as, true);
        }
        else {
            AS_COMPLETE(as, false);
        }
        return as;
    }
    /**
     * playDevice
     * @param {?} deviceId
     * @param {?=} as
     * @return {?} AsyncSubject
     */
    playDevice(deviceId, as = new AsyncSubject()) {
        /** @type {?} */
        const existDeviceId = this.isStart ? this.getConstraints().deviceId !== deviceId : true;
        switch (true) {
            case deviceId === 'null' || deviceId === 'undefined' || !deviceId:
                stop();
                this.stop();
                AS_COMPLETE(as, false);
                break;
            case deviceId && existDeviceId:
                stop();
                this.stop();
                // Loading on
                this.STATUS.loadingON();
                this.deviceIndexActive = this.devices.value.findIndex((f) => f.deviceId === deviceId);
                /** @type {?} */
                const constraints = Object.assign({}, this.constraints, { audio: false, video: Object.assign({ deviceId: deviceId }, this.constraints.video) });
                // MediaStream
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    this.video.nativeElement.srcObject = stream;
                    this.video.nativeElement.onloadedmetadata = () => {
                        this.video.nativeElement.play();
                        this.requestAnimationFrame();
                        AS_COMPLETE(as, true);
                        this.STATUS.startON();
                        this.STATUS.loadingOFF();
                    };
                }).catch((error) => {
                    this.eventEmit(false);
                    AS_COMPLETE(as, false, error);
                    this.STATUS.startOFF();
                    this.STATUS.loadingOFF();
                });
                break;
            default:
                AS_COMPLETE(as, false);
                this.STATUS.loadingOFF();
                break;
        }
        return as;
    }
    /**
     * loadImage
     * @param {?} src
     * @return {?} AsyncSubject
     */
    loadImage(src) {
        /** @type {?} */
        const as = new AsyncSubject();
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        /** @type {?} */
        const image = new Image();
        // Setting cross origin value to anonymous
        image.setAttribute('crossOrigin', 'anonymous');
        // When our image has loaded.
        image.onload = () => {
            this.drawImage(image, (flag) => {
                AS_COMPLETE(as, flag);
                this.STATUS.startOFF();
                this.STATUS.loadingOFF();
            });
        };
        // Set src
        image.src = src;
        return as;
    }
    /**
     * torcher
     * @return {?} AsyncSubject
     */
    torcher() {
        /** @type {?} */
        const as = this.applyConstraints({ advanced: [{ torch: this.isTorch }] });
        as.subscribe(() => false, () => this.isTorch = !this.isTorch);
        return as;
    }
    /**
     * applyConstraints
     * @param {?} constraints
     * @return {?} AsyncSubject
     */
    applyConstraints(constraints) {
        /** @type {?} */
        const as = new AsyncSubject();
        /** @type {?} */
        const stream = /** @type {?} */ (this.video.nativeElement.srcObject);
        /** @type {?} */
        const videoTrack = /** @type {?} */ (stream.getVideoTracks()[0]);
        /** @type {?} */
        const imageCapture = new (/** @type {?} */ (window)).ImageCapture(videoTrack);
        imageCapture.getPhotoCapabilities().then(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield videoTrack.applyConstraints(constraints);
            AS_COMPLETE(as, true);
        })).catch((error) => {
            switch (error && error.name) {
                case 'NotFoundError':
                case 'DevicesNotFoundError':
                    AS_COMPLETE(as, false, /** @type {?} */ ('Required track is missing'));
                    break;
                case 'NotReadableError':
                case 'TrackStartError':
                    AS_COMPLETE(as, false, /** @type {?} */ ('Webcam or mic are already in use'));
                    break;
                case 'OverconstrainedError':
                case 'ConstraintNotSatisfiedError':
                    AS_COMPLETE(as, false, /** @type {?} */ ('Constraints can not be satisfied by avb. devices'));
                    break;
                case 'NotAllowedError':
                case 'PermissionDeniedError':
                    AS_COMPLETE(as, false, /** @type {?} */ ('Permission denied in browser'));
                    break;
                case 'TypeError':
                    AS_COMPLETE(as, false, /** @type {?} */ ('Empty constraints object'));
                    break;
                default:
                    AS_COMPLETE(as, false, /** @type {?} */ (error));
                    break;
            }
        });
        return as;
    }
    ;
    /**
     * getConstraints
     * @return {?}
     */
    getConstraints() {
        /** @type {?} */
        const stream = /** @type {?} */ (this.video.nativeElement.srcObject);
        /** @type {?} */
        const videoTrack = stream && /** @type {?} */ (stream.getVideoTracks()[0]);
        return videoTrack && /** @type {?} */ (videoTrack.getConstraints());
    }
    /**
     * download
     * @param {?=} fileName
     * @return {?} AsyncSubject
     */
    download(fileName = `ngx-scanner-qrcode-single-${Date.now()}.png`) {
        /** @type {?} */
        const as = new AsyncSubject();
        /** @type {?} */
        const run = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const blob = yield CANVAS_TO_BLOB(this.canvas.nativeElement);
            /** @type {?} */
            const file = BLOB_TO_FILE(blob, fileName);
            FILES_TO_SCAN([file], this.config, as).subscribe((res) => {
                res.forEach((item) => {
                    /** @type {?} */
                    const link = document.createElement('a');
                    link.href = item.url;
                    link.download = item.name;
                    link.click();
                    link.remove();
                });
            });
        });
        run();
        return as;
    }
    /**
     * window: resize
     * Draw again!
     * @return {?}
     */
    resize() {
        window.addEventListener("resize", () => {
            if (this.dataForResize) {
                DRAW_RESULT_APPEND_CHILD(/** @type {?} */ (this.dataForResize), this.canvas.nativeElement, this.resultsPanel.nativeElement, this.canvasStyles);
                this.video.nativeElement.style.height = this.canvas.nativeElement.offsetHeight + 'px';
            }
        });
    }
    /**
     * Override config
     * @return {?} void
     */
    overrideConfig() {
        if (PROP_EXISTS(this.config, 'src'))
            this.src = this.config.src;
        if (PROP_EXISTS(this.config, 'fps'))
            this.fps = this.config.fps;
        if (PROP_EXISTS(this.config, 'vibrate'))
            this.vibrate = this.config.vibrate;
        if (PROP_EXISTS(this.config, 'isBeep'))
            this.isBeep = this.config.isBeep;
        if (PROP_EXISTS(this.config, 'constraints'))
            this.constraints = OVERRIDES('constraints', this.config, MEDIA_STREAM_DEFAULT);
        if (PROP_EXISTS(this.config, 'canvasStyles'))
            this.canvasStyles = this.config.canvasStyles;
    }
    /**
     * safariWebRTC
     * Fix issue on safari
     * https://webrtchacks.com/guide-to-safari-webrtc
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    safariWebRTC(as, playDeviceCustom) {
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        navigator.mediaDevices.getUserMedia(this.constraints).then((stream) => {
            stream.getTracks().forEach(track => track.stop());
            this.loadAllDevices(as, playDeviceCustom);
        }).catch((error) => {
            AS_COMPLETE(as, false, error);
            this.STATUS.startOFF();
            this.STATUS.loadingOFF();
        });
    }
    /**
     * loadAllDevices
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    loadAllDevices(as, playDeviceCustom) {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            /** @type {?} */
            let cameraDevices = devices.filter(f => f.kind == 'videoinput');
            this.devices.next(cameraDevices);
            if (cameraDevices.length > 0) {
                AS_COMPLETE(as, cameraDevices);
                playDeviceCustom ? playDeviceCustom(cameraDevices) : this.playDevice(cameraDevices[0].deviceId);
            }
            else {
                AS_COMPLETE(as, false, /** @type {?} */ ('No camera detected.'));
                this.STATUS.startOFF();
                this.STATUS.loadingOFF();
            }
        }).catch((error) => {
            AS_COMPLETE(as, false, error);
            this.STATUS.startOFF();
            this.STATUS.loadingOFF();
        });
    }
    /**
     * drawImage
     * @param {?} element
     * @param {?=} callback
     * @return {?}
     */
    drawImage(element, callback = () => { }) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            /** @type {?} */
            const canvas = this.canvas.nativeElement;
            /** @type {?} */
            const ctx = /** @type {?} */ (canvas.getContext('2d', { willReadFrequently: true }));
            // HTMLImageElement size
            if (element instanceof HTMLImageElement) {
                canvas.width = element.naturalWidth;
                canvas.height = element.naturalHeight;
                element.style.visibility = '';
                this.video.nativeElement.style.visibility = 'hidden';
                this.video.nativeElement.style.height = canvas.offsetHeight + 'px';
            }
            // HTMLVideoElement size
            if (element instanceof HTMLVideoElement) {
                canvas.width = element.videoWidth;
                canvas.height = element.videoHeight;
                element.style.visibility = '';
                this.canvas.nativeElement.style.visibility = 'hidden';
            }
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw image
            ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
            /** @type {?} */
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            /** @type {?} */
            const code = /** @type {?} */ (jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "dontInvert",
            }));
            if (code && code.data !== '') {
                // Overlay
                DRAW_RESULT_APPEND_CHILD(code, this.canvas.nativeElement, this.resultsPanel.nativeElement, this.canvasStyles);
                /** @type {?} */
                const EMIT_DATA = () => {
                    this.eventEmit(code);
                    this.dataForResize = code;
                };
                // HTMLImageElement
                if (element instanceof HTMLImageElement) {
                    callback(true);
                    EMIT_DATA();
                    VIBRATE(this.vibrate);
                    PLAY_AUDIO(this.isBeep);
                }
                // HTMLVideoElement
                if (element instanceof HTMLVideoElement) {
                    EMIT_DATA();
                    VIBRATE(this.vibrate);
                    PLAY_AUDIO(this.isBeep);
                }
            }
            else {
                callback(false);
                REMOVE_CANVAS(this.resultsPanel.nativeElement);
                this.dataForResize = code;
            }
        });
    }
    /**
     * eventEmit
     * @param {?=} response
     * @return {?}
     */
    eventEmit(response = false) {
        (response !== false) && this.data.next(response || { data: null });
        (response !== false) && this.event.emit(response || { data: null });
    }
    /**
     * Single-thread
     * Loop Recording on Camera
     * Must be destroy request
     * Not using: requestAnimationFrame
     * @param {?=} delay
     * @return {?}
     */
    requestAnimationFrame(delay = 0) {
        this.rAF_ID = setInterval(() => {
            if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
                delay = 0;
                this.drawImage(this.video.nativeElement);
            }
        }, /*avoid cache mediaStream*/ /*avoid cache mediaStream*/ delay || this.fps);
    }
    /**
     * Status of wasm
     * @return {?} AsyncSubject
     */
    get isReady() {
        return this.ready;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.pause();
    }
}
NgxScannerQrcodeSingleComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-scanner-qrcode-single',
                template: `<div #resultsPanel class="origin-overlay"></div><canvas #canvas class="origin-canvas"></canvas><video #video playsinline class="origin-video"></video>`,
                host: { 'class': 'ngx-scanner-qrcode-single' },
                exportAs: 'scanner',
                inputs: ['src', 'fps', 'vibrate', 'isBeep', 'config', 'constraints', 'canvasStyles'],
                outputs: ['event'],
                queries: {
                    video: new ViewChild('video'),
                    canvas: new ViewChild('canvas'),
                    resultsPanel: new ViewChild('resultsPanel')
                },
                encapsulation: ViewEncapsulation.None,
                styles: [".ngx-scanner-qrcode-single{display:block;position:relative}.origin-overlay{width:100%;position:absolute}.origin-overlay span{z-index:2;color:red;text-align:left;position:absolute}.origin-overlay .qrcode-polygon{z-index:1;position:absolute}.origin-canvas{width:100%;position:absolute}.origin-video{width:100%;background-color:#262626}.qrcode-tooltip{z-index:3;position:absolute}.qrcode-tooltip:hover .qrcode-tooltip-temp{display:block;position:absolute}.qrcode-tooltip-temp{bottom:0;left:50%;padding:5px;color:#fff;text-align:left;display:none;max-width:450px;border-radius:5px;width:-moz-max-content;width:max-content;word-wrap:break-word;transform:translate(-50%);transform-style:preserve-3d;background-color:#000000d0;box-shadow:1px 1px 20px #000000e0}.qrcode-tooltip-temp .qrcode-tooltip-clipboard{cursor:pointer;margin-left:5px;fill:#fff}.qrcode-tooltip-temp .qrcode-tooltip-clipboard:active{fill:#afafaf}"]
            }] }
];
/** @nocollapse */
NgxScannerQrcodeSingleComponent.ctorParameters = () => [];
if (false) {
    /**
     * Element
     * playsinline required to tell iOS safari we don't want fullscreen
     * @type {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.video;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.canvas;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.resultsPanel;
    /**
     * EventEmitter
     * @type {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.event;
    /**
     * Input
     * @type {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.src;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.fps;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.vibrate;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.isBeep;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.config;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.constraints;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.canvasStyles;
    /**
     * Export
     * @type {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.isStart;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.isPause;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.isLoading;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.isTorch;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.data;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.devices;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.deviceIndexActive;
    /**
     * Private
     * @type {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.rAF_ID;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.dataForResize;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.ready;
    /** @type {?} */
    NgxScannerQrcodeSingleComponent.prototype.STATUS;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLyIsInNvdXJjZXMiOlsibGliL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQXFCLFNBQVMsRUFBRSxpQkFBaUIsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQWtCcE0sTUFBTTtJQXNESjs7OztxQkF6Q2UsSUFBSSxZQUFZLEVBQXVCOzs7O21CQUtyQixjQUFjLENBQUMsR0FBRzttQkFDbEIsY0FBYyxDQUFDLEdBQUc7dUJBQ2QsY0FBYyxDQUFDLE9BQU87c0JBQ3RCLGNBQWMsQ0FBQyxNQUFNO3NCQUNyQixjQUFjOzJCQUNBLGNBQWMsQ0FBQyxXQUFXOzRCQUN2QixjQUFjLENBQUMsWUFBWTs7Ozt1QkFLdkQsS0FBSzt1QkFDTCxLQUFLO3lCQUNILEtBQUs7dUJBQ1AsS0FBSztvQkFDakIsSUFBSSxlQUFlLENBQXNCLElBQUksQ0FBQzt1QkFDM0MsSUFBSSxlQUFlLENBQXdCLEVBQUUsQ0FBQztpQ0FDNUIsQ0FBQztxQkFPcEIsSUFBSSxZQUFZLEVBQVc7c0JBRTFCO1lBQ2YsT0FBTyxFQUFFLEdB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RUFBRSx3SkFBd0o7Z0JBRWxLLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRTtnQkFDOUMsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQztnQkFDcEYsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNsQixPQUFPLEVBQUU7b0JBQ1AsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFDN0IsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQztvQkFDL0IsWUFBWSxFQUFFLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztpQkFDNUM7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2FBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIE9uRGVzdHJveSwgT25Jbml0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uLCBBZnRlclZpZXdJbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCBqc1FSIGZyb20gXCJqc3FyXCI7XHJcbmltcG9ydCB7IEFzeW5jU3ViamVjdCwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7IENPTkZJR19ERUZBVUxULCBNRURJQV9TVFJFQU1fREVGQVVMVCB9IGZyb20gJy4vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5kZWZhdWx0JztcclxuaW1wb3J0IHsgQVNfQ09NUExFVEUsIEJMT0JfVE9fRklMRSwgQ0FOVkFTX1RPX0JMT0IsIERSQVdfUkVTVUxUX0FQUEVORF9DSElMRCwgRklMRVNfVE9fU0NBTiwgT1ZFUlJJREVTLCBQTEFZX0FVRElPLCBQUk9QX0VYSVNUUywgUkVNT1ZFX0NBTlZBUywgVklCUkFURSB9IGZyb20gJy4vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5oZWxwZXInO1xyXG5pbXBvcnQgeyBTY2FubmVyUVJDb2RlQ29uZmlnLCBTY2FubmVyUVJDb2RlRGV2aWNlLCBTY2FubmVyUVJDb2RlUmVzdWx0LCBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcyB9IGZyb20gJy4vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5vcHRpb25zJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZScsXHJcbiAgdGVtcGxhdGU6IGA8ZGl2ICNyZXN1bHRzUGFuZWwgY2xhc3M9XCJvcmlnaW4tb3ZlcmxheVwiPjwvZGl2PjxjYW52YXMgI2NhbnZhcyBjbGFzcz1cIm9yaWdpbi1jYW52YXNcIj48L2NhbnZhcz48dmlkZW8gI3ZpZGVvIHBsYXlzaW5saW5lIGNsYXNzPVwib3JpZ2luLXZpZGVvXCI+PC92aWRlbz5gLFxyXG4gIHN0eWxlVXJsczogWycuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuY29tcG9uZW50LnNjc3MnXSxcclxuICBob3N0OiB7ICdjbGFzcyc6ICduZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlJyB9LFxyXG4gIGV4cG9ydEFzOiAnc2Nhbm5lcicsXHJcbiAgaW5wdXRzOiBbJ3NyYycsICdmcHMnLCAndmlicmF0ZScsICdpc0JlZXAnLCAnY29uZmlnJywgJ2NvbnN0cmFpbnRzJywgJ2NhbnZhc1N0eWxlcyddLFxyXG4gIG91dHB1dHM6IFsnZXZlbnQnXSxcclxuICBxdWVyaWVzOiB7XHJcbiAgICB2aWRlbzogbmV3IFZpZXdDaGlsZCgndmlkZW8nKSxcclxuICAgIGNhbnZhczogbmV3IFZpZXdDaGlsZCgnY2FudmFzJyksXHJcbiAgICByZXN1bHRzUGFuZWw6IG5ldyBWaWV3Q2hpbGQoJ3Jlc3VsdHNQYW5lbCcpXHJcbiAgfSxcclxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTY2FubmVyUXJjb2RlU2luZ2xlQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xyXG5cclxuICAvKipcclxuICAgKiBFbGVtZW50XHJcbiAgICogcGxheXNpbmxpbmUgcmVxdWlyZWQgdG8gdGVsbCBpT1Mgc2FmYXJpIHdlIGRvbid0IHdhbnQgZnVsbHNjcmVlblxyXG4gICAqL1xyXG4gIHB1YmxpYyB2aWRlbyE6IEVsZW1lbnRSZWY8SFRNTFZpZGVvRWxlbWVudD47XHJcbiAgcHVibGljIGNhbnZhcyE6IEVsZW1lbnRSZWY8SFRNTENhbnZhc0VsZW1lbnQ+O1xyXG4gIHB1YmxpYyByZXN1bHRzUGFuZWwhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcclxuXHJcbiAgLyoqXHJcbiAgICogRXZlbnRFbWl0dGVyXHJcbiAgICovXHJcbiAgcHVibGljIGV2ZW50ID0gbmV3IEV2ZW50RW1pdHRlcjxTY2FubmVyUVJDb2RlUmVzdWx0PigpO1xyXG5cclxuICAvKipcclxuICAgKiBJbnB1dFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzcmM6IHN0cmluZyB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULnNyYztcclxuICBwdWJsaWMgZnBzOiBudW1iZXIgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5mcHM7XHJcbiAgcHVibGljIHZpYnJhdGU6IG51bWJlciB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULnZpYnJhdGU7XHJcbiAgcHVibGljIGlzQmVlcDogYm9vbGVhbiB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULmlzQmVlcDtcclxuICBwdWJsaWMgY29uZmlnOiBTY2FubmVyUVJDb2RlQ29uZmlnID0gQ09ORklHX0RFRkFVTFQ7XHJcbiAgcHVibGljIGNvbnN0cmFpbnRzOiBNZWRpYVN0cmVhbUNvbnN0cmFpbnRzIHwgYW55ID0gQ09ORklHX0RFRkFVTFQuY29uc3RyYWludHM7XHJcbiAgcHVibGljIGNhbnZhc1N0eWxlczogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEIHwgYW55ID0gQ09ORklHX0RFRkFVTFQuY2FudmFzU3R5bGVzO1xyXG5cclxuICAvKipcclxuICAgKiBFeHBvcnRcclxuICAqL1xyXG4gIHB1YmxpYyBpc1N0YXJ0OiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzUGF1c2U6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzVG9yY2g6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgZGF0YSA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U2Nhbm5lclFSQ29kZVJlc3VsdD4obnVsbCk7XHJcbiAgcHVibGljIGRldmljZXMgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNjYW5uZXJRUkNvZGVEZXZpY2VbXT4oW10pO1xyXG4gIHB1YmxpYyBkZXZpY2VJbmRleEFjdGl2ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgLyoqXHJcbiAgICogUHJpdmF0ZVxyXG4gICovXHJcbiAgcHJpdmF0ZSByQUZfSUQ6IGFueTtcclxuICBwcml2YXRlIGRhdGFGb3JSZXNpemUhOiBTY2FubmVyUVJDb2RlUmVzdWx0O1xyXG4gIHByaXZhdGUgcmVhZHkgPSBuZXcgQXN5bmNTdWJqZWN0PGJvb2xlYW4+KCk7XHJcblxyXG4gIHByaXZhdGUgU1RBVFVTID0ge1xyXG4gICAgc3RhcnRPTjogKCkgPT4gdGhpcy5pc1N0YXJ0ID0gdHJ1ZSxcclxuICAgIHBhdXNlT046ICgpID0+IHRoaXMuaXNQYXVzZSA9IHRydWUsXHJcbiAgICBsb2FkaW5nT046ICgpID0+IHRoaXMuaXNMb2FkaW5nID0gdHJ1ZSxcclxuICAgIHN0YXJ0T0ZGOiAoKSA9PiB0aGlzLmlzU3RhcnQgPSBmYWxzZSxcclxuICAgIHBhdXNlT0ZGOiAoKSA9PiB0aGlzLmlzUGF1c2UgPSBmYWxzZSxcclxuICAgIGxvYWRpbmdPRkY6ICgpID0+IHRoaXMuaXNMb2FkaW5nID0gZmFsc2UsXHJcbiAgICB0b3JjaE9GRjogKCkgPT4gdGhpcy5pc1RvcmNoID0gZmFsc2UsXHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcigpIHsgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMub3ZlcnJpZGVDb25maWcoKTtcclxuICAgIGlmICh0aGlzLnNyYykge1xyXG4gICAgICB0aGlzLmxvYWRJbWFnZSh0aGlzLnNyYyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlc2l6ZSgpO1xyXG4gIH1cclxuICBcclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IEFTX0NPTVBMRVRFKHRoaXMucmVhZHksIHRydWUpLCAxMDAwKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0YXJ0XHJcbiAgICogQHBhcmFtIHBsYXlEZXZpY2VDdXN0b20gXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgc3RhcnQocGxheURldmljZUN1c3RvbT86IEZ1bmN0aW9uKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzU3RhcnQpIHtcclxuICAgICAgLy8gUmVqZWN0XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBmaXggc2FmYXJpXHJcbiAgICAgIHRoaXMuc2FmYXJpV2ViUlRDKGFzLCBwbGF5RGV2aWNlQ3VzdG9tKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHN0b3BcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdG9wKCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIHRoaXMuU1RBVFVTLnBhdXNlT0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMudG9yY2hPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuckFGX0lEKTtcclxuICAgICAgKHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW0pLmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrOiBNZWRpYVN0cmVhbVRyYWNrKSA9PiB7XHJcbiAgICAgICAgdHJhY2suc3RvcCgpO1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgfSk7XHJcbiAgICAgIFJFTU9WRV9DQU5WQVModGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yIGFzIGFueSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwbGF5XHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgcGxheSgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgaWYgKHRoaXMuaXNQYXVzZSkge1xyXG4gICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQucGxheSgpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5wYXVzZU9GRigpO1xyXG4gICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSg5MCk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwYXVzZVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0IFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwYXVzZSgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgaWYgKHRoaXMuaXNTdGFydCkge1xyXG4gICAgICBjbGVhckludGVydmFsKHRoaXMuckFGX0lEKTtcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBhdXNlKCk7XHJcbiAgICAgIHRoaXMuU1RBVFVTLnBhdXNlT04oKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBsYXlEZXZpY2VcclxuICAgKiBAcGFyYW0gZGV2aWNlSWQgXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0IFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwbGF5RGV2aWNlKGRldmljZUlkOiBzdHJpbmcsIGFzOiBBc3luY1N1YmplY3Q8YW55PiA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgZXhpc3REZXZpY2VJZCA9IHRoaXMuaXNTdGFydCA/IHRoaXMuZ2V0Q29uc3RyYWludHMoKS5kZXZpY2VJZCAhPT0gZGV2aWNlSWQgOiB0cnVlO1xyXG4gICAgc3dpdGNoICh0cnVlKSB7XHJcbiAgICAgIGNhc2UgZGV2aWNlSWQgPT09ICdudWxsJyB8fCBkZXZpY2VJZCA9PT0gJ3VuZGVmaW5lZCcgfHwgIWRldmljZUlkOlxyXG4gICAgICAgIHN0b3AoKTtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGRldmljZUlkICYmIGV4aXN0RGV2aWNlSWQ6XHJcbiAgICAgICAgc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIC8vIExvYWRpbmcgb25cclxuICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT04oKTtcclxuICAgICAgICB0aGlzLmRldmljZUluZGV4QWN0aXZlID0gdGhpcy5kZXZpY2VzLnZhbHVlLmZpbmRJbmRleCgoZjogU2Nhbm5lclFSQ29kZURldmljZSkgPT4gZi5kZXZpY2VJZCA9PT0gZGV2aWNlSWQpO1xyXG4gICAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0geyAuLi50aGlzLmNvbnN0cmFpbnRzLCBhdWRpbzogZmFsc2UsIHZpZGVvOiB7IGRldmljZUlkOiBkZXZpY2VJZCwgLi4udGhpcy5jb25zdHJhaW50cy52aWRlbyB9IH07XHJcbiAgICAgICAgLy8gTWVkaWFTdHJlYW1cclxuICAgICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYShjb25zdHJhaW50cykudGhlbigoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5vbmxvYWRlZG1ldGFkYXRhID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQucGxheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnJlcXVlc3RBbmltYXRpb25GcmFtZSgpO1xyXG4gICAgICAgICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T04oKTtcclxuICAgICAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgICAgICB0aGlzLmV2ZW50RW1pdChmYWxzZSk7XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yKTtcclxuICAgICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBsb2FkSW1hZ2VcclxuICAgKiBAcGFyYW0gc3JjIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIGxvYWRJbWFnZShzcmM6IHN0cmluZyk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICAvLyBMb2FkaW5nIG9uXHJcbiAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMubG9hZGluZ09OKCk7XHJcbiAgICAvLyBTZXQgdGhlIHNyYyBvZiB0aGlzIEltYWdlIG9iamVjdC5cclxuICAgIGNvbnN0IGltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICAvLyBTZXR0aW5nIGNyb3NzIG9yaWdpbiB2YWx1ZSB0byBhbm9ueW1vdXNcclxuICAgIGltYWdlLnNldEF0dHJpYnV0ZSgnY3Jvc3NPcmlnaW4nLCAnYW5vbnltb3VzJyk7XHJcbiAgICAvLyBXaGVuIG91ciBpbWFnZSBoYXMgbG9hZGVkLlxyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmRyYXdJbWFnZShpbWFnZSwgKGZsYWc6IGJvb2xlYW4pID0+IHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmxhZyk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfTtcclxuICAgIC8vIFNldCBzcmNcclxuICAgIGltYWdlLnNyYyA9IHNyYztcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHRvcmNoZXJcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyB0b3JjaGVyKCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gdGhpcy5hcHBseUNvbnN0cmFpbnRzKHsgYWR2YW5jZWQ6IFt7IHRvcmNoOiB0aGlzLmlzVG9yY2ggfV0gfSk7XHJcbiAgICBhcy5zdWJzY3JpYmUoKCkgPT4gZmFsc2UsICgpID0+IHRoaXMuaXNUb3JjaCA9ICF0aGlzLmlzVG9yY2gpO1xyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYXBwbHlDb25zdHJhaW50c1xyXG4gICAqIEBwYXJhbSBjb25zdHJhaW50cyBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBhcHBseUNvbnN0cmFpbnRzKGNvbnN0cmFpbnRzOiBNZWRpYVRyYWNrQ29uc3RyYWludFNldCB8IE1lZGlhVHJhY2tDb25zdHJhaW50cyB8IGFueSk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3JjT2JqZWN0IGFzIE1lZGlhU3RyZWFtO1xyXG4gICAgY29uc3QgdmlkZW9UcmFjayA9IHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdIGFzIE1lZGlhU3RyZWFtVHJhY2s7XHJcbiAgICBjb25zdCBpbWFnZUNhcHR1cmUgPSBuZXcgKHdpbmRvdyBhcyBhbnkpLkltYWdlQ2FwdHVyZSh2aWRlb1RyYWNrKTtcclxuICAgIGltYWdlQ2FwdHVyZS5nZXRQaG90b0NhcGFiaWxpdGllcygpLnRoZW4oYXN5bmMgKCkgPT4ge1xyXG4gICAgICBhd2FpdCB2aWRlb1RyYWNrLmFwcGx5Q29uc3RyYWludHMoY29uc3RyYWludHMpO1xyXG4gICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICBzd2l0Y2ggKGVycm9yICYmIGVycm9yLm5hbWUpIHtcclxuICAgICAgICBjYXNlICdOb3RGb3VuZEVycm9yJzpcclxuICAgICAgICBjYXNlICdEZXZpY2VzTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdSZXF1aXJlZCB0cmFjayBpcyBtaXNzaW5nJyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnTm90UmVhZGFibGVFcnJvcic6XHJcbiAgICAgICAgY2FzZSAnVHJhY2tTdGFydEVycm9yJzpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1dlYmNhbSBvciBtaWMgYXJlIGFscmVhZHkgaW4gdXNlJyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnT3ZlcmNvbnN0cmFpbmVkRXJyb3InOlxyXG4gICAgICAgIGNhc2UgJ0NvbnN0cmFpbnROb3RTYXRpc2ZpZWRFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdDb25zdHJhaW50cyBjYW4gbm90IGJlIHNhdGlzZmllZCBieSBhdmIuIGRldmljZXMnIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdOb3RBbGxvd2VkRXJyb3InOlxyXG4gICAgICAgIGNhc2UgJ1Blcm1pc3Npb25EZW5pZWRFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdQZXJtaXNzaW9uIGRlbmllZCBpbiBicm93c2VyJyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnVHlwZUVycm9yJzpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ0VtcHR5IGNvbnN0cmFpbnRzIG9iamVjdCcgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogZ2V0Q29uc3RyYWludHNcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgZ2V0Q29uc3RyYWludHMoKTogTWVkaWFUcmFja0NvbnN0cmFpbnRTZXQgfCBhbnkge1xyXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCBhcyBNZWRpYVN0cmVhbTtcclxuICAgIGNvbnN0IHZpZGVvVHJhY2sgPSBzdHJlYW0gJiYgc3RyZWFtLmdldFZpZGVvVHJhY2tzKClbMF0gYXMgTWVkaWFTdHJlYW1UcmFjaztcclxuICAgIHJldHVybiB2aWRlb1RyYWNrICYmIHZpZGVvVHJhY2suZ2V0Q29uc3RyYWludHMoKSBhcyBhbnk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkb3dubG9hZFxyXG4gICAqIEBwYXJhbSBmaWxlTmFtZSBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBkb3dubG9hZChmaWxlTmFtZTogc3RyaW5nID0gYG5neC1zY2FubmVyLXFyY29kZS1zaW5nbGUtJHtEYXRlLm5vdygpfS5wbmdgKTogQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBjb25zdCBydW4gPSBhc3luYyAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IGJsb2IgPSBhd2FpdCBDQU5WQVNfVE9fQkxPQih0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgY29uc3QgZmlsZSA9IEJMT0JfVE9fRklMRShibG9iLCBmaWxlTmFtZSk7XHJcbiAgICAgIEZJTEVTX1RPX1NDQU4oW2ZpbGVdLCB0aGlzLmNvbmZpZywgYXMpLnN1YnNjcmliZSgocmVzOiBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdKSA9PiB7XHJcbiAgICAgICAgcmVzLmZvckVhY2goKGl0ZW06IFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gICAgICAgICAgbGluay5ocmVmID0gaXRlbS51cmw7XHJcbiAgICAgICAgICBsaW5rLmRvd25sb2FkID0gaXRlbS5uYW1lO1xyXG4gICAgICAgICAgbGluay5jbGljaygpO1xyXG4gICAgICAgICAgbGluay5yZW1vdmUoKVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJ1bigpO1xyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogd2luZG93OiByZXNpemVcclxuICAgKiBEcmF3IGFnYWluIVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVzaXplKCk6IHZvaWQge1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy5kYXRhRm9yUmVzaXplKSB7XHJcbiAgICAgICAgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxEKHRoaXMuZGF0YUZvclJlc2l6ZSBhcyBhbnksIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQsIHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2FudmFzU3R5bGVzKTtcclxuICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE92ZXJyaWRlIGNvbmZpZ1xyXG4gICAqIEByZXR1cm4gdm9pZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgb3ZlcnJpZGVDb25maWcoKTogdm9pZCB7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdzcmMnKSkgdGhpcy5zcmMgPSB0aGlzLmNvbmZpZy5zcmM7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdmcHMnKSkgdGhpcy5mcHMgPSB0aGlzLmNvbmZpZy5mcHM7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICd2aWJyYXRlJykpIHRoaXMudmlicmF0ZSA9IHRoaXMuY29uZmlnLnZpYnJhdGU7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdpc0JlZXAnKSkgdGhpcy5pc0JlZXAgPSB0aGlzLmNvbmZpZy5pc0JlZXA7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdjb25zdHJhaW50cycpKSB0aGlzLmNvbnN0cmFpbnRzID0gT1ZFUlJJREVTKCdjb25zdHJhaW50cycsIHRoaXMuY29uZmlnLCBNRURJQV9TVFJFQU1fREVGQVVMVCk7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdjYW52YXNTdHlsZXMnKSkgdGhpcy5jYW52YXNTdHlsZXMgPSB0aGlzLmNvbmZpZy5jYW52YXNTdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzYWZhcmlXZWJSVENcclxuICAgKiBGaXggaXNzdWUgb24gc2FmYXJpXHJcbiAgICogaHR0cHM6Ly93ZWJydGNoYWNrcy5jb20vZ3VpZGUtdG8tc2FmYXJpLXdlYnJ0Y1xyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKi9cclxuICBwcml2YXRlIHNhZmFyaVdlYlJUQyhhczogQXN5bmNTdWJqZWN0PGFueT4sIHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgLy8gTG9hZGluZyBvblxyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEodGhpcy5jb25zdHJhaW50cykudGhlbigoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xyXG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5zdG9wKCkpO1xyXG4gICAgICB0aGlzLmxvYWRBbGxEZXZpY2VzKGFzLCBwbGF5RGV2aWNlQ3VzdG9tKTtcclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRBbGxEZXZpY2VzXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgbG9hZEFsbERldmljZXMoYXM6IEFzeW5jU3ViamVjdDxhbnk+LCBwbGF5RGV2aWNlQ3VzdG9tPzogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpLnRoZW4oZGV2aWNlcyA9PiB7XHJcbiAgICAgIGxldCBjYW1lcmFEZXZpY2VzOiBTY2FubmVyUVJDb2RlRGV2aWNlW10gPSBkZXZpY2VzLmZpbHRlcihmID0+IGYua2luZCA9PSAndmlkZW9pbnB1dCcpO1xyXG4gICAgICB0aGlzLmRldmljZXMubmV4dChjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgaWYgKGNhbWVyYURldmljZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgICBwbGF5RGV2aWNlQ3VzdG9tID8gcGxheURldmljZUN1c3RvbShjYW1lcmFEZXZpY2VzKSA6IHRoaXMucGxheURldmljZShjYW1lcmFEZXZpY2VzWzBdLmRldmljZUlkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdObyBjYW1lcmEgZGV0ZWN0ZWQuJyBhcyBhbnkpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yKTtcclxuICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkcmF3SW1hZ2VcclxuICAgKiBAcGFyYW0gZWxlbWVudCBcclxuICAgKiBAcGFyYW0gY2FsbGJhY2sgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhc3luYyBkcmF3SW1hZ2UoZWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IEhUTUxWaWRlb0VsZW1lbnQsIGNhbGxiYWNrOiBGdW5jdGlvbiA9ICgpID0+IHsgfSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gR2V0IHRoZSBjYW52YXMgZWxlbWVudCBieSB1c2luZyB0aGUgZ2V0RWxlbWVudEJ5SWQgbWV0aG9kLlxyXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudDtcclxuICAgIC8vIEdldCBhIDJEIGRyYXdpbmcgY29udGV4dCBmb3IgdGhlIGNhbnZhcy5cclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIEhUTUxJbWFnZUVsZW1lbnQgc2l6ZVxyXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IGVsZW1lbnQubmF0dXJhbFdpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudC5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGNhbnZhcy5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgfVxyXG4gICAgLy8gSFRNTFZpZGVvRWxlbWVudCBzaXplXHJcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQpIHtcclxuICAgICAgY2FudmFzLndpZHRoID0gZWxlbWVudC52aWRlb1dpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudC52aWRlb0hlaWdodDtcclxuICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XHJcbiAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgfVxyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpXHJcbiAgICAvLyBEcmF3IGltYWdlXHJcbiAgICBjdHguZHJhd0ltYWdlKGVsZW1lbnQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEYXRhIGltYWdlXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEcmF3IGZyYW1lXHJcbiAgICBjb25zdCBjb2RlID0ganNRUihpbWFnZURhdGEuZGF0YSwgaW1hZ2VEYXRhLndpZHRoLCBpbWFnZURhdGEuaGVpZ2h0LCB7XHJcbiAgICAgIGludmVyc2lvbkF0dGVtcHRzOiBcImRvbnRJbnZlcnRcIixcclxuICAgIH0pIGFzIFNjYW5uZXJRUkNvZGVSZXN1bHQ7XHJcbiAgICBpZiAoY29kZSAmJiBjb2RlLmRhdGEgIT09ICcnKSB7XHJcbiAgICAgIC8vIE92ZXJsYXlcclxuICAgICAgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxEKGNvZGUsIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQsIHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2FudmFzU3R5bGVzKTtcclxuXHJcbiAgICAgIC8vIFRvIGJsb2IgYW5kIGVtaXQgZGF0YVxyXG4gICAgICBjb25zdCBFTUlUX0RBVEEgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEVtaXQoY29kZSk7XHJcbiAgICAgICAgdGhpcy5kYXRhRm9yUmVzaXplID0gY29kZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEhUTUxJbWFnZUVsZW1lbnRcclxuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XHJcbiAgICAgICAgRU1JVF9EQVRBKCk7XHJcbiAgICAgICAgVklCUkFURSh0aGlzLnZpYnJhdGUpO1xyXG4gICAgICAgIFBMQVlfQVVESU8odGhpcy5pc0JlZXApO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEhUTUxWaWRlb0VsZW1lbnRcclxuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50KSB7XHJcbiAgICAgICAgRU1JVF9EQVRBKCk7XHJcbiAgICAgICAgVklCUkFURSh0aGlzLnZpYnJhdGUpO1xyXG4gICAgICAgIFBMQVlfQVVESU8odGhpcy5pc0JlZXApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhmYWxzZSk7XHJcbiAgICAgIFJFTU9WRV9DQU5WQVModGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIHRoaXMuZGF0YUZvclJlc2l6ZSA9IGNvZGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBldmVudEVtaXRcclxuICAgKiBAcGFyYW0gcmVzcG9uc2UgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBldmVudEVtaXQocmVzcG9uc2U6IGFueSA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmRhdGEubmV4dChyZXNwb25zZSB8fCB7IGRhdGE6IG51bGwgfSk7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmV2ZW50LmVtaXQocmVzcG9uc2UgfHwgeyBkYXRhOiBudWxsIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2luZ2xlLXRocmVhZFxyXG4gICAqIExvb3AgUmVjb3JkaW5nIG9uIENhbWVyYVxyXG4gICAqIE11c3QgYmUgZGVzdHJveSByZXF1ZXN0IFxyXG4gICAqIE5vdCB1c2luZzogcmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICogQHBhcmFtIGRlbGF5XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZGVsYXk6IG51bWJlciA9IDApOiB2b2lkIHtcclxuICAgIHRoaXMuckFGX0lEID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnJlYWR5U3RhdGUgPT09IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5IQVZFX0VOT1VHSF9EQVRBKSB7XHJcbiAgICAgICAgZGVsYXkgPSAwO1xyXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH0sIC8qYXZvaWQgY2FjaGUgbWVkaWFTdHJlYW0qLyBkZWxheSB8fCB0aGlzLmZwcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGF0dXMgb2Ygd2FzbVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgZ2V0IGlzUmVhZHkoKTogQXN5bmNTdWJqZWN0PGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==