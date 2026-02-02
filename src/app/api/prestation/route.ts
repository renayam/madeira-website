import { NextResponse } from "next/server";
import { Prestation } from "@/db";
import { uploadFile } from "@/service/xbackbone";
import { getProxiedImageUrl } from "@/lib/image-proxy";

function transformPrestationImages(prestation: any) {
  return {
    ...prestation,
    bannerImage: getProxiedImageUrl(prestation.bannerImage),
    otherImage: Array.isArray(prestation.otherImage)
      ? prestation.otherImage.map((url: string) => getProxiedImageUrl(url))
      : [],
  };
}

export async function GET() {
  const items = await Prestation.findAll();
  return NextResponse.json(items.map(transformPrestationImages));
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  let bannerImage = formData.get("bannerImage");

  if (bannerImage instanceof File) {
    const buffer = await bannerImage.arrayBuffer();
    bannerImage = await uploadFile(
      Buffer.from(buffer),
      `prestations/banner/${Date.now()}-${bannerImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
    );
  }

  const item = await Prestation.create({
    name,
    description,
    bannerImage,
  } as any);

  return NextResponse.json(transformPrestationImages(item));
}
