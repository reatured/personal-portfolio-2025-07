import React, { useState, useRef } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
  onImageUploaded: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUploaded }) => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        uploadImage(file);
      } else {
        alert(`${file.name} is not an image file`);
      }
    });
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('filename', file.name);

    try {
      setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));

      // Simulate upload progress (replace with actual upload logic)
      const uploadPromise = simulateUpload(file);
      
      const result = await uploadPromise;
      
      if (result.success && result.path) {
        setUploadedImages(prev => [...prev, result.path!]);
        setUploadProgress(prev => {
          const updated = { ...prev };
          delete updated[file.name];
          return updated;
        });
        onImageUploaded();
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert(`Failed to upload ${file.name}: ${error}`);
      setUploadProgress(prev => {
        const updated = { ...prev };
        delete updated[file.name];
        return updated;
      });
    }
  };

  // Simulate upload (replace with actual backend integration)
  const simulateUpload = (file: File): Promise<{ success: boolean; path?: string; error?: string }> => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({ ...prev, [file.name]: progress }));
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Copy file to public/images directory (this would be done by backend)
          const reader = new FileReader();
          reader.onload = () => {
            // In a real implementation, this would upload to your server
            // For now, we'll just simulate success
            const imagePath = `/images/${getImageCategory(file.name)}/${file.name}`;
            resolve({ success: true, path: imagePath });
          };
          reader.readAsDataURL(file);
        }
      }, 200);
    });
  };

  const getImageCategory = (filename: string): string => {
    if (filename.toLowerCase().includes('profile')) {
      return 'profile';
    }
    return 'projects';
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

  const copyImagePath = (path: string) => {
    navigator.clipboard.writeText(path);
    alert('Image path copied to clipboard!');
  };

  return (
    <div className="image-uploader">
      <div className="upload-section">
        <h2>Image Upload</h2>
        
        <div 
          className={`drop-zone ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-content">
            <div className="upload-icon">📁</div>
            <p>Drop images here or click to select</p>
            <p className="upload-hint">Supports: JPG, PNG, WebP</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e.target.files)}
        />
      </div>

      {Object.keys(uploadProgress).length > 0 && (
        <div className="upload-progress-section">
          <h3>Uploading...</h3>
          {Object.entries(uploadProgress).map(([filename, progress]) => (
            <div key={filename} className="upload-progress-item">
              <span className="filename">{filename}</span>
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

      <div className="uploaded-images-section">
        <h3>Image Management</h3>
        
        <div className="image-guidelines">
          <h4>Naming Guidelines:</h4>
          <ul>
            <li><strong>Profile:</strong> profile.jpg (for your main profile image)</li>
            <li><strong>Projects:</strong> project-01.jpg, project-02.jpg, etc.</li>
            <li><strong>Hover images:</strong> project-01-hover.jpg, project-02-hover.jpg, etc.</li>
          </ul>
        </div>

        <div className="current-images">
          <h4>Current Images:</h4>
          <div className="images-grid">
            {/* This would be populated by scanning the images directory */}
            <div className="image-item">
              <div className="image-preview">
                <div className="placeholder-image">📷</div>
              </div>
              <div className="image-info">
                <p>/images/profile/profile.jpg</p>
                <button 
                  className="btn-secondary"
                  onClick={() => copyImagePath('/images/profile/profile.jpg')}
                >
                  Copy Path
                </button>
              </div>
            </div>
          </div>
          
          <div className="images-note">
            <p><em>Note: In development mode, manually place images in the public/images/ directory. The dashboard will help organize and reference them.</em></p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ImageUploader;