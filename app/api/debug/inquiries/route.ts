import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // 모든 문의 데이터 조회
    const [allInquiries] = await db.query<any[]>(`
      SELECT * FROM inquiries ORDER BY createdAt DESC LIMIT 10
    `);
    
    // 사용자 테이블 확인
    const [users] = await db.query<any[]>(`
      SELECT id, email, name FROM users LIMIT 5
    `);
    
    // 문의 테이블 구조 확인
    const [tableStructure] = await db.query<any[]>(`
      DESCRIBE inquiries
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        inquiries: allInquiries,
        users: users,
        tableStructure: tableStructure
      }
    });
    
  } catch (error) {
    console.error('디버그 API 오류:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
