import { Prestation } from "@/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest): Promise<Response> {
  const id = request.nextUrl.pathname.split("/")[3];
  const imageUrl = request.nextUrl.searchParams.get("imageUrl");

  if (!id || !imageUrl) {
    return NextResponse.json(
      { error: "Missing ID or image URL" },
      { status: 400 },
    );
  }

  try {
    const prestation = await Prestation.findByPk(id);
    if (!prestation)
      return NextResponse.json(
        { error: "Prestation not found" },
        { status: 404 },
      );

    const currentImages = prestation.otherImage as
      | string
      | string[]
      | undefined;
    let otherImages: string[] = [];
    if (typeof currentImages === "string")
      otherImages = currentImages.split(",").filter(Boolean);
    else if (Array.isArray(currentImages)) otherImages = currentImages;

    const updatedImages = otherImages.filter((img) => img !== imageUrl);
    await prestation.update({ otherImage: updatedImages });

    return NextResponse.json(
      { message: "Image removed", updatedImages },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error removing image:", error);
    return NextResponse.json(
      { error: "Failed to remove image" },
      { status: 500 },
    );
  }
}
