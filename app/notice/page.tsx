// app/notice/page.tsx
import React from 'react';
import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { Notice, NoticeListResponse } from '@/lib/types';
import NoticeTable from '@/components/NoticeTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export const metadata: Metadata = {
  title: '공지사항 | 한아투어',
  description: '한아투어의 최신 소식과 중요한 안내사항을 확인하세요.',
};

interface NoticePageProps {
  searchParams: {
    page?: string;
    search?: string;
    filter?: string;
  };
}

async function getNotices(page: number = 1, search?: string, filter?: string): Promise<NoticeListResponse> {
  try {
    let whereClause = 'WHERE status = "published"';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (title LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (filter === 'important') {
      whereClause += ' AND isImportant = TRUE';
    }

    // 전체 공지사항 수 조회
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM notices ${whereClause}`,
      params
    );
    const total = (countResult as any)[0].total;

    // 공지사항 목록 조회
    const limit = 10;
    const offset = (page - 1) * limit;
    
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, createdAt 
       FROM notices 
       ${whereClause}
       ORDER BY isImportant DESC, createdAt DESC 
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return {
      notices: notices as Notice[],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return {
      notices: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    };
  }
}

export default async function NoticePage({ searchParams }: NoticePageProps) {
  const page = parseInt(searchParams.page || '1');
  const search = searchParams.search;
  const filter = searchParams.filter;

  const noticeData = await getNotices(page, search, filter);

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 페이지 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Megaphone className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">공지사항</h1>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 공지사항 테이블 */}
          <Card className="shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">
                공지사항 목록
              </CardTitle>
            </CardHeader>
            <CardContent>
              {noticeData.notices.length > 0 ? (
                <NoticeTable notices={noticeData.notices} pagination={noticeData.pagination} />
              ) : (
                <div className="text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <Megaphone className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        공지사항이 없습니다
                      </h3>
                      <p className="text-gray-600">
                        {search ? '검색 결과가 없습니다. 다른 키워드로 검색해보세요.' : '현재 등록된 공지사항이 없습니다.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}