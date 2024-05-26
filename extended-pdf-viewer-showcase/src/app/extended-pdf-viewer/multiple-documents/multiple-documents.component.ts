import { Component, NgZone, OnInit } from '@angular/core';
import { FileInputChanged, IPDFViewerApplication, NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-multiple-documents',
  templateUrl: './multiple-documents.component.html',
  styleUrls: ['./multiple-documents.component.css']
})
export class MultipleDocumentsComponent implements OnInit {
  public src!: string;

  public dragAndDrop = true;

  public isLocalhost = isLocalhost();

  private _fullscreen = false;

  public bookMode = false;

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() =>
    this.pdfService.recalculateSize());
  }

  public url = new URL(`${location.protocol}//${location.host}/assets/pdfs/GraalVM.pdf`);

  constructor(private ngZone: NgZone, private pdfService: NgxExtendedPdfViewerService) {}

  public ngOnInit(): void {
    setTimeout(() => {
      const PDFViewerApplication: IPDFViewerApplication = (window as any).PDFViewerApplication;
      PDFViewerApplication.eventBus.on('fileinputchange', (event: FileInputChanged) => {
        this.ngZone.run(() => {
          if (event.dropEvent) {
            console.log("Drop Event: ", event.dropEvent);
          } else {
            console.log("The file has changed without using drag and drop", event.fileInput);
          }
        });
      });
    }, 2000);
  }
}
