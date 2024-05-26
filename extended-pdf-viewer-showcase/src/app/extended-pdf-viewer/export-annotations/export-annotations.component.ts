import { FreeTextEditorAnnotation, IPDFViewerApplication, InkEditorAnnotation, NgxExtendedPdfViewerService, pdfDefaultOptions } from 'ngx-extended-pdf-viewer';
import { Component, OnInit } from '@angular/core';
import { isLocalhost } from '../common/utilities';

@Component({
  selector: 'app-export-annotations',
  templateUrl: './export-annotations.component.html',
  styleUrls: ['./export-annotations.component.css'],
})
export class ExportAnnotationsComponent {
  public imageDataURL: string | undefined = undefined;

  public selectedTabIndex = 0;

  public isLocalhost = isLocalhost();

  private _fullscreen = false;

  public pdfUrl;

  public rawAnnotations: Array<any> | null = null;

  public get fullscreen(): boolean {
    return this._fullscreen;
  }

  public set fullscreen(full: boolean) {
    this._fullscreen = full;
    setTimeout(() => this.pdfViewerService.recalculateSize());
  }

  constructor(private pdfViewerService: NgxExtendedPdfViewerService) {
    pdfDefaultOptions.textLayerMode = 1;

    this.componentDidLoad();
  }

  private componentDidLoad(): void {
    console.log('Component loaded');

    const otherInputElement = document.getElementById('asd') as HTMLInputElement;
    if (otherInputElement !== null) {
      console.log(otherInputElement.value);
    }

    //this.pdfUrl = '/assets/pdfs/pdf-sample.pdf';
    this.pdfUrl = otherInputElement.value;
  }

  public exportAnnotations(): void {
    this.selectedTabIndex = 4;
    this.rawAnnotations = this.pdfViewerService.getSerializedAnnotations();

    console.log(this.pdfViewerService.getSerializedAnnotations());

    const otherInputElement = document.getElementById('asd') as HTMLInputElement;
    if (otherInputElement !== null) {
      console.log(otherInputElement.value);
    }
  }


  public addTextEditor(): void {
    const x = Math.round(Math.random() * 400);
    const y = Math.round(350 + Math.random() * 500);
    const fontSize = Math.round(Math.random() * 30 + 10);
    const height = fontSize * 1.75;
    const width = fontSize * 5.8;
    const textEditorAnnotation: FreeTextEditorAnnotation = {
      annotationType: 3,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      fontSize: fontSize,
      value: 'Hello world!',
      pageIndex: 0,
      rect: [
        x,
        y,
        x+width,
        y+height
      ],
      rotation: 0,
    };
    console.log(textEditorAnnotation);
    console.log('Before update');
    this.pdfViewerService.addEditorAnnotation(textEditorAnnotation);
    console.log('After update');
    let anno = this.pdfViewerService.getSerializedAnnotations();
    if (anno) {
      console.log(anno[0]);
    }
  }

  public addDrawing(): void {
    const x = 400 * Math.random();
    const y = 350 + 500 * Math.random();
    const drawing: InkEditorAnnotation = {
      annotationType: 15,
      color: [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)],
      thickness: Math.random() * 10,
      opacity: 1,
      paths: [
        {
          bezier: [x + 0.5, y, x + 0.5, y + 44, x + 44, y + 66, x + 88, y + 44],
          points: [x + 0.5, y, x + 0.5, y + 44],
        },
      ],
      pageIndex: 0,
      rect: [x, y, x + 100, y + 66],
      rotation: 0,
    };

    const a = '{\n  "annotationType": 15,\n  "color": [\n    0,\n    0,\n    0\n  ],\n  "thickness": 1,\n  "opacity": 1,\n  "paths": [\n    {\n      "bezier": [\n        547.875,\n        648.076171875,\n        547.625,\n        648.076171875,\n        547.5,\n        648.251953125,\n        547.5,\n        648.603515625,\n        547.5,\n        648.955078125,\n        547.5,\n        649.4716796875,\n        547.5,\n        650.1533203125,\n        547.5,\n        650.8349609375,\n        547.5,\n        651.3193359375,\n        547.5,\n        651.6064453125,\n        547.5,\n        651.8935546875,\n        547.5,\n        652.2724609375,\n        547.5,\n        652.7431640625,\n        547.5,\n        653.2138671875,\n        547.5,\n        653.6845703125,\n        547.5,\n        654.1552734375,\n        547.5,\n        654.6259765625,\n        547.5,\n        655.0966796875,\n        547.5,\n        655.5673828125,\n        547.5,\n        656.0380859375,\n        547.5,\n        656.5087890625,\n        547.5,\n        656.9794921875,\n        547.5,\n        657.4501953125,\n        547.5,\n        657.9208984375,\n        547.5,\n        658.3916015625,\n        547.5,\n        658.8623046875,\n        547.5,\n        659.3330078125,\n        547.5,\n        659.8037109375,\n        547.5,\n        660.2744140625,\n        547.5712890625,\n        660.6533203125,\n        547.7138671875,\n        660.9404296875,\n        547.8564453125,\n        661.2275390625,\n        547.9921875,\n        661.4365234375,\n        548.12109375,\n        661.5673828125,\n        548.25,\n        661.6982421875,\n        548.45703125,\n        661.8359375,\n        548.7421875,\n        661.98046875,\n        549.02734375,\n        662.125,\n        549.3125,\n        662.197265625,\n        549.59765625,\n        662.197265625,\n        549.8828125,\n        662.197265625,\n        550.08984375,\n        662.197265625,\n        550.21875,\n        662.197265625,\n        550.34765625,\n        662.197265625,\n        550.5546875,\n        662.197265625,\n        550.83984375,\n        662.197265625,\n        551.125,\n        662.197265625,\n        551.41015625,\n        662.197265625,\n        551.6953125,\n        662.197265625,\n        551.98046875,\n        662.197265625,\n        552.265625,\n        662.197265625,\n        552.55078125,\n        662.197265625,\n        552.8359375,\n        662.197265625,\n        553.12109375,\n        662.197265625,\n        553.40625,\n        662.197265625,\n        553.69140625,\n        662.197265625,\n        554.068359375,\n        662.197265625,\n        554.537109375,\n        662.197265625,\n        555.005859375,\n        662.197265625,\n        555.3828125,\n        662.197265625,\n        555.66796875,\n        662.197265625,\n        555.953125,\n        662.197265625,\n        556.23828125,\n        662.0546875,\n        556.5234375,\n        661.76953125,\n        556.80859375,\n        661.484375,\n        557.3203125,\n        661.0654296875,\n        558.05859375,\n        660.5126953125,\n        558.796875,\n        659.9599609375,\n        559.400390625,\n        659.52734375,\n        559.869140625,\n        659.21484375,\n        560.337890625,\n        658.90234375,\n        561.068359375,\n        658.349609375,\n        562.060546875,\n        657.556640625,\n        563.052734375,\n        656.763671875,\n        564.044921875,\n        655.970703125,\n        565.037109375,\n        655.177734375,\n        566.029296875,\n        654.384765625,\n        566.89453125,\n        653.619140625,\n        567.6328125,\n        652.880859375,\n        568.37109375,\n        652.142578125,\n        569.376953125,\n        651.3486328125,\n        570.650390625,\n        650.4990234375,\n        571.923828125,\n        649.6494140625,\n        572.9296875,\n        648.85546875,\n        573.66796875,\n        648.1171875,\n        574.40625,\n        647.37890625,\n        575.14453125,\n        646.640625,\n        575.8828125,\n        645.90234375,\n        576.62109375,\n        645.1640625,\n        577.359375,\n        644.42578125,\n        578.09765625,\n        643.6875,\n        578.8359375,\n        642.94921875,\n        579.7353515625,\n        642.0498046875,\n        580.7958984375,\n        640.9892578125,\n        581.8564453125,\n        639.9287109375,\n        582.6630859375,\n        639.029296875,\n        583.2158203125,\n        638.291015625,\n        583.7685546875,\n        637.552734375,\n        584.4140625,\n        636.814453125,\n        585.15234375,\n        636.076171875,\n        585.890625,\n        635.337890625,\n        586.5361328125,\n        634.599609375,\n        587.0888671875,\n        633.861328125,\n        587.6416015625,\n        633.123046875,\n        588.3505859375,\n        632.150390625,\n        589.2158203125,\n        630.943359375,\n        590.0810546875,\n        629.736328125,\n        590.669921875,\n        628.8984375,\n        590.982421875,\n        628.4296875,\n        591.294921875,\n        627.9609375,\n        591.607421875,\n        627.4921875,\n        591.919921875,\n        627.0234375,\n        592.232421875,\n        626.5546875,\n        592.6640625,\n        626.03515625,\n        593.21484375,\n        625.46484375\n      ],\n      "points": [\n        547.875,\n        648.076171875,\n        547.625,\n        648.076171875,\n        547.5,\n        648.955078125,\n        547.5,\n        650.8349609375,\n        547.5,\n        651.8935546875,\n        547.5,\n        653.2138671875,\n        547.5,\n        654.6259765625,\n        547.5,\n        656.0380859375,\n        547.5,\n        657.4501953125,\n        547.5,\n        658.8623046875,\n        547.5,\n        660.2744140625,\n        547.8564453125,\n        661.2275390625,\n        548.25,\n        661.6982421875,\n        549.02734375,\n        662.125,\n        549.8828125,\n        662.197265625,\n        550.34765625,\n        662.197265625,\n        551.125,\n        662.197265625,\n        551.98046875,\n        662.197265625,\n        552.8359375,\n        662.197265625,\n        553.69140625,\n        662.197265625,\n        555.005859375,\n        662.197265625,\n        555.953125,\n        662.197265625,\n        556.80859375,\n        661.484375,\n        558.796875,\n        659.9599609375,\n        560.337890625,\n        658.90234375,\n        563.052734375,\n        656.763671875,\n        566.029296875,\n        654.384765625,\n        568.37109375,\n        652.142578125,\n        571.923828125,\n        649.6494140625,\n        574.40625,\n        647.37890625,\n        576.62109375,\n        645.1640625,\n        578.8359375,\n        642.94921875,\n        581.8564453125,\n        639.9287109375,\n        583.7685546875,\n        637.552734375,\n        585.890625,\n        635.337890625,\n        587.6416015625,\n        633.123046875,\n        590.0810546875,\n        629.736328125,\n        591.294921875,\n        627.9609375,\n        592.232421875,\n        626.5546875,\n        593.21484375,\n        625.46484375\n      ]\n    }\n  ],\n  "pageIndex": 0,\n  "rect": [\n    547,\n    623.697265625,\n    595,\n    662.697265625\n  ],\n  "rotation": 0,\n  "structTreeParentId": null\n}'

    this.pdfViewerService.addEditorAnnotation(JSON.parse(a));
  }

  public removeEditors(): void {
    this.pdfViewerService.removeEditorAnnotations();
  }

  public removeTextEditors(): void {
    const filter = (serial: any) => serial?.annotationType === 3;
    this.pdfViewerService.removeEditorAnnotations(filter);
  }

  public removeDrawingEditors(): void {
    const filter = (serial: any) => serial?.annotationType === 15;
    this.pdfViewerService.removeEditorAnnotations(filter);
  }

  public updateAnnotation(index: number, event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    console.log('Before update');
    let anno = this.pdfViewerService.getSerializedAnnotations();
    if (anno) {
      console.log(anno[0]);
    }
    if (this.rawAnnotations) {
      const value = textarea.value.replace(/\n/g, '');
      this.rawAnnotations[index] = JSON.parse(value);

      this.removeEditors();
      for (const annotation of this.rawAnnotations) {
        this.pdfViewerService.addEditorAnnotation(annotation);
      }
    }
    console.log('After update');
    anno = this.pdfViewerService.getSerializedAnnotations();
    if (anno) {
      console.log(anno[0]);
    }
  }

  public adjustSize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = textarea.scrollHeight + 'px';
  }

  public countRows(json: string): number {
    return json?.split(/\r\n|\r|\n/)?.length;
  }
}
