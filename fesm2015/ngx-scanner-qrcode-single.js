import { __awaiter } from 'tslib';
import jsQR from 'jsqr';
import { AsyncSubject, BehaviorSubject } from 'rxjs';
import { Injectable, NgModule, defineInjectable, EventEmitter, Component, ViewChild, ViewEncapsulation } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
const MEDIA_STREAM_DEFAULT = {
    audio: false,
    video: true
};
/** @type {?} */
const CONFIG_DEFAULT = {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** *
 * PROP_EXISTS
 * \@param obj
 * \@param path
 * \@return
  @type {?} */
const PROP_EXISTS = (obj, path) => {
    return !!path.split(".").reduce((obj, prop) => {
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
const OVERRIDES = (variableKey, config, defaultConfig) => {
    if (config && Object.keys(config[variableKey]).length) {
        for (const key in defaultConfig) {
            /** @type {?} */
            const cloneDeep = JSON.parse(JSON.stringify(Object.assign({}, config[variableKey], { [key]: (/** @type {?} */ (defaultConfig))[key] })));
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
const AS_COMPLETE = (as, data, error) => {
    error ? as.error(error) : as.next(data);
    as.complete();
};
/** *
 * CAMERA_BEEP
 * \@param isPlay
 * \@return
  @type {?} */
const PLAY_AUDIO = (isPlay = false) => {
    if (isPlay === false)
        return;
    /** @type {?} */
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + Array(300).join('101'));
    // when the sound has been loaded, execute your code
    audio.oncanplaythrough = () => {
        /** @type {?} */
        const promise = audio.play();
        if (promise) {
            promise.catch((e) => {
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
const DRAW_RESULT_APPEND_CHILD = (code, oriCanvas, elTarget, canvasStyles) => {
    /** @type {?} */
    let widthZoom;
    /** @type {?} */
    let heightZoom;
    /** @type {?} */
    let oriWidth = oriCanvas.width;
    /** @type {?} */
    let oriHeight = oriCanvas.height;
    /** @type {?} */
    let oriWHRatio = oriWidth / oriHeight;
    /** @type {?} */
    let imgWidth = parseInt(getComputedStyle(oriCanvas).width);
    /** @type {?} */
    let imgHeight = parseInt(getComputedStyle(oriCanvas).height);
    /** @type {?} */
    let imgWHRatio = imgWidth / imgHeight;
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
    let cvs = document.createElement("canvas");
    /** @type {?} */
    let ctx = /** @type {?} */ (cvs.getContext('2d', { willReadFrequently: true }));
    /** @type {?} */
    let loc = {};
    /** @type {?} */
    let X = [];
    /** @type {?} */
    let Y = [];
    /** @type {?} */
    let fontSize = 0;
    /** @type {?} */
    let svgSize = 0;
    /** @type {?} */
    let num = PROP_EXISTS(canvasStyles, 'font.replace') && canvasStyles.font.replace(/[^0-9]/g, '');
    if (/[0-9]/g.test(num)) {
        fontSize = parseFloat(num);
        svgSize = (widthZoom || 1) * fontSize;
        if (Number.isNaN(svgSize)) {
            svgSize = fontSize;
        }
    }
    /** @type {?} */
    const points = code.location;
    /** @type {?} */
    const drawFrame = (begin, end, j) => {
        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        for (let key in canvasStyles) {
            (/** @type {?} */ (ctx))[key] = (/** @type {?} */ (canvasStyles))[key];
        }
        ctx.stroke();
        /** @type {?} */
        const xj = PROP_EXISTS(begin, 'x') ? begin.x : 0;
        /** @type {?} */
        const yj = PROP_EXISTS(begin, 'y') ? begin.y : 0;
        loc[`x${j + 1}`] = xj;
        loc[`y${j + 1}`] = yj;
        X.push(xj);
        Y.push(yj);
    };
    drawFrame(points.topLeftCorner, points.topRightCorner, 0);
    drawFrame(points.topRightCorner, points.bottomRightCorner, 1);
    drawFrame(points.bottomRightCorner, points.bottomLeftCorner, 2);
    drawFrame(points.bottomLeftCorner, points.topLeftCorner, 3);
    /** @type {?} */
    let maxX = Math.max(...X);
    /** @type {?} */
    let minX = Math.min(...X);
    /** @type {?} */
    let maxY = Math.max(...Y);
    /** @type {?} */
    let minY = Math.min(...Y);
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
    for (const key in canvasStyles) {
        (/** @type {?} */ (ctx))[key] = (/** @type {?} */ (canvasStyles))[key];
    }
    /** @type {?} */
    const polygon = [];
    for (let k = 0; k < X.length; k++) {
        polygon.push((loc[`x${k + 1}`] - minX) * heightZoom);
        polygon.push((loc[`y${k + 1}`] - minY) * widthZoom);
    }
    /** @type {?} */
    const shape = /** @type {?} */ (polygon.slice(0));
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
        const qrcodeTooltipTemp = document.createElement('div');
        qrcodeTooltipTemp.setAttribute('class', 'qrcode-tooltip-temp');
        qrcodeTooltipTemp.innerText = code.data;
        /** @type {?} */
        const xmlString = `<?xml version="1.0" encoding="utf-8"?><svg version="1.1" class="qrcode-tooltip-clipboard" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${svgSize}" height="${svgSize}" x="0px" y="0px" viewBox="0 0 115.77 122.88" xml:space="preserve"><g><path d="M89.62,13.96v7.73h12.19h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02v0.02 v73.27v0.01h-0.02c-0.01,3.84-1.57,7.33-4.1,9.86c-2.51,2.5-5.98,4.06-9.82,4.07v0.02h-0.02h-61.7H40.1v-0.02 c-3.84-0.01-7.34-1.57-9.86-4.1c-2.5-2.51-4.06-5.98-4.07-9.82h-0.02v-0.02V92.51H13.96h-0.01v-0.02c-3.84-0.01-7.34-1.57-9.86-4.1 c-2.5-2.51-4.06-5.98-4.07-9.82H0v-0.02V13.96v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07V0h0.02h61.7 h0.01v0.02c3.85,0.01,7.34,1.57,9.86,4.1c2.5,2.51,4.06,5.98,4.07,9.82h0.02V13.96L89.62,13.96z M79.04,21.69v-7.73v-0.02h0.02 c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v64.59v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h12.19V35.65 v-0.01h0.02c0.01-3.85,1.58-7.34,4.1-9.86c2.51-2.5,5.98-4.06,9.82-4.07v-0.02h0.02H79.04L79.04,21.69z M105.18,108.92V35.65v-0.02 h0.02c0-0.91-0.39-1.75-1.01-2.37c-0.61-0.61-1.46-1-2.37-1v0.02h-0.01h-61.7h-0.02v-0.02c-0.91,0-1.75,0.39-2.37,1.01 c-0.61,0.61-1,1.46-1,2.37h0.02v0.01v73.27v0.02h-0.02c0,0.91,0.39,1.75,1.01,2.37c0.61,0.61,1.46,1,2.37,1v-0.02h0.01h61.7h0.02 v0.02c0.91,0,1.75-0.39,2.37-1.01c0.61-0.61,1-1.46,1-2.37h-0.02V108.92L105.18,108.92z"></path></g></svg> `;
        /** @type {?} */
        const xmlDom = new DOMParser().parseFromString(xmlString, 'application/xml');
        /** @type {?} */
        const svgDom = qrcodeTooltipTemp.ownerDocument.importNode(xmlDom.documentElement, true);
        qrcodeTooltipTemp.appendChild(svgDom);
        svgDom.addEventListener("click", () => window.navigator['clipboard'].writeText(code.data));
        /** @type {?} */
        const qrcodeTooltip = document.createElement('div');
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
        const resultText = document.createElement('span');
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
const DRAW_RESULT_ON_CANVAS = (code, cvs, canvasStyles) => {
    /** @type {?} */
    let ctx = /** @type {?} */ (cvs.getContext('2d', { willReadFrequently: true }));
    /** @type {?} */
    let loc = {};
    /** @type {?} */
    let X = [];
    /** @type {?} */
    let Y = [];
    /** @type {?} */
    const points = code.location;
    /** @type {?} */
    const drawFrame = (begin, end, j) => {
        ctx.beginPath();
        ctx.moveTo(begin.x, begin.y);
        ctx.lineTo(end.x, end.y);
        for (let key in canvasStyles) {
            (/** @type {?} */ (ctx))[key] = (/** @type {?} */ (canvasStyles))[key];
        }
        ctx.stroke();
        /** @type {?} */
        const xj = PROP_EXISTS(begin, 'x') ? begin.x : 0;
        /** @type {?} */
        const yj = PROP_EXISTS(begin, 'y') ? begin.y : 0;
        loc[`x${j + 1}`] = xj;
        loc[`y${j + 1}`] = yj;
        X.push(xj);
        Y.push(yj);
    };
    drawFrame(points.topLeftCorner, points.topRightCorner, 0);
    drawFrame(points.topRightCorner, points.bottomRightCorner, 1);
    drawFrame(points.bottomRightCorner, points.bottomLeftCorner, 2);
    drawFrame(points.bottomLeftCorner, points.topLeftCorner, 3);
    /** @type {?} */
    let minX = Math.min(...X);
    /** @type {?} */
    let minY = Math.min(...Y);
    // Style for canvas
    for (const key in canvasStyles) {
        (/** @type {?} */ (ctx))[key] = (/** @type {?} */ (canvasStyles))[key];
    }
    ctx.font = canvasStyles && canvasStyles.font ? canvasStyles.font : `15px serif`;
    FILL_TEXT_MULTI_LINE(ctx, code.data, minX, minY - 5);
    /** @type {?} */
    const polygon = [];
    for (let k = 0; k < X.length; k++) {
        polygon.push(loc[`x${k + 1}`]);
        polygon.push(loc[`y${k + 1}`]);
    }
    /** @type {?} */
    const shape = /** @type {?} */ (polygon.slice(0));
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
const READ_AS_DATA_URL = (file, configs) => {
    /** *
     * overrides *
      @type {?} */
    let canvasStyles = (configs && configs.canvasStyles) ? configs.canvasStyles : CONFIG_DEFAULT.canvasStyles;
    /** @type {?} */
    let isBeep = (configs && configs.isBeep) ? configs.isBeep : CONFIG_DEFAULT.isBeep;
    /** drawImage **/
    return new Promise((resolve, reject) => {
        /** @type {?} */
        const fileReader = new FileReader();
        fileReader.onload = () => {
            /** @type {?} */
            const objectFile = {
                name: file.name,
                file: file,
                url: URL.createObjectURL(file)
            };
            /** @type {?} */
            const image = new Image();
            // Setting cross origin value to anonymous
            image.setAttribute('crossOrigin', 'anonymous');
            // When our image has loaded.
            image.onload = () => __awaiter(this, void 0, void 0, function* () {
                /** @type {?} */
                const canvas = document.createElement('canvas');
                // HTMLImageElement size
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;
                /** @type {?} */
                const ctx = /** @type {?} */ (canvas.getContext('2d'));
                // Draw image
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                /** @type {?} */
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                /** @type {?} */
                const code = /** @type {?} */ (jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                }));
                if (code && code.data !== '') {
                    // Overlay
                    DRAW_RESULT_ON_CANVAS(code, canvas, canvasStyles);
                    /** @type {?} */
                    const blob = yield CANVAS_TO_BLOB(canvas);
                    /** @type {?} */
                    const url = URL.createObjectURL(blob);
                    /** @type {?} */
                    const blobToFile = (theBlob, fileName) => new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
                    resolve(Object.assign({}, objectFile, { data: code, url: url, canvas: canvas, file: blobToFile(blob, objectFile.name) }));
                    PLAY_AUDIO(isBeep);
                }
                else {
                    resolve(Object.assign({}, objectFile, { data: code, canvas: canvas }));
                }
            });
            // Set src
            image.src = objectFile.url;
        };
        fileReader.onerror = (error) => reject(error);
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
const CANVAS_TO_BLOB = (canvas, type) => {
    return new Promise((resolve, reject) => canvas.toBlob(blob => resolve(blob), type));
};
/** *
 * Convert blob to file
 * \@param theBlob
 * \@param fileName
 * \@return File
  @type {?} */
const BLOB_TO_FILE = (theBlob, fileName) => {
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
};
/** *
 * FILES_TO_SCAN
 * \@param files
 * \@param configs
 * \@param as
 * \@return
  @type {?} */
const FILES_TO_SCAN = (files = [], configs, as = new AsyncSubject()) => {
    Promise.all(Object.assign([], files).map(m => READ_AS_DATA_URL(m, configs))).then((img) => {
        AS_COMPLETE(as, img);
    }).catch((error) => AS_COMPLETE(as, null, error));
    return as;
};
/** *
 * FILL_TEXT_MULTI_LINE
 * \@param ctx
 * \@param text
 * \@param x
 * \@param y
  @type {?} */
const FILL_TEXT_MULTI_LINE = (ctx, text, x, y) => {
    /** @type {?} */
    let lineHeight = ctx.measureText("M").width * 1.2;
    /** @type {?} */
    let lines = text.split("\n");
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
const COMPRESS_IMAGE = (files, quality, type) => __awaiter(this, void 0, void 0, function* () {
    // No files selected
    if (!files.length)
        return;
    /** @type {?} */
    const compressImage = (file) => __awaiter(this, void 0, void 0, function* () {
        /** @type {?} */
        const imageBitmap = yield createImageBitmap(file);
        /** @type {?} */
        const canvas = document.createElement('canvas');
        canvas.width = imageBitmap.width;
        canvas.height = imageBitmap.height;
        /** @type {?} */
        const ctx = canvas.getContext('2d');
        (/** @type {?} */ (ctx)).drawImage(imageBitmap, 0, 0);
        /** @type {?} */
        const blob = /** @type {?} */ (yield new Promise((resolve) => canvas.toBlob(resolve, type, quality)));
        // Turn Blob into File
        return new File([blob], file.name, {
            type: blob.type,
        });
    });
    /** @type {?} */
    const dataTransfer = new DataTransfer();
    // For every file in the files list
    for (const file of files) {
        // We don't have to compress files that aren't images
        if (!file.type.startsWith('image')) {
            // Ignore this file, but do add it to our result
            dataTransfer.items.add(file);
            continue;
        }
        /** @type {?} */
        const compressedFile = yield compressImage(file);
        // Save back the compressed file instead of the original file
        dataTransfer.items.add(compressedFile);
    }
    // return value new files list
    return dataTransfer.files;
});
/** *
 * REMOVE_CANVAS
 * \@param element
  @type {?} */
const REMOVE_CANVAS = (element) => {
    Object.assign([], element.childNodes).forEach(el => element.removeChild(el));
};
/** *
 * VIBRATE
 * Bật rung trên mobile
 * \@param time
  @type {?} */
const VIBRATE = (time = 300) => {
    time && IS_MOBILE() && window.navigator.vibrate(time);
};
/** *
 * IS_MOBILE
 * \@return
  @type {?} */
const IS_MOBILE = () => {
    /** @type {?} */
    const vendor = navigator.userAgent || navigator['vendor'] || (/** @type {?} */ (window))['opera'];
    /** @type {?} */
    const phone = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i;
    /** @type {?} */
    const version = /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i;
    /** @type {?} */
    const isSafari = /^((?!chrome|android).)*safari/i;
    return !!(phone.test(vendor) || version.test(vendor.substr(0, 4))) && !isSafari.test(vendor);
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxScannerQrcodeSingleService {
    /**
     * loadFiles
     * @param {?=} files
     * @param {?=} quality
     * @param {?=} type
     * @return {?}
     */
    loadFiles(files = [], quality = 0.5, type = 'image/jpeg') {
        /** @type {?} */
        const as = new AsyncSubject();
        COMPRESS_IMAGE(files, quality, type).then((_files) => {
            Promise.all(Object.assign([], _files).map((m) => this.readAsDataURL(m))).then((img) => AS_COMPLETE(as, img)).catch((error) => AS_COMPLETE(as, null, error));
        }).catch(error => {
            AS_COMPLETE(as, null, /** @type {?} */ (error));
        });
        return as;
    }
    /**
     * loadFilesToScan
     * @param {?=} files
     * @param {?=} config
     * @param {?=} quality
     * @param {?=} type
     * @return {?}
     */
    loadFilesToScan(files = [], config, quality = 0.5, type = 'image/jpeg') {
        /** @type {?} */
        const as = new AsyncSubject();
        COMPRESS_IMAGE(files, quality, type).then((_files) => {
            FILES_TO_SCAN(_files, config, as);
        }).catch(error => {
            AS_COMPLETE(as, null, /** @type {?} */ (error));
        });
        return as;
    }
    /**
     * readAsDataURL
     * @param {?} file
     * @return {?} Promise
     */
    readAsDataURL(file) {
        /** drawImage **/
        return new Promise((resolve, reject) => {
            /** @type {?} */
            const fileReader = new FileReader();
            fileReader.onload = () => {
                /** @type {?} */
                const objectFile = {
                    name: file.name,
                    file: file,
                    url: URL.createObjectURL(file)
                };
                resolve(objectFile);
            };
            fileReader.onerror = (error) => reject(error);
            fileReader.readAsDataURL(file);
        });
    }
}
NgxScannerQrcodeSingleService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */ NgxScannerQrcodeSingleService.ngInjectableDef = defineInjectable({ factory: function NgxScannerQrcodeSingleService_Factory() { return new NgxScannerQrcodeSingleService(); }, token: NgxScannerQrcodeSingleService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxScannerQrcodeSingleComponent {
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
        imageCapture.getPhotoCapabilities().then(() => __awaiter(this, void 0, void 0, function* () {
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
        const run = () => __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
class NgxScannerQrcodeSingleModule {
}
NgxScannerQrcodeSingleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NgxScannerQrcodeSingleComponent],
                exports: [NgxScannerQrcodeSingleComponent],
                providers: [NgxScannerQrcodeSingleService],
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { NgxScannerQrcodeSingleService, NgxScannerQrcodeSingleComponent, NgxScannerQrcodeSingleModule };

//# sourceMappingURL=ngx-scanner-qrcode-single.js.map