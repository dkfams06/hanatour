import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams: any[] = [];

    // 역할 필터
    if (role && role !== 'all') {
      whereConditions.push('role = ?');
      queryParams.push(role);
    }

    // 검색 필터
    if (search) {
      whereConditions.push('(name LIKE ? OR email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // 총 개수 조회
    const countQuery = `SELECT COUNT(*) as total FROM users ${whereClause}`;
    const [countResult] = await pool.query<any[]>(countQuery, queryParams);
    const totalCount = countResult[0]?.total || 0;

    // 사용자 목록 조회
    const usersQuery = `
      SELECT id, name, email, role, avatar, createdAt, lastLogin, isActive 
      FROM users 
      ${whereClause} 
      ORDER BY createdAt DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    
    const [users] = await pool.query<any[]>(usersQuery, queryParams);

    return NextResponse.json({
      success: true,
      data: {
        users,
        totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 필수 필드 검증
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: '이름과 이메일은 필수 입력 항목입니다.' },
        { status: 400 }
      );
    }

    // 이메일 중복 확인
    const [existingUsers] = await pool.query<any[]>(
      'SELECT id FROM users WHERE email = ?',
      [body.email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: '이미 존재하는 이메일입니다.' },
        { status: 409 }
      );
    }

    // 새 사용자 생성
    const userId = `user_${Date.now()}`;
    const newUser = {
      id: userId,
      name: body.name,
      email: body.email,
      password: body.password ? body.password : null, // 실제로는 해시화 필요
      role: body.role || 'user',
      avatar: body.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isActive: true
    };

    await pool.query(
      `INSERT INTO users (id, name, email, password, role, avatar, isActive) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        newUser.id,
        newUser.name,
        newUser.email,
        newUser.password,
        newUser.role,
        newUser.avatar,
        newUser.isActive
      ]
    );

    // 생성된 사용자 정보 반환 (비밀번호 제외)
    const { password, ...userResponse } = newUser;
    
    return NextResponse.json({ 
      success: true, 
      data: userResponse 
    }, { status: 201 });

  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { success: false, error: '사용자 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}