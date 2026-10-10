import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '공공 쓰레기 분리배출 인증',
  description: '올바른 분리배출을 실천하고 리워드를 받으세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-slate-50 flex justify-center">
        <main className="w-full max-w-md bg-white min-h-screen shadow-lg flex flex-col relative overflow-hidden">
          <Header />
          <div className="flex-1 overflow-y-auto relative z-0">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
