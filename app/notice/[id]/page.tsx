import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '@/lib/db';
import { Notice } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, Eye, User, AlertTriangle, Megaphone } from 'lucide-react';

interface NoticeDetailPageProps {
  params: {
    id: string;
  };
}

async function getNotice(id: string): Promise<Notice | null> {
  try {
    const [notices] = await db.execute(
      `SELECT id, title, content, author, isImportant, viewCount, createdAt, updatedAt 
       FROM notices 
       WHERE id = ? AND status = "published"`,
      [id]
    );

    if (!(notices as any[]).length) {
      return null;
    }

    return (notices as any[])[0] as Notice;
  } catch (error) {
    console.error('공지사항 조회 오류:', error);
    return null;
  }
}

export async function generateMetadata({ params }: NoticeDetailPageProps): Promise<Metadata> {
  const notice = await getNotice(params.id);
  
  if (!notice) {
    return {
      title: '공지사항을 찾을 수 없습니다 | 한아투어',
    };
  }

  return {
    title: `${notice.title} | 공지사항 | 한아투어`,
    description: notice.content.substring(0, 160) + '...',
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const notice = await getNotice(params.id);

  if (!notice) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 페이지 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="ghost" asChild className="text-white hover:bg-white/20">
                <Link href="/notice" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  목록으로 돌아가기
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Megaphone className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold">공지사항</h1>
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 공지사항 상세 */}
          <Card className="shadow-lg border-0">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    {notice.isImportant && (
                      <Badge variant="destructive" className="text-sm">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        중요 공지
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-4">
                    {notice.title}
                  </CardTitle>
                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{notice.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>작성일: {formatDate(notice.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>조회수: {notice.viewCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="pt-6">
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {formatContent(notice.content)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="flex justify-center mt-8">
            <Button variant="outline" asChild>
              <Link href="/notice">
                목록으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 