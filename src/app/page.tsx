import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-6 flex flex-col min-h-full bg-slate-50">
      <div className="py-8 space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">환경보호 리워드</h2>
        <p className="text-gray-500 text-sm">올바른 분리배출을 실천하고 포인트를 모아보세요.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4 flex-1">
        <Link href="/qr" className="bg-primary-600 text-white rounded-2xl p-6 shadow-md hover:bg-primary-700 transition flex flex-col items-start justify-between h-40">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
          </div>
          <div>
            <h3 className="text-xl font-bold">배출 인증하기</h3>
            <p className="text-primary-100 text-sm mt-1">QR 스캔 후 사진을 찍어 인증하세요</p>
          </div>
        </Link>

        <Link href="/map" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-6 shadow-sm hover:bg-gray-50 transition flex flex-col items-start justify-between h-32">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold">배출 장소 찾기</h3>
          </div>
          <p className="text-gray-500 text-sm">내 주변의 지정된 배출 장소를 확인하세요</p>
        </Link>

        <Link href="/my-rewards" className="bg-white border border-gray-200 text-gray-800 rounded-2xl p-6 shadow-sm hover:bg-gray-50 transition flex flex-col items-start justify-between h-32">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
               <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold">내 리워드 확인</h3>
          </div>
          <p className="text-gray-500 text-sm">지금까지 모은 포인트를 확인하세요</p>
        </Link>
      </div>
    </div>
  );
}
