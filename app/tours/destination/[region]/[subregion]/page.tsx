import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegionTourClient from '@/components/RegionTourClient';
import { regionInfo } from '@/lib/mockData';
import { Region } from '@/lib/types';

interface SubRegionPageProps {
  params: {
    region: string;
    subregion: string;
  };
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: SubRegionPageProps): Promise<Metadata> {
  const { region, subregion } = params;
  const regionName = regionInfo[region as Region]?.name || region;
  
  return {
    title: `${regionName} ${subregion} 여행 패키지 | 하나투어`,
    description: `${regionName} ${subregion} 지역의 엄선된 여행 패키지를 만나보세요. 하나투어에서 제공하는 최고의 여행 상품을 확인하세요.`,
  };
}

export default function SubRegionPage({ params }: SubRegionPageProps) {
  const { region, subregion } = params;
  
  // 서브 지역을 포함한 지역 문자열 생성
  const fullRegion = `${region}/${subregion}`;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 필터 + 투어 목록 (클라이언트 컴포넌트) */}
        <RegionTourClient 
          region={fullRegion as Region}
        />
      </main>
      <Footer />
    </div>
  );
} 