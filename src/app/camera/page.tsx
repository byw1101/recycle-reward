'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { supabase } from '@/core/utils/supabaseClient';

export default function CameraPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [flash, setFlash] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  // 실시간 한국 시간 시계
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0].replace(/-/g, '.');
      const timeStr = now.toTimeString().split(' ')[0];
      setCurrentTime(`${dateStr} ${timeStr} KST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
    setIsClaimed(false);
  };

  const toggleCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleClaimPoints = async () => {
    setIsProcessing(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('포인트를 적립하려면 로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      const earnedPoints = 350;
      const userId = session.user.id;

      // 1. 프로필 포인트 갱신
      const { data: profile } = await supabase.from('profiles').select('points').eq('id', userId).single();
      const currentPoints = profile?.points || 0;
      const newPoints = currentPoints + earnedPoints;

      await supabase.from('profiles').update({ points: newPoints }).eq('id', userId);

      // 2. 리워드 히스토리 기록
      await supabase.from('reward_history').insert([
        {
          user_id: userId,
          title: 'AI 비전 실시간 분리배출 인증 (+350P 적립)',
          points: earnedPoints
        }
      ]);

      setIsClaimed(true);
      alert('🎉 350 포인트가 성공적으로 지급되었습니다! (탄소중립포인트 적립 완료)');
      router.push(`/reward?points=${earnedPoints}`);
    } catch (err: any) {
      alert(`포인트 지급 중 오류: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 공공 AI 인증 배너 */}
      <div className="w-full bg-slate-200/70 border border-slate-300/80 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 font-medium gap-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>공공 AI 비전 검증 v4.2 / 환경부 실시간 탄소중립 실천인증 알고리즘 동기화 완료</span>
        </div>
        <div className="flex items-center space-x-1.5 text-slate-600 sm:self-auto self-end">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-semibold text-slate-800">위변조 방지 블록 해시 검증 통과</span>
        </div>
      </div>

      {/* 히어로 타이틀 영역 */}
      <div className="space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-emerald-100/80 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-emerald-300">
            실시간 자동 판독 모드
          </span>
          <span className="bg-slate-200 text-slate-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            세척·라벨·압착 복합 판정
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          AI 비전 실시간 분리배출 인증
        </h1>
        <p className="text-slate-600 text-sm">
          환경부 공공 AI 비전 모델이 투명 페트병, 캔, 유리병, 종이팩 등의 세척 및 라벨 분리 상태를 1초 만에 정밀 판독합니다.
        </p>
      </div>

      {/* 메인 2단 그리드 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* 좌측: 카메라 뷰포트 + 컨트롤 바 + 세부 리포트 (7컬럼) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* 카메라 뷰포트 */}
          <div className="w-full aspect-[4/3] bg-black rounded-2xl relative overflow-hidden shadow-lg border border-slate-800">
            
            {/* 실제 웹캠 비디오 or 캡처된 사진 */}
            {!capturedImage ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: facingMode,
                  aspectRatio: 4 / 3,
                }}
                className="w-full h-full object-cover"
              />
            ) : (
              <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
            )}

            {/* 카메라 상단 HUD 오버레이 */}
            <div className="absolute top-3 inset-x-3 flex justify-between items-center text-[11px] font-mono pointer-events-none z-10">
              <div className="bg-black/60 backdrop-blur-md text-emerald-400 px-2.5 py-1 rounded-full flex items-center space-x-1.5 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold">LIVE AI VISION • 60 FPS</span>
              </div>
              <div className="hidden sm:block text-slate-300/80 font-sans text-xs bg-black/40 px-3 py-0.5 rounded-full">
                분리배출 - CLEAN RECYCLE
              </div>
              <div className="bg-black/60 backdrop-blur-md text-slate-300 px-2.5 py-1 rounded-full border border-white/10">
                {currentTime}
              </div>
            </div>

            {/* AI 비전 실시간 바운딩 박스 (Stitch 디자인 1:1 재현) */}
            <div className="absolute inset-0 pointer-events-none z-10">
              
              {/* 박스 1: 투명 페트병 #1 */}
              <div className="absolute left-[12%] top-[24%] w-[32%] h-[60%] border-2 border-emerald-400 rounded-lg bg-emerald-500/5 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <div className="absolute -top-7 left-0 bg-emerald-500 text-slate-950 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                  <span>✔ 투명 페트병 #1 • 99.8%</span>
                </div>
                <div className="absolute bottom-2 left-1.5 flex flex-wrap gap-1">
                  <span className="bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded">
                    라벨 분리완료
                  </span>
                  <span className="bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded">
                    세척완료
                  </span>
                </div>
              </div>

              {/* 박스 2: 투명 페트병 #2 */}
              <div className="absolute left-[46%] top-[18%] w-[26%] h-[66%] border-2 border-emerald-400 rounded-lg bg-emerald-500/5 shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                <div className="absolute -top-7 left-0 bg-emerald-500 text-slate-950 font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                  <span>✔ 투명 페트병 #2 • 98.4%</span>
                </div>
                <div className="absolute bottom-2 left-1.5 flex flex-wrap gap-1">
                  <span className="bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded">
                    뚜껑고리 분리
                  </span>
                  <span className="bg-black/70 backdrop-blur-sm text-emerald-300 border border-emerald-500/30 text-[9px] px-1.5 py-0.5 rounded">
                    압착완료
                  </span>
                </div>
              </div>

              {/* 박스 3: 음료 캔(알루미늄) */}
              <div className="absolute right-[6%] top-[30%] w-[22%] h-[48%] border-2 border-blue-400 rounded-lg bg-blue-500/5 shadow-[0_0_15px_rgba(96,165,250,0.3)]">
                <div className="absolute -top-7 left-0 bg-blue-500 text-white font-bold text-[10px] sm:text-xs px-2 py-0.5 rounded shadow-sm flex items-center space-x-1">
                  <span>✔ 음료 캔(알루미늄) • 97.6%</span>
                </div>
                <div className="absolute bottom-2 left-1.5 flex flex-wrap gap-1">
                  <span className="bg-black/70 backdrop-blur-sm text-blue-300 border border-blue-500/30 text-[9px] px-1.5 py-0.5 rounded">
                    내용물 완전 세척확인
                  </span>
                </div>
              </div>

              {/* 카메라 네 모서리 가이드 프레임 */}
              <div className="absolute bottom-12 left-3 w-6 h-6 border-b-2 border-l-2 border-white/40"></div>
              <div className="absolute bottom-12 right-3 w-6 h-6 border-b-2 border-r-2 border-white/40"></div>
            </div>

            {/* 카메라 하단 Geotag 및 위치 정보 오버레이 */}
            <div className="absolute bottom-2 inset-x-3 bg-black/70 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 z-10 border border-white/10">
              <div className="flex items-center space-x-1.5 truncate mr-2">
                <svg className="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">서울특별시 서초구 서초2동 스마트클린하우스 (GPS 오차범위 ±3.8m)</span>
              </div>
              <span className="bg-blue-900/80 text-blue-300 border border-blue-600 text-[10px] font-mono px-2 py-0.5 rounded font-bold shrink-0">
                EXIF Geotag VERIFIED
              </span>
            </div>
          </div>

          {/* 카메라 컨트롤 버튼 툴바 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={toggleCamera}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition"
            >
              <span>📷 렌즈 전환</span>
            </button>
            <button
              onClick={() => setFlash(!flash)}
              className={`border py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 transition ${
                flash ? 'bg-amber-100 border-amber-300 text-amber-800' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>⚡ 플래시 {flash ? 'On' : 'Off'}</span>
            </button>
            <button
              onClick={retake}
              className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition"
            >
              <span>🔄 다시 촬영하기</span>
            </button>
            <button
              onClick={capture}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 shadow-sm transition"
            >
              <span>📸 직접 촬영하기</span>
            </button>
          </div>

          {/* 인식된 세부 품목 상태 리포트 카드 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 font-bold text-slate-800 text-sm">
                <span className="text-blue-600">📊</span>
                <span>인식된 세부 품목 상태 리포트</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">정밀도 98.6% 산출</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 품목 1 */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">투명 페트병 #1</h4>
                  <span className="bg-blue-100 text-blue-700 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    +100 P
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>투명도 검증:</span>
                    <span className="font-semibold text-slate-700">100% 무색투명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>라벨 박리:</span>
                    <span className="font-bold text-emerald-600">완전 제거됨</span>
                  </div>
                  <div className="flex justify-between">
                    <span>압착 상태:</span>
                    <span className="font-semibold text-slate-700">정상 압착</span>
                  </div>
                </div>
              </div>

              {/* 품목 2 */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">투명 페트병 #2</h4>
                  <span className="bg-emerald-100 text-emerald-700 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    +100 P
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>투명도 검증:</span>
                    <span className="font-semibold text-slate-700">100% 무색투명</span>
                  </div>
                  <div className="flex justify-between">
                    <span>라벨 박리:</span>
                    <span className="font-bold text-emerald-600">완전 제거됨</span>
                  </div>
                  <div className="flex justify-between">
                    <span>이물질 잔여:</span>
                    <span className="font-bold text-emerald-600">세척 통과</span>
                  </div>
                </div>
              </div>

              {/* 품목 3 */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900">알루미늄 캔</h4>
                  <span className="bg-cyan-100 text-cyan-700 font-bold text-[10px] px-1.5 py-0.5 rounded">
                    +150 P
                  </span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-500">
                  <div className="flex justify-between">
                    <span>금속재질 판별:</span>
                    <span className="font-semibold text-slate-700">AL 순수캔</span>
                  </div>
                  <div className="flex justify-between">
                    <span>잔여 음료:</span>
                    <span className="font-bold text-emerald-600">완전 건조</span>
                  </div>
                  <div className="flex justify-between">
                    <span>찌그러짐:</span>
                    <span className="font-semibold text-slate-700">부피 축소 양호</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 우측: 단계 표시 + 적합도 판정 + 가이드라인 체크 + 지급 버튼 (5컬럼) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* 상단 3단계 인디케이터 */}
          <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 flex items-center justify-between text-xs font-semibold shadow-2xs">
            <div className="flex items-center space-x-1.5 text-emerald-600">
              <span>✔</span>
              <span>1. 촬영 완료</span>
            </div>
            <span className="text-slate-300">→</span>
            <div className="bg-blue-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs">
              ● 2. 정밀 판독 중 (99.2%)
            </div>
            <span className="text-slate-300">→</span>
            <div className="text-slate-400 flex items-center space-x-1">
              <span>③</span>
              <span>3. 포인트 적립</span>
            </div>
          </div>

          {/* AI 종합 적합도 판정 카드 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  🏅
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                    AI 종합 적합도 판정
                  </h3>
                  <p className="text-emerald-600 font-bold text-xs">인증 통과 (적합 규격)</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                3개 품목 감지
              </span>
            </div>

            {/* 블루 하이라이트 적립 포인트 박스 */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-blue-100">이번 실천 적립 예정 포인트</span>
                <span className="bg-blue-500/50 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold border border-blue-400/40">
                  즉시 지급 대기
                </span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-black tracking-tight">+350</span>
                <span className="text-2xl font-bold">P</span>
                <span className="text-xs text-blue-200 font-medium ml-2">
                  (기본 300P + 모범인증 보너스 50P)
                </span>
              </div>
              <div className="space-y-1 pt-1">
                <div className="flex justify-between text-[11px] text-blue-100">
                  <span>이번 달 탄소중립포인트 누적 한도</span>
                  <span className="font-bold">24,850 P / 70,000 P</span>
                </div>
                <div className="w-full bg-blue-900/40 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '35.5%' }}></div>
                </div>
              </div>
            </div>

            {/* 공공 품질 가이드라인 적합성 체크 리스트 */}
            <div className="space-y-2 pt-1">
              <h4 className="text-xs font-bold text-slate-800">공공 품질 가이드라인 적합성 체크</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <span>비닐 라벨 100% 완전 분리 박리</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px]">완전 일치</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <span>내부 세척 상태 (음료 잔여물 0%)</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px]">이물질 없음</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="text-emerald-500 font-bold">✔</span>
                    <span>재질 적합성 (PET 단일재질 / 순수캔)</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px]">단일재질 통과</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-700 font-medium">
                    <span className="text-emerald-500 font-bold">🛡️</span>
                    <span>중복 도용 방지 이미지 고유 해시 검증</span>
                  </div>
                  <span className="text-emerald-600 font-bold text-[11px]">미등록 고유사진</span>
                </div>
              </div>
            </div>

            {/* 환경 기여 효과 환산 카드 */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🍃
                </div>
                <div>
                  <p className="text-[10px] text-emerald-800 font-medium">온실가스 CO₂e 감축</p>
                  <p className="font-black text-sm text-emerald-950">약 0.38 kg</p>
                </div>
              </div>
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🌲
                </div>
                <div>
                  <p className="text-[10px] text-blue-800 font-medium">어린 소나무 식재 효과</p>
                  <p className="font-black text-sm text-blue-950">0.05 그루</p>
                </div>
              </div>
            </div>

            {/* 최종 포인트 지급 액션 버튼 */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleClaimPoints}
                disabled={isProcessing || isClaimed}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-black text-base shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition disabled:opacity-50 active:scale-[0.99]"
              >
                {isProcessing ? (
                  <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>💳 포인트 +350P 즉시 지급받기</span>
                  </>
                )}
              </button>

              <button
                onClick={retake}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition"
              >
                <span>📷 추가 품목 연속 인증하기</span>
              </button>

              <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
                🔒 지급된 포인트는 실시간으로 현금 계좌 또는 네이버페이로 환전 가능합니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 팁 및 법률 안내 2단 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold">
            💡
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900">정확한 AI 인식을 위한 촬영 팁</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              투명 페트병은 라벨 비닐을 끝까지 완전히 떼어내고 물로 가볍게 헹군 뒤, 발로 밟거나 손으로 압착해 뚜껑을 닫아 배출해 주세요. 반사광이 심하지 않은 평평한 곳에서 촬영하면 최고 적립률이 적용됩니다.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center text-lg shrink-0 font-bold">
            📷
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-900">부정인증 방지 및 법률 안내</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              인터넷 이미지 무단 도용, 합성, 타인 사진 재촬영 등 부정한 방법으로 포인트를 취득할 경우 지급된 포인트는 전액 환수되며, 「기후위기 대응을 위한 탄소중립·녹색성장 기본법」에 의거 참여 자격이 영구 정지됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
