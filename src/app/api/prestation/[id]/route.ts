import { PrestationModel } from "@/types/prestation";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
