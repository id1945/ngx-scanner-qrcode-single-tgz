(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jsqr'), require('rxjs'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('ngx-scanner-qrcode-single', ['exports', 'jsqr', 'rxjs', '@angular/core'], factory) :
    (factory((global['ngx-scanner-qrcode-single'] = {}),global.jsqr,global.rxjs,global.ng.core));
}(this, (function (exports,jsQR,rxjs,i0) { 'use strict';

    jsQR = jsQR && jsQR.hasOwnProperty('default') ? jsQR['default'] : jsQR;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var MEDIA_STREAM_DEFAULT = {
        audio: false,
        video: true
    };
    /** @type {?} */
    var CONFIG_DEFAULT = {
        src: '',
        fps: 30,
        vibrate: 300,
        isBeep: true,
        constraints: MEDIA_STREAM_DEFAULT,
        canvasStyles: /** @type {?} */ ({
            font: '15px serif',
            lineWidth: 1,
            strokeStyle: 'green',
            fillStyle: '#55f02880'
        })
    };

    var _this = this;
    /** *
     * PROP_EXISTS
     * \@param obj
     * \@param path
     * \@return
      @type {?} */
    var PROP_EXISTS = function (obj, path) {
        return !!path.split(".").reduce(function (obj, prop) {
            return obj && obj[prop] ? obj[prop] : undefined;
        }, obj);
    };
    /** *
     * OVERRIDES
     * \@param variableKey
     * \@param config
     * \@param defaultConfig
     * \@return
      @type {?} */
    var OVERRIDES = function (variableKey, config, defaultConfig) {
        var _a;
        if (config && Object.keys(config[variableKey]).length) {
            for (var key in defaultConfig) {
                /** @type {?} */
                var cloneDeep = JSON.parse(JSON.stringify(__assign({}, config[variableKey], (_a = {}, _a[key] = ( /** @type {?} */(defaultConfig))[key], _a))));
                config[variableKey] = config[variableKey] && config[variableKey].hasOwnProperty(key) ? config[variableKey] : cloneDeep;
            }
            return config[variableKey];
        }
        else {
            return defaultConfig;
        }
    };
    /** *
     * Rxjs complete
     * \@param as
     * \@param data
     * \@param error
      @type {?} */
    var AS_COMPLETE = function (as, data, error) {
        error ? as.error(error) : as.next(data);
        as.complete();
    };
    /** *
     * CAMERA_BEEP
     * \@param isPlay
     * \@return
      @type {?} */
    var PLAY_AUDIO = function (isPlay) {
        if (isPlay === void 0) {
            isPlay = false;
        }
        if (isPlay === false)
            return;
        /** @type {?} */
        var audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(300).join('101'));
        // when the sound has been loaded, execute your code
        audio.oncanplaythrough = function () {
            /** @type {?} */
            var promise = audio.play();
            if (promise) {
                promise.catch(function (e) {
                    if (e.name === "NotAllowedError" || e.name === "NotSupportedError") ;
                });
            }
        };
    };
    /** *
     * DRAW_RESULT_APPEND_CHILD
     * \@param code
     * \@param oriCanvas
     * \@param elTarget
     * \@param canvasStyles
      @type {?} */
    var DRAW_RESULT_APPEND_CHILD = function (code, oriCanvas, elTarget, canvasStyles) {
        /** @type {?} */
        var widthZoom;
        /** @type {?} */
        var heightZoom;
        /** @type {?} */
        var oriWidth = oriCanvas.width;
        /** @type {?} */
        var oriHeight = oriCanvas.height;
        /** @type {?} */
        var oriWHRatio = oriWidth / oriHeight;
        /** @type {?} */
        var imgWidth = parseInt(getComputedStyle(oriCanvas).width);
        /** @type {?} */
        var imgHeight = parseInt(getComputedStyle(oriCanvas).height);
        /** @type {?} */
        var imgWHRatio = imgWidth / imgHeight;
        elTarget.innerHTML = '';
        if (oriWHRatio > imgWHRatio) {
            widthZoom = imgWidth / oriWidth;
            heightZoom = imgWidth / oriWHRatio / oriHeight;
        }
        else {
            heightZoom = imgHeight / oriHeight;
            widthZoom = (imgHeight * oriWHRatio) / oriWidth;
        }
        /** @type {?} */
        var cvs = document.createElement("canvas");
        /** @type {?} */
        var ctx = /** @type {?} */ (cvs.getContext('2d', { willReadFrequently: true }));
        /** @type {?} */
        var loc = {};
        /** @type {?} */
        var X = [];
        /** @type {?} */
        var Y = [];
        /** @type {?} */
        var fontSize = 0;
        /** @type {?} */
        var svgSize = 0;
        /** @type {?} */
        var num = PROP_EXISTS(canvasStyles, 'font.replace') && canvasStyles.font.replace(/[^0-9]/g, '');
        if (/[0-9]/g.test(num)) {
            fontSize = parseFloat(num);
            svgSize = (widthZoom || 1) * fontSize;
            if (Number.isNaN(svgSize)) {
                svgSize = fontSize;
            }
        }
        /** @type {?} */
        var points = code.location;
        /** @type {?} */
        var drawFrame = function (begin, end, j) {
            ctx.beginPath();
            ctx.moveTo(begin.x, begin.y);
            ctx.lineTo(end.x, end.y);
            for (var key in canvasStyles) {
                ( /** @type {?} */(ctx))[key] = ( /** @type {?} */(canvasStyles))[key];
            }
            ctx.stroke();
            /** @type {?} */
            var xj = PROP_EXISTS(begin, 'x') ? begin.x : 0;
            /** @type {?} */
            var yj = PROP_EXISTS(begin, 'y') ? begin.y : 0;
            loc["x" + (j + 1)] = xj;
            loc["y" + (j + 1)] = yj;
            X.push(xj);
            Y.push(yj);
        };
        drawFrame(points.topLeftCorner, points.topRightCorner, 0);
        drawFrame(points.topRightCorner, points.bottomRightCorner, 1);
        drawFrame(points.bottomRightCorner, points.bottomLeftCorner, 2);
        drawFrame(points.bottomLeftCorner, points.topLeftCorner, 3);
        /** @type {?} */
        var maxX = Math.max.apply(Math, __spread(X));
        /** @type {?} */
        var minX = Math.min.apply(Math, __spread(X));
        /** @type {?} */
        var maxY = Math.max.apply(Math, __spread(Y));
        /** @type {?} */
        var minY = Math.min.apply(Math, __spread(Y));
        // Add class
        cvs.setAttribute('class', 'qrcode-polygon');
        // Size with screen zoom
        if (oriWHRatio > imgWHRatio) {
            cvs.style.top = minY * heightZoom + (imgHeight - imgWidth / oriWHRatio) * 0.5 + "px";
            cvs.style.left = minX * widthZoom + "px";
            cvs.width = (maxX - minX) * widthZoom;
            cvs.height = (maxY - minY) * widthZoom;
        }
        else {
            cvs.style.top = minY * heightZoom + "px";
            cvs.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            cvs.width = (maxX - minX) * heightZoom;
            cvs.height = (maxY - minY) * heightZoom;
        }
        // Style for canvas
        for (var key in canvasStyles) {
            ( /** @type {?} */(ctx))[key] = ( /** @type {?} */(canvasStyles))[key];
        }
        /** @type {?} */
        var polygon = [];
        for (var k = 0; k < X.length; k++) {
            polygon.push((loc["x" + (k + 1)] - minX) * heightZoom);
            polygon.push((loc["y" + (k + 1)] - minY) * widthZoom);
        }
        /** @type {?} */
        var shape = /** @type {?} */ (polygon.slice(0));
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(shape.shift(), shape.shift());
        while (shape.length) {
            ctx.lineTo(shape.shift(), shape.shift()); //x,y
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (fontSize) {
            /** @type {?} */
            var qrcodeTooltipTemp = document.createElement('div');
            qrcodeTooltipTemp.setAttribute('class', 'qrcode-tooltip-temp');
            qrcodeTooltipTemp.innerText = code.data;
            /** @type {?} */
            var xmlString = "<?xml version=\"1.0\" encoding=\"utf-8\"?><svg version=\"1.1\" class=\"qrcode-tooltip-clipboard\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + svgSize + "\" height=\"" + svgSize + "\" x=\"0px\" y=\"0px\" viewBox=\"0 0 115.77 122.88\" xml:space=\"preserve\"><g><path d=\"M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z\"></path></g></svg> ";
            /** @type {?} */
            var xmlDom = new DOMParser().parseFromString(xmlString, 'application/xml');
            /** @type {?} */
            var svgDom = qrcodeTooltipTemp.ownerDocument.importNode(xmlDom.documentElement, true);
            qrcodeTooltipTemp.appendChild(svgDom);
            svgDom.addEventListener("click", function () { return window.navigator['clipboard'].writeText(code.data); });
            /** @type {?} */
            var qrcodeTooltip = document.createElement('div');
            qrcodeTooltip.setAttribute('class', 'qrcode-tooltip');
            qrcodeTooltip.appendChild(qrcodeTooltipTemp);
            heightZoom = imgHeight / oriHeight;
            widthZoom = (imgHeight * oriWHRatio) / oriWidth;
            qrcodeTooltip.style.fontSize = widthZoom * fontSize + 'px';
            qrcodeTooltip.style.top = minY * heightZoom + "px";
            qrcodeTooltip.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            qrcodeTooltip.style.width = (maxX - minX) * heightZoom + "px";
            qrcodeTooltip.style.height = (maxY - minY) * heightZoom + "px";
            /** @type {?} */
            var resultText = document.createElement('span');
            resultText.innerText = code.data;
            resultText.style.fontSize = widthZoom * fontSize + 'px';
            // Set position result text
            resultText.style.top = minY * heightZoom + (-20 * heightZoom) + "px";
            resultText.style.left = minX * widthZoom + (imgWidth - imgHeight * oriWHRatio) * 0.5 + "px";
            elTarget && elTarget.appendChild(qrcodeTooltip);
            elTarget && elTarget.appendChild(resultText);
        }
        elTarget && elTarget.appendChild(cvs);
    };
    /** *
     * DRAW_RESULT_ON_CANVAS
     * \@param code
     * \@param cvs
     * \@param canvasStyles
      @type {?} */
    var DRAW_RESULT_ON_CANVAS = function (code, cvs, canvasStyles) {
        /** @type {?} */
        var ctx = /** @type {?} */ (cvs.getContext('2d', { willReadFrequently: true }));
        /** @type {?} */
        var loc = {};
        /** @type {?} */
        var X = [];
        /** @type {?} */
        var Y = [];
        /** @type {?} */
        var points = code.location;
        /** @type {?} */
        var drawFrame = function (begin, end, j) {
            ctx.beginPath();
            ctx.moveTo(begin.x, begin.y);
            ctx.lineTo(end.x, end.y);
            for (var key in canvasStyles) {
                ( /** @type {?} */(ctx))[key] = ( /** @type {?} */(canvasStyles))[key];
            }
            ctx.stroke();
            /** @type {?} */
            var xj = PROP_EXISTS(begin, 'x') ? begin.x : 0;
            /** @type {?} */
            var yj = PROP_EXISTS(begin, 'y') ? begin.y : 0;
            loc["x" + (j + 1)] = xj;
            loc["y" + (j + 1)] = yj;
            X.push(xj);
            Y.push(yj);
        };
        drawFrame(points.topLeftCorner, points.topRightCorner, 0);
        drawFrame(points.topRightCorner, points.bottomRightCorner, 1);
        drawFrame(points.bottomRightCorner, points.bottomLeftCorner, 2);
        drawFrame(points.bottomLeftCorner, points.topLeftCorner, 3);
        /** @type {?} */
        var minX = Math.min.apply(Math, __spread(X));
        /** @type {?} */
        var minY = Math.min.apply(Math, __spread(Y));
        // Style for canvas
        for (var key in canvasStyles) {
            ( /** @type {?} */(ctx))[key] = ( /** @type {?} */(canvasStyles))[key];
        }
        ctx.font = canvasStyles && canvasStyles.font ? canvasStyles.font : "15px serif";
        FILL_TEXT_MULTI_LINE(ctx, code.data, minX, minY - 5);
        /** @type {?} */
        var polygon = [];
        for (var k = 0; k < X.length; k++) {
            polygon.push(loc["x" + (k + 1)]);
            polygon.push(loc["y" + (k + 1)]);
        }
        /** @type {?} */
        var shape = /** @type {?} */ (polygon.slice(0));
        // Draw polygon
        ctx.beginPath();
        ctx.moveTo(shape.shift(), shape.shift());
        while (shape.length) {
            ctx.lineTo(shape.shift(), shape.shift()); //x,y
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
    /** *
     * READ_AS_DATA_URL
     * \@param file
     * \@param config
     * \@return Promise
      @type {?} */
    var READ_AS_DATA_URL = function (file, configs) {
        /** *
         * overrides *
          @type {?} */
        var canvasStyles = (configs && configs.canvasStyles) ? configs.canvasStyles : CONFIG_DEFAULT.canvasStyles;
        /** @type {?} */
        var isBeep = (configs && configs.isBeep) ? configs.isBeep : CONFIG_DEFAULT.isBeep;
        /** drawImage **/
        return new Promise(function (resolve, reject) {
            /** @type {?} */
            var fileReader = new FileReader();
            fileReader.onload = function () {
                /** @type {?} */
                var objectFile = {
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file)
                };
                /** @type {?} */
                var image = new Image();
                // Setting cross origin value to anonymous
                image.setAttribute('crossOrigin', 'anonymous');
                // When our image has loaded.
                image.onload = function () {
                    return __awaiter(_this, void 0, void 0, function () {
                        var canvas, ctx, imageData, code, blob, url, blobToFile;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    canvas = document.createElement('canvas');
                                    // HTMLImageElement size
                                    canvas.width = image.naturalWidth || image.width;
                                    canvas.height = image.naturalHeight || image.height;
                                    ctx = /** @type {?} */ (canvas.getContext('2d'));
                                    // Draw image
                                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                                    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                                    code = /** @type {?} */ (jsQR(imageData.data, imageData.width, imageData.height, {
                                        inversionAttempts: "dontInvert",
                                    }));
                                    if (!(code && code.data !== ''))
                                        return [3 /*break*/, 2];
                                    // Overlay
                                    DRAW_RESULT_ON_CANVAS(code, canvas, canvasStyles);
                                    return [4 /*yield*/, CANVAS_TO_BLOB(canvas)];
                                case 1:
                                    blob = _a.sent();
                                    url = URL.createObjectURL(blob);
                                    blobToFile = function (theBlob, fileName) { return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type }); };
                                    resolve(Object.assign({}, objectFile, { data: code, url: url, canvas: canvas, file: blobToFile(blob, objectFile.name) }));
                                    PLAY_AUDIO(isBeep);
                                    return [3 /*break*/, 3];
                                case 2:
                                    resolve(Object.assign({}, objectFile, { data: code, canvas: canvas }));
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                };
                // Set src
                image.src = objectFile.url;
            };
            fileReader.onerror = function (error) { return reject(error); };
            fileReader.readAsDataURL(file);
        });
    };
    /** *
     * Convert canvas to blob
     * canvas.toBlob((blob) => { .. }, 'image/jpeg', 0.95); // JPEG at 95% quality
     * \@param canvas
     * \@param type
     * \@return Promise
      @type {?} */
    var CANVAS_TO_BLOB = function (canvas, type) {
        return new Promise(function (resolve, reject) { return canvas.toBlob(function (blob) { return resolve(blob); }, type); });
    };
    /** *
     * Convert blob to file
     * \@param theBlob
     * \@param fileName
     * \@return File
      @type {?} */
    var BLOB_TO_FILE = function (theBlob, fileName) {
        return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
    };
    /** *
     * FILES_TO_SCAN
     * \@param files
     * \@param configs
     * \@param as
     * \@return
      @type {?} */
    var FILES_TO_SCAN = function (files, configs, as) {
        if (files === void 0) {
            files = [];
        }
        if (as === void 0) {
            as = new rxjs.AsyncSubject();
        }
        Promise.all(Object.assign([], files).map(function (m) { return READ_AS_DATA_URL(m, configs); })).then(function (img) {
            AS_COMPLETE(as, img);
        }).catch(function (error) { return AS_COMPLETE(as, null, error); });
        return as;
    };
    /** *
     * FILL_TEXT_MULTI_LINE
     * \@param ctx
     * \@param text
     * \@param x
     * \@param y
      @type {?} */
    var FILL_TEXT_MULTI_LINE = function (ctx, text, x, y) {
        /** @type {?} */
        var lineHeight = ctx.measureText("M").width * 1.2;
        /** @type {?} */
        var lines = text.split("\n");
        for (var i = 0; i < lines.length; ++i) {
            ctx.fillText(lines[i], x, y);
            ctx.strokeText(lines[i], x, y);
            y += lineHeight;
        }
    };
    /** *
     * COMPRESS_IMAGE
     * \@param files
     * \@param type
     * \@param quality
     * \@return
      @type {?} */
    var COMPRESS_IMAGE = function (files, quality, type) {
        return __awaiter(_this, void 0, void 0, function () {
            var e_1, _a, compressImage, dataTransfer, files_1, files_1_1, file, compressedFile, e_1_1;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        // No files selected
                        if (!files.length)
                            return [2 /*return*/];
                        compressImage = function (file) {
                            return __awaiter(_this, void 0, void 0, function () {
                                var imageBitmap, canvas, ctx, blob;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, createImageBitmap(file)];
                                        case 1:
                                            imageBitmap = _a.sent();
                                            canvas = document.createElement('canvas');
                                            canvas.width = imageBitmap.width;
                                            canvas.height = imageBitmap.height;
                                            ctx = canvas.getContext('2d');
                                            ( /** @type {?} */(ctx)).drawImage(imageBitmap, 0, 0);
                                            return [4 /*yield*/, new Promise(function (resolve) {
                                                    return canvas.toBlob(resolve, type, quality);
                                                })];
                                        case 2:
                                            blob = /** @type {?} */ (_a.sent());
                                            // Turn Blob into File
                                            return [2 /*return*/, new File([blob], file.name, {
                                                    type: blob.type,
                                                })];
                                    }
                                });
                            });
                        };
                        dataTransfer = new DataTransfer();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        files_1 = __values(files), files_1_1 = files_1.next();
                        _b.label = 2;
                    case 2:
                        if (!!files_1_1.done)
                            return [3 /*break*/, 5];
                        file = files_1_1.value;
                        // We don't have to compress files that aren't images
                        if (!file.type.startsWith('image')) {
                            // Ignore this file, but do add it to our result
                            dataTransfer.items.add(file);
                            return [3 /*break*/, 4];
                        }
                        return [4 /*yield*/, compressImage(file)];
                    case 3:
                        compressedFile = _b.sent();
                        // Save back the compressed file instead of the original file
                        dataTransfer.items.add(compressedFile);
                        _b.label = 4;
                    case 4:
                        files_1_1 = files_1.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (files_1_1 && !files_1_1.done && (_a = files_1.return))
                                _a.call(files_1);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                        return [7 /*endfinally*/];
                    case 8:
                        // return value new files list
                        return [2 /*return*/, dataTransfer.files];
                }
            });
        });
    };
    /** *
     * REMOVE_CANVAS
     * \@param element
      @type {?} */
    var REMOVE_CANVAS = function (element) {
        Object.assign([], element.childNodes).forEach(function (el) { return element.removeChild(el); });
    };
    /** *
     * VIBRATE
     * Bật rung trên mobile
     * \@param time
      @type {?} */
    var VIBRATE = function (time) {
        if (time === void 0) {
            time = 300;
        }
        time && IS_MOBILE() && window.navigator.vibrate(time);
    };
    /** *
     * IS_MOBILE
     * \@return
      @type {?} */
    var IS_MOBILE = function () {
        /** @type {?} */
        var vendor = navigator.userAgent || navigator['vendor'] || ( /** @type {?} */(window))['opera'];
        /** @type {?} */
        var phone = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
        /** @type {?} */
        var version = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
        /** @type {?} */
        var isSafari = /^((?!chrome|android).)*safari/i;
        return !!(phone.test(vendor) || version.test(vendor.substr(0, 4))) && !isSafari.test(vendor);
    };

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxScannerQrcodeSingleService = /** @class */ (function () {
        function NgxScannerQrcodeSingleService() {
        }
        /**
         * loadFiles
         * @param {?=} files
         * @param {?=} quality
         * @param {?=} type
         * @return {?}
         */
        NgxScannerQrcodeSingleService.prototype.loadFiles = /**
         * loadFiles
         * @param {?=} files
         * @param {?=} quality
         * @param {?=} type
         * @return {?}
         */
            function (files, quality, type) {
                var _this = this;
                if (files === void 0) {
                    files = [];
                }
                if (quality === void 0) {
                    quality = 0.5;
                }
                if (type === void 0) {
                    type = 'image/jpeg';
                }
                /** @type {?} */
                var as = new rxjs.AsyncSubject();
                COMPRESS_IMAGE(files, quality, type).then(function (_files) {
                    Promise.all(Object.assign([], _files).map(function (m) { return _this.readAsDataURL(m); })).then(function (img) { return AS_COMPLETE(as, img); }).catch(function (error) { return AS_COMPLETE(as, null, error); });
                }).catch(function (error) {
                    AS_COMPLETE(as, null, /** @type {?} */ (error));
                });
                return as;
            };
        /**
         * loadFilesToScan
         * @param {?=} files
         * @param {?=} config
         * @param {?=} quality
         * @param {?=} type
         * @return {?}
         */
        NgxScannerQrcodeSingleService.prototype.loadFilesToScan = /**
         * loadFilesToScan
         * @param {?=} files
         * @param {?=} config
         * @param {?=} quality
         * @param {?=} type
         * @return {?}
         */
            function (files, config, quality, type) {
                if (files === void 0) {
                    files = [];
                }
                if (quality === void 0) {
                    quality = 0.5;
                }
                if (type === void 0) {
                    type = 'image/jpeg';
                }
                /** @type {?} */
                var as = new rxjs.AsyncSubject();
                COMPRESS_IMAGE(files, quality, type).then(function (_files) {
                    FILES_TO_SCAN(_files, config, as);
                }).catch(function (error) {
                    AS_COMPLETE(as, null, /** @type {?} */ (error));
                });
                return as;
            };
        /**
         * readAsDataURL
         * @param {?} file
         * @return {?} Promise
         */
        NgxScannerQrcodeSingleService.prototype.readAsDataURL = /**
         * readAsDataURL
         * @param {?} file
         * @return {?} Promise
         */
            function (file) {
                /** drawImage **/
                return new Promise(function (resolve, reject) {
                    /** @type {?} */
                    var fileReader = new FileReader();
                    fileReader.onload = function () {
                        /** @type {?} */
                        var objectFile = {
                            name: file.name,
                            file: file,
                            url: URL.createObjectURL(file)
                        };
                        resolve(objectFile);
                    };
                    fileReader.onerror = function (error) { return reject(error); };
                    fileReader.readAsDataURL(file);
                });
            };
        NgxScannerQrcodeSingleService.decorators = [
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */ NgxScannerQrcodeSingleService.ngInjectableDef = i0.defineInjectable({ factory: function NgxScannerQrcodeSingleService_Factory() { return new NgxScannerQrcodeSingleService(); }, token: NgxScannerQrcodeSingleService, providedIn: "root" });
        return NgxScannerQrcodeSingleService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxScannerQrcodeSingleComponent = /** @class */ (function () {
        function NgxScannerQrcodeSingleComponent() {
            var _this = this;
            /**
             * EventEmitter
             */
            this.event = new i0.EventEmitter();
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
            this.data = new rxjs.BehaviorSubject(null);
            this.devices = new rxjs.BehaviorSubject([]);
            this.deviceIndexActive = 0;
            this.ready = new rxjs.AsyncSubject();
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
                var as = new rxjs.AsyncSubject();
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
                var as = new rxjs.AsyncSubject();
                try {
                    clearInterval(this.rAF_ID);
                    ( /** @type {?} */(this.video.nativeElement.srcObject)).getTracks().forEach(function (track) {
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
                var as = new rxjs.AsyncSubject();
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
                var as = new rxjs.AsyncSubject();
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
                if (as === void 0) {
                    as = new rxjs.AsyncSubject();
                }
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
                        var constraints = __assign({}, this.constraints, { audio: false, video: __assign({ deviceId: deviceId }, this.constraints.video) });
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
                var as = new rxjs.AsyncSubject();
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
                var as = new rxjs.AsyncSubject();
                /** @type {?} */
                var stream = /** @type {?} */ (this.video.nativeElement.srcObject);
                /** @type {?} */
                var videoTrack = /** @type {?} */ (stream.getVideoTracks()[0]);
                /** @type {?} */
                var imageCapture = new ( /** @type {?} */(window)).ImageCapture(videoTrack);
                imageCapture.getPhotoCapabilities().then(function () {
                    return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, videoTrack.applyConstraints(constraints)];
                                case 1:
                                    _a.sent();
                                    AS_COMPLETE(as, true);
                                    return [2 /*return*/];
                            }
                        });
                    });
                }).catch(function (error) {
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
                if (fileName === void 0) {
                    fileName = "ngx-scanner-qrcode-single-" + Date.now() + ".png";
                }
                /** @type {?} */
                var as = new rxjs.AsyncSubject();
                /** @type {?} */
                var run = function () {
                    return __awaiter(_this, void 0, void 0, function () {
                        var blob, file;
                        return __generator(this, function (_a) {
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
                    });
                };
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
                if (callback === void 0) {
                    callback = function () { };
                }
                return __awaiter(this, void 0, void 0, function () {
                    var canvas, ctx, imageData, code, EMIT_DATA;
                    var _this = this;
                    return __generator(this, function (_a) {
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
                if (response === void 0) {
                    response = false;
                }
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
                if (delay === void 0) {
                    delay = 0;
                }
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
             */ function () {
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
            { type: i0.Component, args: [{
                        selector: 'ngx-scanner-qrcode-single',
                        template: "<div #resultsPanel class=\"origin-overlay\"></div><canvas #canvas class=\"origin-canvas\"></canvas><video #video playsinline class=\"origin-video\"></video>",
                        host: { 'class': 'ngx-scanner-qrcode-single' },
                        exportAs: 'scanner',
                        inputs: ['src', 'fps', 'vibrate', 'isBeep', 'config', 'constraints', 'canvasStyles'],
                        outputs: ['event'],
                        queries: {
                            video: new i0.ViewChild('video'),
                            canvas: new i0.ViewChild('canvas'),
                            resultsPanel: new i0.ViewChild('resultsPanel')
                        },
                        encapsulation: i0.ViewEncapsulation.None,
                        styles: [".ngx-scanner-qrcode-single{display:block;position:relative}.origin-overlay{width:100%;position:absolute}.origin-overlay span{z-index:2;color:red;text-align:left;position:absolute}.origin-overlay .qrcode-polygon{z-index:1;position:absolute}.origin-canvas{width:100%;position:absolute}.origin-video{width:100%;background-color:#262626}.qrcode-tooltip{z-index:3;position:absolute}.qrcode-tooltip:hover .qrcode-tooltip-temp{display:block;position:absolute}.qrcode-tooltip-temp{bottom:0;left:50%;padding:5px;color:#fff;text-align:left;display:none;max-width:450px;border-radius:5px;width:-moz-max-content;width:max-content;word-wrap:break-word;transform:translate(-50%);transform-style:preserve-3d;background-color:#000000d0;box-shadow:1px 1px 20px #000000e0}.qrcode-tooltip-temp .qrcode-tooltip-clipboard{cursor:pointer;margin-left:5px;fill:#fff}.qrcode-tooltip-temp .qrcode-tooltip-clipboard:active{fill:#afafaf}"]
                    }] }
        ];
        /** @nocollapse */
        NgxScannerQrcodeSingleComponent.ctorParameters = function () { return []; };
        return NgxScannerQrcodeSingleComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var NgxScannerQrcodeSingleModule = /** @class */ (function () {
        function NgxScannerQrcodeSingleModule() {
        }
        NgxScannerQrcodeSingleModule.decorators = [
            { type: i0.NgModule, args: [{
                        declarations: [NgxScannerQrcodeSingleComponent],
                        exports: [NgxScannerQrcodeSingleComponent],
                        providers: [NgxScannerQrcodeSingleService],
                    },] }
        ];
        return NgxScannerQrcodeSingleModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */

    exports.NgxScannerQrcodeSingleService = NgxScannerQrcodeSingleService;
    exports.NgxScannerQrcodeSingleComponent = NgxScannerQrcodeSingleComponent;
    exports.NgxScannerQrcodeSingleModule = NgxScannerQrcodeSingleModule;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=ngx-scanner-qrcode-single.umd.js.map