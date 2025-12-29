/**
 * Pixvid (Chevereto) Image Storage Client
 * API Documentation: https://pixvid.org/api
 */

const PIXVID_API_KEY = process.env.PIXVID_API_KEY;
const PIXVID_API_URL = process.env.CHEVERETO_API_URL || 'https://pixvid.org/api/1/upload';

export interface PixvidUploadResponse {
  success: boolean;
  url: string;
  id: string;
  error?: string;
}

/**
 * Upload an image to Pixvid
 * @param file - The file to upload (File or Blob)
 * @param folder - Optional folder path (not used by Pixvid)
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

    // Convert file to base64 as required by Chevereto API
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');

    const formData = new FormData();
    formData.append('source', base64);
    formData.append('format', 'json');

    const response = await fetch(PIXVID_API_URL, {
      method: 'POST',
      headers: {
        'X-API-Key': PIXVID_API_KEY,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pixvid API error response:', errorText);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const data = await response.json();
    
    // Chevereto returns data in a specific format
    if (data.status_code !== 200) {
      throw new Error(data.error?.message || 'Upload failed');
    }

    return {
      success: true,
      url: data.image.url,
      id: data.image.id || data.image.id_encoded || '',
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
export async function deleteImageFromPixvid(imageId: string, provider?: string): Promise<boolean> {
  try {
    if (!PIXVID_API_KEY) {
      throw new Error('Pixvid API key is not configured');
    }

    const deleteUrl = process.env.PIXVID_DELETE_URL || `${PIXVID_API_URL.replace('/upload', '')}/${imageId}`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'X-API-Key': PIXVID_API_KEY,
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
