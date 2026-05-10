import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { getAuthUser, isAdmin, addCorsHeaders } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    console.log('Upload request received');
    const user = getAuthUser(req);
    console.log('User:', user);
    if (!isAdmin(user)) {
      console.log('User is not admin');
      return addCorsHeaders(NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 }));
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    console.log('File received:', file ? file.name : 'No file');

    if (!file) {
      return addCorsHeaders(NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 }));
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log('Buffer size:', buffer.length);

    // Upload to Cloudinary
    console.log('Uploading to Cloudinary...');
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: 'restaurant-gallery' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary error:', error);
            reject(error);
          } else {
            console.log('Cloudinary success:', result?.secure_url);
            resolve(result);
          }
        }
      ).end(buffer);
    }) as any;

    return addCorsHeaders(NextResponse.json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id
      }
    }));
  } catch (error: any) {
    console.error('Upload error in catch:', error);
    return addCorsHeaders(NextResponse.json({ success: false, message: 'Server error', error: error.message }, { status: 500 }));
  }
}

export async function OPTIONS() {
  return addCorsHeaders(new NextResponse(null, { status: 204 }));
}
