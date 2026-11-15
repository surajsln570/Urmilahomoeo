import { put, del } from "@vercel/blob";

export async function saveUploadedFile(file: File, folder: "hero" | "treatments"): Promise<string> {
  console.log("=== BLOB DEBUG ===");
  console.log("Token exists:", !!process.env.BLOB_READ_WRITE_TOKEN);
  console.log("Token prefix:", process.env.BLOB_READ_WRITE_TOKEN?.slice(0, 15));
  console.log("VERCEL_ENV:", process.env.VERCEL_ENV);
  console.log("==================");
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const pathname = `${folder}/${Date.now()}_${safeName}`;

  const blob = await put(pathname, file, {
    access: "public",
    addRandomSuffix: false,
  });

  // Store the full public URL — it's what <Image src=".."> needs directly.
  return blob.url;
}

export async function deleteUploadedFile(url: string): Promise<void> {
  try {
    await del(url);
  } catch {
    // Non-fatal: mirrors the original file_exists() guard before unlink().
  }
}

export function validateImage(file: File, maxSizeMb = 2) {
  const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
  if (!allowed.includes(file.type)) {
    return "Only jpg, jpeg, png, webp files are allowed.";
  }
  if (file.size > maxSizeMb * 1024 * 1024) {
    return `File size must be less than ${maxSizeMb}MB.`;
  }
  return null;
}
