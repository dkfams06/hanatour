import { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import BestSellers from '@/components/BestSellers';
import RegionPopular from '@/components/RegionPopular';
import SpecialDeals from '@/components/SpecialDeals';
// import ThemeTravel from '@/components/ThemeTravel';
import CustomerReviews from '@/components/CustomerReviews';
// import TravelNews from '@/components/TravelNews';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Hana-Tour | 프리미엄 여행 예약 플랫폼',
  description: '최고의 여행 패키지, 항공권, 호텔, 투어를 한나투어에서 만나보세요. 꿈꾸던 여행을 현실로 만들어드립니다!',
  openGraph: {
    title: 'Hana-Tour | 프리미엄 여행 예약 플랫폼',
    description: '최고의 여행 패키지, 항공권, 호텔, 투어를 한나투어에서 만나보세요. 꿈꾸던 여행을 현실로 만들어드립니다!',
    url: 'https://hanatour.dhtech4u.com',
    siteName: 'Hana-Tour',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Hana-Tour - 프리미엄 여행 예약 플랫폼',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hana-Tour | 프리미엄 여행 예약 플랫폼',
    description: '최고의 여행 패키지, 항공권, 호텔, 투어를 한나투어에서 만나보세요. 꿈꾸던 여행을 현실로 만들어드립니다!',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'],
  },
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <BestSellers />
        <RegionPopular />
        <SpecialDeals />
        {/* <ThemeTravel /> */}
        <CustomerReviews />
        {/* <TravelNews /> */}
      </main>
      <Footer />
    </div>
  );
}