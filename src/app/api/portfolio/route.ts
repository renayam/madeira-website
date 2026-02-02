import { NextResponse } from "next/server";
import { PortfolioItem } from "@/db";
import { getProxiedImageUrl } from "@/lib/image-proxy";

function transformPortfolioImages(item: any) {
  return {
    ...item,
    mainImage: getProxiedImageUrl(item.mainImage),
    otherImage: Array.isArray(item.otherImage)
      ? item.otherImage.map((url: string) => getProxiedImageUrl(url))
      : [],
  };
}

export async function GET() {
  const items = await PortfolioItem.findAll();
  return NextResponse.json(items.map(transformPortfolioImages));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const mainImage = formData.get("mainImage") as string;
  const altText = formData.get("altText") as string;

  const item = await PortfolioItem.create({
    title,
    description,
    mainImage: getProxiedImageUrl(mainImage),
    altText,
  } as any);

  return NextResponse.json(transformPortfolioImages(item.toJSON()));
}
