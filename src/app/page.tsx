'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');
  const [locCount, setLocCount] = useState<number>(3);

  useEffect(() => {
    setIsClient(true);
    const checkUserAndData = async () => {
      // 1. 로그인 세션 및 프로필 포인트 조회
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const fallbackName = session.user.email?.split('@')[0] || '회원';
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, points')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          if (typeof profile.points === 'number') setPoints(profile.points);
          setUserName(profile.name || fallbackName);
        } else {
          setUserName(fallbackName);
        }
      }

      // 2. 등록된 배출 장소 개수 조회
      const { count } = await supabase
        .from('locations')
        .select('*', { count: 'exact', head: true });
      if (typeof count === 'number' && count > 0) {
        setLocCount(count);
      }
    };

    checkUserAndData();
  }, []);

  const handleProtectedAction = (e: React.MouseEvent) => {
    if (!isLoggedIn) {
      e.preventDefault();
      alert('로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.');
      router.push('/login');
    }
  };

  return (
    <div className="px-5 py-4 flex flex-col min-h-full bg-slate-50/70 space-y-6">
      
      {/* 1. 상단 블루 환경 리워드 포인트 카드 */}
      <Link
        href={isClient && isLoggedIn ? '/my-rewards' : '/login'}
        className="w-full bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-5 shadow-md relative overflow-hidden block group transition hover:shadow-lg"
      >
        {/* 우측 배경 반투명 원형 게이지 그래픽 데코레이션 */}
        <div className="w-44 h-44 rounded-full border-[14px] border-dashed border-white/10 absolute -right-10 -bottom-10 pointer-events-none"></div>
        <div className="w-28 h-28 rounded-full border-2 border-white/10 absolute -right-2 -bottom-2 pointer-events-none"></div>

        <div className="relative z-10 space-y-3">
          {/* 상단 이름 & 내역보기 버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
              <span className="text-xs font-bold text-white/95">
                {isClient && isLoggedIn ? `${userName} 님의 환경 리워드` : '로그인이 필요합니다'}
              </span>
            </div>
            <div className="bg-white/15 group-hover:bg-white/25 transition px-3 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1 backdrop-blur-xs">
              <span>{isClient && isLoggedIn ? '내역 보기' : '로그인'}</span>
              <span>→</span>
            </div>
          </div>

          {/* 중앙 포인트 대형 숫자 */}
          <div className="flex items-baseline space-x-1.5 pt-1">
            <span className="text-4xl font-black tracking-tight">
              {isClient && isLoggedIn ? points.toLocaleString() : '0'}
            </span>
            <span className="text-xl font-extrabold text-emerald-400">P</span>
          </div>

          {/* 하단 천안사랑카드 1:1 전환 안내 뱃지 */}
          <div className="bg-white/15 backdrop-blur-xs rounded-xl px-3 py-1.5 inline-flex items-center space-x-1.5 text-[11px] text-blue-50 font-medium">
            <span className="w-4 h-4 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center text-[10px] font-bold">
              $
            </span>
            <span>천안사랑카드 포인트로 1:1 즉시 전환 가능</span>
          </div>
        </div>
      </Link>

      {/* 2. 타이틀 영역 */}
      <div className="space-y-1 px-0.5">
        <div className="flex items-center space-x-1 text-emerald-700 text-xs font-extrabold">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span>스마트 분리배출 실천</span>
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          환경보호 리워드
        </h2>
        <p className="text-slate-500 text-xs leading-relaxed">
          올바른 분리배출을 인증하고 천안사랑카드 포인트를 적립해보세요.
        </p>
      </div>

      {/* 3. 배출 인증하기 메인 카드 */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
        {/* 상단 헤더 */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-200/60">
                포인트 적립
              </span>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-blue-200/60">
                인증 리워드
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-2">
              배출 인증하기
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              종량제 봉투 QR 스캔 후 사진을 찍어 리워드를 획득하세요
            </p>
          </div>
          {/* 우측 상단 QR 아이콘 박스 */}
          <div className="w-11 h-11 rounded-2xl bg-indigo-50/80 text-blue-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h5v5H4V4zm11 0h5v5h-5V4zM4 15h5v5H4v-5zm11 3h2v2h-2v-2zm3-3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3 3h2v2h-2v-2z" />
            </svg>
          </div>
        </div>

        {/* 중앙 비주얼 프리뷰 배너 */}
        <div className="relative w-full h-36 rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-800 via-teal-900 to-slate-700 flex items-center justify-center shadow-inner">
          <div className="absolute inset-0 opacity-35 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:12px_12px]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

          {/* 정중앙 '스캔 준비 완료' 흰색 캡슐 뱃지 */}
          <div className="relative z-10 bg-white/95 text-blue-700 font-extrabold text-xs px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-blue-600 -ml-2"></span>
            <span>스캔 준비 완료</span>
          </div>

          {/* 하단 좌우 텍스트 & 포인트 뱃지 */}
          <span className="absolute bottom-2.5 left-3.5 text-[11px] text-white/90 font-medium z-10">
            일몰 후 배출 시간 준수
          </span>
          <span className="absolute bottom-2.5 right-3 bg-slate-900/80 text-emerald-400 font-extrabold text-[11px] px-2.5 py-0.5 rounded-lg z-10 border border-emerald-500/30">
            건당 +10P
          </span>
        </div>

        {/* 하단 스캔 및 인증 시작 버튼 */}
        <Link
          href="/qr"
          onClick={handleProtectedAction}
          className="w-full bg-blue-700 hover:bg-blue-800 active:scale-[0.99] text-white font-extrabold py-3.5 rounded-2xl shadow-sm transition flex items-center justify-center space-x-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <circle cx="12" cy="13" r="3" />
          </svg>
          <span>스캔 및 인증 시작</span>
          <span className="text-white/80">›</span>
        </Link>
      </div>

      {/* 4. 간편 시민 서비스 섹션 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-0.5">
          <h3 className="text-sm font-black text-slate-900">간편 시민 서비스</h3>
          <span className="text-[11px] font-bold text-emerald-600">로그인 없이 이용 가능</span>
        </div>

        {/* 카드 1: 천안시 분리배출 요령 */}
        <Link
          href="/guide"
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:border-emerald-200 transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5 min-w-0 pr-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-black text-slate-900 truncate">천안시 분리배출 요령</h4>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  가이드
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                품목별 올바른 배출 방법과 일몰 후 수거 시간 안내 (로그인 불필요)
              </p>
            </div>
          </div>
          <span className="text-slate-300 group-hover:text-slate-500 text-xl font-light shrink-0">›</span>
        </Link>

        {/* 카드 2: 배출 장소 찾기 (하단 미니맵 프리뷰 포함) */}
        <Link
          href="/map"
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:border-blue-200 transition block group space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3.5 min-w-0 pr-2">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-sm font-black text-slate-900 truncate">배출 장소 찾기</h4>
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                    클린하우스
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  내 주변의 지정된 클린하우스 수거 거점 실시간 위치 확인
                </p>
              </div>
            </div>
            <span className="text-slate-300 group-hover:text-slate-500 text-xl font-light shrink-0">›</span>
          </div>

          {/* 미니 지도 프리뷰 영역 */}
          <div className="relative w-full h-24 rounded-2xl overflow-hidden bg-[#eef2f6] border border-slate-200/70">
            <svg className="w-full h-full object-cover opacity-75" viewBox="0 0 400 100" fill="none">
              <rect width="400" height="100" fill="#e8eef5" />
              <path d="M0 30 Q120 45 240 20 T400 40" stroke="#cbd5e1" strokeWidth="6" fill="none" />
              <path d="M80 0 L130 100 M260 0 L220 100 M330 0 L360 100" stroke="#ffffff" strokeWidth="4" />
              <path d="M0 65 L400 55" stroke="#fde047" strokeWidth="3.5" opacity="0.7" />
              <circle cx="115" cy="42" r="5" fill="#2563eb" />
              <circle cx="235" cy="36" r="5" fill="#2563eb" />
              <circle cx="290" cy="60" r="5" fill="#10b981" />
              <text x="275" y="45" fill="#64748b" fontSize="9" fontWeight="bold">천안시 (Cheonan)</text>
            </svg>
            <div className="absolute bottom-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full shadow-xs border border-slate-200/60 flex items-center space-x-1.5 text-[11px] font-bold text-slate-800">
              <span className="text-blue-600">🎯</span>
              <span>가까운 배출지 {locCount}곳 탐색 중</span>
            </div>
          </div>
        </Link>

        {/* 카드 3: 내 카드 등록 / 리워드 전환 */}
        <Link
          href="/my-rewards"
          onClick={handleProtectedAction}
          className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs hover:border-blue-200 transition flex items-center justify-between group"
        >
          <div className="flex items-center space-x-3.5 min-w-0 pr-2">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <h4 className="text-sm font-black text-slate-900 truncate">내 카드 등록 / 리워드 전환</h4>
                <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  지역화폐
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                천안사랑카드 연동하고 적립된 에코 포인트를 캐시로 즉시 전환
              </p>
            </div>
          </div>
          <span className="text-slate-300 group-hover:text-slate-500 text-xl font-light shrink-0">›</span>
        </Link>
      </div>

      {/* 5. 하단 이번 달 천안 시민 탄소 감축량 배너 */}
      <div className="bg-slate-100/90 rounded-2xl p-4 flex items-center space-x-3.5 border border-slate-200/60">
        <div className="w-10 h-10 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <p className="text-xs font-extrabold text-slate-900">이번 달 천안 시민 탄소 감축량</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            총 12,840 kg CO₂ 저감 실천 완료
          </p>
        </div>
      </div>

    </div>
  );
}
