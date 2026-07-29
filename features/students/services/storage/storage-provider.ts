import { Buffer } from "node:buffer";

export interface StorageProvider {
  upload(
    buffer: Buffer,
    fileName: string,
    mimeType: string
  ): Promise<string>;

  delete(filePath: string): Promise<void>;
}