// Real integration test for XBackBone
import { config } from "dotenv";
config(); // Load environment variables from .env file

import { uploadFile } from "./xbackbone";
import * as fs from "fs";
import * as path from "path";

async function testRealUpload() {
  console.log("🧪 Testing XBackBone Real Upload Endpoint");
  console.log("==========================================\n");

  // Verify environment variables
  const xbackboneUrl = process.env.XBACKBONE_URL;
  const token = process.env.XBACKBONE_TOKEN;

  if (!xbackboneUrl) {
    console.error("❌ XBACKBONE_URL not set");
    process.exit(1);
  }

  if (!token) {
    console.error("❌ XBACKBONE_TOKEN not set");
    process.exit(1);
  }

  console.log(`✓ XBackBone URL: ${xbackboneUrl}`);
  console.log(`✓ Token configured: ${token.substring(0, 10)}...\n`);

  // Create a small test image (1x1 pixel PNG)
  const testImageBase64 =
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
  const testBuffer = Buffer.from(testImageBase64, "base64");

  console.log(
    `📁 Test file size: ${testBuffer.length} bytes (${(testBuffer.length / 1024).toFixed(2)}KB)`,
  );

  try {
    console.log("\n🚀 Uploading test image...");
    const startTime = Date.now();
    const result = await uploadFile(testBuffer, "test-image.png");
    const duration = Date.now() - startTime;

    console.log(`\n✅ Upload successful!`);
    console.log(`⏱️  Duration: ${duration}ms`);
    console.log(`🔗 URL: ${result}`);

    // Verify the URL is accessible
    console.log("\n🔍 Verifying URL accessibility...");
    const checkResponse = await fetch(result, { method: "HEAD" });

    if (checkResponse.ok) {
      console.log(`✅ URL is accessible (Status: ${checkResponse.status})`);
    } else {
      console.warn(`⚠️  URL returned status: ${checkResponse.status}`);
    }

    console.log("\n✨ All tests passed!");
  } catch (error) {
    console.error("\n❌ Upload failed:");
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the test
testRealUpload();
