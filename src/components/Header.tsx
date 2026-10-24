'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.user) {
      setIsLoggedIn(true);
      setUserEmail(session.user.email || '');
      const fallbackName = session.user.email?.split('@')[0] || '회원';
      localStorage.setItem('user', JSON.stringify({ id: session.user.email }));

      const { data: profile } = await supabase
        .from('profiles')
        .select('name, points, role')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUserName(profile.name || fallbackName);
        setPoints(typeof profile.points === 'number' ? profile.points : 0);
        setIsAdmin(profile.role === 'admin');
      } else {
        setUserName(fallbackName);
      }
    } else {
      setIsLoggedIn(false);
      setIsAdmin(false);
      setUserName('');
      setUserEmail('');
      setPoints(0);
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUser();
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header className="bg-white px-5 py-3.5 border-b border-slate-100 flex justify-between items-center sticky top-0 z-40">
        {/* 좌측 로고 및 타이틀 (스티치 디자인 1:1 재현) */}
        <Link href="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xs">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" strokeOpacity={0.35} />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 14.5A4 4 0 0112 8c1.5 0 2.8.8 3.5 2M15.5 9.5A4 4 0 0112 16c-1.5 0-2.8-.8-3.5-2" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 7.5l2 2.5-2.5.5M10 16.5l-2-2.5 2.5-.5" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-emerald-600 leading-none tracking-tight">
              에코 스마트 시티
            </p>
            <h1 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
              Home
            </h1>
          </div>
        </Link>

        {/* 우측 상단 아이콘 3개 (관리자/클린하우스, 로그아웃/로그인, 내 계정 메뉴) */}
        <div className="flex items-center space-x-2">
          {/* 1. 빌딩 아이콘 (관리자일 경우 장소 관리 페이지, 일반 유저일 경우 배출장소 지도) */}
          <Link
            href={isAdmin ? '/admin' : '/map'}
            title={isAdmin ? '관리자 배출 장소 관리' : '클린하우스 배출 장소'}
            className="w-9 h-9 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </Link>

          {/* 2. 나가는 문 아이콘 (로그인 시 로그아웃, 비로그인 시 로그인 이동) */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              title="로그아웃"
              className="w-9 h-9 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          ) : (
            <Link
              href="/login"
              title="로그인"
              className="w-9 h-9 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </Link>
          )}

          {/* 3. 파란 원형 프로필/메뉴 아이콘 (클릭 시 내 계정 이름 & 전체 메뉴 열기) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            title="내 계정 및 전체 메뉴"
            className="w-9 h-9 rounded-full bg-blue-700 hover:bg-blue-800 text-white flex items-center justify-center shadow-xs transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      {/* 🌟 전체 메뉴 모달 (상단 프로필 아이콘 클릭 시 내 계정 이름 + 모든 메뉴 표시) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-50 h-full flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              <div className="bg-blue-700 text-white px-5 pt-5 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-blue-100">내 계정 & 전체 메뉴</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
                >
                  ✕
                </button>
              </div>

              {/* 맨 위: 내 계정 이름 및 보유 포인트 */}
              <div className="bg-blue-700 text-white px-6 pb-7 pt-2 rounded-b-3xl shadow-md">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                        {userName ? userName.slice(0, 1) : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-black truncate">{userName} 님</h2>
                          <span className="bg-emerald-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            {isAdmin ? '관리자' : '인증회원'}
                          </span>
                        </div>
                        <p className="text-xs text-blue-100 truncate mt-0.5">{userEmail}</p>
                      </div>
                    </div>

                    <Link
                      href="/my-rewards"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-white/15 hover:bg-white/20 rounded-2xl p-3.5 flex items-center justify-between transition border border-white/15"
                    >
                      <span className="text-xs text-blue-100 font-medium">내 보유 리워드</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-lg font-black text-emerald-300">{points.toLocaleString()} P</span>
                        <span className="text-xs text-white/80">→</span>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
                    <p className="text-xs text-blue-100">로그인 후 분리배출 리워드를 적립해보세요.</p>
                    <div className="flex space-x-2 pt-1">
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 bg-white text-blue-700 font-extrabold py-2.5 rounded-xl text-center text-xs"
                      >
                        로그인
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 bg-blue-800 text-white font-bold py-2.5 rounded-xl text-center text-xs border border-white/20"
                      >
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 아래: 서비스 메뉴 목록 */}
              <div className="p-5 space-y-2.5">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 text-sm">🏠 홈 화면</span>
                  <span className="text-slate-300">›</span>
                </Link>
                <Link
                  href="/qr"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 text-sm">📸 배출 인증하기</span>
                  <span className="text-slate-300">›</span>
                </Link>
                <Link
                  href="/guide"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 text-sm">📖 천안시 분리배출 요령</span>
                  <span className="text-slate-300">›</span>
                </Link>
                <Link
                  href="/map"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 text-sm">🗺️ 배출 장소 찾기</span>
                  <span className="text-slate-300">›</span>
                </Link>
                <Link
                  href="/my-rewards"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex items-center justify-between"
                >
                  <span className="font-bold text-slate-900 text-sm">💳 내 카드 등록 / 리워드 전환</span>
                  <span className="text-slate-300">›</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center justify-between"
                  >
                    <span className="font-bold text-amber-900 text-sm">⚙️ 관리자 - 배출 장소 관리</span>
                    <span className="text-amber-600">›</span>
                  </Link>
                )}
              </div>
            </div>

            {isLoggedIn && (
              <div className="p-5 pb-24 border-t border-slate-200 bg-white">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 font-bold text-xs transition"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
