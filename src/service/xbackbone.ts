interface XBackBoneUploadResponse {
  url: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes

export async function uploadFile(
  file: File | Buffer,
  filename: string,
): Promise<string> {
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

  const response = await fetch(`${xbackboneUrl}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
  }

  const data: XBackBoneUploadResponse = await response.json();

  if (!data.url) {
    throw new Error("Upload response missing URL field");
  }

  return data.url;
}
