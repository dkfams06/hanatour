import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { Tour, ApiResponse } from '@/lib/types';

// 투어 목록 조회
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 기존 호환성을 위한 파라미터들
    const continent = searchParams.get('continent');
    const country = searchParams.get('country');
    const region = searchParams.get('region'); // 도시/지역
    
    // URL 경로에서 전달된 복합 지역 파라미터 처리
    const urlRegion = searchParams.get('region');
    let continentFilter = continent;
    let countryFilter = country;
    let regionFilter = region;
    
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const departureMonth = searchParams.get('departureMonth');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // URL 경로에서 전달된 복합 지역 파라미터 처리 (예: europe/west)
    if (urlRegion && urlRegion.includes('/')) {
      const [mainRegion, subRegion] = urlRegion.split('/');
      
      // URL 경로를 region 필드에 직접 매핑
      regionFilter = `${mainRegion}-${subRegion}`;
      
      // 대륙 정보도 함께 설정 (필요한 경우)
      if (mainRegion === 'europe') {
        continentFilter = 'Europe';
      } else if (mainRegion === 'asia') {
        continentFilter = 'Asia';
      } else if (mainRegion === 'america') {
        continentFilter = 'North America'; // 또는 South America
      } else if (mainRegion === 'africa') {
        continentFilter = 'Africa';
      } else if (mainRegion === 'oceania') {
        continentFilter = 'Oceania';
      }
    }

    // WHERE 조건 구성
    let where = '1=1';
    const params: any[] = [];

    // 기본적으로 게시된 상품만 표시 (관리자가 아닌 경우)
    if (status) {
      where += ' AND t.status = ?';
      params.push(status);
    } else {
      where += ' AND t.status = ?';
      params.push('published');
    }

    // 새로운 카테고리 구조 필터링 제거 (destination, productCategory, themeCategory)
    // 기존 호환성을 위한 필터링만 남김
    if (continentFilter && continentFilter !== 'all') {
      where += ' AND t.continent = ?';
      params.push(continentFilter);
    }
    if (countryFilter && countryFilter !== 'all') {
      where += ' AND t.country = ?';
      params.push(countryFilter);
    }
    if (regionFilter && regionFilter !== 'all') {
      where += ' AND t.region = ?';
      params.push(regionFilter);
    }

    console.log('API 디버깅 정보:', {
      urlRegion,
      continentFilter,
      countryFilter,
      regionFilter,
      where,
      params
    });

    // 특별한 카테고리 처리 (호캠스, 특가할인상품 등)
    const specialCategory = searchParams.get('category');
    if (specialCategory) {
      switch (specialCategory) {
        case 'staycation':
          where += ' AND JSON_CONTAINS(t.product_category_ids, JSON_QUOTE("staycation"))';
          break;
        case 'deals':
          where += ' AND JSON_CONTAINS(t.product_category_ids, JSON_QUOTE("deals"))';
          break;
        case 'staycation-hotels':
          where += ' AND JSON_CONTAINS(t.product_category_ids, JSON_QUOTE("staycation-hotels"))';
          break;
        case 'deals-early-bird':
          where += ' AND JSON_CONTAINS(t.product_category_ids, JSON_QUOTE("deals-early-bird"))';
          break;
      }
    }

    // 가격 필터
    if (minPrice) {
      where += ' AND t.price >= ?';
      params.push(parseInt(minPrice));
    }
    if (maxPrice) {
      where += ' AND t.price <= ?';
      params.push(parseInt(maxPrice));
    }

    // 검색어 필터
    if (search) {
      where += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // 출발월 필터
    if (departureMonth) {
      where += ' AND MONTH(t.departureDate) = ?';
      params.push(parseInt(departureMonth));
    }

    // 정렬 조건 검증
    const allowedSortColumns = ['createdAt', 'price', 'rating', 'departureDate', 'title'];
    const finalSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'createdAt';
    const finalSortOrder = sortOrder.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

    // 페이지네이션
    const offset = (page - 1) * limit;

    // 총 개수 조회 (새로운 구조 포함)
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM tours t
      WHERE ${where}
    `;
    
    const [countResult] = await pool.query<any[]>(countQuery, params);
    const total = countResult[0].total;

    // 투어 목록 조회 (새로운 구조와 기존 구조 모두 포함)
    const query = `
      SELECT 
        t.*
      FROM tours t
      WHERE ${where}
      ORDER BY t.${finalSortBy} ${finalSortOrder}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query<any[]>(query, [...params, limit, offset]);

    // 결과 가공
    const tours = rows.map(row => ({
      ...row,
      images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
      included: typeof row.included === 'string' ? JSON.parse(row.included) : row.included,
      excluded: typeof row.excluded === 'string' ? JSON.parse(row.excluded) : row.excluded,
      product_category_ids: typeof row.product_category_ids === 'string' ? JSON.parse(row.product_category_ids) : row.product_category_ids,
      theme_category_ids: typeof row.theme_category_ids === 'string' ? JSON.parse(row.theme_category_ids) : row.theme_category_ids,
      // 지역 정보 추가
      regionInfo: {
        region: row.region,
        continent: row.continent,
        country: row.country
      }
    }));

    // 페이지네이션 정보
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: tours,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      }
    });

  } catch (error) {
    console.error('투어 목록 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '투어 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 투어 생성 (관리자 전용) - 이제 /api/admin/tours에서 처리하므로 제거
export async function POST(request: Request) {
  return NextResponse.json(
    { success: false, error: '투어 생성은 /api/admin/tours를 사용하세요.' },
    { status: 405 }
  );
}