'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';

export default function QRScanPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [isScanning, setIsScanning] = useState(true);

  // 시뮬레이션: 3초 후 자동으로 QR 코드를 인식했다고 가정하고 다음 단계(비닐 촬영)로 넘어갑니다.
  useEffect(() => {
    if (isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        // QR 스캔 성공 후 사진 촬영(비닐 자체 촬영) 페이지로 이동
        router.push('/camera');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isScanning, router]);

  return (
    <div className="p-6 flex flex-col items-center min-h-full bg-black w-full">
      <div className="w-full flex items-center justify-between mt-2 mb-4">
        <button onClick={() => router.push('/')} className="text-white p-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="text-center text-white space-y-2 mb-8">
        <h2 className="text-xl font-semibold">1단계: QR 코드 스캔</h2>
        <p className="text-sm text-gray-300">봉투에 부착된 QR 코드를 사각형 안에 맞춰주세요.</p>
      </div>
      
      <div className="w-full aspect-square bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner">
         <Webcam
           audio={false}
           ref={webcamRef}
           screenshotFormat="image/jpeg"
           videoConstraints={{ facingMode: "environment" }}
           className="w-full h-full object-cover opacity-70"
         />
         {/* QR 스캔 가이드라인 표시 */}
         <div className="absolute inset-10 border-4 border-primary-500/80 rounded-lg pointer-events-none flex items-center justify-center">
            {isScanning && (
               <div className="absolute w-full h-1 bg-primary-500/50 animate-bounce"></div>
            )}
         </div>
      </div>
      
      <div className="mt-10">
         <p className="text-white text-center font-medium">
             {isScanning ? 'QR 코드를 인식하는 중입니다...' : '인식 완료! 다음 단계로 이동합니다.'}
         </p>
      </div>
    </div>
  );
}
