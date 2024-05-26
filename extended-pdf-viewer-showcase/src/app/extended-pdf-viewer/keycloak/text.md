# Accessing a PDF file protected by Keycloak (or another authentification / authorization provider)

## Keycloak

To display the PDF file, you have to pass the attribute `authorization` like so:

```html
<ngx-extended-pdf-viewer
        [src]="'http://localhost:8080/api/documents/testpdf'"
        [authorization]="bearerToken"
>
</ngx-extended-pdf-viewer>
```

You must retrieve the bearer token in the TypeScript code. This might look like so:

```typescript
@Component(...)
export class NgxExtendedPdfTestComponent implements OnInit {
  public bearerToken: string | undefined = undefined;

  constructor(private keycloakService: KeycloakService) {}

  ngOnInit(): void {
    this.bearerToken = 'Bearer ' + this.keycloakService.getToken();
  }
}
```

Note that you have to add the prefix `"Bearer "` yourself. That's necessary because other auth servers don't require the prefix.

## Example project

<a target="#" href="https://github.com/MKITConsulting">Marcel Karras</a> kindly provided a demo project: https://github.com/stephanrauh/ngx-extended-pdf-viewer-issues/tree/main/oauth2-ngx-extended-pdf-viewer-test.

To run it, just follow the instructions of the readme file.

## Other auth providers

HMAC *should* work similarly, but it doesn't require the prefix `"Bearer "`. Just pass the access token to `authorization`.

If you need more flexibility, you can
<ul>
<li> use the attribute <code>httpHeaders</code> to pass an arbitrary array of http headers.</li>
<li>set <code>[authorization]="true"</code>. In this case, the authorization header is not set. However, the flag <code>withCredentials</code> of the <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials">XMLHttpRequest</a> is set to true. If pdf.js uses the modern fetch API instead, <code>withCredentials</code> activates the option <a href="https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#sending_a_request_with_credentials_included"><code>credentials: 'include'</code></a>.</li>
</ul>


