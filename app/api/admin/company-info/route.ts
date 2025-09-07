import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 회사 정보 조회
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

    return NextResponse.json((rows as any[])[0]);
  } catch (error) {
    console.error('회사 정보 조회 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 회사 정보 수정
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      ceo_name,
      established_date,
      business_number,
      online_business_number,
      address,
      phone,
      email,
      privacy_officer,
      introduction,
      vision_title,
      vision_content,
      mission_title,
      mission_content,
      core_values,
      business_areas,
      company_history,
      disclaimers
    } = body;

    // 기존 데이터 확인
    const [existingRows] = await db.execute(
      'SELECT id FROM company_info ORDER BY id DESC LIMIT 1'
    );

    if (!existingRows || (existingRows as any[]).length === 0) {
      // 데이터가 없으면 새로 생성
      const [result] = await db.execute(
        `INSERT INTO company_info (
          company_name, ceo_name, established_date, business_number, online_business_number,
          address, phone, email, privacy_officer, introduction,
          vision_title, vision_content, mission_title, mission_content,
          core_values, business_areas, company_history, disclaimers
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          company_name, ceo_name, established_date, business_number, online_business_number,
          address, phone, email, privacy_officer, introduction,
          vision_title, vision_content, mission_title, mission_content,
          JSON.stringify(core_values), JSON.stringify(business_areas),
          JSON.stringify(company_history), JSON.stringify(disclaimers)
        ]
      );
    } else {
      // 기존 데이터 업데이트
      const [result] = await db.execute(
        `UPDATE company_info SET
          company_name = ?, ceo_name = ?, established_date = ?, business_number = ?, 
          online_business_number = ?, address = ?, phone = ?, email = ?, privacy_officer = ?,
          introduction = ?, vision_title = ?, vision_content = ?, mission_title = ?,
          mission_content = ?, core_values = ?, business_areas = ?, company_history = ?,
          disclaimers = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [
          company_name, ceo_name, established_date, business_number, online_business_number,
          address, phone, email, privacy_officer, introduction,
          vision_title, vision_content, mission_title, mission_content,
          JSON.stringify(core_values), JSON.stringify(business_areas),
          JSON.stringify(company_history), JSON.stringify(disclaimers),
          (existingRows as any[])[0].id
        ]
      );
    }

    return NextResponse.json({ message: '회사 정보가 성공적으로 저장되었습니다.' });
  } catch (error) {
    console.error('회사 정보 수정 오류:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
