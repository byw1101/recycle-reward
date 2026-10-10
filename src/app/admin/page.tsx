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
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
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
    const { data } = await supabase.from('locations').select('*').order('id', { ascending: true });
    if (data) setLocations(data);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !lat || !lng) return alert('모든 값을 입력하세요');
    
    const { error } = await supabase.from('locations').insert([
      { name, address, lat: parseFloat(lat), lng: parseFloat(lng) }
    ]);
    
    if (error) {
      alert('오류: ' + error.message);
    } else {
      alert('새로운 배출 장소가 DB에 등록되었습니다!');
      setName(''); setAddress(''); setLat(''); setLng('');
      fetchLocations();
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('정말 삭제하시겠습니까?')) return;
    await supabase.from('locations').delete().eq('id', id);
    fetchLocations();
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-10">
      <div className="p-4 bg-white shadow-sm flex items-center border-b">
        <h2 className="text-lg font-bold text-gray-800">⚙️ 관리자 - 배출 장소 관리 (DB 연동됨)</h2>
      </div>

      <div className="p-6">
        <form onSubmit={handleAdd} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4 mb-6">
           <h3 className="font-bold text-gray-800 mb-2">새 장소 등록</h3>
           <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="장소 이름 (예: 정문 분리수거장)" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
           <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="상세 주소" className="w-full p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
           <div className="flex space-x-2">
              <input type="number" step="any" value={lat} onChange={e => setLat(e.target.value)} placeholder="위도 (예: 37.32)" className="w-1/2 p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
              <input type="number" step="any" value={lng} onChange={e => setLng(e.target.value)} placeholder="경도 (예: 127.12)" className="w-1/2 p-3 bg-slate-50 border border-gray-200 rounded-xl outline-none focus:border-primary-500" />
           </div>
           <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition">DB에 등록하기</button>
        </form>

        <h3 className="font-bold text-gray-800 mb-3 px-1">등록된 장소 목록 ({locations.length}개)</h3>
        <div className="space-y-3">
          {locations.map(loc => (
            <div key={loc.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{loc.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
                <p className="text-[10px] text-gray-400 mt-1">lat: {loc.lat}, lng: {loc.lng}</p>
              </div>
              <button onClick={() => handleDelete(loc.id)} className="text-red-500 bg-red-50 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition">삭제</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
