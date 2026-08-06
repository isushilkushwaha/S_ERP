import fs from "node:fs/promises";
import path from "node:path";

import sharp from "sharp";

import type { StorageProvider } from "./storage-provider";

export class LocalStorageProvider implements StorageProvider {
  private readonly uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "students"
  );

  async upload(
buffer: Buffer, fileName: string, mimeType?: string,
  ): Promise<string> {
    await fs.mkdir(this.uploadDir, {
      recursive: true,
    });

    const outputName = `${fileName}.webp`;

    const outputPath = path.join(
      this.uploadDir,
      outputName
    );

    await sharp(buffer)
      .rotate()
      .resize({
        width: 600,
        height: 600,
        fit: "cover",
      })
      .webp({
        quality: 85,
      })
      .toFile(outputPath);

    return `/uploads/students/${outputName}`;
  }

  async delete(filePath: string): Promise<void> {
    if (!filePath) return;

    const fullPath = path.join(
      process.cwd(),
      "public",
      filePath.replace(/^\/+/, "")
    );

    try {
      await fs.unlink(fullPath);
    } catch {
      // Ignore missing file
    }
  }
}