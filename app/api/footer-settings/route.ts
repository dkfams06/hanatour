import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 푸터 설정 조회 (GET) - 공개 API
export async function GET(request: NextRequest) {
  try {
    // 푸터 설정 조회
    const [settings] = await db.query<any[]>(
      'SELECT setting_key, setting_value, setting_type FROM footer_settings WHERE is_active = TRUE ORDER BY sort_order ASC, id ASC'
    );

    // 설정을 객체로 변환
    const footerData: { [key: string]: any } = {};
    settings.forEach(setting => {
      footerData[setting.setting_key] = setting.setting_value;
    });

    return NextResponse.json({
      success: true,
      data: footerData
    });

  } catch (error) {
    console.error('푸터 설정 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '푸터 설정 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}
