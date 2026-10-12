'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RewardContent() {
  const searchParams = useSearchParams();
  const points = searchParams.get('points') || '350';

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 text-center space-y-6">
      {/* 성공 뱃지 */}
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-2">
        <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
          환경부 탄소중립 실천인증 완료
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI 비전 분리배출 인증 통과!
        </h1>
        <p className="text-sm text-slate-500">
          올바른 자원순환 실천에 감사드립니다. 적립된 포인트는 실시간으로 지급되었습니다.
        </p>
      </div>

      {/* 포인트 지급 하이라이트 박스 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <span className="text-sm font-semibold text-slate-600">지급 완료된 에코포인트</span>
          <span className="text-3xl font-black text-blue-600">+{points} P</span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-3">
            <p className="text-[11px] text-emerald-800 font-medium">온실가스 감축량</p>
            <p className="text-base font-black text-emerald-950 mt-0.5">약 0.38 kg CO₂e</p>
          </div>
          <div className="bg-blue-50/70 border border-blue-200/60 rounded-xl p-3">
            <p className="text-[11px] text-blue-800 font-medium">어린 소나무 효과</p>
            <p className="text-base font-black text-blue-950 mt-0.5">0.05 그루 식재</p>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 font-mono bg-slate-50 p-2.5 rounded-lg flex items-center justify-between">
          <span>블록체인 검증 해시: 0x4f9c...b7e2</span>
          <span className="text-emerald-600 font-bold font-sans">위변조 방지 인증</span>
        </div>
      </div>

      {/* 이동 버튼들 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href="/"
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition text-sm shadow"
        >
          홈 / 대시보드로 돌아가기
        </Link>
        <Link
          href="/my-rewards"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition text-sm shadow"
        >
          내 포인트 적립 내역 확인
        </Link>
      </div>
    </div>
  );
}

export default function RewardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">인증 정보 로딩 중...</div>}>
      <RewardContent />
    </Suspense>
  );
}
