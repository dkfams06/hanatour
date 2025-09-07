import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { CartProvider } from '@/contexts/CartContext';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hana-Tour | Premium Travel Booking Platform',
  description: 'Discover amazing travel packages, flights, hotels, and tours with Hana-Tour. Book your dream vacation today!',
  keywords: 'travel, booking, tours, flights, hotels, vacation, packages',
  // Open Graph 메타태그 추가 (카카오톡 미리보기용)
  openGraph: {
    title: 'Hana-Tour | Premium Travel Booking Platform',
    description: 'Discover amazing travel packages, flights, hotels, and tours with Hana-Tour. Book your dream vacation today!',
    url: 'https://hanatour.dhtech4u.com',
    siteName: 'Hana-Tour',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop', // 안정적인 외부 이미지
        width: 800,
        height: 600,
        alt: 'Hana-Tour - Premium Travel Booking Platform',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  // Twitter Card 메타태그 추가
  twitter: {
    card: 'summary_large_image',
    title: 'Hana-Tour | Premium Travel Booking Platform',
    description: 'Discover amazing travel packages, flights, hotels, and tours with Hana-Tour. Book your dream vacation today!',
    images: ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop'],
  },
  // 추가 메타태그
  robots: {
    index: true,
    follow: true,
  },
  authors: [{ name: 'Hana-Tour' }],
  creator: 'Hana-Tour',
  publisher: 'Hana-Tour',
  // 카카오톡 전용 메타태그
  other: {
    'naver-site-verification': 'your-verification-code', // 네이버 서치어드바이저 인증 (선택사항)
    'og:image:type': 'image/jpeg',
    'og:image:secure_url': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Tocplus 상담창 스크립트 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              tocplusTop=20;
              tocplusLeft=20;
              tocplusMinimizedImage='http://kr07.tocplus007.com/img/minimized_ko.gif';
              tocplusHAlign='left';
              tocplusWidth=250;
              tocplusHeight=300;
              tocplusUserName='손님';
              tocplusFrameColor='#458fff';
              tocplusFloatingWindow=true;
              var tocplusHost = (("https:" == document.location.protocol) ? "https://" : "http://");
              document.write(unescape("%"+"3Cscript src='" + tocplusHost + "kr07.tocplus007.com/chatLoader.do?userId=angeltour' type='text/javascript'"+"%"+"3E"+"%"+"3C/script"+"%"+"3E"));
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <LanguageProvider>
            <WishlistProvider>
              <CartProvider>
                <SiteSettingsProvider>
                  {children}
                  <Toaster />
                </SiteSettingsProvider>
              </CartProvider>
            </WishlistProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}