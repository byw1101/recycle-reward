'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useKakaoLoader, Map, MapMarker } from 'react-kakao-maps-sdk';
import { supabase } from '@/core/utils/supabaseClient';

declare global {
  interface Window {
    kakao: any;
  }
}

// 두 GPS 좌표 사이의 거리 계산 (Haversine 공식, 단위: km)
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 거리 단위 포맷 (1km 미만은 m, 이상은 km)
function formatDistance(distKm: number | null | undefined) {
  if (distKm == null || isNaN(distKm)) return null;
  if (distKm < 1) {
    return `${Math.round(distKm * 1000)}m`;
  }
  return `${distKm.toFixed(1)}km`;
}

export default function MapPage() {
  const kakaoAppKey = process.env.NEXT_PUBLIC_KAKAO_APP_KEY || 'd2614b7fbe124fc4d7968316a1df117c';
  const mapRef = useRef<any>(null);
  
  const [loading, error] = useKakaoLoader({
    appkey: kakaoAppKey,
    libraries: ['services', 'clusterer'],
  });

  const [rawLocations, setRawLocations] = useState<any[]>([]);
  const [sortedLocations, setSortedLocations] = useState<any[]>([]);
  const [selectedLoc, setSelectedLoc] = useState<any | null>(null);

  // 사용자 현재 GPS 위치 상태
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('위치 파악 중...');

  // 내 위치 기반 거리 계산 및 오름차순 정렬
  const sortLocationsByDistance = useCallback((locList: any[], pos: { lat: number; lng: number } | null) => {
    if (!pos) {
      setSortedLocations(locList);
      if (locList.length > 0 && !selectedLoc) setSelectedLoc(locList[0]);
      return;
    }

    const withDistance = locList.map(loc => {
      const dist = getDistanceKm(pos.lat, pos.lng, Number(loc.lat), Number(loc.lng));
      return { ...loc, distance: dist };
    });

    // 가장 가까운 순서대로 정렬 (거리 오름차순)
    withDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));

    setSortedLocations(withDistance);
    if (withDistance.length > 0) {
      setSelectedLoc(withDistance[0]); // 가장 가까운 장소를 기본 선택
    }
  }, [selectedLoc]);

  // GPS 위치 요청 함수
  const requestUserLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationStatus('GPS를 지원하지 않는 브라우저입니다.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('내 위치 확인 중...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserPos(coords);
        setIsLocating(false);
        setLocationStatus('내 위치 기준 가까운 순 정렬됨');
        sortLocationsByDistance(rawLocations, coords);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('위치 권한 미허용 (기본 순 정렬)');
        console.warn('Geolocation error:', err.message);
        sortLocationsByDistance(rawLocations, null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [rawLocations, sortLocationsByDistance]);

  // 초기 DB 장소 로드
  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase.from('locations').select('*').order('id', { ascending: false });
      let initialList: any[] = [];
      if (data && data.length > 0) {
        initialList = data;
      } else {
        initialList = [
          { id: 1, name: '단국대 학생회관 앞 스마트클린하우스', address: '충남 천안시 동남구 단대로 119', lat: 36.8335, lng: 127.1687 },
          { id: 2, name: '신부동 행정복지센터 인근 수거거점', address: '충남 천안시 동남구 신부동 456-1', lat: 36.8188, lng: 127.1563 },
          { id: 3, name: '불당동 행정복지센터 앞 분리배출함', address: '충남 천안시 서북구 불당동 1480', lat: 36.8119, lng: 127.1089 }
        ];
      }
      setRawLocations(initialList);
      sortLocationsByDistance(initialList, userPos);
    };

    fetchLocations();
    requestUserLocation();
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      {/* 상단 헤더 */}
      <div className="p-4 bg-white shadow-2xs flex items-center justify-between z-10 relative border-b">
        <div className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-800 mr-3 p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h2 className="text-lg font-bold text-gray-900">배출 장소 안내</h2>
            <p className="text-[11px] text-gray-500">{locationStatus}</p>
          </div>
        </div>

        {/* 내 위치 다시 측정 버튼 */}
        <button
          onClick={requestUserLocation}
          disabled={isLocating}
          className="bg-primary-50 hover:bg-primary-100 text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full border border-primary-200 transition flex items-center space-x-1 disabled:opacity-50"
        >
          <span>📍</span>
          <span>{isLocating ? '위치 측정중...' : '내 위치 갱신'}</span>
        </button>
      </div>

      {/* 카카오맵 뷰포트 영역 (고정 높이 400px 및 전체보기/내위치 제어 버튼) */}
      <div className="w-full h-[400px] bg-slate-200 relative z-0 border-b overflow-hidden">
        {loading ? (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-2 bg-slate-100">
            <span className="w-8 h-8 border-3 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-gray-500 font-semibold">카카오맵 로딩 중...</p>
          </div>
        ) : error ? (
          <div className="w-full h-full flex items-center justify-center p-4 text-center text-xs text-red-500 bg-red-50">
            카카오맵을 불러올 수 없습니다. 도메인 설정을 확인해주세요.
          </div>
        ) : (
          <>
            <Map
              center={{
                lat: Number(selectedLoc?.lat || userPos?.lat || 36.8335),
                lng: Number(selectedLoc?.lng || userPos?.lng || 127.1687),
              }}
              style={{ width: '100%', height: '400px' }}
              level={5}
              onCreate={(map) => {
                mapRef.current = map;
                // 초기 로드 시 모든 마커가 한눈에 보이도록 영역 자동 맞춤
                if (sortedLocations.length > 0 && window.kakao?.maps) {
                  const bounds = new window.kakao.maps.LatLngBounds();
                  sortedLocations.forEach((loc) => {
                    const lat = Number(loc.lat);
                    const lng = Number(loc.lng);
                    if (lat >= 36.7 && lat <= 36.9 && lng >= 127.0 && lng <= 127.3) {
                      bounds.extend(new window.kakao.maps.LatLng(lat, lng));
                    }
                  });
                  setTimeout(() => map.setBounds(bounds), 300);
                }
              }}
            >
              {/* 1. 내 현재 위치 마커 */}
              {userPos && (
                <MapMarker
                  position={{ lat: userPos.lat, lng: userPos.lng }}
                  image={{
                    src: 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                    size: { width: 24, height: 35 },
                  }}
                >
                  <div className="p-1.5 text-[11px] font-bold text-blue-800 bg-blue-50 rounded-md border border-blue-200 text-center">
                    📍 내 현재 위치
                  </div>
                </MapMarker>
              )}

              {/* 2. 등록된 쓰레기 배출 장소 마커들 */}
              {sortedLocations.map((loc, idx) => {
                const isSelected = selectedLoc?.id === loc.id;
                const isNearest = idx === 0 && userPos != null;
                return (
                  <MapMarker
                    key={loc.id}
                    position={{ lat: Number(loc.lat), lng: Number(loc.lng) }}
                    clickable={true}
                    onClick={() => setSelectedLoc(loc)}
                  >
                    {isSelected && (
                      <div className="p-2 text-xs font-bold text-gray-900 bg-white rounded-lg shadow-md border border-gray-200 text-center min-w-[130px]">
                        <div className="flex items-center justify-center space-x-1">
                          {isNearest && <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1 rounded">가장 가까움</span>}
                          <p className="text-primary-600 truncate">{loc.name}</p>
                        </div>
                        <p className="text-[10px] text-gray-500 font-normal truncate mt-0.5">{loc.address}</p>
                        {loc.distance != null && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-0.5">
                            내 위치에서 약 {formatDistance(loc.distance)}
                          </p>
                        )}
                      </div>
                    )}
                  </MapMarker>
                );
              })}
            </Map>

            {/* 지도 위 플로팅 '전체 한눈에 보기' 컨트롤 버튼 */}
            <div className="absolute top-3 right-3 z-10 flex flex-col space-y-1.5">
              <button
                onClick={() => {
                  if (mapRef.current && window.kakao?.maps && sortedLocations.length > 0) {
                    const bounds = new window.kakao.maps.LatLngBounds();
                    sortedLocations.forEach((loc) => {
                      const lat = Number(loc.lat);
                      const lng = Number(loc.lng);
                      if (lat >= 36.7 && lat <= 36.9 && lng >= 127.0 && lng <= 127.3) {
                        bounds.extend(new window.kakao.maps.LatLng(lat, lng));
                      }
                    });
                    mapRef.current.setBounds(bounds);
                  }
                }}
                className="bg-white/95 hover:bg-white text-gray-800 text-[11px] font-extrabold px-3 py-2 rounded-xl shadow-md border border-gray-200/80 transition flex items-center space-x-1 backdrop-blur-xs"
              >
                <span>🌐 전체 한눈에 보기</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 등록된 배출 장소 목록 (거리순 자동 정렬) */}
      <div className="p-4 flex-1 overflow-y-auto space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-bold text-gray-800 text-sm">
              가까운 배출 장소 ({sortedLocations.length}곳)
            </h3>
            <p className="text-[11px] text-gray-400">
              {userPos ? '현재 내 위치에서 가장 가까운 순서로 정렬되었습니다.' : '위치 권한을 허용하시면 가장 가까운 순서로 자동 정렬됩니다.'}
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {sortedLocations.map((loc, index) => {
            const isSelected = selectedLoc?.id === loc.id;
            const isNearest = index === 0 && userPos != null;
            const distanceText = formatDistance(loc.distance);

            return (
              <div
                key={loc.id}
                onClick={() => setSelectedLoc(loc)}
                className={`p-4 bg-white rounded-xl shadow-2xs border transition cursor-pointer flex items-start justify-between ${
                  isSelected
                    ? 'border-primary-500 ring-2 ring-primary-100 bg-primary-50/20'
                    : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      isNearest
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {isNearest ? '⭐' : '📍'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                      <h4 className="font-bold text-gray-900 text-sm">{loc.name}</h4>
                      {isNearest && (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-1.5 py-0.2 rounded border border-emerald-300">
                          가장 가까움
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{loc.address}</p>

                    {/* 거리 표시 */}
                    {distanceText && (
                      <div className="flex items-center space-x-1 mt-1 text-[11px] font-bold text-emerald-700">
                        <span>🚶 내 위치에서</span>
                        <span className="underline decoration-emerald-400">{distanceText}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1 shrink-0 ml-2">
                  {distanceText && (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {distanceText}
                    </span>
                  )}
                  {isSelected && (
                    <span className="text-[10px] bg-primary-100 text-primary-700 font-bold px-1.5 py-0.5 rounded-full">
                      지도 선택됨
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
