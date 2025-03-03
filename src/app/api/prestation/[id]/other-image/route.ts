import { DatabaseService } from "../../../../../service/storage.server";
import { PrestationModel } from "@/types/prestation";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest): Promise<Response> {
  // Extract the ID from the URL
  const id = request.nextUrl.pathname.split("/")[3]; // Get prestation ID
  const imageUrl = request.nextUrl.searchParams.get("imageUrl");

  if (!id || !imageUrl) {
    return NextResponse.json({ error: "Missing ID or image URL" }, { status: 400 });
  }

  try {
    // Get database connection and initialize model
    const con = DatabaseService.getInstance();
    await PrestationModel.initialize(con);
    
    // Find the prestation
    const prestation = await PrestationModel.findByPk(id);

    if (!prestation) {
      return NextResponse.json({ error: "Prestation not found" }, { status: 404 });
    }

    // Get current other images
    const currentImages = prestation.otherImage;
    let otherImages: string[] = [];
    
    if (typeof currentImages === 'string') {
      otherImages = currentImages.split(',').filter(Boolean);
    } else if (Array.isArray(currentImages)) {
      otherImages = currentImages;
    }

    // Remove the specified image URL
    const updatedImages = otherImages.filter(img => img !== imageUrl);

    // Update the prestation with the new image array
    await prestation.update({
      otherImage: updatedImages
    });

    return NextResponse.json({
      message: "Image successfully removed",
      updatedImages
    }, { status: 200 });

  } catch (error) {
    console.error("Error removing image:", error);
    return NextResponse.json({
      error: "Failed to remove image",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 