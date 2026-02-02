import { NextResponse } from "next/server";
import { Prestation } from "@/db";
import { uploadFile } from "@/service/xbackbone";
import { getProxiedImageUrl } from "@/lib/image-proxy";
import * as Sentry from "@sentry/nextjs";

function transformPrestationImages(prestation: any) {
  return {
    ...prestation,
    bannerImage: getProxiedImageUrl(prestation.bannerImage),
    otherImage: Array.isArray(prestation.otherImage)
      ? prestation.otherImage.map((url: string) => getProxiedImageUrl(url))
      : [],
  };
}

export async function GET() {
  return Sentry.startSpan(
    {
      name: "api.prestation.list",
      op: "http.request",
      attributes: {
        "http.method": "GET",
        "http.url": "/api/prestation",
      },
    },
    async (span) => {
      try {
        span.addEvent("db.query.started");
        const items = await Prestation.findAll();
        span.addEvent("db.query.completed", { count: items.length });

        const plainItems = items.map((i) => i.get({ plain: true }));
        span.addEvent("data.fetched", {
          total_items: plainItems.length,
          sample_ids: plainItems.slice(0, 3).map((i) => i.id),
        });

        const result = plainItems.map(transformPrestationImages);
        span.addEvent("response.prepared", {
          items_count: result.length,
          has_items: result.length > 0,
          first_item_id: result[0]?.id,
        });

        return NextResponse.json(result);
      } catch (error) {
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : "Error",
        });
        span.addEvent("error", { error: String(error) });
        throw error;
      }
    },
  );
}

export async function POST(request: Request) {
  return Sentry.startSpan(
    {
      name: "api.prestation.create",
      op: "http.request",
      attributes: {
        "http.method": "POST",
        "http.url": "/api/prestation",
      },
    },
    async (span) => {
      try {
        const formData = await request.formData();
        span.addEvent("formData.received", {
          has_name: !!formData.get("name"),
          has_description: !!formData.get("description"),
          has_banner: formData.get("bannerImage") instanceof File,
        });

        const name = formData.get("name") as string;
        const description = formData.get("description") as string;
        const otherImageFiles = formData.getAll("otherImage");

        span.setAttribute("prestation.name", name);
        span.addEvent("files.received", {
          other_image_count: otherImageFiles.filter(
            (f): f is File => f instanceof File,
          ).length,
        });

        let bannerImage = formData.get("bannerImage");
        if (bannerImage instanceof File) {
          span.addEvent("upload.started", {
            file_name: bannerImage.name,
            file_size: bannerImage.size,
          });

          const buffer = await bannerImage.arrayBuffer();
          bannerImage = await uploadFile(
            Buffer.from(buffer),
            `prestations/banner/${Date.now()}-${bannerImage.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
          );

          span.addEvent("upload.completed", { url: bannerImage });
        }

        const otherImageUrls: string[] = [];
        for (const file of otherImageFiles) {
          if (file instanceof File) {
            const buffer = await file.arrayBuffer();
            const url = await uploadFile(
              Buffer.from(buffer),
              `prestations/other/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`,
            );
            otherImageUrls.push(url);
          }
        }

        span.addEvent("other_images.uploaded", {
          count: otherImageUrls.length,
        });

        span.addEvent("db.create.started");
        const item = await Prestation.create({
          name,
          description,
          bannerImage,
          otherImage: otherImageUrls,
        } as any);

        span.setAttribute("prestation.id", item.id);
        span.addEvent("db.create.completed", { id: item.id });

        const plainItem = item.get({ plain: true });
        span.addEvent("response.prepared", {
          id: plainItem.id,
          name: plainItem.name,
          bannerImage: !!plainItem.bannerImage,
          otherImage_type: typeof plainItem.otherImage,
          otherImage_value: JSON.stringify(plainItem.otherImage)?.substring(
            0,
            100,
          ),
        });

        const response = transformPrestationImages(plainItem);
        span.addEvent("response.transformed", {
          has_id: !!response.id,
          has_name: !!response.name,
          bannerImage: !!response.bannerImage,
          otherImage_isArray: Array.isArray(response.otherImage),
          otherImage_length: response.otherImage?.length,
        });

        return NextResponse.json(response);
      } catch (error) {
        span.setStatus({
          code: 2,
          message: error instanceof Error ? error.message : "Error",
        });
        span.addEvent("error", { error: String(error) });
        throw error;
      }
    },
  );
}
