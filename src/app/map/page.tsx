'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useKakaoLoader, Map, MapMarker } from 'react-kakao-maps-sdk';
import { supabase } from '@/core/utils/supabaseClient';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function MapPage() {
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'd2614b7fbe124fc4d7968316a1df117c';
  
  const [loading, error] = useKakaoLoader({
    appkey: kakaoAppKey,
    libraries: ['services', 'clusterer'],
  });

  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<any | null>(null);

  useEffect(() => {
    // DB에서 장소 데이터 가져오기
    const fetchLocations = async () => {
      const { data } = await supabase.from('locations').select('*').order('id', { ascending: false });
      if (data && data.length > 0) {
        setLocations(data);
        setSelectedLoc(data[0]); // 첫 번째 장소 선택
      } else {
        // 기본 천안시 더미 데이터 (단국대 및 신부동)
        const defaultLocs = [
          { id: 1, name: '단국대 학생회관 앞 스마트클린하우스', address: '충남 천안시 동남구 단대로 119', lat: 36.8335, lng: 127.1687 },
          { id: 2, name: '신부동 행정복지센터 인근 수거거점', address: '충남 천안시 동남구 신부동 456-1', lat: 36.8188, lng: 127.1563 }
        ];
        setLocations(defaultLocs);
        setSelectedLoc(defaultLocs[0]);
      }
    };
    
    fetchLocations();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-4 bg-white shadow-2xs flex items-center justify-between z-10 relative border-b">
        <div className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-800 mr-3 p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-lg font-bold text-gray-900">배출 장소 안내 (카카오맵)</h2>
        </div>
        <span className="text-[11px] bg-yellow-100 text-yellow-900 font-bold px-2.5 py-1 rounded-full border border-yellow-200">
          Kakao Map
        </span>
      </div>

      {/* 카카오맵 뷰포트 영역 (고정 높이 360px 지정으로 렌더링 보장) */}
      <div className="w-full h-[360px] bg-slate-200 relative z-0 border-b overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-slate-100">
            <span className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-gray-500 font-semibold">카카오맵 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-red-500 bg-red-50">
            카카오맵을 불러올 수 없습니다. 카카오 디벨로퍼스 도메인 설정을 확인해주세요.
          </div>
        ) : (
          <Map
            center={{
              lat: Number(selectedLoc?.lat || 36.8335),
              lng: Number(selectedLoc?.lng || 127.1687),
            }}
            style={{ width: '100%', height: '360px' }}
            level={4} // 지도 확대 레벨
          >
            {locations.map((loc) => {
              const isSelected = selectedLoc?.id === loc.id;
              return (
                <MapMarker
                  key={loc.id}
                  position={{ lat: Number(loc.lat), lng: Number(loc.lng) }}
                  clickable={true}
                  onClick={() => setSelectedLoc(loc)}
                >
                  {isSelected && (
                    <div className="p-2 text-xs font-bold text-gray-900 bg-white rounded-lg shadow-md border border-gray-200 text-center min-w-[120px]">
                      <p className="text-primary-600 truncate">{loc.name}</p>
                      <p className="text-[10px] text-gray-500 font-normal truncate mt-0.5">{loc.address}</p>
                    </div>
                  )}
                </MapMarker>
              );
            })}
          </Map>
        )}
      </div>

      {/* 등록된 배출 장소 목록 */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-gray-800 text-sm">등록된 배출 장소 목록 ({locations.length}곳)</h3>
          <span className="text-xs text-gray-400">카드를 누르면 지도가 이동합니다</span>
        </div>

        <div className="space-y-2.5">
          {locations.map((loc) => {
            const isSelected = selectedLoc?.id === loc.id;
            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`p-4 bg-white rounded-xl shadow-2xs border transition cursor-pointer flex items-start justify-between ${
                  isSelected ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/20' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    isSelected ? 'bg-primary-600 text-white' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    📍
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{loc.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>
                  </div>
                </div>
                {isSelected && (
                  <span className="text-[11px] bg-primary-100 text-primary-700 font-bold px-2 py-0.5 rounded-full shrink-0">
                    선택됨
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
