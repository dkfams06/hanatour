import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PackageListings from '@/components/PackageListings';

export default function PackagesPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <PackageListings />
      </main>
      <Footer />
    </div>
  );
}