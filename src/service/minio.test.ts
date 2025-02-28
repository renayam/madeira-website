import { uploadFile, getSpecificObjectUrl } from "./minio";

describe("Minio Service", () => {
    it("should upload a file to Minio", async () => {
        const imageBuffer = Buffer.from(
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            "base64",
        );

        const result = await uploadFile({
            file: imageBuffer,
            key: "test-image.png",
            contentType: "image/png",
        });

        expect(result).toBeDefined();
        expect(result.key).toBe("test-image.png");
        expect(result.url).toContain("test-image.png");
    });

    it("should get a file from Minio", async () => {
        const result = await getSpecificObjectUrl("hello.jpg");
        expect(result).toBeDefined();
    });
});