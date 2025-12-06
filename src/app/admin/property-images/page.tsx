'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const PROPERTIES = [
  { slug: 'katumode-greens', name: 'Katumode Greens' },
  { slug: 'casuarina-greens', name: 'Casuarina Greens' },
  { slug: 'house-property-koonimedu', name: 'House Property Koonimedu' },
];

export default function PropertyImagesUpload() {
  const router = useRouter();
  const [selectedProperty, setSelectedProperty] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files);
      setMessage(`${e.target.files.length} file(s) selected`);
    }
  };

  const handleUpload = async () => {
    if (!selectedProperty) {
      setMessage('Please select a property');
      return;
    }

    if (!selectedFiles || selectedFiles.length === 0) {
      setMessage('Please select at least one image');
      return;
    }

    if (selectedFiles.length > 10) {
      setMessage('Maximum 10 images allowed');
      return;
    }

    setUploading(true);
    setMessage('Uploading images...');

    try {
      // Step 1: Upload images to R2
      const formData = new FormData();
      Array.from(selectedFiles).forEach((file) => {
        formData.append('files', file);
      });
      formData.append('folder', 'properties');

      const uploadResponse = await fetch('/api/upload/multiple', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'Upload failed');
      }

      // Extract URLs from successful uploads
      const imageUrls = uploadResult.data.uploaded.map((item: any) => item.url);

      setMessage(`Uploaded ${imageUrls.length} images. Updating property...`);

      // Step 2: Update property with new images
      const updateResponse = await fetch('/api/admin/property-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: selectedProperty,
          imageUrls,
          action: 'add', // or 'replace'
        }),
      });

      const updateResult = await updateResponse.json();

      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to update property');
      }

      setMessage(`✅ Successfully added ${imageUrls.length} images to ${selectedProperty}`);
      setSelectedFiles(null);

      // Reset file input
      const fileInput = document.getElementById('file-input') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Upload Property Images
        </h1>

        {/* Property Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Property
          </label>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">-- Choose a property --</option>
            {PROPERTIES.map((property) => (
              <option key={property.slug} value={property.slug}>
                {property.name}
              </option>
            ))}
          </select>
        </div>

        {/* File Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images (Max 10, up to 10MB each)
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            disabled={uploading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: JPG, PNG, WebP
          </p>
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedProperty || !selectedFiles}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>

        {/* Message Display */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg ${
            message.includes('✅')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : message.includes('❌')
              ? 'bg-red-50 text-red-800 border border-red-200'
              : 'bg-blue-50 text-blue-800 border border-blue-200'
          }`}>
            {message}
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-700 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
            <li>Select the property you want to add images to</li>
            <li>Choose one or more image files (up to 10 images)</li>
            <li>Click "Upload Images" to add them to the property</li>
            <li>Images will be stored in Cloudflare R2 and added to the property's gallery</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
