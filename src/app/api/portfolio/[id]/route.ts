import { NextResponse, NextRequest } from "next/server";
import { uploadFile } from "@/service/xbackbone";
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

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid portfolio ID" },
        { status: 400 },
      );
    }

    const portfolioItem = await PortfolioItem.findByPk(id);
    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    await portfolioItem.destroy();
    return NextResponse.json({
      message: "Portfolio item deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete portfolio item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid portfolio ID" },
        { status: 400 },
      );
    }

    const portfolioItem = await PortfolioItem.findByPk(id);
    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const mainImage = formData.get("mainImage") as File;
    const altText = formData.get("altText") as string;
    const otherImages = formData.getAll("otherImage");
    const deletedImages = formData.getAll("deletedImages");

    let mainImageUrl = portfolioItem.mainImage;
    if (mainImage instanceof File) {
      const buffer = await mainImage.arrayBuffer();
      const filename = `portfolio/${Date.now()}-${mainImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      mainImageUrl = await uploadFile(Buffer.from(buffer), filename);
    }

    let existingOtherImages = portfolioItem.otherImage || [];
    if (deletedImages.length > 0) {
      existingOtherImages = existingOtherImages.filter(
        (img: string) => !deletedImages.includes(img),
      );
    }

    const newOtherImageUrls: string[] = [];
    for (const image of otherImages) {
      if (image instanceof File) {
        const buffer = await image.arrayBuffer();
        const filename = `portfolio/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const imageUrl = await uploadFile(Buffer.from(buffer), filename);
        newOtherImageUrls.push(imageUrl);
      }
    }

    const finalOtherImages = [...existingOtherImages, ...newOtherImageUrls];

    const updatedPortfolio = await portfolioItem.update({
      title: title || portfolioItem.title,
      description: description || portfolioItem.description,
      mainImage: mainImageUrl,
      otherImage: finalOtherImages,
      altText: altText || portfolioItem.altText,
    } as any);

    return NextResponse.json(
      transformPortfolioImages(updatedPortfolio.toJSON()),
    );
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
