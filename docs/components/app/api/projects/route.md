# Документация для `route.ts`

*Путь к файлу: `src/app\api\projects\route.ts`*

## Зависимости файла

```mermaid
flowchart TD
    route_ts[route.ts]
    server[next/server]
    route_ts --> server
    db[@/lib/db]
    route_ts --> db
```

### `GET` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<any>>`

*Источник: `src/app\api\projects\route.ts`*

---
### `POST` (ReactComponent)

**Пропсы (Props):**

| Имя | Тип | Обязательный | Описание |
|---|---|---|---|
| `cache` | `RequestCache` | Да | Returns the cache mode associated with request, which is a string indicating how the request will interact with the browser's cache when fetching.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/cache) |
| `credentials` | `RequestCredentials` | Да | Returns the credentials mode associated with request, which is a string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/credentials) |
| `destination` | `RequestDestination` | Да | Returns the kind of resource requested by request, e.g., "document" or "script".

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/destination) |
| `headers` | `Headers` | Да | Returns a Headers object consisting of the headers associated with request. Note that headers added in the network layer by the user agent will not be accounted for in this object, e.g., the "Host" header.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/headers) |
| `integrity` | `string` | Да | Returns request's subresource integrity metadata, which is a cryptographic hash of the resource being fetched. Its value consists of multiple hashes separated by whitespace. [SRI]

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/integrity) |
| `keepalive` | `boolean` | Да | Returns a boolean indicating whether or not request can outlive the global in which it was created. |
| `method` | `string` | Да | Returns request's HTTP method, which is "GET" by default.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/method) |
| `mode` | `RequestMode` | Да | Returns the mode associated with request, which is a string indicating whether the request will use CORS, or will be restricted to same-origin URLs.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/mode) |
| `redirect` | `RequestRedirect` | Да | Returns the redirect mode associated with request, which is a string indicating how redirects for the request will be handled during fetching. A request will follow redirects by default.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/redirect) |
| `referrer` | `string` | Да | Returns the referrer of request. Its value can be a same-origin URL if explicitly set in init, the empty string to indicate no referrer, and "about:client" when defaulting to the global's default. This is used during fetching to determine the value of the `Referer` header of the request being made.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/referrer) |
| `referrerPolicy` | `ReferrerPolicy` | Да | Returns the referrer policy associated with request. This is used during fetching to compute the value of the request's referrer.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/referrerPolicy) |
| `signal` | `AbortSignal` | Да | Returns the signal associated with request, which is an AbortSignal object indicating whether or not request has been aborted, and its abort event handler.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/signal) |
| `url` | `string` | Да | Returns the URL of request as a string.

[MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/url) |
| `clone` | `() => Request` | Да | [MDN Reference](https://developer.mozilla.org/docs/Web/API/Request/clone) |
| `body` | `ReadableStream<Uint8Array>\|null` | Да |  |
| `bodyUsed` | `boolean` | Да |  |
| `arrayBuffer` | `() => Promise<ArrayBuffer>` | Да |  |
| `blob` | `() => Promise<Blob>` | Да |  |
| `bytes` | `() => Promise<Uint8Array<ArrayBufferLike>>` | Да |  |
| `formData` | `() => Promise<FormData>` | Да |  |
| `json` | `() => Promise<any>` | Да |  |
| `text` | `() => Promise<string>` | Да |  |

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<any>>`

*Источник: `src/app\api\projects\route.ts`*

---
