import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "fr-par";
const BUCKET_NAME = "madeira";

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.SCW_ACCESS_KEY as string,
    secretAccessKey: process.env.SCW_SECRET_KEY as string,
  },
  endpoint: `https://s3.${REGION}.scw.cloud`,
  region: REGION,
  forcePathStyle: true, // Required for Scaleway
});

export async function getSpecificObjectUrl(
  objectKey: string,
): Promise<{ name: string; url: string }> {
  if (!objectKey) {
    throw new Error("Object key is required to generate the URL.");
  }
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: objectKey,
    });
    const url = await getSignedUrl(s3Client, command);
    return {
      name: objectKey,
      url,
    };
  } catch (error) {
    throw new Error(`Failed to get URL for ${objectKey}: ${error}`);
  }
}

export async function uploadFile(params: {
  file: Buffer | ArrayBuffer | Uint8Array | string | ReadableStream;
  key: string;
  contentType?: string;
  metadata?: Record<string, string>;
}): Promise<{ key: string; url: string }> {
  const {
    file,
    key,
    contentType = "application/octet-stream",
    metadata = {},
  } = params;

  if (!file) {
    throw new Error("File is required for upload");
  }

  if (!key) {
    throw new Error("Object key is required for upload");
  }

  try {
    // Prepare the input for PutObjectCommand
    const input = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    };

    // Upload the file
    await s3Client.send(new PutObjectCommand(input));

    // Generate a signed URL for the uploaded object
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3Client, command);

    return { key, url };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(
      `Failed to upload file to ${key}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export const imageStorage = { getSpecificObjectUrl, uploadFile };
