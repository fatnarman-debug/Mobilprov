import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define content types for common file extensions
const getContentType = (ext: string): string => {
  const contentTypes: Record<string, string> = {
    '.pdf': 'application/pdf',
    '.mp3': 'audio/mpeg',
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.csv': 'text/csv'
  };
  return contentTypes[ext.toLowerCase()] || 'application/octet-stream';
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    
    if (!slug || slug.length === 0) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Construct the file path securely to prevent directory traversal
    const safeSlug = slug.map(part => path.basename(part));
    const filePath = path.join(process.cwd(), 'storage', 'uploads', ...safeSlug);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Check if it's a file and not a directory
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Create a read stream
    const fileBuffer = await fs.promises.readFile(filePath);
    
    const ext = path.extname(filePath);
    const contentType = getContentType(ext);

    // Support for video streaming (range requests)
    const range = request.headers.get('range');
    if (range && (contentType.startsWith('video/') || contentType.startsWith('audio/'))) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunksize = (end - start) + 1;
      
      const stream = fs.createReadStream(filePath, { start, end });
      
      return new NextResponse(stream as any, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize.toString(),
          'Content-Type': contentType,
        },
      });
    }

    // Standard file response
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=86400, immutable'
      },
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
