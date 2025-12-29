// Test script to verify Chevereto/Pixvid image upload
import 'dotenv/config';
import { uploadImageToPixvid } from '../lib/pixvid';
import fs from 'fs';
import path from 'path';

async function testImageUpload() {
  try {
    console.log('Testing image upload to Chevereto...');
    console.log('API Key:', process.env.PIXVID_API_KEY ? 'Set' : 'Not set');
    console.log('API URL:', process.env.CHEVERETO_API_URL || 'Using default');

    // Create a simple test image (1x1 red pixel PNG)
    const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';
    const testImageBuffer = Buffer.from(testImageBase64, 'base64');
    
    // Convert to Blob
    const blob = new Blob([testImageBuffer], { type: 'image/png' });
    
    console.log('Uploading test image...');
    const result = await uploadImageToPixvid(blob, 'test');
    
    if (result.success) {
      console.log('✅ Upload successful!');
      console.log('Image URL:', result.url);
      console.log('Image ID:', result.id);
    } else {
      console.log('❌ Upload failed!');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testImageUpload();
