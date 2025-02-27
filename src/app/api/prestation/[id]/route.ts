import { DatabaseService } from "@/service/storage";
import { PrestationModel, Prestation } from "@/types/prestation";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  console.log(params);
  const { id } = params;

  try {
    // Validate ID
    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Find the prestation
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
  const id = request.nextUrl.href.split("/").pop();
  if (!id) {
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });
  }

  try {
    // Parse request body
    const requestBody = await request.json();

    // Validate request body
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

    // Find the existing prestation
    const con = DatabaseService.getInstance();
    await PrestationModel.initialize(con);
    const existingPrestation = await PrestationModel.findByPk(id);

    // Check if prestation exists
    if (!existingPrestation) {
      return NextResponse.json(
        { error: "Prestation not found" },
        { status: 404 },
      );
    }

    // Perform the update with type assertion
    const updatedPrestation = await existingPrestation.update(
      validationResult.data as Partial<Prestation>,
    );

    // Return updated prestation
    return NextResponse.json(
      {
        message: "Prestation successfully updated",
        prestation: updatedPrestation,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

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
