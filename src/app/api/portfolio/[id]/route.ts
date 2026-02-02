import { DatabaseService } from "../../../../service/storage.server";
import { PortfolioItemModel } from "@/types/portfolio";
import { NextResponse, NextRequest } from "next/server";
import { uploadFile } from "@/service/xbackbone";

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid portfolio ID" },
        { status: 400 },
      );
    }

    const instance = await DatabaseService.getInstance();
    await PortfolioItemModel.initialize(instance);

    const portfolioItem = await PortfolioItemModel.findByPk(id);
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
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    // with pop
    const id = request.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json(
        { error: "Invalid portfolio ID" },
        { status: 400 },
      );
    }

    // Log received data for debugging
    console.log("Received FormData entries for update:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value,
      );
    }

    const instance = await DatabaseService.getInstance();
    await PortfolioItemModel.initialize(instance);

    // Find the existing portfolio item
    const portfolioItem = await PortfolioItemModel.findByPk(id);
    if (!portfolioItem) {
      return NextResponse.json(
        { error: "Portfolio item not found" },
        { status: 404 },
      );
    }

    // Extract form data
    const title = formData.get("title");
    const description = formData.get("description");
    const mainImage = formData.get("mainImage");
    const altText = formData.get("altText");
    const otherImages = formData.getAll("otherImage");
    const deletedImages = formData.getAll("deletedImages");

    // Handle main image update if provided
    let mainImageUrl = portfolioItem.mainImage;
    if (mainImage instanceof File) {
      try {
        const buffer = await mainImage.arrayBuffer();
        const filename = `portfolio/${Date.now()}-${mainImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        mainImageUrl = await uploadFile(Buffer.from(buffer), filename);
        console.log("Updated main image uploaded successfully:", mainImageUrl);
      } catch (error) {
        console.error("Error uploading updated main image:", error);
        return NextResponse.json(
          { error: "Failed to upload main image" },
          { status: 500 },
        );
      }
    }

    // Handle other images
    let existingOtherImages = Array.isArray(portfolioItem.otherImage)
      ? portfolioItem.otherImage
      : typeof portfolioItem.otherImage === "string"
        ? portfolioItem.otherImage.split(",").filter(Boolean)
        : [];

    // Remove deleted images from the existing array
    if (deletedImages.length > 0) {
      existingOtherImages = existingOtherImages.filter(
        (img: string) => !deletedImages.includes(img),
      );
    }

    // Upload new other images
    const newOtherImageUrls: string[] = [];
    for (const image of otherImages) {
      if (image instanceof File) {
        try {
          const buffer = await image.arrayBuffer();
          const filename = `portfolio/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
          const imageUrl = await uploadFile(Buffer.from(buffer), filename);
          newOtherImageUrls.push(imageUrl);
          console.log("New other image uploaded successfully:", imageUrl);
        } catch (error) {
          console.error("Error uploading new other image:", error);
          // Continue with remaining images even if one fails
        }
      }
    }

    // Combine existing and new other images
    const finalOtherImages = [...existingOtherImages, ...newOtherImageUrls];

    // Update the portfolio item
    const updatedPortfolio = await portfolioItem.update({
      title: (title as string) || portfolioItem.title,
      description: (description as string) || portfolioItem.description,
      mainImage: mainImageUrl,
      otherImage: finalOtherImages,
      altText: (altText as string) || portfolioItem.altText,
    });

    console.log(
      "Portfolio item updated successfully:",
      updatedPortfolio.toJSON(),
    );
    return NextResponse.json(updatedPortfolio);
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 },
    );
  }
}
