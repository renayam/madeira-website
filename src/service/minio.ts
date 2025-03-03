import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = "fr-par";
const BUCKET_NAME = "madeira";

/**
 * Creates and configures an S3 client for interacting with Scaleway Object Storage
 * @returns {S3Client} Configured S3 client instance
 * @private
 */
function getS3Client() {
  return new S3Client({
    credentials: {
      accessKeyId:
        (process.env.SCW_ACCESS_KEY as string) || "SCW633N1K1RPV2PY9GAN",
      secretAccessKey:
        (process.env.SCW_SECRET_KEY as string) ||
        "3c7aa4fb-ccd7-4798-8b60-5c6f70c6c468",
    },
    endpoint: `https://s3.${REGION}.scw.cloud`,
    region: REGION,
    forcePathStyle: true, // Required for Scaleway
  });
}

/**
 * Generates a signed URL for accessing a specific object in the storage
 * @param {string} objectKey - The key/path of the object to access
 * @returns {Promise<{name: string, url: string}>} Object containing the name and signed URL
 * @throws {Error} If object key is missing or if URL generation fails
 */
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
    const s3 = getS3Client();
    const url = await getSignedUrl(s3, command);
    return {
      name: objectKey,
      url,
    };
  } catch (error) {
    throw new Error(`Failed to get URL for ${objectKey}: ${error}`);
  }
}

/**
 * Uploads a file to the storage service
 * @param {Object} params - Upload parameters
 * @param {Buffer|ArrayBuffer|Uint8Array|string|ReadableStream} params.file - The file to upload
 * @param {string} params.key - The key/path where the file will be stored
 * @param {string} [params.contentType="application/octet-stream"] - The content type of the file
 * @param {Record<string, string>} [params.metadata={}] - Additional metadata for the file
 * @returns {Promise<{key: string, url: string}>} Object containing the file key and signed URL
 * @throws {Error} If file or key is missing, or if upload fails
 */
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
    console.log("Starting file upload to Minio...");
    // Prepare the input for PutObjectCommand
    const input: PutObjectCommandInput = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file instanceof ArrayBuffer ? new Uint8Array(file) : file,
      ContentType: contentType,
      Metadata: metadata,
    };

    console.log("Uploading file with input:", { ...input, Body: "<<binary data>>" });

    // Upload the file
    const s3 = getS3Client();
    await s3.send(new PutObjectCommand(input));
    console.log("File uploaded successfully to Minio");

    // Generate a signed URL for the uploaded object
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });
    const url = await getSignedUrl(s3, command, { expiresIn: 24 * 60 * 60 }); // 24 hours expiration
    console.log("Generated signed URL:", url);

    return { key, url };
  } catch (error) {
    console.error("Upload failed:", error);
    throw new Error(
      `Failed to upload file to ${key}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export const imageStorage = { getSpecificObjectUrl, uploadFile };
