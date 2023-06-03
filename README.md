# ngx-scanner-qrcode-single

This library is built to provide a solution scanner QR code.\
This library takes in raw images and will locate, extract and parse any QR code found within.\
This demo [Github](https://id1945.github.io/ngx-scanner-qrcode-single), [Stackblitz](https://stackblitz.com/edit/angular-ngx-scanner-qrcode-single).

![Logo](https://raw.githubusercontent.com/id1945/ngx-scanner-qrcode-single/master/ngx-scanner-qrcode-single.png)


## Installation

Install `ngx-scanner-qrcode-single` from `npm`:

```bash
npm install ngx-scanner-qrcode-single@<version> --save
```

Add wanted package to NgModule imports:
```typescript
import { NgxScannerQrcodeSingleModule } from 'ngx-scanner-qrcode-single';
@NgModule({
    imports: [
        NgxScannerQrcodeSingleModule
    ]
})
```

In the Component:

```html
<!-- For camera -->
<ngx-scanner-qrcode-single #action="scanner"></ngx-scanner-qrcode-single>

<!-- data  -->
<span>{{ action.data.value | json }}</span><!-- value -->
<span>{{ action.data | async | json }}</span><!-- async -->

<!-- Loading -->
<p *ngIf="action.isLoading">⌛ Loading...</p>

<!-- start -->
<button (click)="action.isStart ? action.stop() : action.start()">{{action.isStart ? 'Stop' : 'Start'}}</button>
```

<details><summary><b>Image src</b></summary>

```html
<!-- For image src -->
<ngx-scanner-qrcode-single #action="scanner" [src]="'https://domain.com/test.png'"></ngx-scanner-qrcode-single>

<span>{{ action.data.value | json }}</span><!-- value -->
<span>{{ action.data | async | json }}</span><!-- async -->
```

</details>

<details><summary><b>Select files</b></summary>

```html
<!-- For select files -->
<input #file type="file" (change)="onSelects(file.files)" [multiple]="'multiple'" [accept]="'.jpg, .png, .gif, .jpeg'"/>

<div *ngFor="let item of qrCodeResult">
  <ngx-scanner-qrcode-single #actionFile="scanner" [src]="item.url" [config]="config"></ngx-scanner-qrcode-single>
  <p>{{ actionFile.data.value | json }}</p><!-- value -->
  <p>{{ actionFile.data | async | json }}</p><!-- async -->
</div>
```

```typescript
import { Component } from '@angular/core';
import { NgxScannerQrcodeSingleService, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode-single';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];

  public config: ScannerQRCodeConfig = {
    constraints: { 
      video: {
        width: window.innerWidth
      }
    } 
  };

  constructor(private qrcode: NgxScannerQrcodeSingleService) { }

  public onSelects(files: any) {
    this.qrcode.loadFiles(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }
}
```

</details>

<details><summary><b>Select files to Scan</b></summary>

```html
<!-- For select files -->
<input #file type="file" (change)="onSelects(file.files)" [multiple]="'multiple'" [accept]="'.jpg, .png, .gif, .jpeg'"/>

<div *ngFor="let item of qrCodeResult">
  <img [src]="item.url | safe: 'url'" [alt]="item.name" style="max-width: 100%"><!-- Need bypassSecurityTrustUrl -->
  <p>{{ item.data | json }}</p>
</div>
```

```typescript
import { Component } from '@angular/core';
import { NgxScannerQrcodeSingleService, ScannerQRCodeSelectedFiles } from 'ngx-scanner-qrcode-single';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public qrCodeResult: ScannerQRCodeSelectedFiles[] = [];

  public config: ScannerQRCodeConfig = {
    constraints: { 
      video: {
        width: window.innerWidth
      }
    } 
  };

  constructor(private qrcode: NgxScannerQrcodeSingleService) { }

  public onSelects(files: any) {
    this.qrcode.loadFilesToScan(files).subscribe((res: ScannerQRCodeSelectedFiles[]) => {
      this.qrCodeResult = res;
    });
  }
}
```

</details>

### API Documentation

#### Input

|   Field         |   Description                 |     Type                  |     Default                                                                                   |
|   ---           |       ---                     |     ---                   |       ---                                                                                     |
| [src]           | image url                     | string                    | -                                                                                             |
| [fps]           | fps/ms                        | number                    | 30                                                                                            |
| [vibrate]       | vibrate for mobile            | number                    | 300                                                                                           |
| [isBeep]        | beep                          | boolean                   | true                                                                                          |
| [constraints]   | setting video                 | MediaStreamConstraints    | ``` {audio:false,video:true} ```                                                              |
| [canvasStyles]  | setting canvas                | CanvasRenderingContext2D  | ``` {font:'15px serif',lineWidth:1,strokeStyle:'green',fillStyle:'#55f02880'} ```                                                              |
| [config]        | config                        | ScannerQRCodeConfig       | ``` {src:..,fps..,vibrate..,isBeep:..,config:..,constraints:..,canvasStyles:..} ``` |

#### Ouput

| Field     | Description   | Type                                      | Default |
| ---       | ---           | ---                                       | ---     |
| (event)   | data response | BehaviorSubject<ScannerQRCodeResult>      | null    |

#### Component exports

| Field             | Description               | Type                                        | Default   |
| ---               | ---                       | ---                                         | ---       |
| isStart           | status                    | boolean                                     | false     | 
| isLoading         | status                    | boolean                                     | false     | 
| isTorch           | torch                     | boolean                                     | false     | 
| isPause           | status                    | boolean                                     | -         | 
| isReady           | status wasm               | AsyncSubject<boolean>                       | -         | 
| data              | data response             | BehaviorSubject<ScannerQRCodeResult>        | null      |
| devices           | data devices              | BehaviorSubject<ScannerQRCodeDevice[]>      | []        |
| deviceIndexActive | device index              | number                                      | 0         |
| ---               | ---                       | ---                                         | ---       |
| (start)           | start camera              | AsyncSubject                                | -         |
| (stop)            | stop camera               | AsyncSubject                                | -         |
| (play)            | play video                | AsyncSubject                                | -         |
| (pause)           | pause video               | AsyncSubject                                | -         |
| (torcher)         | toggle on/off flashlight  | AsyncSubject                                | -         |
| (applyConstraints)| set media constraints     | AsyncSubject                                | -         |
| (getConstraints)  | get media constraints     | AsyncSubject                                | -         |
| (playDevice)      | play deviceId             | AsyncSubject                                | -         |
| (loadImage)       | load image from src       | AsyncSubject                                | -         |
| (download)        | download image            | AsyncSubject<ScannerQRCodeSelectedFiles[]>  | -         |

#### Service

| Field             | Description         | Type                                        | Default |
| ---               | ---                 | ---                                         | ---     |
| (loadFiles)       | Convert files       | AsyncSubject<ScannerQRCodeSelectedFiles[]>  | []      |
| (loadFilesToScan) | Scanner files       | AsyncSubject<ScannerQRCodeSelectedFiles[]>  | []      |

#### Models

<details><summary><b>ScannerQRCodeConfig</b></summary>

```typescript
interface ScannerQRCodeConfig {
  src?: string;
  fps?: number;
  vibrate?: number /** support mobile */;
  isBeep?: boolean;
  constraints?: MediaStreamConstraints;
  canvasStyles?: CanvasRenderingContext2D;
}
```
</details>

<details><summary><b>ScannerQRCodeDevice</b></summary>

```typescript
interface ScannerQRCodeDevice {
  kind: string;
  label: string;
  groupId: string;
  deviceId: string;
}
```
</details>

<details><summary><b>ScannerQRCodeResult</b></summary>

```typescript
class ScannerQRCodeResult {
  binaryData: number[];
  data: string;
  chunks: Chunks;
  version: number;
  location: {
    topRightCorner: Point;
    topLeftCorner: Point;
    bottomRightCorner: Point;
    bottomLeftCorner: Point;
    topRightFinderPattern: Point;
    topLeftFinderPattern: Point;
    bottomLeftFinderPattern: Point;
    bottomRightAlignmentPattern?: Point | undefined;
  };
}
```

```typescript
interface Point {
  x: number;
  y: number;
}

declare type Chunks = Array<Chunk | ByteChunk | ECIChunk>;
```
</details>

<details><summary><b>ScannerQRCodeSelectedFiles</b></summary>

```typescript
interface ScannerQRCodeSelectedFiles {
  url: string;
  name: string;
  file: File;
  data?: ScannerQRCodeResult;
  canvas?: HTMLCanvasElement;
}
```
</details>


#### Support versions

<table>
  <tr>
    <th colspan="2">Support versions</th>
  </tr>
  <tr>
    <td>Angular 6</td>
    <td>1.0.0</td>
  </tr>
</table>

#### Author Information
  
<table>
  <tr>
    <th colspan="2">Author Information</th>
  </tr>
  <tr>
    <td>Author</td>
    <td>DaiDH</td>
  </tr>
  <tr>
    <td>Phone</td>
    <td>+84845882882</td>
  </tr>
  <tr>
    <td>Country</td>
    <td>Vietnam</td>
  </tr>
</table>

#### If you want donate for me!

<table>
  <tr>
    <th>Bitcoin</th>
  </tr>
  <tr>
    <td><img src="https://raw.githubusercontent.com/id1945/id1945/master/donate-bitcoin.png" width="182px"></td>
  </tr>
</table>

![Vietnam](https://raw.githubusercontent.com/id1945/id1945/master/vietnam.gif)

[MIT License](https://github.com/id1945/ngx-scanner-qrcode-single/blob/master/LICENSE). Copyright (C) 2023.