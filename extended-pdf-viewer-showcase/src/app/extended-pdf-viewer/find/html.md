```html
<ngx-extended-pdf-viewer
    [src]="'/assets/pdfs/Portugues-para-principiantes.pdf'"
    (updateFindMatchesCount)="updateFindMatchesCount($event)"
    (updateFindState)="updateFindState($event)"
    backgroundColor="#ffffff"
    page="9">
```
