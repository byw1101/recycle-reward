'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function GuidePage() {
  const [activeTab, setActiveTab] = useState<'all' | 'recycle' | 'general' | 'special'>('all');

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-12">
      {/* 상단 헤더 */}
      <div className="p-4 bg-white shadow-xs flex items-center border-b sticky top-0 z-20">
        <Link href="/" className="text-gray-500 hover:text-gray-800 mr-3 p-1">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h2 className="text-lg font-bold text-gray-900">천안시 분리배출 요령</h2>
          <p className="text-[11px] text-gray-500">천안시 청소행정과 공공 가이드라인</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* 핵심 배출 시간 및 4대 원칙 배너 */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center space-x-1.5 bg-white/20 px-2.5 py-1 rounded-full text-xs font-semibold w-fit">
            <span>🌙</span>
            <span>천안시 배출 시간 안내</span>
          </div>
          <h3 className="text-xl font-bold leading-snug">
            일몰 후(해가 진 뒤)부터<br />자정(24:00)까지 배출
          </h3>
          <p className="text-xs text-emerald-100 leading-relaxed">
            수거는 다음 날 새벽부터 시작됩니다. 낮 시간대 배출 시 도시 미관 저해 및 악취 발생으로 과태료가 부과될 수 있습니다.
          </p>

          <div className="pt-2 border-t border-white/20 grid grid-cols-4 gap-1 text-center text-xs font-medium">
            <div className="bg-white/10 rounded-lg py-1.5">
              <span className="block text-[10px] text-emerald-200">1단계</span>
              <span>비운다</span>
            </div>
            <div className="bg-white/10 rounded-lg py-1.5">
              <span className="block text-[10px] text-emerald-200">2단계</span>
              <span>헹군다</span>
            </div>
            <div className="bg-white/10 rounded-lg py-1.5">
              <span className="block text-[10px] text-emerald-200">3단계</span>
              <span>분리한다</span>
            </div>
            <div className="bg-white/10 rounded-lg py-1.5">
              <span className="block text-[10px] text-emerald-200">4단계</span>
              <span>안섞는다</span>
            </div>
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div className="flex space-x-2 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'all' ? 'bg-primary-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => setActiveTab('recycle')}
            className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'recycle' ? 'bg-primary-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            재활용품 (페트/캔/종이)
          </button>
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'general' ? 'bg-primary-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            일반/불연성 종량제
          </button>
          <button
            onClick={() => setActiveTab('special')}
            className={`px-3.5 py-2 rounded-xl transition shrink-0 ${
              activeTab === 'special' ? 'bg-primary-600 text-white shadow-xs' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            대형폐기물 / 폐가전
          </button>
        </div>

        {/* 카드 목록 */}
        <div className="space-y-3.5">
          {/* 1. 투명 페트병 (별도 배출) */}
          {(activeTab === 'all' || activeTab === 'recycle') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                  🥤
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">투명 페트병 (별도 분리배출)</h4>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                    천안시 중점 관리 품목
                  </span>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li>생수·음료 무색 투명 페트병만 해당 (유색 페트병은 일반 플라스틱 배출).</li>
                <li><strong>내용물을 깨끗이 비우고 물로 헹군 뒤</strong> 라벨을 완전히 떼어냅니다.</li>
                <li>부피를 줄이기 위해 발로 밟아 압착한 후 <strong>뚜껑을 닫아서</strong> 투명 비닐봉투에 따로 모아 배출합니다.</li>
              </ul>
            </div>
          )}

          {/* 2. 플라스틱 & 비닐류 */}
          {(activeTab === 'all' || activeTab === 'recycle') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                  🛍️
                </span>
                <h4 className="font-bold text-gray-900 text-sm">플라스틱 및 비닐류</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li><strong>일반 플라스틱</strong>: 유색 페트병, 샴푸통, 세제통 등은 부착 라벨 제거 후 배출.</li>
                <li><strong>비닐류</strong>: 과자봉지, 라면봉지 등 깨끗한 비닐만 투명 비닐봉투에 모아 배출.</li>
                <li><span className="text-red-500 font-semibold">주의:</span> 기름이나 음식물 양념이 묻어 지워지지 않는 비닐 및 플라스틱 용기는 <strong>종량제 봉투</strong>로 배출해야 합니다.</li>
              </ul>
            </div>
          )}

          {/* 3. 캔 / 고철류 */}
          {(activeTab === 'all' || activeTab === 'recycle') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                  🥫
                </span>
                <h4 className="font-bold text-gray-900 text-sm">캔류 및 고철류</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li>음료·통조림 캔: 내용물을 비우고 물로 헹군 뒤 압착하여 배출.</li>
                <li><strong>부탄가스·살충제 용기</strong>: 통풍이 잘되는 야외에서 노즐을 눌러 <strong>잔여 가스를 완전히 배출 후 구멍을 뚫어</strong> 배출 (화재·폭발 방지 필수!).</li>
              </ul>
            </div>
          )}

          {/* 4. 종이류 & 종이팩 */}
          {(activeTab === 'all' || activeTab === 'recycle') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                  📦
                </span>
                <h4 className="font-bold text-gray-900 text-sm">종이류 및 종이팩</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li><strong>상자·신문</strong>: 테이프, 택배 송장, 스테이플러 철심을 제거하고 묶어서 배출.</li>
                <li><strong>우유팩·주스팩(종이팩)</strong>: 내부 코팅 처리된 종이팩은 일반 종이와 재활용 공정이 다릅니다. 물로 헹구고 펼쳐 말린 뒤 일반 폐지와 구분하여 배출합니다.</li>
              </ul>
            </div>
          )}

          {/* 5. 불연성 쓰레기 (타지 않는 쓰레기) */}
          {(activeTab === 'all' || activeTab === 'general') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center font-bold text-sm">
                  🏺
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">불연성 쓰레기 (특수규격마대)</h4>
                  <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-semibold border border-red-200">
                    일반 종량제 봉투 배출 금지
                  </span>
                </div>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li><strong>대상 품목</strong>: 깨진 유리, 사기그릇, 도자기, 화분, 타일, 벽돌 등 불에 타지 않는 쓰레기.</li>
                <li><strong>배출 방법</strong>: 종량제 봉투 판매소(마트, 편의점)에서 <strong>천안시 불연성 전용 마대(쓰레기 마대)</strong>를 구입하여 담아 배출합니다.</li>
              </ul>
            </div>
          )}

          {/* 6. 대형폐기물 및 폐가전 */}
          {(activeTab === 'all' || activeTab === 'special') && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-2xs space-y-2.5">
              <div className="flex items-center space-x-2">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                  🛋️
                </span>
                <h4 className="font-bold text-gray-900 text-sm">대형폐기물 & 대형가전</h4>
              </div>
              <ul className="text-xs text-gray-600 space-y-1.5 pl-2 list-disc list-outside leading-relaxed">
                <li><strong>가구류(소파, 매트리스, 책상 등)</strong>: 천안시청 홈페이지(대형폐기물 신청) 또는 스마트폰 앱(여기로)에서 신고 후 납부필증 부착 배출, 또는 관할 행정복지센터에서 스티커 구입 부착.</li>
                <li><strong>폐가전제품(냉장고, 세탁기, TV 등)</strong>: 폐가전 무상방문수거 서비스(전국 콜센터 1599-0903)를 이용하면 수수료 없이 무료로 집 앞 방문 수거가 가능합니다.</li>
              </ul>
            </div>
          )}
        </div>

        {/* 하단 문의처 안내 */}
        <div className="bg-slate-100 rounded-xl p-4 text-xs text-gray-500 space-y-1 border border-slate-200">
          <p className="font-bold text-gray-700">📞 천안시 분리배출 문의처</p>
          <p>• 천안시청 청소행정과: 041-521-5423</p>
          <p>• 대형폐기물 / 무단투기 신고: 각 구청(동남구/서북구) 환경위생과</p>
        </div>
      </div>
    </div>
  );
}
