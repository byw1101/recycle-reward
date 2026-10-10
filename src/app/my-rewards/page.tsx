import Link from 'next/link';

export default function MyRewardsPage() {
  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-4 bg-primary-600 text-white flex items-center border-b border-primary-500">
        <Link href="/" className="text-primary-100 hover:text-white mr-4">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-lg font-bold">내 리워드</h2>
      </div>

      <div className="bg-primary-600 text-white px-6 pb-12 pt-6 rounded-b-3xl shadow-md">
         <p className="text-primary-100 text-sm mb-1">사용 가능한 포인트</p>
         <div className="flex items-baseline space-x-2">
             <h1 className="text-5xl font-bold">1,400</h1>
             <span className="text-xl font-medium">P</span>
         </div>
      </div>

      <div className="p-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
           <h3 className="font-bold text-gray-800 mb-4 px-2">최근 적립 내역</h3>
           <div className="space-y-4">
              <div className="flex justify-between items-center px-2 py-1">
                 <div>
                    <p className="font-semibold text-gray-800 text-sm">종량제 배출 인증 완료</p>
                    <p className="text-xs text-gray-400">2026.10.10 14:30</p>
                 </div>
                 <span className="font-bold text-primary-600">+100 P</span>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                 <div>
                    <p className="font-semibold text-gray-800 text-sm">투명 페트병 배출 인증</p>
                    <p className="text-xs text-gray-400">2026.10.08 09:15</p>
                 </div>
                 <span className="font-bold text-primary-600">+50 P</span>
              </div>
              <div className="flex justify-between items-center px-2 py-1">
                 <div>
                    <p className="font-semibold text-gray-800 text-sm">종량제 배출 인증 완료</p>
                    <p className="text-xs text-gray-400">2026.10.05 19:42</p>
                 </div>
                 <span className="font-bold text-primary-600">+100 P</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
