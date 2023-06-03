/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import jsQR from "jsqr";
import { AsyncSubject } from "rxjs";
import { CONFIG_DEFAULT } from "./ngx-scanner-qrcode-single.default";
/** *
 * PROP_EXISTS
 * \@param obj
 * \@param path
 * \@return
  @type {?} */
export const PROP_EXISTS = (obj, path) => {
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
export const OVERRIDES = (variableKey, config, defaultConfig) => {
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
export const AS_COMPLETE = (as, data, error) => {
    error ? as.error(error) : as.next(data);
    as.complete();
};
/** *
 * CAMERA_BEEP
 * \@param isPlay
 * \@return
  @type {?} */
export const PLAY_AUDIO = (isPlay = false) => {
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
                if (e.name === "NotAllowedError" || e.name === "NotSupportedError") {
                    // console.log(e.name);
                }
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
export const DRAW_RESULT_APPEND_CHILD = (code, oriCanvas, elTarget, canvasStyles) => {
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
export const DRAW_RESULT_ON_CANVAS = (code, cvs, canvasStyles) => {
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
export const READ_AS_DATA_URL = (file, configs) => {
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
            image.onload = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
export const CANVAS_TO_BLOB = (canvas, type) => {
    return new Promise((resolve, reject) => canvas.toBlob(blob => resolve(blob), type));
};
/** *
 * Convert blob to file
 * \@param theBlob
 * \@param fileName
 * \@return File
  @type {?} */
export const BLOB_TO_FILE = (theBlob, fileName) => {
    return new File([theBlob], fileName, { lastModified: new Date().getTime(), type: theBlob.type });
};
/** *
 * FILES_TO_SCAN
 * \@param files
 * \@param configs
 * \@param as
 * \@return
  @type {?} */
export const FILES_TO_SCAN = (files = [], configs, as = new AsyncSubject()) => {
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
export const FILL_TEXT_MULTI_LINE = (ctx, text, x, y) => {
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
export const COMPRESS_IMAGE = (files, quality, type) => tslib_1.__awaiter(this, void 0, void 0, function* () {
    // No files selected
    if (!files.length)
        return;
    /** @type {?} */
    const compressImage = (file) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
export const REMOVE_CANVAS = (element) => {
    Object.assign([], element.childNodes).forEach(el => element.removeChild(el));
};
/** *
 * VIBRATE
 * Bật rung trên mobile
 * \@param time
  @type {?} */
export const VIBRATE = (time = 300) => {
    time && IS_MOBILE() && window.navigator.vibrate(time);
};
/** *
 * IS_MOBILE
 * \@return
  @type {?} */
export const IS_MOBILE = () => {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5oZWxwZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLyIsInNvdXJjZXMiOlsibGliL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDcEMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFDQUFxQyxDQUFDOzs7Ozs7O0FBU3JFLGFBQWEsV0FBVyxHQUFHLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxFQUFFO0lBQ3BELE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1FBQzFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7S0FDbkQsRUFBRSxHQUFHLENBQUMsQ0FBQztDQUNULENBQUM7Ozs7Ozs7O0FBU0YsYUFBYSxTQUFTLEdBQUcsQ0FBQyxXQUFtQixFQUFFLE1BQVcsRUFBRSxhQUFrQixFQUFFLEVBQUU7SUFDaEYsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUU7UUFDckQsS0FBSyxNQUFNLEdBQUcsSUFBSSxhQUFhLEVBQUU7O1lBQy9CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsbUJBQU0sTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxtQkFBQyxhQUFv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R0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7O0lBQzFCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzs7SUFHMUIsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzs7SUFHNUMsSUFBSSxVQUFVLEdBQUcsVUFBVSxFQUFFO1FBQzNCLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxVQUFVLEdBQUcsQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDckYsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDekMsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDdEMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7S0FDeEM7U0FBTTtRQUNMLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksR0FBRyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3pDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxTQUFTLEdBQUcsQ0FBQyxRQUFRLEdBQUcsU0FBUyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUM7UUFDckYsR0FBRyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDdkMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUM7S0FDekM7O0lBR0QsS0FBSyxNQUFNLEdBQUcsSUFBSSxZQUFZLEVBQUU7UUFDOUIsbUJBQUMsR0FBVSxFQUFDLENBQUMs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QyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDOUUsQ0FBQTs7Ozs7O0FBT0QsYUFBYSxPQUFPLEdBQUcsQ0FBQyxPQUFlLEdBQUcsRUFBRSxFQUFFO0lBQzVDLElBQUksSUFBSSxTQUFTLEVBQUUsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztDQUN2RCxDQUFDOzs7OztBQU1GLGFBQWEsU0FBUyxHQUFHLEdBQUcsRUFBRTs7SUFDNUIsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLFNBQVMsSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksbUJBQUMsTUFBYSxFQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0lBQ3RGLE1BQU0sS0FBSyxHQUFHLHFWQUFxVixDQUFDOztJQUNwVyxNQUFNLE9BQU8sR0FBRywyaERBQTJoRCxDQUFDOztJQUM1aUQsTUFBTSxRQUFRLEdBQUcsZ0NBQWdDLENBQUM7SUFDbEQsT0FBTyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztDQUM5RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGpzUVIgZnJvbSBcImpzcXJcIjtcclxuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcclxuaW1wb3J0IHsgQ09ORklHX0RFRkFVTFQgfSBmcm9tIFwiLi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLmRlZmF1bHRcIjtcclxuaW1wb3J0IHsgUG9pbnQsIFNjYW5uZXJRUkNvZGVDb25maWcsIFNjYW5uZXJRUkNvZGVSZXN1bHQsIFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzIH0gZnJvbSBcIi4vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5vcHRpb25zXCI7XHJcblxyXG4vKipcclxuICogUFJPUF9FWElTVFNcclxuICogQHBhcmFtIG9iaiBcclxuICogQHBhcmFtIHBhdGggXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBST1BfRVhJU1RTID0gKG9iajogYW55LCBwYXRoOiBzdHJpbmcpID0+IHtcclxuICByZXR1cm4gISFwYXRoLnNwbGl0KFwiLlwiKS5yZWR1Y2UoKG9iaiwgcHJvcCkgPT4ge1xyXG4gICAgICByZXR1cm4gb2JqICYmIG9ialtwcm9wXSA/IG9ialtwcm9wXSA6IHVuZGVmaW5lZDtcclxuICB9LCBvYmopO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIE9WRVJSSURFU1xyXG4gKiBAcGFyYW0gdmFyaWFibGVLZXkgXHJcbiAqIEBwYXJhbSBjb25maWcgXHJcbiAqIEBwYXJhbSBkZWZhdWx0Q29uZmlnIFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBPVkVSUklERVMgPSAodmFyaWFibGVLZXk6IHN0cmluZywgY29uZmlnOiBhbnksIGRlZmF1bHRDb25maWc6IGFueSkgPT4ge1xyXG4gIGlmIChjb25maWcgJiYgT2JqZWN0LmtleXMoY29uZmlnW3ZhcmlhYmxlS2V5XSkubGVuZ3RoKSB7XHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBkZWZhdWx0Q29uZmlnKSB7XHJcbiAgICAgIGNvbnN0IGNsb25lRGVlcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoeyAuLi5jb25maWdbdmFyaWFibGVLZXldLCAuLi57IFtrZXldOiAoZGVmYXVsdENvbmZpZyBhcyBhbnkpW2tleV0gfSB9KSk7XHJcbiAgICAgIGNvbmZpZ1t2YXJpYWJsZUtleV0gPSBjb25maWdbdmFyaWFibGVLZXldICYmIGNvbmZpZ1t2YXJpYWJsZUtleV0uaGFzT3duUHJvcGVydHkoa2V5KSA/IGNvbmZpZ1t2YXJpYWJsZUtleV0gOiBjbG9uZURlZXA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29uZmlnW3ZhcmlhYmxlS2V5XTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGRlZmF1bHRDb25maWc7XHJcbiAgfVxyXG59O1xyXG5cclxuLyoqXHJcbiAqIFJ4anMgY29tcGxldGVcclxuICogQHBhcmFtIGFzXHJcbiAqIEBwYXJhbSBkYXRhXHJcbiAqIEBwYXJhbSBlcnJvclxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEFTX0NPTVBMRVRFID0gKGFzOiBBc3luY1N1YmplY3Q8YW55PiwgZGF0YTogYW55LCBlcnJvcj86IGFueSkgPT4ge1xyXG4gIGVycm9yID8gYXMuZXJyb3IoZXJyb3IpIDogYXMubmV4dChkYXRhKTtcclxuICBhcy5jb21wbGV0ZSgpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIENBTUVSQV9CRUVQXHJcbiAqIEBwYXJhbSBpc1BsYXkgXHJcbiAqIEByZXR1cm5zIFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFBMQVlfQVVESU8gPSAoaXNQbGF5OiBib29sZWFuID0gZmFsc2UpID0+IHtcclxuICBpZiAoaXNQbGF5ID09PSBmYWxzZSkgcmV0dXJuO1xyXG4gIGNvbnN0IGF1ZGlvID0gbmV3IEF1ZGlvKCdkYXRhOmF1ZGlvL3dhdjtiYXNlNjQsVWtsR1JsOXZUMTlYUVZaRlptMTBJQkFBQUFBQkFBRUFRQjhBQUVBZkFBQUJBQWdBWkdGMFlVJyArIEFycmF5KDMwMCkuam9pbignMTAxJykpO1xyXG4gIC8vIHdoZW4gdGhlIHNvdW5kIGhhcyBiZWVuIGxvYWRlZCwgZXhlY3V0ZSB5b3VyIGNvZGVcclxuICBhdWRpby5vbmNhbnBsYXl0aHJvdWdoID0gKCkgPT4ge1xyXG4gICAgY29uc3QgcHJvbWlzZSA9IGF1ZGlvLnBsYXkoKTtcclxuICAgIGlmIChwcm9taXNlKSB7XHJcbiAgICAgIHByb21pc2UuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICBpZiAoZS5uYW1lID09PSBcIk5vdEFsbG93ZWRFcnJvclwiIHx8IGUubmFtZSA9PT0gXCJOb3RTdXBwb3J0ZWRFcnJvclwiKSB7XHJcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTERcclxuICogQHBhcmFtIGNvZGUgXHJcbiAqIEBwYXJhbSBvcmlDYW52YXMgXHJcbiAqIEBwYXJhbSBlbFRhcmdldCBcclxuICogQHBhcmFtIGNhbnZhc1N0eWxlcyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBEUkFXX1JFU1VMVF9BUFBFTkRfQ0hJTEQgPSAoY29kZTogU2Nhbm5lclFSQ29kZVJlc3VsdCwgb3JpQ2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgZWxUYXJnZXQ6IEhUTUxDYW52YXNFbGVtZW50IHwgSFRNTERpdkVsZW1lbnQsIGNhbnZhc1N0eWxlczogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEKSA9PiB7XHJcbiAgbGV0IHdpZHRoWm9vbTtcclxuICBsZXQgaGVpZ2h0Wm9vbTtcclxuICBsZXQgb3JpV2lkdGggPSBvcmlDYW52YXMud2lkdGg7XHJcbiAgbGV0IG9yaUhlaWdodCA9IG9yaUNhbnZhcy5oZWlnaHQ7XHJcbiAgbGV0IG9yaVdIUmF0aW8gPSBvcmlXaWR0aCAvIG9yaUhlaWdodDtcclxuICBsZXQgaW1nV2lkdGggPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG9yaUNhbnZhcykud2lkdGgpO1xyXG4gIGxldCBpbWdIZWlnaHQgPSBwYXJzZUludChnZXRDb21wdXRlZFN0eWxlKG9yaUNhbnZhcykuaGVpZ2h0KTtcclxuICBsZXQgaW1nV0hSYXRpbyA9IGltZ1dpZHRoIC8gaW1nSGVpZ2h0O1xyXG4gIGVsVGFyZ2V0LmlubmVySFRNTCA9ICcnO1xyXG5cclxuICBpZiAob3JpV0hSYXRpbyA+IGltZ1dIUmF0aW8pIHtcclxuICAgIHdpZHRoWm9vbSA9IGltZ1dpZHRoIC8gb3JpV2lkdGg7XHJcbiAgICBoZWlnaHRab29tID0gaW1nV2lkdGggLyBvcmlXSFJhdGlvIC8gb3JpSGVpZ2h0O1xyXG4gIH0gZWxzZSB7XHJcbiAgICBoZWlnaHRab29tID0gaW1nSGVpZ2h0IC8gb3JpSGVpZ2h0O1xyXG4gICAgd2lkdGhab29tID0gKGltZ0hlaWdodCAqIG9yaVdIUmF0aW8pIC8gb3JpV2lkdGg7XHJcbiAgfVxyXG5cclxuICAvLyBOZXcgY2FudmFzXHJcbiAgbGV0IGN2cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XHJcbiAgbGV0IGN0eCA9IGN2cy5nZXRDb250ZXh0KCcyZCcsIHsgd2lsbFJlYWRGcmVxdWVudGx5OiB0cnVlIH0pIGFzIENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcclxuICBsZXQgbG9jOiBhbnkgPSB7fTtcclxuICBsZXQgWDogYW55ID0gW107XHJcbiAgbGV0IFk6IGFueSA9IFtdO1xyXG4gIGxldCBmb250U2l6ZSA9IDA7XHJcbiAgbGV0IHN2Z1NpemUgPSAwO1xyXG5cclxuICBsZXQgbnVtID0gUFJPUF9FWElTVFMoY2FudmFzU3R5bGVzLCdmb250LnJlcGxhY2UnKSAmJiBjYW52YXNTdHlsZXMuZm9udC5yZXBsYWNlKC9bXjAtOV0vZywgJycpO1xyXG4gIGlmICgvWzAtOV0vZy50ZXN0KG51bSkpIHtcclxuICAgIGZvbnRTaXplID0gcGFyc2VGbG9hdChudW0pO1xyXG4gICAgc3ZnU2l6ZSA9ICh3aWR0aFpvb20gfHwgMSkgKiBmb250U2l6ZTtcclxuICAgIGlmIChOdW1iZXIuaXNOYU4oc3ZnU2l6ZSkpIHtcclxuICAgICAgc3ZnU2l6ZSA9IGZvbnRTaXplO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLy8gUG9pbnQgeCx5XHJcbiAgY29uc3QgcG9pbnRzID0gY29kZS5sb2NhdGlvbjtcclxuICBjb25zdCBkcmF3RnJhbWUgPSAoYmVnaW46IFBvaW50LCBlbmQ6IFBvaW50LCBqOiBudW1iZXIpID0+IHtcclxuICAgIGN0eC5iZWdpblBhdGgoKTtcclxuICAgIGN0eC5tb3ZlVG8oYmVnaW4ueCwgYmVnaW4ueSk7XHJcbiAgICBjdHgubGluZVRvKGVuZC54LCBlbmQueSk7XHJcbiAgICBmb3IgKGxldCBrZXkgaW4gY2FudmFzU3R5bGVzKSB7XHJcbiAgICAgIChjdHggYXMgYW55KVtrZXldID0gKGNhbnZhc1N0eWxlcyBhcyBhbnkpW2tleV07XHJcbiAgICB9XHJcbiAgICBjdHguc3Ryb2tlKCk7XHJcbiAgICBjb25zdCB4aiA9IFBST1BfRVhJU1RTKGJlZ2luLCd4JykgPyBiZWdpbi54IDogMDtcclxuICAgIGNvbnN0IHlqID0gUFJPUF9FWElTVFMoYmVnaW4sJ3knKSA/IGJlZ2luLnkgOiAwO1xyXG4gICAgbG9jW2B4JHtqICsgMX1gXSA9IHhqO1xyXG4gICAgbG9jW2B5JHtqICsgMX1gXSA9IHlqO1xyXG4gICAgWC5wdXNoKHhqKTtcclxuICAgIFkucHVzaCh5aik7XHJcbiAgfTtcclxuICBkcmF3RnJhbWUocG9pbnRzLnRvcExlZnRDb3JuZXIsIHBvaW50cy50b3BSaWdodENvcm5lciwgMCk7XHJcbiAgZHJhd0ZyYW1lKHBvaW50cy50b3BSaWdodENvcm5lciwgcG9pbnRzLmJvdHRvbVJpZ2h0Q29ybmVyLCAxKTtcclxuICBkcmF3RnJhbWUocG9pbnRzLmJvdHRvbVJpZ2h0Q29ybmVyLCBwb2ludHMuYm90dG9tTGVmdENvcm5lciwgMik7XHJcbiAgZHJhd0ZyYW1lKHBvaW50cy5ib3R0b21MZWZ0Q29ybmVyLCBwb2ludHMudG9wTGVmdENvcm5lciwgMyk7XHJcblxyXG4gIC8vIE1pbiBtYXhcclxuICBsZXQgbWF4WCA9IE1hdGgubWF4KC4uLlgpO1xyXG4gIGxldCBtaW5YID0gTWF0aC5taW4oLi4uWCk7XHJcbiAgbGV0IG1heFkgPSBNYXRoLm1heCguLi5ZKTtcclxuICBsZXQgbWluWSA9IE1hdGgubWluKC4uLlkpO1xyXG5cclxuICAvLyBBZGQgY2xhc3NcclxuICBjdnMuc2V0QXR0cmlidXRlKCdjbGFzcycsICdxcmNvZGUtcG9seWdvbicpO1xyXG5cclxuICAvLyBTaXplIHdpdGggc2NyZWVuIHpvb21cclxuICBpZiAob3JpV0hSYXRpbyA+IGltZ1dIUmF0aW8pIHtcclxuICAgIGN2cy5zdHlsZS50b3AgPSBtaW5ZICogaGVpZ2h0Wm9vbSArIChpbWdIZWlnaHQgLSBpbWdXaWR0aCAvIG9yaVdIUmF0aW8pICogMC41ICsgXCJweFwiO1xyXG4gICAgY3ZzLnN0eWxlLmxlZnQgPSBtaW5YICogd2lkdGhab29tICsgXCJweFwiO1xyXG4gICAgY3ZzLndpZHRoID0gKG1heFggLSBtaW5YKSAqIHdpZHRoWm9vbTtcclxuICAgIGN2cy5oZWlnaHQgPSAobWF4WSAtIG1pblkpICogd2lkdGhab29tO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjdnMuc3R5bGUudG9wID0gbWluWSAqIGhlaWdodFpvb20gKyBcInB4XCI7XHJcbiAgICBjdnMuc3R5bGUubGVmdCA9IG1pblggKiB3aWR0aFpvb20gKyAoaW1nV2lkdGggLSBpbWdIZWlnaHQgKiBvcmlXSFJhdGlvKSAqIDAuNSArIFwicHhcIjtcclxuICAgIGN2cy53aWR0aCA9IChtYXhYIC0gbWluWCkgKiBoZWlnaHRab29tO1xyXG4gICAgY3ZzLmhlaWdodCA9IChtYXhZIC0gbWluWSkgKiBoZWlnaHRab29tO1xyXG4gIH1cclxuXHJcbiAgLy8gU3R5bGUgZm9yIGNhbnZhc1xyXG4gIGZvciAoY29uc3Qga2V5IGluIGNhbnZhc1N0eWxlcykge1xyXG4gICAgKGN0eCBhcyBhbnkpW2tleV0gPSAoY2FudmFzU3R5bGVzIGFzIGFueSlba2V5XTtcclxuICB9XHJcblxyXG4gIC8vIHBvbHlnb24gW3gseSwgeCx5LCB4LHkuLi4uLl07XHJcbiAgY29uc3QgcG9seWdvbiA9IFtdO1xyXG4gIGZvciAobGV0IGsgPSAwOyBrIDwgWC5sZW5ndGg7IGsrKykge1xyXG4gICAgcG9seWdvbi5wdXNoKChsb2NbYHgke2sgKyAxfWBdIC0gbWluWCkgKiBoZWlnaHRab29tKTtcclxuICAgIHBvbHlnb24ucHVzaCgobG9jW2B5JHtrICsgMX1gXSAtIG1pblkpICogd2lkdGhab29tKTtcclxuICB9XHJcblxyXG4gIC8vIENvcHkgYXJyYXlcclxuICBjb25zdCBzaGFwZSA9IHBvbHlnb24uc2xpY2UoMCkgYXMgYW55O1xyXG5cclxuICAvLyBEcmF3IHBvbHlnb25cclxuICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgY3R4Lm1vdmVUbyhzaGFwZS5zaGlmdCgpLCBzaGFwZS5zaGlmdCgpKTtcclxuICB3aGlsZSAoc2hhcGUubGVuZ3RoKSB7XHJcbiAgICBjdHgubGluZVRvKHNoYXBlLnNoaWZ0KCksIHNoYXBlLnNoaWZ0KCkpOyAvL3gseVxyXG4gIH1cclxuICBjdHguY2xvc2VQYXRoKCk7XHJcbiAgY3R4LmZpbGwoKTtcclxuICBjdHguc3Ryb2tlKCk7XHJcblxyXG4gIGlmIChmb250U2l6ZSkge1xyXG4gICAgLy8gVG9vbHRpcCByZXN1bHRcclxuICAgIGNvbnN0IHFyY29kZVRvb2x0aXBUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBxcmNvZGVUb29sdGlwVGVtcC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3FyY29kZS10b29sdGlwLXRlbXAnKTtcclxuICAgIHFyY29kZVRvb2x0aXBUZW1wLmlubmVyVGV4dCA9IGNvZGUuZGF0YTtcclxuICAgIGNvbnN0IHhtbFN0cmluZyA9IGA8P3htbCB2ZXJzaW9uPVwiMS4wXCIgZW5jb2Rpbmc9XCJ1dGYtOFwiPz48c3ZnIHZlcnNpb249XCIxLjFcIiBjbGFzcz1cInFyY29kZS10b29sdGlwLWNsaXBib2FyZFwiIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB3aWR0aD1cIiR7c3ZnU2l6ZX1cIiBoZWlnaHQ9XCIke3N2Z1NpemV9XCIgeD1cIjBweFwiIHk9XCIwcHhcIiB2aWV3Qm94PVwiMCAwIDExNS43NyAxMjIuODhcIiB4bWw6c3BhY2U9XCJwcmVzZXJ2ZVwiPjxnPjxwYXRoIGQ9XCJNODkuNjIsMTMuOTZ2Ny43M2gxMi4xOWgwLjAxdjAuMDJjMy44NSwwLjAxLDcuMzQsMS41Nyw5Ljg2LDQuMWMyLjUsMi41MSw0LjA2LDUuOTgsNC4wNyw5LjgyaDAuMDJ2MC4wMiB2NzMuMjd2MC4wMWgtMC4wMmMtMC4wMSwzLjg0LTEuNTcsNy4zMy00LjEsOS44NmMtMi41MSwyLjUtNS45OCw0LjA2LTkuODIsNC4wN3YwLjAyaC0wLjAyaC02MS43SDQwLjF2LTAuMDIgYy0zLjg0LTAuMDEtNy4zNC0xLjU3LTkuODYtNC4xYy0yLjUtMi41MS00LjA2LTUuOTgtNC4wNy05LjgyaC0wLjAydi0wLjAyVjkyLjUxSDEzLjk2aC0wLjAxdi0wLjAyYy0zLjg0LTAuMDEtNy4zNC0xLjU3LTkuODYtNC4xIGMtMi41LTIuNTEtNC4wNi01Ljk4LTQuMDctOS44Mkgwdi0wLjAyVjEzLjk2di0wLjAxaDAuMDJjMC4wMS0zLjg1LDEuNTgtNy4zNCw0LjEtOS44NmMyLjUxLTIuNSw1Ljk4LTQuMDYsOS44Mi00LjA3VjBoMC4wMmg2MS43IGgwLjAxdjAuMDJjMy44NSwwLjAxLDcuMzQsMS41Nyw5Ljg2LDQuMWMyLjUsMi41MSw0LjA2LDUuOTgsNC4wNyw5LjgyaDAuMDJWMTMuOTZMODkuNjIsMTMuOTZ6IE03OS4wNCwyMS42OXYtNy43M3YtMC4wMmgwLjAyIGMwLTAuOTEtMC4zOS0xLjc1LTEuMDEtMi4zN2MtMC42MS0wLjYxLTEuNDYtMS0yLjM3LTF2MC4wMmgtMC4wMWgtNjEuN2gtMC4wMnYtMC4wMmMtMC45MSwwLTEuNzUsMC4zOS0yLjM3LDEuMDEgYy0wLjYxLDAuNjEtMSwxLjQ2LTEsMi4zN2gwLjAydjAuMDF2NjQuNTl2MC4wMmgtMC4wMmMwLDAuOTEsMC4zOSwxLjc1LDEuMDEsMi4zN2MwLjYxLDAuNjEsMS40NiwxLDIuMzcsMXYtMC4wMmgwLjAxaDEyLjE5VjM1LjY1IHYtMC4wMWgwLjAyYzAuMDEtMy44NSwxLjU4LTcuMzQsNC4xLTkuODZjMi41MS0yLjUsNS45OC00LjA2LDkuODItNC4wN3YtMC4wMmgwLjAySDc5LjA0TDc5LjA0LDIxLjY5eiBNMTA1LjE4LDEwOC45MlYzNS42NXYtMC4wMiBoMC4wMmMwLTAuOTEtMC4zOS0xLjc1LTEuMDEtMi4zN2MtMC42MS0wLjYxLTEuNDYtMS0yLjM3LTF2MC4wMmgtMC4wMWgtNjEuN2gtMC4wMnYtMC4wMmMtMC45MSwwLTEuNzUsMC4zOS0yLjM3LDEuMDEgYy0wLjYxLDAuNjEtMSwxLjQ2LTEsMi4zN2gwLjAydjAuMDF2NzMuMjd2MC4wMmgtMC4wMmMwLDAuOTEsMC4zOSwxLjc1LDEuMDEsMi4zN2MwLjYxLDAuNjEsMS40NiwxLDIuMzcsMXYtMC4wMmgwLjAxaDYxLjdoMC4wMiB2MC4wMmMwLjkxLDAsMS43NS0wLjM5LDIuMzctMS4wMWMwLjYxLTAuNjEsMS0xLjQ2LDEtMi4zN2gtMC4wMlYxMDguOTJMMTA1LjE4LDEwOC45MnpcIj48L3BhdGg+PC9nPjwvc3ZnPiBgO1xyXG4gICAgY29uc3QgeG1sRG9tID0gbmV3IERPTVBhcnNlcigpLnBhcnNlRnJvbVN0cmluZyh4bWxTdHJpbmcsICdhcHBsaWNhdGlvbi94bWwnKTtcclxuICAgIGNvbnN0IHN2Z0RvbSA9IHFyY29kZVRvb2x0aXBUZW1wLm93bmVyRG9jdW1lbnQuaW1wb3J0Tm9kZSh4bWxEb20uZG9jdW1lbnRFbGVtZW50LCB0cnVlKTtcclxuICAgIHFyY29kZVRvb2x0aXBUZW1wLmFwcGVuZENoaWxkKHN2Z0RvbSk7XHJcbiAgICBzdmdEb20uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHdpbmRvdy5uYXZpZ2F0b3JbJ2NsaXBib2FyZCddLndyaXRlVGV4dChjb2RlLmRhdGEpKTtcclxuXHJcbiAgICAvLyBUb29sdGlwIGJveFxyXG4gICAgY29uc3QgcXJjb2RlVG9vbHRpcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgcXJjb2RlVG9vbHRpcC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ3FyY29kZS10b29sdGlwJyk7XHJcbiAgICBxcmNvZGVUb29sdGlwLmFwcGVuZENoaWxkKHFyY29kZVRvb2x0aXBUZW1wKTtcclxuICAgIGhlaWdodFpvb20gPSBpbWdIZWlnaHQgLyBvcmlIZWlnaHQ7XHJcbiAgICB3aWR0aFpvb20gPSAoaW1nSGVpZ2h0ICogb3JpV0hSYXRpbykgLyBvcmlXaWR0aDtcclxuICAgIHFyY29kZVRvb2x0aXAuc3R5bGUuZm9udFNpemUgPSB3aWR0aFpvb20gKiBmb250U2l6ZSArICdweCc7XHJcbiAgICBxcmNvZGVUb29sdGlwLnN0eWxlLnRvcCA9IG1pblkgKiBoZWlnaHRab29tICsgXCJweFwiO1xyXG4gICAgcXJjb2RlVG9vbHRpcC5zdHlsZS5sZWZ0ID0gbWluWCAqIHdpZHRoWm9vbSArIChpbWdXaWR0aCAtIGltZ0hlaWdodCAqIG9yaVdIUmF0aW8pICogMC41ICsgXCJweFwiO1xyXG4gICAgcXJjb2RlVG9vbHRpcC5zdHlsZS53aWR0aCA9IChtYXhYIC0gbWluWCkgKiBoZWlnaHRab29tICsgXCJweFwiO1xyXG4gICAgcXJjb2RlVG9vbHRpcC5zdHlsZS5oZWlnaHQgPSAobWF4WSAtIG1pblkpICogaGVpZ2h0Wm9vbSArIFwicHhcIjtcclxuXHJcbiAgICAvLyBSZXN1bHQgdGV4dFxyXG4gICAgY29uc3QgcmVzdWx0VGV4dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcclxuICAgIHJlc3VsdFRleHQuaW5uZXJUZXh0ID0gY29kZS5kYXRhO1xyXG4gICAgcmVzdWx0VGV4dC5zdHlsZS5mb250U2l6ZSA9IHdpZHRoWm9vbSAqIGZvbnRTaXplICsgJ3B4JztcclxuXHJcbiAgICAvLyBTZXQgcG9zaXRpb24gcmVzdWx0IHRleHRcclxuICAgIHJlc3VsdFRleHQuc3R5bGUudG9wID0gbWluWSAqIGhlaWdodFpvb20gKyAoLTIwICogaGVpZ2h0Wm9vbSkgKyBcInB4XCI7XHJcbiAgICByZXN1bHRUZXh0LnN0eWxlLmxlZnQgPSBtaW5YICogd2lkdGhab29tICsgKGltZ1dpZHRoIC0gaW1nSGVpZ2h0ICogb3JpV0hSYXRpbykgKiAwLjUgKyBcInB4XCI7XHJcblxyXG4gICAgZWxUYXJnZXQgJiYgZWxUYXJnZXQuYXBwZW5kQ2hpbGQocXJjb2RlVG9vbHRpcCk7XHJcbiAgICBlbFRhcmdldCAmJiBlbFRhcmdldC5hcHBlbmRDaGlsZChyZXN1bHRUZXh0KTtcclxuICB9XHJcblxyXG4gIGVsVGFyZ2V0ICYmIGVsVGFyZ2V0LmFwcGVuZENoaWxkKGN2cyk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBEUkFXX1JFU1VMVF9PTl9DQU5WQVNcclxuICogQHBhcmFtIGNvZGUgXHJcbiAqIEBwYXJhbSBjdnMgXHJcbiAqIEBwYXJhbSBjYW52YXNTdHlsZXMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRFJBV19SRVNVTFRfT05fQ0FOVkFTID0gKGNvZGU6IFNjYW5uZXJRUkNvZGVSZXN1bHQsIGN2czogSFRNTENhbnZhc0VsZW1lbnQsIGNhbnZhc1N0eWxlcz86IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRCkgPT4ge1xyXG4gIGxldCBjdHggPSBjdnMuZ2V0Q29udGV4dCgnMmQnLCB7IHdpbGxSZWFkRnJlcXVlbnRseTogdHJ1ZSB9KSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcblxyXG4gIGxldCBsb2M6IGFueSA9IHt9O1xyXG4gIGxldCBYOiBhbnkgPSBbXTtcclxuICBsZXQgWTogYW55ID0gW107XHJcblxyXG4gIC8vIFBvaW50IHgseVxyXG4gIGNvbnN0IHBvaW50cyA9IGNvZGUubG9jYXRpb247XHJcbiAgY29uc3QgZHJhd0ZyYW1lID0gKGJlZ2luOiBQb2ludCwgZW5kOiBQb2ludCwgajogbnVtYmVyKSA9PiB7XHJcbiAgICBjdHguYmVnaW5QYXRoKCk7XHJcbiAgICBjdHgubW92ZVRvKGJlZ2luLngsIGJlZ2luLnkpO1xyXG4gICAgY3R4LmxpbmVUbyhlbmQueCwgZW5kLnkpO1xyXG4gICAgZm9yIChsZXQga2V5IGluIGNhbnZhc1N0eWxlcykge1xyXG4gICAgICAoY3R4IGFzIGFueSlba2V5XSA9IChjYW52YXNTdHlsZXMgYXMgYW55KVtrZXldO1xyXG4gICAgfVxyXG4gICAgY3R4LnN0cm9rZSgpO1xyXG4gICAgY29uc3QgeGogPSBQUk9QX0VYSVNUUyhiZWdpbiwneCcpID8gYmVnaW4ueCA6IDA7XHJcbiAgICBjb25zdCB5aiA9IFBST1BfRVhJU1RTKGJlZ2luLCd5JykgPyBiZWdpbi55IDogMDtcclxuICAgIGxvY1tgeCR7aiArIDF9YF0gPSB4ajtcclxuICAgIGxvY1tgeSR7aiArIDF9YF0gPSB5ajtcclxuICAgIFgucHVzaCh4aik7XHJcbiAgICBZLnB1c2goeWopO1xyXG4gIH07XHJcbiAgZHJhd0ZyYW1lKHBvaW50cy50b3BMZWZ0Q29ybmVyLCBwb2ludHMudG9wUmlnaHRDb3JuZXIsIDApO1xyXG4gIGRyYXdGcmFtZShwb2ludHMudG9wUmlnaHRDb3JuZXIsIHBvaW50cy5ib3R0b21SaWdodENvcm5lciwgMSk7XHJcbiAgZHJhd0ZyYW1lKHBvaW50cy5ib3R0b21SaWdodENvcm5lciwgcG9pbnRzLmJvdHRvbUxlZnRDb3JuZXIsIDIpO1xyXG4gIGRyYXdGcmFtZShwb2ludHMuYm90dG9tTGVmdENvcm5lciwgcG9pbnRzLnRvcExlZnRDb3JuZXIsIDMpO1xyXG5cclxuICAvLyBNaW4gbWF4XHJcbiAgbGV0IG1pblggPSBNYXRoLm1pbiguLi5YKTtcclxuICBsZXQgbWluWSA9IE1hdGgubWluKC4uLlkpO1xyXG5cclxuICAvLyBTdHlsZSBmb3IgY2FudmFzXHJcbiAgZm9yIChjb25zdCBrZXkgaW4gY2FudmFzU3R5bGVzKSB7XHJcbiAgICAoY3R4IGFzIGFueSlba2V5XSA9IChjYW52YXNTdHlsZXMgYXMgYW55KVtrZXldO1xyXG4gIH1cclxuICBjdHguZm9udCA9IGNhbnZhc1N0eWxlcyAmJiBjYW52YXNTdHlsZXMuZm9udCA/IGNhbnZhc1N0eWxlcy5mb250IDogYDE1cHggc2VyaWZgO1xyXG4gIEZJTExfVEVYVF9NVUxUSV9MSU5FKGN0eCwgY29kZS5kYXRhLCBtaW5YLCBtaW5ZIC0gNSk7XHJcblxyXG4gIC8vIHBvbHlnb24gW3gseSwgeCx5LCB4LHkuLi4uLl07XHJcbiAgY29uc3QgcG9seWdvbiA9IFtdO1xyXG4gIGZvciAobGV0IGsgPSAwOyBrIDwgWC5sZW5ndGg7IGsrKykge1xyXG4gICAgcG9seWdvbi5wdXNoKGxvY1tgeCR7ayArIDF9YF0pO1xyXG4gICAgcG9seWdvbi5wdXNoKGxvY1tgeSR7ayArIDF9YF0pO1xyXG4gIH1cclxuXHJcbiAgLy8gQ29weSBhcnJheVxyXG4gIGNvbnN0IHNoYXBlID0gcG9seWdvbi5zbGljZSgwKSBhcyBhbnk7XHJcblxyXG4gIC8vIERyYXcgcG9seWdvblxyXG4gIGN0eC5iZWdpblBhdGgoKTtcclxuICBjdHgubW92ZVRvKHNoYXBlLnNoaWZ0KCksIHNoYXBlLnNoaWZ0KCkpO1xyXG4gIHdoaWxlIChzaGFwZS5sZW5ndGgpIHtcclxuICAgIGN0eC5saW5lVG8oc2hhcGUuc2hpZnQoKSwgc2hhcGUuc2hpZnQoKSk7IC8veCx5XHJcbiAgfVxyXG4gIGN0eC5jbG9zZVBhdGgoKTtcclxuICBjdHguZmlsbCgpO1xyXG4gIGN0eC5zdHJva2UoKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJFQURfQVNfREFUQV9VUkxcclxuICogQHBhcmFtIGZpbGUgXHJcbiAqIEBwYXJhbSBjb25maWcgXHJcbiAqIEByZXR1cm4gUHJvbWlzZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFJFQURfQVNfREFUQV9VUkwgPSAoZmlsZTogRmlsZSwgY29uZmlnczogU2Nhbm5lclFSQ29kZUNvbmZpZyk6IFByb21pc2U8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXM+ID0+IHtcclxuICAvKiogb3ZlcnJpZGVzICoqL1xyXG4gIGxldCBjYW52YXNTdHlsZXMgPSAoY29uZmlncyAmJiBjb25maWdzLmNhbnZhc1N0eWxlcykgPyBjb25maWdzLmNhbnZhc1N0eWxlcyA6IENPTkZJR19ERUZBVUxULmNhbnZhc1N0eWxlcztcclxuICBsZXQgaXNCZWVwID0gKGNvbmZpZ3MgJiYgY29uZmlncy5pc0JlZXApID8gY29uZmlncy5pc0JlZXAgOiBDT05GSUdfREVGQVVMVC5pc0JlZXA7XHJcblxyXG4gIC8qKiBkcmF3SW1hZ2UgKiovXHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IGZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xyXG4gICAgZmlsZVJlYWRlci5vbmxvYWQgPSAoKSA9PiB7XHJcbiAgICAgIGNvbnN0IG9iamVjdEZpbGUgPSB7XHJcbiAgICAgICAgbmFtZTogZmlsZS5uYW1lLFxyXG4gICAgICAgIGZpbGU6IGZpbGUsXHJcbiAgICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICAgIH07XHJcbiAgICAgIC8vIFNldCB0aGUgc3JjIG9mIHRoaXMgSW1hZ2Ugb2JqZWN0LlxyXG4gICAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAvLyBTZXR0aW5nIGNyb3NzIG9yaWdpbiB2YWx1ZSB0byBhbm9ueW1vdXNcclxuICAgICAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdjcm9zc09yaWdpbicsICdhbm9ueW1vdXMnKTtcclxuICAgICAgLy8gV2hlbiBvdXIgaW1hZ2UgaGFzIGxvYWRlZC5cclxuICAgICAgaW1hZ2Uub25sb2FkID0gYXN5bmMgKCkgPT4ge1xyXG4gICAgICAgIC8vIEdldCB0aGUgY2FudmFzIGVsZW1lbnQgYnkgdXNpbmcgdGhlIGdldEVsZW1lbnRCeUlkIG1ldGhvZC5cclxuICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICAvLyBIVE1MSW1hZ2VFbGVtZW50IHNpemVcclxuICAgICAgICBjYW52YXMud2lkdGggPSBpbWFnZS5uYXR1cmFsV2lkdGggfHwgaW1hZ2Uud2lkdGg7XHJcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IGltYWdlLm5hdHVyYWxIZWlnaHQgfHwgaW1hZ2UuaGVpZ2h0O1xyXG4gICAgICAgIC8vIEdldCBhIDJEIGRyYXdpbmcgY29udGV4dCBmb3IgdGhlIGNhbnZhcy5cclxuICAgICAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKSBhcyBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQ7XHJcbiAgICAgICAgLy8gRHJhdyBpbWFnZVxyXG4gICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XHJcbiAgICAgICAgLy8gRGF0YSBpbWFnZVxyXG4gICAgICAgIGNvbnN0IGltYWdlRGF0YSA9IGN0eC5nZXRJbWFnZURhdGEoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcclxuICAgICAgICAvLyBTY2FubmVyXHJcbiAgICAgICAgY29uc3QgY29kZSA9IGpzUVIoaW1hZ2VEYXRhLmRhdGEsIGltYWdlRGF0YS53aWR0aCwgaW1hZ2VEYXRhLmhlaWdodCwge1xyXG4gICAgICAgICAgaW52ZXJzaW9uQXR0ZW1wdHM6IFwiZG9udEludmVydFwiLFxyXG4gICAgICAgIH0pIGFzIFNjYW5uZXJRUkNvZGVSZXN1bHQ7XHJcbiAgICAgICAgaWYgKGNvZGUgJiYgY29kZS5kYXRhICE9PSAnJykge1xyXG4gICAgICAgICAgLy8gT3ZlcmxheVxyXG4gICAgICAgICAgRFJBV19SRVNVTFRfT05fQ0FOVkFTKGNvZGUsIGNhbnZhcywgY2FudmFzU3R5bGVzKTtcclxuXHJcbiAgICAgICAgICAvLyBFbWl0IG9iamVjdFxyXG4gICAgICAgICAgY29uc3QgYmxvYiA9IGF3YWl0IENBTlZBU19UT19CTE9CKGNhbnZhcyk7XHJcbiAgICAgICAgICBjb25zdCB1cmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xyXG4gICAgICAgICAgY29uc3QgYmxvYlRvRmlsZSA9ICh0aGVCbG9iOiBhbnksIGZpbGVOYW1lOiBzdHJpbmcpID0+IG5ldyBGaWxlKFt0aGVCbG9iXSwgZmlsZU5hbWUsIHsgbGFzdE1vZGlmaWVkOiBuZXcgRGF0ZSgpLmdldFRpbWUoKSwgdHlwZTogdGhlQmxvYi50eXBlIH0pO1xyXG4gICAgICAgICAgcmVzb2x2ZShPYmplY3QuYXNzaWduKHt9LCBvYmplY3RGaWxlLCB7IGRhdGE6IGNvZGUsIHVybDogdXJsLCBjYW52YXM6IGNhbnZhcywgZmlsZTogYmxvYlRvRmlsZShibG9iLCBvYmplY3RGaWxlLm5hbWUpIH0pKTtcclxuXHJcbiAgICAgICAgICBQTEFZX0FVRElPKGlzQmVlcCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHJlc29sdmUoT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0RmlsZSwgeyBkYXRhOiBjb2RlLCBjYW52YXM6IGNhbnZhcyB9KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9O1xyXG4gICAgICAvLyBTZXQgc3JjXHJcbiAgICAgIGltYWdlLnNyYyA9IG9iamVjdEZpbGUudXJsO1xyXG4gICAgfVxyXG4gICAgZmlsZVJlYWRlci5vbmVycm9yID0gKGVycm9yOiBhbnkpID0+IHJlamVjdChlcnJvcik7XHJcbiAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgfSlcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgY2FudmFzIHRvIGJsb2JcclxuICogY2FudmFzLnRvQmxvYigoYmxvYikgPT4geyAuLiB9LCAnaW1hZ2UvanBlZycsIDAuOTUpOyAvLyBKUEVHIGF0IDk1JSBxdWFsaXR5XHJcbiAqIEBwYXJhbSBjYW52YXMgXHJcbiAqIEBwYXJhbSB0eXBlIFxyXG4gKiBAcmV0dXJuIFByb21pc2VcclxuICovXHJcbmV4cG9ydCBjb25zdCBDQU5WQVNfVE9fQkxPQiA9IChjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCB0eXBlPzogc3RyaW5nKTogUHJvbWlzZTxhbnk+ID0+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gY2FudmFzLnRvQmxvYihibG9iID0+IHJlc29sdmUoYmxvYiksIHR5cGUpKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENvbnZlcnQgYmxvYiB0byBmaWxlXHJcbiAqIEBwYXJhbSB0aGVCbG9iIFxyXG4gKiBAcGFyYW0gZmlsZU5hbWUgXHJcbiAqIEByZXR1cm4gRmlsZVxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IEJMT0JfVE9fRklMRSA9ICh0aGVCbG9iOiBhbnksIGZpbGVOYW1lOiBzdHJpbmcpOiBGaWxlID0+IHtcclxuICByZXR1cm4gbmV3IEZpbGUoW3RoZUJsb2JdLCBmaWxlTmFtZSwgeyBsYXN0TW9kaWZpZWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLCB0eXBlOiB0aGVCbG9iLnR5cGUgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGSUxFU19UT19TQ0FOXHJcbiAqIEBwYXJhbSBmaWxlcyBcclxuICogQHBhcmFtIGNvbmZpZ3MgXHJcbiAqIEBwYXJhbSBhcyBcclxuICogQHJldHVybnMgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRklMRVNfVE9fU0NBTiA9IChmaWxlczogRmlsZVtdID0gW10sIGNvbmZpZ3M6IFNjYW5uZXJRUkNvZGVDb25maWcsIGFzID0gbmV3IEFzeW5jU3ViamVjdDxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdPigpKTogQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+ID0+IHtcclxuICBQcm9taXNlLmFsbChPYmplY3QuYXNzaWduKFtdLCBmaWxlcykubWFwKG0gPT4gUkVBRF9BU19EQVRBX1VSTChtLCBjb25maWdzKSkpLnRoZW4oKGltZzogU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXSkgPT4ge1xyXG4gICAgQVNfQ09NUExFVEUoYXMsIGltZyk7XHJcbiAgfSkuY2F0Y2goKGVycm9yOiBhbnkpID0+IEFTX0NPTVBMRVRFKGFzLCBudWxsLCBlcnJvcikpO1xyXG4gIHJldHVybiBhcztcclxufVxyXG5cclxuLyoqXHJcbiAqIEZJTExfVEVYVF9NVUxUSV9MSU5FXHJcbiAqIEBwYXJhbSBjdHggXHJcbiAqIEBwYXJhbSB0ZXh0IFxyXG4gKiBAcGFyYW0geCBcclxuICogQHBhcmFtIHkgXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgRklMTF9URVhUX01VTFRJX0xJTkUgPSAoY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQsIHRleHQ6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIpID0+IHtcclxuICBsZXQgbGluZUhlaWdodCA9IGN0eC5tZWFzdXJlVGV4dChcIk1cIikud2lkdGggKiAxLjI7XHJcbiAgbGV0IGxpbmVzID0gdGV4dC5zcGxpdChcIlxcblwiKTtcclxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzLmxlbmd0aDsgKytpKSB7XHJcbiAgICBjdHguZmlsbFRleHQobGluZXNbaV0sIHgsIHkpO1xyXG4gICAgY3R4LnN0cm9rZVRleHQobGluZXNbaV0sIHgsIHkpO1xyXG4gICAgeSArPSBsaW5lSGVpZ2h0O1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIENPTVBSRVNTX0lNQUdFXHJcbiAqIEBwYXJhbSBmaWxlcyBcclxuICogQHBhcmFtIHR5cGUgXHJcbiAqIEBwYXJhbSBxdWFsaXR5IFxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBDT01QUkVTU19JTUFHRSA9IGFzeW5jIChmaWxlczogRmlsZVtdLCBxdWFsaXR5OiBudW1iZXIsIHR5cGU6IHN0cmluZykgPT4ge1xyXG4gIC8vIE5vIGZpbGVzIHNlbGVjdGVkXHJcbiAgaWYgKCFmaWxlcy5sZW5ndGgpIHJldHVybjtcclxuXHJcbiAgY29uc3QgY29tcHJlc3NJbWFnZSA9IGFzeW5jIChmaWxlOiBGaWxlKTogUHJvbWlzZTxGaWxlPiA9PiB7XHJcbiAgICAvLyBHZXQgYXMgaW1hZ2UgZGF0YVxyXG4gICAgY29uc3QgaW1hZ2VCaXRtYXAgPSBhd2FpdCBjcmVhdGVJbWFnZUJpdG1hcChmaWxlKTtcclxuXHJcbiAgICAvLyBEcmF3IHRvIGNhbnZhc1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XHJcbiAgICBjYW52YXMud2lkdGggPSBpbWFnZUJpdG1hcC53aWR0aDtcclxuICAgIGNhbnZhcy5oZWlnaHQgPSBpbWFnZUJpdG1hcC5oZWlnaHQ7XHJcbiAgICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIChjdHggYXMgYW55KS5kcmF3SW1hZ2UoaW1hZ2VCaXRtYXAsIDAsIDApO1xyXG5cclxuICAgIC8vIFR1cm4gaW50byBCbG9iXHJcbiAgICBjb25zdCBibG9iID0gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUpID0+XHJcbiAgICAgIGNhbnZhcy50b0Jsb2IocmVzb2x2ZSwgdHlwZSwgcXVhbGl0eSlcclxuICAgICkgYXMgYW55O1xyXG5cclxuICAgIC8vIFR1cm4gQmxvYiBpbnRvIEZpbGVcclxuICAgIHJldHVybiBuZXcgRmlsZShbYmxvYl0sIGZpbGUubmFtZSwge1xyXG4gICAgICB0eXBlOiBibG9iLnR5cGUsXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICAvLyBXZSdsbCBzdG9yZSB0aGUgZmlsZXMgaW4gdGhpcyBkYXRhIHRyYW5zZmVyIG9iamVjdFxyXG4gIGNvbnN0IGRhdGFUcmFuc2ZlciA9IG5ldyBEYXRhVHJhbnNmZXIoKTtcclxuXHJcbiAgLy8gRm9yIGV2ZXJ5IGZpbGUgaW4gdGhlIGZpbGVzIGxpc3RcclxuICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcclxuICAgIC8vIFdlIGRvbid0IGhhdmUgdG8gY29tcHJlc3MgZmlsZXMgdGhhdCBhcmVuJ3QgaW1hZ2VzXHJcbiAgICBpZiAoIWZpbGUudHlwZS5zdGFydHNXaXRoKCdpbWFnZScpKSB7XHJcbiAgICAgIC8vIElnbm9yZSB0aGlzIGZpbGUsIGJ1dCBkbyBhZGQgaXQgdG8gb3VyIHJlc3VsdFxyXG4gICAgICBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGZpbGUpO1xyXG4gICAgICBjb250aW51ZTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBXZSBjb21wcmVzcyB0aGUgZmlsZSBieSA1MCVcclxuICAgIGNvbnN0IGNvbXByZXNzZWRGaWxlID0gYXdhaXQgY29tcHJlc3NJbWFnZShmaWxlKTtcclxuXHJcbiAgICAvLyBTYXZlIGJhY2sgdGhlIGNvbXByZXNzZWQgZmlsZSBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBmaWxlXHJcbiAgICBkYXRhVHJhbnNmZXIuaXRlbXMuYWRkKGNvbXByZXNzZWRGaWxlKTtcclxuICB9XHJcblxyXG4gIC8vIHJldHVybiB2YWx1ZSBuZXcgZmlsZXMgbGlzdFxyXG4gIHJldHVybiBkYXRhVHJhbnNmZXIuZmlsZXM7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBSRU1PVkVfQ0FOVkFTXHJcbiAqIEBwYXJhbSBlbGVtZW50IFxyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFJFTU9WRV9DQU5WQVMgPSAoZWxlbWVudDogSFRNTEVsZW1lbnQpID0+IHtcclxuICBPYmplY3QuYXNzaWduKFtdLCBlbGVtZW50LmNoaWxkTm9kZXMpLmZvckVhY2goZWwgPT4gZWxlbWVudC5yZW1vdmVDaGlsZChlbCkpO1xyXG59XHJcblxyXG4vKipcclxuICogVklCUkFURVxyXG4gKiBC4bqtdCBydW5nIHRyw6puIG1vYmlsZVxyXG4gKiBAcGFyYW0gdGltZSBcclxuICovXHJcbmV4cG9ydCBjb25zdCBWSUJSQVRFID0gKHRpbWU6IG51bWJlciA9IDMwMCkgPT4ge1xyXG4gIHRpbWUgJiYgSVNfTU9CSUxFKCkgJiYgd2luZG93Lm5hdmlnYXRvci52aWJyYXRlKHRpbWUpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIElTX01PQklMRVxyXG4gKiBAcmV0dXJucyBcclxuICovXHJcbmV4cG9ydCBjb25zdCBJU19NT0JJTEUgPSAoKSA9PiB7XHJcbiAgY29uc3QgdmVuZG9yID0gbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCBuYXZpZ2F0b3JbJ3ZlbmRvciddIHx8ICh3aW5kb3cgYXMgYW55KVsnb3BlcmEnXTtcclxuICBjb25zdCBwaG9uZSA9IC8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm98YW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaTtcclxuICBjb25zdCB2ZXJzaW9uID0gLzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHMtKXxhaShrb3xybil8YWwoYXZ8Y2F8Y28pfGFtb2l8YW4oZXh8bnl8eXcpfGFwdHV8YXIoY2h8Z28pfGFzKHRlfHVzKXxhdHR3fGF1KGRpfC1tfHIgfHMgKXxhdmFufGJlKGNrfGxsfG5xKXxiaShsYnxyZCl8YmwoYWN8YXopfGJyKGV8dil3fGJ1bWJ8YnctKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG0tfGNlbGx8Y2h0bXxjbGRjfGNtZC18Y28obXB8bmQpfGNyYXd8ZGEoaXR8bGx8bmcpfGRidGV8ZGMtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnwtZCl8ZWwoNDl8YWkpfGVtKGwyfHVsKXxlcihpY3xrMCl8ZXNsOHxleihbNC03XTB8b3N8d2F8emUpfGZldGN8Zmx5KC18Xyl8ZzEgdXxnNTYwfGdlbmV8Z2YtNXxnLW1vfGdvKFxcLnd8b2QpfGdyKGFkfHVuKXxoYWllfGhjaXR8aGQtKG18cHx0KXxoZWktfGhpKHB0fHRhKXxocCggaXxpcCl8aHMtY3xodChjKC18IHxffGF8Z3xwfHN8dCl8dHApfGh1KGF3fHRjKXxpLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHwtfFxcLyl8aWJyb3xpZGVhfGlnMDF8aWtvbXxpbTFrfGlubm98aXBhcXxpcmlzfGphKHR8dilhfGpicm98amVtdXxqaWdzfGtkZGl8a2VqaXxrZ3QoIHxcXC8pfGtsb258a3B0IHxrd2MtfGt5byhjfGspfGxlKG5vfHhpKXxsZyggZ3xcXC8oa3xsfHUpfDUwfDU0fC1bYS13XSl8bGlid3xseW54fG0xLXd8bTNnYXxtNTBcXC98bWEodGV8dWl8eG8pfG1jKDAxfDIxfGNhKXxtLWNyfG1lKHJjfHJpKXxtaShvOHxvYXx0cyl8bW1lZnxtbygwMXwwMnxiaXxkZXxkb3x0KC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKS18b258dGZ8d2Z8d2d8d3QpfG5vayg2fGkpfG56cGh8bzJpbXxvcCh0aXx3dil8b3Jhbnxvd2cxfHA4MDB8cGFuKGF8ZHx0KXxwZHhnfHBnKDEzfC0oWzEtOF18YykpfHBoaWx8cGlyZXxwbChheXx1Yyl8cG4tMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0LWd8cWEtYXxxYygwN3wxMnwyMXwzMnw2MHwtWzItN118aS0pfHF0ZWt8cjM4MHxyNjAwfHJha3N8cmltOXxybyh2ZXx6byl8czU1XFwvfHNhKGdlfG1hfG1tfG1zfG55fHZhKXxzYygwMXxoLXxvb3xwLSl8c2RrXFwvfHNlKGMoLXwwfDEpfDQ3fG1jfG5kfHJpKXxzZ2gtfHNoYXJ8c2llKC18bSl8c2stMHxzbCg0NXxpZCl8c20oYWx8YXJ8YjN8aXR8dDUpfHNvKGZ0fG55KXxzcCgwMXxoLXx2LXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbC18dGRnLXx0ZWwoaXxtKXx0aW0tfHQtbW98dG8ocGx8c2gpfHRzKDcwfG0tfG0zfG01KXx0eC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXwtdil8dm00MHx2b2RhfHZ1bGN8dngoNTJ8NTN8NjB8NjF8NzB8ODB8ODF8ODN8ODV8OTgpfHczYygtfCApfHdlYmN8d2hpdHx3aShnIHxuY3xudyl8d21sYnx3b251fHg3MDB8eWFzLXx5b3VyfHpldG98enRlLS9pO1xyXG4gIGNvbnN0IGlzU2FmYXJpID0gL14oKD8hY2hyb21lfGFuZHJvaWQpLikqc2FmYXJpL2k7XHJcbiAgcmV0dXJuICEhKHBob25lLnRlc3QodmVuZG9yKSB8fCB2ZXJzaW9uLnRlc3QodmVuZG9yLnN1YnN0cigwLCA0KSkpICYmICFpc1NhZmFyaS50ZXN0KHZlbmRvcik7XHJcbn07Il19