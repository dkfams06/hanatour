import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import db from '@/lib/db';

// 사이트 설정 조회
export async function GET(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ success: false, message: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const [settings] = await db.execute(`
      SELECT setting_key, setting_value, description 
      FROM site_settings 
      ORDER BY setting_key
    `);

    const settingsMap: Record<string, string> = {};
    (settings as any[]).forEach((setting: any) => {
      settingsMap[setting.setting_key] = setting.setting_value;
    });

    return NextResponse.json({
      success: true,
      settings: {
        site_logo: settingsMap.site_logo || '/images/default-logo.png',
        site_favicon: settingsMap.site_favicon || '/images/default-favicon.ico',
        site_title: settingsMap.site_title || 'Hana-Tour',
        site_description: settingsMap.site_description || '프리미엄 여행 예약 플랫폼',
        logo_size: settingsMap.logo_size || '40'
      }
    });
  } catch (error) {
    console.error('사이트 설정 조회 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 사이트 설정 업데이트
export async function PUT(request: NextRequest) {
  try {
    const authResult = await authenticateToken(request);
    if (!authResult || authResult.role !== 'admin') {
      return NextResponse.json({ success: false, message: '관리자 권한이 필요합니다.' }, { status: 403 });
    }

    const body = await request.json();
    const { site_logo, site_favicon, site_title, site_description, logo_size } = body;

    // 설정 업데이트
    const settings = [
      { key: 'site_logo', value: site_logo },
      { key: 'site_favicon', value: site_favicon },
      { key: 'site_title', value: site_title },
      { key: 'site_description', value: site_description },
      { key: 'logo_size', value: logo_size }
    ];

    for (const setting of settings) {
      await db.execute(`
        INSERT INTO site_settings (setting_key, setting_value) 
        VALUES (?, ?) 
        ON DUPLICATE KEY UPDATE setting_value = ?
      `, [setting.key, setting.value, setting.value]);
    }

    return NextResponse.json({ success: true, message: '사이트 설정이 업데이트되었습니다.' });
  } catch (error) {
    console.error('사이트 설정 업데이트 오류:', error);
    return NextResponse.json({ success: false, message: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
