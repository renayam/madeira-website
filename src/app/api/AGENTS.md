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
