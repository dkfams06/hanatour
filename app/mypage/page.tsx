import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MyPage from '@/components/MyPage';

export default function MyPagePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <MyPage />
      </main>
      <Footer />
    </div>
  );
}