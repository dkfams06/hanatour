import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const type = data.get('type') as string || 'tour';
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: '파일이 선택되지 않았습니다.' },
        { status: 400 }
      );
    }

    // 파일 형식 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/x-icon', 'image/vnd.microsoft.icon'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'JPEG, PNG, WebP, ICO 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (타입별 제한)
    let maxSize = 5 * 1024 * 1024; // 기본 5MB
    if (type === 'favicon') {
      maxSize = 1 * 1024 * 1024; // 파비콘 1MB
    } else if (type === 'logo') {
      maxSize = 5 * 1024 * 1024; // 로고 5MB
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: `파일 크기는 ${Math.round(maxSize / 1024 / 1024)}MB 이하여야 합니다.` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    // 업로드 디렉토리 결정
    let uploadDir: string;
    let filename: string;
    let imageUrl: string;

    if (type === 'logo' || type === 'favicon') {
      uploadDir = join(process.cwd(), 'public', 'uploads', 'site');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      filename = `${type}_${timestamp}_${randomString}.${extension}`;
      imageUrl = `/uploads/site/${filename}`;
    } else {
      // 기존 투어 이미지 업로드
      uploadDir = join(process.cwd(), 'public', 'uploads', 'tours');
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      filename = `tour_${timestamp}_${randomString}.${extension}`;
      imageUrl = `/uploads/tours/${filename}`;
    }
    
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    return NextResponse.json({
      success: true,
      filePath: imageUrl,
      data: {
        url: imageUrl,
        filename: filename,
        size: file.size,
        type: file.type
      }
    });

  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: '파일 업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 