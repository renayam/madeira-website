# Frontend Components Learnings

## Context API Pattern

- Context functions (AddPrestation, updatePortfolioItem) handle BOTH API calls AND state updates
- Never make explicit fetch calls before/after calling context functions - causes duplicate requests and race conditions
- Pattern: Call `AddPrestation(formData)` directly, not `fetch()` + `AddPrestation()`

## Image Display in Components

- For images from DB with proxy URLs, use `<img>` instead of `<Image>` to avoid Next.js configuration issues
- The proxy returns raw binary image data - `<img>` handles this correctly
- `<img>` works with any URL format (query strings, blob URLs, proxy URLs)
- Keep `<Image>` only for static local assets (e.g., `/images/logo.png`)

## Sentry Tracing for Debugging

- Use `Sentry.startSpan()` with clear names and events to trace data flow
- Track: API request start, response received, state updates with counts/IDs
- Event names should be self-descriptive: `span.addEvent("state.update.completed", { new_count: ... })`
- Search transactions by name: `transaction:context.AddPrestation`

## Image Slider Pattern

- For galleries, use ImageSlider component with array of image URLs
- Pattern: Click on main image → opens slider with all images (banner + otherImage)
- Handle both array and string formats for otherImage (defensive coding):
  ```typescript
  const otherImagesArray = Array.isArray(otherImages)
    ? otherImages
    : typeof otherImages === "string"
      ? otherImages.split(",").filter(Boolean)
      : [];
  const allImages = [mainImage, ...otherImagesArray];
  setSelectedImages(allImages);
  ```
