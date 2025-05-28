# Документация для `route.ts`

*Путь к файлу: `src/app\api\pricing-types\add-column-to-options\route.ts`*

## Зависимости файла

```mermaid
flowchart TD
    route_ts[route.ts]
    db[@/lib/db]
    route_ts --> db
    server[next/server]
    route_ts --> server
```

### `GET` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ message: string; }> \| import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ error: string; }>>`

*Источник: `src/app\api\pricing-types\add-column-to-options\route.ts`*

---
