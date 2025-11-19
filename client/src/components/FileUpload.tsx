import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onFileUpload: (url: string) => void;
  label: string;
  accept?: string;
  currentValue?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  onFileUpload, 
  label, 
  accept = "image/*", 
  currentValue 
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(currentValue || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    
    setFile(selectedFile);
    onFileSelect(selectedFile);
    
    // Create preview for images
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
      
      // Automatically upload images when selected
      setTimeout(() => {
        handleUploadForImage(selectedFile);
      }, 100);
    }
  };

  const handleUploadForImage = async (imageFile: File) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onFileUpload(data.url);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      onFileUpload(data.url);
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    onFileUpload('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      
      {preview ? (
        <div className="relative">
          {preview.startsWith('data:image') || preview.match(/\.(jpeg|jpg|gif|png)$/i) ? (
            <div className="relative w-full h-40 bg-gray-100 rounded-md overflow-hidden">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-full object-contain"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <div className="text-white text-sm">Uploading...</div>
                </div>
              )}
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border rounded-md">
              <span className="truncate max-w-[80%]">
                {file?.name || preview.split('/').pop() || 'Uploaded file'}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1 text-red-500 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 hover:border-primary transition-colors">
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Click or drag file to upload</p>
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileChange}
            accept={accept}
          />
        </div>
      )}
      
      {file && !preview?.startsWith('data:image') && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading}
          className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      )}
      
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}