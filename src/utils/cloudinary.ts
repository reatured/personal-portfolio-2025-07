// Cloudinary Service for FREE image management
// FREE tier: 25GB storage, 25GB bandwidth/month

interface CloudinaryConfig {
  cloudName: string;
  uploadPreset: string;
  apiKey?: string;
  apiSecret?: string;
}

interface UploadOptions {
  folder?: string;
  public_id?: string;
  transformation?: any[];
  tags?: string[];
}

interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}

interface TransformationOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'scale' | 'pad';
  quality?: 'auto' | number;
  format?: 'auto' | 'jpg' | 'png' | 'webp';
  gravity?: string;
  background?: string;
}

export class CloudinaryService {
  private static config: CloudinaryConfig = {
    cloudName: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET || 'portfolio_preset',
    apiKey: process.env.REACT_APP_CLOUDINARY_API_KEY,
    apiSecret: process.env.REACT_APP_CLOUDINARY_API_SECRET
  };

  /**
   * Upload image to Cloudinary using unsigned upload (FREE)
   */
  static async uploadImage(
    file: File, 
    options: UploadOptions = {}
  ): Promise<CloudinaryUploadResult> {
    if (!this.config.cloudName) {
      throw new Error('Cloudinary cloud name not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);
    
    // Add optional parameters
    if (options.folder) {
      formData.append('folder', options.folder);
    }
    
    if (options.public_id) {
      formData.append('public_id', options.public_id);
    }
    
    if (options.tags && options.tags.length > 0) {
      formData.append('tags', options.tags.join(','));
    }

    // Add transformation if provided
    if (options.transformation && options.transformation.length > 0) {
      formData.append('transformation', JSON.stringify(options.transformation));
    }

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Cloudinary upload failed: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  }

  /**
   * Generate optimized image URL with transformations
   */
  static generateUrl(
    publicId: string, 
    options: TransformationOptions = {}
  ): string {
    if (!this.config.cloudName || !publicId) {
      return '';
    }

    let transformationString = '';
    const transformations: string[] = [];

    // Add transformations
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    if (options.gravity) transformations.push(`g_${options.gravity}`);
    if (options.background) transformations.push(`b_${options.background}`);

    if (transformations.length > 0) {
      transformationString = transformations.join(',') + '/';
    }

    return `https://res.cloudinary.com/${this.config.cloudName}/image/upload/${transformationString}${publicId}`;
  }

  /**
   * Delete image from Cloudinary (requires API key for signed requests)
   */
  static async deleteImage(publicId: string): Promise<boolean> {
    if (!this.config.apiKey || !this.config.apiSecret) {
      console.warn('Cloudinary API credentials not configured for deletion');
      return false;
    }

    try {
      // For client-side deletion, you would typically call your backend
      // which would handle the signed deletion request
      const response = await fetch('/api/cloudinary/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_id: publicId })
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to delete image:', error);
      return false;
    }
  }

  /**
   * Generate multiple size variants for responsive images
   */
  static generateResponsiveUrls(
    publicId: string,
    sizes: { width: number; suffix: string }[] = [
      { width: 320, suffix: 'mobile' },
      { width: 768, suffix: 'tablet' },
      { width: 1200, suffix: 'desktop' },
      { width: 1920, suffix: 'large' }
    ]
  ): Record<string, string> {
    const urls: Record<string, string> = {};

    sizes.forEach(({ width, suffix }) => {
      urls[suffix] = this.generateUrl(publicId, {
        width,
        crop: 'limit',
        quality: 'auto',
        format: 'auto'
      });
    });

    return urls;
  }

  /**
   * Create thumbnail URL
   */
  static generateThumbnail(
    publicId: string,
    width: number = 300,
    height: number = 200
  ): string {
    return this.generateUrl(publicId, {
      width,
      height,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
      gravity: 'center'
    });
  }

  /**
   * Upload multiple images with progress tracking
   */
  static async uploadMultipleImages(
    files: File[],
    options: UploadOptions = {},
    onProgress?: (progress: number, fileName: string) => void
  ): Promise<CloudinaryUploadResult[]> {
    const results: CloudinaryUploadResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      try {
        if (onProgress) {
          onProgress((i / files.length) * 100, file.name);
        }

        const result = await this.uploadImage(file, {
          ...options,
          public_id: options.public_id ? `${options.public_id}_${i}` : undefined
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        throw error;
      }
    }

    if (onProgress) {
      onProgress(100, 'Complete');
    }

    return results;
  }

  /**
   * Validate image file
   */
  static validateImageFile(file: File): { valid: boolean; error?: string } {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'File must be an image' };
    }

    // Check file size (10MB limit for free tier)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 10MB' };
    }

    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!supportedFormats.includes(file.type)) {
      return { valid: false, error: 'Supported formats: JPG, PNG, WebP, GIF' };
    }

    return { valid: true };
  }

  /**
   * Get image metadata from URL
   */
  static extractPublicIdFromUrl(cloudinaryUrl: string): string | null {
    try {
      const regex = /\/upload\/(?:v\d+\/)?(.+)\./;
      const match = cloudinaryUrl.match(regex);
      return match ? match[1] : null;
    } catch {
      return null;
    }
  }

  /**
   * Create upload widget (alternative to file input)
   */
  static createUploadWidget(
    options: {
      cloudName?: string;
      uploadPreset?: string;
      sources?: string[];
      multiple?: boolean;
      maxFiles?: number;
      maxFileSize?: number;
      folder?: string;
    },
    onSuccess: (result: any) => void,
    onError?: (error: any) => void
  ) {
    // This would be used with Cloudinary's upload widget
    // For now, we'll use the manual upload approach
    console.log('Upload widget would be created with options:', options);
  }
}

// Helper functions for common transformations
export const CloudinaryTransforms = {
  thumbnail: (width = 300, height = 200) => ({
    width,
    height,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const
  }),

  hero: (width = 1200, height = 600) => ({
    width,
    height,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
    gravity: 'center'
  }),

  avatar: (size = 150) => ({
    width: size,
    height: size,
    crop: 'fill' as const,
    quality: 'auto' as const,
    format: 'auto' as const,
    gravity: 'face'
  }),

  responsive: (width: number) => ({
    width,
    crop: 'limit' as const,
    quality: 'auto' as const,
    format: 'auto' as const
  })
};