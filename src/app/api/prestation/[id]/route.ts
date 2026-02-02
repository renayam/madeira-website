import { Prestation } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { uploadFile } from "@/service/xbackbone";
import { getProxiedImageUrl } from "@/lib/image-proxy";

function transformPrestationImages(prestation: any) {
  return {
    ...prestation,
    bannerImage: getProxiedImageUrl(prestation.bannerImage),
    otherImage: Array.isArray(prestation.otherImage)
      ? prestation.otherImage.map((url: string) => getProxiedImageUrl(url))
      : [],
  };
}

const PrestationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  bannerImage: z.string().optional(),
});

const PrestationCreateSchema = PrestationSchema.omit({ id: true });
const PrestationUpdateSchema = PrestationSchema.partial();

export async function DELETE(request: NextRequest): Promise<Response> {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  const prestation = await Prestation.findByPk(id);
  if (!prestation)
    return NextResponse.json(
      { error: "Prestation not found" },
      { status: 404 },
    );

  await prestation.destroy();
  return NextResponse.json({ message: "Prestation deleted" }, { status: 200 });
}

export async function PUT(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const bannerImage = formData.get("bannerImage");
  const newOtherImages = formData.getAll("otherImage");

  const requestBody: any = { id: Number(id) };
  if (name) requestBody.name = name;
  if (description) requestBody.description = description;

  if (bannerImage instanceof File) {
    const buffer = await bannerImage.arrayBuffer();
    requestBody.bannerImage = await uploadFile(
      Buffer.from(buffer),
      `prestations/banner/${Date.now()}-${bannerImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
    );
  }

  const existingPrestation = (await Prestation.findByPk(id)) as any;
  if (!existingPrestation)
    return NextResponse.json(
      { error: "Prestation not found" },
      { status: 404 },
    );

  const otherImageUrls = Array.isArray(existingPrestation.otherImage)
    ? [...existingPrestation.otherImage]
    : [];
  for (const newImage of newOtherImages) {
    if (newImage instanceof File) {
      const buffer = await newImage.arrayBuffer();
      const result = await uploadFile(
        Buffer.from(buffer),
        `prestations/other/${Date.now()}-${newImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
      );
      otherImageUrls.push(result);
    }
  }
  if (otherImageUrls.length > 0) requestBody.otherImage = otherImageUrls;

  const updatedPrestation = await existingPrestation.update(requestBody);
  const rawOtherImage =
    updatedPrestation.getDataValue?.("otherImage") ||
    updatedPrestation.otherImage;
  const response = {
    ...updatedPrestation.toJSON(),
    otherImage:
      typeof rawOtherImage === "string"
        ? rawOtherImage.split(",").filter(Boolean)
        : [],
  };

  return NextResponse.json(
    {
      message: "Prestation updated",
      prestation: transformPrestationImages(response),
    },
    { status: 200 },
  );
}

export async function PATCH(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  if (!id)
    return NextResponse.json({ error: "No ID provided" }, { status: 400 });

  const requestBody = await request.json();
  const validationResult = PrestationUpdateSchema.safeParse({
    id: Number(id),
    ...requestBody,
  });
  if (!validationResult.success)
    return NextResponse.json(
      { error: "Validation failed", details: validationResult.error.errors },
      { status: 400 },
    );

  const existingPrestation = await Prestation.findByPk(id);
  if (!existingPrestation)
    return NextResponse.json(
      { error: "Prestation not found" },
      { status: 404 },
    );

  const updatedPrestation = await existingPrestation.update(
    validationResult.data as any,
  );
  return NextResponse.json(
    {
      message: "Prestation partially updated",
      prestation: transformPrestationImages(updatedPrestation),
    },
    { status: 200 },
  );
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const validationResult = PrestationCreateSchema.safeParse(requestBody);
  if (!validationResult.success)
    return NextResponse.json(
      { error: "Validation failed", details: validationResult.error.errors },
      { status: 400 },
    );

  const newPrestation = await Prestation.create(validationResult.data as any);
  return NextResponse.json(
    {
      message: "Prestation created",
      prestation: transformPrestationImages(newPrestation),
    },
    { status: 201 },
  );
}
