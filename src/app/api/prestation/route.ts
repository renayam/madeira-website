import { DatabaseService } from "@/service/storage";
import { Prestation, PrestationModel } from "@/types/prestation";
import { NextResponse } from "next/server";

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
    // Get the request body and parse it
    const body = await request.json();

    const d = DatabaseService.getInstance();
    const p = await PrestationModel.initialize(d);

    // Use the body data to create the prestation
    const prestations = p.create({
      id: body.id,
      name: body.name,
      bannerImage: body.bannerImage,
      otherImage: body.otherImage,
      description: body.description,
    } as Prestation);

    return NextResponse.json(prestations);
  } catch (error) {
    console.error("Error creating prestation:", error);
    return NextResponse.json(
      { error: "Failed to create prestation" },
      { status: 500 },
    );
  }
}
