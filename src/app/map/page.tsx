'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { supabase } from '@/core/utils/supabaseClient';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(m => m.Popup), { ssr: false });

export default function MapPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Leaflet 기본 CSS 로드
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // DB에서 장소 데이터 가져오기
    const fetchLocations = async () => {
      const { data } = await supabase.from('locations').select('*');
      if (data && data.length > 0) {
        setLocations(data);
      } else {
        // DB가 비어있을 경우 보여줄 기본 더미 데이터
        setLocations([
          { id: 1, name: '단국대 학생회관 앞 쓰레기장', address: '경기 용인시 수지구 죽전로 152', lat: 37.3216, lng: 127.1268 },
          { id: 2, name: '기숙사 진리관 분리수거장', address: '경기 용인시 수지구 죽전로 152', lat: 37.3220, lng: 127.1275 }
        ]);
      }
    };
    
    fetchLocations();
  }, []);

  const icon = useMemo(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet');
      return new L.Icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
    }
    return null;
  }, []);

  return (
    <div className="flex flex-col min-h-full bg-slate-50">
      <div className="p-4 bg-white shadow-sm flex items-center z-10 relative">
        <Link href="/" className="text-gray-500 mr-4">
           <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <h2 className="text-lg font-bold text-gray-800">배출 장소 안내 (DB)</h2>
      </div>

      <div className="w-full h-80 bg-gray-200 relative z-0">
        {isClient && icon && (
          <MapContainer 
            center={[37.3216, 127.1268]} 
            zoom={15} 
            style={{ width: '100%', height: '100%' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {locations.map((loc) => (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={icon}>
                <Popup>
                  <strong className="text-sm">{loc.name}</strong><br/>
                  <span className="text-xs text-gray-500">{loc.address}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}
      </div>

      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="font-bold text-gray-700 mb-3 px-1">등록된 배출 장소 목록</h3>
        <div className="space-y-3">
          {locations.map(loc => (
            <div key={loc.id} className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-start">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mr-3 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{loc.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{loc.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
