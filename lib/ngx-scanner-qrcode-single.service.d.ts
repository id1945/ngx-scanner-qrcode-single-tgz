import { AsyncSubject } from 'rxjs';
import { ScannerQRCodeConfig, ScannerQRCodeSelectedFiles } from './ngx-scanner-qrcode-single.options';
export declare class NgxScannerQrcodeSingleService {
    /**
     * loadFiles
     * @param files
     * @param quality
     * @param type
     * @returns
     */
    loadFiles(files?: File[], quality?: number, type?: string): AsyncSubject<ScannerQRCodeSelectedFiles[]>;
    /**
     * loadFilesToScan
     * @param files
     * @param config
     * @param quality
     * @param type
     * @returns
     */
    loadFilesToScan(files: File[], config: ScannerQRCodeConfig, quality?: number, type?: string): AsyncSubject<ScannerQRCodeSelectedFiles[]>;
    /**
     * readAsDataURL
     * @param file
     * @return Promise
     */
    private readAsDataURL;
}
