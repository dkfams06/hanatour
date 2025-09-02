import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 투어를 메뉴 카테고리에 연결
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tourIds, categoryIds } = body;

    if (!tourIds || !Array.isArray(tourIds) || tourIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '투어 ID 목록이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
      return NextResponse.json(
        { success: false, error: '카테고리 ID 목록이 필요합니다.' },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

      // 기존 연결 정보를 모두 삭제 (선택된 투어들의)
      const deleteQuery = `
        DELETE FROM tour_menu_mappings 
        WHERE tour_id IN (${tourIds.map(() => '?').join(',')})
      `;
      await connection.query(deleteQuery, tourIds);

      // 새로운 연결 정보 추가
      const insertValues = [];
      const insertParams = [];
      
      for (const tourId of tourIds) {
        for (let i = 0; i < categoryIds.length; i++) {
          const categoryId = categoryIds[i];
          insertValues.push('(?, ?, ?)');
          insertParams.push(tourId, categoryId, i === 0 ? 1 : 0); // 첫 번째 카테고리를 주 카테고리로
        }
      }

      if (insertValues.length > 0) {
        const insertQuery = `
          INSERT INTO tour_menu_mappings (tour_id, menu_category_id, is_primary) 
          VALUES ${insertValues.join(', ')}
        `;
        await connection.query(insertQuery, insertParams);
      }

      await connection.commit();

      return NextResponse.json({
        success: true,
        message: `${tourIds.length}개 투어가 ${categoryIds.length}개 카테고리에 연결되었습니다.`,
        data: {
          tourCount: tourIds.length,
          categoryCount: categoryIds.length,
          mappingCount: insertValues.length
        }
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('카테고리 연결 에러:', error);
    return NextResponse.json(
      { success: false, error: '카테고리 연결 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 