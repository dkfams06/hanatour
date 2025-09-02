import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegionTourClient from '@/components/RegionTourClient';
import { regionInfo } from '@/lib/mockData';
import { Region } from '@/lib/types';

interface RegionPageProps {
  params: {
    region: string;
  };
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: RegionPageProps): Promise<Metadata> {
  const { region } = params;
  const regionName = regionInfo[region as Region]?.name || region;
  
  return {
    title: `${regionName} 여행 패키지 | 하나투어`,
    description: `${regionName} 지역의 엄선된 여행 패키지를 만나보세요. 하나투어에서 제공하는 최고의 ${regionName} 여행 상품을 확인하세요.`,
  };
}

// 유효한 지역 경로 생성
export function generateStaticParams() {
  return Object.keys(regionInfo).map((region) => ({
    region,
  }));
}

export default function RegionPage({ params }: RegionPageProps) {
  const { region } = params;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* 필터 + 투어 목록 (클라이언트 컴포넌트) */}
        <RegionTourClient region={region as Region} />
      </main>
      <Footer />
    </div>
  );
} 