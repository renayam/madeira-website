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
