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
var NgxScannerQrcodeSingleComponent = /** @class */ (function () {
    function NgxScannerQrcodeSingleComponent() {
        var _this = this;
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
            startON: function () { return _this.isStart = true; },
            pauseON: function () { return _this.isPause = true; },
            loadingON: function () { return _this.isLoading = true; },
            startOFF: function () { return _this.isStart = false; },
            pauseOFF: function () { return _this.isPause = false; },
            loadingOFF: function () { return _this.isLoading = false; },
            torchOFF: function () { return _this.isTorch = false; },
        };
    }
    /**
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.overrideConfig();
        if (this.src) {
            this.loadImage(this.src);
        }
        this.resize();
    };
    /**
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.ngAfterViewInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        setTimeout(function () { return AS_COMPLETE(_this.ready, true); }, 1000);
    };
    /**
     * start
     * @param {?=} playDeviceCustom
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.start = /**
     * start
     * @param {?=} playDeviceCustom
     * @return {?} AsyncSubject
     */
    function (playDeviceCustom) {
        /** @type {?} */
        var as = new AsyncSubject();
        if (this.isStart) {
            // Reject
            AS_COMPLETE(as, false);
        }
        else {
            // fix safari
            this.safariWebRTC(as, playDeviceCustom);
        }
        return as;
    };
    /**
     * stop
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.stop = /**
     * stop
     * @return {?} AsyncSubject
     */
    function () {
        this.STATUS.pauseOFF();
        this.STATUS.startOFF();
        this.STATUS.torchOFF();
        this.STATUS.loadingOFF();
        /** @type {?} */
        var as = new AsyncSubject();
        try {
            clearInterval(this.rAF_ID);
            (/** @type {?} */ (this.video.nativeElement.srcObject)).getTracks().forEach(function (track) {
                track.stop();
                AS_COMPLETE(as, true);
            });
            REMOVE_CANVAS(this.resultsPanel.nativeElement);
        }
        catch (error) {
            AS_COMPLETE(as, false, /** @type {?} */ (error));
        }
        return as;
    };
    /**
     * play
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.play = /**
     * play
     * @return {?} AsyncSubject
     */
    function () {
        /** @type {?} */
        var as = new AsyncSubject();
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
    };
    /**
     * pause
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.pause = /**
     * pause
     * @return {?} AsyncSubject
     */
    function () {
        /** @type {?} */
        var as = new AsyncSubject();
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
    };
    /**
     * playDevice
     * @param {?} deviceId
     * @param {?=} as
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.playDevice = /**
     * playDevice
     * @param {?} deviceId
     * @param {?=} as
     * @return {?} AsyncSubject
     */
    function (deviceId, as) {
        var _this = this;
        if (as === void 0) { as = new AsyncSubject(); }
        /** @type {?} */
        var existDeviceId = this.isStart ? this.getConstraints().deviceId !== deviceId : true;
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
                this.deviceIndexActive = this.devices.value.findIndex(function (f) { return f.deviceId === deviceId; });
                /** @type {?} */
                var constraints = tslib_1.__assign({}, this.constraints, { audio: false, video: tslib_1.__assign({ deviceId: deviceId }, this.constraints.video) });
                // MediaStream
                navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    _this.video.nativeElement.srcObject = stream;
                    _this.video.nativeElement.onloadedmetadata = function () {
                        _this.video.nativeElement.play();
                        _this.requestAnimationFrame();
                        AS_COMPLETE(as, true);
                        _this.STATUS.startON();
                        _this.STATUS.loadingOFF();
                    };
                }).catch(function (error) {
                    _this.eventEmit(false);
                    AS_COMPLETE(as, false, error);
                    _this.STATUS.startOFF();
                    _this.STATUS.loadingOFF();
                });
                break;
            default:
                AS_COMPLETE(as, false);
                this.STATUS.loadingOFF();
                break;
        }
        return as;
    };
    /**
     * loadImage
     * @param {?} src
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.loadImage = /**
     * loadImage
     * @param {?} src
     * @return {?} AsyncSubject
     */
    function (src) {
        var _this = this;
        /** @type {?} */
        var as = new AsyncSubject();
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        /** @type {?} */
        var image = new Image();
        // Setting cross origin value to anonymous
        image.setAttribute('crossOrigin', 'anonymous');
        // When our image has loaded.
        image.onload = function () {
            _this.drawImage(image, function (flag) {
                AS_COMPLETE(as, flag);
                _this.STATUS.startOFF();
                _this.STATUS.loadingOFF();
            });
        };
        // Set src
        image.src = src;
        return as;
    };
    /**
     * torcher
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.torcher = /**
     * torcher
     * @return {?} AsyncSubject
     */
    function () {
        var _this = this;
        /** @type {?} */
        var as = this.applyConstraints({ advanced: [{ torch: this.isTorch }] });
        as.subscribe(function () { return false; }, function () { return _this.isTorch = !_this.isTorch; });
        return as;
    };
    /**
     * applyConstraints
     * @param {?} constraints
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.applyConstraints = /**
     * applyConstraints
     * @param {?} constraints
     * @return {?} AsyncSubject
     */
    function (constraints) {
        var _this = this;
        /** @type {?} */
        var as = new AsyncSubject();
        /** @type {?} */
        var stream = /** @type {?} */ (this.video.nativeElement.srcObject);
        /** @type {?} */
        var videoTrack = /** @type {?} */ (stream.getVideoTracks()[0]);
        /** @type {?} */
        var imageCapture = new (/** @type {?} */ (window)).ImageCapture(videoTrack);
        imageCapture.getPhotoCapabilities().then(function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, videoTrack.applyConstraints(constraints)];
                    case 1:
                        _a.sent();
                        AS_COMPLETE(as, true);
                        return [2 /*return*/];
                }
            });
        }); }).catch(function (error) {
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
    };
    ;
    /**
     * getConstraints
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.getConstraints = /**
     * getConstraints
     * @return {?}
     */
    function () {
        /** @type {?} */
        var stream = /** @type {?} */ (this.video.nativeElement.srcObject);
        /** @type {?} */
        var videoTrack = stream && /** @type {?} */ (stream.getVideoTracks()[0]);
        return videoTrack && /** @type {?} */ (videoTrack.getConstraints());
    };
    /**
     * download
     * @param {?=} fileName
     * @return {?} AsyncSubject
     */
    NgxScannerQrcodeSingleComponent.prototype.download = /**
     * download
     * @param {?=} fileName
     * @return {?} AsyncSubject
     */
    function (fileName) {
        var _this = this;
        if (fileName === void 0) { fileName = "ngx-scanner-qrcode-single-" + Date.now() + ".png"; }
        /** @type {?} */
        var as = new AsyncSubject();
        /** @type {?} */
        var run = function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var blob, file;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, CANVAS_TO_BLOB(this.canvas.nativeElement)];
                    case 1:
                        blob = _a.sent();
                        file = BLOB_TO_FILE(blob, fileName);
                        FILES_TO_SCAN([file], this.config, as).subscribe(function (res) {
                            res.forEach(function (item) {
                                /** @type {?} */
                                var link = document.createElement('a');
                                link.href = item.url;
                                link.download = item.name;
                                link.click();
                                link.remove();
                            });
                        });
                        return [2 /*return*/];
                }
            });
        }); };
        run();
        return as;
    };
    /**
     * window: resize
     * Draw again!
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.resize = /**
     * window: resize
     * Draw again!
     * @return {?}
     */
    function () {
        var _this = this;
        window.addEventListener("resize", function () {
            if (_this.dataForResize) {
                DRAW_RESULT_APPEND_CHILD(/** @type {?} */ (_this.dataForResize), _this.canvas.nativeElement, _this.resultsPanel.nativeElement, _this.canvasStyles);
            }
        });
    };
    /**
     * Override config
     * @return {?} void
     */
    NgxScannerQrcodeSingleComponent.prototype.overrideConfig = /**
     * Override config
     * @return {?} void
     */
    function () {
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
    };
    /**
     * safariWebRTC
     * Fix issue on safari
     * https://webrtchacks.com/guide-to-safari-webrtc
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.safariWebRTC = /**
     * safariWebRTC
     * Fix issue on safari
     * https://webrtchacks.com/guide-to-safari-webrtc
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    function (as, playDeviceCustom) {
        var _this = this;
        // Loading on
        this.STATUS.startOFF();
        this.STATUS.loadingON();
        navigator.mediaDevices.getUserMedia(this.constraints).then(function (stream) {
            stream.getTracks().forEach(function (track) { return track.stop(); });
            _this.loadAllDevices(as, playDeviceCustom);
        }).catch(function (error) {
            AS_COMPLETE(as, false, error);
            _this.STATUS.startOFF();
            _this.STATUS.loadingOFF();
        });
    };
    /**
     * loadAllDevices
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.loadAllDevices = /**
     * loadAllDevices
     * @param {?} as
     * @param {?=} playDeviceCustom
     * @return {?}
     */
    function (as, playDeviceCustom) {
        var _this = this;
        navigator.mediaDevices.enumerateDevices().then(function (devices) {
            /** @type {?} */
            var cameraDevices = devices.filter(function (f) { return f.kind == 'videoinput'; });
            _this.devices.next(cameraDevices);
            if (cameraDevices.length > 0) {
                AS_COMPLETE(as, cameraDevices);
                playDeviceCustom ? playDeviceCustom(cameraDevices) : _this.playDevice(cameraDevices[0].deviceId);
            }
            else {
                AS_COMPLETE(as, false, /** @type {?} */ ('No camera detected.'));
                _this.STATUS.startOFF();
                _this.STATUS.loadingOFF();
            }
        }).catch(function (error) {
            AS_COMPLETE(as, false, error);
            _this.STATUS.startOFF();
            _this.STATUS.loadingOFF();
        });
    };
    /**
     * drawImage
     * @param {?} element
     * @param {?=} callback
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.drawImage = /**
     * drawImage
     * @param {?} element
     * @param {?=} callback
     * @return {?}
     */
    function (element, callback) {
        if (callback === void 0) { callback = function () { }; }
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var canvas, ctx, imageData, code, EMIT_DATA;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                canvas = this.canvas.nativeElement;
                ctx = /** @type {?} */ (canvas.getContext('2d', { willReadFrequently: true }));
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
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                code = /** @type {?} */ (jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                }));
                if (code && code.data !== '') {
                    // Overlay
                    DRAW_RESULT_APPEND_CHILD(code, this.canvas.nativeElement, this.resultsPanel.nativeElement, this.canvasStyles);
                    EMIT_DATA = function () {
                        _this.eventEmit(code);
                        _this.dataForResize = code;
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
                return [2 /*return*/];
            });
        });
    };
    /**
     * eventEmit
     * @param {?=} response
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.eventEmit = /**
     * eventEmit
     * @param {?=} response
     * @return {?}
     */
    function (response) {
        if (response === void 0) { response = false; }
        (response !== false) && this.data.next(response || { data: null });
        (response !== false) && this.event.emit(response || { data: null });
    };
    /**
     * Single-thread
     * Loop Recording on Camera
     * Must be destroy request
     * Not using: requestAnimationFrame
     * @param {?=} delay
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.requestAnimationFrame = /**
     * Single-thread
     * Loop Recording on Camera
     * Must be destroy request
     * Not using: requestAnimationFrame
     * @param {?=} delay
     * @return {?}
     */
    function (delay) {
        var _this = this;
        if (delay === void 0) { delay = 0; }
        this.rAF_ID = setInterval(function () {
            if (_this.video.nativeElement.readyState === _this.video.nativeElement.HAVE_ENOUGH_DATA) {
                delay = 0;
                _this.drawImage(_this.video.nativeElement);
            }
        }, /*avoid cache mediaStream*/ /*avoid cache mediaStream*/ delay || this.fps);
    };
    Object.defineProperty(NgxScannerQrcodeSingleComponent.prototype, "isReady", {
        /**
         * Status of wasm
         * @return AsyncSubject
         */
        get: /**
         * Status of wasm
         * @return {?} AsyncSubject
         */
        function () {
            return this.ready;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxScannerQrcodeSingleComponent.prototype.ngOnDestroy = /**
     * @return {?}
     */
    function () {
        this.pause();
    };
    NgxScannerQrcodeSingleComponent.decorators = [
        { type: Component, args: [{
                    selector: 'ngx-scanner-qrcode-single',
                    template: "<div #resultsPanel class=\"origin-overlay\"></div><canvas #canvas class=\"origin-canvas\"></canvas><video #video playsinline class=\"origin-video\"></video>",
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
    NgxScannerQrcodeSingleComponent.ctorParameters = function () { return []; };
    return NgxScannerQrcodeSingleComponent;
}());
export { NgxScannerQrcodeSingleComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLyIsInNvdXJjZXMiOlsibGliL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQXFCLFNBQVMsRUFBRSxpQkFBaUIsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7SUF3RWxNO1FBQUEsaUJBQWlCOzs7O3FCQXpDRixJQUFJLFlBQVksRUFBdUI7Ozs7bUJBS3JCLGNBQWMsQ0FBQyxHQUFHO21CQUNsQixjQUFjLENBQUMsR0FBRzt1QkFDZCxjQUFjLENBQUMsT0FBTztzQkFDdEIsY0FBYyxDQUFDLE1BQU07c0JBQ3JCLGNBQWM7MkJBQ0EsY0FBYyxDQUFDLFdBQVc7NEJBQ3ZCLGNBQWMsQ0FBQyxZQUFZOzs7O3VCQUt2RCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0gsS0FBSzt1QkFDUCxLQUFLO29CQUNqQixJQUFJLGVBQWUsQ0FBc0IsSUFBSSxDQUFDO3VCQUMzQyxJQUFJLGVBQWUsQ0FBd0IsRUFBRSxDQUFDO2lDQUM1QixDQUFDO3FCQU9wQixJQUFJLFlBQVksRUFBVztzQkFFMUI7WUFDZixPQUFPLEVBQUUs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UUFDRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDZDs7Z0JBcmVGLFNBQVMsU0FBQztvQkFDVCxRQUFRLEVBQUUsMkJBQTJCO29CQUNyQyxRQUFRLEVBQUUsOEpBQXdKO29CQUVsSyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUU7b0JBQzlDLFFBQVEsRUFBRSxTQUFTO29CQUNuQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUM7b0JBQ3BGLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQztvQkFDbEIsT0FBTyxFQUFFO3dCQUNQLEtBQUssRUFBRSxJQUFJLFNBQVMsQ0FBQyxPQUFPLENBQUM7d0JBQzdCLE1BQU0sRUFBRSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUM7d0JBQy9CLFlBQVksRUFBRSxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7cUJBQzVDO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJOztpQkFDdEM7Ozs7MENBckJEOztTQXNCYSwrQkFBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgT25EZXN0cm95LCBPbkluaXQsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24sIEFmdGVyVmlld0luaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IGpzUVIgZnJvbSBcImpzcXJcIjtcclxuaW1wb3J0IHsgQXN5bmNTdWJqZWN0LCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuaW1wb3J0IHsgQ09ORklHX0RFRkFVTFQsIE1FRElBX1NUUkVBTV9ERUZBVUxUIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLmRlZmF1bHQnO1xyXG5pbXBvcnQgeyBBU19DT01QTEVURSwgQkxPQl9UT19GSUxFLCBDQU5WQVNfVE9fQkxPQiwgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxELCBGSUxFU19UT19TQ0FOLCBPVkVSUklERVMsIFBMQVlfQVVESU8sIFBST1BfRVhJU1RTLCBSRU1PVkVfQ0FOVkFTLCBWSUJSQVRFIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLmhlbHBlcic7XHJcbmltcG9ydCB7IFNjYW5uZXJRUkNvZGVDb25maWcsIFNjYW5uZXJRUkNvZGVEZXZpY2UsIFNjYW5uZXJRUkNvZGVSZXN1bHQsIFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzIH0gZnJvbSAnLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLm9wdGlvbnMnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICduZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlJyxcclxuICB0ZW1wbGF0ZTogYDxkaXYgI3Jlc3VsdHNQYW5lbCBjbGFzcz1cIm9yaWdpbi1vdmVybGF5XCI+PC9kaXY+PGNhbnZhcyAjY2FudmFzIGNsYXNzPVwib3JpZ2luLWNhbnZhc1wiPjwvY2FudmFzPjx2aWRlbyAjdmlkZW8gcGxheXNpbmxpbmUgY2xhc3M9XCJvcmlnaW4tdmlkZW9cIj48L3ZpZGVvPmAsXHJcbiAgc3R5bGVVcmxzOiBbJy4vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5jb21wb25lbnQuc2NzcyddLFxyXG4gIGhvc3Q6IHsgJ2NsYXNzJzogJ25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUnIH0sXHJcbiAgZXhwb3J0QXM6ICdzY2FubmVyJyxcclxuICBpbnB1dHM6IFsnc3JjJywgJ2ZwcycsICd2aWJyYXRlJywgJ2lzQmVlcCcsICdjb25maWcnLCAnY29uc3RyYWludHMnLCAnY2FudmFzU3R5bGVzJ10sXHJcbiAgb3V0cHV0czogWydldmVudCddLFxyXG4gIHF1ZXJpZXM6IHtcclxuICAgIHZpZGVvOiBuZXcgVmlld0NoaWxkKCd2aWRlbycpLFxyXG4gICAgY2FudmFzOiBuZXcgVmlld0NoaWxkKCdjYW52YXMnKSxcclxuICAgIHJlc3VsdHNQYW5lbDogbmV3IFZpZXdDaGlsZCgncmVzdWx0c1BhbmVsJylcclxuICB9LFxyXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmVcclxufSlcclxuZXhwb3J0IGNsYXNzIE5neFNjYW5uZXJRcmNvZGVTaW5nbGVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gIC8qKlxyXG4gICAqIEVsZW1lbnRcclxuICAgKiBwbGF5c2lubGluZSByZXF1aXJlZCB0byB0ZWxsIGlPUyBzYWZhcmkgd2UgZG9uJ3Qgd2FudCBmdWxsc2NyZWVuXHJcbiAgICovXHJcbiAgcHVibGljIHZpZGVvITogRWxlbWVudFJlZjxIVE1MVmlkZW9FbGVtZW50PjtcclxuICBwdWJsaWMgY2FudmFzITogRWxlbWVudFJlZjxIVE1MQ2FudmFzRWxlbWVudD47XHJcbiAgcHVibGljIHJlc3VsdHNQYW5lbCE6IEVsZW1lbnRSZWY8SFRNTERpdkVsZW1lbnQ+O1xyXG5cclxuICAvKipcclxuICAgKiBFdmVudEVtaXR0ZXJcclxuICAgKi9cclxuICBwdWJsaWMgZXZlbnQgPSBuZXcgRXZlbnRFbWl0dGVyPFNjYW5uZXJRUkNvZGVSZXN1bHQ+KCk7XHJcblxyXG4gIC8qKlxyXG4gICAqIElucHV0XHJcbiAgICovXHJcbiAgcHVibGljIHNyYzogc3RyaW5nIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQuc3JjO1xyXG4gIHB1YmxpYyBmcHM6IG51bWJlciB8IHVuZGVmaW5lZCA9IENPTkZJR19ERUZBVUxULmZwcztcclxuICBwdWJsaWMgdmlicmF0ZTogbnVtYmVyIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQudmlicmF0ZTtcclxuICBwdWJsaWMgaXNCZWVwOiBib29sZWFuIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQuaXNCZWVwO1xyXG4gIHB1YmxpYyBjb25maWc6IFNjYW5uZXJRUkNvZGVDb25maWcgPSBDT05GSUdfREVGQVVMVDtcclxuICBwdWJsaWMgY29uc3RyYWludHM6IE1lZGlhU3RyZWFtQ29uc3RyYWludHMgfCBhbnkgPSBDT05GSUdfREVGQVVMVC5jb25zdHJhaW50cztcclxuICBwdWJsaWMgY2FudmFzU3R5bGVzOiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgfCBhbnkgPSBDT05GSUdfREVGQVVMVC5jYW52YXNTdHlsZXM7XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4cG9ydFxyXG4gICovXHJcbiAgcHVibGljIGlzU3RhcnQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNQYXVzZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc0xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICBwdWJsaWMgaXNUb3JjaDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBkYXRhID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTY2FubmVyUVJDb2RlUmVzdWx0PihudWxsKTtcclxuICBwdWJsaWMgZGV2aWNlcyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U2Nhbm5lclFSQ29kZURldmljZVtdPihbXSk7XHJcbiAgcHVibGljIGRldmljZUluZGV4QWN0aXZlOiBudW1iZXIgPSAwO1xyXG5cclxuICAvKipcclxuICAgKiBQcml2YXRlXHJcbiAgKi9cclxuICBwcml2YXRlIHJBRl9JRDogYW55O1xyXG4gIHByaXZhdGUgZGF0YUZvclJlc2l6ZSE6IFNjYW5uZXJRUkNvZGVSZXN1bHQ7XHJcbiAgcHJpdmF0ZSByZWFkeSA9IG5ldyBBc3luY1N1YmplY3Q8Ym9vbGVhbj4oKTtcclxuXHJcbiAgcHJpdmF0ZSBTVEFUVVMgPSB7XHJcbiAgICBzdGFydE9OOiAoKSA9PiB0aGlzLmlzU3RhcnQgPSB0cnVlLFxyXG4gICAgcGF1c2VPTjogKCkgPT4gdGhpcy5pc1BhdXNlID0gdHJ1ZSxcclxuICAgIGxvYWRpbmdPTjogKCkgPT4gdGhpcy5pc0xvYWRpbmcgPSB0cnVlLFxyXG4gICAgc3RhcnRPRkY6ICgpID0+IHRoaXMuaXNTdGFydCA9IGZhbHNlLFxyXG4gICAgcGF1c2VPRkY6ICgpID0+IHRoaXMuaXNQYXVzZSA9IGZhbHNlLFxyXG4gICAgbG9hZGluZ09GRjogKCkgPT4gdGhpcy5pc0xvYWRpbmcgPSBmYWxzZSxcclxuICAgIHRvcmNoT0ZGOiAoKSA9PiB0aGlzLmlzVG9yY2ggPSBmYWxzZSxcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkgeyB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5vdmVycmlkZUNvbmZpZygpO1xyXG4gICAgaWYgKHRoaXMuc3JjKSB7XHJcbiAgICAgIHRoaXMubG9hZEltYWdlKHRoaXMuc3JjKTtcclxuICAgIH1cclxuICAgIHRoaXMucmVzaXplKCk7XHJcbiAgfVxyXG4gIFxyXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4gQVNfQ09NUExFVEUodGhpcy5yZWFkeSwgdHJ1ZSksIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RhcnRcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBzdGFydChwbGF5RGV2aWNlQ3VzdG9tPzogRnVuY3Rpb24pOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgaWYgKHRoaXMuaXNTdGFydCkge1xyXG4gICAgICAvLyBSZWplY3RcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGZpeCBzYWZhcmlcclxuICAgICAgdGhpcy5zYWZhcmlXZWJSVEMoYXMsIHBsYXlEZXZpY2VDdXN0b20pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc3RvcFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHN0b3AoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgdGhpcy5TVEFUVVMucGF1c2VPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy50b3JjaE9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yQUZfSUQpO1xyXG4gICAgICAodGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCBhcyBNZWRpYVN0cmVhbSkuZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2s6IE1lZGlhU3RyZWFtVHJhY2spID0+IHtcclxuICAgICAgICB0cmFjay5zdG9wKCk7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgICB9KTtcclxuICAgICAgUkVNT1ZFX0NBTlZBUyh0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50KTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IgYXMgYW55KTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBsYXlcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBwbGF5KCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1BhdXNlKSB7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5wbGF5KCk7XHJcbiAgICAgIHRoaXMuU1RBVFVTLnBhdXNlT0ZGKCk7XHJcbiAgICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKDkwKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHBhdXNlXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3QgXHJcbiAgICovXHJcbiAgcHVibGljIHBhdXNlKCk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yQUZfSUQpO1xyXG4gICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQucGF1c2UoKTtcclxuICAgICAgdGhpcy5TVEFUVVMucGF1c2VPTigpO1xyXG4gICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGxheURldmljZVxyXG4gICAqIEBwYXJhbSBkZXZpY2VJZCBcclxuICAgKiBAcGFyYW0gYXMgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3QgXHJcbiAgICovXHJcbiAgcHVibGljIHBsYXlEZXZpY2UoZGV2aWNlSWQ6IHN0cmluZywgYXM6IEFzeW5jU3ViamVjdDxhbnk+ID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCkpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBleGlzdERldmljZUlkID0gdGhpcy5pc1N0YXJ0ID8gdGhpcy5nZXRDb25zdHJhaW50cygpLmRldmljZUlkICE9PSBkZXZpY2VJZCA6IHRydWU7XHJcbiAgICBzd2l0Y2ggKHRydWUpIHtcclxuICAgICAgY2FzZSBkZXZpY2VJZCA9PT0gJ251bGwnIHx8IGRldmljZUlkID09PSAndW5kZWZpbmVkJyB8fCAhZGV2aWNlSWQ6XHJcbiAgICAgICAgc3RvcCgpO1xyXG4gICAgICAgIHRoaXMuc3RvcCgpO1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIGNhc2UgZGV2aWNlSWQgJiYgZXhpc3REZXZpY2VJZDpcclxuICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgLy8gTG9hZGluZyBvblxyXG4gICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgICAgIHRoaXMuZGV2aWNlSW5kZXhBY3RpdmUgPSB0aGlzLmRldmljZXMudmFsdWUuZmluZEluZGV4KChmOiBTY2FubmVyUVJDb2RlRGV2aWNlKSA9PiBmLmRldmljZUlkID09PSBkZXZpY2VJZCk7XHJcbiAgICAgICAgY29uc3QgY29uc3RyYWludHMgPSB7IC4uLnRoaXMuY29uc3RyYWludHMsIGF1ZGlvOiBmYWxzZSwgdmlkZW86IHsgZGV2aWNlSWQ6IGRldmljZUlkLCAuLi50aGlzLmNvbnN0cmFpbnRzLnZpZGVvIH0gfTtcclxuICAgICAgICAvLyBNZWRpYVN0cmVhbVxyXG4gICAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKS50aGVuKChzdHJlYW06IE1lZGlhU3RyZWFtKSA9PiB7XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50Lm9ubG9hZGVkbWV0YWRhdGEgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5wbGF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XHJcbiAgICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPTigpO1xyXG4gICAgICAgICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuZXZlbnRFbWl0KGZhbHNlKTtcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRJbWFnZVxyXG4gICAqIEBwYXJhbSBzcmMgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgbG9hZEltYWdlKHNyYzogc3RyaW5nKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIC8vIExvYWRpbmcgb25cclxuICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT04oKTtcclxuICAgIC8vIFNldCB0aGUgc3JjIG9mIHRoaXMgSW1hZ2Ugb2JqZWN0LlxyXG4gICAgY29uc3QgaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIC8vIFNldHRpbmcgY3Jvc3Mgb3JpZ2luIHZhbHVlIHRvIGFub255bW91c1xyXG4gICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKTtcclxuICAgIC8vIFdoZW4gb3VyIGltYWdlIGhhcyBsb2FkZWQuXHJcbiAgICBpbWFnZS5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIHRoaXMuZHJhd0ltYWdlKGltYWdlLCAoZmxhZzogYm9vbGVhbikgPT4ge1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmbGFnKTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgfSk7XHJcbiAgICB9O1xyXG4gICAgLy8gU2V0IHNyY1xyXG4gICAgaW1hZ2Uuc3JjID0gc3JjO1xyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogdG9yY2hlclxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHRvcmNoZXIoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSB0aGlzLmFwcGx5Q29uc3RyYWludHMoeyBhZHZhbmNlZDogW3sgdG9yY2g6IHRoaXMuaXNUb3JjaCB9XSB9KTtcclxuICAgIGFzLnN1YnNjcmliZSgoKSA9PiBmYWxzZSwgKCkgPT4gdGhpcy5pc1RvcmNoID0gIXRoaXMuaXNUb3JjaCk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBhcHBseUNvbnN0cmFpbnRzXHJcbiAgICogQHBhcmFtIGNvbnN0cmFpbnRzIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIGFwcGx5Q29uc3RyYWludHMoY29uc3RyYWludHM6IE1lZGlhVHJhY2tDb25zdHJhaW50U2V0IHwgTWVkaWFUcmFja0NvbnN0cmFpbnRzIHwgYW55KTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW07XHJcbiAgICBjb25zdCB2aWRlb1RyYWNrID0gc3RyZWFtLmdldFZpZGVvVHJhY2tzKClbMF0gYXMgTWVkaWFTdHJlYW1UcmFjaztcclxuICAgIGNvbnN0IGltYWdlQ2FwdHVyZSA9IG5ldyAod2luZG93IGFzIGFueSkuSW1hZ2VDYXB0dXJlKHZpZGVvVHJhY2spO1xyXG4gICAgaW1hZ2VDYXB0dXJlLmdldFBob3RvQ2FwYWJpbGl0aWVzKCkudGhlbihhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IHZpZGVvVHJhY2suYXBwbHlDb25zdHJhaW50cyhjb25zdHJhaW50cyk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgIHN3aXRjaCAoZXJyb3IgJiYgZXJyb3IubmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ05vdEZvdW5kRXJyb3InOlxyXG4gICAgICAgIGNhc2UgJ0RldmljZXNOb3RGb3VuZEVycm9yJzpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1JlcXVpcmVkIHRyYWNrIGlzIG1pc3NpbmcnIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdOb3RSZWFkYWJsZUVycm9yJzpcclxuICAgICAgICBjYXNlICdUcmFja1N0YXJ0RXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnV2ViY2FtIG9yIG1pYyBhcmUgYWxyZWFkeSBpbiB1c2UnIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdPdmVyY29uc3RyYWluZWRFcnJvcic6XHJcbiAgICAgICAgY2FzZSAnQ29uc3RyYWludE5vdFNhdGlzZmllZEVycm9yJzpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ0NvbnN0cmFpbnRzIGNhbiBub3QgYmUgc2F0aXNmaWVkIGJ5IGF2Yi4gZGV2aWNlcycgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ05vdEFsbG93ZWRFcnJvcic6XHJcbiAgICAgICAgY2FzZSAnUGVybWlzc2lvbkRlbmllZEVycm9yJzpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgJ1Blcm1pc3Npb24gZGVuaWVkIGluIGJyb3dzZXInIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlICdUeXBlRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnRW1wdHkgY29uc3RyYWludHMgb2JqZWN0JyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcztcclxuICB9O1xyXG5cclxuICAvKipcclxuICAgKiBnZXRDb25zdHJhaW50c1xyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHB1YmxpYyBnZXRDb25zdHJhaW50cygpOiBNZWRpYVRyYWNrQ29uc3RyYWludFNldCB8IGFueSB7XHJcbiAgICBjb25zdCBzdHJlYW0gPSB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3JjT2JqZWN0IGFzIE1lZGlhU3RyZWFtO1xyXG4gICAgY29uc3QgdmlkZW9UcmFjayA9IHN0cmVhbSAmJiBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXSBhcyBNZWRpYVN0cmVhbVRyYWNrO1xyXG4gICAgcmV0dXJuIHZpZGVvVHJhY2sgJiYgdmlkZW9UcmFjay5nZXRDb25zdHJhaW50cygpIGFzIGFueTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGRvd25sb2FkXHJcbiAgICogQHBhcmFtIGZpbGVOYW1lIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIGRvd25sb2FkKGZpbGVOYW1lOiBzdHJpbmcgPSBgbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS0ke0RhdGUubm93KCl9LnBuZ2ApOiBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGNvbnN0IHJ1biA9IGFzeW5jICgpID0+IHtcclxuICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IENBTlZBU19UT19CTE9CKHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICBjb25zdCBmaWxlID0gQkxPQl9UT19GSUxFKGJsb2IsIGZpbGVOYW1lKTtcclxuICAgICAgRklMRVNfVE9fU0NBTihbZmlsZV0sIHRoaXMuY29uZmlnLCBhcykuc3Vic2NyaWJlKChyZXM6IFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10pID0+IHtcclxuICAgICAgICByZXMuZm9yRWFjaCgoaXRlbTogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XHJcbiAgICAgICAgICBsaW5rLmhyZWYgPSBpdGVtLnVybDtcclxuICAgICAgICAgIGxpbmsuZG93bmxvYWQgPSBpdGVtLm5hbWU7XHJcbiAgICAgICAgICBsaW5rLmNsaWNrKCk7XHJcbiAgICAgICAgICBsaW5rLnJlbW92ZSgpXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcnVuKCk7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB3aW5kb3c6IHJlc2l6ZVxyXG4gICAqIERyYXcgYWdhaW4hXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXNpemUoKTogdm9pZCB7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB7XHJcbiAgICAgIGlmICh0aGlzLmRhdGFGb3JSZXNpemUpIHtcclxuICAgICAgICBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQodGhpcy5kYXRhRm9yUmVzaXplIGFzIGFueSwgdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCwgdGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5jYW52YXNTdHlsZXMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE92ZXJyaWRlIGNvbmZpZ1xyXG4gICAqIEByZXR1cm4gdm9pZFxyXG4gICAqL1xyXG4gIHByaXZhdGUgb3ZlcnJpZGVDb25maWcoKTogdm9pZCB7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdzcmMnKSkgdGhpcy5zcmMgPSB0aGlzLmNvbmZpZy5zcmM7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdmcHMnKSkgdGhpcy5mcHMgPSB0aGlzLmNvbmZpZy5mcHM7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICd2aWJyYXRlJykpIHRoaXMudmlicmF0ZSA9IHRoaXMuY29uZmlnLnZpYnJhdGU7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdpc0JlZXAnKSkgdGhpcy5pc0JlZXAgPSB0aGlzLmNvbmZpZy5pc0JlZXA7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdjb25zdHJhaW50cycpKSB0aGlzLmNvbnN0cmFpbnRzID0gT1ZFUlJJREVTKCdjb25zdHJhaW50cycsIHRoaXMuY29uZmlnLCBNRURJQV9TVFJFQU1fREVGQVVMVCk7XHJcbiAgICBpZiAoUFJPUF9FWElTVFModGhpcy5jb25maWcsICdjYW52YXNTdHlsZXMnKSkgdGhpcy5jYW52YXNTdHlsZXMgPSB0aGlzLmNvbmZpZy5jYW52YXNTdHlsZXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzYWZhcmlXZWJSVENcclxuICAgKiBGaXggaXNzdWUgb24gc2FmYXJpXHJcbiAgICogaHR0cHM6Ly93ZWJydGNoYWNrcy5jb20vZ3VpZGUtdG8tc2FmYXJpLXdlYnJ0Y1xyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKi9cclxuICBwcml2YXRlIHNhZmFyaVdlYlJUQyhhczogQXN5bmNTdWJqZWN0PGFueT4sIHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IHZvaWQge1xyXG4gICAgLy8gTG9hZGluZyBvblxyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEodGhpcy5jb25zdHJhaW50cykudGhlbigoc3RyZWFtOiBNZWRpYVN0cmVhbSkgPT4ge1xyXG4gICAgICBzdHJlYW0uZ2V0VHJhY2tzKCkuZm9yRWFjaCh0cmFjayA9PiB0cmFjay5zdG9wKCkpO1xyXG4gICAgICB0aGlzLmxvYWRBbGxEZXZpY2VzKGFzLCBwbGF5RGV2aWNlQ3VzdG9tKTtcclxuICAgIH0pLmNhdGNoKChlcnJvcjogYW55KSA9PiB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSwgZXJyb3IpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRBbGxEZXZpY2VzXHJcbiAgICogQHBhcmFtIGFzIFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgbG9hZEFsbERldmljZXMoYXM6IEFzeW5jU3ViamVjdDxhbnk+LCBwbGF5RGV2aWNlQ3VzdG9tPzogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZW51bWVyYXRlRGV2aWNlcygpLnRoZW4oZGV2aWNlcyA9PiB7XHJcbiAgICAgIGxldCBjYW1lcmFEZXZpY2VzOiBTY2FubmVyUVJDb2RlRGV2aWNlW10gPSBkZXZpY2VzLmZpbHRlcihmID0+IGYua2luZCA9PSAndmlkZW9pbnB1dCcpO1xyXG4gICAgICB0aGlzLmRldmljZXMubmV4dChjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgaWYgKGNhbWVyYURldmljZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBjYW1lcmFEZXZpY2VzKTtcclxuICAgICAgICBwbGF5RGV2aWNlQ3VzdG9tID8gcGxheURldmljZUN1c3RvbShjYW1lcmFEZXZpY2VzKSA6IHRoaXMucGxheURldmljZShjYW1lcmFEZXZpY2VzWzBdLmRldmljZUlkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdObyBjYW1lcmEgZGV0ZWN0ZWQuJyBhcyBhbnkpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICB9XHJcbiAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yKTtcclxuICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkcmF3SW1hZ2VcclxuICAgKiBAcGFyYW0gZWxlbWVudCBcclxuICAgKiBAcGFyYW0gY2FsbGJhY2sgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBhc3luYyBkcmF3SW1hZ2UoZWxlbWVudDogSFRNTEltYWdlRWxlbWVudCB8IEhUTUxWaWRlb0VsZW1lbnQsIGNhbGxiYWNrOiBGdW5jdGlvbiA9ICgpID0+IHsgfSk6IFByb21pc2U8dm9pZD4ge1xyXG4gICAgLy8gR2V0IHRoZSBjYW52YXMgZWxlbWVudCBieSB1c2luZyB0aGUgZ2V0RWxlbWVudEJ5SWQgbWV0aG9kLlxyXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jYW52YXMubmF0aXZlRWxlbWVudDtcclxuICAgIC8vIEdldCBhIDJEIGRyYXdpbmcgY29udGV4dCBmb3IgdGhlIGNhbnZhcy5cclxuICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcsIHsgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICAgIC8vIEhUTUxJbWFnZUVsZW1lbnQgc2l6ZVxyXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IGVsZW1lbnQubmF0dXJhbFdpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudC5uYXR1cmFsSGVpZ2h0O1xyXG4gICAgICBlbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnJztcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IGNhbnZhcy5vZmZzZXRIZWlnaHQgKyAncHgnO1xyXG4gICAgfVxyXG4gICAgLy8gSFRNTFZpZGVvRWxlbWVudCBzaXplXHJcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxWaWRlb0VsZW1lbnQpIHtcclxuICAgICAgY2FudmFzLndpZHRoID0gZWxlbWVudC52aWRlb1dpZHRoO1xyXG4gICAgICBjYW52YXMuaGVpZ2h0ID0gZWxlbWVudC52aWRlb0hlaWdodDtcclxuICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XHJcbiAgICAgIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xyXG4gICAgfVxyXG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpXHJcbiAgICAvLyBEcmF3IGltYWdlXHJcbiAgICBjdHguZHJhd0ltYWdlKGVsZW1lbnQsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEYXRhIGltYWdlXHJcbiAgICBjb25zdCBpbWFnZURhdGEgPSBjdHguZ2V0SW1hZ2VEYXRhKDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAvLyBEcmF3IGZyYW1lXHJcbiAgICBjb25zdCBjb2RlID0ganNRUihpbWFnZURhdGEuZGF0YSwgaW1hZ2VEYXRhLndpZHRoLCBpbWFnZURhdGEuaGVpZ2h0LCB7XHJcbiAgICAgIGludmVyc2lvbkF0dGVtcHRzOiBcImRvbnRJbnZlcnRcIixcclxuICAgIH0pIGFzIFNjYW5uZXJRUkNvZGVSZXN1bHQ7XHJcbiAgICBpZiAoY29kZSAmJiBjb2RlLmRhdGEgIT09ICcnKSB7XHJcbiAgICAgIC8vIE92ZXJsYXlcclxuICAgICAgRFJBV19SRVNVTFRfQVBQRU5EX0NISUxEKGNvZGUsIHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQsIHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQsIHRoaXMuY2FudmFzU3R5bGVzKTtcclxuXHJcbiAgICAgIC8vIFRvIGJsb2IgYW5kIGVtaXQgZGF0YVxyXG4gICAgICBjb25zdCBFTUlUX0RBVEEgPSAoKSA9PiB7XHJcbiAgICAgICAgdGhpcy5ldmVudEVtaXQoY29kZSk7XHJcbiAgICAgICAgdGhpcy5kYXRhRm9yUmVzaXplID0gY29kZTtcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIEhUTUxJbWFnZUVsZW1lbnRcclxuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MSW1hZ2VFbGVtZW50KSB7XHJcbiAgICAgICAgY2FsbGJhY2sodHJ1ZSk7XHJcbiAgICAgICAgRU1JVF9EQVRBKCk7XHJcbiAgICAgICAgVklCUkFURSh0aGlzLnZpYnJhdGUpO1xyXG4gICAgICAgIFBMQVlfQVVESU8odGhpcy5pc0JlZXApO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIEhUTUxWaWRlb0VsZW1lbnRcclxuICAgICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50KSB7XHJcbiAgICAgICAgRU1JVF9EQVRBKCk7XHJcbiAgICAgICAgVklCUkFURSh0aGlzLnZpYnJhdGUpO1xyXG4gICAgICAgIFBMQVlfQVVESU8odGhpcy5pc0JlZXApO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjYWxsYmFjayhmYWxzZSk7XHJcbiAgICAgIFJFTU9WRV9DQU5WQVModGhpcy5yZXN1bHRzUGFuZWwubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIHRoaXMuZGF0YUZvclJlc2l6ZSA9IGNvZGU7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBldmVudEVtaXRcclxuICAgKiBAcGFyYW0gcmVzcG9uc2UgXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBldmVudEVtaXQocmVzcG9uc2U6IGFueSA9IGZhbHNlKTogdm9pZCB7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmRhdGEubmV4dChyZXNwb25zZSB8fCB7IGRhdGE6IG51bGwgfSk7XHJcbiAgICAocmVzcG9uc2UgIT09IGZhbHNlKSAmJiB0aGlzLmV2ZW50LmVtaXQocmVzcG9uc2UgfHwgeyBkYXRhOiBudWxsIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2luZ2xlLXRocmVhZFxyXG4gICAqIExvb3AgUmVjb3JkaW5nIG9uIENhbWVyYVxyXG4gICAqIE11c3QgYmUgZGVzdHJveSByZXF1ZXN0IFxyXG4gICAqIE5vdCB1c2luZzogcmVxdWVzdEFuaW1hdGlvbkZyYW1lXHJcbiAgICogQHBhcmFtIGRlbGF5XHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZGVsYXk6IG51bWJlciA9IDApOiB2b2lkIHtcclxuICAgIHRoaXMuckFGX0lEID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICBpZiAodGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnJlYWR5U3RhdGUgPT09IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5IQVZFX0VOT1VHSF9EQVRBKSB7XHJcbiAgICAgICAgZGVsYXkgPSAwO1xyXG4gICAgICAgIHRoaXMuZHJhd0ltYWdlKHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgIH0sIC8qYXZvaWQgY2FjaGUgbWVkaWFTdHJlYW0qLyBkZWxheSB8fCB0aGlzLmZwcyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdGF0dXMgb2Ygd2FzbVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgZ2V0IGlzUmVhZHkoKTogQXN5bmNTdWJqZWN0PGJvb2xlYW4+IHtcclxuICAgIHJldHVybiB0aGlzLnJlYWR5O1xyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLnBhdXNlKCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==