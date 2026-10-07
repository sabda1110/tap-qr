import assert from "node:assert/strict";
import { test } from "node:test";
import { uploadCloudinaryImage } from "./cloudinary.server";
import { imageUploadMaxBytes } from "../../lib/validation/image-upload";

const pngHeader = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);

test("image uploads reject unsupported, empty, oversized, and disguised files", async () => {
  const files = [
    new File(["<svg/>"], "logo.svg", { type: "image/svg+xml" }),
    new File([], "empty.png", { type: "image/png" }),
    new File([new Uint8Array(imageUploadMaxBytes + 1)], "large.png", { type: "image/png" }),
    new File(["not an image"], "fake.png", { type: "image/png" }),
  ];
  for (const file of files) {
    await assert.rejects(uploadCloudinaryImage(file, "logos"), /INVALID_IMAGE_FILE/);
  }
});

test("Cloudinary uploads authenticate on the server and handle provider failures", async (context) => {
  const originalEnv = process.env.CLOUDINARY_ENV;
  context.after(() => {
    if (originalEnv === undefined) delete process.env.CLOUDINARY_ENV;
    else process.env.CLOUDINARY_ENV = originalEnv;
    context.mock.restoreAll();
  });
  const file = new File([pngHeader], "logo.png", { type: "image/png" });
  process.env.CLOUDINARY_ENV = "invalid-config";
  await assert.rejects(uploadCloudinaryImage(file, "logos"), /CLOUDINARY_NOT_CONFIGURED/);
  process.env.CLOUDINARY_ENV = "cloudinary://test-key:test-secret@test-cloud";
  let mode: "success" | "failed" | "invalidResponse" = "success";
  context.mock.method(globalThis, "fetch", async (url: string, request: RequestInit) => {
    assert.equal(url, "https://api.cloudinary.com/v1_1/test-cloud/image/upload");
    assert.equal(request.method, "POST");
    assert.equal(new Headers(request.headers).get("authorization"), `Basic ${Buffer.from("test-key:test-secret").toString("base64")}`);
    assert.ok(request.body instanceof FormData);
    assert.ok(request.body.get("file") instanceof File);
    assert.match(String(request.body.get("public_id")), /^logos\/[a-f0-9-]+$/);
    assert.equal(request.body.get("transformation"), "c_limit,w_512,h_512");
    if (mode === "failed") return new Response("provider error", { status: 500 });
    return Response.json({
      public_id: "logos/test",
      secure_url: mode === "invalidResponse" ? "http://unsafe.example/logo.png" : "https://res.cloudinary.com/test-cloud/image/upload/logo.png",
    });
  });
  assert.deepEqual(await uploadCloudinaryImage(file, "logos"), {
    publicId: "logos/test",
    url: "https://res.cloudinary.com/test-cloud/image/upload/logo.png",
  });
  mode = "failed";
  await assert.rejects(uploadCloudinaryImage(file, "logos"), /IMAGE_UPLOAD_FAILED/);
  mode = "invalidResponse";
  await assert.rejects(uploadCloudinaryImage(file, "logos"), /IMAGE_UPLOAD_FAILED/);
});
