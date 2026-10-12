'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/core/utils/supabaseClient';

export default function AdminPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('관리자만 접근할 수 있습니다.');
        router.push('/');
        return;
      }
      
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
      if (profile?.role !== 'admin') {
        alert('관리자 권한이 없습니다.');
        router.push('/');
        return;
      }
      
      setIsAuthorized(true);
      fetchLocations();
    };
    checkAdmin();
  }, [router]);

  const fetchLocations = async () => {
    const { data } = await supabase.from('locations').select('*').order('id', { ascending: false });
    if (data) setLocations(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      alert('장소 이름과 지번/도로명 주소를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. 주소를 위도/경도로 자동 변환 (Geocoding API 호출)
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(address.trim())}`);
      const geoData = await res.json();

      const lat = geoData.lat || 36.8151;
      const lng = geoData.lng || 127.1139;

      // 2. Supabase DB에 등록
      const { error } = await supabase.from('locations').insert([
        {
          name: name.trim(),
          address: address.trim(),
          lat: lat,
          lng: lng
        }
      ]);

      if (error) {
        alert('DB 등록 중 오류: ' + error.message);
      } else {
        alert(
          geoData.isFallback
            ? `장소가 등록되었습니다.\n(상세 번지수 위치 확인이 어려워 천안시 중심 좌표로 설정되었습니다.)`
            : `🎉 새로운 배출 장소가 성공적으로 지도에 등록되었습니다!\n(좌표: 위도 ${lat.toFixed(4)}, 경도 ${lng.toFixed(4)})`
        );
        setName('');
        setAddress('');
        fetchLocations();
      }
    } catch (err: any) {
      alert('주소 변환 및 등록 중 오류가 발생했습니다: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 장소를 삭제하시겠습니까?')) return;
    await supabase.from('locations').delete().eq('id', id);
    fetchLocations();
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-12">
      <div className="p-4 bg-white shadow-xs flex items-center justify-between border-b sticky top-0 z-10">
        <div className="flex items-center">
          <Link href="/" className="text-gray-500 hover:text-gray-800 mr-3 p-1">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h2 className="text-lg font-bold text-gray-900">⚙️ 관리자 - 배출 장소 관리</h2>
        </div>
        <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-1 rounded-md">
          관리자 모드
        </span>
      </div>

      <div className="p-5 space-y-6">
        {/* 장소 등록 폼 */}
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">새 배출 장소 등록</h3>
            <span className="text-[11px] text-primary-600 bg-primary-50 px-2 py-0.5 rounded font-semibold border border-primary-200">
              📍 지번주소 자동 변환
            </span>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-700">장소 명칭</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="예: 신부동 제1클린하우스 (단국대 앞)"
              className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500 focus:bg-white transition"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold text-gray-700">지번 주소 또는 도로명 주소</label>
              <span className="text-[11px] text-gray-400">위도/경도 입력 불필요</span>
            </div>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="예: 천안시 동남구 신부동 456-1 또는 단대로 119"
              className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-500 focus:bg-white transition"
              required
            />
            <p className="text-[11px] text-gray-400 pt-0.5">
              💡 입력하신 지번/도로명 주소는 시스템이 GPS 지도 좌표로 자동 계산하여 지도에 마커로 띄웁니다.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl shadow-xs transition text-sm disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>주소 좌표 변환 및 등록 중...</span>
              </>
            ) : (
              <span>지도에 장소 등록하기</span>
            )}
          </button>
        </form>

        {/* 등록된 장소 목록 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-bold text-gray-900 text-sm">등록된 배출 장소 목록</h3>
            <span className="text-xs text-gray-500 font-medium">총 {locations.length}개</span>
          </div>

          <div className="space-y-2.5">
            {locations.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-6 bg-white rounded-xl border border-gray-100">
                등록된 장소가 없습니다.
              </p>
            ) : (
              locations.map(loc => (
                <div key={loc.id} className="p-4 bg-white rounded-xl shadow-2xs border border-gray-100 flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 text-sm">{loc.name}</h4>
                    <p className="text-xs text-gray-600">{loc.address}</p>
                    <span className="inline-block bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded font-mono">
                      GPS: {loc.lat?.toFixed(4)}, {loc.lng?.toFixed(4)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(loc.id)}
                    className="text-red-500 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ml-2"
                  >
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
