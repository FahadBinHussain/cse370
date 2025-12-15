/**
 * Pixvid API Client for Image Storage
 * https://pixvid.io
 */

const PIXVID_API_KEY = process.env.PIXVID_API_KEY;
const PIXVID_API_URL = 'https://api.pixvid.io/v1';

export interface PixvidUploadResponse {
  success: boolean;
  url: string;
  id: string;
  error?: string;
}

/**
 * Upload an image to Pixvid
 * @param file - The file to upload (File or Blob)
 * @param folder - Optional folder path
 * @returns Upload response with image URL
 */
export async function uploadImageToPixvid(
  file: File | Blob,
  folder: string = 'campaigns'
): Promise<PixvidUploadResponse> {
  try {
    if (!PIXVID_API_KEY) {
      throw new Error('Pixvid API key is not configured');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch(`${PIXVID_API_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PIXVID_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      success: true,
      url: data.url,
      id: data.id,
    };
  } catch (error) {
    console.error('Pixvid upload error:', error);
    return {
      success: false,
      url: '',
      id: '',
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete an image from Pixvid
 * @param imageId - The ID of the image to delete
 * @returns Success status
 */
export async function deleteImageFromPixvid(imageId: string): Promise<boolean> {
  try {
    if (!PIXVID_API_KEY) {
      throw new Error('Pixvid API key is not configured');
    }

    const response = await fetch(`${PIXVID_API_URL}/delete/${imageId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${PIXVID_API_KEY}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Pixvid delete error:', error);
    return false;
  }
}

/**
 * Get optimized image URL with transformations
 * @param url - Original image URL
 * @param options - Transformation options
 * @returns Optimized image URL
 */
export function getOptimizedImageUrl(
  url: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string {
  if (!url) return '';

  const params = new URLSearchParams();
  if (options?.width) params.append('w', options.width.toString());
  if (options?.height) params.append('h', options.height.toString());
  if (options?.quality) params.append('q', options.quality.toString());
  if (options?.format) params.append('f', options.format);

  const queryString = params.toString();
  return queryString ? `${url}?${queryString}` : url;
}

/**
 * Upload multiple images to Pixvid
 * @param files - Array of files to upload
 * @param folder - Optional folder path
 * @returns Array of upload responses
 */
export async function uploadMultipleImages(
  files: (File | Blob)[],
  folder: string = 'campaigns'
): Promise<PixvidUploadResponse[]> {
  const uploadPromises = files.map(file => uploadImageToPixvid(file, folder));
  return Promise.all(uploadPromises);
}
