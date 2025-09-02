import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TransactionHistory from '@/components/TransactionHistory';

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-16 sm:pb-0">
        <TransactionHistory />
      </main>
      <Footer />
    </div>
  );
}
