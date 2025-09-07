import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegionTourClient from '@/components/RegionTourClient';
import { Region } from '@/lib/types';

interface ProductSubCategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  };
}

// 카테고리명 매핑
const categoryNames: Record<string, string> = {
  'deals': '특가상품',
  'staycation': '스테이케이션',
  'theme': '테마여행',
  'package': '패키지상품'
};

// 서브카테고리명 매핑
const subcategoryNames: Record<string, string> = {
  'early-bird': '얼리버드',
  'last-minute': '막판특가',
  'exclusive': '독점상품',
  'hotels': '호텔',
  'resorts': '리조트',
  'pool-villas': '풀빌라',
  'pension': '펜션'
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ProductSubCategoryPageProps): Promise<Metadata> {
  const { category, subcategory } = params;
  const categoryName = categoryNames[category] || category;
  const subcategoryName = subcategoryNames[subcategory] || subcategory;
  
  return {
    title: `${categoryName} ${subcategoryName} | 하나투어`,
    description: `하나투어의 ${categoryName} ${subcategoryName} 상품을 만나보세요. 특별한 혜택과 엄선된 여행 패키지를 확인하세요.`,
  };
}

export default function ProductSubCategoryPage({ params }: ProductSubCategoryPageProps) {
  const { category, subcategory } = params;
  const categoryName = categoryNames[category] || category;
  const subcategoryName = subcategoryNames[subcategory] || subcategory;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 제품 서브 카테고리 헤더 */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-2 text-purple-200 mb-4">
              <span>{categoryName}</span>
              <span>›</span>
              <span>{subcategoryName}</span>
            </div>
            <h1 className="text-4xl font-bold mb-4">
              {categoryName} {subcategoryName}
            </h1>
            <p className="text-xl opacity-90">
              하나투어가 엄선한 {subcategoryName} 상품을 만나보세요
            </p>
          </div>
        </div>

        {/* 필터 + 투어 목록 (클라이언트 컴포넌트) */}
        <RegionTourClient 
          region={`product/${category}/${subcategory}` as Region}
        />
      </main>
      <Footer />
    </div>
  );
} 