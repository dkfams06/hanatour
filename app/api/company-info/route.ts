import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 회사 정보 조회 (공개 API)
export async function GET() {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM company_info ORDER BY id DESC LIMIT 1'
    );
    
    if (!rows || (rows as any[]).length === 0) {
      return NextResponse.json(
        { error: '회사 정보를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const companyInfo = (rows as any[])[0];
    
    // JSON 필드들을 파싱
    const response = NextResponse.json({
      ...companyInfo,
      core_values: companyInfo.core_values ? JSON.parse(companyInfo.core_values) : [],
      business_areas: companyInfo.business_areas ? JSON.parse(companyInfo.business_areas) : [],
      company_history: companyInfo.company_history ? JSON.parse(companyInfo.company_history) : [],
      disclaimers: companyInfo.disclaimers ? JSON.parse(companyInfo.disclaimers) : []
    });

    // 캐시 방지 헤더 추가
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('Surrogate-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('회사 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
