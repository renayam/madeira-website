import { NextRequest, NextResponse } from "next/server";
import { PortfolioItemCreate } from "@/types/portfolio";
import { PortfolioItemModel } from "@/types/portfolio";
import { DatabaseService } from "@/service/storage.server";
import { imageStorage } from "@/service/minio";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Log received data for debugging
        console.log("Received FormData entries:");
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
        }

        // Extract and validate required fields
        const title = formData.get("title");
        const description = formData.get("description");
        const mainImage = formData.get("mainImage");
        const altText = formData.get("altText");

        if (!title || typeof title !== "string") {
            return NextResponse.json(
                { error: "Title is required and must be a string" },
                { status: 400 }
            );
        }

        // Upload main image to Minio if it exists
        let mainImageUrl = "";
        if (mainImage && mainImage instanceof File) {
            try {
                const buffer = await mainImage.arrayBuffer();
                const result = await imageStorage.uploadFile({
                    file: Buffer.from(buffer),
                    key: `portfolio/${Date.now()}-${mainImage.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
                    contentType: mainImage.type || 'image/jpeg',
                });
                mainImageUrl = result.url;
                console.log("Main image uploaded successfully:", mainImageUrl);
            } catch (error) {
                console.error("Error uploading main image:", error);
                return NextResponse.json(
                    { error: "Failed to upload main image" },
                    { status: 500 }
                );
            }
        }

        // Create portfolio item with the image URL
        const portfolioData: PortfolioItemCreate = {
            title,
            description: description as string || "",
            mainImage: mainImageUrl,
            altText: altText as string || "",
        };

        console.log("Creating portfolio item with data:", portfolioData);

        const instance = await DatabaseService.getInstance();
        await PortfolioItemModel.initialize(instance);
        const portfolioItem = await PortfolioItemModel.create({
            id: crypto.randomUUID(), // Add required id field
            ...portfolioData
        });

        console.log("Portfolio item created successfully:", portfolioItem.toJSON());
        return NextResponse.json(portfolioItem);
    } catch (error) {
        console.error('Failed to create portfolio item:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const instance = await DatabaseService.getInstance();
        await PortfolioItemModel.initialize(instance);
        const portfolioItems = await PortfolioItemModel.findAll();

        return NextResponse.json(portfolioItems);
    } catch (error) {
        console.error('Failed to get portfolio items:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'An unknown error occurred' },
            { status: 500 }
        );
    }
}