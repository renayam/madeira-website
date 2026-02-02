#!/usr/bin/env node

/**
 * XBackBone Image Proxy Test Script
 *
 * This script tests the image proxy functionality to ensure
 * XBackBone images are properly proxied and displayed.
 *
 * Usage:
 *   node scripts/test-image-proxy.js
 *
 * Requirements:
 *   - Next.js development server running on localhost:3000
 *   - curl installed
 */

const { execSync } = require("child_process");

const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:3000";
const XBACKBONE_URL = "https://xbackbone.madeira.eco";
const XBACKBONE_TEST_IMAGE = `${XBACKBONE_URL}/JijO8/fOSebOBa51.jpeg`;

const tests = {
  async run() {
    console.log("🧪 XBackBone Image Proxy Test Suite");
    console.log("====================================\n");

    let passed = 0;
    let failed = 0;

    const results = await Promise.all([
      this.testProxyEndpoint(),
      this.testValidXBackBoneImage(),
      this.testMissingUrlParameter(),
      this.testWrongDomain(),
      this.testInvalidExtension(),
      this.testCacheHeaders(),
    ]);

    for (const result of results) {
      if (result.pass) {
        passed++;
        console.log(`✅ ${result.name}`);
        console.log(`   ${result.message}\n`);
      } else {
        failed++;
        console.log(`❌ ${result.name}`);
        console.log(`   ${result.message}\n`);
      }
    }

    console.log("====================================");
    console.log(`📊 Results: ${passed} passed, ${failed} failed`);
    console.log("====================================");

    if (failed > 0) {
      console.log("\n⚠️  Some tests failed. Please check the implementation.");
      process.exit(1);
    } else {
      console.log("\n✨ All tests passed!");
      process.exit(0);
    }
  },

  async testProxyEndpoint() {
    try {
      const response = execSync(
        `curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/proxy-image"`,
        { encoding: "utf8" },
      );

      return {
        pass: response === "400",
        name: "Proxy Endpoint Exists",
        message: "Returns 400 for missing URL parameter (expected)",
      };
    } catch {
      return {
        pass: false,
        name: "Proxy Endpoint Exists",
        message: "Failed to connect to proxy endpoint",
      };
    }
  },

  async testValidXBackBoneImage() {
    try {
      const encodedUrl = encodeURIComponent(XBACKBONE_TEST_IMAGE);
      const response = execSync(
        `curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}/api/proxy-image?url=${encodedUrl}"`,
        { encoding: "utf8" },
      );

      if (response === "200") {
        const contentType = execSync(
          `curl -s -I "${BASE_URL}/api/proxy-image?url=${encodedUrl}" 2>/dev/null | grep -i "content-type"`,
          { encoding: "utf8" },
        );

        if (contentType.toLowerCase().includes("image/jpeg")) {
          return {
            pass: true,
            name: "Valid XBackBone Image Proxy",
            message: "Successfully proxies XBackBone JPEG images",
          };
        }
      }

      return {
        pass: false,
        name: "Valid XBackBone Image Proxy",
        message: `Expected 200 with image/jpeg content-type, got ${response}`,
      };
    } catch (error) {
      return {
        pass: false,
        name: "Valid XBackBone Image Proxy",
        message: `Error: ${error.message}`,
      };
    }
  },

  async testMissingUrlParameter() {
    try {
      const response = execSync(`curl -s "${BASE_URL}/api/proxy-image"`, {
        encoding: "utf8",
      });

      if (response.includes("Missing 'url' query parameter")) {
        return {
          pass: true,
          name: "Missing URL Parameter Error",
          message: "Returns proper error message for missing URL",
        };
      }

      return {
        pass: false,
        name: "Missing URL Parameter Error",
        message: "Expected error message not found",
      };
    } catch (error) {
      return {
        pass: false,
        name: "Missing URL Parameter Error",
        message: `Error: ${error.message}`,
      };
    }
  },

  async testWrongDomain() {
    try {
      const encodedUrl = encodeURIComponent("https://evil.com/image.jpg");
      const response = execSync(
        `curl -s "${BASE_URL}/api/proxy-image?url=${encodedUrl}"`,
        { encoding: "utf8" },
      );

      if (response.includes("must be hosted on xbackbone.madeira.eco")) {
        return {
          pass: true,
          name: "Wrong Domain Rejection",
          message: "Correctly rejects images from non-allowed domains",
        };
      }

      return {
        pass: false,
        name: "Wrong Domain Rejection",
        message: "Expected error message not found",
      };
    } catch (error) {
      return {
        pass: false,
        name: "Wrong Domain Rejection",
        message: `Error: ${error.message}`,
      };
    }
  },

  async testInvalidExtension() {
    try {
      const encodedUrl = encodeURIComponent(`${XBACKBONE_URL}/file.txt`);
      const response = execSync(
        `curl -s "${BASE_URL}/api/proxy-image?url=${encodedUrl}"`,
        { encoding: "utf8" },
      );

      if (response.includes("Unsupported image format")) {
        return {
          pass: true,
          name: "Invalid Extension Rejection",
          message: "Correctly rejects non-image files",
        };
      }

      return {
        pass: false,
        name: "Invalid Extension Rejection",
        message: "Expected error message not found",
      };
    } catch (error) {
      return {
        pass: false,
        name: "Invalid Extension Rejection",
        message: `Error: ${error.message}`,
      };
    }
  },

  async testCacheHeaders() {
    try {
      const encodedUrl = encodeURIComponent(XBACKBONE_TEST_IMAGE);
      const headers = execSync(
        `curl -s -I "${BASE_URL}/api/proxy-image?url=${encodedUrl}" 2>/dev/null`,
        { encoding: "utf8" },
      );

      if (
        headers.toLowerCase().includes("cache-control: public, max-age=3600")
      ) {
        return {
          pass: true,
          name: "Cache Headers Present",
          message: "Cache-Control header set to 1 hour (3600s)",
        };
      }

      return {
        pass: false,
        name: "Cache Headers Present",
        message: "Cache-Control header not found or incorrect",
      };
    } catch (error) {
      return {
        pass: false,
        name: "Cache Headers Present",
        message: `Error: ${error.message}`,
      };
    }
  },
};

// Run tests
tests.run().catch((error) => {
  console.error("Test suite error:", error);
  process.exit(1);
});
