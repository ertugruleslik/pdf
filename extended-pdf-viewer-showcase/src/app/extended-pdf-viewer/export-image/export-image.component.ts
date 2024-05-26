import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Component, OnInit } from '@angular/core';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-export-image',
  templateUrl: './export-image.component.html',
  styleUrls: ['./export-image.component.css'],
})
export class ExportImageComponent {
  public imageDataURL: string | undefined = undefined;

  public background: string | undefined;

  public extractedText = 'no text extracted yet';

  public scale!: number;

  public width!: number;

  public height!: number;
  public widthDisplay!: number;

  public heightDisplay!: number;

  public selectedTabIndex = 0;

  public isLocalhost = isLocalhost();

  private _fullscreen = false;

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() => this.pdfViewerService.recalculateSize());
  }

  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {
    pdfDefaultOptions.textLayerMode = 1;
  }

  public missingInput(): boolean {
    return !this.scale && !this.width && !this.height;
  }

  public widthFilledError(): boolean {
    if (this.width) {
      return !!this.height || !!this.scale;
    }
    return false;
  }

  public heightFilledError(): boolean {
    if (this.height) {
      return !!this.width || !!this.scale;
    }
    return false;
  }

  public scaleFilledError(): boolean {
    if (this.scale) {
      return !!this.height || !!this.width;
    }
    return false;
  }

  public exportAsImage(): void {
    this.selectedTabIndex = 2;
    const scale = { width: this.width, height: this.height, scale: this.scale };
    (async () => this.showImage(await this.pdfViewerService.getPageAsImage(1, scale, this.background)))();
  }

  public exportAsText(): void {
    this.selectedTabIndex = 3;
    (async () => this.showText(await this.pdfViewerService.getPageAsText(1)))();
  }

  public async exportAsLines(): Promise<void> {
    const lines = await this.pdfViewerService.getPageAsLines(1);
    console.log(lines);

  }

  private showText(text: string): void {
    this.extractedText = text;
  }

  private showImage(dataURL: any): void {
    this.imageDataURL = dataURL;
    this.getImageDimensions(dataURL);
  }

  private getImageDimensions(dataURL: string): void {
    const i = new Image();
    i.onload = () => {
      this.widthDisplay = i.width;
      this.heightDisplay = i.height;
    };
    i.src = dataURL;
  }
}
