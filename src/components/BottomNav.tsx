'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleProtectedClick = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    }
  };

  // QR 및 카메라 촬영 전체화면에서는 하단바 숨김
  if (pathname === '/qr' || pathname === '/camera') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200/80 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] z-40 px-2 pb-safe">
      <div className="grid grid-cols-5 items-center h-16">
        {/* 1. 홈 */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
            pathname === '/' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" />
          </svg>
          <span className="text-[10px]">홈</span>
        </Link>

        {/* 2. 분리배출 */}
        <Link
          href="/guide"
          className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
            pathname === '/guide' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {/* 재활용 심볼 SVG */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 19H4.815a1.83 1.83 0 01-1.57-.881 1.785 1.785 0 01-.004-1.784L7.196 9.5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 19h8.203a1.83 1.83 0 001.556-.89 1.784 1.784 0 000-1.775l-1.226-2.12" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 16l-3 3 3 3" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.293 13.596L4.875 9.5l4.625-1.096" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 5.5l1.912-3.31a1.83 1.83 0 013.176 0l3.662 6.34" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.5l-1.25 3.75-3.75-1.25" />
          </svg>
          <span className="text-[10px]">분리배출</span>
        </Link>

        {/* 3. 배출장소 */}
        <Link
          href="/map"
          className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
            pathname === '/map' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {/* 접힌 지도 아이콘 SVG */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span className="text-[10px]">배출장소</span>
        </Link>

        {/* 4. 배출인증 */}
        <Link
          href="/qr"
          onClick={handleProtectedClick}
          className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
            pathname === '/qr' || pathname === '/camera'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {/* QR 스캔 아이콘 SVG */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5v5H4V4zm11 0h5v5h-5V4zM4 15h5v5H4v-5zm11 3h2v2h-2v-2zm3-3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2z" />
          </svg>
          <span className="text-[10px]">배출인증</span>
        </Link>

        {/* 5. 내포인트 */}
        <Link
          href="/my-rewards"
          onClick={handleProtectedClick}
          className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
            pathname === '/my-rewards' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {/* 돼지저금통 / 포인트 아이콘 SVG */}
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11c0-3.866-3.582-7-8-7S3 7.134 3 11c0 1.96.918 3.732 2.4 5l-.4 3h3l.5-1.5c.8.3 1.63.5 2.5.5s1.7-.2 2.5-.5L14 19h3l-.4-3c1.05-.89 1.81-2.06 2.16-3.4H21v-3h-2.1c-.1-.55-.3-1.08-.56-1.58L19 6l-2.5 1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 7.5h3" />
          </svg>
          <span className="text-[10px]">내포인트</span>
        </Link>
      </div>
    </nav>
  );
}
