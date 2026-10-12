'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function Header() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [points, setPoints] = useState<number>(24850); // 기본값 / 연동값
  const [userName, setUserName] = useState<string>('사용자');

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, points, role')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          if (profile.name) setUserName(profile.name);
          if (typeof profile.points === 'number') setPoints(profile.points);
          if (profile.role === 'admin') setIsAdmin(true);
        } else {
          setUserName(session.user.email?.split('@')[0] || '사용자');
        }
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserData();
      } else {
        setIsAdmin(false);
        setUserName('게스트');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* 로고 영역 */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm group-hover:bg-blue-700 transition">
            E
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xl font-bold text-gray-900 tracking-tight">에코포인트</span>
              <span className="bg-blue-50 text-blue-600 text-[11px] font-semibold px-1.5 py-0.5 rounded border border-blue-200">
                공공 인증
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-medium leading-none mt-0.5">
              환경부 · 한국환경공단 연계 플랫폼
            </p>
          </div>
        </Link>

        {/* 중앙 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-semibold">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition ${
              pathname === '/' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            홈 / 대시보드
          </Link>
          <Link
            href="/camera"
            className={`px-3.5 py-2 rounded-lg transition ${
              pathname === '/camera' || pathname === '/qr'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            배출 인증하기
          </Link>
          <Link
            href="/my-rewards"
            className={`px-3 py-2 rounded-lg transition ${
              pathname === '/my-rewards' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            포인트 환전/기부
          </Link>
          <Link
            href="/map"
            className={`px-3 py-2 rounded-lg transition ${
              pathname === '/map' ? 'text-blue-600 font-bold bg-blue-50/70' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            배출 장소 안내
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-lg transition ${
                pathname === '/admin' ? 'bg-amber-100 text-amber-800' : 'text-amber-700 hover:bg-amber-50'
              }`}
            >
              ⚙️ 관리자
            </Link>
          )}
        </nav>

        {/* 우측 프로필 / 포인트 영역 */}
        <div className="flex items-center space-x-3">
          {/* 포인트 뱃지 */}
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{points.toLocaleString()} P</span>
          </div>

          {/* 알림 벨 아이콘 */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition rounded-full hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* 유저 프로필 아바타 / 로그인 버튼 */}
          {isLoggedIn ? (
            <div className="flex items-center space-x-2.5 pl-1 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {userName.slice(0, 1)}
              </div>
              <div className="hidden sm:block text-left text-xs">
                <p className="font-bold text-gray-800 leading-tight">{userName} 님</p>
                <p className="text-[10px] text-emerald-600 font-medium">그린레벨 3</p>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-gray-400 hover:text-red-500 transition ml-1"
                title="로그아웃"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-gray-900 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-800 transition"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
