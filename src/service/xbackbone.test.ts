import { uploadFile } from "./xbackbone";

describe("XBackBone Integration Tests", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("uploadFile", () => {
    it("should throw error when XBACKBONE_URL is not set", async () => {
      delete process.env.XBACKBONE_URL;
      process.env.XBACKBONE_TOKEN = "test-token";

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      await expect(uploadFile(mockFile, "test.jpg")).rejects.toThrow(
        "XBACKBONE_URL environment variable is not set",
      );
    });

    it("should throw error when XBACKBONE_TOKEN is not set", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      delete process.env.XBACKBONE_TOKEN;

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      await expect(uploadFile(mockFile, "test.jpg")).rejects.toThrow(
        "XBACKBONE_TOKEN environment variable is not set",
      );
    });

    it("should successfully upload a file and return URL", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      const mockUrl = "https://xbackbone.madeira.eco/image/test-123.jpg";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockUrl }),
      });

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      const result = await uploadFile(mockFile, "test.jpg");

      expect(result).toBe(mockUrl);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://xbackbone.madeira.eco/upload",
        expect.objectContaining({
          method: "POST",
          body: expect.any(FormData),
        }),
      );
    });

    it("should handle upload failure with error response", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: async () => "Invalid token",
      });

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      await expect(uploadFile(mockFile, "test.jpg")).rejects.toThrow(
        "Upload failed: 400 - Invalid token",
      );
    });

    it("should throw error when response missing URL field", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: "Something went wrong" }),
      });

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      await expect(uploadFile(mockFile, "test.jpg")).rejects.toThrow(
        "Upload response missing URL field",
      );
    });

    it("should handle network errors", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      global.fetch = jest
        .fn()
        .mockRejectedValueOnce(new Error("Network error"));

      const mockFile = new File(["test content"], "test.jpg", {
        type: "image/jpeg",
      });

      await expect(uploadFile(mockFile, "test.jpg")).rejects.toThrow(
        "Network error",
      );
    });

    it("should throw error for invalid file type", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      const invalidFile = "not a file" as unknown as File;

      await expect(uploadFile(invalidFile, "test.jpg")).rejects.toThrow(
        "Invalid file type: expected File or Buffer",
      );
    });

    it("should throw error when file exceeds 2MB limit (File)", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      // Create a mock File that reports 3MB size
      const largeFile = new File(["test"], "large.jpg", { type: "image/jpeg" });
      Object.defineProperty(largeFile, "size", { value: 3 * 1024 * 1024 }); // 3MB

      await expect(uploadFile(largeFile, "large.jpg")).rejects.toThrow(
        "File size exceeds 2MB limit",
      );
    });

    it("should throw error when file exceeds 2MB limit (Buffer)", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      // Create a Buffer larger than 2MB
      const largeBuffer = Buffer.alloc(3 * 1024 * 1024); // 3MB

      await expect(uploadFile(largeBuffer, "large.jpg")).rejects.toThrow(
        "File size exceeds 2MB limit",
      );
    });

    it("should accept files under 2MB", async () => {
      process.env.XBACKBONE_URL = "https://xbackbone.madeira.eco";
      process.env.XBACKBONE_TOKEN = "test-token";

      const mockUrl = "https://xbackbone.madeira.eco/image/test-123.jpg";

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ url: mockUrl }),
      });

      // Create a small file (under 2MB)
      const smallFile = new File(["test content"], "small.jpg", {
        type: "image/jpeg",
      });

      const result = await uploadFile(smallFile, "small.jpg");
      expect(result).toBe(mockUrl);
    });
  });
});
