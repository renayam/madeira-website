import { DatabaseService } from "../../../../service/storage.server";
import { PrestationModel, Prestation } from "@/types/prestation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadFile } from "@/service/xbackbone";
import { Model } from "sequelize";

// Interface for the database model instance
interface PrestationInstance extends Model<Prestation>, Prestation {
  getDataValue(key: "otherImage"): string;
  getDataValue(key: string): string | number | undefined;
}

// Zod Schema based on Prestation type
const PrestationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  bannerImage: z.string().optional(),
  // otherImage: z.string().min(1, "Other image is required"),
  // description: z.string().min(1, "Description is required"),
});

// Schemas for different operations
const PrestationCreateSchema = PrestationSchema.omit({ id: true });
const PrestationUpdateSchema = PrestationSchema.partial();

export async function DELETE(request: NextRequest): Promise<Response> {
  // Extract the ID from the URL
  const id = request.nextUrl.pathname.split("/").pop();

  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    // Find the prestation
    const con = DatabaseService.getInstance();
    await PrestationModel.initialize(con);
    const prestation = await PrestationModel.findByPk(id);

    // Check if prestation exists
    if (!prestation) {
      return NextResponse.json(
        { error: "Prestation not found" },
        { status: 404 },
      );
    }

    // Delete the prestation
    await prestation.destroy();

    // Return successful response
    return NextResponse.json(
      { message: "Prestation successfully deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting prestation:", error);

    return NextResponse.json(
      {
        error: "Failed to delete the prestation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  console.log("Starting PUT request handler");
  const id = request.nextUrl.pathname.split("/").pop();
  console.log("Extracted ID:", id);

  if (!id) {
    console.log("No ID provided in request");
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    console.log("Parsing FormData from request");
    const formData = await request.formData();

    // Log the received data for debugging
    console.log("Received FormData entries:");
    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value,
      );
    }

    // Extract fields from formData
    const name = formData.get("name")?.toString();
    const description = formData.get("description")?.toString();
    const bannerImage = formData.get("bannerImage");
    const newOtherImages = formData.getAll("otherImage");

    // Initialize the request body
    const requestBody: Partial<Prestation> = {
      id: Number(id),
    };

    // Add name and description if provided
    if (name) requestBody.name = name;
    if (description) requestBody.description = description;

    // Handle banner image upload if provided
    if (bannerImage instanceof File) {
      try {
        const buffer = await bannerImage.arrayBuffer();
        requestBody.bannerImage = await uploadFile(
          Buffer.from(buffer),
          `prestations/banner/${Date.now()}-${bannerImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
        );
        console.log(
          "Banner image uploaded successfully:",
          requestBody.bannerImage,
        );
      } catch (error) {
        console.error("Error uploading banner image:", error);
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500 },
        );
      }
    }

    // Handle other images
    const otherImageUrls: string[] = [];

    // First, get the existing prestation to access current images
    console.log("Getting database connection");
    const con = DatabaseService.getInstance();
    await PrestationModel.initialize(con);

    console.log("Finding prestation with ID:", id);
    const existingPrestation = (await PrestationModel.findByPk(
      id,
    )) as PrestationInstance | null;

    if (!existingPrestation) {
      console.log("Prestation not found with ID:", id);
      return NextResponse.json(
        { error: "Prestation not found" },
        { status: 404 },
      );
    }

    // Get existing images from the database
    const currentImages = existingPrestation.otherImage;
    if (Array.isArray(currentImages)) {
      otherImageUrls.push(...currentImages);
    }

    // Upload and add new images
    for (const newImage of newOtherImages) {
      if (newImage instanceof File) {
        try {
          const buffer = await newImage.arrayBuffer();
          const result = await uploadFile(
            Buffer.from(buffer),
            `prestations/other/${Date.now()}-${newImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
          );
          otherImageUrls.push(result);
          console.log("Other image uploaded successfully:", result);
        } catch (error) {
          console.error("Error uploading other image:", error);
          return NextResponse.json(
            { error: "Failed to upload other image" },
            { status: 500 },
          );
        }
      }
    }

    // Update otherImage in requestBody with all URLs
    if (otherImageUrls.length > 0) {
      requestBody.otherImage = otherImageUrls;
    }

    console.log(
      "Updating prestation with body:",
      JSON.stringify(requestBody, null, 2),
    );
    // Perform the update
    const updatedPrestation = (await existingPrestation.update(
      requestBody,
    )) as PrestationInstance;

    // Get the raw value before it's processed by the getter
    const rawOtherImage = updatedPrestation.getDataValue("otherImage");

    // Convert the response to include parsed otherImage array
    const response = {
      ...updatedPrestation.toJSON(),
      otherImage:
        typeof rawOtherImage === "string"
          ? rawOtherImage.split(",").filter(Boolean)
          : [],
    };

    console.log("Successfully updated prestation:", response.id);
    // Return updated prestation
    return NextResponse.json(
      {
        message: "Prestation successfully updated",
        prestation: response,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update prestation error:", error);

    return NextResponse.json(
      {
        error: "Failed to update prestation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Parse request body
    const requestBody = await request.json();

    // Find the existing prestation
    const existingPrestation = await PrestationModel.findByPk(id);

    // Check if prestation exists
    if (!existingPrestation) {
      return NextResponse.json(
        { error: "Prestation not found" },
        { status: 404 },
      );
    }

    // Validate partial update
    const validationResult = PrestationUpdateSchema.safeParse({
      id: Number(id),
      ...requestBody,
    });

    // Check validation
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // Perform partial update with type assertion
    const updatedPrestation = await existingPrestation.update(
      validationResult.data as Partial<Prestation>,
    );

    // Return updated prestation
    return NextResponse.json(
      {
        message: "Prestation partially updated",
        prestation: updatedPrestation,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Partial update prestation error:", error);

    return NextResponse.json(
      {
        error: "Failed to partially update prestation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const requestBody = await request.json();

    // Validate request body
    const validationResult = PrestationCreateSchema.safeParse(requestBody);

    // Check validation
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    // Create new prestation
    const newPrestation = await PrestationModel.create(
      validationResult.data as Prestation,
    );

    // Return created prestation
    return NextResponse.json(
      {
        message: "Prestation successfully created",
        prestation: newPrestation,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create prestation error:", error);

    return NextResponse.json(
      {
        error: "Failed to create prestation",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
