'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function RewardContent() {
  const searchParams = useSearchParams();
  const points = searchParams.get('points') || '0';

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-full space-y-8 w-full mt-10">
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">인증 완료!</h2>
        <p className="text-gray-600">올바른 분리배출 감사합니다.<br/>리워드가 지급되었습니다.</p>
      </div>

      <div className="w-full bg-slate-100 p-8 rounded-2xl flex flex-col items-center space-y-2 shadow-inner border border-slate-200">
        <p className="text-sm text-gray-500 font-medium">지급된 포인트</p>
        <p className="text-4xl font-bold text-primary-600">+{points} P</p>
      </div>

      <Link href="/" className="w-full bg-slate-800 text-white font-semibold py-4 rounded-xl text-center shadow-md hover:bg-slate-900 transition mt-12">
        홈으로 돌아가기
      </Link>
    </div>
  );
}

export default function RewardPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-gray-500">로딩 중...</div>}>
      <RewardContent />
    </Suspense>
  );
}
