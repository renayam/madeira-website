import { NextResponse } from "next/server";
import { PortfolioItem } from "@/db";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import { uploadFile } from "@/service/xbackbone";

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
  const altText = formData.get("altText") as string;
  let mainImage = formData.get("mainImage");

  if (mainImage instanceof File) {
    const buffer = await mainImage.arrayBuffer();
    mainImage = await uploadFile(
      Buffer.from(buffer),
      `portfolio/main/${Date.now()}-${mainImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
    );
  } else {
    mainImage = mainImage as string;
  }

  const item = await PortfolioItem.create({
    title,
    description,
    mainImage,
    altText,
  } as any);

  return NextResponse.json(transformPortfolioImages(item.toJSON()));
}
