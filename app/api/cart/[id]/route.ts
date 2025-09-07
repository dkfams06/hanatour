import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

interface RouteParams {
  params: {
    id: string;
  };
}

// JWT에서 사용자 정보 추출
function getUserFromToken(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

// 세션 ID 가져오기
function getSessionId(request: NextRequest): string | null {
  return request.cookies.get('cart_session')?.value || null;
}

// 장바구니 아이템 수정 (PUT)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getUserFromToken(request);
    const sessionId = getSessionId(request);
    const cartId = params.id;
    const body = await request.json();

    // 권한 확인을 위해 장바구니 아이템 조회
    let authQuery = 'SELECT * FROM cart WHERE id = ?';
    let authParams = [cartId];

    if (user) {
      authQuery += ' AND userId = ?';
      authParams.push(user.id);
    } else {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: '세션이 유효하지 않습니다.' },
          { status: 401 }
        );
      }
      authQuery += ' AND sessionId = ? AND userId IS NULL';
      authParams.push(sessionId);
    }

    const [cartItems] = await pool.query<any[]>(authQuery, authParams);
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '장바구니 아이템을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const currentItem = cartItems[0];

    // 업데이트할 필드들
    const allowedFields = [
      'participants', 'customerName', 'customerPhone', 
      'customerEmail', 'specialRequests'
    ];

    const updates: string[] = [];
    const values: any[] = [];

    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key) && body[key] !== undefined) {
        updates.push(`${key} = ?`);
        values.push(body[key]);
      }
    });

    // participants가 변경되면 totalAmount도 재계산
    if (body.participants && body.participants !== currentItem.participants) {
      updates.push('totalAmount = ?');
      values.push(currentItem.price * body.participants);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: '업데이트할 필드가 없습니다.' },
        { status: 400 }
      );
    }

    // 업데이트 실행
    const updateQuery = `UPDATE cart SET ${updates.join(', ')}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(cartId);

    await pool.query(updateQuery, values);

    // 업데이트된 아이템 조회
    const [updatedItems] = await pool.query<any[]>(
      'SELECT * FROM cart WHERE id = ?',
      [cartId]
    );

    return NextResponse.json({
      success: true,
      message: '장바구니가 업데이트되었습니다.',
      data: updatedItems[0]
    });

  } catch (error) {
    console.error('장바구니 수정 에러:', error);
    return NextResponse.json(
      { success: false, error: '장바구니 수정 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// 장바구니 아이템 삭제 (DELETE)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = getUserFromToken(request);
    const sessionId = getSessionId(request);
    const cartId = params.id;

    // 권한 확인
    let authQuery = 'SELECT tourTitle FROM cart WHERE id = ?';
    let authParams = [cartId];

    if (user) {
      authQuery += ' AND userId = ?';
      authParams.push(user.id);
    } else {
      if (!sessionId) {
        return NextResponse.json(
          { success: false, error: '세션이 유효하지 않습니다.' },
          { status: 401 }
        );
      }
      authQuery += ' AND sessionId = ? AND userId IS NULL';
      authParams.push(sessionId);
    }

    const [cartItems] = await pool.query<any[]>(authQuery, authParams);
    
    if (cartItems.length === 0) {
      return NextResponse.json(
        { success: false, error: '장바구니 아이템을 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    // 삭제 실행
    await pool.query('DELETE FROM cart WHERE id = ?', [cartId]);

    return NextResponse.json({
      success: true,
      message: `${cartItems[0].tourTitle}이(가) 장바구니에서 제거되었습니다.`
    });

  } catch (error) {
    console.error('장바구니 삭제 에러:', error);
    return NextResponse.json(
      { success: false, error: '장바구니 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}