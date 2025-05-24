# Документация для `route.ts`

*Путь к файлу: `src/app\api\currencies\route.ts`*

## Зависимости файла

```mermaid
flowchart TD
    route_ts[route.ts]
    server[next/server]
    route_ts --> server
    models[@/lib/models]
    route_ts --> models
    models[@/lib/models]
    route_ts --> models
```

### `GET` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<any>>`

*Источник: `src/app\api\currencies\route.ts`*

---
