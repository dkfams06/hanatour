import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CustomerService from '@/components/CustomerService';

export default function CustomerPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <CustomerService />
      </main>
      <Footer />
    </div>
  );
}