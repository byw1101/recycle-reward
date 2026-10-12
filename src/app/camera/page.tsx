'use client';
import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import { verifyWasteUseCase } from '@/core/usecases/VerifyWasteUseCase';

export default function CameraPage() {
  const router = useRouter();
  const webcamRef = useRef<Webcam>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const handleUpload = async () => {
    if (!capturedImage) return;
    setIsUploading(true);
    
    try {
      // 캡처된 Base64 이미지 데이터를 UseCase로 전달
      const result = await verifyWasteUseCase.execute(capturedImage);
      if (result.success) {
        router.push(`/reward?points=${result.points}`);
      } else {
        alert(result.message);
        setCapturedImage(null);
      }
    } catch (e) {
      alert('인증 중 오류가 발생했습니다.');
      setCapturedImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 모바일 환경을 고려하여 후면 카메라(environment)를 기본으로 사용합니다.
  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "environment" 
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-full space-y-6 bg-black w-full">
      <div className="text-center text-white space-y-2 mb-4 mt-6">
        <h2 className="text-xl font-semibold">2단계: 쓰레기 봉투 촬영</h2>
        <p className="text-sm text-gray-300">
          {capturedImage ? '사진이 잘 나왔는지 확인해주세요.' : '내용물이 잘 보이도록 비닐 전체를 촬영해주세요.'}
        </p>
      </div>
      
      <div className="w-full aspect-[3/4] bg-gray-900 rounded-xl flex items-center justify-center relative overflow-hidden shadow-inner">
         {!capturedImage ? (
           <>
             <Webcam
               audio={false}
               ref={webcamRef}
               screenshotFormat="image/jpeg"
               videoConstraints={videoConstraints}
               className="w-full h-full object-cover"
             />
             {/* 촬영 가이드라인 표시 */}
             <div className="absolute inset-6 border-2 border-white/50 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                <span className="text-white/40 text-sm font-medium">여기에 쓰레기를 맞춰주세요</span>
             </div>
           </>
         ) : (
           <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
         )}
      </div>

      {!capturedImage ? (
        <div className="flex flex-col items-center">
            <button 
            onClick={capture}
            className="w-20 h-20 bg-transparent rounded-full border-4 border-gray-300 flex items-center justify-center active:bg-gray-800 transition relative mt-2"
            >
            <div className="w-16 h-16 bg-white rounded-full shadow-sm"></div>
            </button>
            <p className="text-gray-400 text-xs mt-3">셔터를 눌러 촬영하세요</p>
        </div>
      ) : (
        <div className="flex space-x-4 mt-2 w-full">
          <button 
            onClick={retake}
            disabled={isUploading}
            className="flex-1 py-4 bg-gray-700 text-white rounded-xl font-semibold hover:bg-gray-600 transition disabled:opacity-50"
          >
            다시 찍기
          </button>
          <button 
            onClick={handleUpload}
            disabled={isUploading}
            className="flex-1 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-500 transition disabled:opacity-50 flex justify-center items-center"
          >
            {isUploading ? (
              <span className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              '이 사진으로 인증'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
