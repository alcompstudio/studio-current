# Документация для `route.ts`

*Путь к файлу: `src/app\api\project-statuses\route.ts`*

## Зависимости файла

```mermaid
flowchart TD
    route_ts[route.ts]
    server[next/server]
    route_ts --> server
    models[@/lib/models]
    route_ts --> models
    ProjectStatusOS[@/lib/models/ProjectStatusOS]
    route_ts --> ProjectStatusOS
    ProjectStatusOS[@/lib/models/ProjectStatusOS]
    route_ts --> ProjectStatusOS
```

### `GET` (ReactComponent)

**Возвращает:** `Promise<import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<import("E:/Business/Projects/studio/src/lib/models/ProjectStatusOS").ProjectStatusOSAttributes[]> \| import("E:/Business/Projects/studio/node_modules/next/dist/server/web/spec-extension/response").NextResponse<{ error: string; details: string; }>>`

*Источник: `src/app\api\project-statuses\route.ts`*

---
