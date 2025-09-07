import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// 여행상품 상세 조회 (GET)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const [rows] = await pool.query<any[]>(
      'SELECT * FROM tours WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const tour = rows[0];
    // 메뉴 카테고리 매핑 정보 추가
    const [menuRows] = await pool.query<any[]>(
      `SELECT mc.* FROM tour_menu_mappings tmm
       JOIN menu_categories mc ON tmm.menu_category_id = mc.id
       WHERE tmm.tour_id = ?
       ORDER BY tmm.is_primary DESC, mc.menu_order ASC`,
      [id]
    );
    // JSON 필드 파싱
    const parsedTour = {
      ...tour,
      images: tour.images ? JSON.parse(tour.images) : [],
      included: tour.included ? JSON.parse(tour.included) : [],
      excluded: tour.excluded ? JSON.parse(tour.excluded) : [],
      menuCategories: menuRows // 메뉴 정보 추가
    };

    return NextResponse.json({ success: true, tour: parsedTour });
  } catch (error) {
    console.error('상품 조회 에러:', error);
    return NextResponse.json(
      { success: false, error: '상품 조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 여행상품 수정 (PUT)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const {
      title, description, images, mainImage, departureDate, maxParticipants, price, included, excluded, continent, country, region, status
    } = body;

    // 🔥 디버깅: 받은 데이터 로그
    console.log('=== 투어 수정 API 디버깅 ===');
    console.log('투어 ID:', id);
    console.log('받은 이미지 데이터:');
    console.log('- mainImage:', mainImage);
    console.log('- images:', images);
    console.log('- images 타입:', typeof images);
    console.log('- images 길이:', Array.isArray(images) ? images.length : 'Not Array');
    console.log('받은 날짜 데이터:');
    console.log('- departureDate:', departureDate);
    console.log('- departureDate 타입:', typeof departureDate);
    console.log('받은 지역 데이터:');
    console.log('- continent:', continent);
    console.log('- country:', country);
    console.log('- region:', region);

    // 날짜 형식 변환 (ISO 형식을 YYYY-MM-DD로 변환)
    let formattedDate = departureDate;
    if (departureDate) {
      try {
        // ISO 형식이나 다른 형식을 YYYY-MM-DD로 변환
        const date = new Date(departureDate);
        formattedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
        console.log('- 변환된 departureDate:', formattedDate);
      } catch (dateError) {
        console.log('- 날짜 변환 에러:', dateError);
        return NextResponse.json(
          { success: false, error: '올바르지 않은 날짜 형식입니다.' },
          { status: 400 }
        );
      }
    }

    // 필수 필드 검증 (images는 선택사항으로 변경) - 계층적 구조 적용
    if (!title || !description || !mainImage || !formattedDate || !maxParticipants || !price || !continent || !country) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다. (continent, country 필수)' },
        { status: 400 }
      );
    }

    if (images && images.length > 5) {
      return NextResponse.json(
        { success: false, error: '이미지는 최대 5장까지 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // 상품 존재 여부 확인
    const [existingRows] = await pool.query<any[]>(
      'SELECT id, images, mainImage, continent, country, region FROM tours WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 🔥 디버깅: 기존 데이터 로그
    const existingTour = existingRows[0];
    console.log('기존 투어 데이터:');
    console.log('- 기존 mainImage:', existingTour.mainImage);
    console.log('- 기존 images:', existingTour.images);
    console.log('- 기존 continent:', existingTour.continent);
    console.log('- 기존 country:', existingTour.country);
    console.log('- 기존 region:', existingTour.region);

    // 🔥 디버깅: JSON 변환 전 데이터 로그
    const imagesToSave = JSON.stringify(images || []);
    console.log('저장할 이미지 데이터:');
    console.log('- JSON.stringify(images):', imagesToSave);

    // 상품 정보 업데이트 - 계층적 구조 필드 추가
    const updateResult = await pool.query(
      `UPDATE tours SET 
        title = ?, description = ?, images = ?, mainImage = ?, 
        departureDate = ?, maxParticipants = ?, price = ?, 
        included = ?, excluded = ?, continent = ?, country = ?, region = ?, status = ?, 
        updatedAt = NOW()
       WHERE id = ?`,
      [
        title,
        description,
        imagesToSave,
        mainImage,
        formattedDate, // 🔥 변환된 날짜 사용
        maxParticipants,
        price,
        JSON.stringify(included || []),
        JSON.stringify(excluded || []),
        continent,
        country,
        region || null, // 지역은 선택사항
        status || 'unpublished',
        id
      ]
    );

    // 🔥 디버깅: 업데이트 결과 로그
    console.log('업데이트 결과:', updateResult);

    // 🔥 디버깅: 업데이트 후 실제 데이터 확인
    const [updatedRows] = await pool.query<any[]>(
      'SELECT images, mainImage, continent, country, region FROM tours WHERE id = ?',
      [id]
    );
    
    if (updatedRows.length > 0) {
      console.log('업데이트 후 실제 저장된 데이터:');
      console.log('- 저장된 mainImage:', updatedRows[0].mainImage);
      console.log('- 저장된 images:', updatedRows[0].images);
      console.log('- 저장된 continent:', updatedRows[0].continent);
      console.log('- 저장된 country:', updatedRows[0].country);
      console.log('- 저장된 region:', updatedRows[0].region);
      
      // JSON 파싱해서 확인
      try {
        const parsedImages = JSON.parse(updatedRows[0].images);
        console.log('- 파싱된 images:', parsedImages);
      } catch (parseError) {
        console.log('- 이미지 JSON 파싱 에러:', parseError);
      }
    }

    console.log('=== 투어 수정 API 디버깅 완료 ===');

    return NextResponse.json({ success: true, message: '여행상품이 수정되었습니다.' });
  } catch (error) {
    console.error('상품 수정 에러:', error);
    return NextResponse.json({ success: false, error: '상품 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// 여행상품 삭제 (DELETE)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // 상품 존재 여부 확인
    const [existingRows] = await pool.query<any[]>(
      'SELECT id FROM tours WHERE id = ?',
      [id]
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        { success: false, error: '상품을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 예약이 있는지 확인 (추후 bookings 테이블 구현 시 활성화)
    // const [bookingRows] = await pool.query<any[]>(
    //   'SELECT id FROM bookings WHERE tourId = ? AND status != "cancelled"',
    //   [id]
    // );
    // 
    // if (bookingRows.length > 0) {
    //   return NextResponse.json(
    //     { success: false, error: '예약이 있는 상품은 삭제할 수 없습니다.' },
    //     { status: 400 }
    //   );
    // }

    // 상품 삭제
    await pool.query('DELETE FROM tours WHERE id = ?', [id]);

    return NextResponse.json({ success: true, message: '여행상품이 삭제되었습니다.' });
  } catch (error) {
    console.error('상품 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '상품 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 