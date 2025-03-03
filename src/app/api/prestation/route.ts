import { DatabaseService } from "@/service/storage.server";
import { Prestation, PrestationModel } from "@/types/prestation";
import { NextResponse } from "next/server";
import { imageStorage } from "@/service/minio";

export async function GET() {
  try {
    const d = DatabaseService.getInstance();
    const p = await PrestationModel.initialize(d);
    const prestations = await p.findAll();
    return NextResponse.json(prestations);
  } catch (error) {
    console.error("Error fetching prestations:", error);
    return NextResponse.json(
      { error: "Failed to fetch prestations" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    // Log the received data for debugging
    console.log("Received FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
    }

    // Extract and validate required fields
    const name = formData.get("name");
    const description = formData.get("description");
    const bannerImage = formData.get("bannerImage");
    const otherImages = formData.getAll("otherImage"); // Get all otherImage files

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required and must be a string" },
        { status: 400 }
      );
    }

    // Upload images to Minio if they exist
    let bannerImageUrl = "";
    let otherImageUrls: string[] = [];

    if (bannerImage && bannerImage instanceof File) {
      try {
        const buffer = await bannerImage.arrayBuffer();
        const result = await imageStorage.uploadFile({
          file: Buffer.from(buffer),
          key: `prestations/banner/${Date.now()}-${bannerImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          contentType: bannerImage.type || 'image/jpeg',
        });
        bannerImageUrl = result.url;
        console.log("Banner image uploaded successfully:", bannerImageUrl);
      } catch (error) {
        console.error("Error uploading banner image:", error);
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500 }
        );
      }
    }

    // Upload all other images
    for (const otherImage of otherImages) {
      if (otherImage instanceof File) {
        try {
          const buffer = await otherImage.arrayBuffer();
          const result = await imageStorage.uploadFile({
            file: Buffer.from(buffer),
            key: `prestations/other/${Date.now()}-${otherImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
            contentType: otherImage.type || 'image/jpeg',
          });
          otherImageUrls.push(result.url);
          console.log("Other image uploaded successfully:", result.url);
        } catch (error) {
          console.error("Error uploading other image:", error);
          return NextResponse.json(
            { error: "Failed to upload other image" },
            { status: 500 }
          );
        }
      }
    }

    // Initialize database connection
    const d = DatabaseService.getInstance();
    const p = await PrestationModel.initialize(d);

    // Create the prestation with the image URLs
    const prestationData: Prestation = {
      name,
      description,
      bannerImage: bannerImageUrl || '',  // Ensure we always have a string
      otherImage: otherImageUrls.join(','),  // Join multiple URLs with comma
    };

    console.log("Creating prestation with data:", prestationData);

    try {
      const prestation = await p.create(prestationData);
      console.log("Prestation created successfully:", prestation.toJSON());
      return NextResponse.json(prestation);
    } catch (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save prestation to database", details: dbError instanceof Error ? dbError.message : String(dbError) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating prestation:", error);
    return NextResponse.json(
      { error: "Failed to create prestation", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
