import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 메뉴 카테고리 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const menuLevel = searchParams.get('level'); // main, sub, all
    const menuType = searchParams.get('type'); // destination, product, theme, all
    const includeStats = searchParams.get('includeStats') === 'true';

    let query = `
      SELECT mc.*,
             parent.name as parent_name,
             ${includeStats ? `
             (SELECT COUNT(*) FROM tour_menu_mappings tmm 
              JOIN tours t ON tmm.tour_id = t.id 
              WHERE tmm.menu_category_id = mc.id
             ) as tour_count,
             ` : ''}
             (SELECT COUNT(*) FROM menu_categories children WHERE children.parent_id = mc.id) as children_count
      FROM menu_categories mc
      LEFT JOIN menu_categories parent ON mc.parent_id = parent.id
      WHERE mc.is_active = TRUE
    `;
    
    const params: any[] = [];

    if (menuLevel && menuLevel !== 'all') {
      console.log('필터링 조건 - menuLevel:', menuLevel);
      query += ' AND mc.menu_level = ?';
      params.push(menuLevel);
    }

    if (menuType && menuType !== 'all') {
      console.log('필터링 조건 - menuType:', menuType);
      query += ' AND mc.menu_type = ?';
      params.push(menuType);
    }

    query += ' ORDER BY mc.menu_order ASC, mc.name ASC';

    console.log('실행할 쿼리:', query);
    console.log('쿼리 파라미터:', params);

    const [rows] = await pool.query<any[]>(query, params);
    
    console.log('쿼리 결과 개수:', rows.length);
    console.log('첫 번째 결과:', rows[0]);

    // 서브메뉴만 조회하는 경우 계층구조 없이 평면 리스트로 반환
    let menuItems;
    if (menuLevel === 'sub') {
      menuItems = rows; // 서브메뉴는 평면 리스트로
    } else {
      menuItems = buildMenuHierarchy(rows); // 나머지는 계층구조로
    }

    console.log('최종 반환 데이터 개수:', menuItems.length);

    return NextResponse.json({ success: true, data: menuItems });
  } catch (error) {
    console.error('메뉴 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 목록을 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 새 메뉴 카테고리 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, name, parent_id, menu_order, menu_level, menu_color, 
      menu_icon, menu_type, href_path, description 
    } = body;

    // 필수 필드 검증
    if (!id || !name || !menu_level || !menu_type) {
      return NextResponse.json(
        { success: false, error: 'ID, 이름, 메뉴 레벨, 메뉴 타입은 필수입니다.' },
        { status: 400 }
      );
    }

    // ID 중복 검사
    const [existingRows] = await pool.query<any[]>(
      'SELECT id FROM menu_categories WHERE id = ?',
      [id]
    );

    if (existingRows.length > 0) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 메뉴 ID입니다.' },
        { status: 400 }
      );
    }

    // 새 메뉴 카테고리 생성
    await pool.query(
      `INSERT INTO menu_categories (
        id, name, parent_id, menu_order, menu_level, menu_color,
        menu_icon, menu_type, href_path, description, is_active, show_in_menu
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, TRUE, TRUE)`,
      [
        id, name, parent_id || null, menu_order || 0, menu_level,
        menu_color || null, menu_icon || null, menu_type,
        href_path || null, description || null
      ]
    );

    // 생성된 메뉴 조회
    const [newRows] = await pool.query<any[]>(
      'SELECT * FROM menu_categories WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: '메뉴 카테고리가 성공적으로 생성되었습니다.',
      data: newRows[0]
    });

  } catch (error) {
    console.error('메뉴 생성 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 카테고리 설정 업데이트 (PUT)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      id, name, parent_id, menu_order, menu_level, menu_color,
      menu_icon, menu_type, href_path, description, is_active, show_in_menu
    } = body;

    // 필수 필드 검증
    if (!id) {
      return NextResponse.json(
        { success: false, error: '메뉴 ID는 필수입니다.' },
        { status: 400 }
      );
    }

    // 메뉴 존재 여부 확인
    const [existingRows] = await pool.query<any[]>(
      'SELECT id FROM menu_categories WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '존재하지 않는 메뉴입니다.' },
        { status: 404 }
      );
    }

    // 메뉴 설정 업데이트
    await pool.query(
      `UPDATE menu_categories SET 
        name = ?, parent_id = ?, menu_order = ?, menu_level = ?, 
        menu_color = ?, menu_icon = ?, menu_type = ?, href_path = ?,
        description = ?, is_active = ?, show_in_menu = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name, parent_id, menu_order || 0, menu_level,
        menu_color, menu_icon, menu_type, href_path,
        description, is_active !== undefined ? is_active : true,
        show_in_menu !== undefined ? show_in_menu : true, id
      ]
    );

    // 업데이트된 정보 조회
    const [updatedRows] = await pool.query<any[]>(
      'SELECT * FROM menu_categories WHERE id = ?',
      [id]
    );

    return NextResponse.json({
      success: true,
      message: '메뉴 설정이 성공적으로 업데이트되었습니다.',
      data: updatedRows[0]
    });

  } catch (error) {
    console.error('메뉴 설정 업데이트 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 설정 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 카테고리 삭제 (DELETE)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: '삭제할 메뉴 ID가 필요합니다.' },
        { status: 400 }
      );
    }

    // 하위 메뉴가 있는지 확인
    const [childrenRows] = await pool.query<any[]>(
      'SELECT id FROM menu_categories WHERE parent_id = ?',
      [id]
    );

    if (childrenRows.length > 0) {
      return NextResponse.json(
        { success: false, error: '하위 메뉴가 있는 메뉴는 삭제할 수 없습니다.' },
        { status: 400 }
      );
    }

    // 연결된 투어가 있는지 확인
    const [tourRows] = await pool.query<any[]>(
      'SELECT tour_id FROM tour_menu_mappings WHERE menu_category_id = ?',
      [id]
    );

    if (tourRows.length > 0) {
      return NextResponse.json(
        { success: false, error: '연결된 투어가 있는 메뉴는 삭제할 수 없습니다. 먼저 투어 연결을 해제하세요.' },
        { status: 400 }
      );
    }

    // 메뉴 삭제
    await pool.query('DELETE FROM menu_categories WHERE id = ?', [id]);

    return NextResponse.json({
      success: true,
      message: '메뉴가 성공적으로 삭제되었습니다.'
    });

  } catch (error) {
    console.error('메뉴 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 메뉴 순서 일괄 업데이트 (PATCH)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { menuItems } = body; // [{ id, menu_order, parent_id }, ...]

    if (!Array.isArray(menuItems) || menuItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '유효한 메뉴 항목 배열이 필요합니다.' },
        { status: 400 }
      );
    }

    // 트랜잭션으로 일괄 업데이트
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      for (const item of menuItems) {
        await connection.query(
          'UPDATE menu_categories SET menu_order = ?, parent_id = ?, updated_at = NOW() WHERE id = ?',
          [item.menu_order, item.parent_id, item.id]
        );
      }

      await connection.commit();
      
      return NextResponse.json({
        success: true,
        message: '메뉴 순서가 성공적으로 업데이트되었습니다.'
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('메뉴 순서 업데이트 에러:', error);
    return NextResponse.json(
      { success: false, error: '메뉴 순서 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 계층 구조 빌드 함수 (메뉴용)
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