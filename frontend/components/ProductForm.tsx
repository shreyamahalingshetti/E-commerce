'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { Upload, AlertCircle, Image as ImageIcon, CheckCircle, Loader2 } from 'lucide-react';

interface ProductFormProps {
  existingProduct?: any;
  onSuccess?: (product: any) => void;
}

export default function ProductForm({ existingProduct, onSuccess }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(existingProduct?.name || '');
  const [description, setDescription] = useState(existingProduct?.description || '');
  const [price, setPrice] = useState(existingProduct?.price ? String(existingProduct.price) : '');
  const [stock, setStock] = useState(existingProduct?.stock !== undefined ? String(existingProduct.stock) : '0');
  const [category, setCategory] = useState(existingProduct?.category || '');

  // File and preview states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingProduct?.image_url || existingProduct?.imageUrl || null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(existingProduct?.image_url || existingProduct?.imageUrl || null);

  // Status & error handling states
  const [statusText, setStatusText] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name || '');
      setDescription(existingProduct.description || '');
      setPrice(existingProduct.price ? String(existingProduct.price) : '');
      setStock(existingProduct.stock !== undefined ? String(existingProduct.stock) : '0');
      setCategory(existingProduct.category || '');
      const existingImg = existingProduct.image_url || existingProduct.imageUrl || null;
      setPreviewUrl(existingImg);
      setUploadedImageUrl(existingImg);
    }
  }, [existingProduct]);

  // Clean up object URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setError(null);

      // Create immediate local preview
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numericPrice = parseFloat(price);
    if (!name.trim()) {
      setError('Please provide a product name.');
      return;
    }
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setError('Please provide a valid price greater than zero.');
      return;
    }

    let finalImageUrl = uploadedImageUrl;

    try {
      // Step 1: Upload image to Cloudinary if a new file is selected and not already uploaded
      if (imageFile && (!uploadedImageUrl || previewUrl?.startsWith('blob:'))) {
        setIsUploading(true);
        setStatusText('Uploading image to Cloudinary...');
        try {
          finalImageUrl = await uploadImageToCloudinary(imageFile);
          setUploadedImageUrl(finalImageUrl);
        } catch (uploadErr: any) {
          setError(uploadErr.message || 'Image upload failed. Please try again.');
          setIsUploading(false);
          setStatusText(null);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Step 2: Save to backend API
      setIsSubmitting(true);
      setStatusText(existingProduct ? 'Updating product...' : 'Saving product to catalog...');

      const payload = {
        name: name.trim(),
        description: description.trim(),
        price: numericPrice,
        stock: parseInt(stock, 10) || 0,
        category: category.trim(),
        imageUrl: finalImageUrl,
        image_url: finalImageUrl
      };

      let response;
      if (existingProduct?.id) {
        response = await api.put(`/products/${existingProduct.id}`, payload);
      } else {
        response = await api.post('/products', payload);
      }

      const savedProduct = response.data?.data || response.data;

      if (onSuccess) {
        onSuccess(savedProduct);
      } else {
        router.push(`/products/${savedProduct.id}`);
      }
    } catch (apiErr: any) {
      const errorMsg =
        apiErr.response?.data?.error ||
        apiErr.message ||
        'Failed to save product. Note: Your uploaded image has been saved. You can retry submitting without re-uploading.';
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
      setStatusText(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Product Name */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          Product Name <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wireless Noise-Canceling Headphones"
          required
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      {/* Description */}
      <div style={{ marginBottom: '18px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Highlight key features, specifications, and details..."
          rows={4}
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', lineHeight: '1.5' }}
        />
      </div>

      {/* Price & Stock Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Price ($) <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="99.99"
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
            Stock Quantity
          </label>
          <input
            type="number"
            min="0"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="10"
            required
            style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Category */}
      <div style={{ marginBottom: '22px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          Category
        </label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="e.g. Electronics, Clothing, Footwear"
          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
        />
      </div>

      {/* Image Upload & Immediate Preview */}
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
          Product Image
        </label>

        <div
          style={{
            border: '2px dashed #cbd5e1',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            background: '#f8fafc',
            position: 'relative',
            cursor: 'pointer'
          }}
        >
          {previewUrl ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <img
                src={previewUrl}
                alt="Product preview"
                style={{ maxHeight: '180px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #e2e8f0' }}
              />
              <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle size={14} style={{ color: '#16a34a' }} />
                <span>Image selected. Click below to change.</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: '#64748b' }}>
              <Upload size={32} style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>Click to select product image</span>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>PNG, JPG, WEBP or GIF</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Progress / Status indicator */}
      {statusText && (
        <div style={{ background: '#eff6ff', color: '#1e40af', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
          <span>{statusText}</span>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error display */}
      {error && (
        <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isUploading || isSubmitting}
        style={{
          width: '100%',
          padding: '14px',
          background: '#2563eb',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '15px',
          cursor: isUploading || isSubmitting ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: isUploading || isSubmitting ? 0.7 : 1
        }}
      >
        {isUploading || isSubmitting ? (
          <span>Processing...</span>
        ) : (
          <span>{existingProduct ? 'Update Product' : 'Create Product'}</span>
        )}
      </button>
    </form>
  );
}
