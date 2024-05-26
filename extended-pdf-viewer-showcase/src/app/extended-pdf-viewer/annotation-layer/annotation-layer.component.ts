import { Component } from '@angular/core';
import { AnnotationLayerRenderedEvent, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-annotation-layer',
  templateUrl: './annotation-layer.component.html',
  styleUrls: ['./annotation-layer.component.css'],
})
export class AnnotationLayerComponent {
  private _fullscreen = false;

  public isLocalhost = isLocalhost();

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() => this.pdfService.recalculateSize());
  }

  constructor(private pdfService: NgxExtendedPdfViewerService) {}

  public onAnnotationLayerRendered(event: AnnotationLayerRenderedEvent): void {
    const copyrightHint = event.source.div.querySelector('.freeTextAnnotation');
    if (copyrightHint && copyrightHint instanceof HTMLElement) {
      copyrightHint.style.left="20%";
      const canvas = copyrightHint.querySelector("canvas");
      if (canvas) {
        canvas.style.width="75%";
        canvas.style.height="75%";
        canvas.style.top="20px";
        canvas.style.left="10%";
      }
    }
  }
}
