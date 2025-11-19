import React, { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';

interface MultipleFileUploadProps {
  onFilesUpload: (urls: string[]) => void;
  label: string;
  accept?: string;
  currentUrls?: string[];
  maxFiles?: number;
}

export default function MultipleFileUpload({ 
  onFilesUpload, 
  label, 
  accept = "image/*", 
  currentUrls = [],
  maxFiles = 8
}: MultipleFileUploadProps) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>(currentUrls);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFiles = Array.from(e.target.files || []);
    
    if (selectedFiles.length === 0) return;
    
    // Check if adding these files would exceed the limit
    const totalFiles = uploadedUrls.length + selectedFiles.length;
    if (totalFiles > maxFiles) {
      setError(`Cannot upload more than ${maxFiles} files. You can upload ${maxFiles - uploadedUrls.length} more file(s).`);
      return;
    }
    
    // Validate file sizes (max 5MB each)
    const oversizedFiles = selectedFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`${oversizedFiles.length} file(s) exceed the 5MB size limit`);
      return;
    }
    
    setIsUploading(true);
    const newUrls: string[] = [];
    
    try {
      // Upload files one by one to track progress
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        
        // Update progress
        setUploadProgress(prev => ({ ...prev, [i]: 0 }));
        
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }
        
        const data = await response.json();
        newUrls.push(data.url);
        
        // Mark as complete
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      }
      
      // Update state with new URLs
      const updatedUrls = [...uploadedUrls, ...newUrls];
      setUploadedUrls(updatedUrls);
      onFilesUpload(updatedUrls);
      
      // Clear progress after a short delay
      setTimeout(() => setUploadProgress({}), 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const updatedUrls = uploadedUrls.filter((_, i) => i !== index);
    setUploadedUrls(updatedUrls);
    onFilesUpload(updatedUrls);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newUrls = [...uploadedUrls];
    const [moved] = newUrls.splice(fromIndex, 1);
    newUrls.splice(toIndex, 0, moved);
    setUploadedUrls(newUrls);
    onFilesUpload(newUrls);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">{label}</label>
        <span className="text-xs text-muted-foreground">
          {uploadedUrls.length} / {maxFiles} files
        </span>
      </div>
      
      {/* Upload Area */}
      {uploadedUrls.length < maxFiles && (
        <div className="relative">
          <label 
            htmlFor="multiple-file-input"
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors cursor-pointer bg-background"
          >
            <Upload className="h-10 w-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 text-center">
              {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF up to 5MB each (max {maxFiles} files)
            </p>
            <input
              id="multiple-file-input"
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={accept}
              multiple
              disabled={isUploading}
            />
          </label>
        </div>
      )}
      
      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-12">{progress}%</span>
            </div>
          ))}
        </div>
      )}
      
      {/* Uploaded Images Grid */}
      {uploadedUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {uploadedUrls.map((url, index) => (
            <div 
              key={index}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-primary transition-all"
            >
              <img 
                src={url} 
                alt={`Upload ${index + 1}`} 
                className="w-full h-full object-cover"
              />
              
              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRemove(index)}
                  className="h-8 w-8 p-0"
                >
                  <X size={16} />
                </Button>
                
                {/* Reorder buttons */}
                {index > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReorder(index, index - 1)}
                    className="h-8 w-8 p-0"
                    title="Move left"
                  >
                    ←
                  </Button>
                )}
                {index < uploadedUrls.length - 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => handleReorder(index, index + 1)}
                    className="h-8 w-8 p-0"
                    title="Move right"
                  >
                    →
                  </Button>
                )}
              </div>
              
              {/* Index badge */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {/* Helper Text */}
      {uploadedUrls.length > 0 && uploadedUrls.length < maxFiles && (
        <p className="text-xs text-muted-foreground">
          Tip: You can upload {maxFiles - uploadedUrls.length} more image(s). The first image will be used as the thumbnail.
        </p>
      )}
    </div>
  );
}
