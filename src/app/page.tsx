'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [points, setPoints] = useState(24850);
  const [userName, setUserName] = useState('사용자');

  useEffect(() => {
    setIsClient(true);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, points')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          if (profile.name) setUserName(profile.name);
          if (typeof profile.points === 'number') setPoints(profile.points);
        }
      }
    };
    checkUser();
  }, []);

  return (
    <div className="space-y-8">
      {/* 상단 환영 및 배너 */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>탄소중립포인트제 공식 연계</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {isClient && isLoggedIn ? `${userName} 님, 환영합니다!` : '올바른 분리배출로 탄소중립 실천'}
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            AI 비전 카메라로 종량제 배출과 분리수거를 실시간 인증하고, 최대 70,000원의 현금 환전 가능한 에코포인트를 적립받으세요.
          </p>
          
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/camera"
              className="bg-white text-blue-700 font-extrabold px-6 py-3 rounded-xl text-sm shadow hover:bg-blue-50 transition flex items-center space-x-2"
            >
              <span>📸 AI 배출 인증 시작하기</span>
            </Link>
            <Link
              href="/map"
              className="bg-blue-900/40 text-white border border-white/20 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-blue-900/60 transition"
            >
              🗺️ 주변 배출 장소 찾기
            </Link>
          </div>
        </div>

        {/* 배경 데코레이션 원 */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* 요약 통계 대시보드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl">
            💳
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">내 보유 포인트</p>
            <p className="text-2xl font-black text-slate-900">{isClient ? points.toLocaleString() : '...'} P</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
            🌱
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">온실가스 감축 기여</p>
            <p className="text-2xl font-black text-slate-900">12.4 kg CO₂e</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xl">
            🎖️
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium">환경 실천 등급</p>
            <p className="text-2xl font-black text-slate-900">그린레벨 3</p>
          </div>
        </div>
      </div>

      {/* 주요 서비스 바로가기 카드 3개 */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-slate-900">주요 서비스</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 카드 1: 배출 장소 찾기 */}
          <Link
            href="/map"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">스마트 클린하우스 배출 장소</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                가까운 공공 분리배출 거점 및 지정 수거함의 실시간 위치와 현황을 지도에서 확인하세요.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
              <span>지도 바로가기</span>
              <span className="ml-1 group-hover:translate-x-1 transition">→</span>
            </div>
          </Link>

          {/* 카드 2: AI 배출 인증 */}
          <Link
            href="/qr"
            className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-2xl p-6 shadow-md hover:shadow-lg transition flex flex-col justify-between group relative overflow-hidden"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
                인기 실천
              </span>
              <h3 className="text-base font-bold text-white mb-1">AI 비전 실시간 배출 인증</h3>
              <p className="text-xs text-blue-100 leading-relaxed">
                봉투 QR 스캔 후 AI 카메라로 라벨 및 세척 상태를 즉시 판독하여 실시간 포인트를 지급받습니다.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/20 flex items-center text-xs font-bold text-white">
              <span>인증 시작하기</span>
              <span className="ml-1 group-hover:translate-x-1 transition">→</span>
            </div>
          </Link>

          {/* 카드 3: 포인트 환전 / 기부 */}
          <Link
            href="/my-rewards"
            className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col justify-between group"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">포인트 환전 및 기부</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                적립된 탄소중립포인트를 현금 계좌 이체, 네이버페이 포인트 전환, 또는 기후기금으로 기부하세요.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
              <span>환전 및 내역 조회</span>
              <span className="ml-1 group-hover:translate-x-1 transition">→</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
