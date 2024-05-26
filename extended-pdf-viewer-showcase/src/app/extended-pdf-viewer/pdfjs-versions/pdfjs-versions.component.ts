import { Component } from '@angular/core';
import { NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-pdfjs-versions',
  templateUrl: './pdfjs-versions.component.html',
  styleUrls: ['./pdfjs-versions.component.css'],
})
export class PdfjsVersionsComponent {

  public isLocalhost = isLocalhost();

  private _fullscreen = false;

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() =>
    this.pdfService.recalculateSize());
  }

  constructor(private pdfService: NgxExtendedPdfViewerService) {
    pdfDefaultOptions.assetsFolder = 'bleeding-edge';
  }
}
