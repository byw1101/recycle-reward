'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/core/utils/supabaseClient';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const loadUserInfo = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsLoggedIn(true);
      setUserEmail(session.user.email || '');
      const fallbackName = session.user.email?.split('@')[0] || '회원';

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
      setUserName('');
      setUserEmail('');
      setPoints(0);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    loadUserInfo();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadUserInfo();
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  // 페이지 이동 시 메뉴 창 자동 닫기
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleProtectedClick = (e: React.MouseEvent, targetPath: string) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('로그인이 필요한 기능입니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
    setIsMenuOpen(false);
    window.location.href = '/';
  };

  // 카메라/QR 전체화면에서는 하단바가 가리지 않도록 숨김 처리 (원할 경우 표시 가능)
  if (pathname === '/qr' || pathname === '/camera') {
    return null;
  }

  return (
    <>
      {/* 🌟 전체 메뉴 화면 (맨 오른쪽 '메뉴' 버튼 클릭 시 표시) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-center bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-slate-50 h-full flex flex-col justify-between overflow-y-auto shadow-2xl">
            <div>
              {/* 상단 닫기 헤더 */}
              <div className="bg-primary-600 text-white px-5 pt-5 pb-3 flex items-center justify-between">
                <span className="text-xs font-bold tracking-wider uppercase text-primary-100">전체 메뉴</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition"
                  aria-label="메뉴 닫기"
                >
                  ✕
                </button>
              </div>

              {/* 👤 맨 위: 내 계정 이름 및 프로필 영역 */}
              <div className="bg-primary-600 text-white px-6 pb-7 pt-2 rounded-b-3xl shadow-md">
                {isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-14 h-14 rounded-2xl bg-white text-primary-600 flex items-center justify-center font-black text-2xl shadow-md shrink-0">
                        {userName ? userName.slice(0, 1) : 'U'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <h2 className="text-xl font-black truncate">{userName} 님</h2>
                          <span className="bg-emerald-400 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0">
                            {isAdmin ? '관리자' : '인증회원'}
                          </span>
                        </div>
                        <p className="text-xs text-primary-100 truncate mt-0.5">{userEmail}</p>
                      </div>
                    </div>

                    {/* 내 포인트 요약 바 */}
                    <Link
                      href="/my-rewards"
                      onClick={() => setIsMenuOpen(false)}
                      className="bg-white/15 hover:bg-white/20 backdrop-blur-xs rounded-2xl p-3.5 flex items-center justify-between transition border border-white/15"
                    >
                      <span className="text-xs text-primary-100 font-medium">보유 에코포인트</span>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-lg font-black text-amber-300">{points.toLocaleString()} P</span>
                        <span className="text-xs text-white/80">→</span>
                      </div>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center text-xl">
                        🔒
                      </div>
                      <div>
                        <h2 className="text-lg font-bold">로그인이 필요합니다</h2>
                        <p className="text-xs text-primary-100 mt-0.5">로그인하고 분리배출 리워드를 받아보세요</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-1">
                      <Link
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 bg-white text-primary-600 font-extrabold py-2.5 rounded-xl text-center text-xs shadow-xs hover:bg-primary-50 transition"
                      >
                        로그인
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 bg-primary-700 text-white font-bold py-2.5 rounded-xl text-center text-xs border border-white/20 hover:bg-primary-800 transition"
                      >
                        회원가입
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* 📋 아래: 나머지 메뉴 선택 리스트 */}
              <div className="p-5 space-y-2.5">
                <p className="text-xs font-bold text-gray-400 px-1 mb-1">서비스 메뉴</p>

                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between hover:border-primary-300 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-base">🏠</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">홈 화면</p>
                      <p className="text-[11px] text-gray-400">메인 대시보드 및 포인트 요약</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>

                <Link
                  href="/qr"
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      handleProtectedClick(e, '/qr');
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between hover:border-primary-300 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-base">📸</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">배출 인증하기</p>
                      <p className="text-[11px] text-gray-400">QR코드 스캔 및 쓰레기 봉투 촬영 인증</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>

                <Link
                  href="/map"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between hover:border-primary-300 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center text-base">🗺️</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">배출 장소 찾기</p>
                      <p className="text-[11px] text-gray-400">내 주변 가장 가까운 클린하우스 지도</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>

                <Link
                  href="/guide"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between hover:border-primary-300 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-base">📖</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">천안시 분리배출 요령</p>
                      <p className="text-[11px] text-gray-400">배출 시간 및 품목별 올바른 분리배출 방법</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>

                <Link
                  href="/my-rewards"
                  onClick={(e) => {
                    if (!isLoggedIn) {
                      handleProtectedClick(e, '/my-rewards');
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                  className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex items-center justify-between hover:border-primary-300 transition"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-base">💳</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">내 리워드 및 천안사랑카드 전환</p>
                      <p className="text-[11px] text-gray-400">적립 내역 확인 및 지역화폐 포인트 전환</p>
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm">›</span>
                </Link>

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between hover:bg-amber-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-9 h-9 rounded-xl bg-amber-200 text-amber-800 flex items-center justify-center text-base">⚙️</span>
                      <div>
                        <p className="font-bold text-amber-900 text-sm">관리자 - 배출 장소 관리</p>
                        <p className="text-[11px] text-amber-700">지번주소로 새 배출 거점 추가 및 삭제</p>
                      </div>
                    </div>
                    <span className="text-amber-600 text-sm">›</span>
                  </Link>
                )}
              </div>
            </div>

            {/* 메뉴 하단 로그아웃 영역 */}
            {isLoggedIn && (
              <div className="p-5 pb-24 border-t border-gray-200 bg-white">
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 font-bold text-xs transition"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🌟 하단 고정 내비게이션 바 */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] z-50 px-2 pb-safe">
        <div className="grid grid-cols-5 items-center h-16 relative">
          
          {/* 1. 왼쪽 첫 번째: 배출 장소 */}
          <Link
            href="/map"
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
              pathname === '/map' && !isMenuOpen ? 'text-primary-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-[10px]">배출장소</span>
          </Link>

          {/* 2. 왼쪽 두 번째: 분리배출 요령 */}
          <Link
            href="/guide"
            onClick={() => setIsMenuOpen(false)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
              pathname === '/guide' && !isMenuOpen ? 'text-primary-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <span className="text-[10px]">배출요령</span>
          </Link>

          {/* 3. 📸 정중앙: 카메라 렌즈 모양 배출 인증 버튼 */}
          <div className="flex flex-col items-center justify-center relative -top-4">
            <Link
              href="/qr"
              onClick={(e) => {
                setIsMenuOpen(false);
                handleProtectedClick(e, '/qr');
              }}
              className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-blue-700 via-primary-600 to-cyan-500 p-1 shadow-[0_6px_20px_rgba(37,99,235,0.45)] hover:scale-105 active:scale-95 transition"
              aria-label="배출 인증하기"
            >
              {/* 바깥 렌즈 메탈 링 */}
              <div className="w-full h-full rounded-full border-2 border-white/80 bg-slate-900/20 flex items-center justify-center relative overflow-hidden">
                {/* 렌즈 내부 조리개 / 스캔 코어 */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-800 border border-cyan-300/60 flex items-center justify-center shadow-inner relative">
                  {/* 렌즈 반사광 포인트 */}
                  <span className="w-2 h-2 rounded-full bg-white/70 absolute top-1.5 left-2 blur-[0.3px]"></span>
                  <span className="w-1 h-1 rounded-full bg-cyan-200/80 absolute bottom-2 right-2"></span>
                  {/* 카메라 렌즈 / 포커스 아이콘 */}
                  <svg className="w-6 h-6 text-white drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3.5" strokeWidth={2.2} />
                  </svg>
                </div>
              </div>
            </Link>
            <span className="text-[10px] font-extrabold text-primary-600 mt-1 tracking-tight">배출인증</span>
          </div>

          {/* 4. 오른쪽 네 번째: 내 리워드 */}
          <Link
            href="/my-rewards"
            onClick={(e) => {
              setIsMenuOpen(false);
              handleProtectedClick(e, '/my-rewards');
            }}
            className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
              pathname === '/my-rewards' && !isMenuOpen ? 'text-primary-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px]">내 리워드</span>
          </Link>

          {/* 5. 맨 오른쪽: 전체 메뉴 화면 열기 버튼 */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center space-y-1 py-1 transition ${
              isMenuOpen ? 'text-primary-600 font-bold' : 'text-gray-400 hover:text-gray-700'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-[10px]">메뉴</span>
          </button>

        </div>
      </nav>
    </>
  );
}
