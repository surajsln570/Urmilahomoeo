import { writeFile, mkdir, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

/**
 * Mirrors the Laravel pattern of `$file->move(public_path('upload/...'), $filename)`.
 * Saves an uploaded File under /public/uploads/<folder> and returns the
 * public-relative path (e.g. "/uploads/treatments/171234_x.png") to store in the DB.
 */
export async function saveUploadedFile(file: File, folder: "hero" | "treatments"): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const dir = path.join(process.cwd(), "public", "uploads", folder);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const filename = `${Date.now()}_${safeName}`;
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}

export async function deleteUploadedFile(publicPath: string): Promise<void> {
  try {
    const filePath = path.join(process.cwd(), "public", publicPath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  } catch {
    // Non-fatal: mirrors Laravel's file_exists() guard before unlink().
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
