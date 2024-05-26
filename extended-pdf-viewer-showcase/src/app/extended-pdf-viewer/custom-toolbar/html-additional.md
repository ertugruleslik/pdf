```html
<ngx-extended-pdf-viewer
  #pdfViewer
  [customToolbar]="additionalButtons"
  [src]="'/assets/pdfs/dachstein.pdf'"
  [textLayer]="true">
</ngx-extended-pdf-viewer>

<ng-template #additionalButtons>
  <div id="toolbarViewer" style="background-color:darkblue">
    <div id="toolbarViewerLeft">
      <pdf-toggle-sidebar></pdf-toggle-sidebar>
      <div class="toolbarButtonSpacer"></div>
      <pdf-find-button [showFindButton]="true" [textLayer]="true"></pdf-find-button>
      <pdf-paging-area></pdf-paging-area>
    </div>
    <pdf-zoom-toolbar ></pdf-zoom-toolbar> <!-- toolbar viewer middle -->
    <div id="toolbarViewerRight">
      <pdf-open-file></pdf-open-file>
      <pdf-presentation-mode></pdf-presentation-mode>
      <pdf-print></pdf-print>
      <app-open-in-new-tab></app-open-in-new-tab>
      <pdf-download></pdf-download>
      <div class="verticalToolbarSeparator hiddenSmallView"></div>
      <pdf-toggle-secondary-toolbar></pdf-toggle-secondary-toolbar>
    </div>
  </div>
</ng-template>
```
