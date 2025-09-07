import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegionTourClient from '@/components/RegionTourClient';
import { Region } from '@/lib/types';

interface ThemePageProps {
  params: {
    theme: string;
  };
}

// 테마명 매핑
const themeNames: Record<string, string> = {
  'luxury': '럭셔리 여행',
  'family': '가족여행',
  'honeymoon': '신혼여행',
  'adventure': '모험여행',
  'cultural': '문화체험',
  'food': '맛집탐방',
  'shopping': '쇼핑여행',
  'healing': '힐링여행',
  'golf': '골프여행',
  'cruise': '크루즈여행'
};

// 동적 메타데이터 생성
export async function generateMetadata({ params }: ThemePageProps): Promise<Metadata> {
  const { theme } = params;
  const themeName = themeNames[theme] || theme;
  
  return {
    title: `${themeName} | 하나투어`,
    description: `하나투어의 ${themeName} 상품을 만나보세요. 특별한 테마로 구성된 엄선된 여행 패키지를 확인하세요.`,
  };
}

export default function ThemePage({ params }: ThemePageProps) {
  const { theme } = params;
  const themeName = themeNames[theme] || theme;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 테마 헤더 */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold mb-4">
              {themeName}
            </h1>
            <p className="text-xl opacity-90">
              {themeName}으로 떠나는 특별한 여행을 만나보세요
            </p>
          </div>
        </div>

        {/* 필터 + 투어 목록 (클라이언트 컴포넌트) */}
        <RegionTourClient 
          region={`theme/${theme}` as Region}
        />
      </main>
      <Footer />
    </div>
  );
} 