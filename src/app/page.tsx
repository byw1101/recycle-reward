'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [points, setPoints] = useState<number>(0);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    setIsClient(true);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const fallbackName = session.user.email?.split('@')[0] || '회원';
        // DB에서 최신 포인트 및 프로필 정보 가져오기
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
    };
    checkUser();
  }, []);

  return (
    <div className="p-6 flex flex-col min-h-full bg-slate-50">
      
      {/* 🌟 로그인 시 최상단에 뜨는 '내 잔여 포인트' 카드 (누르면 내역 창으로 이동) */}
      {isClient && isLoggedIn && (
        <Link
          href="/my-rewards"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-5 shadow-md flex items-center justify-between mb-5 group hover:shadow-lg transition cursor-pointer"
        >
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <p className="text-blue-100 text-xs font-semibold">
                {userName ? `${userName} 님의 잔여 포인트` : '내 보유 리워드 포인트'}
              </p>
            </div>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-3xl font-black tracking-tight">{points.toLocaleString()}</span>
              <span className="text-xl font-bold">P</span>
            </div>
          </div>
          <div className="flex items-center text-xs font-bold bg-white/20 px-3 py-1.5 rounded-full group-hover:bg-white/30 transition backdrop-blur-xs">
            <span>내역 보기</span>
            <span className="ml-1 group-hover:translate-x-0.5 transition">→</span>
          </div>
        </Link>
      )}

      <div className="py-3 space-y-1">
        <h2 className="text-2xl font-bold text-gray-900">환경보호 리워드</h2>
        <p className="text-gray-500 text-sm">올바른 분리배출을 실천하고 천안사랑카드 포인트를 모아보세요.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-3.5 flex-1 mt-2">
        
        {/* 1. 항상 보이는 버튼: 천안시 분리배출 요령 안내 */}
        <Link
          href="/guide"
          className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-5 shadow-2xs hover:bg-gray-50 hover:border-emerald-300 transition flex flex-col items-start justify-between min-h-[100px]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shrink-0 font-bold text-lg">
              📖
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">천안시 분리배출 요령</h3>
              <p className="text-gray-500 text-xs mt-0.5">품목별 올바른 배출 방법과 일몰 후 수거 시간 안내</p>
            </div>
          </div>
        </Link>

        {/* 2. 항상 보이는 버튼: 배출 장소 찾기 */}
        <Link
          href="/map"
          className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-5 shadow-2xs hover:bg-gray-50 hover:border-blue-300 transition flex flex-col items-start justify-between min-h-[100px]"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">배출 장소 찾기</h3>
              <p className="text-gray-500 text-xs mt-0.5">내 주변 가장 가까운 클린하우스 배출 거점 확인</p>
            </div>
          </div>
        </Link>

        {/* 로그인 했을 때만 보이는 영역 */}
        {isClient && isLoggedIn ? (
          <>
            {/* 3. 배출 인증하기 안내 카드 */}
            <Link
              href="/qr"
              className="bg-primary-600 text-white rounded-2xl p-5 shadow-md hover:bg-primary-700 transition flex items-center justify-between mt-1"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-11 h-11 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <circle cx="12" cy="13" r="3.5" strokeWidth={2} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold">배출 인증하기</h3>
                  <p className="text-primary-100 text-xs mt-0.5">하단 중앙 렌즈 버튼 또는 여기를 눌러 인증하세요</p>
                </div>
              </div>
              <span className="text-white/80 font-bold text-sm">→</span>
            </Link>

            {/* 4. 내 리워드 확인 버튼 */}
            <Link
              href="/my-rewards"
              className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-5 shadow-2xs hover:bg-gray-50 hover:border-green-300 transition flex flex-col items-start justify-between min-h-[100px]"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center text-green-600 shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">내 리워드 및 천안사랑카드 전환</h3>
                  <p className="text-gray-500 text-xs mt-0.5">적립 내역 확인 및 천안사랑카드로 포인트 전환</p>
                </div>
              </div>
            </Link>
          </>
        ) : isClient ? (
          /* 로그인하지 않았을 때 보여줄 안내 상자 */
          <div className="mt-2 p-6 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center text-center h-44 space-y-2.5">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-slate-700 font-bold text-sm">로그인이 필요합니다</p>
              <p className="text-slate-400 text-xs mt-0.5">
                배출 인증 및 포인트 적립/전환은<br />로그인 후 이용할 수 있습니다.
              </p>
            </div>
            <Link href="/login" className="text-primary-600 font-bold text-xs hover:underline mt-1">
              로그인 하러 가기 →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
