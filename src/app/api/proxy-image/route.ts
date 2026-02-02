import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { execSync } from "child_process";

const XBACKBONE_DOMAIN = "xbackbone.madeira.eco";
const ALLOWED_PROTOCOLS = ["http:", "https:"];
const VALID_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp"];

function getConfig() {
  return {
    cacheMaxAge: parseInt(process.env.IMAGE_PROXY_CACHE_TTL || "3600", 10),
    maxSize: parseInt(process.env.IMAGE_PROXY_MAX_SIZE || "10485760", 10),
    logRequests: process.env.IMAGE_PROXY_LOG_REQUESTS === "true",
  };
}

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestId = request.headers.get("x-request-id") || crypto.randomUUID();
  const config = getConfig();

  if (config.logRequests) {
    logger.info("Image proxy request started", { requestId });
  }

  const imageUrl = request.nextUrl.searchParams.get("url");

  if (!imageUrl) {
    logger.warn("Missing image URL parameter", { requestId });
    return NextResponse.json(
      { error: "Missing 'url' query parameter" },
      { status: 400 },
    );
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    logger.warn("Invalid URL format", { requestId, url: imageUrl });
    return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
  }

  if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
    logger.warn("Disallowed protocol", {
      requestId,
      protocol: parsedUrl.protocol,
    });
    return NextResponse.json(
      { error: "Disallowed URL protocol" },
      { status: 400 },
    );
  }

  if (parsedUrl.hostname !== XBACKBONE_DOMAIN) {
    logger.warn("Disallowed hostname", {
      requestId,
      hostname: parsedUrl.hostname,
    });
    return NextResponse.json(
      { error: "Image must be hosted on xbackbone.madeira.eco" },
      { status: 403 },
    );
  }

  const pathname = parsedUrl.pathname.toLowerCase();
  const hasValidExtension = VALID_EXTENSIONS.some((ext) =>
    pathname.endsWith(ext),
  );

  if (!hasValidExtension) {
    logger.warn("Invalid image extension", { requestId, pathname });
    return NextResponse.json(
      { error: "Unsupported image format" },
      { status: 400 },
    );
  }

  if (config.logRequests) {
    logger.info("Fetching proxied image", {
      requestId,
      url: imageUrl,
      hostname: parsedUrl.hostname,
    });
  }

  try {
    const escapedUrl = imageUrl.replace(/'/g, "'\\''");

    const curlCommand = `curl -s -I '${escapedUrl}' 2>/dev/null`;
    const headersOutput = execSync(curlCommand, { encoding: "utf8" });

    const contentTypeMatch = headersOutput.match(/content-type:\s*([^\r\n]+)/i);
    const statusMatch = headersOutput.match(/HTTP\/[\d.]+\s+(\d+)/);
    const contentLengthMatch = headersOutput.match(/content-length:\s*(\d+)/i);

    const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;
    const contentType = contentTypeMatch ? contentTypeMatch[1].trim() : null;
    const contentLength = contentLengthMatch
      ? parseInt(contentLengthMatch[1], 10)
      : 0;

    if (!contentType || !contentType.startsWith("image/")) {
      logger.warn("Invalid content type or failed to fetch", {
        requestId,
        contentType,
        url: imageUrl,
        status,
        headersOutput: headersOutput.substring(0, 500),
      });
      return NextResponse.json(
        { error: "Response is not a valid image" },
        { status: status >= 400 ? status : 400 },
      );
    }

    if (contentLength > config.maxSize) {
      logger.warn("Image exceeds max size", {
        requestId,
        url: imageUrl,
        contentLength,
        maxSize: config.maxSize,
      });
      return NextResponse.json(
        { error: "Image file size exceeds limit" },
        { status: 413 },
      );
    }

    const bodyCommand = `curl -s -L '${escapedUrl}' 2>/dev/null`;
    const body = execSync(bodyCommand, { encoding: "binary" });

    if (!body || body.length === 0) {
      logger.warn("Empty response body", { requestId, url: imageUrl });
      return NextResponse.json(
        { error: "Empty image response" },
        { status: 500 },
      );
    }

    if (Buffer.byteLength(body, "binary") > config.maxSize) {
      logger.warn("Image body exceeds max size", {
        requestId,
        url: imageUrl,
        bodyLength: Buffer.byteLength(body, "binary"),
        maxSize: config.maxSize,
      });
      return NextResponse.json(
        { error: "Image file size exceeds limit" },
        { status: 413 },
      );
    }

    if (config.logRequests) {
      logger.info("Successfully proxied image", {
        requestId,
        url: imageUrl,
        contentType,
        contentLength: Buffer.byteLength(body, "binary"),
        cacheMaxAge: config.cacheMaxAge,
      });
    }

    return new NextResponse(Buffer.from(body, "binary"), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${config.cacheMaxAge}, immutable`,
        "Content-Length": Buffer.byteLength(body, "binary").toString(),
        "X-Proxy-Request-Id": requestId,
      },
    });
  } catch (error) {
    const message = "Failed to fetch image";

    logger.error("Error fetching proxied image", {
      requestId,
      url: imageUrl,
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json({ error: message }, { status: 502 });
  }
}
