import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

export class UploadService {
  async processImage(filePath: string) {
    const ext = path.extname(filePath);
    const newPath = filePath.replace(ext, '.webp');
    await sharp(filePath).webp({ quality: 80 }).toFile(newPath);
    fs.unlinkSync(filePath); // remove original
    return newPath;
  }
}
