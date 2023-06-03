/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { AS_COMPLETE, COMPRESS_IMAGE, FILES_TO_SCAN } from './ngx-scanner-qrcode-single.helper';
import * as i0 from "@angular/core";
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
        if (files === void 0) { files = []; }
        if (quality === void 0) { quality = 0.5; }
        if (type === void 0) { type = 'image/jpeg'; }
        /** @type {?} */
        var as = new AsyncSubject();
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
        if (files === void 0) { files = []; }
        if (quality === void 0) { quality = 0.5; }
        if (type === void 0) { type = 'image/jpeg'; }
        /** @type {?} */
        var as = new AsyncSubject();
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
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */ NgxScannerQrcodeSingleService.ngInjectableDef = i0.defineInjectable({ factory: function NgxScannerQrcodeSingleService_Factory() { return new NgxScannerQrcodeSingleService(); }, token: NgxScannerQrcodeSingleService, providedIn: "root" });
    return NgxScannerQrcodeSingleService;
}());
export { NgxScannerQrcodeSingleService };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7Ozs7Ozs7Ozs7O0lBZXZGLGlEQUFTOzs7Ozs7O2NBQUMsS0FBa0IsRUFBRSxPQUFhLEVBQUUsSUFBbUI7O1FBQXRELHNCQUFBLEVBQUEsVUFBa0I7UUFBRSx3QkFBQSxFQUFBLGFBQWE7UUFBRSxxQkFBQSxFQUFBLG1CQUFtQjs7UUFDckUsSUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFZLEVBQWdDLENBQUM7UUFDNUQsY0FBYyxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsTUFBVztZQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLENBQU8sSUFBSyxPQUFBLEtBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLEdBQVUsSUFBSyxPQUFBLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQyxLQUFVLElBQUssT0FBQSxXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDO1NBQy9LLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxLQUFLO1lBQ1osV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLG9CQUFFLEtBQVksRUFBQyxDQUFDO1NBQ3JDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBRSxDQUFDOzs7Ozs7Ozs7O0lBV0wsdURBQWU7Ozs7Ozs7O2NBQUMsS0FBa0IsRUFBRSxNQUEyQixFQUFFLE9BQWEsRUFBRSxJQUFtQjtRQUFuRixzQkFBQSxFQUFBLFVBQWtCO1FBQStCLHdCQUFBLEVBQUEsYUFBYTtRQUFFLHFCQUFBLEVBQUEsbUJBQW1COztRQUN4RyxJQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBZ0MsQ0FBQztRQUM1RCxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxNQUFXO1lBQ3BELGFBQWEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQ25DLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxLQUFLO1lBQ1osV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLG9CQUFFLEtBQVksRUFBQyxDQUFDO1NBQ3JDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBRSxDQUFBOzs7Ozs7O0lBUUgscURBQWE7Ozs7O2NBQUMsSUFBVTs7UUFFOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNOztZQUNqQyxJQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ3BDLFVBQVUsQ0FBQyxNQUFNLEdBQUc7O2dCQUNsQixJQUFNLFVBQVUsR0FBRztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLElBQUksRUFBRSxJQUFJO29CQUNWLEdBQUcsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztpQkFDL0IsQ0FBQztnQkFDRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDckIsQ0FBQTtZQUNELFVBQVUsQ0FBQyxPQUFPLEdBQUcsVUFBQyxLQUFVLElBQUssT0FBQSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQWIsQ0FBYSxDQUFDO1lBQ25ELFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFBOzs7Z0JBM0RMLFVBQVUsU0FBQztvQkFDVixVQUFVLEVBQUUsTUFBTTtpQkFDbkI7Ozt3Q0FQRDs7U0FRYSw2QkFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBU19DT01QTEVURSwgQ09NUFJFU1NfSU1BR0UsIEZJTEVTX1RPX1NDQU4gfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuaGVscGVyJztcclxuaW1wb3J0IHsgU2Nhbm5lclFSQ29kZUNvbmZpZywgU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXMgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUub3B0aW9ucyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTY2FubmVyUXJjb2RlU2luZ2xlU2VydmljZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRGaWxlc1xyXG4gICAqIEBwYXJhbSBmaWxlcyBcclxuICAgKiBAcGFyYW0gcXVhbGl0eSBcclxuICAgKiBAcGFyYW0gdHlwZSBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgbG9hZEZpbGVzKGZpbGVzOiBGaWxlW10gPSBbXSwgcXVhbGl0eSA9IDAuNSwgdHlwZSA9ICdpbWFnZS9qcGVnJyk6IEFzeW5jU3ViamVjdDxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdPiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4oKTtcclxuICAgIENPTVBSRVNTX0lNQUdFKGZpbGVzLCBxdWFsaXR5LCB0eXBlKS50aGVuKChfZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgICBQcm9taXNlLmFsbChPYmplY3QuYXNzaWduKFtdLCBfZmlsZXMpLm1hcCgobTogRmlsZSkgPT4gdGhpcy5yZWFkQXNEYXRhVVJMKG0pKSkudGhlbigoaW1nOiBhbnlbXSkgPT4gQVNfQ09NUExFVEUoYXMsIGltZykpLmNhdGNoKChlcnJvcjogYW55KSA9PiBBU19DT01QTEVURShhcywgbnVsbCwgZXJyb3IpKTtcclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIG51bGwsIGVycm9yIGFzIGFueSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRGaWxlc1RvU2NhblxyXG4gICAqIEBwYXJhbSBmaWxlcyBcclxuICAgKiBAcGFyYW0gY29uZmlnIFxyXG4gICAqIEBwYXJhbSBxdWFsaXR5IFxyXG4gICAqIEBwYXJhbSB0eXBlIFxyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHB1YmxpYyBsb2FkRmlsZXNUb1NjYW4oZmlsZXM6IEZpbGVbXSA9IFtdLCBjb25maWc6IFNjYW5uZXJRUkNvZGVDb25maWcsIHF1YWxpdHkgPSAwLjUsIHR5cGUgPSAnaW1hZ2UvanBlZycpOiBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+KCk7XHJcbiAgICBDT01QUkVTU19JTUFHRShmaWxlcywgcXVhbGl0eSwgdHlwZSkudGhlbigoX2ZpbGVzOiBhbnkpID0+IHtcclxuICAgICAgRklMRVNfVE9fU0NBTihfZmlsZXMsIGNvbmZpZywgYXMpO1xyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgbnVsbCwgZXJyb3IgYXMgYW55KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkQXNEYXRhVVJMXHJcbiAgICogQHBhcmFtIGZpbGUgXHJcbiAgICogQHJldHVybiBQcm9taXNlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkQXNEYXRhVVJMKGZpbGU6IEZpbGUpOiBQcm9taXNlPFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzPiB7XHJcbiAgICAvKiogZHJhd0ltYWdlICoqL1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdEZpbGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXHJcbiAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXNvbHZlKG9iamVjdEZpbGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGZpbGVSZWFkZXIub25lcnJvciA9IChlcnJvcjogYW55KSA9PiByZWplY3QoZXJyb3IpO1xyXG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9KVxyXG4gIH1cclxufSJdfQ==