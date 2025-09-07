import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { CreateInquiryRequest } from '@/lib/types';

// Dynamic Server Usage 오류 해결을 위한 설정
export const dynamic = 'force-dynamic';

// 문의 목록 조회 (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 필터 파라미터 추출
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');
    const assignedTo = searchParams.get('assignedTo');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // 쿼리 구성
    let query = `
      SELECT 
        i.*,
        COUNT(r.id) as responseCount,
        MAX(r.createdAt) as lastResponseAt
      FROM inquiries i
      LEFT JOIN inquiry_responses r ON i.id = r.inquiryId
      WHERE 1=1
    `;
    const queryParams: any[] = [];

    // 필터 적용
    if (status) {
      query += ` AND i.status = ?`;
      queryParams.push(status);
    }

    if (category) {
      query += ` AND i.category = ?`;
      queryParams.push(category);
    }

    if (priority) {
      query += ` AND i.priority = ?`;
      queryParams.push(priority);
    }

    if (search) {
      query += ` AND (i.inquiryNumber LIKE ? OR i.customerName LIKE ? OR i.subject LIKE ? OR i.content LIKE ?)`;
      const searchPattern = `%${search}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (assignedTo) {
      query += ` AND i.assignedTo = ?`;
      queryParams.push(assignedTo);
    }

    if (startDate) {
      query += ` AND DATE(i.createdAt) >= ?`;
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ` AND DATE(i.createdAt) <= ?`;
      queryParams.push(endDate);
    }

    // 그룹화 및 정렬
    query += ` GROUP BY i.id ORDER BY i.${sortBy} ${sortOrder.toUpperCase()}`;

    // 페이지네이션
    query += ` LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    // 문의 목록 조회
    const [inquiries] = await db.query<any[]>(query, queryParams);

    // 전체 개수 조회
    let countQuery = `
      SELECT COUNT(DISTINCT i.id) as total
      FROM inquiries i
      WHERE 1=1
    `;
    const countParams: any[] = [];

    // 동일한 필터 적용
    if (status) {
      countQuery += ` AND i.status = ?`;
      countParams.push(status);
    }

    if (category) {
      countQuery += ` AND i.category = ?`;
      countParams.push(category);
    }

    if (priority) {
      countQuery += ` AND i.priority = ?`;
      countParams.push(priority);
    }

    if (search) {
      countQuery += ` AND (i.inquiryNumber LIKE ? OR i.customerName LIKE ? OR i.subject LIKE ? OR i.content LIKE ?)`;
      const searchPattern = `%${search}%`;
      countParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (assignedTo) {
      countQuery += ` AND i.assignedTo = ?`;
      countParams.push(assignedTo);
    }

    if (startDate) {
      countQuery += ` AND DATE(i.createdAt) >= ?`;
      countParams.push(startDate);
    }

    if (endDate) {
      countQuery += ` AND DATE(i.createdAt) <= ?`;
      countParams.push(endDate);
    }

    const [countResult] = await db.query<any[]>(countQuery, countParams);
    const total = countResult[0]?.total || 0;

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('문의 목록 조회 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 목록 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 문의 생성 (POST)
export async function POST(request: NextRequest) {
  try {
    const body: CreateInquiryRequest = await request.json();
    const { customerName, customerPhone, customerEmail, category, subject, content } = body;

    // 필수 필드 검증
    if (!customerName || !customerPhone || !category || !subject || !content) {
      return NextResponse.json(
        { success: false, error: '필수 입력값이 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 전화번호 형식 검증
    const phoneRegex = /^01[0-9]-\d{4}-\d{4}$/;
    if (!phoneRegex.test(customerPhone)) {
      return NextResponse.json(
        { success: false, error: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)' },
        { status: 400 }
      );
    }

    // 이메일 형식 검증 (선택사항)
    if (customerEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(customerEmail)) {
        return NextResponse.json(
          { success: false, error: '이메일 형식이 올바르지 않습니다.' },
          { status: 400 }
        );
      }
    }

    // 문의번호 생성 (INQ-YYYY-XXX 형식)
    const year = new Date().getFullYear();
    const [lastInquiry] = await db.query<any[]>(
      'SELECT inquiryNumber FROM inquiries WHERE inquiryNumber LIKE ? ORDER BY inquiryNumber DESC LIMIT 1',
      [`INQ-${year}-%`]
    );

    let sequence = 1;
    if (lastInquiry.length > 0) {
      const lastNumber = lastInquiry[0].inquiryNumber;
      const lastSequence = parseInt(lastNumber.split('-')[2]);
      sequence = lastSequence + 1;
    }

    const inquiryNumber = `INQ-${year}-${sequence.toString().padStart(3, '0')}`;

    // 문의 생성
    const inquiryId = uuidv4();
    const insertQuery = `
      INSERT INTO inquiries (
        id, inquiryNumber, customerName, customerPhone, customerEmail,
        category, subject, content, status, priority, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'medium', NOW(), NOW())
    `;

    await db.query(insertQuery, [
      inquiryId,
      inquiryNumber,
      customerName,
      customerPhone,
      customerEmail || null,
      category,
      subject,
      content
    ]);

    // 관리자 알림 생성
    try {
      await db.query(
        `INSERT INTO admin_alerts (alert_type, reference_id, title, message, is_read, created_at) 
         VALUES (?, ?, ?, ?, FALSE, NOW())`,
        [
          'inquiry',
          inquiryId,
          '새로운 1:1 문의가 접수되었습니다',
          `새로운 1:1 문의가 접수되었습니다. 문의번호: ${inquiryNumber}, 고객: ${customerName}, 제목: ${subject}`
        ]
      );
      console.log(`관리자 알림 생성: 문의 ${inquiryNumber}`);
    } catch (alertError) {
      console.error(`관리자 알림 생성 실패 (${inquiryNumber}):`, alertError);
      // 알림 생성 실패는 전체 프로세스를 중단하지 않음
    }

    // 생성된 문의 정보 조회
    const [createdInquiry] = await db.query<any[]>(
      'SELECT * FROM inquiries WHERE id = ?',
      [inquiryId]
    );

    return NextResponse.json({
      success: true,
      data: createdInquiry[0],
      message: '문의가 성공적으로 등록되었습니다.'
    }, { status: 201 });

  } catch (error) {
    console.error('문의 생성 오류:', error);
    return NextResponse.json(
      { success: false, error: '문의 등록에 실패했습니다.' },
      { status: 500 }
    );
  }
} 