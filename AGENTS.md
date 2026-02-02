# Project Learnings

## Database Compatibility

- MariaDB connector 3.x is incompatible with Sequelize 6.x (causes "Cannot delete property 'meta' of [object Array]" error)
- Always use mariadb@2.5.6 with sequelize@6.x - check package.json before upgrading either

## Testing Strategy

- Testcontainers MariaDB has built-in health checks - never write bash wait scripts
- Jest doesn't auto-load .env files; tests must call `dotenv.config()` explicitly or use setupFiles

## npm Scripts

- Pre/post hooks referencing missing scripts cause "Missing script" errors (not "script not found")
- Always provide defaults for env vars in scripts: `"start": "next start -p ${PORT:-3000}"`

## Architecture Insights

- Database singletons with complex lifecycles (ready promises, reset methods) indicate over-engineering
- If you need bash scripts to test your code, the abstraction is wrong

## Next.js Instrumentation Hook

- `instrumentation.ts` runs in BOTH Node.js AND Edge runtimes
- Top-level imports in instrumentation.ts get bundled into Edge runtime
- Edge doesn't have `fs`, `path`, `pg-hstore` - causes "module not found" errors
- Solution: Use dynamic `await import()` inside `if (NEXT_RUNTIME === "nodejs")` block
- Database initialization must happen in the Node.js block only

## Sequelize Patterns

- Models must be initialized once using `initModel(sequelize)` before use
- Export initialized models directly from a single `db.ts` - no singletons needed
- Database connection/sync should happen once at startup via instrumentation, not per-request

## Next.js Image Component

- External image domains must be configured in `next.config.js` under `images.remotePatterns`
- Example: `{ protocol: "https", hostname: "xbackbone.madeira.eco" }`
- Blob URLs (from URL.createObjectURL) don't work with `<Image>` - use `<img>` instead
- Conditional render: `url.startsWith('http') ? <Image /> : <img />`

## Next.js 16+ Image Configuration

- Next.js 16.1.1 requires `localPatterns` for URLs with query strings like `/api/proxy-image?url=...`
- Static images like `/images/logo.png` also need `localPatterns` configuration
- Config format:
  ```javascript
  localPatterns: [
    { pathname: "/api/proxy-image", search: "url=*" },
    { pathname: "/images/**" },
  ];
  ```
- Clear Turbopack cache after config changes: `rm -rf .next/cache`

## File Upload Flow

- Frontend sends File → Backend uploads to XBackBone → gets URL → stores URL in DB
- `formData.get("field")` returns File or string - check `instanceof File` before processing
- Never cast FormData entries directly to string without checking type first

## XBackBone Image Proxy

- Node.js fetch/https modules return HTML (preview page) from XBackBone instead of images - curl works correctly
- Root cause: TLS/cipher suite compatibility issues between Node.js and certain servers (like nginx with PHP)
- Solution: Use curl with `encoding: "binary"` and `Buffer.from(body, "binary")` for reliable binary downloads
- URL encoding in proxy: Always use `encodeURIComponent` for query string values, not just URL construction

## TypeScript Form State Pattern

- When FormData includes both DB fields and File uploads, create separate interface extending DB type
- Example: `interface PrestationFormState extends PrestationCreate { bannerImageFile: File | null; otherImageFiles: File[]; }`
- Map callbacks with implicit `any` need explicit `(url: string)` typing to satisfy strict TypeScript

## Frontend-Context API Pattern

- When using context's AddPrestation/UpdatePrestation functions, do NOT make explicit fetch calls
- Context functions handle both API call AND state update - double calls cause race conditions
- Pattern: Call `AddPrestation(formData)` directly, not `fetch()` + `AddPrestation()`

## Image Tag Strategy

- For proxied images (proxy returns raw binary), use `<img>` instead of `<Image>` to bypass Next.js configuration
- `<img>` works with any URL format including query strings, blob URLs, and proxy URLs
- The proxy returns correct Content-Type headers, so browser handles rendering naturally
- Keep `<Image>` for static local assets only (e.g., `/images/logo.png`)

## Admin vs Public UI Design

- Admin panels show summary data (banner + name) for management purposes
- Public pages show full data with rich interactions (ImageSlider for gallery)
- When troubleshooting "missing" data, check if it's intentionally hidden in admin views
- Example: "Liste des Realisations" in admin only shows banner + name, other images are in public slider
