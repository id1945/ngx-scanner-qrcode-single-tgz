/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Injectable } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { AS_COMPLETE, COMPRESS_IMAGE, FILES_TO_SCAN } from './ngx-scanner-qrcode-single.helper';
import * as i0 from "@angular/core";
export class NgxScannerQrcodeSingleService {
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
/** @nocollapse */ NgxScannerQrcodeSingleService.ngInjectableDef = i0.defineInjectable({ factory: function NgxScannerQrcodeSingleService_Factory() { return new NgxScannerQrcodeSingleService(); }, token: NgxScannerQrcodeSingleService, providedIn: "root" });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vbmd4LXNjYW5uZXItcXJjb2RlLXNpbmdsZS8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtc2Nhbm5lci1xcmNvZGUtc2luZ2xlLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNwQyxPQUFPLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsTUFBTSxvQ0FBb0MsQ0FBQzs7QUFNaEcsTUFBTTs7Ozs7Ozs7SUFTRyxTQUFTLENBQUMsUUFBZ0IsRUFBRSxFQUFFLE9BQU8sR0FBRyxHQUFHLEVBQUUsSUFBSSxHQUFHLFlBQVk7O1FBQ3JFLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBWSxFQUFnQyxDQUFDO1FBQzVELGNBQWMsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQVcsRUFBRSxFQUFFO1lBQ3hELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBTyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFVLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDL0ssQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNmLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxvQkFBRSxLQUFZLEVBQUMsQ0FBQztTQUNyQyxDQUFDLENBQUM7UUFDSCxPQUFPLEVBQUUsQ0FBQzs7Ozs7Ozs7OztJQVdMLGVBQWUsQ0FBQyxRQUFnQixFQUFFLEVBQUUsTUFBMkIsRUFBRSxPQUFPLEdBQUcsR0FBRyxFQUFFLElBQUksR0FBRyxZQUFZOztRQUN4RyxNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksRUFBZ0MsQ0FBQztRQUM1RCxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFXLEVBQUUsRUFBRTtZQUN4RCxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztTQUNuQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2YsV0FBVyxDQUFDLEVBQUUsRUFBRSxJQUFJLG9CQUFFLEtBQVksRUFBQyxDQUFDO1NBQ3JDLENBQUMsQ0FBQztRQUNILE9BQU8sRUFBRSxDQUFBOzs7Ozs7O0lBUUgsYUFBYSxDQUFDLElBQVU7O1FBRTlCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7O1lBQ3JDLE1BQU0sVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDcEMsVUFBVSxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7O2dCQUN2QixNQUFNLFVBQVUsR0FBRztvQkFDakIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO29CQUNmLElBQUksRUFBRSxJQUFJO29CQUNWLEdBQUcsRUFBRSxHQUFHLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQztpQkFDL0IsQ0FBQztnQkFDRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDckIsQ0FBQTtZQUNELFVBQVUsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxLQUFVLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ2hDLENBQUMsQ0FBQTs7OztZQTNETCxVQUFVLFNBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBBU19DT01QTEVURSwgQ09NUFJFU1NfSU1BR0UsIEZJTEVTX1RPX1NDQU4gfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUuaGVscGVyJztcclxuaW1wb3J0IHsgU2Nhbm5lclFSQ29kZUNvbmZpZywgU2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXMgfSBmcm9tICcuL25neC1zY2FubmVyLXFyY29kZS1zaW5nbGUub3B0aW9ucyc7XHJcblxyXG5ASW5qZWN0YWJsZSh7XHJcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBOZ3hTY2FubmVyUXJjb2RlU2luZ2xlU2VydmljZSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRGaWxlc1xyXG4gICAqIEBwYXJhbSBmaWxlcyBcclxuICAgKiBAcGFyYW0gcXVhbGl0eSBcclxuICAgKiBAcGFyYW0gdHlwZSBcclxuICAgKiBAcmV0dXJucyBcclxuICAgKi9cclxuICBwdWJsaWMgbG9hZEZpbGVzKGZpbGVzOiBGaWxlW10gPSBbXSwgcXVhbGl0eSA9IDAuNSwgdHlwZSA9ICdpbWFnZS9qcGVnJyk6IEFzeW5jU3ViamVjdDxTY2FubmVyUVJDb2RlU2VsZWN0ZWRGaWxlc1tdPiB7XHJcbiAgICBjb25zdCBhcyA9IG5ldyBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4oKTtcclxuICAgIENPTVBSRVNTX0lNQUdFKGZpbGVzLCBxdWFsaXR5LCB0eXBlKS50aGVuKChfZmlsZXM6IGFueSkgPT4ge1xyXG4gICAgICBQcm9taXNlLmFsbChPYmplY3QuYXNzaWduKFtdLCBfZmlsZXMpLm1hcCgobTogRmlsZSkgPT4gdGhpcy5yZWFkQXNEYXRhVVJMKG0pKSkudGhlbigoaW1nOiBhbnlbXSkgPT4gQVNfQ09NUExFVEUoYXMsIGltZykpLmNhdGNoKChlcnJvcjogYW55KSA9PiBBU19DT01QTEVURShhcywgbnVsbCwgZXJyb3IpKTtcclxuICAgIH0pLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgQVNfQ09NUExFVEUoYXMsIG51bGwsIGVycm9yIGFzIGFueSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBhcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGxvYWRGaWxlc1RvU2NhblxyXG4gICAqIEBwYXJhbSBmaWxlcyBcclxuICAgKiBAcGFyYW0gY29uZmlnIFxyXG4gICAqIEBwYXJhbSBxdWFsaXR5IFxyXG4gICAqIEBwYXJhbSB0eXBlIFxyXG4gICAqIEByZXR1cm5zIFxyXG4gICAqL1xyXG4gIHB1YmxpYyBsb2FkRmlsZXNUb1NjYW4oZmlsZXM6IEZpbGVbXSA9IFtdLCBjb25maWc6IFNjYW5uZXJRUkNvZGVDb25maWcsIHF1YWxpdHkgPSAwLjUsIHR5cGUgPSAnaW1hZ2UvanBlZycpOiBBc3luY1N1YmplY3Q8U2Nhbm5lclFSQ29kZVNlbGVjdGVkRmlsZXNbXT4ge1xyXG4gICAgY29uc3QgYXMgPSBuZXcgQXN5bmNTdWJqZWN0PFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzW10+KCk7XHJcbiAgICBDT01QUkVTU19JTUFHRShmaWxlcywgcXVhbGl0eSwgdHlwZSkudGhlbigoX2ZpbGVzOiBhbnkpID0+IHtcclxuICAgICAgRklMRVNfVE9fU0NBTihfZmlsZXMsIGNvbmZpZywgYXMpO1xyXG4gICAgfSkuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICBBU19DT01QTEVURShhcywgbnVsbCwgZXJyb3IgYXMgYW55KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGFzXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiByZWFkQXNEYXRhVVJMXHJcbiAgICogQHBhcmFtIGZpbGUgXHJcbiAgICogQHJldHVybiBQcm9taXNlXHJcbiAgICovXHJcbiAgcHJpdmF0ZSByZWFkQXNEYXRhVVJMKGZpbGU6IEZpbGUpOiBQcm9taXNlPFNjYW5uZXJRUkNvZGVTZWxlY3RlZEZpbGVzPiB7XHJcbiAgICAvKiogZHJhd0ltYWdlICoqL1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgY29uc3QgZmlsZVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XHJcbiAgICAgIGZpbGVSZWFkZXIub25sb2FkID0gKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9iamVjdEZpbGUgPSB7XHJcbiAgICAgICAgICBuYW1lOiBmaWxlLm5hbWUsXHJcbiAgICAgICAgICBmaWxlOiBmaWxlLFxyXG4gICAgICAgICAgdXJsOiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXNvbHZlKG9iamVjdEZpbGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGZpbGVSZWFkZXIub25lcnJvciA9IChlcnJvcjogYW55KSA9PiByZWplY3QoZXJyb3IpO1xyXG4gICAgICBmaWxlUmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XHJcbiAgICB9KVxyXG4gIH1cclxufSJdfQ==