# Документация для `route.ts`

*Путь к файлу: `src/app\api\pricing-types\create-table\route.ts`*

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

### `POST` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ message: string; created: boolean; }> \| import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ error: string; }>>`

*Источник: `src/app\api\pricing-types\create-table\route.ts`*

---
### `GET` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ message: string; exists: boolean; records: any; }> \| import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ error: string; }>>`

*Источник: `src/app\api\pricing-types\create-table\route.ts`*

---
