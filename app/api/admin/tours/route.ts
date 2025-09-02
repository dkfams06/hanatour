import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// 새 투어 생성
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    const requiredFields = ['title', 'description', 'mainImage', 'departureDate', 'maxParticipants', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field}는 필수 입력값입니다.` },
          { status: 400 }
        );
      }
    }

    const tourId = `tour_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const query = `
      INSERT INTO tours (
        id, title, description, images, mainImage, departureDate, 
        maxParticipants, price, included, excluded, 
        continent, country, region, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;

    // 카테고리 데이터 처리
    const productCategoryIds = body.productCategoryIds ? JSON.stringify(body.productCategoryIds) : null;
    const themeCategoryIds = body.themeCategoryIds ? JSON.stringify(body.themeCategoryIds) : null;
    const images = body.images ? JSON.stringify(body.images) : JSON.stringify([]);
    const included = body.included ? JSON.stringify(body.included) : JSON.stringify([]);
    const excluded = body.excluded ? JSON.stringify(body.excluded) : JSON.stringify([]);

    const values = [
      tourId,
      body.title,
      body.description,
      images,
      body.mainImage,
      body.departureDate,
      body.maxParticipants,
      body.price,
      included,
      excluded,
      body.continent || null, // continent
      body.country || null,   // country
      body.region || null,    // region
      body.status || 'draft'
    ];

    await pool.query(query, values);

    return NextResponse.json({
      success: true,
      data: { id: tourId, message: '투어가 성공적으로 생성되었습니다.' }
    });

  } catch (error) {
    console.error('투어 생성 에러:', error);
    return NextResponse.json(
      { success: false, error: '투어 생성에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 여행상품 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50'); // 기본값을 50으로 변경
    const offset = (page - 1) * limit;

    let where = '1=1';
    const params: any[] = [];
    
    // 검색어 필터링
    if (search && search.trim()) {
      where += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm);
    }
    
    if (region) {
      where += ' AND region = ?';
      params.push(region);
    }
    if (status) {
      where += ' AND status = ?';
      params.push(status);
    }

    // 전체 개수 조회
    const [countRows] = await pool.query<any[]>(
      `SELECT COUNT(*) as total FROM tours WHERE ${where}`,
      params
    );
    const totalCount = countRows[0].total;

    // 투어 목록 조회
    const [rows] = await pool.query<any[]>(
      `SELECT * FROM tours WHERE ${where} ORDER BY createdAt DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    // JSON 필드 파싱
    const tours = rows.map(tour => ({
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      included: tour.included ? JSON.parse(tour.included) : [],
      excluded: tour.excluded ? JSON.parse(tour.excluded) : [],
    }));
    
    return NextResponse.json({ 
      success: true, 
      tours,
      totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit)
    });
  } catch (error) {
    console.error('상품 목록 조회 에러:', error);
    return NextResponse.json({ success: false, error: '상품 목록 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
} 