import React, { useState, useEffect } from 'react';
import { ProjectImage } from '../../types/Project';
import './ImageGallery.css';

interface ImageGalleryProps {
  images: ProjectImage[];
  projectTitle: string;
  layout?: 'grid' | 'masonry' | 'showcase' | 'carousel';
  showCaptions?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  images, 
  projectTitle, 
  layout = 'grid',
  showCaptions = true 
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // Sort images by order_index
  const sortedImages = [...images].sort((a, b) => a.order_index - b.order_index);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % sortedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'Escape':
          closeLightbox();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen]);

  const handleImageLoad = (imageId: string) => {
    setImageLoaded(prev => ({ ...prev, [imageId]: true }));
  };

  if (sortedImages.length === 0) {
    return (
      <div className="image-gallery-empty">
        <p>No images available for this project.</p>
      </div>
    );
  }

  return (
    <div className={`image-gallery layout-${layout}`}>
      <div className="gallery-container">
        {sortedImages.map((image, index) => (
          <div 
            key={image.id} 
            className={`gallery-item ${imageLoaded[image.id] ? 'loaded' : 'loading'}`}
            onClick={() => openLightbox(index)}
          >
            <div className="image-container">
              {!imageLoaded[image.id] && (
                <div className="image-skeleton">
                  <div className="skeleton-animation"></div>
                </div>
              )}
              <img
                src={image.thumbnail_url || image.url}
                alt={image.alt_text || `${projectTitle} - Image ${index + 1}`}
                loading="lazy"
                onLoad={() => handleImageLoad(image.id)}
                style={{ display: imageLoaded[image.id] ? 'block' : 'none' }}
              />
              <div className="image-overlay">
                <div className="overlay-content">
                  <span className="zoom-icon">🔍</span>
                  {showCaptions && image.caption && (
                    <span className="image-caption">{image.caption}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
            {/* Lightbox Header */}
            <div className="lightbox-header">
              <div className="lightbox-info">
                <h3>{projectTitle}</h3>
                <span className="image-counter">
                  {currentImageIndex + 1} of {sortedImages.length}
                </span>
              </div>
              <button className="lightbox-close" onClick={closeLightbox}>
                ✕
              </button>
            </div>

            {/* Main Image */}
            <div className="lightbox-main">
              <button 
                className="lightbox-nav prev" 
                onClick={prevImage}
                disabled={sortedImages.length <= 1}
              >
                ‹
              </button>
              
              <div className="lightbox-image-container">
                <img
                  src={sortedImages[currentImageIndex].url}
                  alt={sortedImages[currentImageIndex].alt_text || `${projectTitle} - Image ${currentImageIndex + 1}`}
                  className="lightbox-image"
                />
              </div>

              <button 
                className="lightbox-nav next" 
                onClick={nextImage}
                disabled={sortedImages.length <= 1}
              >
                ›
              </button>
            </div>

            {/* Image Details */}
            <div className="lightbox-footer">
              {sortedImages[currentImageIndex].caption && (
                <p className="lightbox-caption">
                  {sortedImages[currentImageIndex].caption}
                </p>
              )}
              
              <div className="lightbox-meta">
                {sortedImages[currentImageIndex].format && (
                  <span className="meta-item">
                    Format: {sortedImages[currentImageIndex].format?.toUpperCase()}
                  </span>
                )}
                {sortedImages[currentImageIndex].width && sortedImages[currentImageIndex].height && (
                  <span className="meta-item">
                    Size: {sortedImages[currentImageIndex].width} × {sortedImages[currentImageIndex].height}
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {sortedImages.length > 1 && (
              <div className="lightbox-thumbnails">
                {sortedImages.map((image, index) => (
                  <button
                    key={image.id}
                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image.thumbnail_url || image.url}
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Gallery Controls */}
      <div className="gallery-controls">
        <span className="image-count">
          {sortedImages.length} image{sortedImages.length !== 1 ? 's' : ''}
        </span>
        <div className="layout-switcher">
          <button 
            className={`layout-btn ${layout === 'grid' ? 'active' : ''}`}
            onClick={() => {/* Layout switching logic would go here */}}
            title="Grid Layout"
          >
            ⊞
          </button>
          <button 
            className={`layout-btn ${layout === 'masonry' ? 'active' : ''}`}
            onClick={() => {/* Layout switching logic would go here */}}
            title="Masonry Layout"
          >
            ⊟
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;