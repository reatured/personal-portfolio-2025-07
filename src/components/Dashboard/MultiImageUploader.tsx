import React, { useState, useRef } from 'react';
import { ProjectImage } from '../../types/Project';
import { VercelBlobService } from '../../utils/vercelBlob';
import { SupabaseService } from '../../utils/supabase';
import './MultiImageUploader.css';

interface MultiImageUploaderProps {
  images: ProjectImage[];
  onImagesUpdate: (images: ProjectImage[]) => void;
  projectId?: string;
}

const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images,
  onImagesUpdate,
  projectId
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: ProjectImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      try {
        await uploadImage(file, newImages);
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        alert(`Failed to upload ${file.name}`);
      }
    }

    const updatedImages = [...images, ...newImages];
    onImagesUpdate(updatedImages);
    setUploading(false);
    setUploadProgress({});
  };

  const uploadImage = async (file: File, newImages: ProjectImage[]) => {
    const fileId = `${Date.now()}-${file.name}`;
    
    try {
      // Update progress
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Upload to Vercel Blob
      const uploadResult = await VercelBlobService.uploadImage(file, {
        folder: 'portfolio/projects',
        filename: `${projectId || 'temp'}-${Date.now()}-${file.name}`
      });

      setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));

      // Generate optimized URLs
      const thumbnailUrl = VercelBlobService.getOptimizedUrl(uploadResult.url, {
        width: 300,
        height: 200,
        quality: 85,
        format: 'webp'
      });

      setUploadProgress(prev => ({ ...prev, [fileId]: 80 }));

      // Create image data
      const imageData: Omit<ProjectImage, 'id' | 'created_at'> = {
        project_id: projectId || '',
        url: uploadResult.url,
        thumbnail_url: thumbnailUrl,
        alt_text: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
        caption: '',
        width: 0, // Will be populated when image loads
        height: 0, // Will be populated when image loads
        file_size: uploadResult.size,
        format: file.type.split('/')[1] || 'unknown',
        order_index: images.length + newImages.length,
        is_featured: newImages.length === 0 && images.length === 0, // First image is featured
        display_type: 'gallery',
        settings: {
          vercel_pathname: uploadResult.pathname,
          vercel_url: uploadResult.url,
          download_url: uploadResult.downloadUrl
        }
      };

      // Save to database if projectId exists
      if (projectId) {
        const savedImage = await SupabaseService.addProjectImage(imageData);
        if (savedImage) {
          newImages.push(savedImage);
        }
      } else {
        // For new projects, store temporarily
        newImages.push({
          ...imageData,
          id: fileId,
          created_at: new Date().toISOString()
        } as ProjectImage);
      }

      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      
      // Remove progress after delay
      setTimeout(() => {
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[fileId];
          return updated;
        });
      }, 1000);

    } catch (error) {
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated[fileId];
        return updated;
      });
      throw error;
    }
  };

  const handleImageUpdate = async (imageId: string, updates: Partial<ProjectImage>) => {
    const updatedImages = images.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );
    onImagesUpdate(updatedImages);

    // Update in database
    if (projectId) {
      await SupabaseService.updateProjectImage(imageId, updates);
    }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const imageToDelete = images.find(img => img.id === imageId);
    if (imageToDelete?.url) {
      // Delete from Vercel Blob
      try {
        await VercelBlobService.deleteImage(imageToDelete.url);
      } catch (error) {
        console.error('Failed to delete from Vercel Blob:', error);
      }
    }

    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesUpdate(updatedImages);

    // Delete from database
    if (projectId) {
      await SupabaseService.deleteProjectImage(imageId);
    }
  };

  const handleReorder = async (dragIndex: number, hoverIndex: number) => {
    const draggedImage = images[dragIndex];
    const reorderedImages = [...images];
    reorderedImages.splice(dragIndex, 1);
    reorderedImages.splice(hoverIndex, 0, draggedImage);

    // Update order_index for all images
    const updatedImages = reorderedImages.map((img, index) => ({
      ...img,
      order_index: index
    }));

    onImagesUpdate(updatedImages);

    // Update in database
    if (projectId) {
      const orderUpdates = updatedImages.map(img => ({
        id: img.id,
        order_index: img.order_index
      }));
      await SupabaseService.reorderProjectImages(orderUpdates);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="multi-image-uploader">
      {/* Upload Zone */}
      <div 
        className={`upload-zone ${dragOver ? 'drag-over' : ''} ${uploading ? 'uploading' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
      >
        <div className="upload-content">
          {uploading ? (
            <>
              <div className="upload-spinner">⏳</div>
              <p>Uploading images...</p>
            </>
          ) : (
            <>
              <div className="upload-icon">📁</div>
              <p>Drag & drop images here or click to select</p>
              <p className="upload-hint">Supports: JPG, PNG, WebP (max 10MB each)</p>
            </>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => handleFileSelect(e.target.files)}
        disabled={uploading}
      />

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-section">
          <h4>Uploading...</h4>
          {Object.entries(uploadProgress).map(([fileId, progress]) => (
            <div key={fileId} className="progress-item">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="progress-text">{progress}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="images-grid">
          <h4>Project Images ({images.length})</h4>
          <div className="grid-container">
            {images
              .sort((a, b) => a.order_index - b.order_index)
              .map((image, index) => (
                <div key={image.id} className="image-card">
                  {/* Image Preview */}
                  <div className="image-preview">
                    <img 
                      src={image.thumbnail_url || image.url} 
                      alt={image.alt_text || 'Project image'}
                      loading="lazy"
                    />
                    {image.is_featured && (
                      <div className="featured-badge">⭐ Featured</div>
                    )}
                    <div className="image-overlay">
                      <button
                        type="button"
                        onClick={() => window.open(image.url, '_blank')}
                        className="view-btn"
                        title="View full size"
                      >
                        🔍
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageDelete(image.id)}
                        className="delete-btn"
                        title="Delete image"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Image Controls */}
                  <div className="image-controls">
                    <div className="control-group">
                      <label>Alt Text:</label>
                      <input
                        type="text"
                        value={image.alt_text || ''}
                        onChange={(e) => handleImageUpdate(image.id, { alt_text: e.target.value })}
                        placeholder="Describe this image..."
                      />
                    </div>

                    <div className="control-group">
                      <label>Caption:</label>
                      <input
                        type="text"
                        value={image.caption || ''}
                        onChange={(e) => handleImageUpdate(image.id, { caption: e.target.value })}
                        placeholder="Image caption (optional)"
                      />
                    </div>

                    <div className="control-row">
                      <div className="control-group">
                        <label>Display Type:</label>
                        <select
                          value={image.display_type}
                          onChange={(e) => handleImageUpdate(image.id, { 
                            display_type: e.target.value as ProjectImage['display_type']
                          })}
                        >
                          <option value="gallery">Gallery</option>
                          <option value="hero">Hero</option>
                          <option value="inline">Inline</option>
                          <option value="background">Background</option>
                        </select>
                      </div>

                      <div className="control-group">
                        <label>
                          <input
                            type="checkbox"
                            checked={image.is_featured}
                            onChange={(e) => handleImageUpdate(image.id, { is_featured: e.target.checked })}
                          />
                          Featured Image
                        </label>
                      </div>
                    </div>

                    {/* Reorder Controls */}
                    <div className="reorder-controls">
                      <button
                        type="button"
                        onClick={() => index > 0 && handleReorder(index, index - 1)}
                        disabled={index === 0}
                        className="reorder-btn"
                      >
                        ↑
                      </button>
                      <span className="order-text">Order: {image.order_index + 1}</span>
                      <button
                        type="button"
                        onClick={() => index < images.length - 1 && handleReorder(index, index + 1)}
                        disabled={index === images.length - 1}
                        className="reorder-btn"
                      >
                        ↓
                      </button>
                    </div>
                  </div>

                  {/* Image Metadata */}
                  <div className="image-metadata">
                    <div className="metadata-item">
                      <span>Size:</span>
                      <span>{image.width} × {image.height}</span>
                    </div>
                    <div className="metadata-item">
                      <span>Format:</span>
                      <span>{image.format?.toUpperCase()}</span>
                    </div>
                    <div className="metadata-item">
                      <span>File Size:</span>
                      <span>{formatFileSize(image.file_size)}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Image Guidelines */}
      <div className="image-guidelines">
        <h4>💡 Image Guidelines:</h4>
        <ul>
          <li><strong>Hero Images:</strong> Use for main project showcases (recommended: 1200×800px)</li>
          <li><strong>Gallery Images:</strong> Additional project screenshots and details</li>
          <li><strong>Featured Image:</strong> Primary image shown in project cards</li>
          <li><strong>Alt Text:</strong> Important for accessibility and SEO</li>
          <li><strong>Captions:</strong> Displayed in lightboxes and galleries</li>
        </ul>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes?: number): string => {
  if (!bytes) return 'Unknown';
  
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default MultiImageUploader;