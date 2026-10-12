import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '에코포인트 | AI 비전 실시간 분리배출 공공 인증',
  description: '환경부·한국환경공단 연계 AI 분리배출 실천인증 및 탄소중립포인트 지급 플랫폼',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-100 flex flex-col text-slate-900 antialiased">
        <Header />
        <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
