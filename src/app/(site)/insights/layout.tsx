import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';

export default function InsightsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-base grain-texture">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
