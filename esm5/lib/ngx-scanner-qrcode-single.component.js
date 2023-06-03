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
                _this.video.nativeElement.style.height = _this.canvas.nativeElement.offsetHeight + 'px';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLyIsInNvdXJjZXMiOlsibGliL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBYyxZQUFZLEVBQXFCLFNBQVMsRUFBRSxpQkFBaUIsRUFBaUIsTUFBTSxlQUFlLENBQUM7QUFDcEksT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxZQUFZLEVBQUUsZUFBZSxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxjQUFjLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUMzRixPQUFPLEVBQUUsV0FBVyxFQUFFLFlBQVksRUFBRSxjQUFjLEVBQUUsd0JBQXdCLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7SUF3RWxNO1FBQUEsaUJBQWlCOzs7O3FCQXpDRixJQUFJLFlBQVksRUFBdUI7Ozs7bUJBS3JCLGNBQWMsQ0FBQyxHQUFHO21CQUNsQixjQUFjLENBQUMsR0FBRzt1QkFDZCxjQUFjLENBQUMsT0FBTztzQkFDdEIsY0FBYyxDQUFDLE1BQU07c0JBQ3JCLGNBQWM7MkJBQ0EsY0FBYyxDQUFDLFdBQVc7NEJBQ3ZCLGNBQWMsQ0FBQyxZQUFZOzs7O3VCQUt2RCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0gsS0FBSzt1QkFDUCxLQUFLO29CQUNqQixJQUFJLGVBQWUsQ0FBc0IsSUFBSSxDQUFDO3VCQUMzQyxJQUFJLGVBQWUsQ0FBd0IsRUFBRSxDQUFDO2lDQUM1QixDQUFDO3FCQU9wQixJQUFJLFlBQVksRUFBVztzQkFFMUI7WUFDZixPQUFPLEVBQUUs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QUM7O0lBT3BELHNCQUFJLG9EQUFPO1FBSlg7OztXQUdHOzs7OztRQUNIO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ25COzs7T0FBQTs7OztJQUVELHFEQUFXOzs7SUFBWDtRQUNFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztLQUNkOztnQkF0ZUYsU0FBUyxTQUFDO29CQUNULFFBQVEsRUFBRSwyQkFBMkI7b0JBQ3JDLFFBQVEsRUFBRSw4SkFBd0o7b0JBRWxLLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSwyQkFBMkIsRUFBRTtvQkFDOUMsUUFBUSxFQUFFLFNBQVM7b0JBQ25CLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQztvQkFDcEYsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO29CQUNsQixPQUFPLEVBQUU7d0JBQ1AsS0FBSyxFQUFFLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQzt3QkFDN0IsTUFBTSxFQUFFLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQzt3QkFDL0IsWUFBWSxFQUFFLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQztxQkFDNUM7b0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7O2lCQUN0Qzs7OzswQ0FyQkQ7O1NBc0JhLCtCQUErQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRWxlbWVudFJlZiwgRXZlbnRFbWl0dGVyLCBPbkRlc3Ryb3ksIE9uSW5pdCwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQganNRUiBmcm9tIFwianNxclwiO1xyXG5pbXBvcnQgeyBBc3luY1N1YmplY3QsIEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDT05GSUdfREVGQVVMVCwgTUVESUFfU1RSRUFNX0RFRkFVTFQgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuZGVmYXVsdCc7XHJcbmltcG9ydCB7IEFTX0NPTVBMRVRFLCBCTE9CX1RPX0ZJTEUsIENBTlZBU19UT19CTE9CLCBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQsIEZJTEVTX1RPX1NDQU4sIE9WRVJSSURFUywgUExBWV9BVURJTywgUFJPUF9FWElTVFMsIFJFTU9WRV9DQU5WQVMsIFZJQlJBVEUgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuaGVscGVyJztcclxuaW1wb3J0IHsgU2Nhbm5lclFSQ29kZUNvbmZpZywgU2Nhbm5lclFSQ29kZURldmljZSwgU2Nhbm5lclFSQ29kZVJlc3VsdCwgU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXMgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUub3B0aW9ucyc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUnLFxyXG4gIHRlbXBsYXRlOiBgPGRpdiAjcmVzdWx0c1BhbmVsIGNsYXNzPVwib3JpZ2luLW92ZXJsYXlcIj48L2Rpdj48Y2FudmFzICNjYW52YXMgY2xhc3M9XCJvcmlnaW4tY2FudmFzXCI+PC9jYW52YXM+PHZpZGVvICN2aWRlbyBwbGF5c2lubGluZSBjbGFzcz1cIm9yaWdpbi12aWRlb1wiPjwvdmlkZW8+YCxcclxuICBzdHlsZVVybHM6IFsnLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLmNvbXBvbmVudC5zY3NzJ10sXHJcbiAgaG9zdDogeyAnY2xhc3MnOiAnbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZScgfSxcclxuICBleHBvcnRBczogJ3NjYW5uZXInLFxyXG4gIGlucHV0czogWydzcmMnLCAnZnBzJywgJ3ZpYnJhdGUnLCAnaXNCZWVwJywgJ2NvbmZpZycsICdjb25zdHJhaW50cycsICdjYW52YXNTdHlsZXMnXSxcclxuICBvdXRwdXRzOiBbJ2V2ZW50J10sXHJcbiAgcXVlcmllczoge1xyXG4gICAgdmlkZW86IG5ldyBWaWV3Q2hpbGQoJ3ZpZGVvJyksXHJcbiAgICBjYW52YXM6IG5ldyBWaWV3Q2hpbGQoJ2NhbnZhcycpLFxyXG4gICAgcmVzdWx0c1BhbmVsOiBuZXcgVmlld0NoaWxkKCdyZXN1bHRzUGFuZWwnKVxyXG4gIH0sXHJcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZVxyXG59KVxyXG5leHBvcnQgY2xhc3MgTmd4U2Nhbm5lclFyY29kZVNpbmdsZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcclxuXHJcbiAgLyoqXHJcbiAgICogRWxlbWVudFxyXG4gICAqIHBsYXlzaW5saW5lIHJlcXVpcmVkIHRvIHRlbGwgaU9TIHNhZmFyaSB3ZSBkb24ndCB3YW50IGZ1bGxzY3JlZW5cclxuICAgKi9cclxuICBwdWJsaWMgdmlkZW8hOiBFbGVtZW50UmVmPEhUTUxWaWRlb0VsZW1lbnQ+O1xyXG4gIHB1YmxpYyBjYW52YXMhOiBFbGVtZW50UmVmPEhUTUxDYW52YXNFbGVtZW50PjtcclxuICBwdWJsaWMgcmVzdWx0c1BhbmVsITogRWxlbWVudFJlZjxIVE1MRGl2RWxlbWVudD47XHJcblxyXG4gIC8qKlxyXG4gICAqIEV2ZW50RW1pdHRlclxyXG4gICAqL1xyXG4gIHB1YmxpYyBldmVudCA9IG5ldyBFdmVudEVtaXR0ZXI8U2Nhbm5lclFSQ29kZVJlc3VsdD4oKTtcclxuXHJcbiAgLyoqXHJcbiAgICogSW5wdXRcclxuICAgKi9cclxuICBwdWJsaWMgc3JjOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5zcmM7XHJcbiAgcHVibGljIGZwczogbnVtYmVyIHwgdW5kZWZpbmVkID0gQ09ORklHX0RFRkFVTFQuZnBzO1xyXG4gIHB1YmxpYyB2aWJyYXRlOiBudW1iZXIgfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC52aWJyYXRlO1xyXG4gIHB1YmxpYyBpc0JlZXA6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSBDT05GSUdfREVGQVVMVC5pc0JlZXA7XHJcbiAgcHVibGljIGNvbmZpZzogU2Nhbm5lclFSQ29kZUNvbmZpZyA9IENPTkZJR19ERUZBVUxUO1xyXG4gIHB1YmxpYyBjb25zdHJhaW50czogTWVkaWFTdHJlYW1Db25zdHJhaW50cyB8IGFueSA9IENPTkZJR19ERUZBVUxULmNvbnN0cmFpbnRzO1xyXG4gIHB1YmxpYyBjYW52YXNTdHlsZXM6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCB8IGFueSA9IENPTkZJR19ERUZBVUxULmNhbnZhc1N0eWxlcztcclxuXHJcbiAgLyoqXHJcbiAgICogRXhwb3J0XHJcbiAgKi9cclxuICBwdWJsaWMgaXNTdGFydDogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1BhdXNlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGlzTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xyXG4gIHB1YmxpYyBpc1RvcmNoOiBib29sZWFuID0gZmFsc2U7XHJcbiAgcHVibGljIGRhdGEgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNjYW5uZXJRUkNvZGVSZXN1bHQ+KG51bGwpO1xyXG4gIHB1YmxpYyBkZXZpY2VzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTY2FubmVyUVJDb2RlRGV2aWNlW10+KFtdKTtcclxuICBwdWJsaWMgZGV2aWNlSW5kZXhBY3RpdmU6IG51bWJlciA9IDA7XHJcblxyXG4gIC8qKlxyXG4gICAqIFByaXZhdGVcclxuICAqL1xyXG4gIHByaXZhdGUgckFGX0lEOiBhbnk7XHJcbiAgcHJpdmF0ZSBkYXRhRm9yUmVzaXplITogU2Nhbm5lclFSQ29kZVJlc3VsdDtcclxuICBwcml2YXRlIHJlYWR5ID0gbmV3IEFzeW5jU3ViamVjdDxib29sZWFuPigpO1xyXG5cclxuICBwcml2YXRlIFNUQVRVUyA9IHtcclxuICAgIHN0YXJ0T046ICgpID0+IHRoaXMuaXNTdGFydCA9IHRydWUsXHJcbiAgICBwYXVzZU9OOiAoKSA9PiB0aGlzLmlzUGF1c2UgPSB0cnVlLFxyXG4gICAgbG9hZGluZ09OOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IHRydWUsXHJcbiAgICBzdGFydE9GRjogKCkgPT4gdGhpcy5pc1N0YXJ0ID0gZmFsc2UsXHJcbiAgICBwYXVzZU9GRjogKCkgPT4gdGhpcy5pc1BhdXNlID0gZmFsc2UsXHJcbiAgICBsb2FkaW5nT0ZGOiAoKSA9PiB0aGlzLmlzTG9hZGluZyA9IGZhbHNlLFxyXG4gICAgdG9yY2hPRkY6ICgpID0+IHRoaXMuaXNUb3JjaCA9IGZhbHNlLFxyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7IH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLm92ZXJyaWRlQ29uZmlnKCk7XHJcbiAgICBpZiAodGhpcy5zcmMpIHtcclxuICAgICAgdGhpcy5sb2FkSW1hZ2UodGhpcy5zcmMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZXNpemUoKTtcclxuICB9XHJcbiAgXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiBBU19DT01QTEVURSh0aGlzLnJlYWR5LCB0cnVlKSwgMTAwMCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdGFydFxyXG4gICAqIEBwYXJhbSBwbGF5RGV2aWNlQ3VzdG9tIFxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHN0YXJ0KHBsYXlEZXZpY2VDdXN0b20/OiBGdW5jdGlvbik6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGFzID0gbmV3IEFzeW5jU3ViamVjdDxhbnk+KCk7XHJcbiAgICBpZiAodGhpcy5pc1N0YXJ0KSB7XHJcbiAgICAgIC8vIFJlamVjdFxyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gZml4IHNhZmFyaVxyXG4gICAgICB0aGlzLnNhZmFyaVdlYlJUQyhhcywgcGxheURldmljZUN1c3RvbSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBzdG9wXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgc3RvcCgpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICB0aGlzLlNUQVRVUy5wYXVzZU9GRigpO1xyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLnRvcmNoT0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT0ZGKCk7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgdHJ5IHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJBRl9JRCk7XHJcbiAgICAgICh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuc3JjT2JqZWN0IGFzIE1lZGlhU3RyZWFtKS5nZXRUcmFja3MoKS5mb3JFYWNoKCh0cmFjazogTWVkaWFTdHJlYW1UcmFjaykgPT4ge1xyXG4gICAgICAgIHRyYWNrLnN0b3AoKTtcclxuICAgICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgICBSRU1PVkVfQ0FOVkFTKHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvciBhcyBhbnkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGxheVxyXG4gICAqIEByZXR1cm4gQXN5bmNTdWJqZWN0XHJcbiAgICovXHJcbiAgcHVibGljIHBsYXkoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzUGF1c2UpIHtcclxuICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgdGhpcy5TVEFUVVMucGF1c2VPRkYoKTtcclxuICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoOTApO1xyXG4gICAgICBBU19DT01QTEVURShhcywgdHJ1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGF1c2VcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdCBcclxuICAgKi9cclxuICBwdWJsaWMgcGF1c2UoKTogQXN5bmNTdWJqZWN0PGFueT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKTtcclxuICAgIGlmICh0aGlzLmlzU3RhcnQpIHtcclxuICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJBRl9JRCk7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5wYXVzZSgpO1xyXG4gICAgICB0aGlzLlNUQVRVUy5wYXVzZU9OKCk7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCB0cnVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBwbGF5RGV2aWNlXHJcbiAgICogQHBhcmFtIGRldmljZUlkIFxyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdCBcclxuICAgKi9cclxuICBwdWJsaWMgcGxheURldmljZShkZXZpY2VJZDogc3RyaW5nLCBhczogQXN5bmNTdWJqZWN0PGFueT4gPSBuZXcgQXN5bmNTdWJqZWN0PGFueT4oKSk6IEFzeW5jU3ViamVjdDxhbnk+IHtcclxuICAgIGNvbnN0IGV4aXN0RGV2aWNlSWQgPSB0aGlzLmlzU3RhcnQgPyB0aGlzLmdldENvbnN0cmFpbnRzKCkuZGV2aWNlSWQgIT09IGRldmljZUlkIDogdHJ1ZTtcclxuICAgIHN3aXRjaCAodHJ1ZSkge1xyXG4gICAgICBjYXNlIGRldmljZUlkID09PSAnbnVsbCcgfHwgZGV2aWNlSWQgPT09ICd1bmRlZmluZWQnIHx8ICFkZXZpY2VJZDpcclxuICAgICAgICBzdG9wKCk7XHJcbiAgICAgICAgdGhpcy5zdG9wKCk7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBkZXZpY2VJZCAmJiBleGlzdERldmljZUlkOlxyXG4gICAgICAgIHN0b3AoKTtcclxuICAgICAgICB0aGlzLnN0b3AoKTtcclxuICAgICAgICAvLyBMb2FkaW5nIG9uXHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09OKCk7XHJcbiAgICAgICAgdGhpcy5kZXZpY2VJbmRleEFjdGl2ZSA9IHRoaXMuZGV2aWNlcy52YWx1ZS5maW5kSW5kZXgoKGY6IFNjYW5uZXJRUkNvZGVEZXZpY2UpID0+IGYuZGV2aWNlSWQgPT09IGRldmljZUlkKTtcclxuICAgICAgICBjb25zdCBjb25zdHJhaW50cyA9IHsgLi4udGhpcy5jb25zdHJhaW50cywgYXVkaW86IGZhbHNlLCB2aWRlbzogeyBkZXZpY2VJZDogZGV2aWNlSWQsIC4uLnRoaXMuY29uc3RyYWludHMudmlkZW8gfSB9O1xyXG4gICAgICAgIC8vIE1lZGlhU3RyZWFtXHJcbiAgICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlcy5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpLnRoZW4oKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHtcclxuICAgICAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQub25sb2FkZWRtZXRhZGF0YSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnBsYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcclxuICAgICAgICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9OKCk7XHJcbiAgICAgICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5ldmVudEVtaXQoZmFsc2UpO1xyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIEFTX0NPTVBMRVRFKGFzLCBmYWxzZSk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogbG9hZEltYWdlXHJcbiAgICogQHBhcmFtIHNyYyBcclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIHB1YmxpYyBsb2FkSW1hZ2Uoc3JjOiBzdHJpbmcpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgLy8gTG9hZGluZyBvblxyXG4gICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPTigpO1xyXG4gICAgLy8gU2V0IHRoZSBzcmMgb2YgdGhpcyBJbWFnZSBvYmplY3QuXHJcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgLy8gU2V0dGluZyBjcm9zcyBvcmlnaW4gdmFsdWUgdG8gYW5vbnltb3VzXHJcbiAgICBpbWFnZS5zZXRBdHRyaWJ1dGUoJ2Nyb3NzT3JpZ2luJywgJ2Fub255bW91cycpO1xyXG4gICAgLy8gV2hlbiBvdXIgaW1hZ2UgaGFzIGxvYWRlZC5cclxuICAgIGltYWdlLm9ubG9hZCA9ICgpID0+IHtcclxuICAgICAgdGhpcy5kcmF3SW1hZ2UoaW1hZ2UsIChmbGFnOiBib29sZWFuKSA9PiB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZsYWcpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgICB9KTtcclxuICAgIH07XHJcbiAgICAvLyBTZXQgc3JjXHJcbiAgICBpbWFnZS5zcmMgPSBzcmM7XHJcbiAgICByZXR1cm4gYXM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiB0b3JjaGVyXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgdG9yY2hlcigpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IHRoaXMuYXBwbHlDb25zdHJhaW50cyh7IGFkdmFuY2VkOiBbeyB0b3JjaDogdGhpcy5pc1RvcmNoIH1dIH0pO1xyXG4gICAgYXMuc3Vic2NyaWJlKCgpID0+IGZhbHNlLCAoKSA9PiB0aGlzLmlzVG9yY2ggPSAhdGhpcy5pc1RvcmNoKTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFwcGx5Q29uc3RyYWludHNcclxuICAgKiBAcGFyYW0gY29uc3RyYWludHMgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgYXBwbHlDb25zdHJhaW50cyhjb25zdHJhaW50czogTWVkaWFUcmFja0NvbnN0cmFpbnRTZXQgfCBNZWRpYVRyYWNrQ29uc3RyYWludHMgfCBhbnkpOiBBc3luY1N1YmplY3Q8YW55PiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgY29uc3Qgc3RyZWFtID0gdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnNyY09iamVjdCBhcyBNZWRpYVN0cmVhbTtcclxuICAgIGNvbnN0IHZpZGVvVHJhY2sgPSBzdHJlYW0uZ2V0VmlkZW9UcmFja3MoKVswXSBhcyBNZWRpYVN0cmVhbVRyYWNrO1xyXG4gICAgY29uc3QgaW1hZ2VDYXB0dXJlID0gbmV3ICh3aW5kb3cgYXMgYW55KS5JbWFnZUNhcHR1cmUodmlkZW9UcmFjayk7XHJcbiAgICBpbWFnZUNhcHR1cmUuZ2V0UGhvdG9DYXBhYmlsaXRpZXMoKS50aGVuKGFzeW5jICgpID0+IHtcclxuICAgICAgYXdhaXQgdmlkZW9UcmFjay5hcHBseUNvbnN0cmFpbnRzKGNvbnN0cmFpbnRzKTtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIHRydWUpO1xyXG4gICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgc3dpdGNoIChlcnJvciAmJiBlcnJvci5uYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnTm90Rm91bmRFcnJvcic6XHJcbiAgICAgICAgY2FzZSAnRGV2aWNlc05vdEZvdW5kRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnUmVxdWlyZWQgdHJhY2sgaXMgbWlzc2luZycgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ05vdFJlYWRhYmxlRXJyb3InOlxyXG4gICAgICAgIGNhc2UgJ1RyYWNrU3RhcnRFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdXZWJjYW0gb3IgbWljIGFyZSBhbHJlYWR5IGluIHVzZScgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ092ZXJjb25zdHJhaW5lZEVycm9yJzpcclxuICAgICAgICBjYXNlICdDb25zdHJhaW50Tm90U2F0aXNmaWVkRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnQ29uc3RyYWludHMgY2FuIG5vdCBiZSBzYXRpc2ZpZWQgYnkgYXZiLiBkZXZpY2VzJyBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnTm90QWxsb3dlZEVycm9yJzpcclxuICAgICAgICBjYXNlICdQZXJtaXNzaW9uRGVuaWVkRXJyb3InOlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnUGVybWlzc2lvbiBkZW5pZWQgaW4gYnJvd3NlcicgYXMgYW55KTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgJ1R5cGVFcnJvcic6XHJcbiAgICAgICAgICBBU19DT01QTEVURShhcywgZmFsc2UsICdFbXB0eSBjb25zdHJhaW50cyBvYmplY3QnIGFzIGFueSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvciBhcyBhbnkpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFzO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIGdldENvbnN0cmFpbnRzXHJcbiAgICogQHJldHVybnMgXHJcbiAgICovXHJcbiAgcHVibGljIGdldENvbnN0cmFpbnRzKCk6IE1lZGlhVHJhY2tDb25zdHJhaW50U2V0IHwgYW55IHtcclxuICAgIGNvbnN0IHN0cmVhbSA9IHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zcmNPYmplY3QgYXMgTWVkaWFTdHJlYW07XHJcbiAgICBjb25zdCB2aWRlb1RyYWNrID0gc3RyZWFtICYmIHN0cmVhbS5nZXRWaWRlb1RyYWNrcygpWzBdIGFzIE1lZGlhU3RyZWFtVHJhY2s7XHJcbiAgICByZXR1cm4gdmlkZW9UcmFjayAmJiB2aWRlb1RyYWNrLmdldENvbnN0cmFpbnRzKCkgYXMgYW55O1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZG93bmxvYWRcclxuICAgKiBAcGFyYW0gZmlsZU5hbWUgXHJcbiAgICogQHJldHVybiBBc3luY1N1YmplY3RcclxuICAgKi9cclxuICBwdWJsaWMgZG93bmxvYWQoZmlsZU5hbWU6IHN0cmluZyA9IGBuZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLSR7RGF0ZS5ub3coKX0ucG5nYCk6IEFzeW5jU3ViamVjdDxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdPiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8YW55PigpO1xyXG4gICAgY29uc3QgcnVuID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICBjb25zdCBibG9iID0gYXdhaXQgQ0FOVkFTX1RPX0JMT0IodGhpcy5jYW52YXMubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgIGNvbnN0IGZpbGUgPSBCTE9CX1RPX0ZJTEUoYmxvYiwgZmlsZU5hbWUpO1xyXG4gICAgICBGSUxFU19UT19TQ0FOKFtmaWxlXSwgdGhpcy5jb25maWcsIGFzKS5zdWJzY3JpYmUoKHJlczogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXSkgPT4ge1xyXG4gICAgICAgIHJlcy5mb3JFYWNoKChpdGVtOiBTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlcykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICAgIGxpbmsuaHJlZiA9IGl0ZW0udXJsO1xyXG4gICAgICAgICAgbGluay5kb3dubG9hZCA9IGl0ZW0ubmFtZTtcclxuICAgICAgICAgIGxpbmsuY2xpY2soKTtcclxuICAgICAgICAgIGxpbmsucmVtb3ZlKClcclxuICAgICAgICB9KTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBydW4oKTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHdpbmRvdzogcmVzaXplXHJcbiAgICogRHJhdyBhZ2FpbiFcclxuICAgKi9cclxuICBwcml2YXRlIHJlc2l6ZSgpOiB2b2lkIHtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcclxuICAgICAgaWYgKHRoaXMuZGF0YUZvclJlc2l6ZSkge1xyXG4gICAgICAgIERSQVdfUkVTVUxUX0FQUEVORF9DSElMRCh0aGlzLmRhdGFGb3JSZXNpemUgYXMgYW55LCB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LCB0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLmNhbnZhc1N0eWxlcyk7XHJcbiAgICAgICAgdGhpcy52aWRlby5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZSBjb25maWdcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBwcml2YXRlIG92ZXJyaWRlQ29uZmlnKCk6IHZvaWQge1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAnc3JjJykpIHRoaXMuc3JjID0gdGhpcy5jb25maWcuc3JjO1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAnZnBzJykpIHRoaXMuZnBzID0gdGhpcy5jb25maWcuZnBzO1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAndmlicmF0ZScpKSB0aGlzLnZpYnJhdGUgPSB0aGlzLmNvbmZpZy52aWJyYXRlO1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAnaXNCZWVwJykpIHRoaXMuaXNCZWVwID0gdGhpcy5jb25maWcuaXNCZWVwO1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAnY29uc3RyYWludHMnKSkgdGhpcy5jb25zdHJhaW50cyA9IE9WRVJSSURFUygnY29uc3RyYWludHMnLCB0aGlzLmNvbmZpZywgTUVESUFfU1RSRUFNX0RFRkFVTFQpO1xyXG4gICAgaWYgKFBST1BfRVhJU1RTKHRoaXMuY29uZmlnLCAnY2FudmFzU3R5bGVzJykpIHRoaXMuY2FudmFzU3R5bGVzID0gdGhpcy5jb25maWcuY2FudmFzU3R5bGVzO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogc2FmYXJpV2ViUlRDXHJcbiAgICogRml4IGlzc3VlIG9uIHNhZmFyaVxyXG4gICAqIGh0dHBzOi8vd2VicnRjaGFja3MuY29tL2d1aWRlLXRvLXNhZmFyaS13ZWJydGNcclxuICAgKiBAcGFyYW0gYXMgXHJcbiAgICogQHBhcmFtIHBsYXlEZXZpY2VDdXN0b20gXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBzYWZhcmlXZWJSVEMoYXM6IEFzeW5jU3ViamVjdDxhbnk+LCBwbGF5RGV2aWNlQ3VzdG9tPzogRnVuY3Rpb24pOiB2b2lkIHtcclxuICAgIC8vIExvYWRpbmcgb25cclxuICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICB0aGlzLlNUQVRVUy5sb2FkaW5nT04oKTtcclxuICAgIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKHRoaXMuY29uc3RyYWludHMpLnRoZW4oKHN0cmVhbTogTWVkaWFTdHJlYW0pID0+IHtcclxuICAgICAgc3RyZWFtLmdldFRyYWNrcygpLmZvckVhY2godHJhY2sgPT4gdHJhY2suc3RvcCgpKTtcclxuICAgICAgdGhpcy5sb2FkQWxsRGV2aWNlcyhhcywgcGxheURldmljZUN1c3RvbSk7XHJcbiAgICB9KS5jYXRjaCgoZXJyb3I6IGFueSkgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgZmFsc2UsIGVycm9yKTtcclxuICAgICAgdGhpcy5TVEFUVVMuc3RhcnRPRkYoKTtcclxuICAgICAgdGhpcy5TVEFUVVMubG9hZGluZ09GRigpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBsb2FkQWxsRGV2aWNlc1xyXG4gICAqIEBwYXJhbSBhcyBcclxuICAgKiBAcGFyYW0gcGxheURldmljZUN1c3RvbSBcclxuICAgKi9cclxuICBwcml2YXRlIGxvYWRBbGxEZXZpY2VzKGFzOiBBc3luY1N1YmplY3Q8YW55PiwgcGxheURldmljZUN1c3RvbT86IEZ1bmN0aW9uKTogdm9pZCB7XHJcbiAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmVudW1lcmF0ZURldmljZXMoKS50aGVuKGRldmljZXMgPT4ge1xyXG4gICAgICBsZXQgY2FtZXJhRGV2aWNlczogU2Nhbm5lclFSQ29kZURldmljZVtdID0gZGV2aWNlcy5maWx0ZXIoZiA9PiBmLmtpbmQgPT0gJ3ZpZGVvaW5wdXQnKTtcclxuICAgICAgdGhpcy5kZXZpY2VzLm5leHQoY2FtZXJhRGV2aWNlcyk7XHJcbiAgICAgIGlmIChjYW1lcmFEZXZpY2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBBU19DT01QTEVURShhcywgY2FtZXJhRGV2aWNlcyk7XHJcbiAgICAgICAgcGxheURldmljZUN1c3RvbSA/IHBsYXlEZXZpY2VDdXN0b20oY2FtZXJhRGV2aWNlcykgOiB0aGlzLnBsYXlEZXZpY2UoY2FtZXJhRGV2aWNlc1swXS5kZXZpY2VJZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCAnTm8gY2FtZXJhIGRldGVjdGVkLicgYXMgYW55KTtcclxuICAgICAgICB0aGlzLlNUQVRVUy5zdGFydE9GRigpO1xyXG4gICAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgICAgfVxyXG4gICAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIGZhbHNlLCBlcnJvcik7XHJcbiAgICAgIHRoaXMuU1RBVFVTLnN0YXJ0T0ZGKCk7XHJcbiAgICAgIHRoaXMuU1RBVFVTLmxvYWRpbmdPRkYoKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZHJhd0ltYWdlXHJcbiAgICogQHBhcmFtIGVsZW1lbnQgXHJcbiAgICogQHBhcmFtIGNhbGxiYWNrIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgYXN5bmMgZHJhd0ltYWdlKGVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQgfCBIVE1MVmlkZW9FbGVtZW50LCBjYWxsYmFjazogRnVuY3Rpb24gPSAoKSA9PiB7IH0pOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgIC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgYnkgdXNpbmcgdGhlIGdldEVsZW1lbnRCeUlkIG1ldGhvZC5cclxuICAgIGNvbnN0IGNhbnZhcyA9IHRoaXMuY2FudmFzLm5hdGl2ZUVsZW1lbnQ7XHJcbiAgICAvLyBHZXQgYSAyRCBkcmF3aW5nIGNvbnRleHQgZm9yIHRoZSBjYW52YXMuXHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAvLyBIVE1MSW1hZ2VFbGVtZW50IHNpemVcclxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgICBjYW52YXMud2lkdGggPSBlbGVtZW50Lm5hdHVyYWxXaWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnQubmF0dXJhbEhlaWdodDtcclxuICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJyc7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XHJcbiAgICAgIHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBjYW52YXMub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcclxuICAgIH1cclxuICAgIC8vIEhUTUxWaWRlb0VsZW1lbnQgc2l6ZVxyXG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MVmlkZW9FbGVtZW50KSB7XHJcbiAgICAgIGNhbnZhcy53aWR0aCA9IGVsZW1lbnQudmlkZW9XaWR0aDtcclxuICAgICAgY2FudmFzLmhlaWdodCA9IGVsZW1lbnQudmlkZW9IZWlnaHQ7XHJcbiAgICAgIGVsZW1lbnQuc3R5bGUudmlzaWJpbGl0eSA9ICcnO1xyXG4gICAgICB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcclxuICAgIH1cclxuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KVxyXG4gICAgLy8gRHJhdyBpbWFnZVxyXG4gICAgY3R4LmRyYXdJbWFnZShlbGVtZW50LCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgLy8gRGF0YSBpbWFnZVxyXG4gICAgY29uc3QgaW1hZ2VEYXRhID0gY3R4LmdldEltYWdlRGF0YSgwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xyXG4gICAgLy8gRHJhdyBmcmFtZVxyXG4gICAgY29uc3QgY29kZSA9IGpzUVIoaW1hZ2VEYXRhLmRhdGEsIGltYWdlRGF0YS53aWR0aCwgaW1hZ2VEYXRhLmhlaWdodCwge1xyXG4gICAgICBpbnZlcnNpb25BdHRlbXB0czogXCJkb250SW52ZXJ0XCIsXHJcbiAgICB9KSBhcyBTY2FubmVyUVJDb2RlUmVzdWx0O1xyXG4gICAgaWYgKGNvZGUgJiYgY29kZS5kYXRhICE9PSAnJykge1xyXG4gICAgICAvLyBPdmVybGF5XHJcbiAgICAgIERSQVdfUkVTVUxUX0FQUEVORF9DSElMRChjb2RlLCB0aGlzLmNhbnZhcy5uYXRpdmVFbGVtZW50LCB0aGlzLnJlc3VsdHNQYW5lbC5uYXRpdmVFbGVtZW50LCB0aGlzLmNhbnZhc1N0eWxlcyk7XHJcblxyXG4gICAgICAvLyBUbyBibG9iIGFuZCBlbWl0IGRhdGFcclxuICAgICAgY29uc3QgRU1JVF9EQVRBID0gKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuZXZlbnRFbWl0KGNvZGUpO1xyXG4gICAgICAgIHRoaXMuZGF0YUZvclJlc2l6ZSA9IGNvZGU7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyBIVE1MSW1hZ2VFbGVtZW50XHJcbiAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCkge1xyXG4gICAgICAgIGNhbGxiYWNrKHRydWUpO1xyXG4gICAgICAgIEVNSVRfREFUQSgpO1xyXG4gICAgICAgIFZJQlJBVEUodGhpcy52aWJyYXRlKTtcclxuICAgICAgICBQTEFZX0FVRElPKHRoaXMuaXNCZWVwKTtcclxuICAgICAgfVxyXG4gICAgICAvLyBIVE1MVmlkZW9FbGVtZW50XHJcbiAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCkge1xyXG4gICAgICAgIEVNSVRfREFUQSgpO1xyXG4gICAgICAgIFZJQlJBVEUodGhpcy52aWJyYXRlKTtcclxuICAgICAgICBQTEFZX0FVRElPKHRoaXMuaXNCZWVwKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY2FsbGJhY2soZmFsc2UpO1xyXG4gICAgICBSRU1PVkVfQ0FOVkFTKHRoaXMucmVzdWx0c1BhbmVsLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICB0aGlzLmRhdGFGb3JSZXNpemUgPSBjb2RlO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZXZlbnRFbWl0XHJcbiAgICogQHBhcmFtIHJlc3BvbnNlIFxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXZlbnRFbWl0KHJlc3BvbnNlOiBhbnkgPSBmYWxzZSk6IHZvaWQge1xyXG4gICAgKHJlc3BvbnNlICE9PSBmYWxzZSkgJiYgdGhpcy5kYXRhLm5leHQocmVzcG9uc2UgfHwgeyBkYXRhOiBudWxsIH0pO1xyXG4gICAgKHJlc3BvbnNlICE9PSBmYWxzZSkgJiYgdGhpcy5ldmVudC5lbWl0KHJlc3BvbnNlIHx8IHsgZGF0YTogbnVsbCB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNpbmdsZS10aHJlYWRcclxuICAgKiBMb29wIFJlY29yZGluZyBvbiBDYW1lcmFcclxuICAgKiBNdXN0IGJlIGRlc3Ryb3kgcmVxdWVzdCBcclxuICAgKiBOb3QgdXNpbmc6IHJlcXVlc3RBbmltYXRpb25GcmFtZVxyXG4gICAqIEBwYXJhbSBkZWxheVxyXG4gICAqL1xyXG4gIHByaXZhdGUgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRlbGF5OiBudW1iZXIgPSAwKTogdm9pZCB7XHJcbiAgICB0aGlzLnJBRl9JRCA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgaWYgKHRoaXMudmlkZW8ubmF0aXZlRWxlbWVudC5yZWFkeVN0YXRlID09PSB0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQuSEFWRV9FTk9VR0hfREFUQSkge1xyXG4gICAgICAgIGRlbGF5ID0gMDtcclxuICAgICAgICB0aGlzLmRyYXdJbWFnZSh0aGlzLnZpZGVvLm5hdGl2ZUVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICB9LCAvKmF2b2lkIGNhY2hlIG1lZGlhU3RyZWFtKi8gZGVsYXkgfHwgdGhpcy5mcHMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU3RhdHVzIG9mIHdhc21cclxuICAgKiBAcmV0dXJuIEFzeW5jU3ViamVjdFxyXG4gICAqL1xyXG4gIGdldCBpc1JlYWR5KCk6IEFzeW5jU3ViamVjdDxib29sZWFuPiB7XHJcbiAgICByZXR1cm4gdGhpcy5yZWFkeTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgdGhpcy5wYXVzZSgpO1xyXG4gIH1cclxufVxyXG4iXX0=