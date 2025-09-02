import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TourCalendar from '@/components/TourCalendar';

export default function CalendarPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <TourCalendar />
      </main>
      <Footer />
    </div>
  );
}