# API Route Learnings

## Response Transformation Pattern

- Create helper functions to transform API responses (e.g., `transformPrestationImages`)
- Transform at the edge before returning to avoid duplicate transformation logic
- Pattern:
  ```typescript
  function transformItem(item: any) {
    return {
      ...item,
      imageUrl: getProxiedImageUrl(item.imageUrl),
    };
  }
  export async function GET() {
    const items = await Model.findAll();
    return NextResponse.json(items.map(transformItem));
  }
  ```

## TypeScript in Map Callbacks

- Map callbacks with implicit `any` cause strict TypeScript errors
- Explicitly type: `item.otherImage.map((url: string) => getProxiedImageUrl(url))`
- This is common in transformation functions using `any` input types from ORM models

## File Upload API Pattern

- All APIs accepting image uploads must handle File objects, not just URL strings
- Pattern: Check `instanceof File` before processing, upload to XBackBone if true
- Never pass File objects to functions expecting strings (e.g., getProxiedImageUrl)
- TypeScript fix: Declare variable as `let field = formData.get("field")` without type, then check `if (field instanceof File)`
  ```typescript
  let mainImage = formData.get("mainImage");
  if (mainImage instanceof File) {
    const buffer = await mainImage.arrayBuffer();
    mainImage = await uploadFile(
      Buffer.from(buffer),
      `path/${Date.now()}-${mainImage.name}`,
    );
  } else {
    mainImage = mainImage as string;
  }
  ```

## Multiple File Fields in Single Endpoint

- When a form has multiple file upload fields (e.g., bannerImage, otherImage), ALL must be explicitly processed
- Missing a field causes silent failure - data appears sent but isn't saved
- Use `formData.getAll("field")` for multiple files, iterate and check `instanceof File`:
  ```typescript
  const otherImageFiles = formData.getAll("otherImage");
  const otherImageUrls: string[] = [];
  for (const file of otherImageFiles) {
    if (file instanceof File) {
      const buffer = await file.arrayBuffer();
      const url = await uploadFile(
        Buffer.from(buffer),
        `path/${Date.now()}-${file.name}`,
      );
      otherImageUrls.push(url);
    }
  }
  ```

## Sequelize create and Array Fields

- Sequelize models with JSON array fields (otherImage) need explicit array passed to `create()`
- The model's setter handles serialization, but `create()` needs raw array
- Pattern: `Model.create({ ..., otherImage: otherImageUrls })` not just `create({ ... })`
