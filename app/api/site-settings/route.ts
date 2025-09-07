import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// 공개 사이트 설정 조회 (인증 불필요)
export async function GET(request: NextRequest) {
  try {
    const [settings] = await db.execute(`
      SELECT setting_key, setting_value 
      FROM site_settings 
      WHERE setting_key IN ('site_logo', 'site_favicon', 'site_title', 'site_description', 'logo_size')
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
    }, {
      // 캐시 헤더 설정 - 짧은 캐시 시간으로 설정하여 업데이트 반영 개선
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=59'
      }
    });
  } catch (error) {
    console.error('사이트 설정 조회 오류:', error);
    return NextResponse.json({ 
      success: false, 
      message: '서버 오류가 발생했습니다.',
      settings: {
        site_logo: '/images/default-logo.png',
        site_favicon: '/images/default-favicon.ico',
        site_title: 'Hana-Tour',
        site_description: '프리미엄 여행 예약 플랫폼',
        logo_size: '40'
      }
    }, { status: 500 });
  }
}