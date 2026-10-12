'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function MyRewardsPage() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // 천안사랑카드 전환 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertAmount, setConvertAmount] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }
    setUserId(session.user.id);
    
    // 내 포인트 가져오기
    const { data: profile } = await supabase.from('profiles').select('points').eq('id', session.user.id).single();
    if (profile) setPoints(profile.points);

    // 리워드 히스토리 가져오기
    const { data: records } = await supabase
      .from('reward_history')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });
    if (records) setHistory(records);
    
    setLoading(false);
  };

  const handleOpenModal = () => {
    setConvertAmount(points.toString());
    setIsModalOpen(true);
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(convertAmount, 10);

    if (isNaN(amount) || amount <= 0) {
      alert('올바른 전환 포인트를 입력해주세요.');
      return;
    }
    if (amount > points) {
      alert('보유하신 잔여 포인트보다 많은 금액은 전환할 수 없습니다.');
      return;
    }
    if (amount < 100) {
      alert('최소 100P 이상부터 천안사랑카드로 전환 가능합니다.');
      return;
    }
    if (!cardNumber.trim()) {
      alert('천안사랑카드 번호를 입력해주세요.');
      return;
    }

    setIsConverting(true);
    try {
      if (!userId) throw new Error('로그인이 필요합니다.');

      const newPoints = points - amount;

      // 1. 프로필 포인트 차감 업데이트
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', userId);
      if (profileError) throw profileError;

      // 2. 히스토리 기록 (차감 내역)
      const maskedCard = cardNumber.length > 4 ? `****-${cardNumber.slice(-4)}` : cardNumber;
      const { error: historyError } = await supabase.from('reward_history').insert([
        {
          user_id: userId,
          title: `천안사랑카드 포인트 전환 (${maskedCard})`,
          points: -amount,
        }
      ]);
      if (historyError) throw historyError;

      alert(`🎉 ${amount.toLocaleString()} 포인트가 천안사랑카드로 성공적으로 전환 신청되었습니다!`);
      setIsModalOpen(false);
      setCardNumber('');
      loadData();
    } catch (err: any) {
      alert(`전환 중 오류가 발생했습니다: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50 relative pb-10">
      {/* 상단 헤더 */}
      <div className="p-4 bg-primary-600 text-white flex items-center justify-between border-b border-primary-500">
        <div className="flex items-center">
          <Link href="/" className="text-primary-100 hover:text-white mr-3 p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-lg font-bold">내 리워드</h2>
        </div>
        <span className="text-xs bg-primary-700/80 px-2.5 py-1 rounded-full text-primary-100 font-medium">
          천안시 연계
        </span>
      </div>

      {/* 포인트 보유 현황 및 전환 버튼 영역 */}
      <div className="bg-primary-600 text-white px-6 pb-12 pt-6 rounded-b-3xl shadow-md space-y-4">
        <div>
          <p className="text-primary-100 text-xs mb-1 font-medium">사용 가능한 에코포인트</p>
          <div className="flex items-baseline space-x-1.5">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight">{loading ? '...' : points.toLocaleString()}</h1>
            <span className="text-2xl font-bold">P</span>
          </div>
        </div>

        {/* 🌟 천안사랑카드 포인트 전환 버튼 */}
        <button
          onClick={handleOpenModal}
          disabled={loading || points < 100}
          className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>💳 천안사랑카드 포인트로 전환</span>
          <span className="text-xs bg-slate-900/10 px-2 py-0.5 rounded font-bold">1:1 즉시</span>
        </button>
      </div>

      {/* 최근 내역 카드 */}
      <div className="p-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xs p-5 border border-gray-100 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800 text-sm">최근 적립 / 전환 내역</h3>
            <span className="text-xs text-gray-400 font-medium">총 {history.length}건</span>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-xs text-gray-400 py-6">내역을 불러오는 중...</p>
            ) : history.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6">아직 적립 내역이 없습니다.</p>
            ) : (
              history.map(record => {
                const isNegative = record.points < 0;
                return (
                  <div key={record.id} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs">{record.title}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(record.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`font-black text-sm ${isNegative ? 'text-amber-600' : 'text-primary-600'}`}>
                      {isNegative ? `${record.points.toLocaleString()} P` : `+${record.points.toLocaleString()} P`}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* 🌟 천안사랑카드 포인트 전환 팝업 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            {/* 모달 헤더 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                  💳
                </div>
                <div>
                  <h3 className="font-black text-base text-gray-900 leading-tight">천안사랑카드 포인트 전환</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">에코포인트를 지역화폐로 1:1 충전</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* 안내 배너 */}
            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold">💡 1P = 1원 가치</span><br />
              전환 신청 시 등록된 천안사랑카드로 캐시백 포인트가 실시간 충전되어 천안 시내 가맹점에서 바로 결제 가능합니다.
            </div>

            {/* 입력 폼 */}
            <form onSubmit={handleConvert} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  전환할 포인트 (보유: {points.toLocaleString()}P)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={convertAmount}
                    onChange={(e) => setConvertAmount(e.target.value)}
                    max={points}
                    min={100}
                    placeholder="전환할 금액 입력"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm font-bold text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                  <button
                    type="button"
                    onClick={() => setConvertAmount(points.toString())}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-lg"
                  >
                    전액
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  천안사랑카드 번호 16자리
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="예: 9440-1234-5678-9012"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm text-gray-900 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                />
              </div>

              <div className="pt-2 flex space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold text-xs transition"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={isConverting}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 py-3 rounded-xl font-black text-xs transition shadow-sm disabled:opacity-50"
                >
                  {isConverting ? '처리 중...' : '전환 신청하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
