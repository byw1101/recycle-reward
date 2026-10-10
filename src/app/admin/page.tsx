'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [locations, setLocations] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 관리자 권한 확인
    const user = localStorage.getItem('user');
    if (!user || JSON.parse(user).role !== 'admin') {
      alert('관리자만 접근할 수 있습니다.');
      router.push('/');
      return;
    }
    setIsAuthorized(true);

    const saved = localStorage.getItem('locations');
    if (saved) {
      setLocations(JSON.parse(saved));
    } else {
      const defaultLocs = [
        { id: 1, name: '단국대 학생회관 앞 쓰레기장', address: '경기 용인시 수지구 죽전로 152', lat: 37.3216, lng: 127.1268 },
        { id: 2, name: '기숙사 진리관 분리수거장', address: '경기 용인시 수지구 죽전로 152', lat: 37.3220, lng: 127.1275 }
      ];
      setLocations(defaultLocs);
      localStorage.setItem('locations', JSON.stringify(defaultLocs));
    }
  }, [router]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address || !lat || !lng) return alert('모든 값을 입력하세요');
    
    const newLoc = { id: Date.now(), name, address, lat: parseFloat(lat), lng: parseFloat(lng) };
    const updated = [...locations, newLoc];
    setLocations(updated);
    localStorage.setItem('locations', JSON.stringify(updated));
    alert('새로운 배출 장소가 등록되었습니다!');
    setName(''); setAddress(''); setLat(''); setLng('');
  };

  const handleDelete = (id: number) => {
    if(!confirm('정말 삭제하시겠습니까?')) return;
    const updated = locations.filter(l => l.id !== id);
    setLocations(updated);
    localStorage.setItem('locations', JSON.stringify(updated));
  };

  if (!isAuthorized) return null;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-10">
      <div className="p-4 bg-white shadow-sm flex items-center border-b">
        <h2 className="text-lg font-bold text-gray-800">⚙️ 관리자 - 배출 장소 관리</h2>
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
           <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 rounded-xl hover:bg-primary-700 transition">지도에 등록하기</button>
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
