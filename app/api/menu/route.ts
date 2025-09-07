import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 공개 메뉴 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format'); // 'hierarchy' | 'flat'

    const query = `
      SELECT 
        mc.id,
        mc.name,
        mc.parent_id,
        mc.menu_order,
        mc.menu_level,
        mc.menu_color,
        mc.menu_icon,
        mc.menu_type,
        mc.href_path,
        mc.description,
        (SELECT COUNT(*) FROM tour_menu_mappings tmm 
         JOIN tours t ON tmm.tour_id = t.id 
         WHERE tmm.menu_category_id = mc.id AND t.status = 'published'
        ) as tour_count
      FROM menu_categories mc
      WHERE mc.show_in_menu = TRUE 
        AND mc.is_active = TRUE
      ORDER BY mc.menu_order ASC, mc.name ASC
    `;

    const [rows] = await db.query<any[]>(query);

    let menuData;
    
    if (format === 'flat') {
      // 플랫 구조로 반환
      menuData = rows;
    } else {
      // 계층 구조로 반환 (기본값)
      menuData = buildMenuHierarchy(rows);
    }

    return NextResponse.json(
      { 
        success: true, 
        data: menuData,
        meta: {
          totalItems: rows.length,
          lastUpdated: new Date().toISOString()
        }
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600', // 5분 캐시
        },
      }
    );

  } catch (error) {
    console.error('메뉴 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 계층 구조 빌드 함수
function buildMenuHierarchy(menuCategories: any[]): any[] {
  const menuMap = new Map();
  const rootMenus: any[] = [];

  // 모든 메뉴를 맵에 저장하고 children 배열 초기화
  menuCategories.forEach(menu => {
    menuMap.set(menu.id, { ...menu, children: [] });
  });

  // 계층 구조 구성
  menuCategories.forEach(menu => {
    if (menu.parent_id) {
      const parent = menuMap.get(menu.parent_id);
      if (parent) {
        parent.children.push(menuMap.get(menu.id));
      }
    } else {
      rootMenus.push(menuMap.get(menu.id));
    }
  });

  // children 배열을 menu_order로 정렬
  function sortChildren(menus: any[]) {
    menus.forEach(menu => {
      if (menu.children && menu.children.length > 0) {
        menu.children.sort((a: any, b: any) => {
          return a.menu_order - b.menu_order;
        });
        sortChildren(menu.children);
      }
    });
  }

  sortChildren(rootMenus);
  
  return rootMenus;
} 