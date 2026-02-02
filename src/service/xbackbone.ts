import { logger } from "@/lib/logger";
import { getRequestId } from "@/lib/request-context";

interface XBackBoneUploadResponse {
  url: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const SLOW_UPLOAD_THRESHOLD = 500; // Log warning if upload takes >500ms

export async function uploadFile(
  file: File | Buffer,
  filename: string,
): Promise<string> {
  const requestId = getRequestId();
  const startTime = performance.now();

  const xbackboneUrl = process.env.XBACKBONE_URL;
  const token = process.env.XBACKBONE_TOKEN;

  if (!xbackboneUrl) {
    throw new Error("XBACKBONE_URL environment variable is not set");
  }

  if (!token) {
    throw new Error("XBACKBONE_TOKEN environment variable is not set");
  }

  // Check file size
  let fileSize: number;
  if (file instanceof Buffer) {
    fileSize = file.length;
  } else if (typeof File !== "undefined" && file instanceof File) {
    fileSize = file.size;
  } else {
    throw new Error("Invalid file type: expected File or Buffer");
  }

  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(
      `File size exceeds 2MB limit. Current size: ${(fileSize / 1024 / 1024).toFixed(2)}MB`,
    );
  }

  logger.info("Starting file upload to xbackbone", {
    requestId,
    filename,
    fileSize,
    fileSizeMB: (fileSize / 1024 / 1024).toFixed(2),
  });

  const formData = new FormData();
  formData.append("token", token);

  if (file instanceof Buffer) {
    const blob = new Blob([file as unknown as BlobPart]);
    formData.append("file", blob, filename);
  } else if (typeof File !== "undefined" && file instanceof File) {
    formData.append("file", file);
  } else {
    throw new Error("Invalid file type: expected File or Buffer");
  }

  try {
    const response = await fetch(`${xbackboneUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    const duration = performance.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("File upload failed", {
        requestId,
        filename,
        status: response.status,
        duration,
        error: errorText,
      });
      throw new Error(`Upload failed: ${response.status} - ${errorText}`);
    }

    const rawResponseText = await response.text();
    logger.info("XBackBone raw response", {
      requestId,
      filename,
      status: response.status,
      responseLength: rawResponseText.length,
      responsePreview: rawResponseText.substring(0, 200),
    });

    let data: XBackBoneUploadResponse;
    try {
      data = JSON.parse(rawResponseText);
    } catch (parseError) {
      logger.error("Failed to parse XBackBone response", {
        requestId,
        filename,
        rawResponse: rawResponseText,
        parseError,
      });
      throw new Error("Invalid JSON response from XBackBone");
    }

    if (!data.url) {
      logger.error("XBackBone response missing URL field", {
        requestId,
        filename,
        responseData: data,
      });
      throw new Error("Upload response missing URL field");
    }

    // Log performance warning if upload is slow
    if (duration > SLOW_UPLOAD_THRESHOLD) {
      logger.warn("Slow file upload detected", {
        requestId,
        filename,
        duration,
        fileSize,
        threshold: SLOW_UPLOAD_THRESHOLD,
      });
    }

    logger.info("File upload completed successfully", {
      requestId,
      filename,
      duration,
      fileSize,
    });

    // Verify URL is accessible (may not be ready immediately)
    const verified = await verifyUpload(data.url);
    if (!verified) {
      logger.warn(
        "Upload URL verification failed - file may not be ready yet",
        {
          requestId,
          url: data.url,
        },
      );
    }

    return data.url;
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error("File upload error", {
      requestId,
      filename,
      duration,
      error,
    });
    throw error;
  }
}

export async function verifyUpload(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch (error) {
    logger.warn("Could not verify upload URL", { url, error });
    return false;
  }
}
