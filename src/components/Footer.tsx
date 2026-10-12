export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-16 py-10 text-gray-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-6 mb-6 gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gray-800 text-sm">대한민국 탄소중립포인트</span>
            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium">환경부 · 한국환경공단 공동 운영</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-600 font-medium">
            <a href="#" className="hover:text-primary-600">개인정보처리방침</a>
            <a href="#" className="hover:text-primary-600">이용약관</a>
            <a href="#" className="hover:text-primary-600">운영지침 안내</a>
            <a href="#" className="hover:text-primary-600 font-semibold text-gray-800">고객상담센터 1577-0000</a>
          </div>
        </div>
        <div className="space-y-1 text-gray-400">
          <p>(우 22689) 인천광역시 서구 환경로 42 한국환경공단 탄소중립실천포인트 포털 운영본부</p>
          <p>평일 09:00~18:00 (토/일, 공휴일 휴무) | 시스템 장애 문의: 1577-0000</p>
          <p className="pt-2 text-gray-400">© 2026 에코포인트 (EcoPoint) 탄소중립실천포인트 포털. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
