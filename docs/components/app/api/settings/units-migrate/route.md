# Документация для `route.ts`

*Путь к файлу: `src/app\api\settings\units-migrate\route.ts`*

## Зависимости файла

```mermaid
flowchart TD
    route_ts[route.ts]
    db[@/lib/db]
    route_ts --> db
    server[next/server]
    route_ts --> server
```

### `POST` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ success: boolean; message: string; updated: number; errors: number; }> \| import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ success: boolean; error: string; details: string; }>>`

*Источник: `src/app\api\settings\units-migrate\route.ts`*

---
