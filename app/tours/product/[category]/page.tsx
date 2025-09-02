import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegionTourClient from '@/components/RegionTourClient';
import { Region } from '@/lib/types';

interface ProductCategoryPageProps {
  params: {
    category: string;
  };
}

// 카테고리명 매핑
const categoryNames: Record<string, string> = {
  'deals': '특가상품',
  'staycation': '스테이케이션',
  'theme': '테마여행',
  'package': '패키지상품'
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ProductCategoryPageProps): Promise<Metadata> {
  const { category } = params;
  const categoryName = categoryNames[category] || category;
  
  return {
    title: `${categoryName} | 하나투어`,
    description: `하나투어의 ${categoryName} 상품을 만나보세요. 엄선된 여행 패키지와 특별한 혜택을 확인하세요.`,
  };
}

export default function ProductCategoryPage({ params }: ProductCategoryPageProps) {
  const { category } = params;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 제품 카테고리 헤더 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {categoryNames[category] || category}
            </h1>
            <p className="text-xl opacity-90">
              하나투어가 엄선한 {categoryNames[category] || category} 상품을 만나보세요
            </p>
          </div>
        </div>

        {/* 필터 + 투어 목록 (클라이언트 컴포넌트) */}
        <RegionTourClient 
          region={`product/${category}` as Region}
        />
      </main>
      <Footer />
    </div>
  );
} 