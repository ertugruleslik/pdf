The `<pdf-shy-button>` allows you to benefit from seamless integration into the toolbar and the secondary menu. A typical shy button
looks like so:
```html
<pdf-shy-button
  [cssClass]="'always-in-secondary-menu' | responsiveCSSClass"
  title="Infinite scroll"
  primaryToolbarId="infiniteScroll"
  l10nId="infinite_scroll"
  [toggled]="pageViewMode == 'infinite-scroll'"
  [action]="onClick"
  l10nLabel="pdfjs-infinite-scroll-button-label"
  [order]="3400"
  [closeOnClick]="false"
  image="<svg xmlns='http://www.w3.org/2000/svg' height= '24' viewBox= '0 -960 960 960' width='24'><path d= 'M212-260q-90 0-151-65.5T0-482q0-90 61.5-154T212-700q36 0 69.5 12t59.5 37l93 90-42 42-89-87q-18-18-41.5-26t-49.5-8q-64 0-108 46.5T60-482q0 66 43.5 114T212-320q25 0 48.5-8t42.5-25l316-298q26-25 59.5-37t68.5-12q90 0 151.5 64T960-482q0 91-61.5 156.5T747-260q-35 0-69-11.5T619-308l-91-90 42-42 87 87q17 17 41 25t49 8q65 0 109-48t44-114q0-65-44.5-111.5T747-640q-25 0-48.5 9T657-605L341-307q-26 24-60 35.5T212-260Z '/></svg>"
>
</pdf-shy-button>
```

The clumsy `[cssClass]` definition allows you to define the breakpoint using a shortcut. Legal values are `always-visible` , `always-in-secondary-menu` , `xxs` , `xs` , `sm` , `md` , `lg` , `xl` , and `xxl`. `xxl` means the button is only visible in the toolbar on very large screens, while `xxs` means it's visible on fairly small screens.

The two `l10n` attributes use the translation tables of pdf.js. They're useless for you unless you can use one of the
pre-defined texts of the `viewer.properties` file. In most cases, `[title]` should to the trick just as well.

`[order]` determines where the button appears in the secondary menu. The default buttons use increments of 100, so you can insert 99 custom menu items between two default menu items. If the button shows in the toolbar, its position is determined by the position in the source code (plus CSS - in other words, it's the exactly the behavior you'd expect).

The `[action]` attribute is a bit tricky. You can't use `this` in the event listener method because the event listener is used both for the toolbar (`this` is available here) and the secondary menu (`this` is undefined here). I'm sure I've selected a clumsy solution, but here's my current approach:

```ts
export class PdfInfiniteScrollComponent {
  @Input() 
  public pageViewMode: PageViewModeType;

  @Output()
  public pageViewModeChange = new EventEmitter<PageViewModeType>();

  public onClick: () => void;

  constructor() {
    const emitter = this.pageViewModeChange;
    this.onClick = () => {
      setTimeout(() => {
           emitter.emit('infinite-scroll');
      });
    };
  }
}
```
The key idea is to define the event listener in the constructor, where you can capture `this` in a constant.
