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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLyIsInNvdXJjZXMiOlsibGliL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQXFCLFNBQVMsRUFBRSxpQkFBaUIsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQztBQWtCcE0sTUFBTTtJQXNESjs7OztxQkF6Q2UsSUFBSSxZQUFZLEVBQXVCOzs7O21CQUtyQixjQUFjLENBQUMsR0FBRzttQkFDbEIsY0FBYyxDQUFDLEdBQUc7dUJBQ2QsY0FBYyxDQUFDLE9BQU87c0JBQ3RCLGNBQWMsQ0FBQyxNQUFNO3NCQUNyQixjQUFjOzJCQUNBLGNBQWMsQ0FBQyxXQUFXOzRCQUN2QixjQUFjLENBQUMsWUFBWTs7Ozt1QkFLdkQsS0FBSzt1QkFDTCxLQUFLO3lCQUNILEtBQUs7dUJBQ1AsS0FBSztvQkFDakIsSUFBSSxlQUFlLENBQXNCLElBQUksQ0FBQzt1QkFDM0MsSUFBSSxlQUFlLENBQXdCLEVBQUUsQ0FBQztpQ0FDNUIsQ0FBQztxQkFPcEIsSUFBSSxZQUFZLEVBQVc7c0JBRTFCO1lBQ2YsT0FBTyxFQUFFLEdB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QUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUM7Z0JBQ3BGLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDbEIsT0FBTyxFQUFFO29CQUNQLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUM7b0JBQzdCLE1BQU0sRUFBRSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUM7b0JBQy9CLFlBQVksRUFBRSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7aUJBQzVDO2dCQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQganNRUiBmcm9tIFwianNxclwiO1xyXG5pbXBvcnQgeyBBc3luY1N1YmplY3QsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDT05GSUdfREVGQVVMVCwgTUVESUFfU1RSRUFNX0RFRkFVTFQgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuZGVmYXVsdCc7XHJcbmltcG9ydCB7IEFTX0NPTVBMRVRFLCBCTE9CX1RPX0ZJTEUsIENBTlZBU19UT19CTE9CLCBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQsIEZJTEVTX1RPX1NDQU4sIE9WRVJSSURFUywgUExBWV9BVURJTywgUFJPUF9FWElTVFMsIFJFTU9WRV9DQU5WQVMsIFZJQlJBVEUgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuaGVscGVyJztcclxuaW1wb3J0IHsgU2Nhbm5lclFSQ29kZUNvbmZpZywgU2Nhbm5lclFSQ29kZURldmljZSwgU2Nhbm5lclFSQ29kZVJlc3VsdCwgU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXMgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUub3B0aW9ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjcmVzdWx0c1BhbmVsIGNsYXNzPVwib3JpZ2luLW92ZXJsYXlcIj48L2Rpdj48Y2FudmFzICNjYW52YXMgY2xhc3M9XCJvcmlnaW4tY2FudmFzXCI+PC9jYW52YXM+PHZpZGVvICN2aWRlbyBwbGF5c2lubGluZSBjbGFzcz1cIm9yaWdpbi12aWRlb1wiPjwvdmlkZW8+YCxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgaG9zdDogeyAnY2xhc3MnOiAnbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZScgfSxcclxuICBleHBvcnRBczogJ3NjYW5uZXInLFxyXG4gIGlucHV0czogWydzcmMnLCAnZnBzJywgJ3ZpYnJhdGUnLCAnaXNCZWVwJywgJ2NvbmZpZycsICdjb25zdHJhaW50cycsICdjYW52YXNTdHlsZXMnXSxcclxuICBvdXRwdXRzOiBbJ2V2ZW50J10sXHJcbiAgcXVlcmllczoge1xyXG4gICAgdmlkZW86IG5ldyBWaWV3Q2hpbGQoJ3ZpZGVvJyksXHJcbiAgICBjYW52YXM6IG5ldyBWaWV3Q2hpbGQoJ2NhbnZhcycpLFxyXG4gICAgcmVzdWx0c1BhbmVsOiBuZXcgVmlld0NoaWxkKCdyZXN1bHRzUGFuZWwnKVxyXG4gIH0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4U2Nhbm5lclFyY29kZVNpbmdsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgLyoqXHJcbiAgICogRWxlbWVudFxyXG4gICAqIHBsYXlzaW5saW5lIHJlcXVpcmVkIHRvIHRlbGwgaU9TIHNhZmFyaSB3ZSBkb24ndCB3YW50IGZ1bGxzY3JlZW5cclxuICAgKi9cclxuICBwdWJsaWMgdmlkZW8hOiBFbGVtZW50UmVmPEhUTUxWaWRlb0VsZW1lbnQ+O1xyXG4gIHB1YmxpYyBjYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcclxuICBwdWJsaWMgcmVzdWx0c1BhbmVsITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gIC8qKlxyXG4gICAqIEV2ZW50RW1pdHRlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBldmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8U2Nhbm5lclFSQ29kZVJlc3VsdD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5wdXRcclxuICAgKi9cclxuICBwdWJsaWMgc3JjOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5zcmM7XHJcbiAgcHVibGljIGZwczogbnVtYmVyIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQuZnBzO1xyXG4gIHB1YmxpYyB2aWJyYXRlOiBudW1iZXIgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC52aWJyYXRlO1xyXG4gIHB1YmxpYyBpc0JlZXA6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5pc0JlZXA7XHJcbiAgcHVibGljIGNvbmZpZzogU2Nhbm5lclFSQ29kZUNvbmZpZyA9IENPTkZJR19ERUZBVUxUO1xyXG4gIHB1YmxpYyBjb25zdHJhaW50czogTWVkaWFTdHJlYW1Db25zdHJhaW50cyB8IGFueSA9IENPTkZJR19ERUZBVUxULmNvbnN0cmFpbnRzO1xyXG4gIHB1YmxpYyBjYW52YXNTdHlsZXM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IGFueSA9IENPTkZJR19ERUZBVUxULmNhbnZhc1N0eWxlcztcclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0XHJcbiAgKi9cclxuICBwdWJsaWMgaXNTdGFydDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1BhdXNlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1RvcmNoOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNjYW5uZXJRUkNvZGVSZXN1bHQ+KG51bGwpO1xyXG4gIHB1YmxpYyBkZXZpY2VzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTY2FubmVyUVJDb2RlRGV2aWNlW10+KFtdKTtcclxuICBwdWJsaWMgZGV2aWNlSW5kZXhBY3RpdmU6IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByaXZhdGVcclxuICAqL1xyXG4gIHByaXZhdGUgckFGX0lEOiBhbnk7XHJcbiAgcHJpdmF0ZSBkYXRhRm9yUmVzaXplITogU2Nhbm5lclFSQ29kZVJlc3VsdDtcclxuICBwcml2YXRlIHJlYWR5ID0gbmV3IEFzeW5jU3ViamVjdDxib29sZWFuPigpO1xyXG5cclxuICBwcml2YXRlIFNUQVRVUyA9IHtcclxuICAgIHN0YXJ0T046ICgpID0+IHRoaXMuaXNTdGFydCA9IHRydWUsXHJcbiAgICBwYXVzZU9OOiAoKSA9PiB0aGlzLmlzUGF1c2UgPSB0cnVlLFxyXG4gICAgbG9hZGluZ09OOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IHRydWUsXHJcbiAgICBzdGFydE9GRjogKCkgPT4gdGhpcy5pc1N0YXJ0ID0gZmFsc2UsXHJcbiAgICBwYXVzZU9GRjogKCkgPT4gdGhpcy5pc1BhdXNlID0gZmFsc2UsXHJcbiAgICBsb2FkaW5nT0ZGOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlLFxyXG4gICAgdG9yY2hPRkY6ICgpID0+IHRoaXMuaXNUb3JjaCA9IGZhbHNlLFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLm92ZXJyaWRlQ29uZmlnKCk7XHJcbiAgICBpZiAodGhpcy5zcmMpIHtcclxuICAgICAgdGhpcy5sb2FkSW1hZ2UodGhpcy5zcmMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuICB9XHJcbiAgXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBBU19DT01QTEVURSh0aGlzLnJlYWR5LCB0cnVlKSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdGFydFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHN0YXJ0KHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgIC8vIFJlamVjdFxyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gZml4IHNhZmFyaVxyXG4gICAgICB0aGlzLnNhZmFyaVdlYlJUQyhhcywgcGxheURldmljZUN1c3RvbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdG9wXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgc3RvcCgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICB0aGlzLlNUQVRVUy5wYXVzZU9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLnRvcmNoT0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJBRl9JRCk7XHJcbiAgICAgICh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3JjT2JqZWN0IGFzIE1lZGlhU3RyZWFtKS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjazogTWVkaWFTdHJlYW1UcmFjaykgPT4ge1xyXG4gICAgICAgIHRyYWNrLnN0b3AoKTtcclxuICAgICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBSRU1PVkVfQ0FOVkFTKHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvciBhcyBhbnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGxheVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHBsYXkoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzUGF1c2UpIHtcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgdGhpcy5TVEFUVVMucGF1c2VPRkYoKTtcclxuICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoOTApO1xyXG4gICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGF1c2VcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdCBcclxuICAgKi9cclxuICBwdWJsaWMgcGF1c2UoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzU3RhcnQpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJBRl9JRCk7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5wYXVzZSgpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5wYXVzZU9OKCk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwbGF5RGV2aWNlXHJcbiAgICogQHBhcmFtIGRldmljZUlkIFxyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdCBcclxuICAgKi9cclxuICBwdWJsaWMgcGxheURldmljZShkZXZpY2VJZDogc3RyaW5nLCBhczogQXN5bmNTdWJqZWN0PGFueT4gPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKSk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGV4aXN0RGV2aWNlSWQgPSB0aGlzLmlzU3RhcnQgPyB0aGlzLmdldENvbnN0cmFpbnRzKCkuZGV2aWNlSWQgIT09IGRldmljZUlkIDogdHJ1ZTtcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICBjYXNlIGRldmljZUlkID09PSAnbnVsbCcgfHwgZGV2aWNlSWQgPT09ICd1bmRlZmluZWQnIHx8ICFkZXZpY2VJZDpcclxuICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBkZXZpY2VJZCAmJiBleGlzdERldmljZUlkOlxyXG4gICAgICAgIHN0b3AoKTtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAvLyBMb2FkaW5nIG9uXHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09OKCk7XHJcbiAgICAgICAgdGhpcy5kZXZpY2VJbmRleEFjdGl2ZSA9IHRoaXMuZGV2aWNlcy52YWx1ZS5maW5kSW5kZXgoKGY6IFNjYW5uZXJRUkNvZGVEZXZpY2UpID0+IGYuZGV2aWNlSWQgPT09IGRldmljZUlkKTtcclxuICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHsgLi4udGhpcy5jb25zdHJhaW50cywgYXVkaW86IGZhbHNlLCB2aWRlbzogeyBkZXZpY2VJZDogZGV2aWNlSWQsIC4uLnRoaXMuY29uc3RyYWludHMudmlkZW8gfSB9O1xyXG4gICAgICAgIC8vIE1lZGlhU3RyZWFtXHJcbiAgICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHtcclxuICAgICAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQub25sb2FkZWRtZXRhZGF0YSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcclxuICAgICAgICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9OKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ldmVudEVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbG9hZEltYWdlXHJcbiAgICogQHBhcmFtIHNyYyBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgLy8gTG9hZGluZyBvblxyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgLy8gU2V0IHRoZSBzcmMgb2YgdGhpcyBJbWFnZSBvYmplY3QuXHJcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgLy8gU2V0dGluZyBjcm9zcyBvcmlnaW4gdmFsdWUgdG8gYW5vbnltb3VzXHJcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xyXG4gICAgLy8gV2hlbiBvdXIgaW1hZ2UgaGFzIGxvYWRlZC5cclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgdGhpcy5kcmF3SW1hZ2UoaW1hZ2UsIChmbGFnOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZsYWcpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBTZXQgc3JjXHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB0b3JjaGVyXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgdG9yY2hlcigpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IHRoaXMuYXBwbHlDb25zdHJhaW50cyh7IGFkdmFuY2VkOiBbeyB0b3JjaDogdGhpcy5pc1RvcmNoIH1dIH0pO1xyXG4gICAgYXMuc3Vic2NyaWJlKCgpID0+IGZhbHNlLCAoKSA9PiB0aGlzLmlzVG9yY2ggPSAhdGhpcy5pc1RvcmNoKTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGx5Q29uc3RyYWludHNcclxuICAgKiBAcGFyYW0gY29uc3RyYWludHMgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgYXBwbHlDb25zdHJhaW50cyhjb25zdHJhaW50czogTWVkaWFUcmFja0NvbnN0cmFpbnRTZXQgfCBNZWRpYVRyYWNrQ29uc3RyYWludHMgfCBhbnkpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCBhcyBNZWRpYVN0cmVhbTtcclxuICAgIGNvbnN0IHZpZGVvVHJhY2sgPSBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXSBhcyBNZWRpYVN0cmVhbVRyYWNrO1xyXG4gICAgY29uc3QgaW1hZ2VDYXB0dXJlID0gbmV3ICh3aW5kb3cgYXMgYW55KS5JbWFnZUNhcHR1cmUodmlkZW9UcmFjayk7XHJcbiAgICBpbWFnZUNhcHR1cmUuZ2V0UGhvdG9DYXBhYmlsaXRpZXMoKS50aGVuKGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgdmlkZW9UcmFjay5hcHBseUNvbnN0cmFpbnRzKGNvbnN0cmFpbnRzKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgc3dpdGNoIChlcnJvciAmJiBlcnJvci5uYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgY2FzZSAnRGV2aWNlc05vdEZvdW5kRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnUmVxdWlyZWQgdHJhY2sgaXMgbWlzc2luZycgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ05vdFJlYWRhYmxlRXJyb3InOlxyXG4gICAgICAgIGNhc2UgJ1RyYWNrU3RhcnRFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdXZWJjYW0gb3IgbWljIGFyZSBhbHJlYWR5IGluIHVzZScgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ092ZXJjb25zdHJhaW5lZEVycm9yJzpcclxuICAgICAgICBjYXNlICdDb25zdHJhaW50Tm90U2F0aXNmaWVkRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnQ29uc3RyYWludHMgY2FuIG5vdCBiZSBzYXRpc2ZpZWQgYnkgYXZiLiBkZXZpY2VzJyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnTm90QWxsb3dlZEVycm9yJzpcclxuICAgICAgICBjYXNlICdQZXJtaXNzaW9uRGVuaWVkRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnUGVybWlzc2lvbiBkZW5pZWQgaW4gYnJvd3NlcicgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1R5cGVFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdFbXB0eSBjb25zdHJhaW50cyBvYmplY3QnIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvciBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIGdldENvbnN0cmFpbnRzXHJcbiAgICogQHJldHVybnMgXHJcbiAgICovXHJcbiAgcHVibGljIGdldENvbnN0cmFpbnRzKCk6IE1lZGlhVHJhY2tDb25zdHJhaW50U2V0IHwgYW55IHtcclxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW07XHJcbiAgICBjb25zdCB2aWRlb1RyYWNrID0gc3RyZWFtICYmIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdIGFzIE1lZGlhU3RyZWFtVHJhY2s7XHJcbiAgICByZXR1cm4gdmlkZW9UcmFjayAmJiB2aWRlb1RyYWNrLmdldENvbnN0cmFpbnRzKCkgYXMgYW55O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZG93bmxvYWRcclxuICAgKiBAcGFyYW0gZmlsZU5hbWUgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgZG93bmxvYWQoZmlsZU5hbWU6IHN0cmluZyA9IGBuZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLSR7RGF0ZS5ub3coKX0ucG5nYCk6IEFzeW5jU3ViamVjdDxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdPiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgY29uc3QgcnVuID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBibG9iID0gYXdhaXQgQ0FOVkFTX1RPX0JMT0IodGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSBCTE9CX1RPX0ZJTEUoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICBGSUxFU19UT19TQ0FOKFtmaWxlXSwgdGhpcy5jb25maWcsIGFzKS5zdWJzY3JpYmUoKHJlczogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXSkgPT4ge1xyXG4gICAgICAgIHJlcy5mb3JFYWNoKChpdGVtOiBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgIGxpbmsuaHJlZiA9IGl0ZW0udXJsO1xyXG4gICAgICAgICAgbGluay5kb3dubG9hZCA9IGl0ZW0ubmFtZTtcclxuICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgIGxpbmsucmVtb3ZlKClcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBydW4oKTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHdpbmRvdzogcmVzaXplXHJcbiAgICogRHJhdyBhZ2FpbiFcclxuICAgKi9cclxuICBwcml2YXRlIHJlc2l6ZSgpOiB2b2lkIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZGF0YUZvclJlc2l6ZSkge1xyXG4gICAgICAgIERSQVdfUkVTVUxUX0FQUEVORF9DSElMRCh0aGlzLmRhdGFGb3JSZXNpemUgYXMgYW55LCB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LCB0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLmNhbnZhc1N0eWxlcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogT3ZlcnJpZGUgY29uZmlnXHJcbiAgICogQHJldHVybiB2b2lkXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBvdmVycmlkZUNvbmZpZygpOiB2b2lkIHtcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ3NyYycpKSB0aGlzLnNyYyA9IHRoaXMuY29uZmlnLnNyYztcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ2ZwcycpKSB0aGlzLmZwcyA9IHRoaXMuY29uZmlnLmZwcztcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ3ZpYnJhdGUnKSkgdGhpcy52aWJyYXRlID0gdGhpcy5jb25maWcudmlicmF0ZTtcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ2lzQmVlcCcpKSB0aGlzLmlzQmVlcCA9IHRoaXMuY29uZmlnLmlzQmVlcDtcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ2NvbnN0cmFpbnRzJykpIHRoaXMuY29uc3RyYWludHMgPSBPVkVSUklERVMoJ2NvbnN0cmFpbnRzJywgdGhpcy5jb25maWcsIE1FRElBX1NUUkVBTV9ERUZBVUxUKTtcclxuICAgIGlmIChQUk9QX0VYSVNUUyh0aGlzLmNvbmZpZywgJ2NhbnZhc1N0eWxlcycpKSB0aGlzLmNhbnZhc1N0eWxlcyA9IHRoaXMuY29uZmlnLmNhbnZhc1N0eWxlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHNhZmFyaVdlYlJUQ1xyXG4gICAqIEZpeCBpc3N1ZSBvbiBzYWZhcmlcclxuICAgKiBodHRwczovL3dlYnJ0Y2hhY2tzLmNvbS9ndWlkZS10by1zYWZhcmktd2VicnRjXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgc2FmYXJpV2ViUlRDKGFzOiBBc3luY1N1YmplY3Q8YW55PiwgcGxheURldmljZUN1c3RvbT86IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICAvLyBMb2FkaW5nIG9uXHJcbiAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMubG9hZGluZ09OKCk7XHJcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSh0aGlzLmNvbnN0cmFpbnRzKS50aGVuKChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7XHJcbiAgICAgIHN0cmVhbS5nZXRUcmFja3MoKS5mb3JFYWNoKHRyYWNrID0+IHRyYWNrLnN0b3AoKSk7XHJcbiAgICAgIHRoaXMubG9hZEFsbERldmljZXMoYXMsIHBsYXlEZXZpY2VDdXN0b20pO1xyXG4gICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbG9hZEFsbERldmljZXNcclxuICAgKiBAcGFyYW0gYXMgXHJcbiAgICogQHBhcmFtIHBsYXlEZXZpY2VDdXN0b20gXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBsb2FkQWxsRGV2aWNlcyhhczogQXN5bmNTdWJqZWN0PGFueT4sIHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5lbnVtZXJhdGVEZXZpY2VzKCkudGhlbihkZXZpY2VzID0+IHtcclxuICAgICAgbGV0IGNhbWVyYURldmljZXM6IFNjYW5uZXJRUkNvZGVEZXZpY2VbXSA9IGRldmljZXMuZmlsdGVyKGYgPT4gZi5raW5kID09ICd2aWRlb2lucHV0Jyk7XHJcbiAgICAgIHRoaXMuZGV2aWNlcy5uZXh0KGNhbWVyYURldmljZXMpO1xyXG4gICAgICBpZiAoY2FtZXJhRGV2aWNlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGNhbWVyYURldmljZXMpO1xyXG4gICAgICAgIHBsYXlEZXZpY2VDdXN0b20gPyBwbGF5RGV2aWNlQ3VzdG9tKGNhbWVyYURldmljZXMpIDogdGhpcy5wbGF5RGV2aWNlKGNhbWVyYURldmljZXNbMF0uZGV2aWNlSWQpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ05vIGNhbWVyYSBkZXRlY3RlZC4nIGFzIGFueSk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRyYXdJbWFnZVxyXG4gICAqIEBwYXJhbSBlbGVtZW50IFxyXG4gICAqIEBwYXJhbSBjYWxsYmFjayBcclxuICAgKi9cclxuICBwcml2YXRlIGFzeW5jIGRyYXdJbWFnZShlbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50IHwgSFRNTFZpZGVvRWxlbWVudCwgY2FsbGJhY2s6IEZ1bmN0aW9uID0gKCkgPT4geyB9KTogUHJvbWlzZTx2b2lkPiB7XHJcbiAgICAvLyBHZXQgdGhlIGNhbnZhcyBlbGVtZW50IGJ5IHVzaW5nIHRoZSBnZXRFbGVtZW50QnlJZCBtZXRob2QuXHJcbiAgICBjb25zdCBjYW52YXMgPSB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50O1xyXG4gICAgLy8gR2V0IGEgMkQgZHJhd2luZyBjb250ZXh0IGZvciB0aGUgY2FudmFzLlxyXG4gICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJywgeyB3aWxsUmVhZEZyZXF1ZW50bHk6IHRydWUgfSkgYXMgQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xyXG4gICAgLy8gSFRNTEltYWdlRWxlbWVudCBzaXplXHJcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgY2FudmFzLndpZHRoID0gZWxlbWVudC5uYXR1cmFsV2lkdGg7XHJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBlbGVtZW50Lm5hdHVyYWxIZWlnaHQ7XHJcbiAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xyXG4gICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gY2FudmFzLm9mZnNldEhlaWdodCArICdweCc7XHJcbiAgICB9XHJcbiAgICAvLyBIVE1MVmlkZW9FbGVtZW50IHNpemVcclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkge1xyXG4gICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50LnZpZGVvV2lkdGg7XHJcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSBlbGVtZW50LnZpZGVvSGVpZ2h0O1xyXG4gICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcclxuICAgICAgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICB9XHJcbiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodClcclxuICAgIC8vIERyYXcgaW1hZ2VcclxuICAgIGN0eC5kcmF3SW1hZ2UoZWxlbWVudCwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIC8vIERhdGEgaW1hZ2VcclxuICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgIC8vIERyYXcgZnJhbWVcclxuICAgIGNvbnN0IGNvZGUgPSBqc1FSKGltYWdlRGF0YS5kYXRhLCBpbWFnZURhdGEud2lkdGgsIGltYWdlRGF0YS5oZWlnaHQsIHtcclxuICAgICAgaW52ZXJzaW9uQXR0ZW1wdHM6IFwiZG9udEludmVydFwiLFxyXG4gICAgfSkgYXMgU2Nhbm5lclFSQ29kZVJlc3VsdDtcclxuICAgIGlmIChjb2RlICYmIGNvZGUuZGF0YSAhPT0gJycpIHtcclxuICAgICAgLy8gT3ZlcmxheVxyXG4gICAgICBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQoY29kZSwgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCwgdGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5jYW52YXNTdHlsZXMpO1xyXG5cclxuICAgICAgLy8gVG8gYmxvYiBhbmQgZW1pdCBkYXRhXHJcbiAgICAgIGNvbnN0IEVNSVRfREFUQSA9ICgpID0+IHtcclxuICAgICAgICB0aGlzLmV2ZW50RW1pdChjb2RlKTtcclxuICAgICAgICB0aGlzLmRhdGFGb3JSZXNpemUgPSBjb2RlO1xyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gSFRNTEltYWdlRWxlbWVudFxyXG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxJbWFnZUVsZW1lbnQpIHtcclxuICAgICAgICBjYWxsYmFjayh0cnVlKTtcclxuICAgICAgICBFTUlUX0RBVEEoKTtcclxuICAgICAgICBWSUJSQVRFKHRoaXMudmlicmF0ZSk7XHJcbiAgICAgICAgUExBWV9BVURJTyh0aGlzLmlzQmVlcCk7XHJcbiAgICAgIH1cclxuICAgICAgLy8gSFRNTFZpZGVvRWxlbWVudFxyXG4gICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQpIHtcclxuICAgICAgICBFTUlUX0RBVEEoKTtcclxuICAgICAgICBWSUJSQVRFKHRoaXMudmlicmF0ZSk7XHJcbiAgICAgICAgUExBWV9BVURJTyh0aGlzLmlzQmVlcCk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNhbGxiYWNrKGZhbHNlKTtcclxuICAgICAgUkVNT1ZFX0NBTlZBUyh0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgdGhpcy5kYXRhRm9yUmVzaXplID0gY29kZTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGV2ZW50RW1pdFxyXG4gICAqIEBwYXJhbSByZXNwb25zZSBcclxuICAgKi9cclxuICBwcml2YXRlIGV2ZW50RW1pdChyZXNwb25zZTogYW55ID0gZmFsc2UpOiB2b2lkIHtcclxuICAgIChyZXNwb25zZSAhPT0gZmFsc2UpICYmIHRoaXMuZGF0YS5uZXh0KHJlc3BvbnNlIHx8IHsgZGF0YTogbnVsbCB9KTtcclxuICAgIChyZXNwb25zZSAhPT0gZmFsc2UpICYmIHRoaXMuZXZlbnQuZW1pdChyZXNwb25zZSB8fCB7IGRhdGE6IG51bGwgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTaW5nbGUtdGhyZWFkXHJcbiAgICogTG9vcCBSZWNvcmRpbmcgb24gQ2FtZXJhXHJcbiAgICogTXVzdCBiZSBkZXN0cm95IHJlcXVlc3QgXHJcbiAgICogTm90IHVzaW5nOiByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcclxuICAgKiBAcGFyYW0gZGVsYXlcclxuICAgKi9cclxuICBwcml2YXRlIHJlcXVlc3RBbmltYXRpb25GcmFtZShkZWxheTogbnVtYmVyID0gMCk6IHZvaWQge1xyXG4gICAgdGhpcy5yQUZfSUQgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQucmVhZHlTdGF0ZSA9PT0gdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LkhBVkVfRU5PVUdIX0RBVEEpIHtcclxuICAgICAgICBkZWxheSA9IDA7XHJcbiAgICAgICAgdGhpcy5kcmF3SW1hZ2UodGhpcy52aWRlby5uYXRpdmVFbGVtZW50KTtcclxuICAgICAgfVxyXG4gICAgfSwgLyphdm9pZCBjYWNoZSBtZWRpYVN0cmVhbSovIGRlbGF5IHx8IHRoaXMuZnBzKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFN0YXR1cyBvZiB3YXNtXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBnZXQgaXNSZWFkeSgpOiBBc3luY1N1YmplY3Q8Ym9vbGVhbj4ge1xyXG4gICAgcmV0dXJuIHRoaXMucmVhZHk7XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMucGF1c2UoKTtcclxuICB9XHJcbn1cclxuIl19