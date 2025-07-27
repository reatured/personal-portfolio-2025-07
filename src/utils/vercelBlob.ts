// Vercel Blob Service for Image Management
import { put, del, list } from '@vercel/blob';

export interface VercelBlobUploadResult {
  url: string;
  downloadUrl: string;
  pathname: string;
  size: number;
}

export class VercelBlobService {
  // Upload image to Vercel Blob
  static async uploadImage(
    file: File, 
    options: {
      folder?: string;
      filename?: string;
    } = {}
  ): Promise<VercelBlobUploadResult> {
    try {
      const { folder = 'portfolio', filename } = options;
      
      // Generate filename if not provided
      const finalFilename = filename || `${Date.now()}-${file.name}`;
      const pathname = `${folder}/${finalFilename}`;

      // Upload to Vercel Blob
      const blob = await put(pathname, file, {
        access: 'public',
        addRandomSuffix: false, // We're handling naming ourselves
      });

      return {
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        pathname: blob.pathname,
        size: file.size,
      };
    } catch (error) {
      console.error('Vercel Blob upload error:', error);
      throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload multiple images
  static async uploadMultipleImages(
    files: File[], 
    options: {
      folder?: string;
      onProgress?: (completed: number, total: number) => void;
    } = {}
  ): Promise<VercelBlobUploadResult[]> {
    const { folder = 'portfolio', onProgress } = options;
    const results: VercelBlobUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const result = await this.uploadImage(file, { folder });
        results.push(result);
        
        if (onProgress) {
          onProgress(i + 1, files.length);
        }
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    return results;
  }

  // Delete image from Vercel Blob
  static async deleteImage(url: string): Promise<void> {
    try {
      await del(url);
    } catch (error) {
      console.error('Vercel Blob delete error:', error);
      throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List images in a folder
  static async listImages(folder: string = 'portfolio'): Promise<any[]> {
    try {
      const { blobs } = await list({
        prefix: `${folder}/`,
        limit: 100, // Adjust as needed
      });
      
      return blobs;
    } catch (error) {
      console.error('Vercel Blob list error:', error);
      throw new Error(`Failed to list images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Generate optimized image URL with transformations
  static getOptimizedUrl(originalUrl: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png' | 'auto';
  } = {}): string {
    // Vercel Blob doesn't have built-in transformations like Cloudinary
    // But you can use Vercel's Image Optimization API
    const { width, height, quality = 75, format = 'auto' } = options;
    
    // If you're using Next.js Image component, it will handle optimization
    // For manual optimization, you can use query parameters with Vercel's image API
    let optimizedUrl = originalUrl;
    
    const params = new URLSearchParams();
    if (width) params.set('w', width.toString());
    if (height) params.set('h', height.toString());
    if (quality) params.set('q', quality.toString());
    if (format && format !== 'auto') params.set('f', format);
    
    if (params.toString()) {
      optimizedUrl += `?${params.toString()}`;
    }
    
    return optimizedUrl;
  }

  // Validate file before upload
  static validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not supported. Please use JPEG, PNG, WebP, or GIF.'
      };
    }
    
    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size too large. Maximum size is 10MB.'
      };
    }
    
    return { valid: true };
  }

  // Get file metadata
  static getFileMetadata(file: File) {
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified,
      sizeFormatted: this.formatFileSize(file.size)
    };
  }

  // Format file size for display
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Configuration for Vercel Blob
export const VercelBlobConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  defaultFolder: 'portfolio',
  
  // Image optimization defaults
  optimization: {
    quality: 85,
    format: 'auto' as const,
    sizes: {
      thumbnail: { width: 300, height: 200 },
      medium: { width: 800, height: 600 },
      large: { width: 1200, height: 900 },
    }
  }
};