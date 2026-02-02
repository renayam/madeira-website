# Image Proxy Feature Learnings

## XBackBone Compatibility

- Node.js native fetch returns HTML preview page instead of binary image from XBackBone
- curl with TLS handles XBackBone correctly - use curl in proxy for reliable image fetching
- When fetching binary data: `execSync(command, { encoding: "binary" })` + `Buffer.from(body, "binary")`

## Proxy URL Construction

- Always use `encodeURIComponent` when embedding URLs as query parameters
- Example: `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
- Direct string concatenation fails with special characters in URLs

## Two-Layer Transformation Pattern

- Transform URLs at API layer (automatic in responses) for consumer simplicity
- Transform URLs at component layer (manual before render) for explicit control
- Combine both: API adds proxy URLs, components can override if needed

## Error Handling

- Validate domain (allowlist only), protocol (https), and file extension
- Return 400 for missing URL, 403 for disallowed domain, 400 for invalid format
- Log request IDs for traceability in distributed systems
