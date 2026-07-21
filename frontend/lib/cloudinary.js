import axios from 'axios';

export const uploadImageToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No image file provided for upload.');
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.warn('⚠️ Cloudinary cloud name or upload preset is missing from environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset || 'ml_default');

  const url = `https://api.cloudinary.com/v1_1/${cloudName || 'demo'}/image/upload`;

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    if (response.data && response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error('Cloudinary response did not contain secure_url.');
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    const message =
      error.response?.data?.error?.message ||
      error.message ||
      'Failed to upload image to Cloudinary.';
    throw new Error(message);
  }
};
