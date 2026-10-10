'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/core/utils/supabaseClient';

export default function QRPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const scannerRef = useRef<any>(null);

  useEffect(() => {
    let html5QrCode: any;

    const startScanner = async () => {
      // html5-qrcode 동적 임포트 (SSR 에러 방지)
      const { Html5Qrcode } = await import('html5-qrcode');
      html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      try {
        await html5QrCode.start(
          { facingMode: "environment" }, // 후면 카메라 우선
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          async (decodedText: string) => {
            if (isProcessing) return;
            handleQRScan(decodedText, html5QrCode);
          },
          (errorMessage: any) => {
            // 스캔 실패(QR 없는 프레임)는 무시
          }
        );
      } catch (err) {
        setErrorMsg('카메라 권한을 허용해주세요.');
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, []);

  const handleQRScan = async (code: string, scanner: any) => {
    setIsProcessing(true);
    
    // 스캐너 일시정지 효과 (계속 스캔되는 것 방지)
    if (scanner && scanner.isScanning) {
      await scanner.pause(true);
    }

    try {
      // 1. 유저 확인
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setErrorMsg('로그인이 필요합니다.');
        if (scanner) scanner.resume();
        setIsProcessing(false);
        return;
      }

      // 2. DB에서 QR 정보 가져오기
      const { data: qrData, error: dbError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('code', code)
        .single();

      if (dbError || !qrData) {
        setErrorMsg(`등록되지 않은 QR입니다. [스캔내용: ${code}]`);
        setTimeout(() => { setErrorMsg(null); if(scanner) scanner.resume(); setIsProcessing(false); }, 3000);
        return;
      }

      // 3. 이미 사용된 QR인지 확인
      if (qrData.is_used) {
        setErrorMsg('이미 사용 처리된 QR 코드입니다.');
        setTimeout(() => { setErrorMsg(null); if(scanner) scanner.resume(); setIsProcessing(false); }, 3000);
        return;
      }

      // 4. QR 코드 사용 처리 (업데이트)
      const { error: updateError } = await supabase
        .from('qr_codes')
        .update({ 
          is_used: true, 
          used_at: new Date().toISOString(),
          used_by: session.user.id
        })
        .eq('code', code);

      if (updateError) {
        setErrorMsg('처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        setTimeout(() => { setErrorMsg(null); if(scanner) scanner.resume(); setIsProcessing(false); }, 3000);
        return;
      }

      // 5. 성공 처리 및 다음 화면 이동
      setSuccess(true);
      setErrorMsg(null);
      if (scanner && scanner.isScanning) {
        await scanner.stop();
      }
      
      setTimeout(() => {
        router.push('/camera');
      }, 1500);

    } catch (err: any) {
      setErrorMsg(`에러: ${err.message}`);
      setTimeout(() => { setErrorMsg(null); if(scanner) scanner.resume(); setIsProcessing(false); }, 3000);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black w-full relative overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent absolute top-0 left-0 w-full">
        <Link href="/" className="text-white p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-white font-bold">1단계: QR 스캔</h2>
        <div className="w-10"></div>
      </div>

      {/* 카메라 및 QR 스캐너 영역 */}
      <div className="flex-1 flex flex-col justify-center items-center w-full h-full relative pt-16 pb-20">
        
        {/* 에러 메시지 팝업 */}
        {errorMsg && (
          <div className="absolute top-20 z-50 bg-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* 성공 메시지 팝업 */}
        {success && (
          <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
             <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </div>
             <p className="text-white font-bold text-xl">QR 인증 성공!</p>
             <p className="text-gray-300 mt-2 text-sm">봉투 촬영 단계로 이동합니다...</p>
          </div>
        )}

        {/* 실제 카메라 화면 출력되는 DIV */}
        <div id="reader" className="w-full h-full object-cover"></div>

        {/* 가이드 오버레이 */}
        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
           {!success && (
             <>
                <div className="w-64 h-64 border-4 border-white/50 rounded-3xl relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-500 rounded-tl-2xl"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-500 rounded-tr-2xl"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-500 rounded-bl-2xl"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-500 rounded-br-2xl"></div>
                </div>
                <p className="text-white mt-8 font-medium tracking-wide bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm text-center">
                  {isProcessing ? '인증 정보 확인 중...' : '쓰레기 봉투에 부착된\nQR코드를 스캔해주세요'}
                </p>
             </>
           )}
        </div>
      </div>
    </div>
  );
}
